// Publications (layouts/_partials/bibliography.html): the filter box narrows the rows to those whose title,
// authors or journal contain every typed word; a year without a match hides with its rows.
const bibliography = document.querySelector('[data-bibliography]');
if (bibliography) {
  const input = bibliography.querySelector('[data-bib-filter]');
  const count = bibliography.querySelector('[data-bib-count]');
  const empty = bibliography.querySelector('[data-bib-empty]');
  const years = [...bibliography.querySelectorAll('[data-bib-year]')];
  const fold = text => text.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const rows = [...bibliography.querySelectorAll('.pub-row')].map(row => ({ row, text: fold(`${row.textContent} ${row.dataset.year}`) }));
  const total = rows.length;
  input.addEventListener('input', () => {
    const words = fold(input.value).split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const { row, text } of rows) {
      const match = words.every(word => text.includes(word));
      row.hidden = !match;
      if (match) shown += 1;
    }
    for (const year of years) year.hidden = !year.querySelector('.pub-row:not([hidden])');
    count.textContent = words.length ? `${shown} of ${total} publications` : `${total} publications`;
    empty.hidden = shown > 0;
  });
  input.addEventListener('focus', () => {
    if (matchMedia('(max-width: 767px)').matches) bibliography.scrollIntoView({ block: 'start' });
  });
}
