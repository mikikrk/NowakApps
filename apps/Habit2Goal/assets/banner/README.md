# Preview banner (Open Graph image)

The social-share / link-preview banner is **generated**, not hand-edited, so it can
be translated. One layout (`template.svg`) + one copy file (`strings.json`) →
one PNG per locale.

## Files

- `strings.json` — all banner copy, per locale. **Edit text here.**
- `template.svg` — fixed layout with `{{token}}` placeholders. Don't put copy here.
- `build.mjs` — renders `../og-image-<locale>.png` (and `.svg`) from the two above.

## Rebuild

```sh
cd assets/banner
node build.mjs        # all locales
node build.mjs pl     # one locale
```

Outputs to `assets/`:

- `og-image-en.png`, `og-image-pl.png`, … — per-locale banners
- `og-image.png` / `og-image.svg` — copy of the **default** locale (`_meta.default`),
  referenced by the `og:image` / `twitter:image` meta tags in `index.html`.

Requires `rsvg-convert` (`brew install librsvg`).

## Add a language

1. Add a locale block under `locales` in `strings.json`. Copy an existing one and
   translate the text fields.
2. Tune the layout hints so longer strings fit:
   - `eyebrowWidth` — width of the eyebrow pill
   - `headlineSize` — headline font size (drop it for long words)
   - `ctaWidth` — width of the download button
   (`build.mjs` derives the button text centre and the store-line x-offset from these.)
3. `node build.mjs <locale>` and eyeball the PNG.
4. To serve it, point that page's `og:image` / `twitter:image` at the new file and
   add an `og:locale:alternate` tag in `index.html`.
