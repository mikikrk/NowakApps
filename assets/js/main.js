// Tiny renderer for apps.json / talks.json / ai-tools.json
const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

async function loadJson(path) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (e) {
    console.warn("Failed to load", path, e);
    return [];
  }
}

function appCard(app) {
  const links = [];
  if (app.links?.site) links.push(`<a href="${escapeHtml(app.links.site)}">Open site</a>`);
  if (app.links?.play) links.push(`<a href="${escapeHtml(app.links.play)}" target="_blank" rel="noopener">Google Play</a>`);
  if (app.links?.appStore) links.push(`<a href="${escapeHtml(app.links.appStore)}" target="_blank" rel="noopener">App Store</a>`);
  const platforms = (app.platforms || []).map((p) => `<span class="chip">${escapeHtml(p)}</span>`).join("");
  const iconHtml = app.icon
    ? `<img src="${escapeHtml(app.icon)}" alt="${escapeHtml(app.name)} icon" loading="lazy">`
    : escapeHtml((app.name || "?").charAt(0));
  return `
    <article class="card">
      <div class="card__head">
        <div class="card__icon">${iconHtml}</div>
        <div>
          <h3 class="card__title">${escapeHtml(app.name)}</h3>
          <p class="card__sub">${escapeHtml(app.tagline || "")}</p>
        </div>
      </div>
      <p class="card__body">${escapeHtml(app.description || "")}</p>
      <div class="card__meta">${platforms}</div>
      <div class="card__cta">${links.join("")}</div>
    </article>`;
}

function talkCard(talk, { compact = false } = {}) {
  const tags = (talk.tags || []).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("");
  const links = [];
  if (talk.links?.video) links.push(`<a href="${escapeHtml(talk.links.video)}" target="_blank" rel="noopener">▶ Watch recording</a>`);
  if (talk.links?.slides) links.push(`<a href="${escapeHtml(talk.links.slides)}" target="_blank" rel="noopener">Slides</a>`);
  if (talk.links?.code) links.push(`<a href="${escapeHtml(talk.links.code)}" target="_blank" rel="noopener">Sample code</a>`);
  if (compact) {
    return `
      <article class="card">
        <div class="card__head">
          <div>
            <h3 class="card__title">${escapeHtml(talk.title)}</h3>
            <p class="card__sub">${escapeHtml(talk.venue || "")} · ${escapeHtml(String(talk.year || ""))}</p>
          </div>
        </div>
        <p class="card__body">${escapeHtml((talk.abstract || "").slice(0, 180))}${(talk.abstract || "").length > 180 ? "…" : ""}</p>
        <div class="card__meta">${tags}</div>
        <div class="card__cta">${links.join("")}<a href="/talks/#${escapeHtml(talk.id)}">Read more</a></div>
      </article>`;
  }
  return `
    <article class="talk" id="${escapeHtml(talk.id)}">
      <div class="talk__head">
        <h3 class="talk__title">${escapeHtml(talk.title)}</h3>
        <span class="talk__year">${escapeHtml(String(talk.year || ""))}</span>
        <span class="talk__venue">${escapeHtml(talk.venue || "")}${talk.length ? " · " + escapeHtml(talk.length) : ""}${talk.audience ? " · " + escapeHtml(talk.audience) : ""}</span>
      </div>
      <div class="talk__tags">${tags}</div>
      <p class="talk__abstract">${escapeHtml(talk.abstract || "")}</p>
      <div class="talk__links">${links.join("")}</div>
    </article>`;
}

function aiToolCard(tool) {
  const tags = (tool.tags || []).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("");
  const links = [];
  if (tool.links?.github) links.push(`<a href="${escapeHtml(tool.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (tool.links?.docs) links.push(`<a href="${escapeHtml(tool.links.docs)}" target="_blank" rel="noopener">Docs</a>`);
  return `
    <article class="card">
      <div class="card__head">
        <div class="card__icon">${escapeHtml((tool.kind || "S").charAt(0).toUpperCase())}</div>
        <div>
          <h3 class="card__title">${escapeHtml(tool.name)}</h3>
          <p class="card__sub">${escapeHtml(tool.kind || "")}</p>
        </div>
      </div>
      <p class="card__body">${escapeHtml(tool.description || "")}</p>
      <div class="card__meta">${tags}</div>
      <div class="card__cta">${links.join("")}</div>
    </article>`;
}

async function renderApps(target, { limit } = {}) {
  const el = document.querySelector(target);
  if (!el) return;
  const apps = await loadJson("/data/apps.json");
  const list = limit ? apps.slice(0, limit) : apps;
  el.innerHTML = list.map(appCard).join("") || `<div class="empty">No apps yet.</div>`;
}

async function renderTalks(target, opts = {}) {
  const el = document.querySelector(target);
  if (!el) return;
  const talks = await loadJson("/data/talks.json");
  const list = opts.limit ? talks.slice(0, opts.limit) : talks;
  if (opts.compact) {
    el.classList.add("grid", "grid--talks");
    el.innerHTML = list.map((t) => talkCard(t, { compact: true })).join("") || `<div class="empty">No talks yet.</div>`;
  } else {
    el.classList.add("talks-list");
    el.innerHTML = list.map((t) => talkCard(t)).join("") || `<div class="empty">No talks yet.</div>`;
  }
}

async function renderAiTools(target) {
  const el = document.querySelector(target);
  if (!el) return;
  const tools = await loadJson("/data/ai-tools.json");
  if (!tools.length) {
    el.innerHTML = `
      <div class="empty">
        <p><strong>Coming soon.</strong> I'm curating a set of reusable Copilot CLI skills and custom agents.<br/>
        Once they're polished and published, they'll show up here with a one-line description and a link to GitHub.</p>
      </div>`;
    return;
  }
  el.classList.add("grid", "grid--apps");
  el.innerHTML = tools.map(aiToolCard).join("");
}

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  renderApps("[data-render='apps']", { limit: 6 });
  renderTalks("[data-render='talks-compact']", { compact: true, limit: 4 });
  renderTalks("[data-render='talks-full']");
  renderAiTools("[data-render='ai-tools']");
});
