const root = document.documentElement;
const toggle = document.querySelector('[data-theme-toggle]');
const system = matchMedia('(prefers-color-scheme: dark)');
let manual = false;
try { manual = Boolean(localStorage.getItem('theme')); } catch { /* Storage is optional. */ }

function setTheme(theme) {
  root.dataset.theme = theme;
  toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

toggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  manual = true;
  try { localStorage.setItem('theme', next); } catch { /* Keep this page's choice. */ }
});
system.addEventListener('change', event => {
  if (!manual) setTheme(event.matches ? 'dark' : 'light');
});
setTheme(root.dataset.theme);
