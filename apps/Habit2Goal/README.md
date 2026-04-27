# Habit2Goal — Marketing Website

Static landing page for the Habit2Goal app, designed to be hosted on **GitHub Pages** with zero build step.

## Files

```
Website/
├── index.html              Main landing page
├── styles.css              All styling (design tokens at the top)
├── script.js               Lightweight scroll-reveal + footer year
├── .nojekyll               Tells GitHub Pages to skip Jekyll processing
├── README.md
└── assets/
    ├── app-icon.png        1024px icon (also used as og:image / favicon)
    ├── logo.svg            Brand logo
    └── screenshots/        Phone screenshots used across the page
```

## Local preview

Just open `index.html` in a browser, or serve the folder:

```bash
cd Website
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy to GitHub Pages

The simplest path is to host this folder from your repo's `main` branch.

### Option A — site lives in `/Website` of the main repo

1. Push the `Website/` folder to the repo's `main` branch.
2. In GitHub → **Settings → Pages**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`
   - **Folder:** `/Website`
3. Save. Site will be available at `https://<user>.github.io/<repo>/`.

### Option B — site lives at the root of a dedicated repo

1. Create a repo named `<user>.github.io` (or any repo).
2. Copy the **contents** of `Website/` (not the folder itself) into the repo root.
3. In GitHub → **Settings → Pages**, choose **Branch: `main` / `(root)`**.

The `.nojekyll` file is already included so GitHub Pages won't try to process the site through Jekyll.

## Updating the iOS link

The iOS App Store link is currently a placeholder pointing at YouTube. When the real listing is live, search `index.html` for:

```
https://apps.apple.com/pl/app/youtube/id544007664?l=pl
```

…and replace it with the real App Store URL.

## Design tokens

All brand colors live as CSS variables at the top of `styles.css`:

| Token        | Value     | Used for                |
|--------------|-----------|-------------------------|
| `--bg-1`     | `#0D1B2A` | Primary background      |
| `--bg-2/3`   | `#112236 / #1A2B3C` | Surfaces      |
| `--teal`     | `#00C896` | Primary accent / CTA    |
| `--orange`   | `#FF8C42` | Secondary accent (warnings, "honest" disclaimer) |

These match the brand colors used in the Google Play feature graphic and in-app theme.

## What this site says

The headline message — and the part that's important to keep honest as the app evolves — is:

> Habit2Goal is a **self-reward** concept. The app doesn't pay you. It tracks the points you earn from your habits, and you decide what real-world reward those points "buy" once you hit the target.

That disclaimer is surfaced both in the hero (orange "Just so we’re clear" callout) and in the FAQ.
