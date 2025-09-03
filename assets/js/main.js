/* Main site script: theme toggle, dynamic data rendering for apps & talks */
(function(){
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  // Determine base path (supports GitHub project pages)
  let BASE = '/';
  try {
    const script = document.querySelector('script[src*="assets/js/main.js"]');
    if(script){
      const url = new URL(script.getAttribute('src'), location.href);
      const parts = url.pathname.split('/').filter(Boolean); // e.g. ["NowakApps","assets","js","main.js"]
      const assetsIdx = parts.indexOf('assets');
      if(assetsIdx > 0){
        BASE = '/' + parts.slice(0, assetsIdx).join('/') + '/';
      }
    }
  } catch(e) { /* noop */ }

  // THEME
  const themeToggle = $('#themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme(t){
    document.documentElement.classList.toggle('dark', t==='dark');
    themeToggle && (themeToggle.textContent = t==='dark' ? '🌙' : '🌞');
  }
  function initTheme(){
    const saved = localStorage.getItem('theme');
    if(saved){ applyTheme(saved); return; }
    applyTheme(prefersDark.matches ? 'dark':'light');
  }
  themeToggle && themeToggle.addEventListener('click',()=>{
    const dark = document.documentElement.classList.contains('dark');
    const next = dark? 'light':'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
  prefersDark.addEventListener('change', e=>{
    if(!localStorage.getItem('theme')) applyTheme(e.matches? 'dark':'light');
  });
  initTheme();

  // UTIL
  function esc(str){ return (str||'').replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }

  // APPS
  const appsContainer = $('#appsList');
  const homeApps = $('#homeApps');
  if(appsContainer || homeApps){
    fetch(BASE + 'data/apps.json').then(r=>r.json()).then(apps=>{
      if(homeApps){
        apps.forEach(app=>{
          if(!homeApps.querySelector(`[data-app="${app.id}"]`)){
            homeApps.insertAdjacentHTML('beforeend', appCard(app, BASE));
          }
        });
      }
      if(appsContainer){
        apps.forEach(app=>{
          if(!appsContainer.querySelector(`[data-app="${app.id}"]`)){
            appsContainer.insertAdjacentHTML('beforeend', appCard(app, BASE));
          }
        });
      }
    }).catch(err=>console.error('Apps load failed', err));
  }
  function appCard(app, base){
    const secondary = [];
    if(app.links?.play) secondary.push(`<a href="${esc(app.links.play)}" target="_blank" rel="noopener">Play</a>`);
    if(app.links?.appstore) secondary.push(`<a href="${esc(app.links.appstore)}" target="_blank" rel="noopener">App&nbsp;Store</a>`);
    if(app.links?.github) secondary.push(`<a href="${esc(app.links.github)}" target="_blank" rel="noopener">GitHub</a>`);

    const primaryHref = app.links?.page ? `${base}${app.links.page.replace(/^\//,'')}` : '#';
    const hasBanner = !!app.banner;
    const bannerStyle = hasBanner ? ` style=\"background-image:url('${base}${app.banner.replace(/^\\/,'')}')\"` : '';
    const bannerClass = hasBanner ? 'card-media banner' : 'card-media';

    const hasLogo = !!app.logo;
    const initials = app.name ? app.name.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase() : 'APP';
    const logoInner = hasLogo
      ? `<img src="${base}${app.logo.replace(/^\//,'')}" class="card-logo" alt="${esc(app.name)} logo" loading="lazy" />`
      : `<span aria-hidden="true" style="font-weight:600;font-size:.8rem;letter-spacing:.5px;">${esc(initials)}</span>`;

    const tagline = app.tagline ? `<p class=\"app-tagline\">${esc(app.tagline)}</p>` : '';

    return `<a class=\"card card-link\" data-app=\"${esc(app.id)}\" href=\"${primaryHref}\">\n      <div class=\"${bannerClass}\" aria-label=\"${esc(app.name)} marketing banner\"${bannerStyle}>${hasBanner? '<span class=\\"card-media-label\\">App</span>': esc(app.name)}</div>\n      <div class=\"card-body\">\n        <div class=\"app-header-line\">\n          <div class=\"app-logo-box\">${logoInner}</div>\n          <div class=\"app-title-wrap\">\n            <h3>${esc(app.name)}</h3>\n            ${tagline}\n          </div>\n        </div>\n        <p>${esc(app.description)}</p>\n        <div class=\"tech-tags\">${(app.tech||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div>\n        ${secondary.length? `<div class=\"card-actions\">${secondary.join('')}</div>`:''}\n      </div>\n    </a>`;
  }

  // TALKS
  const talksList = $('#talksList');
  const homeTalks = $('#homeTalks');
  if(talksList || homeTalks){
    fetch(BASE + 'data/talks.json').then(r=>r.json()).then(talks=>{
      if(homeTalks){ talks.forEach(t=>homeTalks.insertAdjacentHTML('beforeend', talkFull(t))); }
      if(talksList){ talks.forEach(t=>talksList.insertAdjacentHTML('beforeend', talkFull(t))); initTalkTabs(talksList); initAbstractToggles(talksList); }
      // Initialize tabs/abstract toggles also for homepage full talks
      if(homeTalks){ initTalkTabs(homeTalks); initAbstractToggles(homeTalks); }
    }).catch(err=>console.error('Talks load failed', err));
  }

  function talkFull(t){
    const videoTabs = t.videos && t.videos.length>1 ? t.videos.map((v,i)=>`<button role=\"tab\" aria-selected=\"${i===0}\" tabindex=\"${i===0? '0':'-1'}\" data-embed=\"${esc(v.embed)}\">${esc(v.label)}</button>`).join('') : '';
    const videoFrame = `<div class=\"video-frame\"><iframe title=\"${esc(t.title)} video\" width=\"100%\" height=\"100%\" src=\"${esc(t.videos[0].embed)}\" frameborder=\"0\" allowfullscreen loading=\"lazy\"></iframe></div>`;
    return `<article class=\"talk\" id=\"${esc(t.id)}\">\n      <header class=\"talk-header\">\n        <h2 class=\"talk-title\">${esc(t.title)}</h2>\n        <div class=\"talk-meta\"><span>${esc(t.audience)}</span></div>\n        <p class=\"muted\">${esc(t.abstractShort)} <button class=\"toggle-abstract\" type=\"button\" aria-expanded=\"false\" aria-controls=\"abs-${esc(t.id)}\">Expand</button></p>\n        <div id=\"abs-${esc(t.id)}\" class=\"hidden max-w-prose\"><p>${esc(t.abstractLong)}</p></div>\n      </header>\n      <div class=\"video-tabs\">\n        ${videoTabs? `<div class=\"tablist\" role=\"tablist\">${videoTabs}</div>`:''}\n        ${videoFrame}\n      </div>\n      <div class=\"resources\">${(t.downloads||[]).map(d=>`<a href=\"${esc(d.url)}\" ${d.url==='#'?'aria-disabled=\"true\"':''}>${esc(d.label)}</a>`).join('')}</div>\n      ${(t.events&&t.events.length)? `<ul class=\"events-list\" aria-label=\"Events presented at\">${t.events.map(e=>`<li>${esc(e)}</li>`).join('')}</ul>`:''}\n    </article>`;
  }

  function initTalkTabs(scope){
    $$('.tablist', scope).forEach(tablist=>{
      tablist.addEventListener('click', e=>{
        if(e.target.tagName==='BUTTON') switchTab(e.target, tablist);
      });
      tablist.addEventListener('keydown', e=>{
        const buttons = $$('.tablist button', tablist.parentElement.parentElement);
        let idx = buttons.indexOf(document.activeElement);
        if(e.key==='ArrowRight'){ idx = (idx+1)%buttons.length; buttons[idx].focus(); e.preventDefault(); }
        if(e.key==='ArrowLeft'){ idx = (idx-1+buttons.length)%buttons.length; buttons[idx].focus(); e.preventDefault(); }
        if(e.key==='Home'){ buttons[0].focus(); e.preventDefault(); }
        if(e.key==='End'){ buttons[buttons.length-1].focus(); e.preventDefault(); }
        if(['Enter',' '].includes(e.key)){ switchTab(document.activeElement, tablist); e.preventDefault(); }
      });
    });
  }
  function switchTab(btn, tablist){
    const container = tablist.closest('.talk');
    const buttons = $$('button', tablist);
    buttons.forEach(b=>{ b.setAttribute('aria-selected','false'); b.tabIndex=-1; });
    btn.setAttribute('aria-selected','true'); btn.tabIndex=0; btn.focus();
    const iframe = $('iframe', container);
    iframe && (iframe.src = btn.dataset.embed);
  }

  function initAbstractToggles(scope){
    scope.addEventListener('click', e=>{
      if(e.target.classList.contains('toggle-abstract')){
        const btn = e.target; const id = btn.getAttribute('aria-controls'); const panel = $('#'+id);
        const expanded = btn.getAttribute('aria-expanded')==='true';
        btn.setAttribute('aria-expanded', String(!expanded));
        panel.classList.toggle('hidden', expanded);
        btn.textContent = expanded? 'Expand' : 'Collapse';
      }
    });
  }

  // SCROLLSPY
  const navLinks = $$('.nav a[data-nav]');
  const sectionIds = ['home','apps','talks'];
  const sections = sectionIds.map(id=>document.getElementById(id)).filter(Boolean);
  let activeId = 'home';
  function setActive(id){
    if(id===activeId) return; activeId=id;
    navLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  }
  if('IntersectionObserver' in window && sections.length){
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry=>{
        if(entry.isIntersecting){ setActive(entry.target.id); }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold:[0,0.25,0.5,0.75,1] });
    sections.forEach(sec=>io.observe(sec));
  } else {
    // Fallback: basic onscroll check
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY + window.innerHeight * 0.35;
      for(const sec of sections){
        if(sec.offsetTop <= y && (sec.offsetTop + sec.offsetHeight) > y){ setActive(sec.id); break; }
      }
    });
  }

  // YEAR IN FOOTER
  const yearEl = $('#year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
})();
