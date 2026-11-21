import { icon } from '../icons.js'
import { esc } from '../util.js'

const PAGE_SIZE = 10
const KINDS = ['Barchasi', 'Imtihon', 'Guruhga qo’shilganlik', 'Uyga vazifa', 'Darsni baholang', 'Mukofot']

export function notificationsPage(state) {
  const { notificationFilter: filter, notificationPage } = state
  const filtered = state.data.notifications.filter((item) => filter === 'Barchasi' || item.kind === filter)
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(notificationPage, pages)
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const options = KINDS.map((kind) => `<option${kind === filter ? ' selected' : ''}>${kind}</option>`).join('')
  const cards = items.map((item) => `
    <button aria-label="${item.read ? 'O‘qilgan' : 'O‘qilmagan'}: ${esc(item.text)}" class="notification-card${item.read ? ' notification-read' : ''}" data-action="read-notification" data-id="${esc(item.id)}" type="button">
      <strong>${esc(item.text)}</strong>
      <span>${esc(item.date)}</span>
      ${item.read ? '' : '<span aria-label="O‘qilmagan" class="unread-dot"></span>'}
    </button>`).join('')

  const numbers = Array.from({ length: pages }, (_, i) => i + 1)
    .map((n) => `<button ${page === n ? 'aria-current="page"' : ''} data-action="notification-page" data-page-number="${n}" type="button">${n}</button>`).join('')
  const pagination = pages > 1 ? `<nav aria-label="Xabarnomalar sahifalari" class="notification-pagination">
    <button aria-label="Oldingi sahifa" ${page === 1 ? 'disabled' : ''} data-action="notification-page" data-page-number="${page - 1}" type="button">${icon('left', 18)}</button>${numbers}
    <button aria-label="Keyingi sahifa" ${page === pages ? 'disabled' : ''} data-action="notification-page" data-page-number="${page + 1}" type="button">${icon('right', 18)}</button></nav>` : ''

  return `
    <section class="content-page notifications-page">
      <div class="notifications-header">
        <h1>Xabarnomalar</h1>
        <div class="notifications-actions">
          <label class="select-control"><span class="sr-only">Xabarnoma turi</span><select data-model="notificationFilter">${options}</select>${icon('chevron', 16)}</label>
          <button class="read-all-button" data-action="read-all" type="button">Barchasini o‘qish ${icon('check', 17)}</button>
        </div>
      </div>
      <div aria-live="polite" class="notification-list">${cards}${items.length ? '' : '<p class="empty-state">Bu turdagi xabarnomalar yo‘q.</p>'}</div>
      ${pagination}
    </section>`
}
