# Nowak Apps — Website

Personal site for **Nowak Apps** (Mikołaj Nowak). Showcases mobile applications and conference talks. Static site, no build step.

Live: https://nowakapps.com

## Structure

```
.
├── index.html               # Home (hero, apps, talks, about)
├── apps/
│   ├── index.html           # All apps listing
│   └── Habit2Goal/          # Standalone Habit2Goal microsite
├── talks/
│   └── index.html           # All talks listing
├── habit2goal/index.html    # Legacy redirect → /apps/Habit2Goal/
├── data/
│   ├── apps.json            # Apps metadata
│   └── talks.json           # Talks metadata
├── assets/
│   ├── css/style.css        # Design system
│   ├── js/main.js           # Theme toggle + JSON rendering
│   └── img/                 # Favicon + OG image
├── CNAME                    # nowakapps.com
└── .nojekyll
```

## Adding content

- **App** → add an entry to `data/apps.json`. Optionally drop a microsite into `apps/<Name>/` and link it via `links.page`.
- **Talk** → add an entry to `data/talks.json`. Talks are sorted by `year` descending.

## Local preview

JSON is fetched at runtime, so use a static server:

```sh
python3 -m http.server 5173
# open http://localhost:5173
```

## Deploy

GitHub Pages serves directly from `main`. The `CNAME` file points the site at `nowakapps.com`.
