#!/usr/bin/env node
// Render the Habit2Goal preview banner (Open Graph image) for every locale.
//
//   node build.mjs            # build all locales in strings.json
//   node build.mjs pl         # build only the given locale(s)
//
// Reads template.svg + strings.json, substitutes {{tokens}}, then rasterises
// with rsvg-convert. Outputs into ../ (the assets dir) so the relative image
// hrefs (screenshots/…, app-icon.png) resolve:
//   ../og-image-<locale>.svg   generated source
//   ../og-image-<locale>.png   rendered banner
//   ../og-image.svg / .png     copy of the default locale (used by the meta tags)
//
// Requires rsvg-convert on PATH (brew install librsvg).

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(here, '..');

const data = JSON.parse(readFileSync(resolve(here, 'strings.json'), 'utf8'));
const template = readFileSync(resolve(here, 'template.svg'), 'utf8');
const { w, h } = data._meta.size;
const defaultLocale = data._meta.default;

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const requested = process.argv.slice(2);
const locales = requested.length ? requested : Object.keys(data.locales);

for (const code of locales) {
  const loc = data.locales[code];
  if (!loc) {
    console.error(`✗ unknown locale "${code}" (not in strings.json)`);
    process.exitCode = 1;
    continue;
  }

  // Derived layout values so translators only edit copy + width hints.
  const fields = {
    ...loc,
    ctaHalf: Number(loc.ctaWidth) / 2,
    storesX: 72 + Number(loc.ctaWidth) + 26,
  };

  const svg = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in fields)) throw new Error(`missing field "${key}" for locale "${code}"`);
    return escapeXml(fields[key]);
  });

  const svgPath = resolve(assetsDir, `og-image-${code}.svg`);
  const pngPath = resolve(assetsDir, `og-image-${code}.png`);
  writeFileSync(svgPath, svg);
  execFileSync('rsvg-convert', ['-w', String(w), '-h', String(h), svgPath, '-o', pngPath]);
  console.log(`✓ ${code} → og-image-${code}.png`);

  if (code === defaultLocale) {
    copyFileSync(svgPath, resolve(assetsDir, 'og-image.svg'));
    copyFileSync(pngPath, resolve(assetsDir, 'og-image.png'));
    console.log(`✓ ${code} is default → og-image.png / og-image.svg`);
  }
}
