import { icon } from '../icons.js'
import { pageTitle } from '../components/shell.js'
import { statCard } from './home.js'

export function indicatorsPage(state) {
  const stats = state.data.stats
  return `
    <section class="content-page indicators-page">
      ${pageTitle(`Mening natijalarim <span class="silver-total">${icon('diamond', 22)} Kumushlar: <b>${stats.silver}</b></span>`)}
      <div class="stat-card compact-stat">${statCard(stats, false)}</div>
      <div class="monitor-card">
        <h2>Yig‘ilgan natijalar monitoringi</h2>
        <button data-action="toast" data-message="Darsga ishtirok natijalari: jami XP 52, jami kumush 208." type="button"><span>Darsga ishtirok bo‘yicha jami XP 52, Jami Kumush 208</span>${icon('logout', 20)}</button>
        <button data-action="toast" data-message="Uyga vazifa natijalari: jami XP 10, jami kumush 40." type="button"><span>Uyga vazifa bo‘yicha jami XP 10, Jami Kumush 40</span>${icon('logout', 20)}</button>
        <div class="monitor-totals"><p>${icon('globe', 19)} <strong>Jami yig‘ilgan XP:</strong> <span>${stats.xp}</span></p><p>${icon('diamond', 19)} <strong>Jami yig‘ilgan Kumushlar:</strong> <span>${stats.silver}</span></p></div>
      </div>
    </section>`
}
