import { tableFooter } from '../components/shell.js'

export function groupsPage(state) {
  const tab = state.groupTab
  const tabs = ['Faol', 'Tugagan'].map((name) => `<button aria-selected="${tab === name}" data-action="set" data-key="groupTab" data-value="${name}" role="tab" type="button">${name}</button>`).join('')
  const body = tab === 'Faol' ? `
    <div class="table-card groups-table">
      <table><thead><tr><th>#</th><th>Guruh nomi</th><th>Yo‘nalishi</th><th>O‘qituvchi</th><th>Boshlash vaqti</th></tr></thead>
        <tbody><tr class="clickable-row" data-action="go" data-page="group-homework"><td>1</td><td><button class="link-button" data-action="go" data-page="group-homework" type="button">Full Stack Standart SN2</button></td><td>Programming</td><td><button aria-label="O‘qituvchilar" class="teacher-count" data-action="go" data-page="group-homework" type="button">2</button></td><td>20 Iyul, 2026</td></tr></tbody>
      </table>${tableFooter(1)}
    </div>` : '<div class="empty-panel">Tugagan guruhlar hozircha mavjud emas.</div>'
  return `<section class="content-page groups-page"><div class="tabs">${tabs}</div>${body}</section>`
}
