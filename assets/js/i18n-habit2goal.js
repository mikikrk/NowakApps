/* i18n-habit2goal.js: load canonical Polish JSON at runtime and apply translations */
(function () {
  'use strict';
  const URL = '/assets/locales/pl/habit2goal.json';

  function setButtonText(btn, label) {
    if (!btn) return;
    try {
      const svg = btn.querySelector('svg');
      const svgHtml = svg ? svg.outerHTML : '';
      btn.innerHTML = svgHtml + ' ' + label;
    } catch (e) {}
  }

  function applyTranslations(t) {
    try { document.documentElement.lang = 'pl'; document.documentElement.setAttribute('data-site-lang','pl'); } catch(e) {}
    try { if (t.title) document.title = t.title; } catch(e) {}
    try { const md = document.querySelector('meta[name="description"]'); if (md && t.meta_description) md.setAttribute('content', t.meta_description); } catch(e) {}
    try { const ogt = document.querySelector('meta[property="og:title"]'); if (ogt && t.og_title) ogt.setAttribute('content', t.og_title); const ogd = document.querySelector('meta[property="og:description"]'); if (ogd && t.og_description) ogd.setAttribute('content', t.og_description); } catch(e) {}
    try {
      const nav = document.querySelector('.nav__links');
      if (nav) {
        const links = nav.querySelectorAll('a');
        if (links.length >= 4) {
          links[0].textContent = t.nav_economy || links[0].textContent;
          links[1].textContent = t.nav_features || links[1].textContent;
          links[2].textContent = t.nav_stats || links[2].textContent;
          links[3].textContent = t.nav_faq || links[3].textContent;
        }
      }
    } catch(e) {}
    try { const eyebrow = document.querySelector('.hero .eyebrow'); if (eyebrow && t.hero_eyebrow) eyebrow.textContent = t.hero_eyebrow; } catch(e) {}
    try { const h1 = document.querySelector('.hero__headline'); if (h1 && t.hero_h1) h1.innerHTML = t.hero_h1; } catch(e) {}
    try { const sub = document.querySelector('.hero__sub'); if (sub && t.hero_sub) sub.textContent = t.hero_sub; } catch(e) {}
    try { const ctaPri = document.querySelector('.hero__cta .btn--primary'); setButtonText(ctaPri, t.hero_cta_primary); const ctaSec = document.querySelector('.hero__cta .btn--ghost'); if (ctaSec && t.hero_cta_secondary) ctaSec.textContent = t.hero_cta_secondary; } catch(e) {}
    try { const ctaEyebrow = document.querySelector('.cta-card .eyebrow'); if (ctaEyebrow && t.cta_eyebrow) ctaEyebrow.textContent = t.cta_eyebrow; const ctaH2 = document.querySelector('.cta-card h2'); if (ctaH2 && t.cta_h2) ctaH2.innerHTML = t.cta_h2; const ctaP = document.querySelector('.cta-card p'); if (ctaP && t.cta_p) ctaP.textContent = t.cta_p; } catch(e) {}
    window.dispatchEvent(new CustomEvent('site:lang', {detail:{lang:'pl'}}));
  }

  async function loadAndApply() {
    try {
      const res = await fetch(URL, {cache: 'no-cache'});
      if (!res.ok) return;
      const json = await res.json();
      applyTranslations(json);
    } catch (e) { /* fail silently — keep original English */ }
  }

  // Apply if site already set to pl, and always attempt to load (no-op if not used)
  if (document.documentElement.getAttribute('data-site-lang') === 'pl') loadAndApply();
  window.addEventListener('site:lang', function (e) { if (e && e.detail && e.detail.lang === 'pl') loadAndApply(); });
  // Also try to load proactively to ensure translations apply even if data-site-lang was set earlier
  loadAndApply();
})();
