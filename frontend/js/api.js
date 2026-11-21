// Frontend backend bilan FAQAT shu fayl orqali gaplashadi.
// USE_MOCK = true  -> js/data/ dagi namunaviy ma'lumotlar (hozirgi holat)
// USE_MOCK = false -> haqiqiy backend (endpointlar: ../backend/README.md)
import { USE_MOCK, API_URL } from './config.js'

import { PAYMENTS } from './data/payments.js'
import { HOMEWORK } from './data/homework.js'
import { PRODUCTS } from './data/products.js'
import { NOTIFICATIONS } from './data/notifications.js'
import { RANKING } from './data/ranking.js'
import { EXTRA_COURSES } from './data/extraCourses.js'

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

/* ---------- Haqiqiy backend ---------- */

let token = ''

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const init = { ...options, headers }
  if (options.json !== undefined) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(options.json)
  }
  const response = await fetch(`${API_URL}${path}`, init)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(body.message || 'Server xatosi')
    error.status = response.status
    throw error
  }
  return body
}

const real = {
  async login(username, password) {
    try {
      const body = await request('/auth/login', { method: 'POST', json: { email: username, password } })
      token = body.token
      return { ok: true, user: body.user }
    } catch (error) {
      if (error.status === 401) return { ok: false }
      throw error
    }
  },
  async register(data) {
    const body = await request('/auth/register', { method: 'POST', json: data })
    token = body.token
    return body
  },
  async loadData() {
    const user = await request('/auth/me')
    const data = await mock.loadData()
    data.profile = {
      ...data.profile,
      firstName: user.firstname || '',
      lastName: user.lastname || '',
      phone: user.phone || '',
      username: user.email || '',
    }
    return data
  },
  async loadRanking() { return mock.loadRanking() },
  async users() { return request('/users') },
  async addUser(data) { return request('/users', { method: 'POST', json: data }) },
  async todos() { return request('/todos') },
  async addTodo(data) { return request('/todos', { method: 'POST', json: data }) },
  async updateTodo(id, data) { return request(`/todos/${id}`, { method: 'PATCH', json: data }) },
  async deleteTodo(id) { return request(`/todos/${id}`, { method: 'DELETE' }) },
  async posts() { return request('/posts') },
  async addPost(data) { return request('/posts', { method: 'POST', json: data }) },
  async updatePost(id, data) { return request(`/posts/${id}`, { method: 'PATCH', json: data }) },
  async deletePost(id) { return request(`/posts/${id}`, { method: 'DELETE' }) },
  async changeLogin(username) {
    await request('/profile/login', { method: 'PATCH', json: { username } })
    return { ok: true }
  },
  async changePassword(currentPassword, newPassword) {
    try {
      await request('/profile/password', { method: 'PATCH', json: { currentPassword, newPassword } })
      return { ok: true }
    } catch (error) {
      if (error.status === 400 || error.status === 401) return { ok: false, error: error.message }
      throw error
    }
  },
  async uploadPhoto(file) {
    const form = new FormData()
    form.append('photo', file)
    const body = await request('/profile/photo', { method: 'POST', body: form })
    return body.url
  },
  async setNotificationsEnabled(enabled) {
    await request('/profile/notifications', { method: 'PATCH', json: { enabled } })
  },
  async markNotificationRead(id) {
    await request(`/notifications/${id}/read`, { method: 'PATCH' })
  },
  async markAllNotificationsRead() {
    await request('/notifications/read-all', { method: 'POST' })
  },
  async buyProduct(id) {
    try {
      await request(`/products/${id}/buy`, { method: 'POST' })
      return { ok: true }
    } catch (error) {
      if (error.status === 400) return { ok: false, error: error.message }
      throw error
    }
  },
  logout() { token = '' },
}

/* ---------- Namunaviy (mock) rejim ---------- */

const credentials = { username: '12345', password: '12345' }
const profile = {
  firstName: 'Begzod',
  lastName: 'Hasanov',
  phone: '97 999 66 67',
  gender: 'Noma’lum',
  birthDate: '28.02.1991',
  username: credentials.username,
  photoUrl: '',
  notificationsEnabled: true,
}
const stats = { silver: 248, xp: 62, xpMax: 200, level: 0, rank: 13439 }

const mock = {
  async login(username, password) {
    await sleep(500)
    return { ok: username.trim() === credentials.username && password === credentials.password }
  },
  async loadData() {
    return {
      profile: { ...profile, username: credentials.username },
      stats,
      payments: PAYMENTS,
      homework: HOMEWORK,
      products: PRODUCTS.map((product, index) => ({ id: index + 1, ...product })),
      notifications: NOTIFICATIONS.map((item, index) => ({ id: index + 1, read: false, ...item })),
      courses: EXTRA_COURSES,
    }
  },
  async loadRanking() {
    return { items: RANKING, total: 248 }
  },
  async changeLogin(username) {
    credentials.username = username
    return { ok: true }
  },
  async changePassword(currentPassword, newPassword) {
    if (currentPassword !== credentials.password) return { ok: false, error: 'Joriy parol noto‘g‘ri.' }
    credentials.password = newPassword
    return { ok: true }
  },
  async uploadPhoto(file) {
    return URL.createObjectURL(file)
  },
  async setNotificationsEnabled() {},
  async markNotificationRead() {},
  async markAllNotificationsRead() {},
  async buyProduct() {
    return { ok: false, error: 'Kumush yetarli emas.' }
  },
  logout() {},
}

export const api = USE_MOCK ? mock : {
  ...mock,
  login: real.login, register: real.register, logout: real.logout,
  loadData: real.loadData, loadRanking: real.loadRanking,
  users: real.users, addUser: real.addUser,
  todos: real.todos, addTodo: real.addTodo, updateTodo: real.updateTodo, deleteTodo: real.deleteTodo,
  posts: real.posts, addPost: real.addPost, updatePost: real.updatePost, deletePost: real.deletePost,
}
