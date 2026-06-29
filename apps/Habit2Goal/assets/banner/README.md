# Preview banners (Open Graph / social images)

The link-preview banners are **generated**, not hand-edited, so they can be
translated and come in every preview shape platforms use. One layout per shape
(`templates/<variant>.svg`) + one copy file (`strings.json`) → one PNG per
**variant × locale**. Box sizes and headline size are auto-fitted to the text,
so translating is just editing copy.

## Files

- `strings.json` — all banner copy per locale (**edit text here**) + the variant
  geometry under `_meta.variants` (canvas size, base headline size, fonts).
- `templates/landscape.svg` · `templates/square.svg` · `templates/portrait.svg`
  — fixed layouts with `{{token}}` placeholders. No copy in here.
- `build.mjs` — renders every variant × locale into `../og-image-*.png`.

## Variants (preview shapes)

| Variant     | Size      | Ratio  | Used by |
|-------------|-----------|--------|---------|
| `landscape` | 1200×630  | 1.91:1 | Open Graph default — Facebook, LinkedIn, Slack, Discord, iMessage, X large card |
| `square`    | 1080×1080 | 1:1    | X/Twitter `summary` card, WhatsApp, Instagram feed |
| `portrait`  | 1080×1350 | 4:5    | Pinterest, portrait feed |
| `story`     | 1080×1920 | 9:16   | Instagram / Facebook / TikTok full-screen Story (ad) |

## Rebuild

```sh
cd assets/banner
node build.mjs                      # every variant × locale
node build.mjs --variant square     # one shape, all locales
node build.mjs --locale pl          # one locale, all shapes
node build.mjs --variant portrait --locale pl
```

Requires `rsvg-convert` (`brew install librsvg`).

### Outputs (in `assets/`)

- `og-image-<variant>-<locale>.png` (+ `.svg`) — every combination
- `og-image.png` / `og-image.svg` — copy of the **default** (`_meta.default`,
  currently `landscape` / `en`), referenced by the meta tags in `index.html`.

## Wiring into a page

`index.html` points `og:image` / `twitter:image` at `og-image.png` (landscape).
To use another shape or locale on a given page, point those tags at the matching
`og-image-<variant>-<locale>.png` and set its dimensions:

- landscape → keep `twitter:card = summary_large_image`
- square → `twitter:card = summary`

## Add a language

1. Copy a block under `locales` in `strings.json` and translate the text fields
   (`eyebrow`, `h1`–`h3`, `sub1`/`sub2`, `cta`, `stores`, `tagline`, `lang`, `ogLocale`).
2. `node build.mjs --locale <code>` — widths and headline size auto-fit; just
   eyeball the PNGs. If a headline is still too wide, lower that variant's
   `headlineMax` (or rephrase the line) in `_meta.variants`.
3. To serve it, point the page's `og:image` / `twitter:image` at the new file and
   add an `og:locale:alternate` tag.
