import { readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const [stack, projectArg = '.', installArg = '0', buildArg = '0'] = process.argv.slice(2);
if (!stack) throw new Error('usage: node measure.mjs <stack> <projectRoot> <installSeconds> <buildSeconds>');

const projectRoot = resolve(projectArg);
const outputCandidates = ['.output/public', 'dist/client', 'dist', 'build/client'];

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

async function walk(root, filter = () => true) {
  const out = [];
  if (!(await exists(root))) return out;
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) out.push(...await walk(path, filter));
    else if (entry.isFile() && filter(path)) out.push(path);
  }
  return out;
}

let outputRoot;
for (const candidate of outputCandidates) {
  const path = join(projectRoot, candidate);
  if (await exists(path)) { outputRoot = path; break; }
}
if (!outputRoot) throw new Error(`No public build output found for ${stack}`);

const outputFiles = await walk(outputRoot);
const sizes = await Promise.all(outputFiles.map(async (path) => ({ path, size: (await stat(path)).size })));
const byExt = (extension) => sizes.filter((item) => extname(item.path) === extension).reduce((sum, item) => sum + item.size, 0);
const sourceExts = new Set(['.ts', '.tsx', '.vue', '.css', '.md', '.mdx', '.yml', '.yaml', '.json']);
const sourceFiles = (await walk(projectRoot, (path) => sourceExts.has(extname(path))))
  .filter((path) => !path.includes('/node_modules/') && !path.includes('/.output/') && !path.includes('/dist/') && !path.endsWith('package-lock.json'));
let sourceBytes = 0;
let sourceLines = 0;
for (const path of sourceFiles) {
  const text = await readFile(path, 'utf8');
  sourceBytes += Buffer.byteLength(text);
  sourceLines += text.split('\n').length;
}

const metrics = {
  stack,
  measuredAt: new Date().toISOString(),
  installSeconds: Number(installArg),
  buildSeconds: Number(buildArg),
  outputRoot: relative(projectRoot, outputRoot),
  outputBytes: sizes.reduce((sum, item) => sum + item.size, 0),
  jsBytes: byExt('.js') + byExt('.mjs'),
  cssBytes: byExt('.css'),
  htmlBytes: byExt('.html'),
  assetCount: sizes.length,
  htmlCount: sizes.filter((item) => extname(item.path) === '.html').length,
  sourceFileCount: sourceFiles.length,
  sourceBytes,
  sourceLines,
};

const resultsDir = resolve(projectRoot, '..', 'results');
await mkdir(resultsDir, { recursive: true });
await writeFile(join(resultsDir, `${stack}.json`), `${JSON.stringify(metrics, null, 2)}\n`);
console.log(JSON.stringify(metrics, null, 2));
