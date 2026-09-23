const root = document.documentElement;
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Theme toggle ---------- */
const themeButton = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const syncTheme = () => {
  const dark = root.dataset.theme === 'dark';
  themeButton?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeColor?.setAttribute('content', dark ? '#07111d' : '#f5f8f8');
};
syncTheme();
themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage unavailable */ }
  syncTheme();
});

/* ---------- Mobile menu ---------- */
const menuButton = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
menuButton?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuButton.focus(); }
});
document.addEventListener('click', (e) => {
  if (nav.classList.contains('is-open') && !e.target.closest('.nav-pill')) setMenu(false);
});

/* ---------- Layer filter ---------- */
const filterButtons = [...document.querySelectorAll('.layer-filter button')];
const cards = [...document.querySelectorAll('.bento .card')];
const filterStatus = document.querySelector('.filter-status');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const layer = button.dataset.layer;
    filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    let matches = 0;
    cards.forEach((card) => {
      const hit = layer === 'all' || card.dataset.layers.split(' ').includes(layer);
      card.classList.toggle('is-dimmed', !hit);
      if (hit) matches += 1;
    });
    filterStatus.textContent = layer === 'all'
      ? ''
      : `${matches} ${matches === 1 ? 'project touches' : 'projects touch'} ${button.textContent.trim().toLowerCase()}.`;
  });
});

/* ---------- Copy email ---------- */
const copyStatus = document.querySelector('.copy-status');
document.querySelector('.copy-email')?.addEventListener('click', async (e) => {
  const email = e.currentTarget.dataset.email;
  try { await navigator.clipboard.writeText(email); copyStatus.textContent = 'Email address copied'; }
  catch { copyStatus.textContent = `Copy failed. The address is ${email}`; }
  clearTimeout(copyStatus._t);
  copyStatus._t = setTimeout(() => { copyStatus.textContent = ''; }, 3000);
});

/* ---------- Contact form: drafts an email, no backend needed ---------- */
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get('name') || '').trim();
  const message = (data.get('message') || '').trim();
  const error = form.querySelector('.form-error');
  form.name.setAttribute('aria-invalid', String(!name));
  form.message.setAttribute('aria-invalid', String(!message));
  if (!name || !message) {
    error.textContent = !name && !message ? 'Add your name and a short message.' : !name ? 'Add your name.' : 'Add a short message.';
    (!name ? form.name : form.message).focus();
    return;
  }
  error.textContent = '';
  const company = (data.get('company') || '').trim();
  const role = (data.get('role') || '').trim();
  const subject = role ? `Role: ${role}${company ? ` at ${company}` : ''}` : `Hello from ${name}${company ? `, ${company}` : ''}`;
  const body = [message, '', `${name}${company ? `, ${company}` : ''}`].join('\n');
  window.location.href = `mailto:shaibis@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

/* ---------- Active nav link ---------- */
const navLinks = [...document.querySelectorAll('nav a')];
const sections = navLinks.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => {
        if (l.getAttribute('href') === `#${entry.target.id}`) l.setAttribute('aria-current', 'location');
        else l.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => io.observe(s));
}

/* ---------- Open collapsed details when printing ---------- */
addEventListener('beforeprint', () => document.querySelectorAll('details').forEach((d) => { d.dataset.was = d.open; d.open = true; }));
addEventListener('afterprint', () => document.querySelectorAll('details').forEach((d) => { d.open = d.dataset.was === 'true'; }));
