import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const banner = readFileSync('src/meta.txt', 'utf8').replace('__VERSION__', pkg.version);

// dev loader: install once in Tampermonkey; it @require's the built file from disk, so every build is picked up
// on page reload (needs "Allow access to file URLs" for Tampermonkey in chrome://extensions)
const fileUrl = pathToFileURL(resolve('dist/flipster.user.js')).href;
writeFileSync('dist/flipster-dev.user.js', banner.replace('// ==/UserScript==', `// @require      ${fileUrl}\n// ==/UserScript==`) + '\n// kod ładuje się z pliku powyżej (@require) – nie edytuj tutaj\n');

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
  logLevel: 'info',
};

if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(opts);
  await ctx.watch();
} else {
  await esbuild.build(opts);
}
