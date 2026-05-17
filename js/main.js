// Auto language redirect (first visit only — respects manual choice afterwards)
(function () {
  const PREF_KEY = 'varte-lang';
  const isEnPage = window.location.pathname.startsWith('/en');

  // Save preference when user manually clicks a language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem(PREF_KEY, btn.textContent.trim().toLowerCase());
    });
  });

  // Skip if user already made a manual choice
  if (localStorage.getItem(PREF_KEY)) return;

  const lang = (navigator.language || '').toLowerCase();
  const isUkrainian = lang.startsWith('uk');

  if (!isEnPage && !isUkrainian) {
    localStorage.setItem(PREF_KEY, 'en');
    window.location.replace('/en/');
  } else if (isEnPage && isUkrainian) {
    localStorage.setItem(PREF_KEY, 'ua');
    window.location.replace('/');
  }
})();

// Copyright year
const yearEl = document.getElementById('copy-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Screenshots carousel dots (mobile only)
(function () {
  const grid = document.querySelector('.screenshots-grid');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.screenshot-item'));
  if (items.length < 2) return;

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

  const dots = items.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Слайд ' + (i + 1));
    btn.addEventListener('click', () => scrollTo(i));
    dotsContainer.appendChild(btn);
    return btn;
  });

  grid.parentElement.appendChild(dotsContainer);

  function updateDots() {
    const center = grid.scrollLeft + grid.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    items.forEach((item, i) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(center - itemCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === closest));
  }

  function scrollTo(index) {
    const item = items[index];
    const target = item.offsetLeft + item.offsetWidth / 2 - grid.clientWidth / 2;
    grid.scrollTo({ left: target, behavior: 'smooth' });
  }

  grid.addEventListener('scroll', updateDots, { passive: true });

  let current = 0;
  function advance() {
    current = (current + 1) % items.length;
    scrollTo(current);
  }

  let timer = setInterval(advance, 3000);

  // Pause on user interaction, resume after
  grid.addEventListener('touchstart', () => clearInterval(timer), { passive: true });
  grid.addEventListener('touchend', () => { timer = setInterval(advance, 3000); }, { passive: true });
})();
