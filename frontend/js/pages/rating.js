import { esc } from '../util.js'
import { tableFooter } from '../components/shell.js'

const SCOPES = ['Guruhim bo‘yicha', 'Filial bo‘yicha', 'Barcha filiallar bo‘yicha']
const PERIODS = ['Haftalik', 'Oylik', '3 oy']
const TITLES = {
  'Guruhim bo‘yicha': 'Guruh bo‘yicha reyting',
  'Filial bo‘yicha': 'Filial bo‘yicha yetakchilar',
  'Barcha filiallar bo‘yicha': 'Barcha filiallar bo‘yicha',
}

const toggle = (key, value, current) => `<button aria-pressed="${current === value}" data-action="set-ranking" data-key="${key}" data-value="${value}" type="button">${value}</button>`

export function ratingPage(state) {
  const { ratingScope, ratingPeriod, ranking } = state
  const rows = ranking.items.map((row) => `<tr><td>${esc(row.place)}</td><td>${esc(row.name)}</td><td>${row.courses.map((course) => `<div>${esc(course)}</div>`).join('')}</td><td>${esc(row.xp)}</td></tr>`).join('')
  return `
    <section class="content-page ranking-page">
      <div class="ranking-options">
        <div class="option-group"><span>Guruhim bo‘yicha</span>${SCOPES.map((item) => toggle('ratingScope', item, ratingScope)).join('')}</div>
        <div class="option-group period-group"><span>Davr</span>${PERIODS.map((item) => toggle('ratingPeriod', item, ratingPeriod)).join('')}</div>
      </div>
      <div class="ranking-content"><h1>${TITLES[ratingScope]}</h1>
        <div class="table-card"><table><thead><tr><th>Reyting</th><th>Ism-familiya</th><th>Kurs</th><th>XP</th></tr></thead><tbody>${rows}</tbody></table>${tableFooter(ranking.total)}</div>
      </div>
    </section>`
}
