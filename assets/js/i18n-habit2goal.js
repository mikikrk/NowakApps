/* i18n-habit2goal.js: load canonical Polish JSON at runtime and apply translations (full mapping + robust path + FOUC reduction) */
(function () {
  'use strict';
  let loaded = false;

  function getCookie(name) {
    const m = document.cookie.match('(^|;)\\s*' + name + '=([^;]+)');
    return m ? decodeURIComponent(m[2]) : null;
  }
  function urlLang() {
    try { const p = new URLSearchParams(window.location.search); return p.get('lang'); } catch (e) { return null; }
  }

  // derive JSON URL relative to this script to be robust under subpath hosting
  const scriptEl = document.currentScript || document.querySelector('script[src$="i18n-habit2goal.js"]');
  let JSON_URL = '/assets/locales/pl/habit2goal.json';
  if (scriptEl && scriptEl.src) {
    try {
      JSON_URL = scriptEl.src.replace('/assets/js/i18n-habit2goal.js', '/assets/locales/pl/habit2goal.json');
    } catch (e) { /* fallback to absolute */ }
  }

  // Quick FOUC mitigation: if cookie or ?lang=pl is present, set lang before fetch
  const initialLang = (urlLang() || getCookie('site_lang') || '').toLowerCase();
  if (initialLang && initialLang.startsWith('pl')) {
    try { document.documentElement.lang = 'pl'; document.documentElement.setAttribute('data-site-lang', 'pl'); } catch (e) {}
  }

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

    // Nav
    try {
      const nav = document.querySelector('.nav__links');
      if (nav) {
        const links = nav.querySelectorAll('a');
        if (links.length >= 4) {
          if (t.nav_economy) links[0].textContent = t.nav_economy;
          if (t.nav_features) links[1].textContent = t.nav_features;
          if (t.nav_stats) links[2].textContent = t.nav_stats;
          if (t.nav_faq) links[3].textContent = t.nav_faq;
        }
      }
    } catch (e) {}

    // Hero
    try { const eyebrow = document.querySelector('.hero .eyebrow'); if (eyebrow && t.hero_eyebrow) eyebrow.textContent = t.hero_eyebrow; } catch (e) {}
    try { const h1 = document.querySelector('.hero__headline'); if (h1 && t.hero_h1) h1.innerHTML = t.hero_h1; } catch (e) {}
    try { const sub = document.querySelector('.hero__sub'); if (sub && t.hero_sub) sub.textContent = t.hero_sub; } catch (e) {}
    try { const ctaPri = document.querySelector('.hero__cta .btn--primary'); setButtonText(ctaPri, t.hero_cta_primary); const ctaSec = document.querySelector('.hero__cta .btn--ghost'); if (ctaSec && t.hero_cta_secondary) ctaSec.textContent = t.hero_cta_secondary; } catch (e) {}

    // Steps section
    try {
      const steps = document.querySelectorAll('#economy .steps .step');
      if (steps && steps.length >= 3) {
        if (t.step1_title) { const el = steps[0].querySelector('h3'); if (el) el.textContent = t.step1_title; }
        if (t.step1_desc) { const el = steps[0].querySelector('p'); if (el) el.textContent = t.step1_desc; }
        if (t.step2_title) { const el = steps[1].querySelector('h3'); if (el) el.textContent = t.step2_title; }
        if (t.step2_desc) { const el = steps[1].querySelector('p'); if (el) el.textContent = t.step2_desc; }
        if (t.step3_title) { const el = steps[2].querySelector('h3'); if (el) el.textContent = t.step3_title; }
        if (t.step3_desc) { const el = steps[2].querySelector('p'); if (el) el.textContent = t.step3_desc; }
      }
      // Steps heading
      const economyH2 = document.querySelector('#economy .section__head h2');
      if (economyH2 && t.steps_heading) economyH2.innerHTML = t.steps_heading;
    } catch (e) {}

    // Features
    try {
      const featHead = document.querySelector('#features .section__head h2'); if (featHead && t.features_headline) featHead.innerHTML = t.features_headline;
      const featureCopies = document.querySelectorAll('#features .feature .feature__copy');
      if (featureCopies.length) {
        if (t.feature1_title) { const el = featureCopies[0].querySelector('h3'); if (el) el.textContent = t.feature1_title; }
        if (t.feature1_desc) { const el = featureCopies[0].querySelector('p'); if (el) el.textContent = t.feature1_desc; }
        // map additional features if present in JSON
        if (featureCopies[1]) {
          if (t.feature2_title) { const el = featureCopies[1].querySelector('h3'); if (el) el.textContent = t.feature2_title; }
          if (t.feature2_desc) { const el = featureCopies[1].querySelector('p'); if (el) el.textContent = t.feature2_desc; }
        }
        if (featureCopies[2]) {
          if (t.feature3_title) { const el = featureCopies[2].querySelector('h3'); if (el) el.textContent = t.feature3_title; }
          if (t.feature3_desc) { const el = featureCopies[2].querySelector('p'); if (el) el.textContent = t.feature3_desc; }
        }
      }
    } catch (e) {}

    // Stats section heading (if provided)
    try { const statsH2 = document.querySelector('#stats .section__head h2'); if (statsH2 && t.stats_heading) statsH2.innerHTML = t.stats_heading; } catch (e) {}

    // CTA card
    try { const ctaEyebrow = document.querySelector('.cta-card .eyebrow'); if (ctaEyebrow && t.cta_eyebrow) ctaEyebrow.textContent = t.cta_eyebrow; const ctaH2 = document.querySelector('.cta-card h2'); if (ctaH2 && t.cta_h2) ctaH2.innerHTML = t.cta_h2; const ctaP = document.querySelector('.cta-card p'); if (ctaP && t.cta_p) ctaP.textContent = t.cta_p; } catch (e) {}

    // FAQ
    try { const faqH2 = document.querySelector('#faq .section__head h2'); if (faqH2 && t.faq_heading) faqH2.textContent = t.faq_heading; } catch (e) {}

    // Footer brand line — preserve <strong> brand element and set the following span
    try {
      const footerSpan = document.querySelector('.footer__brand span');
      if (footerSpan && t.footer_brand_line) {
        const parts = t.footer_brand_line.split('·');
        if (parts.length > 1) footerSpan.textContent = '· ' + parts[1].trim(); else footerSpan.textContent = t.footer_brand_line;
      }
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('site:lang', {detail:{lang:'pl'}}));
  }

  async function loadAndApply() {
    if (loaded) return;
    loaded = true;
    try {
      const res = await fetch(JSON_URL, {cache: 'no-cache'});
      if (!res.ok) {
        console.warn('i18n: habit2goal JSON fetch failed', res.status);
        return;
      }
      const json = await res.json();
      applyTranslations(json);
    } catch (e) { console.warn('i18n-habit2goal load error', e); }
  }

  // wire up: if page already flagged as pl, load; also load proactively if cookie/url indicates pl
  if (document.documentElement.getAttribute('data-site-lang') === 'pl') loadAndApply();
  window.addEventListener('site:lang', function (e) { if (e && e.detail && e.detail.lang === 'pl') loadAndApply(); });
  if (initialLang && initialLang.startsWith('pl')) loadAndApply();
  // also attempt a passive load so returning users get translations quickly
  loadAndApply();
})();
