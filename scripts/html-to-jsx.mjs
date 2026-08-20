/**
 * html-to-jsx.mjs — one-shot converter that turns the legacy static site in
 * legacy/*.html into App Router routes under app/.
 *
 * Run with: node scripts/html-to-jsx.mjs
 *
 * It is kept in the repo so the conversion is reproducible/auditable, but the
 * generated files under app/ are the source of truth from here on.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEGACY = join(ROOT, 'legacy');

/* index.html is the site root; every other page keeps its filename as slug. */
const routeFor = (file) =>
  file === 'index.html' ? '/' : '/' + file.replace(/\.html$/, '');

/* Void elements must be self-closed in JSX. */
const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
]);

/* HTML attribute -> JSX prop. Anything not listed and not data-/aria- gets
   camelCased below. */
const ATTR_MAP = {
  class: 'className',
  for: 'htmlFor',
  autoplay: 'autoPlay',
  playsinline: 'playsInline',
  muted: 'muted',
  loop: 'loop',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  tabindex: 'tabIndex',
  maxlength: 'maxLength',
  minlength: 'minLength',
  readonly: 'readOnly',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  crossorigin: 'crossOrigin',
  srcset: 'srcSet',
  usemap: 'useMap',
  novalidate: 'noValidate',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  enctype: 'encType',
  formaction: 'formAction',
  accesskey: 'accessKey',
  frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen',
  referrerpolicy: 'referrerPolicy',
  /* SVG */
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'stroke-miterlimit': 'strokeMiterlimit',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'letter-spacing': 'letterSpacing',
  'marker-end': 'markerEnd',
  'marker-start': 'markerStart',
  'gradientunits': 'gradientUnits',
  'patternunits': 'patternUnits',
  'preserveaspectratio': 'preserveAspectRatio',
  'viewbox': 'viewBox',
  'xlink:href': 'xlinkHref',
  'xmlns:xlink': 'xmlnsXlink',
};

/* Boolean attributes that JSX wants as {true} rather than a string. */
const BOOLEAN_ATTRS = new Set([
  'autoplay', 'muted', 'loop', 'controls', 'playsinline', 'disabled',
  'checked', 'selected', 'required', 'readonly', 'multiple', 'novalidate',
  'autofocus', 'defer', 'async', 'hidden', 'open', 'reversed', 'allowfullscreen',
]);

function jsxAttrName(name) {
  if (ATTR_MAP[name]) return ATTR_MAP[name];
  if (name.startsWith('data-') || name.startsWith('aria-')) return name;
  if (name.includes(':')) return name; // leave exotic namespaced attrs alone
  if (name.includes('-')) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}

/* style="a: b; c: d" -> {{ a: 'b', c: 'd' }} */
function styleToObject(value) {
  const entries = [];
  for (const decl of value.split(';')) {
    const i = decl.indexOf(':');
    if (i === -1) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) continue;
    const key = prop.startsWith('--')
      ? `'${prop}'`
      : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    entries.push(`${key}: ${JSON.stringify(val)}`);
  }
  return entries.length ? `{{ ${entries.join(', ')} }}` : null;
}

/* Text nodes: escape the two characters JSX treats as syntax. */
function escapeText(text) {
  return text.replace(/[{}]/g, (c) => `{'${c}'}`).replace(/\\/g, '\\\\');
}

/* Attribute values may contain quotes/newlines; JSON.stringify handles both,
   and a JS string expression is always legal as a JSX attribute value. */
function attrValueExpr(value) {
  return `{${JSON.stringify(value)}}`;
}

/**
 * Tokenising parser. The legacy markup is hand-written and mostly well-formed,
 * but it has unclosed <img>/<br> and stray comments, so a forgiving tokeniser
 * beats a strict one here.
 */
function tokenize(html) {
  const tokens = [];
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      if (i < html.length) tokens.push({ type: 'text', value: html.slice(i) });
      break;
    }
    if (lt > i) tokens.push({ type: 'text', value: html.slice(i, lt) });

    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt);
      const stop = end === -1 ? html.length : end + 3;
      tokens.push({ type: 'comment', value: html.slice(lt + 4, end === -1 ? html.length : end) });
      i = stop;
      continue;
    }
    if (html.startsWith('<!', lt)) {
      const end = html.indexOf('>', lt);
      i = end === -1 ? html.length : end + 1;
      continue; // doctype and friends are dropped
    }
    if (html.startsWith('</', lt)) {
      const end = html.indexOf('>', lt);
      const name = html.slice(lt + 2, end).trim().toLowerCase();
      tokens.push({ type: 'close', name });
      i = end + 1;
      continue;
    }

    /* Open tag: scan to the matching '>' while respecting quoted values. */
    let j = lt + 1;
    let quote = null;
    while (j < html.length) {
      const ch = html[j];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === '>') {
        break;
      }
      j++;
    }
    const raw = html.slice(lt + 1, j);
    i = j + 1;

    const selfClosing = raw.trimEnd().endsWith('/');
    const body = selfClosing ? raw.trimEnd().slice(0, -1) : raw;
    const nameMatch = body.match(/^([A-Za-z][A-Za-z0-9:-]*)/);
    if (!nameMatch) continue;
    const name = nameMatch[1].toLowerCase();
    const attrs = parseAttrs(body.slice(nameMatch[1].length));

    /* <script>/<style> content is raw text — grab it verbatim. */
    if (name === 'script' || name === 'style') {
      const closeTag = `</${name}`;
      const closeIdx = html.toLowerCase().indexOf(closeTag, i);
      const inner = closeIdx === -1 ? '' : html.slice(i, closeIdx);
      i = closeIdx === -1 ? html.length : html.indexOf('>', closeIdx) + 1;
      tokens.push({ type: 'raw', name, attrs, content: inner });
      continue;
    }

    tokens.push({ type: 'open', name, attrs, selfClosing: selfClosing || VOID.has(name) });
  }
  return tokens;
}

function parseAttrs(str) {
  const attrs = [];
  const re = /([A-Za-z_:@][A-Za-z0-9_.:@-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(str))) {
    const name = m[1].toLowerCase();
    const value = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4];
    attrs.push({ name, value });
  }
  return attrs;
}

/* Build a tree so unclosed tags can be auto-closed sanely. */
function buildTree(tokens) {
  const root = { name: '#root', children: [] };
  const stack = [root];
  for (const t of tokens) {
    const parent = stack[stack.length - 1];
    if (t.type === 'text' || t.type === 'comment' || t.type === 'raw') {
      parent.children.push(t);
    } else if (t.type === 'open') {
      const node = { type: 'element', name: t.name, attrs: t.attrs, children: [] };
      parent.children.push(node);
      if (!t.selfClosing) stack.push(node);
    } else if (t.type === 'close') {
      /* Pop to the nearest matching open tag; ignore strays. */
      const idx = stack.map((n) => n.name).lastIndexOf(t.name);
      if (idx > 0) stack.length = idx;
    }
  }
  return root;
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const KNOWN_ROUTES = new Set();

/* legacy "premium-playing-cards.html" -> "/premium-playing-cards".
   Returns null when the href is not an internal page link. */
function internalRoute(href) {
  if (!href) return null;
  const m = href.match(/^\.?\/?([A-Za-z0-9_-]+)\.html(#.*)?$/);
  if (!m) return null;
  const slug = m[1];
  const route = slug === 'index' ? '/' : `/${slug}`;
  if (!KNOWN_ROUTES.has(route)) return null;
  return route + (m[2] || '');
}

/* Attributes whose value is a path to something in public/. */
const ASSET_ATTRS = new Set(['src', 'poster', 'data']);

/**
 * The legacy pages sat at the domain root, so "img/foo.avif" resolved fine
 * from every one of them. App Router routes are nested ("/premium-playing-cards"),
 * where the same relative path would resolve to
 * "/premium-playing-cards/img/foo.avif" and 404. Everything under public/ has
 * to be addressed from the root.
 */
function assetPath(value) {
  if (!value) return value;
  if (/^(https?:)?\/\//i.test(value)) return value;
  if (/^(#|\/|data:|mailto:|tel:|blob:|javascript:)/i.test(value)) return value;
  return '/' + value.replace(/^\.\//, '');
}

/* srcset is a comma-separated list of "path descriptor" pairs. */
function assetSrcSet(value) {
  return value
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      const [url, ...rest] = trimmed.split(/\s+/);
      return [assetPath(url), ...rest].join(' ');
    })
    .filter(Boolean)
    .join(', ');
}

function renderNode(node, indent, ctx) {
  const pad = '  '.repeat(indent);

  if (node.type === 'text') {
    const value = node.value;
    if (!value.trim()) return '';
    return pad + escapeText(value.trim().replace(/\s+/g, ' ')) + '\n';
  }
  if (node.type === 'comment') {
    const text = node.value.replace(/\*\//g, '*​/').trim();
    if (!text) return '';
    return `${pad}{/* ${text.replace(/\s+/g, ' ')} */}\n`;
  }
  if (node.type === 'raw') {
    /* <script>/<style> inside the body are hoisted out by the caller. */
    return '';
  }

  const { name, attrs, children } = node;
  const props = [];
  let isInternalLink = false;
  let isHideOnError = false;

  for (const { name: an, value } of attrs) {
    /* The one inline handler in the whole site hides a decorative image if it
       fails to load; <HideOnError> below reproduces it. */
    if (an === 'onerror' && name === 'img' && /style\.display\s*=\s*'none'/.test(value ?? '')) {
      ctx.usesHideOnError = true;
      isHideOnError = true;
      continue;
    }
    if (an.startsWith('on')) {
      console.warn(`  ! dropped inline handler ${an}="${value}" on <${name}>`);
      continue;
    }
    if (an === 'style') {
      const obj = styleToObject(value ?? '');
      if (obj) props.push(`style=${obj}`);
      continue;
    }
    if (an === 'href' && name === 'a') {
      const route = internalRoute(value);
      if (route) {
        isInternalLink = true;
        props.push(`href=${attrValueExpr(route)}`);
        continue;
      }
    }
    if (ASSET_ATTRS.has(an) && value !== undefined) {
      props.push(`${jsxAttrName(an)}=${attrValueExpr(assetPath(value))}`);
      continue;
    }
    if (an === 'srcset' && value !== undefined) {
      props.push(`srcSet=${attrValueExpr(assetSrcSet(value))}`);
      continue;
    }
    /* <link rel="icon" href="img/..."> and friends inside the body. */
    if (an === 'href' && name !== 'a' && value !== undefined) {
      props.push(`href=${attrValueExpr(assetPath(value))}`);
      continue;
    }
    if (value === undefined) {
      props.push(BOOLEAN_ATTRS.has(an) ? `${jsxAttrName(an)}` : `${jsxAttrName(an)}=""`);
      continue;
    }
    props.push(`${jsxAttrName(an)}=${attrValueExpr(value)}`);
  }

  let tag = name;
  if (isInternalLink) {
    tag = 'Link';
    ctx.usesLink = true;
  } else if (isHideOnError) {
    tag = 'HideOnError';
  }

  const propStr = props.length ? ' ' + props.join(' ') : '';
  const kids = children.map((c) => renderNode(c, indent + 1, ctx)).join('');

  if (isHideOnError) return `${pad}<${tag}${propStr} />\n`;
  if (VOID.has(name)) return `${pad}<${tag}${propStr} />\n`;
  if (!kids) return `${pad}<${tag}${propStr}></${tag}>\n`;
  return `${pad}<${tag}${propStr}>\n${kids}${pad}</${tag}>\n`;
}

/* ------------------------------------------------------------------ */
/* Head extraction                                                     */
/* ------------------------------------------------------------------ */

function extractHead(html) {
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [, ''])[1];
  const title = (head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  const meta = (name) => {
    const re = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*>`, 'i');
    const tag = head.match(re);
    if (!tag) return '';
    const c = tag[0].match(/content=["']([\s\S]*?)["']/i);
    return c ? c[1].replace(/\s+/g, ' ').trim() : '';
  };
  const scripts = [...head.matchAll(/<script[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  const styles = [...head.matchAll(/<link[^>]*\shref=["']([^"']+)["'][^>]*>/gi)]
    .filter((m) => /stylesheet/i.test(m[0]))
    .map((m) => m[1])
    .filter((h) => /^https?:/.test(h));
  /* Every page carries its per-page overrides in <head><style> blocks. */
  const headStyles = [...head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((m) => m[1].trim())
    .filter(Boolean);
  return {
    title,
    description: meta('description'),
    keywords: meta('keywords'),
    scripts,
    styles,
    headStyles,
  };
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const files = readdirSync(LEGACY).filter((f) => f.endsWith('.html')).sort();
files.forEach((f) => KNOWN_ROUTES.add(routeFor(f)));

const manifest = [];

for (const file of files) {
  const html = readFileSync(join(LEGACY, file), 'utf8');
  const head = extractHead(html);
  const route = routeFor(file);

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;

  const tokens = tokenize(body);

  /* Pull inline <style> and <script> out of the body stream. */
  const inlineStyles = [];
  const inlineScripts = [];
  const bodyScriptSrcs = [];
  for (const t of tokens) {
    if (t.type !== 'raw') continue;
    if (t.name === 'style') {
      if (t.content.trim()) inlineStyles.push(t.content.trim());
    } else {
      const src = t.attrs.find((a) => a.name === 'src');
      if (src) bodyScriptSrcs.push(src.value);
      else if (t.content.trim()) inlineScripts.push(t.content.trim());
    }
  }

  const tree = buildTree(tokens);
  const ctx = { usesLink: false, usesHideOnError: false };
  const jsx = tree.children.map((c) => renderNode(c, 3, ctx)).join('');

  manifest.push({
    file,
    route,
    head,
    bodyScriptSrcs,
    inlineStyles,
    inlineScripts,
    usesLink: ctx.usesLink,
    usesHideOnError: ctx.usesHideOnError,
    jsx,
  });
}

/* Emit the raw conversion artefacts; assembly into pages happens in
   scripts/emit-pages.mjs so the two concerns stay separable. */
mkdirSync(join(ROOT, '.conversion'), { recursive: true });
writeFileSync(
  join(ROOT, '.conversion', 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);
console.log(`Converted ${manifest.length} pages -> .conversion/manifest.json`);
for (const m of manifest) {
  console.log(
    `  ${m.file} -> ${m.route}  (jsx ${m.jsx.split('\n').length} lines, ` +
      `${m.head.headStyles.length + m.inlineStyles.length} inline styles, ` +
      `${m.inlineScripts.length} inline scripts)`
  );
}
