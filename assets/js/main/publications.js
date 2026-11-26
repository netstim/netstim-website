// Publications (layouts/_partials/bibliography.html): two views ("Selected" and "All"), switched from the top
// tab bar or the "All N publications" button at the end of Selected.
// Opening a topic (?topic=…), ?view=all, or a direct paper anchor (#zp-ID-…) switches straight to All.
// In All, the topic select narrows papers to one topic and the filter box matches every typed word against
// title, authors, journal and year; empty years hide automatically.
const pageRoot = document.querySelector('[data-pub-page]');
if (pageRoot) {
  const switchBtns = [...pageRoot.querySelectorAll('[data-bib-view]')];
  const openAllBtn = pageRoot.querySelector('[data-bib-open-all]');
  const selectedPanel = pageRoot.querySelector('[data-bib-panel="selected"]');
  const allPanel = pageRoot.querySelector('[data-bib-panel="all"]');
  const bibliography = pageRoot.querySelector('[data-bibliography]');

  const input = bibliography.querySelector('[data-bib-filter]');
  const select = bibliography.querySelector('[data-bib-topic]');
  const count = bibliography.querySelector('[data-bib-count]');
  const empty = bibliography.querySelector('[data-bib-empty]');
  const fold = text => text.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  const years = [...bibliography.querySelectorAll('[data-bib-year]')].map(year => ({
    year,
    rows: [...year.querySelectorAll('.pub-row')].map(row => ({
      row,
      text: fold(`${row.textContent} ${row.dataset.year}`),
      topics: (row.dataset.topics || '').split(' '),
    })),
  }));
  const total = years.reduce((sum, { rows }) => sum + rows.length, 0);
  const papers = n => `${n} ${n === 1 ? 'paper' : 'papers'}`;
  const known = [...select.options].map(option => option.value);

  const readState = () => {
    const params = new URLSearchParams(location.search);
    const rawTopic = params.get('topic') || '';
    const topic = known.includes(rawTopic) ? rawTopic : '';
    const hasHashRow = location.hash.length > 1 && Boolean(bibliography.querySelector(`#${CSS.escape(decodeURIComponent(location.hash.slice(1)))}`));
    const view = (params.get('view') === 'all' || Boolean(topic) || hasHashRow || !selectedPanel) ? 'all' : 'selected';
    return { view, topic };
  };

  let { view, topic } = readState();

  const pushUrl = () => {
    const url = new URL(location.href);
    if (topic) {
      url.searchParams.set('topic', topic);
      url.searchParams.delete('view');
    } else {
      url.searchParams.delete('topic');
      if (view === 'all') url.searchParams.set('view', 'all');
      else url.searchParams.delete('view');
    }
    history.pushState(null, '', url);
  };

  const applyView = () => {
    const showAll = view === 'all' || !selectedPanel;
    if (selectedPanel) selectedPanel.hidden = showAll;
    allPanel.hidden = !showAll;
    for (const btn of switchBtns) {
      const active = btn.dataset.bibView === (showAll ? 'all' : 'selected');
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    }
  };

  const applyFilter = () => {
    const words = fold(input.value).split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const entry of years) {
      let matches = 0;
      for (const { row, text, topics } of entry.rows) {
        const match = (!topic || topics.includes(topic)) && words.every(word => text.includes(word));
        row.hidden = !match;
        if (match) matches += 1;
      }
      entry.year.hidden = matches === 0;
      shown += matches;
    }
    select.value = topic;
    count.textContent = shown === total ? papers(total) : `${shown} of ${total} papers`;
    empty.hidden = shown > 0;
  };

  const apply = () => {
    applyView();
    applyFilter();
  };

  for (const btn of switchBtns) {
    btn.addEventListener('click', () => {
      const next = btn.dataset.bibView;
      if (next === view) return;
      view = next;
      if (view === 'selected') {
        topic = '';
        input.value = '';
      }
      pushUrl();
      apply();
    });
  }

  if (openAllBtn) {
    openAllBtn.addEventListener('click', () => {
      view = 'all';
      pushUrl();
      apply();
      pageRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
      input.focus({ preventScroll: true });
    });
  }

  select.addEventListener('change', () => {
    topic = select.value;
    view = 'all';
    pushUrl();
    apply();
  });

  input.addEventListener('input', applyFilter);
  input.addEventListener('focus', () => {
    if (matchMedia('(max-width: 767px)').matches) bibliography.scrollIntoView({ block: 'start' });
  });

  const reveal = () => {
    if (location.hash.length <= 1) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const row = document.getElementById(id);
    if (row && bibliography.contains(row)) {
      view = 'all';
      apply();
      row.scrollIntoView();
    }
  };

  addEventListener('popstate', () => {
    ({ view, topic } = readState());
    apply();
  });
  addEventListener('hashchange', reveal);

  apply();
  reveal();
}
