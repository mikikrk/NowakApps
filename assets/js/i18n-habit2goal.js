/* i18n-habit2goal.js: applies Polish translations for Habit2Goal page when data-site-lang === 'pl' */
(function () {
  'use strict';
  const t = {
    "title": "Habit2Goal — Buduj nawyki. Zbieraj punkty. Kup sobie rzeczy, które naprawdę chcesz.",
    "meta_description": "Habit2Goal zamienia Twoje codzienne nawyki w punkty, które finansują realne nagrody wybrane przez Ciebie. Tracker nawyków z ekonomią celów — nie tylko liczeniem serii.",
    "og_title": "Habit2Goal — Ekonomia nawyków",
    "og_description": "Każdy nawyk ma wartość. Każdy cel ma cenę. Przestań śledzić serie. Zacznij zdobywać rzeczy, których pragniesz.",
    "hero_eyebrow": "Ekonomia nawyków",
    "hero_h1": "A gdyby każdy dobry nawyk <span class=\"grad-teal\">zarabiałby punkty</span> na Twoją następną nagrodę?",
    "hero_sub": "Przypisz punkty do swoich nawyków. Wyceń swoje cele w punktach. Wydaj zdobytą dyscyplinę na nagrody, które wybrałeś — wakacje, karnet na siłownię, ekspres do kawy, który ciągle prawie kupujesz.",
    "hero_cta_primary": "Pobierz Habit2Goal",
    "hero_cta_secondary": "Zobacz, jak to działa",
    "nav_economy": "Idea",
    "nav_features": "Funkcje",
    "nav_stats": "Statystyki",
    "nav_faq": "FAQ",
    "steps_heading": "Trzy kroki. Jedna pętla informacji zwrotnej, która wreszcie <em>ma</em> znaczenie.",
    "step1_title": "Ustal cenę rzeczy, którą chcesz",
    "step1_desc": "Nazwij swój cel. Dodaj zdjęcie okładkowe. Zdecyduj, ile punktów ma kosztować — weekendowy wyjazd, nowy gadżet, sześć miesięcy kawy bez wyrzutów sumienia.",
    "step2_title": "Nadaj każdemu nawykowi realną wartość",
    "step2_desc": "8 szklanek wody = +5. Siłownia = +14. Pominąłeś kawiarnię = +5. Złamałeś zakazany nawyk? Tracisz punkty. Rozliczalność z pazurem, nie tylko pole wyboru.",
    "step3_title": "Odbierz nagrodę, gdy naprawdę na nią zapracujesz",
    "step3_desc": "Osiągnij cel. Kup to. <strong>Bez wyrzutów sumienia.</strong> Cel trafia do Twojej historii — trwały dowód dyscypliny, która go sfinansowała.",
    "features_headline": "Stworzony dla ludzi, którzy <span class=\"grad-teal\">idą do przodu</span> — nie tylko są zajęci.",
    "feature1_title": "Dziś, z celem na widoku",
    "feature1_desc": "Twój aktywny cel znajduje się u góry ekranu głównego z pierścieniem postępu w czasie rzeczywistym i prognozą tempa. Poniżej — dzisiejsze nawyki: stuknij +, aby przypisać punkty, jeśli wykonasz nawyk, − aby odjąć, gdy poczujesz, że zawiodłeś. Cała rutyna mieści się na jednym ekranie w zasięgu kciuka.",
    "cta_eyebrow": "Gotowe, kiedy Ty będziesz",
    "cta_h2": "Buduj nawyki. Osiągaj cele. <br/><span class=\"grad-teal\">Kup to.</span>",
    "cta_p": "Dostępne na iOS i Android. Zainstaluj w mniej niż minutę i rozpocznij pierwszy nawyk już dziś.",
    "faq_heading": "Szybkie pytania, szczere odpowiedzi.",
    "footer_brand_line": "Habit2Goal · Ekonomia nawyków"
  };

  function setButtonText(btn, label) {
    if (!btn) return;
    try {
      const svg = btn.querySelector('svg');
      const svgHtml = svg ? svg.outerHTML : '';
      btn.innerHTML = svgHtml + ' ' + label;
    } catch (e) {}
  }

  function apply() {
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

  if (document.documentElement.getAttribute('data-site-lang') === 'pl') apply();
  window.addEventListener('site:lang', function (e) { if (e && e.detail && e.detail.lang === 'pl') apply(); });
})();
