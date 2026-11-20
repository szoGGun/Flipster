import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
// the Tampermonkey icon: PNGs rendered from src/assets/logo (16 px design at 32 px, 48 px design at 64 px)
const png = (f) => 'data:image/png;base64,' + readFileSync(`src/assets/logo/${f}`).toString('base64');
const banner = readFileSync('src/meta.txt', 'utf8').replace('__VERSION__', pkg.version)
  .replace('__ICON__', png('icon-32.png')).replace('__ICON64__', png('icon-64.png'));

// dev loader: install once in Tampermonkey; it @require's the built file from disk, so every build is picked up
// on page reload (needs "Allow access to file URLs" for Tampermonkey in chrome://extensions)
const fileUrl = pathToFileURL(resolve('dist/flipster.user.js')).href;
writeFileSync('dist/flipster-dev.user.js', banner.replace('// ==/UserScript==', `// @require      ${fileUrl}\n// ==/UserScript==`) + '\n// kod ładuje się z pliku powyżej (@require) – nie edytuj tutaj\n');

// beta loader for testers: same short shape as the dev loader, but it @require's the built file committed on main
// (the pre-commit hook in .githooks rebuilds and stages it). Tampermonkey re-installs the loader only when its
// @version (the semver in package.json) rises, so the hook refuses a header or icon change without a version bump.
const betaBase = 'https://raw.githubusercontent.com/szoGGun/Flipster/main/dist';
{
  const loader = banner.replace('// ==/UserScript==', [
      `// @require      ${betaBase}/flipster.user.js`,
      `// @updateURL    ${betaBase}/flipster-beta.user.js`,
      `// @downloadURL  ${betaBase}/flipster-beta.user.js`,
      '// ==/UserScript==',
    ].join('\n'));
  writeFileSync('dist/flipster-beta.user.js', loader + '\n// kod ładuje się z pliku powyżej (@require), nie edytuj tutaj\n');
}

const BUILD = new Date().toLocaleString('pl-PL');
const opts = {
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  target: 'chrome110',
  outfile: 'dist/flipster.user.js',
  banner: { js: banner },
  legalComments: 'none',
  define: { __BUILD__: JSON.stringify(BUILD) },
  loader: { '.svg': 'text' }, // the logo is inlined as SVG markup
  logLevel: 'info',
};

if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(opts);
  await ctx.watch();
} else {
  await esbuild.build(opts);
}
