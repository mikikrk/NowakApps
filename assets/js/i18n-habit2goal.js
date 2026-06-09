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

  // sanitize small set of HTML tags from translations to prevent XSS
  function sanitizeHTML(input){
    if (!input) return '';
    const tmp = document.createElement('template');
    tmp.innerHTML = input;
    const ALLOWED = ['SPAN','EM','STRONG','BR'];
    const nodes = tmp.content.querySelectorAll('*');
    for (const n of Array.from(nodes)){
      if (!ALLOWED.includes(n.tagName)) {
        n.replaceWith(document.createTextNode(n.textContent || ''));
      } else {
        if (n.tagName === 'SPAN') {
          const cls = n.getAttribute('class') || '';
          if (!/grad-(teal|orange)/.test(cls)) n.removeAttribute('class');
        }
      }
    }
    return tmp.innerHTML;
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
      // insert svg markup, then append a text node for the label (prevents HTML injection)
      btn.innerHTML = svgHtml;
      const textNode = document.createTextNode(' ' + (label || ''));
      btn.appendChild(textNode);
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
    try { const h1 = document.querySelector('.hero__headline'); if (h1 && t.hero_h1) h1.innerHTML = sanitizeHTML(t.hero_h1); } catch (e) {}
    try { const sub = document.querySelector('.hero__sub'); if (sub && t.hero_sub) sub.textContent = t.hero_sub; } catch (e) {}
    try {
      const ctaPri = document.querySelector('.hero__cta .btn--primary');
      setButtonText(ctaPri, t.hero_cta_primary);
      const ctaSec = document.querySelector('.hero__cta .btn--ghost');
      if (ctaSec && t.hero_cta_secondary) ctaSec.textContent = t.hero_cta_secondary;

      // Map hero jump links to the same nav labels to avoid untranslated duplicates
      try {
        const jumpLinks = document.querySelectorAll('.hero__jumplinks a');
        if (jumpLinks && jumpLinks.length >= 4) {
          if (t.nav_economy) jumpLinks[0].textContent = t.nav_economy;
          if (t.nav_features) jumpLinks[1].textContent = t.nav_features;
          if (t.nav_stats) jumpLinks[2].textContent = t.nav_stats;
          if (t.nav_faq) jumpLinks[3].textContent = t.nav_faq;
        }
      } catch (ee) {}
    } catch (e) {}

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
      if (economyH2 && t.steps_heading) economyH2.innerHTML = sanitizeHTML(t.steps_heading);
    } catch (e) {}

    // Features
    try {
      const featHead = document.querySelector('#features .section__head h2'); if (featHead && t.features_headline) featHead.innerHTML = sanitizeHTML(t.features_headline);
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
        if (featureCopies[3]) {
          if (t.feature4_title) { const el = featureCopies[3].querySelector('h3'); if (el) el.textContent = t.feature4_title; }
          if (t.feature4_desc) { const el = featureCopies[3].querySelector('p'); if (el) el.textContent = t.feature4_desc; }
        }
        // Bullet lists for all features
        const bulletMap = [
          ['feature1_bullet1','feature1_bullet2','feature1_bullet3'],
          ['feature2_bullet1','feature2_bullet2','feature2_bullet3'],
          ['feature3_bullet1','feature3_bullet2','feature3_bullet3'],
          ['feature4_bullet1','feature4_bullet2','feature4_bullet3'],
        ];
        Array.from(featureCopies).forEach(function(fc, i) {
          if (!bulletMap[i]) return;
          const lis = fc.querySelectorAll('.bullets li');
          bulletMap[i].forEach(function(key, j) { if (lis[j] && t[key]) lis[j].textContent = t[key]; });
        });
      }
    } catch (e) {}

    // Stats section
    try {
      const statsH2 = document.querySelector('#stats .section__head h2'); if (statsH2 && t.stats_heading) statsH2.innerHTML = sanitizeHTML(t.stats_heading);
      const statsEyebrow = document.querySelector('#stats .section__head .eyebrow'); if (statsEyebrow && t.stats_eyebrow) statsEyebrow.textContent = t.stats_eyebrow;
      const statsLead = document.querySelector('#stats .section__head .section__lead'); if (statsLead && t.stats_lead) statsLead.textContent = t.stats_lead;
      const statCards = document.querySelectorAll('#stats .stat-card');
      if (statCards[0]) { const h = statCards[0].querySelector('h4'); const p = statCards[0].querySelector('p'); if (h && t.stat1_title) h.textContent = t.stat1_title; if (p && t.stat1_desc) p.textContent = t.stat1_desc; }
      if (statCards[1]) { const h = statCards[1].querySelector('h4'); const p = statCards[1].querySelector('p'); if (h && t.stat2_title) h.textContent = t.stat2_title; if (p && t.stat2_desc) p.textContent = t.stat2_desc; }
      if (statCards[2]) { const h = statCards[2].querySelector('h4'); const p = statCards[2].querySelector('p'); if (h && t.stat3_title) h.textContent = t.stat3_title; if (p && t.stat3_desc) p.textContent = t.stat3_desc; }
      const statPills = document.querySelectorAll('#stats .stat-pills li');
      ['stat_pill1','stat_pill2','stat_pill3','stat_pill4','stat_pill5'].forEach(function(k, i) { if (statPills[i] && t[k]) statPills[i].textContent = t[k]; });
    } catch (e) {}

    // CTA card
    try { const ctaEyebrow = document.querySelector('.cta-card .eyebrow'); if (ctaEyebrow && t.cta_eyebrow) ctaEyebrow.textContent = t.cta_eyebrow; const ctaH2 = document.querySelector('.cta-card h2'); if (ctaH2 && t.cta_h2) ctaH2.innerHTML = sanitizeHTML(t.cta_h2); const ctaP = document.querySelector('.cta-card p'); if (ctaP && t.cta_p) ctaP.textContent = t.cta_p; } catch (e) {}

    // Split section (who it's for / who it's not for)
    try {
      const forCol = document.querySelector('.split__col--for');
      if (forCol) {
        const h = forCol.querySelector('h3'); if (h && t.split_for_heading) h.textContent = t.split_for_heading;
        const lis = forCol.querySelectorAll('li');
        ['split_for_li1','split_for_li2','split_for_li3','split_for_li4'].forEach(function(k, i) { if (lis[i] && t[k]) lis[i].innerHTML = sanitizeHTML(t[k]); });
      }
      const notCol = document.querySelector('.split__col--not');
      if (notCol) {
        const h = notCol.querySelector('h3'); if (h && t.split_not_heading) h.textContent = t.split_not_heading;
        const lis = notCol.querySelectorAll('li');
        ['split_not_li1','split_not_li2','split_not_li3'].forEach(function(k, i) { if (lis[i] && t[k]) lis[i].innerHTML = sanitizeHTML(t[k]); });
      }
    } catch (e) {}

    // FAQ heading + individual questions and answers
    try {
      const faqH2 = document.querySelector('#faq .section__head h2'); if (faqH2 && t.faq_heading) faqH2.textContent = t.faq_heading;
      const faqDetails = document.querySelectorAll('#faq .faq details');
      const faqData = [
        { q: 'faq_q1', ps: ['faq_a1_free', 'faq_a1_premium'] },
        { q: 'faq_q2', ps: ['faq_a2'] },
        { q: 'faq_q3', ps: ['faq_a3'] },
        { q: 'faq_q4', ps: ['faq_a4'] },
        { q: 'faq_q5', ps: ['faq_a5'] },
      ];
      faqData.forEach(function(item, i) {
        const det = faqDetails[i]; if (!det) return;
        const summary = det.querySelector('summary'); if (summary && t[item.q]) summary.textContent = t[item.q];
        const ps = det.querySelectorAll('p');
        item.ps.forEach(function(key, j) { if (ps[j] && t[key]) ps[j].innerHTML = sanitizeHTML(t[key]); });
      });
    } catch (e) {}

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
})();
