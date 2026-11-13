import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? 'results');
const files = (await readdir(dir, { recursive: true })).filter((name) => name.endsWith('.json'));
const rows = [];
for (const name of files) {
  try {
    const value = JSON.parse(await readFile(join(dir, name), 'utf8'));
    if (value?.stack && typeof value.outputBytes === 'number') rows.push(value);
  } catch {}
}
rows.sort((a, b) => a.stack.localeCompare(b.stack));
if (rows.length < 2) throw new Error(`Expected two stack metric files, found ${rows.length}`);
const fmt = (n) => new Intl.NumberFormat('en-US').format(n);
let md = '# Website stack PoC build evidence\n\n';
md += '| Stack | Install s | Build s | Output bytes | JS bytes | CSS bytes | HTML files | Assets | Source files | Source lines |\n';
md += '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n';
for (const row of rows) {
  md += `| ${row.stack} | ${row.installSeconds} | ${row.buildSeconds} | ${fmt(row.outputBytes)} | ${fmt(row.jsBytes)} | ${fmt(row.cssBytes)} | ${row.htmlCount} | ${row.assetCount} | ${row.sourceFileCount} | ${fmt(row.sourceLines)} |\n`;
}
md += '\nThese numbers are one GitHub-hosted build comparison. They do not measure CWV, accessibility, editorial UX or production CDN behavior, and they do not select a winner by themselves.\n';
await writeFile(join(dir, 'summary.md'), md);
await writeFile(join(dir, 'summary.json'), `${JSON.stringify({ measuredAt: new Date().toISOString(), rows }, null, 2)}\n`);
console.log(md);
