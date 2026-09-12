import ts from 'typescript';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCanonicalFileName: f => f, getCurrentDirectory: () => root, getNewLine: () => '\n' }));
  process.exit(1);
}
mkdirSync(resolve(root, 'dist'), { recursive: true });
const modules = readdirSync(resolve(root, 'src')).filter(f => f.endsWith('.ts')).map(file => {
  const source = readFileSync(resolve(root, 'src', file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const name = './' + file.replace(/\.ts$/, '.js');
  writeFileSync(resolve(root, 'dist', file.replace(/\.ts$/, '.cjs')), code.replace(/require\("(\.\/[^" ]+)\.js"\)/g, 'require("$1.cjs")')); 
  return JSON.stringify(name) + ':function(require,module,exports){\n' + code + '\n}';
});
// The prototype has only relative local modules and no runtime dependencies.
const bundle = `(()=>{'use strict';const modules={${modules.join(',\n')}};const cache={};function require(id){if(cache[id])return cache[id].exports;if(!modules[id])throw new Error('Unknown local module: '+id);const module={exports:{}};cache[id]=module;modules[id](require,module,module.exports);return module.exports;}require('./app.js');})();`;
writeFileSync(resolve(root, 'dist/app.js'), bundle);
const css = ['styles.css', 'surfaces.css', 'overlays.css', 'layouts.css', 'workspace.css'].map(file => readFileSync(resolve(root, 'src', file), 'utf8')).join('');
writeFileSync(resolve(root, 'dist/styles.css'), css);
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
writeFileSync(resolve(root, 'dist/index.html'), html);
// A self-contained file:// preview, with no CDN, model calls, or server requirement.
const offline = html.replace('<link rel="stylesheet" href="./styles.css">', `<style>${css}</style>`)
  .replace('<script src="./app.js" defer></script>', `<script>${bundle.replace(/<\/script/gi, '<\\/script')}</script>`);
writeFileSync(resolve(root, 'dist/standalone.html'), offline);
console.log('Built dist/index.html and dist/standalone.html; TypeScript checked.');
