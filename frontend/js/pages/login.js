import { eyeIcon } from '../icons.js'
import { esc } from '../util.js'

export function loginPage(state) {
  const { username, password, passwordVisible, loading, registerMode } = state
  const registerForm = `
    <form data-form="register">
      <label class="field"><span class="field-label">Ism</span><input name="firstname" placeholder="Ism" required /></label>
      <label class="field"><span class="field-label">Familiya</span><input name="lastname" placeholder="Familiya" required /></label>
      <label class="field"><span class="field-label">Email</span><input name="email" type="email" placeholder="Email" required /></label>
      <label class="field"><span class="field-label">Telefon</span><input name="phone" placeholder="Telefon" required /></label>
      <label class="field"><span class="field-label">Parol</span><input name="password" type="password" minlength="6" placeholder="Parol (kamida 6 belgi)" required /></label>
      <button class="submit-button" ${loading ? 'disabled' : ''} type="submit">${loading ? '<span class="loading-spinner"></span>' : 'Ro‘yxatdan o‘tish'}</button>
      <button class="text-button" data-action="show-login" type="button">Hisobingiz bormi? Kirish</button>
    </form>`
  const loginForm = `
    <form data-form="login">
      <label class="field${username ? ' has-value' : ''}">
        <span class="sr-only">Email</span><span aria-hidden="true" class="field-label">Email</span>
        <input autocomplete="username" data-model="username" data-norender name="username" type="email" placeholder="Email" required value="${esc(username)}" />
      </label>
      <label class="field password-field${password ? ' has-value' : ''}">
        <span class="sr-only">Parol</span><span aria-hidden="true" class="field-label">Parol</span>
        <input autocomplete="current-password" data-model="password" data-norender name="password" placeholder="Parol" required type="${passwordVisible ? 'text' : 'password'}" value="${esc(password)}" />
        <button aria-label="${passwordVisible ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}" aria-pressed="${passwordVisible}" class="password-toggle" data-action="toggle-password" type="button">${eyeIcon(passwordVisible)}</button>
      </label>
      <img alt="Tekshiruv muvaffaqiyatli" class="login-verification" src="assets/login-verification.png" />
      <button class="submit-button" ${loading ? 'disabled' : ''} type="submit">${loading ? '<span aria-label="Yuklanmoqda" class="loading-spinner"></span>' : 'Kirish'}</button>
      <button class="text-button" data-action="show-register" type="button">Ro‘yxatdan o‘tish</button>
    </form>`
  return `
    <main class="login-page">
      <section aria-hidden="true" class="illustration-panel"><img alt="" class="login-illustration" src="assets/login-illustration.png" /></section>
      <section aria-labelledby="login-title" class="form-panel"><div class="login-content">
        <h1 id="login-title">${registerMode ? 'Ro‘yxatdan o‘tish' : 'Kirish'}</h1>
        ${registerMode ? registerForm : loginForm}
      </div></section>
    </main>`
}
