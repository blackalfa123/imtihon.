import { icon } from '../icons.js'
import { esc } from '../util.js'
import { tableFooter } from '../components/shell.js'

const STATUS_CLASS = {
  Bajarilmagan: 'status-red',
  Kutayotganlar: 'status-blue',
  'Qabul qilingan': 'status-green',
  Qaytarilgan: 'status-orange',
}

export function homeworkPage(state) {
  const filter = state.homeworkFilter
  const rows = state.data.homework.filter((item) => filter === 'Barchasi' || item.status === filter)
  const options = ['Barchasi', 'Berilmagan', 'Bajarilmagan', 'Kutayotganlar', 'Qabul qilingan', 'Qaytarilgan']
    .map((item) => `<option${item === filter ? ' selected' : ''}>${item}</option>`).join('')

  const body = rows.map((row) => {
    const isNumber = typeof row.videos === 'number'
    return `
      <tr aria-label="${esc(row.lesson)} darsiga o'tish" class="homework-row" data-action="homework-row" data-lesson="${esc(row.lesson)}" tabindex="0">
        <td>${esc(row.lesson)}</td>
        <td><button aria-label="${isNumber ? `${row.videos} ta video` : esc(row.videos)}" class="video-count${isNumber ? '' : ' exam-count'}" data-action="video" type="button">${esc(row.videos)}</button></td>
        <td><span class="status-badge ${STATUS_CLASS[row.status] || 'status-gray'}">${esc(row.status)}</span></td>
        <td>${esc(row.due)}</td>
        <td>${esc(row.date)}</td>
      </tr>`
  }).join('')

  return `
    <section class="content-page homework-page">
      <div class="course-title"><button class="back-button" data-action="go" data-page="groups" type="button">${icon('left', 18)} Guruhlarim</button><h1>Full Stack Standart SN2</h1></div>
      <label class="homework-select">Uy vazifa statusi <span class="select-control"><select data-model="homeworkFilter">${options}</select>${icon('chevron', 16)}</span></label>
      <div class="table-card homework-table">
        <table><thead><tr><th>Mavzular</th><th>Video</th><th>Uyga vazifa Holati</th><th>Uyga vazifa tugash vaqti ↓</th><th>Dars sanasi ↑</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
        ${rows.length === 0 ? '<p class="empty-state">Bu holatga mos uy vazifalari topilmadi.</p>' : ''}
        ${tableFooter(rows.length)}
      </div>
    </section>`
}
