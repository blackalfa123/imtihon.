import { icon } from '../icons.js'
import { esc, safeUrl } from '../util.js'

function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-art"><img alt="${esc(product.title)}" class="product-image" src="${esc(safeUrl(product.image))}" /></div>
      <h2>${esc(product.title)}</h2>
      <div class="product-buy"><span>${esc(product.price)} ${icon('diamond', 18)}</span><button data-action="buy" data-id="${esc(product.id)}" type="button">Kumushingiz yetarli emas</button></div>
    </article>`
}

export function shopPage(state) {
  const { storeTab, storeCategory, storeSearch, storeMin, storeMax, silverOnly } = state
  const silver = state.data.stats.silver
  const products = state.data.products.filter((product) => (
    (storeCategory === 'Barchasi' || product.category === storeCategory)
    && product.title.toLowerCase().includes(storeSearch.toLowerCase())
    && (!silverOnly || product.price <= silver)
    && (!storeMin || product.price >= Number(storeMin))
    && (!storeMax || product.price <= Number(storeMax))
  ))
  const tabs = ['Sotuvda', 'Sotib olganlarim'].map((name) => `<button aria-selected="${storeTab === name}" data-action="set" data-key="storeTab" data-value="${name}" role="tab" type="button">${name}</button>`).join('')
  const categories = ['Barchasi', 'Aksessuar', 'Chegirma'].map((item) => `<option${item === storeCategory ? ' selected' : ''}>${item}</option>`).join('')

  const body = storeTab === 'Sotuvda' ? `
    <div class="shop-filters">
      <label>Kategoriya<span class="select-control"><select data-model="storeCategory">${categories}</select>${icon('chevron', 16)}</span></label>
      <label>Aksessuar qiymati<span class="price-range"><input aria-label="Eng kam narx" data-model="storeMin" min="0" type="number" value="${esc(storeMin)}" /> dan <input aria-label="Eng yuqori narx" data-model="storeMax" min="0" type="number" value="${esc(storeMax)}" /> gacha</span></label>
      <label>Aksessuar nomi<span class="search-control"><input data-model="storeSearch" placeholder="Qidirish..." value="${esc(storeSearch)}" />${icon('search')}</span></label>
      <label class="silver-toggle">Kumushlarim yetadi<button aria-label="Kumush yetadigan mahsulotlar" aria-pressed="${silverOnly}" class="${silverOnly ? 'toggle-on' : ''}" data-action="toggle" data-key="silverOnly" type="button"><span></span></button></label>
    </div>
    <div class="product-grid">${products.map(productCard).join('')}</div>
    ${products.length ? '' : '<p class="empty-state">Qidiruvga mos mahsulot topilmadi.</p>'}` : '<div class="empty-panel">Hozircha sotib olingan mahsulotlar yo‘q.</div>'

  return `<section class="content-page shop-page"><div class="tabs">${tabs}</div>${body}</section>`
}
