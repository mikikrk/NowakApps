#!/usr/bin/env node
// Render the Habit2Goal preview banner for every variant (shape) × locale.
//
//   node build.mjs                       # everything
//   node build.mjs --variant square      # one shape, all locales
//   node build.mjs --locale pl           # one locale, all shapes
//   node build.mjs --variant portrait --locale pl
//
// Copy lives in strings.json (`locales`); shapes live in strings.json
// (`_meta.variants`) + one templates/<variant>.svg each. Box widths (eyebrow
// pill, CTA button) and headline size are AUTO-FITTED from the text here, so
// translators only ever edit copy — no SVG geometry to hand-tune per language.
//
// Outputs into ../ (the assets dir) so the relative image hrefs resolve:
//   ../og-image-<variant>-<locale>.svg / .png
//   ../og-image.svg / .png   = copy of the default variant+locale (used by meta)
//
// Requires rsvg-convert on PATH (brew install librsvg).

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(here, '..');

const data = JSON.parse(readFileSync(resolve(here, 'strings.json'), 'utf8'));
const { variants, default: dflt } = data._meta;

// --- args ---------------------------------------------------------------
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : null;
};
const onlyVariant = opt('variant');
const onlyLocale = opt('locale');
const variantList = onlyVariant ? [onlyVariant] : Object.keys(variants);
const localeList = onlyLocale ? [onlyLocale] : Object.keys(data.locales);

// --- helpers ------------------------------------------------------------
const escapeXml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Rough advance width for Helvetica/Arial. `frac` = average glyph width as a
// fraction of font size; deliberately a touch generous so boxes never clip.
const textWidth = (text, size, frac, letterSpacing = 0) => {
  const n = [...String(text)].length;
  return n * size * frac + Math.max(0, n - 1) * letterSpacing;
};

const EYEBROW_LS = 2.5; // must match letter-spacing in the templates
const HEADLINE_LS = -1.5;

for (const variant of variantList) {
  const v = variants[variant];
  if (!v) {
    console.error(`✗ unknown variant "${variant}"`);
    process.exitCode = 1;
    continue;
  }
  const template = readFileSync(resolve(here, 'templates', `${variant}.svg`), 'utf8');
  const center = v.align === 'center';

  for (const code of localeList) {
    const loc = data.locales[code];
    if (!loc) {
      console.error(`✗ unknown locale "${code}"`);
      process.exitCode = 1;
      continue;
    }

    // Headline: shrink from headlineBase until the longest line fits headlineMax.
    const longest = Math.max(
      ...[loc.h1, loc.h2, loc.h3].map((l) => textWidth(l, v.headlineBase, 0.58, HEADLINE_LS)),
    );
    const headlineSize =
      longest > v.headlineMax ? Math.floor((v.headlineBase * v.headlineMax) / longest) : v.headlineBase;

    // Eyebrow pill: dot(20) + gap + text + right padding.
    const eyebrowWidth = Math.round(36 + textWidth(loc.eyebrow, v.eyebrowFont, 0.64, EYEBROW_LS) + 18);

    // CTA button: text + trailing arrow + horizontal padding.
    const ctaWidth = Math.max(200, Math.round(textWidth(`${loc.cta}  ↓`, v.ctaFont, 0.6) + 60));

    // Placement differs by layout (left column vs centred column).
    const eyebrowX = center ? Math.round((v.w - eyebrowWidth) / 2) : 72;
    const ctaX = center ? Math.round((v.w - ctaWidth) / 2) : 72;
    const storesX = center ? v.w / 2 : ctaX + ctaWidth + 26;

    const fields = {
      ...loc,
      headlineSize,
      eyebrowWidth, eyebrowX, eyebrowFont: v.eyebrowFont,
      ctaWidth, ctaX, ctaHalf: ctaWidth / 2, ctaFont: v.ctaFont,
      storesX,
    };

    const svg = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (!(key in fields)) throw new Error(`missing field "${key}" (${variant}/${code})`);
      return escapeXml(fields[key]);
    });

    const base = `og-image-${variant}-${code}`;
    const svgPath = resolve(assetsDir, `${base}.svg`);
    const pngPath = resolve(assetsDir, `${base}.png`);
    writeFileSync(svgPath, svg);
    execFileSync('rsvg-convert', ['-w', String(v.w), '-h', String(v.h), svgPath, '-o', pngPath]);
    console.log(`✓ ${variant}/${code} → ${base}.png (${v.w}×${v.h}, headline ${headlineSize}px)`);

    if (variant === dflt.variant && code === dflt.locale) {
      copyFileSync(svgPath, resolve(assetsDir, 'og-image.svg'));
      copyFileSync(pngPath, resolve(assetsDir, 'og-image.png'));
      console.log(`✓ default → og-image.png / og-image.svg`);
    }
  }
}
