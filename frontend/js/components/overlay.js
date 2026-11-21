// Toast va Modal (tahrirlash oynasi) — #app dan alohida ildizlarda ishlaydi,
// shuning uchun sahifa qayta chizilganda ular yo'qolmaydi yoki animatsiyasi takrorlanmaydi.
import { icon } from '../icons.js'
import { esc } from '../util.js'
import { api } from '../api.js'

/* ---------- Toast ---------- */

let toastTimer = 0

export function showToast(message) {
  const root = document.getElementById('toast-root')
  window.clearTimeout(toastTimer)
  root.innerHTML = `<div class="toast" role="status"><span>${esc(message)}</span><button aria-label="Xabarni yopish" data-toast-close type="button">${icon('close', 18)}</button></div>`
  root.querySelector('[data-toast-close]').addEventListener('click', hideToast)
  toastTimer = window.setTimeout(hideToast, 4200)
}

export function hideToast() {
  window.clearTimeout(toastTimer)
  document.getElementById('toast-root').innerHTML = ''
}

/* ---------- Modal ---------- */

const TITLES = {
  login: 'Loginni o‘zgartirish',
  password: 'Parolni o‘zgartirish',
  photo: 'Profil rasmi',
  notifications: 'Bildirishnoma sozlamalari',
}

function fields(type, username) {
  if (type === 'login') {
    return `<label>Yangi login<input name="username" required value="${esc(username)}" /></label>`
  }
  if (type === 'password') {
    return `<label>Joriy parol<input autocomplete="current-password" name="currentPassword" required type="password" /></label>
      <label>Yangi parol<input autocomplete="new-password" name="newPassword" required type="password" /></label>
      <label>Yangi parolni takrorlang<input autocomplete="new-password" name="confirmPassword" required type="password" /></label>`
  }
  if (type === 'photo') {
    return `<label>Rasm faylini tanlang<input accept="image/png,image/jpeg" name="photo" type="file" /></label>`
  }
  return ''
}

// type: 'login' | 'password' | 'photo' | 'notifications'
// onDone(type, result) — muvaffaqiyatli saqlanganda chaqiriladi
export function openModal(type, { username, onDone }) {
  const root = document.getElementById('modal-root')
  const close = () => { root.innerHTML = '' }

  root.innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <form aria-labelledby="modal-title" aria-modal="true" class="edit-modal" role="dialog">
        <button aria-label="Yopish" class="modal-close" data-close type="button">${icon('close', 19)}</button>
        <h2 id="modal-title">${TITLES[type]}</h2>
        ${fields(type, username)}
        <p class="modal-error" role="alert" hidden></p>
        <div class="modal-actions"><button class="secondary-button" data-close type="button">Bekor qilish</button><button class="primary-button" type="submit">Saqlash</button></div>
      </form>
    </div>`

  const backdrop = root.querySelector('.modal-backdrop')
  const form = root.querySelector('form')
  const errorBox = root.querySelector('.modal-error')
  const submit = root.querySelector('[type=submit]')

  const showError = (message) => { errorBox.textContent = message; errorBox.hidden = false }

  backdrop.addEventListener('mousedown', (event) => { if (event.target === backdrop) close() })
  root.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', close))
  form.querySelector('input')?.focus()

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    errorBox.hidden = true
    const data = new FormData(form)
    submit.disabled = true
    try {
      if (type === 'login') {
        const value = String(data.get('username')).trim()
        await api.changeLogin(value)
        onDone(type, value)
      } else if (type === 'password') {
        if (data.get('newPassword') !== data.get('confirmPassword')) {
          showError('Yangi parollar bir-biriga mos kelmadi.')
          return
        }
        const result = await api.changePassword(String(data.get('currentPassword')), String(data.get('newPassword')))
        if (!result.ok) {
          showError(result.error || 'Joriy parol noto‘g‘ri.')
          return
        }
        onDone(type)
      } else if (type === 'photo') {
        const file = data.get('photo')
        const url = file && file.size ? await api.uploadPhoto(file) : ''
        onDone(type, url)
      } else {
        onDone(type)
      }
      close()
    } catch (error) {
      // 4xx javoblarda serverning o'z xabarini ko'rsatamiz (masalan, "Bu login band")
      showError(error.status ? error.message : 'Server bilan aloqa yo‘q. Keyinroq urinib ko‘ring.')
    } finally {
      submit.disabled = false
    }
  })
}
