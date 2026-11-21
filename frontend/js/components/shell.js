// Umumiy qismlar: Topbar, Sidebar, MobileNav, TableFooter, PageTitle
import { icon, navIcon } from '../icons.js'
import { NAV_ITEMS } from '../data/navItems.js'

export function pageTitle(content, action = '') {
  return `<div class="page-title-row"><h1>${content}</h1>${action}</div>`
}

export function topbar(state) {
  return `
    <header class="topbar">
      <button aria-label="Bosh sahifaga" class="brand" data-action="go" data-page="home" type="button">
        <img alt="" class="brand-emblem" src="assets/najot-emblem.png" />
      </button>
      <span class="beta-badge">Beta</span>
      <button aria-label="Menyuni yig‘ish yoki ochish" aria-expanded="${!state.sidebarCollapsed}" class="menu-button" data-action="toggle-sidebar" type="button">${icon('menu', 22)}</button>
      <div class="top-actions">
        <button aria-label="Bildirishnomalar" class="top-icon" data-action="go" data-page="notifications" type="button">${icon('bell')}</button>
        <button aria-label="Chiqish" class="top-icon" data-action="logout" type="button">${icon('logout')}</button>
      </div>
    </header>`
}

function isActive(state, id) {
  return state.page === id || (state.page === 'group-homework' && id === 'groups')
}

export function sidebar(state) {
  const items = NAV_ITEMS.map((item) => `
    <button ${state.page === item.id ? 'aria-current="page"' : ''} class="nav-item${isActive(state, item.id) ? ' active' : ''}" data-action="go" data-page="${item.id}" type="button">
      ${navIcon(item.icon)}<span>${item.label}</span>
    </button>`).join('')
  return `
    <aside class="sidebar${state.sidebarCollapsed ? ' sidebar-collapsed' : ''}${state.menuOpen ? ' sidebar-open' : ''}">
      <nav aria-label="Asosiy navigatsiya">${items}</nav>
      <div class="sidebar-footer">Talaba kabineti</div>
    </aside>`
}

export function mobileNav(state) {
  const items = NAV_ITEMS.map((item) => {
    const active = isActive(state, item.id)
    return `<button ${active ? 'aria-current="page"' : ''} aria-label="${item.label}" class="mobile-nav-item${active ? ' active' : ''}" data-action="go" data-page="${item.id}" type="button">${navIcon(item.icon)}</button>`
  }).join('')
  return `<nav aria-label="Mobil navigatsiya" class="mobile-nav">${items}</nav>`
}

export function tableFooter(count) {
  const info = count ? `1-${count} gacha, ${count} tadan` : '0 ta'
  return `<div class="table-footer"><label>Satrlar soni <select aria-label="Sahifadagi satrlar soni"><option selected>10</option><option>25</option><option>50</option></select></label><span>${info}</span><button aria-label="Oldingi sahifa" disabled type="button">${icon('left', 18)}</button><button aria-label="Keyingi sahifa" disabled type="button">${icon('right', 18)}</button></div>`
}
