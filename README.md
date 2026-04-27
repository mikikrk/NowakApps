# NowakApps

Personal/company website of **Mikołaj Nowak** — indie apps and conference talks.
Hosted on GitHub Pages at [nowakapps.com](https://nowakapps.com).

## Structure

```
/                  → home (apps grid, talks teaser, AI tools teaser)
/apps/             → full apps listing
/apps/Habit2Goal/  → standalone Habit2Goal microsite
/talks/            → talks list with abstracts and links
/ai-tools/         → AI skills & custom agents (coming soon)
/habit2goal/       → redirect to /apps/Habit2Goal/
```

## Data

Apps and talks are rendered from JSON:

- `data/apps.json`
- `data/talks.json`
- `data/ai-tools.json`

To add a new app/talk/tool, append an entry to the relevant JSON file — no markup
changes required.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Pushes to `main` are served automatically by GitHub Pages. Custom domain:
`nowakapps.com` (see `CNAME`).
