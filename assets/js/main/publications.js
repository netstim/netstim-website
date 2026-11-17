const bibliography = document.querySelector('[data-bibliography]');
if (bibliography) {
  const rows = [...bibliography.querySelectorAll('.citation-list > li')];
  const controls = bibliography.querySelector('nav');
  const previous = bibliography.querySelector('[data-bib-back]');
  const next = bibliography.querySelector('[data-bib-next]');
  const status = bibliography.querySelector('[data-bib-page]');
  const size = 20;
  const total = Math.ceil(rows.length / size);
  let page = 0;
  function show(number) {
    page = number;
    const start = page * size;
    rows.forEach((row, index) => { row.hidden = index < start || index >= start + size; });
    status.textContent = `Page ${page + 1} of ${total}`;
    previous.disabled = page === 0;
    next.disabled = page === total - 1;
  }
  function go(step) {
    show(page + step);
    if ((step < 0 && previous.disabled) || (step > 0 && next.disabled)) {
      (step < 0 ? next : previous).focus({preventScroll:true});
    }
    bibliography.scrollIntoView({block:'start'});
  }
  previous.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  if (total > 1) {
    controls.hidden = false;
    show(0);
  }
}
