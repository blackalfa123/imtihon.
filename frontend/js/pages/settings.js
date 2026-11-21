import { icon } from '../icons.js'
import { esc, safeUrl } from '../util.js'

export function settingsPage(state) {
  const profile = state.data.profile
  const photo = safeUrl(profile.photoUrl)
  return `
    <section class="content-page settings-page">
      <div class="profile-card">
        <h1>Shaxsiy ma’lumotlar</h1>
        <div class="profile-details">
          <div class="photo-column"><img alt="Profil rasmi namunasi" class="sample-photo" src="assets/profile-sample.png" /><p>500x500 o‘lcham, JPEG, JPG, PNG<br />format, maksimum 2MB</p></div>
          <button aria-label="Profil rasmini o‘zgartirish" class="avatar-placeholder" data-action="edit" data-type="photo" type="button"><img alt="" src="${esc(photo || 'assets/profile-sample.png')}" /><b>${icon('edit', 16)}</b>${photo ? '' : '<small>Yuklanmagan</small>'}</button>
          <div class="profile-info"><span>Ism</span><strong>${esc(profile.firstName)}</strong><span>Telefon raqam</span><strong>${esc(profile.phone)}</strong><strong>Jinsi</strong><strong>${esc(profile.gender)}</strong></div>
          <div class="profile-info"><span>Familiya</span><strong>${esc(profile.lastName)}</strong><span>Tug‘ilgan sana</span><strong>${esc(profile.birthDate)}</strong><span>HH ID</span><strong>${esc(profile.username)}</strong></div>
        </div>
      </div>
      <div class="settings-cards">
        <article class="setting-card"><h2>Kirish</h2><div class="setting-value">${esc(profile.username)}<button aria-label="Loginni tahrirlash" data-action="edit" data-type="login" type="button">${icon('edit')}</button></div></article>
        <article class="setting-card"><h2>Parol</h2><div class="setting-value">••••••••<button aria-label="Parolni o‘zgartirish" data-action="edit" data-type="password" type="button">${icon('edit')}</button></div></article>
        <article class="setting-card"><h2>Bildirishnoma sozlamalari</h2><label class="notification-setting"><span>Bildirishnomalar</span><button aria-label="Bildirishnomalar" aria-pressed="${profile.notificationsEnabled}" class="switch${profile.notificationsEnabled ? ' switch-on' : ''}" data-action="toggle-notifications" type="button"><span></span></button></label><button class="text-button settings-edit" data-action="edit" data-type="notifications" type="button">Tahrirlash</button></article>
      </div>
    </section>`
}
