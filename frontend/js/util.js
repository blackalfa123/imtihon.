// HTML ichiga qo'yiladigan matnlarni xavfsiz qilish (XSS dan himoya)
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function money(value) {
  return `${new Intl.NumberFormat('ru-RU').format(value).replace(/ | /g, ' ')} so‘m`
}

// Rasm manzili faqat bizning papkadan, blob: yoki http(s) bo'lsa ishonamiz
export function safeUrl(url) {
  const value = String(url ?? '')
  return /^(assets\/|blob:|https?:\/\/|\/)/.test(value) ? value : ''
}
