// Builds the static pages in site/ from the templates in src/.
// No dependencies: run with `node tools/build.mjs` (or `npm run build`).
//
// Template syntax
//   {{name}}             value, HTML-escaped (dotted paths allowed: {{card.name}})
//   {{{name}}}           value, inserted raw
//   {{> partial a=b}}    include src/partials/partial.html with extra string params
//   {{#each list}}…{{/each}}  repeat for each item; use {{this.field}} inside
//
// Each page in src/pages starts with a JSON comment:  <!--@ { "out": "index.html", ... } -->
// A page with "each": "cards" is rendered once per card in site/assets/data/cards.json.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const get = (ctx, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function render(tpl, ctx) {
  tpl = tpl.replace(/{{#each ([\w.]+)}}([\s\S]*?){{\/each}}/g, (_, path, body) =>
    (get(ctx, path) || []).map((item) => render(body, { ...ctx, this: item })).join(''));
  tpl = tpl.replace(/{{> ([\w-]+)((?: \w+=[^\s}]+)*)}}/g, (_, name, args) => {
    const params = { ...ctx };
    for (const m of args.matchAll(/(\w+)=([^\s}]+)/g)) params[m[1]] = m[2];
    return render(read(`src/partials/${name}.html`), params);
  });
  tpl = tpl.replace(/{{{([\w.]+)}}}/g, (_, p) => get(ctx, p) ?? '');
  return tpl.replace(/{{([\w.]+)}}/g, (_, p) => {
    const v = get(ctx, p);
    if (v === undefined) throw new Error(`Missing template value "${p}"`);
    return esc(v);
  });
}

// Templates use root-relative URLs ("/credit-cards/"). They're rewritten to relative ones
// ("../credit-cards/") so the site works from any folder, such as a GitHub Pages project URL.
function relativise(out, html) {
  const depth = out.split('/').length - 1;
  const prefix = depth ? '../'.repeat(depth) : './';
  return html.replace(/(\s(?:href|src)=")\/(?!\/)/g, '$1' + prefix);
}

function write(out, html) {
  html = relativise(out, html);
  const file = join(root, 'site', out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('  wrote site/' + out);
}

const cards = JSON.parse(read('site/assets/data/cards.json'));

for (const name of readdirSync(join(root, 'src/pages'))) {
  const src = read(`src/pages/${name}`);
  const m = src.match(/^<!--@([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`src/pages/${name} is missing its <!--@ {…} --> header`);
  const meta = JSON.parse(m[1]);
  const body = src.slice(m[0].length);
  const layout = read(`src/partials/${meta.layout || 'layout'}.html`);
  // Credit cards is the current section on the landing page and every card page.
  const navCards = meta.nav === 'credit-cards' ? ' aria-current="page"' : meta.nav === 'credit-cards-child' ? ' aria-current="true"' : '';

  const items = meta.each ? Object.entries(cards).map(([key, card]) => ({ key, card })) : [{}];
  for (const item of items) {
    const ctx = { ...meta, ...item, navCards };
    if (item.card) {
      ctx.title = render(meta.title, ctx);
      ctx.description = render(meta.description, ctx);
    }
    const page = render(layout, { ...ctx, body: render(body, ctx) });
    write(render(meta.out, ctx), page);
  }
}
