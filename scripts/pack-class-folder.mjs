#!/usr/bin/env node
/**
 * Build a class-share folder: one index.html kids open in Chrome from a
 * network drive / USB / Downloads. No server. Inline JS+CSS so file:// works
 * (Chrome blocks ES modules loaded as sibling files from file://).
 */
import { execSync } from 'node:child_process';
import {
  copyFileSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'class-folder');
const publicDir = join(root, 'public');

execSync('npx vite build --config vite.share.config.ts', {
  cwd: root,
  stdio: 'inherit',
});

const builtHtmlPath = join(dist, 'share.html');
let html = readFileSync(builtHtmlPath, 'utf8');

html = html.replace(/<link([^>]*rel="stylesheet"[^>]*)>/g, (tag) => {
  const href = tag.match(/href="([^"]+)"/)?.[1];
  if (!href || /^https?:/i.test(href)) return tag;
  const cssPath = join(dist, href.replace(/^\.\//, ''));
  const css = readFileSync(cssPath, 'utf8');
  return `<style>\n${css}\n</style>`;
});

html = html.replace(/<script([^>]*)src="([^"]+)"([^>]*)><\/script>/g, (full, pre, src, post) => {
  if (/^https?:/i.test(src)) return full;
  const jsPath = join(dist, src.replace(/^\.\//, ''));
  const js = readFileSync(jsPath, 'utf8');
  const attrs = `${pre} ${post}`.replace(/\s+/g, ' ').trim();
  const type = /type=["']module["']/.test(full) || /type=["']module["']/.test(attrs)
    ? ' type="module"'
    : '';
  return `<script${type}>\n${js}\n</script>`;
});

html = html.replace(/<title>[^<]*<\/title>/, '<title>Baboo</title>');

const logo = readFileSync(join(publicDir, 'baboo-logo.png'));
copyFileSync(join(publicDir, 'baboo-logo.png'), join(dist, 'baboo-logo.png'));
cpSync(join(publicDir, 'icons'), join(dist, 'icons'), { recursive: true });

writeFileSync(join(dist, 'index.html'), html);
rmSync(builtHtmlPath, { force: true });
rmSync(join(dist, 'assets'), { recursive: true, force: true });

writeFileSync(
  join(dist, 'HOW-TO-SHARE.txt'),
  `Baboo — class folder
====================

Copy this whole folder onto the share kids already use
(N: drive, a USB stick, or a Chromebook Downloads folder).

Each student opens index.html in Chrome.
  • Files app → index.html → Open with Chrome
  • Do not use a Drive "preview" — that will not run the studio

Plans autosave on that Chromebook. To turn in work:
  Save file → upload the .archworks.json to Classroom.

Baboo does not log in and does not need the internet once this folder is copied.
`,
);

mkdirSync(publicDir, { recursive: true });
const zip = join(publicDir, 'baboo-class-folder.zip');
rmSync(zip, { force: true });
const py = spawnSync('python3', ['-c', `
import zipfile, os
root = ${JSON.stringify(dist)}
out = ${JSON.stringify(zip)}
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for dirpath, _, files in os.walk(root):
        for name in files:
            path = os.path.join(dirpath, name)
            z.write(path, os.path.relpath(path, root))
print('zipped', out, os.path.getsize(out))
`], { cwd: root, encoding: 'utf8' });
if (py.status !== 0) {
  process.stderr.write(py.stderr || py.stdout || 'zip failed\n');
  process.exit(py.status ?? 1);
}
process.stdout.write(py.stdout || '');

console.log(`[pack] class folder ready · ${logo.length} byte logo · zip ${zip}`);
