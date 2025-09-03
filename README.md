# Nowak Apps – Static Site

A lightweight, accessible, mobile‑first static website for the personal brand **Nowak Apps** (Mikołaj Nowak). Showcases mobile applications and technical presentations.

## Features
- Modern responsive design (hand‑crafted CSS design system, no heavy framework)
- Light / Dark theme toggle with persistence
- Data‑driven content (JSON for apps & talks)
- Accessible markup (semantic HTML, focus styles, skip links, ARIA where needed)
- SEO + Open Graph tags
- Easy GitHub Pages deployment (supports root or project pages)

## Structure
```
.
├── index.html                # Home (hero, featured app, recent talks)
├── apps/
│   ├── index.html            # Apps listing (populated from data/apps.json)
│   └── Habit2Goal/           # Existing standalone app microsite
│       ├── index.html
│       ├── styles.css
│       ├── privacy.html
│       ├── terms.html
│       ├── logo.svg
│       ├── ic_launcher*.png/.webp
│       └── screens/*.svg
├── talks/
│   └── index.html            # Talks listing (populated from data/talks.json)
├── data/
│   ├── apps.json             # Apps metadata
│   └── talks.json            # Talks metadata
├── assets/
│   ├── css/base.css          # Design system & components
│   ├── js/main.js            # Theme toggle + dynamic rendering
│   └── img/
│       ├── favicon.svg
│       ├── og-banner.svg
│       └── apps/
│           └── habit2goal-banner.svg
├── .nojekyll                 # Prevent Jekyll processing on GitHub Pages
├── CNAME                     # Custom domain (nowakapps.dev)
└── README.md
```

## Data Model
### App Object (data/apps.json)
```
{
  "id": "habit2goal",
  "name": "Habit2Goal",
  "tagline": "Turn daily habits into achievable goals.",
  "description": "Longer marketing copy...",
  "tech": ["Kotlin", "Compose", "KMP"],
  "banner": "assets/img/apps/habit2goal-banner.svg",
  "logo": "apps/Habit2Goal/ic_launcher_foreground.webp",
  "screens": ["apps/Habit2Goal/screens/goals.svg"],
  "links": { "page": "apps/Habit2Goal/", "github": "", "play": "", "appstore": "" },
  "featured": true
}
```
Set `featured: true` to surface on the homepage.

### Talk Object (data/talks.json)
```
{
  "id": "kotlin-flow-operators",
  "title": "Kotlin Flow Operators",
  "abstractShort": "Short synopsis...",
  "abstractLong": "Full description...",
  "audience": "Advanced Kotlin Developers",
  "videos": [ { "label": "Main", "embed": "https://www.youtube.com/embed/VIDEO_ID" } ],
  "downloads": [ { "label": "Slides PPTX", "url": "#Slides.pptx" } ],
  "events": ["Conference A", "Meetup B"]
}
```
Add multiple `videos` for tabbed switching.

## Adding an App
1. Place any new banners / logos under `assets/img/apps/` (or inside a dedicated subfolder if it has a microsite).
2. Append a new JSON object to `data/apps.json`.
3. (Optional) Create a microsite at `apps/<AppName>/`.
4. Set `featured` to show on home.

## Adding a Talk
1. Upload slide assets somewhere (or keep `#` placeholders until ready).
2. Add a new object in `data/talks.json` with at least one YouTube embed.
3. Include events list for badge-like chips.

## Theming
- Auto-detects system preference on first load
- User selection stored in `localStorage` (`theme: dark|light`)
- Toggle button text switches between 🌞 / 🌙

## Accessibility Notes
- Skip links: Home uses `#content`; other pages use `#main`
- Tablist for multiple video embeds uses proper roving tabindex & ARIA roles
- Color contrast designed for WCAG AA+ (verify after branding tweaks)

## Performance
- Single CSS file (no blocking frameworks)
- Minimal JS (no dependencies)
- Lazy loading inherent for iframes + semantic structure
- SVG fav/OG assets to reduce file size

## SEO Checklist
- Unique `<title>` & `<meta description>` per page
- Open Graph & Twitter cards
- Logical heading hierarchy
- Descriptive link text

## Deployment (GitHub Pages)
### Option A: Custom Domain (root)
1. Repository > Settings > Pages: Source = `main` branch / root
2. Ensure `CNAME` file contains the domain (`nowakapps.dev`)
3. Add DNS A / AAAA records pointing to GitHub Pages IPs + CNAME for `www`
4. Wait for certificate provisioning (HTTPS)

### Option B: Project Page (`username.github.io/NowakApps`)
1. Remove/rename `CNAME` if not using custom domain
2. Update absolute navigation links to be relative OR keep as is and rely on a custom domain
   - For project mode you can convert links: `/apps/` → `apps/`, `/talks/` → `talks/`
3. Commit & push; enable Pages for `/root`

### Local Preview
Open `index.html` directly in a browser OR start a simple server:
```
python3 -m http.server 5173
# then visit http://localhost:5173
```
Dynamic JSON loads require a server (file:// won’t allow fetch in some browsers).

## Extending
- Consider adding a sitemap.xml & robots.txt
- Add JSON-LD structured data for talks & software apps
- Integrate a simple service worker for offline caching if needed

## License
Content & code © 2025 Nowak Apps. Adapt freely for personal use unless stated otherwise.

---
Questions / improvements: contact@nowakapps.dev
