import { Marked } from "marked";
import { assetUrl } from "./db";

/**
 * Case-study markdown. Three things on top of CommonMark:
 *
 *   ![[file.png|caption]]   embed an asset from the project's media folder
 *   :::name{k=v}...:::      a layout block, rendered as <div class="case-name">
 *   raw HTML                passed through, for one-off figures
 *
 * Layout names are not enumerated: `:::foo` becomes `.case-foo`, so a new
 * layout is a CSS rule in globals.css and nothing else.
 */

export type TocEntry = { id: string; title: string };

const VIDEO = /\.(mp4|webm|mov|m4v)$/i;

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** `{cols=3 label="n+1"}` → { cols: "3", label: "n+1" } */
function parseAttrs(raw?: string): Record<string, string> {
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const m of raw.matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s}]+))/g)) {
    out[m[1]] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return out;
}

const OPEN = /^\s*:::([a-z][\w-]*)\s*(\{[^}]*\})?\s*$/;
const CLOSE = /^\s*:::\s*$/;

type Node = { name: string; attrs: Record<string, string>; lines: string[]; children: Node[] };

/**
 * Rewrites `:::` blocks into HTML wrappers, leaving everything else alone.
 * Runs before marked so the block content is still parsed as markdown.
 */
function directives(src: string): string {
  const lines = src.split("\n");
  const root: Node = { name: "", attrs: {}, lines: [], children: [] };
  const stack: Node[] = [root];

  // Text and nested blocks interleave, so a child is emitted as a marker line
  // and spliced back in at render time.
  const mark = (i: number) => `\u0000${i}\u0000`;

  for (const line of lines) {
    const top = stack[stack.length - 1];
    const open = line.match(OPEN);
    if (open) {
      const child: Node = {
        name: open[1],
        attrs: parseAttrs(open[2]),
        lines: [],
        children: [],
      };
      top.children.push(child);
      top.lines.push(mark(top.children.length - 1));
      stack.push(child);
      continue;
    }
    if (CLOSE.test(line) && stack.length > 1) {
      stack.pop();
      continue;
    }
    top.lines.push(line);
  }

  const render = (node: Node): string => {
    const body = node.lines
      .map((l) => {
        const ref = l.match(/^\u0000(\d+)\u0000$/);
        return ref ? render(node.children[Number(ref[1])]) : l;
      })
      .join("\n");

    if (!node.name) return body;
    return block(node.name, node.attrs, body);
  };

  return render(root);
}

/** One layout block. Special-cases the few that need more than a wrapper. */
function block(
  name: string,
  attrs: Record<string, string>,
  body: string,
): string {
  const cls = [`case-${name}`, attrs.cols ? `case-${name}-${attrs.cols}` : ""]
    .filter(Boolean)
    .join(" ");

  if (name === "slot") {
    return `\n<div class="media-slot">${esc(body.trim())}</div>\n`;
  }
  if (name === "card") {
    const label = attrs.label
      ? `<div class="case-card-label">${esc(attrs.label)}</div>`
      : "";
    return `\n<div class="${cls}">${label}\n\n${body}\n\n</div>\n`;
  }
  if (name === "figure") {
    const cap = attrs.caption
      ? `<figcaption class="case-caption">${esc(attrs.caption)}</figcaption>`
      : "";
    return `\n<figure class="case-media">\n\n${body}\n\n${cap}</figure>\n`;
  }
  return `\n<div class="${cls}">\n\n${body}\n\n</div>\n`;
}

/** `![[clip.mp4|caption]]` → a figure pointing at the project's media folder. */
function embeds(src: string, slug: string): string {
  return src.replace(/!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, file, caption) => {
    const name = String(file).trim();
    const url = /^(https?:\/\/|\/)/.test(name) ? name : assetUrl(slug, name);
    const alt = esc(String(caption ?? name).trim());
    const media = VIDEO.test(name)
      ? `<video src="${esc(url)}" controls playsinline preload="metadata"></video>`
      : `<img src="${esc(url)}" alt="${alt}" loading="lazy" />`;
    const cap = caption
      ? `<figcaption class="case-caption">${esc(String(caption).trim())}</figcaption>`
      : "";
    return `\n<figure class="case-media">${media}${cap}</figure>\n`;
  });
}

export function renderCaseBody(markdown: string, slug: string) {
  const md = directives(embeds(markdown, slug));

  const toc: TocEntry[] = [];
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text.replace(/<[^>]*>/g, ""));
        if (depth === 2) toc.push({ id, title: text.replace(/<[^>]*>/g, "") });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });

  return { html: marked.parse(md) as string, toc };
}
