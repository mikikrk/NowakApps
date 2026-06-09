/* i18n-habit2goal.js: load Polish translations for the Habit2Goal subsite */
(function () {
  'use strict';

  let loaded = false;

  function getCookie(name) {
    const m = document.cookie.match('(^|;)\\s*' + name + '=([^;]+)');
    return m ? decodeURIComponent(m[2]) : null;
  }

  function urlLang() {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('lang');
    } catch (e) {
      return null;
    }
  }

  const scriptEl = document.currentScript || document.querySelector('script[src$="i18n-habit2goal.js"]');
  let JSON_URL = '/assets/locales/pl/habit2goal.json';
  if (scriptEl && scriptEl.src) {
    try {
      JSON_URL = scriptEl.src.replace('/assets/js/i18n-habit2goal.js', '/assets/locales/pl/habit2goal.json');
    } catch (e) {
      // fall back to absolute path
    }
  }

  function sanitizeHTML(input) {
    if (!input) return '';

    const tmp = document.createElement('template');
    tmp.innerHTML = input;

    const ALLOWED = new Set([
      'A', 'BR', 'CODE', 'DIV', 'EM', 'H1', 'H2', 'H3', 'LI',
      'OL', 'P', 'SPAN', 'STRONG', 'UL'
    ]);

    const CLASS_ALLOW_RE = /^(grad-(teal|orange)|legal(__[a-z0-9-]+)?)$/;
    const SAFE_HREF_RE = /^(mailto:|https?:\/\/|index\.html$|privacy\.html$|#)/i;

    for (const node of Array.from(tmp.content.querySelectorAll('*'))) {
      if (!ALLOWED.has(node.tagName)) {
        node.replaceWith(document.createTextNode(node.textContent || ''));
        continue;
      }

      for (const attr of Array.from(node.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        if (name === 'class') {
          if (!CLASS_ALLOW_RE.test(value)) node.removeAttribute(attr.name);
          continue;
        }

        if (name === 'href' && node.tagName === 'A') {
          if (!SAFE_HREF_RE.test(value)) node.removeAttribute(attr.name);
          continue;
        }

        if (name === 'target' && node.tagName === 'A') {
          if (value !== '_blank') node.removeAttribute(attr.name);
          continue;
        }

        if (name === 'rel' && node.tagName === 'A') {
          if (!/^[a-z\s-]+$/i.test(value)) node.removeAttribute(attr.name);
          continue;
        }

        if (name === 'aria-label' && (node.tagName === 'UL' || node.tagName === 'A')) {
          continue;
        }

        if (name === 'id' && node.tagName === 'SPAN' && value === 'year') {
          continue;
        }

        node.removeAttribute(attr.name);
      }
    }

    return tmp.innerHTML;
  }

  const initialLang = (urlLang() || getCookie('site_lang') || '').toLowerCase();
  if (initialLang && initialLang.startsWith('pl')) {
    try {
      document.documentElement.lang = 'pl';
      document.documentElement.setAttribute('data-site-lang', 'pl');
    } catch (e) {
      // ignore
    }
  }

  function setText(el, value) {
    if (el && value != null) el.textContent = value;
  }

  function setHTML(el, value) {
    if (el && value != null) el.innerHTML = sanitizeHTML(value);
  }

  function setAttr(el, attr, value) {
    if (el && value != null) el.setAttribute(attr, value);
  }

  function setButtonText(btn, label) {
    if (!btn || label == null) return;
    try {
      const svg = btn.querySelector('svg');
      const svgHtml = svg ? svg.outerHTML : '';
      btn.innerHTML = svgHtml;
      btn.appendChild(document.createTextNode(' ' + label));
    } catch (e) {
      // ignore
    }
  }

  function setLinkTexts(links, values) {
    if (!links || !values) return;
    for (let i = 0; i < links.length && i < values.length; i += 1) {
      setText(links[i], values[i]);
    }
  }

  function applyMeta(meta) {
    if (!meta) return;

    try {
      if (meta.title) document.title = meta.title;
      const description = document.querySelector('meta[name="description"]');
      if (description && meta.description) description.setAttribute('content', meta.description);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && meta.ogTitle) ogTitle.setAttribute('content', meta.ogTitle);
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription && meta.ogDescription) ogDescription.setAttribute('content', meta.ogDescription);
      const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
      if (ogImageAlt && meta.ogImageAlt) ogImageAlt.setAttribute('content', meta.ogImageAlt);

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle && meta.twitterTitle) twitterTitle.setAttribute('content', meta.twitterTitle);
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription && meta.twitterDescription) twitterDescription.setAttribute('content', meta.twitterDescription);
      const twitterImageAlt = document.querySelector('meta[name="twitter:image:alt"]');
      if (twitterImageAlt && meta.twitterImageAlt) twitterImageAlt.setAttribute('content', meta.twitterImageAlt);

      const ldJson = document.querySelector('script[type="application/ld+json"]');
      if (ldJson && (meta.structuredDataDescription || meta.offerName)) {
        const parsed = JSON.parse(ldJson.textContent);
        if (meta.structuredDataDescription) parsed.description = meta.structuredDataDescription;
        if (meta.offerName && parsed.offers) parsed.offers.name = meta.offerName;
        ldJson.textContent = JSON.stringify(parsed, null, 2);
      }
    } catch (e) {
      console.warn('i18n-habit2goal meta apply error', e);
    }
  }

  function applyNav(nav) {
    if (!nav) return;

    const brand = document.querySelector('.nav__brand');
    setAttr(brand, 'aria-label', nav.brandAria);

    const navEl = document.querySelector('.nav__links');
    setAttr(navEl, 'aria-label', nav.aria);
    if (navEl) setLinkTexts(navEl.querySelectorAll('a'), nav.links);

    const navCta = document.querySelector('.nav .btn--primary.btn--sm');
    setText(navCta, nav.cta);
  }

  function applyFooter(footer) {
    if (!footer) return;

    const brandSpan = document.querySelector('.footer__brand span');
    if (brandSpan && footer.brandLine) {
      const parts = footer.brandLine.split('·');
      brandSpan.textContent = parts.length > 1 ? '· ' + parts[1].trim() : footer.brandLine;
    }

    const footerNav = document.querySelector('.footer__links');
    setAttr(footerNav, 'aria-label', footer.aria);
    if (footerNav) setLinkTexts(footerNav.querySelectorAll('a'), footer.links);

    const legal = document.querySelector('.footer__legal');
    setHTML(legal, footer.legal);
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function applyLanding(landing) {
    if (!landing || !document.querySelector('.hero__headline')) return;

    applyMeta(landing.meta);
    applyNav(landing.nav);

    const hero = landing.hero || {};
    setText(document.querySelector('.hero .eyebrow'), hero.eyebrow);
    setHTML(document.querySelector('.hero__headline'), hero.headline);
    setText(document.querySelector('.hero__sub'), hero.sub);
    setButtonText(document.querySelector('.hero__cta .btn--primary'), hero.primaryCta);
    setText(document.querySelector('.hero__cta .btn--ghost'), hero.secondaryCta);

    const jumpLinks = document.querySelectorAll('.hero__jumplinks a');
    setAttr(document.querySelector('.hero__jumplinks'), 'aria-label', hero.jumpAria);
    setLinkTexts(jumpLinks, landing.nav && landing.nav.links);

    const floatCards = hero.floatCards || {};
    const floatRows = document.querySelectorAll('.float-card--points .float-card__row');
    if (floatRows[0]) {
      setText(floatRows[0].querySelector('.float-card__label'), floatCards.positiveLabel);
      setText(floatRows[0].querySelector('.float-card__habit'), floatCards.positiveHabit);
    }
    if (floatRows[1]) {
      setText(floatRows[1].querySelector('.float-card__label'), floatCards.negativeLabel);
      setText(floatRows[1].querySelector('.float-card__habit'), floatCards.negativeHabit);
    }
    setText(document.querySelector('.float-card--goal .float-card__title'), floatCards.goalTitle);
    const goalMeta = document.querySelectorAll('.float-card--goal .float-card__meta span');
    if (goalMeta[0]) setText(goalMeta[0], floatCards.goalProgress);
    if (goalMeta[1]) setText(goalMeta[1], floatCards.goalPace);

    const economy = landing.economy || {};
    setText(document.querySelector('#economy .section__head .eyebrow'), economy.eyebrow);
    setHTML(document.querySelector('#economy .section__head h2'), economy.heading);
    const steps = document.querySelectorAll('#economy .step');
    (economy.steps || []).forEach(function (step, index) {
      const stepEl = steps[index];
      if (!stepEl) return;
      setText(stepEl.querySelector('h3'), step.title);
      setHTML(stepEl.querySelector('p'), step.description);
      setText(stepEl.querySelector('.step__chip'), step.chip);
    });

    const features = landing.features || {};
    setText(document.querySelector('#features .section__head .eyebrow'), features.eyebrow);
    setHTML(document.querySelector('#features .section__head h2'), features.heading);
    const featureEls = document.querySelectorAll('#features .feature');
    (features.items || []).forEach(function (feature, index) {
      const featureEl = featureEls[index];
      if (!featureEl) return;
      setText(featureEl.querySelector('.feature__copy h3'), feature.title);
      setHTML(featureEl.querySelector('.feature__copy p'), feature.description);
      setLinkTexts(featureEl.querySelectorAll('.bullets li'), feature.bullets);

      const images = featureEl.querySelectorAll('img');
      if (Array.isArray(feature.imageAlt)) {
        setAttr(images[0], 'alt', feature.imageAlt[0]);
        setAttr(images[1], 'alt', feature.imageAlt[1]);
      } else {
        setAttr(images[0], 'alt', feature.imageAlt);
      }
    });

    const stats = landing.stats || {};
    setText(document.querySelector('#stats .section__head .eyebrow'), stats.eyebrow);
    setHTML(document.querySelector('#stats .section__head h2'), stats.heading);
    setText(document.querySelector('#stats .section__lead'), stats.lead);
    const statCards = document.querySelectorAll('.stats-grid .stat-card');
    (stats.cards || []).forEach(function (card, index) {
      const cardEl = statCards[index];
      if (!cardEl) return;
      setAttr(cardEl.querySelector('img'), 'alt', card.imageAlt);
      setText(cardEl.querySelector('h4'), card.title);
      setText(cardEl.querySelector('p'), card.description);
    });
    setLinkTexts(document.querySelectorAll('.stat-pills li'), stats.pills);

    const split = landing.split || {};
    setText(document.querySelector('.split__col--for h3'), split.forTitle);
    const forItems = document.querySelectorAll('.split__col--for li');
    (split.forItems || []).forEach(function (item, index) {
      setHTML(forItems[index], item);
    });
    setText(document.querySelector('.split__col--not h3'), split.notTitle);
    const notItems = document.querySelectorAll('.split__col--not li');
    (split.notItems || []).forEach(function (item, index) {
      setHTML(notItems[index], item);
    });

    const cta = landing.cta || {};
    setText(document.querySelector('.cta-card .eyebrow'), cta.eyebrow);
    setHTML(document.querySelector('.cta-card h2'), cta.heading);
    setText(document.querySelector('.cta-card p'), cta.description);
    const storeButtons = document.querySelectorAll('.store-btn');
    (cta.stores || []).forEach(function (store, index) {
      const button = storeButtons[index];
      if (!button) return;
      const small = button.querySelector('small');
      const strong = button.querySelector('strong');
      setText(small, store.small);
      setText(strong, store.strong);
    });

    const faq = landing.faq || {};
    setText(document.querySelector('#faq .section__head .eyebrow'), faq.eyebrow);
    setText(document.querySelector('#faq .section__head h2'), faq.heading);
    const faqItems = document.querySelectorAll('.faq details');
    (faq.items || []).forEach(function (item, index) {
      const detail = faqItems[index];
      if (!detail) return;
      setText(detail.querySelector('summary'), item.summary);
      const paragraphs = detail.querySelectorAll('p');
      (item.paragraphs || []).forEach(function (paragraph, paragraphIndex) {
        setHTML(paragraphs[paragraphIndex], paragraph);
      });
    });

    applyFooter(landing.footer);
  }

  function applyPrivacy(privacy) {
    if (!privacy || !document.querySelector('main.legal')) return;

    applyMeta(privacy.meta);
    applyNav(privacy.nav);
    setHTML(document.querySelector('main.legal'), privacy.mainHtml);
    applyFooter(privacy.footer);
  }

  function applyTranslations(data) {
    try {
      document.documentElement.lang = 'pl';
      document.documentElement.setAttribute('data-site-lang', 'pl');
    } catch (e) {
      // ignore
    }

    applyLanding(data.landing || null);
    applyPrivacy(data.privacy || null);

    window.dispatchEvent(new CustomEvent('site:lang', { detail: { lang: 'pl' } }));
  }

  async function loadAndApply() {
    if (loaded) return;
    loaded = true;

    try {
      const res = await fetch(JSON_URL, { cache: 'no-cache' });
      if (!res.ok) {
        console.warn('i18n: habit2goal JSON fetch failed', res.status);
        return;
      }

      const json = await res.json();
      applyTranslations(json);
    } catch (e) {
      console.warn('i18n-habit2goal load error', e);
    }
  }

  if (document.documentElement.getAttribute('data-site-lang') === 'pl') loadAndApply();
  window.addEventListener('site:lang', function (e) {
    if (e && e.detail && e.detail.lang === 'pl') loadAndApply();
  });
  if (initialLang && initialLang.startsWith('pl')) loadAndApply();
})();
