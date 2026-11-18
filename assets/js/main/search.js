import { wireDialog } from './dialog.js';

const dialog = document.querySelector('#site-search');
const field = dialog.querySelector('input');
const status = dialog.querySelector('[data-search-status]');
const list = dialog.querySelector('[data-search-results]');
const openSearch = wireDialog(dialog, document.querySelectorAll('[data-search-open]'));
let index;

function normalize(text) {
  return text.normalize('NFKD').toLowerCase().replace(/\p{Diacritic}/gu, '');
}
async function search() {
  const query = normalize(field.value.trim());
  list.replaceChildren();
  status.textContent = '';
  if (!query) return;
  status.textContent = 'Searching…';
  try {
    index ??= fetch(dialog.dataset.searchIndex).then(response => {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json();
    }).then(pages => pages.map(page => ({
      ...page, name: normalize(page.title), body: normalize(page.text),
    })));
    const pages = await index;
    if (normalize(field.value.trim()) !== query) return;
    const words = query.split(/\s+/);
    const ranked = pages.map(page => {
      const score = words.reduce((n, word) => n + (page.name.includes(word) ? 5 : page.body.includes(word) ? 1 : -100), 0);
      return { page, score: score + (page.name.includes(query) ? 12 : 0) };
    }).filter(row => row.score > 0).sort((a, b) => b.score - a.score).slice(0, 15);
    for (const {page} of ranked) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = page.url;
      const title = document.createElement('span');
      title.className = 'search-result__title';
      title.textContent = page.title;
      const where = document.createElement('span');
      where.className = 'search-result__where';
      where.textContent = page.section || '';
      a.append(title, where);
      li.append(a);
      list.append(li);
    }
    status.textContent = ranked.length ? `${ranked.length} results` : 'No results';
  } catch {
    index = undefined;
    status.textContent = 'Search is unavailable. Try again.';
  }
}
field.addEventListener('input', search);
const legacyQuery = new URLSearchParams(location.search).get('s');
if (legacyQuery !== null) {
  field.value = legacyQuery;
  openSearch(document.querySelector('[data-search-open]'));
  search();
}
