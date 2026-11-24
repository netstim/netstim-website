// Publications (layouts/_partials/bibliography.html): every year is a row that opens and closes (a native
// <details>, so it also works without this script). The topic select narrows the papers to one topic, the
// filter box to those whose title, authors or journal contain every typed word; both apply together and
// search every year, open or not: a year with a match opens and says how many, a year without one hides.
// The topic is kept in the address (?topic=lead-dbs), so a filtered list can be shared and Back returns to
// the list before. Without a filter the years are as the visitor left them. "Open all years" opens them all.
// A link to a paper in a closed year (#zp-ID-…) opens that year.
// The selected papers above the list: a phone shows the first five (publications.css); "Show 4 more" shows
// the rest and hands the focus to the first of them.
const selMore = document.querySelector('[data-sel-more]');
if (selMore) {
  selMore.querySelector('button').addEventListener('click', () => {
    const list = selMore.previousElementSibling;
    list.classList.add('is-open');
    selMore.hidden = true;
    list.children[5]?.querySelector('a')?.focus({ preventScroll: true });
  });
}
const bibliography = document.querySelector('[data-bibliography]');
if (bibliography) {
  const input = bibliography.querySelector('[data-bib-filter]');
  const select = bibliography.querySelector('[data-bib-topic]');
  const count = bibliography.querySelector('[data-bib-count]');
  const empty = bibliography.querySelector('[data-bib-empty]');
  const more = bibliography.querySelector('[data-bib-more]');
  const fold = text => text.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const years = [...bibliography.querySelectorAll('[data-bib-year]')].map(year => {
    const n = year.querySelector('[data-bib-year-n]');
    return {
      year,
      n,
      total: Number(n.dataset.total),
      rows: [...year.querySelectorAll('.pub-row')].map(row => ({
        row,
        text: fold(`${row.textContent} ${row.dataset.year}`),
        topics: (row.dataset.topics || '').split(' '),
      })),
    };
  });
  const total = years.reduce((sum, { total }) => sum + total, 0);
  const papers = n => `${n} ${n === 1 ? 'paper' : 'papers'}`;
  const known = [...select.options].map(option => option.value);
  const inAddress = () => {
    const topic = new URLSearchParams(location.search).get('topic') || '';
    return known.includes(topic) ? topic : '';
  };
  // the year of a row named in the address (an old Zotpress anchor)
  const linked = () => {
    const row = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    return (row && years.find(({ year }) => year.contains(row))) || null;
  };
  // the years the visitor has open while nothing is filtered
  const open = new Set(years.filter(({ year }) => year.open));
  let topic = inAddress();
  let filtering = false;

  const apply = () => {
    const words = fold(input.value).split(/\s+/).filter(Boolean);
    filtering = Boolean(topic) || words.length > 0;
    let shown = 0;
    for (const entry of years) {
      let matches = 0;
      for (const { row, text, topics } of entry.rows) {
        const match = (!topic || topics.includes(topic)) && words.every(word => text.includes(word));
        row.hidden = !match;
        if (match) matches += 1;
      }
      entry.year.hidden = matches === 0;
      entry.year.open = filtering ? matches > 0 : open.has(entry);
      entry.n.textContent = matches === entry.total ? papers(entry.total) : `${matches} of ${entry.total}`;
      shown += matches;
    }
    select.value = topic;
    count.textContent = shown === total ? papers(total) : `${shown} of ${total} papers`;
    empty.hidden = shown > 0;
    more.hidden = filtering || open.size === years.length;
  };

  for (const entry of years) {
    // the visitor (or the browser's own search) opened or closed a year
    entry.year.addEventListener('toggle', () => {
      if (filtering) return;
      if (entry.year.open) open.add(entry); else open.delete(entry);
      more.hidden = open.size === years.length;
    });
  }
  select.addEventListener('change', () => {
    topic = select.value;
    const url = new URL(location.href);
    if (topic) url.searchParams.set('topic', topic); else url.searchParams.delete('topic');
    history.pushState(null, '', url);
    apply();
  });
  more.querySelector('button').addEventListener('click', () => {
    const first = years.find(entry => !open.has(entry));
    for (const entry of years) open.add(entry);
    apply();
    // the button is gone: go on at the first year it opened
    first?.year.querySelector('summary').focus({ preventScroll: true });
  });
  addEventListener('popstate', () => { topic = inAddress(); apply(); });
  const reveal = () => {
    const entry = linked();
    if (!entry) return;
    open.add(entry);
    apply();
    document.getElementById(decodeURIComponent(location.hash.slice(1))).scrollIntoView();
  };
  addEventListener('hashchange', reveal);
  input.addEventListener('input', apply);
  input.addEventListener('focus', () => {
    if (matchMedia('(max-width: 767px)').matches) bibliography.scrollIntoView({ block: 'start' });
  });
  apply();
  reveal();
}
