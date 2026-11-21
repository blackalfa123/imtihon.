import { icon } from '../icons.js'
import { pageTitle } from '../components/shell.js'

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
const EVENT_DAYS = [12, 14, 16, 19, 21, 23, 26, 28, 30]

function statCard(stats, withRank) {
  const percent = Math.min(100, Math.round((stats.xp / stats.xpMax) * 100))
  return `
    <h2>${icon('trend', 20, 'blue-icon')} Bosqich: <strong>${stats.level}</strong></h2>
    <span class="xp-pill">${stats.xp} / ${stats.xpMax}</span>
    <div aria-label="${stats.xpMax} dan ${stats.xp} XP" class="xp-track"><span style="width:${percent}%"></span></div>
    <h2 class="xp-total">${icon('globe', 20)} XP: <strong>${stats.xp}</strong></h2>
    ${withRank ? `<h3>Reyting</h3><p><strong>Umumiy:</strong> <span class="gold-text">${new Intl.NumberFormat('ru-RU').format(stats.rank).replace(/ | /g, ' ')} - o‘rin</span></p>` : ''}`
}

export { statCard }

export function homePage(state) {
  const { month, selectedDate } = state
  const stats = state.data.stats
  const monthName = `${MONTHS[month.getMonth()]} ${month.getFullYear()}`
  const firstDay = (month.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)

  const week = ['D', 'S', 'C', 'P', 'J', 'S', 'Y'].map((day) => `<span>${day}</span>`).join('')
  const days = cells.map((day) => {
    const classes = `${day === selectedDate ? 'selected-day' : ''}${EVENT_DAYS.includes(day) ? ' has-event' : ''}`.trim()
    return `<button ${day ? `aria-label="${day}-${MONTHS[month.getMonth()].toLowerCase()}" aria-pressed="${day === selectedDate}" role="gridcell" data-action="select-date" data-day="${day}"` : 'disabled'} class="${classes}" type="button">${day || ''}</button>`
  }).join('')

  const lesson = selectedDate ? `
    <button class="schedule-card" data-action="go" data-page="groups" type="button">
      <span>Dars ${selectedDate === 9 ? '9' : Math.max(1, selectedDate - 1)} (3oy)</span>
      <span>${icon('clock', 19)} 16:00 - 18:00</span>
    </button>` : ''

  return `
    <div class="home-page">
      <div class="home-heading">${pageTitle(`Kumushlar: ${stats.silver} ${icon('diamond', 21)}`)}</div>
      <div class="home-layout">
        <section aria-label="O‘quvchi ko‘rsatkichlari" class="stat-card">${statCard(stats, true)}</section>
        <section class="calendar-area">
          <h2>Dars jadvali</h2>
          <div class="schedule-layout">
            <div class="calendar-card">
              <div class="calendar-header">
                <span>${monthName}</span>
                <div>
                  <button aria-label="Oldingi oy" data-action="shift-month" data-delta="-1" type="button">${icon('left', 18)}</button>
                  <button aria-label="Keyingi oy" data-action="shift-month" data-delta="1" type="button">${icon('right', 18)}</button>
                </div>
              </div>
              <div class="calendar-grid calendar-week">${week}</div>
              <div aria-label="${monthName}" class="calendar-grid" role="grid">${days}</div>
            </div>
            ${lesson}
          </div>
        </section>
      </div>
      <section aria-label="Tezkor bo‘limlar" class="quick-links">
        <button data-action="go" data-page="payments" type="button">${icon('card')} To‘lovlarim</button>
        <button data-action="go" data-page="groups" type="button">${icon('groups')} Guruhlarim</button>
        <button data-action="go" data-page="indicators" type="button">${icon('chart')} Natijalarim</button>
      </section>
    </div>`
}
