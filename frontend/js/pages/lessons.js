import { icon } from '../icons.js'
import { esc } from '../util.js'

export function lessonsPage(state) {
  const open = state.openCourse
  const items = state.data.courses.map((course, index) => `
    <div class="accordion-item${open === index ? ' expanded' : ''}">
      <button aria-expanded="${open === index}" data-action="toggle-course" data-index="${index}" type="button"><span>${index + 1}. ${esc(course)}</span>${icon('chevron', 18)}</button>
      ${open === index ? `<div class="accordion-content"><p>Ushbu bo‘limda mavzu bo‘yicha video darslar va o‘quv materiallari joylashgan.</p><button class="outline-button" data-action="toggle-course" data-index="${index}" type="button">${icon('play', 15)} Darsni ko‘rish</button></div>` : ''}
    </div>`).join('')
  return `<section class="content-page extra-page"><h1>HR Suhbatlari kursi</h1><div class="accordion-list">${items}</div></section>`
}
