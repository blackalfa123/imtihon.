const ICONS = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />',
  card: '<rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 10h18" />',
  groups: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />',
  chart: '<rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 16v-4m4 4V7m4 9v-7" />',
  bars: '<path d="M4 20h3V9H4zm7 0h3V4h-3zm7 0h3v-7h-3z" />',
  cart: '<path d="M3 3h2l2.4 12.1a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" />',
  lesson: '<rect x="3" y="4" width="18" height="16" rx="1" /><path d="m9 9 6 3-6 3zM3 8H1m2 4H1m2 4H1" />',
  settings: '<circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.8Z" />',
  menu: '<path d="M4 6h16M4 12h16M4 18h16" />',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" />',
  logout: '<path d="M10 17l5-5-5-5m5 5H3" /><path d="M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />',
  diamond: '<path d="m6 3-5 6 11 13L23 9l-5-6zM1 9h22M6 3l6 19 6-19" />',
  trend: '<path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" />',
  globe: '<circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18" />',
  clock: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />',
  edit: '<path d="m15 5 4 4M4 20l4-.8L19.2 8a2.8 2.8 0 0 0-4-4L4.8 15.2z" />',
  search: '<circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" />',
  chevron: '<path d="m6 9 6 6 6-6" />',
  left: '<path d="m15 18-6-6 6-6" />',
  right: '<path d="m9 18 6-6-6-6" />',
  close: '<path d="m6 6 12 12M18 6 6 18" />',
  play: '<path d="m8 5 12 7-12 7z" />',
  check: '<path d="m5 12 4 4L19 6" />',
}

export function icon(name, size = 24, className = '') {
  return `<svg aria-hidden="true" class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.chart}</svg>`
}

const NAV_SHAPES = {
  home: '<path d="M1 11.2 12 2l11 9.2h-3V22h-6.5v-6.5h-3V22H4v-10.8z" />',
  card: '<path d="M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M2 9h20v2H2z" fill="#fff" />',
  groups: '<circle cx="12" cy="7" r="4" /><circle cx="4" cy="10" r="3" /><circle cx="20" cy="10" r="3" /><path d="M4 21v-2a8 8 0 0 1 16 0v2zM0 20v-2a5 5 0 0 1 3-4.6A7 7 0 0 0 1 19v2zm24 0h-1v-1a7 7 0 0 0-2-5.6 5 5 0 0 1 3 4.6z" />',
  chart: '<path d="M3 2h18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 3v14h16V5z" /><path d="M7 14h3v5H7zm5-7h3v12h-3zm5 4h3v8h-3z" />',
  bars: '<path d="M2 20h4V9H2zm8 0h4V3h-4zm8 0h4v-8h-4z" />',
  cart: '<path d="M1 2h3l2.7 13.2A3 3 0 0 0 9.6 18h9.7a3 3 0 0 0 2.9-2.3L24 7H6L5.5 5H1zM9 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />',
  lesson: '<path d="M2 2h20a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 3v12h16V5z" /><path d="M8 9h8l-2 3 2 3H8l2-3zM8 22h8l-1 2H9z" />',
  settings: '<path d="m19.4 13.5 2.1 1.6-2.1 3.6-2.5-.9a8 8 0 0 1-1.7 1l-.4 2.7h-4.2l-.4-2.7a8 8 0 0 1-1.7-1L6 18.7l-2.1-3.6L6 13.5a8 8 0 0 1 0-2L3.9 9.9 6 6.3l2.5.9a8 8 0 0 1 1.7-1l.4-2.7h4.2l.4 2.7a8 8 0 0 1 1.7 1l2.5-.9 2.1 3.6-2.1 1.6a8 8 0 0 1 0 2zM12.7 15.3a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z" />',
}

export function navIcon(name) {
  return `<svg aria-hidden="true" class="nav-icon" viewBox="0 0 24 24" fill="currentColor">${NAV_SHAPES[name] || NAV_SHAPES.home}</svg>`
}

export function eyeIcon(visible) {
  return visible
    ? '<svg aria-hidden="true" viewBox="0 0 24 24" class="eye-icon" fill="none"><path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 5.2A10.9 10.9 0 0112 5c5.5 0 9 7 9 7a15.7 15.7 0 01-3.1 3.8M6.2 6.2C3.6 8 2 12 2 12s3.5 7 10 7c1 0 2-.2 2.9-.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>'
    : '<svg aria-hidden="true" viewBox="0 0 24 24" class="eye-icon" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" /><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" /></svg>'
}
