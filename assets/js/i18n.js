/* Client-side language detection (EN default, PL for Poland)
   - ?lang=pl or ?lang=en overrides
   - cookie 'site_lang' persists selection
   - GeoIP via ipapi.co/json (best-effort)
   - fallback to navigator.language
   - minimal in-place translations for common UI strings
*/
(function () {
  'use strict';
  const COOKIE_NAME = 'site_lang';
  function getCookie(name) {
    const m = document.cookie.match('(^|;)\\s*' + name + '=([^;]+)');
    return m ? decodeURIComponent(m[2]) : null;
  }
  function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';path=/;expires=' + d.toUTCString();
  }
  function urlLang() {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('lang');
    } catch (e) { return null; }
  }
  async function geoCountry() {
    try {
      const r = await fetch('https://ipapi.co/json/', {cache:'no-cache'});
      if (r.ok) {
        const j = await r.json();
        if (j && j.country_code) return j.country_code;
      }
    } catch(e) {}
    return null;
  }
  function navPrefersPolish() {
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || '';
    return nav.toLowerCase().startsWith('pl');
  }
  const translations = {
    pl: {
      title: 'NowakApps — Mikołaj Nowak · Aplikacje indie, prelekcje, narzędzia AI',
      meta_description: "NowakApps to miejsce Mikołaja Nowaka: aplikacje indie, nagrania z prelekcji i narzędzia AI.",
      nav: ['Aplikacje','Prelekcje','Narzędzia AI','O mnie'],
      hero: {
        eyebrow: 'NowakApps · Mikołaj Nowak',
        h1: 'Tworzę <span class="grad-teal">aplikacje indie</span>, prowadzę <span class="grad-orange">prelekcje</span> i eksperymentuję z narzędziami AI.',
        lead: 'Jednoosobowe studio tworzące aplikacje mobilne i materiały konferencyjne. Tutaj znajdziesz moje aplikacje, nagrania z wystąpień i narzędzia AI.',
        ctaBrowse: 'Przeglądaj aplikacje',
        ctaTalks: 'Zobacz prelekcje'
      },
      latest_release: 'Najnowsze wydanie',
      hero_card_view_project: 'Zobacz stronę projektu →',
      section_titles: {
        apps: 'Aplikacje',
        talks: 'Prelekcje',
        ai_tools: 'Narzędzia AI'
      },
      footer: {
        github: 'GitHub',
        linkedin: 'LinkedIn'
      }
    }
  };
  async function decideLang() {
    const q = urlLang();
    if (q) return q.toLowerCase().startsWith('pl') ? 'pl' : 'en';
    const c = getCookie(COOKIE_NAME);
    if (c) return c;
    const country = await geoCountry();
    if (country === 'PL') return 'pl';
    if (navPrefersPolish()) return 'pl';
    return 'en';
  }
  function applyTranslations(lang) {
    if (lang !== 'pl') {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-site-lang','en');
      return;
    }
    const t = translations.pl;
    document.documentElement.lang = 'pl';
    document.documentElement.setAttribute('data-site-lang','pl');
    try { if (t.title) document.title = t.title; } catch(e){}
    try {
      const md = document.querySelector('meta[name="description"]');
      if (md && t.meta_description) md.setAttribute('content', t.meta_description);
      const ogt = document.querySelector('meta[property="og:title"]');
      if (ogt && t.title) ogt.setAttribute('content', t.title);
      const ogd = document.querySelector('meta[property="og:description"]');
      if (ogd && t.meta_description) ogd.setAttribute('content', t.meta_description);
    } catch(e) {}
    try {
      const nav = document.querySelectorAll('.nav__links a');
      if (nav && nav.length) {
        const labels = t.nav;
        for (let i=0; i<nav.length && i<labels.length; i++) nav[i].textContent = labels[i];
      }
    } catch(e){}
    try {
      const eyebrow = document.querySelector('.eyebrow');
      if (eyebrow && t.hero.eyebrow) eyebrow.textContent = t.hero.eyebrow;
      const h1 = document.querySelector('.hero h1');
      if (h1 && t.hero.h1) h1.innerHTML = t.hero.h1;
      const lead = document.querySelector('.lead');
      if (lead && t.hero.lead) lead.textContent = t.hero.lead;
      const ctas = document.querySelectorAll('.hero__cta a');
      if (ctas && ctas.length >= 2) {
        ctas[0].textContent = t.hero.ctaBrowse;
        ctas[1].textContent = t.hero.ctaTalks;
      }
      const hrh3 = document.querySelector('.hero__card h3');
      if (hrh3 && t.latest_release) hrh3.textContent = t.latest_release;
      const cardLink = document.querySelector('.hero__card-row a');
      if (cardLink && t.hero_card_view_project) cardLink.textContent = t.hero_card_view_project;
    } catch(e){}
    try {
      const appsH2 = document.querySelector('#apps .section__head h2');
      if (appsH2 && t.section_titles.apps) appsH2.textContent = t.section_titles.apps;
      const talksH2 = document.querySelector('#talks .section__head h2');
      if (talksH2 && t.section_titles.talks) talksH2.textContent = t.section_titles.talks;
      const aiH2 = document.querySelector('.section[data-render="ai-tools"]')?.closest('.section')?.querySelector('.section__head h2');
      if (aiH2 && t.section_titles.ai_tools) aiH2.textContent = t.section_titles.ai_tools;
    } catch(e){}
    window.dispatchEvent(new CustomEvent('site:lang', {detail:{lang:'pl'}}));
  }
  decideLang().then(lang=>{
    setCookie(COOKIE_NAME, lang);
    applyTranslations(lang);
  });
})();
