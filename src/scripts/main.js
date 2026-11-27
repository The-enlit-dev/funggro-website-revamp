// Progressive enhancement only — every section works without this file.
const root = document.documentElement;
root.classList.add('js');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Current page in navigation
const page = document.body.dataset.page;
document.querySelectorAll(`[data-nav="${page}"]`).forEach((a) => a.setAttribute('aria-current', 'page'));

// Header state on scroll
const header = document.querySelector('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

// Mobile menu (<dialog> gives focus trapping and Esc handling)
const menu = document.getElementById('menu');
const openBtn = document.querySelector('[data-menu-open]');
if (menu && openBtn && typeof menu.showModal === 'function') {
  const close = () => { if (menu.open) menu.close(); };
  openBtn.addEventListener('click', () => { menu.showModal(); openBtn.setAttribute('aria-expanded', 'true'); });
  menu.addEventListener('close', () => { openBtn.setAttribute('aria-expanded', 'false'); openBtn.focus(); });
  menu.querySelector('[data-menu-close]')?.addEventListener('click', close);
  menu.addEventListener('click', (e) => { if (e.target === menu || e.target.closest('a')) close(); });
  matchMedia('(min-width: 64rem)').addEventListener('change', (e) => { if (e.matches) close(); });
  openBtn.setAttribute('aria-expanded', 'false');
}

// Reveal groups as they enter the viewport
const reveals = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// How it works: sync the sticky phone with the step in view (desktop layout)
const screens = document.querySelectorAll('[data-step-screens] picture');
const steps = document.querySelectorAll('[data-step]');
if (screens.length && steps.length && 'IntersectionObserver' in window) {
  const setActive = (i) => {
    steps.forEach((s, j) => s.classList.toggle('is-active', i === j));
    screens.forEach((p, j) => p.classList.toggle('is-active', i === j));
  };
  const stepIO = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.step));
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => stepIO.observe(s));
}

// Story rail: previous / next buttons
document.querySelectorAll('[data-rail]').forEach((rail) => {
  const controls = rail.parentElement.querySelector('[data-rail-controls]');
  if (!controls) return;
  const prev = controls.querySelector('[data-rail-prev]');
  const next = controls.querySelector('[data-rail-next]');
  controls.hidden = false;
  const step = () => (rail.querySelector('li')?.getBoundingClientRect().width || 300) + 24;
  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth - 2;
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max;
  };
  const behavior = reduceMotion.matches ? 'auto' : 'smooth';
  prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior }));
  next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior }));
  rail.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
});
