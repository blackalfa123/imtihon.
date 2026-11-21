import { icon } from '../icons.js'
import { esc, money } from '../util.js'
import { tableFooter } from '../components/shell.js'

export function paymentsPage(state) {
  const { paymentFilter, paymentStart, paymentEnd } = state
  const payments = state.data.payments.filter((payment) => (
    (paymentFilter === 'Barchasi' || payment.method === paymentFilter)
    && (!paymentStart || payment.isoDate >= paymentStart)
    && (!paymentEnd || payment.isoDate <= paymentEnd)
  ))
  const options = ['Barchasi', 'Payme', 'Click', 'Uzcard'].map((item) => `<option${item === paymentFilter ? ' selected' : ''}>${item}</option>`).join('')
  const rows = payments.map((payment, index) => `<tr><td data-label="#">${index + 1}</td><td data-label="Miqdori">${money(payment.amount)}</td><td data-label="Holati">To‘langan</td><td data-label="To‘lov turi">${esc(payment.method)}</td><td data-label="Vaqti">${esc(payment.date)}</td></tr>`).join('')

  return `
    <section class="content-page payments-page">
      <div class="filter-bar">
        <label class="select-control"><span class="sr-only">To‘lov turi</span><select data-model="paymentFilter">${options}</select>${icon('chevron', 16)}</label>
        <label class="date-control"><span>Boshlanish vaqti</span><input aria-label="Boshlanish vaqti" data-model="paymentStart" lang="ru" type="date" value="${esc(paymentStart)}" /></label>
        <label class="date-control"><span>Tugash vaqti</span><input aria-label="Tugash vaqti" data-model="paymentEnd" lang="ru" type="date" value="${esc(paymentEnd)}" /></label>
      </div>
      <div class="table-card">
        <table>
          <thead><tr><th>#</th><th>Miqdori</th><th>Holati</th><th>To‘lov turi</th><th>Vaqti</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${payments.length === 0 ? '<p class="empty-state">Tanlangan to‘lov turi bo‘yicha ma’lumot yo‘q.</p>' : ''}
        ${tableFooter(payments.length)}
      </div>
    </section>`
}
