// Theme toggle with persistence + auto detection
(function () {
  const KEY = 'na-theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initial);

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const setIcon = () => {
      btn.textContent = root.getAttribute('data-theme') === 'dark' ? '🌞' : '🌙';
    };
    setIcon();
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
      setIcon();
    });
  });
})();

// Pointer-tracked card glow
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.app-card').forEach((card) => {
    const r = card.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Render apps into a grid
async function renderApps(targetId, opts = {}) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const res = await fetch('/data/apps.json', { cache: 'no-store' });
    const apps = await res.json();
    target.innerHTML = apps.map(appCard).join('');
  } catch (e) {
    target.innerHTML = '<p style="color:var(--text-mute)">Could not load apps.</p>';
  }
}

function appCard(a) {
  const accent = a.accent || 'var(--accent)';
  const tags = (a.tech || []).map((t) => `<span class="tag">${t}</span>`).join('');
  const links = a.links || {};
  const actions = [];
  if (links.page) actions.push(`<a class="pill" href="${links.page}">Visit page →</a>`);
  if (links.play) actions.push(`<a class="pill" target="_blank" rel="noopener" href="${links.play}">Google Play</a>`);
  if (links.appstore) actions.push(`<a class="pill" target="_blank" rel="noopener" href="${links.appstore}">App Store</a>`);
  if (links.github) actions.push(`<a class="pill" target="_blank" rel="noopener" href="${links.github}">GitHub</a>`);
  return `
    <a class="app-card" href="${links.page || '#'}" style="--card-accent:${accent}">
      <div class="app-head">
        <div class="app-icon">${a.logo ? `<img src="${a.logo}" alt="${a.name} logo" loading="lazy" />` : ''}</div>
        <div>
          <h3>${a.name}</h3>
          <p class="app-tagline">${a.tagline || ''}</p>
        </div>
      </div>
      <p class="app-desc">${a.description || ''}</p>
      <div class="tags">${tags}</div>
      <div class="app-actions">${actions.join('')}</div>
    </a>
  `;
}

// Render talks
async function renderTalks(targetId, opts = {}) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const res = await fetch('/data/talks.json', { cache: 'no-store' });
    let talks = await res.json();
    talks = talks.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (opts.limit) talks = talks.slice(0, opts.limit);
    target.innerHTML = talks.map(talkCard).join('');
  } catch (e) {
    target.innerHTML = '<p style="color:var(--text-mute)">Could not load talks.</p>';
  }
}

function talkCard(t) {
  const tags = (t.tags || []).map((tg) => `<span class="tag">${tg}</span>`).join('');
  const events = (t.events || []).map((e) => `<span class="tag">${e}</span>`).join('');
  const actions = [];
  if (t.videoUrl) actions.push(`<a class="pill" target="_blank" rel="noopener" href="${t.videoUrl}">▶ Watch</a>`);
  if (t.slides) actions.push(`<a class="pill" target="_blank" rel="noopener" href="${t.slides}">Slides</a>`);
  return `
    <article class="talk-card">
      <div class="talk-year">${t.year || ''}</div>
      <div class="talk-body">
        <h3>${t.title}</h3>
        <p class="talk-abstract">${t.abstract}</p>
        <div class="talk-meta">${tags}${events}</div>
      </div>
      <div class="talk-actions">${actions.join('')}</div>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderApps('appsGrid');
  renderTalks('talksList', { limit: window.__talksLimit });
});
