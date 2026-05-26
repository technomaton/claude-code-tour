/**
 * Convert Mintlify-flavored markdown (with JSX components) into plain
 * CommonMark + a few semantic HTML wrappers that react-markdown + rehype-raw
 * can render.
 *
 * Strategy:
 *   1. Pull code blocks out into placeholders so JSX regexes don't touch code.
 *   2. Iteratively replace JSX (innermost first via repeated non-greedy passes).
 *   3. Restore code blocks (with theme={null} cleaned from fence info strings).
 */

const ESC_MAP: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ESC_MAP[c]);

const attr = (s: string, name: string): string | null => {
  const m = new RegExp(`${name}="([^"]+)"`).exec(s);
  return m ? m[1] : null;
};

/** Remove the minimum common leading-space indent from every line, so a JSX
 *  block that was nested inside another JSX block doesn't become an indented
 *  code block once re-emitted. */
function dedent(s: string): string {
  // Trim leading/trailing blank lines for indent computation but preserve interior structure
  const lines = s.split("\n");
  let min = Infinity;
  for (const l of lines) {
    if (!l.trim()) continue;
    const m = /^( +)/.exec(l);
    const n = m ? m[1].length : 0;
    if (n < min) min = n;
  }
  if (min === Infinity || min === 0) return s.trim();
  const pad = " ".repeat(min);
  return lines.map((l) => (l.startsWith(pad) ? l.slice(min) : l)).join("\n").trim();
}

/** Replace until the string stops changing — handles nested same-tag JSX. */
function loopReplace(s: string, re: RegExp, fn: (...a: string[]) => string): string {
  let prev: string;
  do {
    prev = s;
    s = s.replace(re, fn);
  } while (s !== prev);
  return s;
}

const CALLOUTS: Record<string, string> = {
  Info: "info",
  Tip: "tip",
  Warning: "warning",
  Note: "note",
  Danger: "warning",
  Callout: "note",
};

const ICONS: Record<string, string> = {
  info: "ℹ",
  tip: "✦",
  warning: "⚠",
  note: "•",
};

function transformProse(text: string): string {
  let s = text;

  // Custom Mintlify components that have no offline equivalent — drop
  s = s.replace(
    /<(ContactSalesCard|ClaudeExplorer|ContextWindow|PromptLibrary)\b[^>]*\/>/g,
    "",
  );
  // <Experiment .../> may contain nested JSX inside attribute braces — drop greedily
  s = s.replace(/<Experiment\b[\s\S]*?\/>/g, "");

  // Tabs (nested) — match TRULY innermost <Tabs> first via negative lookahead,
  // so nesting unwinds via loopReplace from inside out.
  s = loopReplace(
    s,
    /<Tabs(?:\s[^>]*)?>((?:(?!<Tabs[\s>])[\s\S])*?)<\/Tabs>/g,
    (_m, inner) => {
      const tabs: { title: string; body: string }[] = [];
      // Inner <Tab> children — by the time we get here the truly-innermost
      // <Tabs> has been replaced (no nested <Tabs> remains), so non-greedy is safe.
      const inner2 = loopReplace(
        inner,
        /<Tab\s+([^>]*)>((?:(?!<Tab[\s>])[\s\S])*?)<\/Tab>/g,
        (_t, attrs, body) => {
          const title = attr(attrs, "title") ?? "Tab";
          tabs.push({ title, body: dedent(body) });
          return "";
        },
      );
      if (tabs.length === 0) return inner2; // nothing matched — leave inner content
      return (
        "\n\n" +
        tabs.map((t) => `**${t.title}**\n\n${t.body}`).join("\n\n") +
        "\n\n"
      );
    },
  );

  // AccordionGroup — unwrap
  s = s.replace(/<\/?AccordionGroup(?:\s[^>]*)?>/g, "");
  s = loopReplace(
    s,
    /<Accordion\s+([^>]*)>((?:(?!<Accordion[\s>])[\s\S])*?)<\/Accordion>/g,
    (_m, attrs, body) => {
      const title = attr(attrs, "title") ?? "Details";
      return `\n\n<details class="cct-accordion">\n<summary>${escapeHtml(title)}</summary>\n\n${dedent(body)}\n\n</details>\n\n`;
    },
  );

  // Callouts (innermost-first via negative lookahead — safe even if Mintlify ever nests them)
  for (const [tag, cls] of Object.entries(CALLOUTS)) {
    const re = new RegExp(
      `<${tag}(?:\\s[^>]*)?>((?:(?!<${tag}[\\s>])[\\s\\S])*?)</${tag}>`,
      "g",
    );
    s = loopReplace(s, re, (_m, body) => {
      const icon = ICONS[cls] ?? "•";
      // Use blockquote-like markdown structure with HTML wrapper — guarantees
      // markdown picks this up as block-level even when nested inside other HTML.
      return `\n\n<div class="callout callout-${cls}">\n<div class="callout-icon">${icon}</div>\n<div class="callout-body">\n\n${dedent(body)}\n\n</div>\n</div>\n\n`;
    });
  }

  // Steps (innermost-first)
  s = loopReplace(s, /<Steps(?:\s[^>]*)?>((?:(?!<Steps[\s>])[\s\S])*?)<\/Steps>/g, (_m, inner) => {
    let body = "";
    const inner2 = loopReplace(
      inner,
      /<Step\s+([^>]*)>((?:(?!<Step[\s>])[\s\S])*?)<\/Step>/g,
      (_t, attrs, b) => {
        const t = attr(attrs, "title");
        const head = t ? `**${escapeHtml(t)}**\n\n` : "";
        body += `\n\n<div class="cct-step">\n\n${head}${dedent(b)}\n\n</div>\n\n`;
        return "";
      },
    );
    return body
      ? `\n\n<div class="cct-steps">\n${body}\n</div>\n\n`
      : `\n\n${inner2}\n\n`;
  });

  // Cards (innermost-first)
  s = loopReplace(
    s,
    /<CardGroup(?:\s[^>]*)?>((?:(?!<CardGroup[\s>])[\s\S])*?)<\/CardGroup>/g,
    (_m, inner) => `\n\n<div class="cct-cards">\n\n${inner}\n\n</div>\n\n`,
  );
  // Paired Card
  s = loopReplace(
    s,
    /<Card\s+([^>]*)>((?:(?!<Card[\s>])[\s\S])*?)<\/Card>/g,
    (_m, attrs, body) => {
      const title = attr(attrs, "title") ?? "Card";
      const href = attr(attrs, "href");
      const titleHtml = href
        ? `<a href="${escapeHtml(href)}" class="cct-card-title">${escapeHtml(title)}</a>`
        : `<div class="cct-card-title">${escapeHtml(title)}</div>`;
      return `\n\n<div class="cct-card">\n\n${titleHtml}\n\n${dedent(body)}\n\n</div>\n\n`;
    },
  );
  // Self-closing Card
  s = s.replace(/<Card\s+([^>/]*)\/>/g, (_m, attrs) => {
    const title = attr(attrs, "title") ?? "Card";
    const href = attr(attrs, "href");
    const titleHtml = href
      ? `<a href="${escapeHtml(href)}" class="cct-card-title">${escapeHtml(title)}</a>`
      : `<div class="cct-card-title">${escapeHtml(title)}</div>`;
    return `\n\n<div class="cct-card">\n\n${titleHtml}\n\n</div>\n\n`;
  });

  // Update label="X"
  s = s.replace(
    /<Update\s+([^>]*)>([\s\S]*?)<\/Update>/g,
    (_m, attrs, body) => {
      const label = attr(attrs, "label") ?? "Update";
      return `\n#### ${escapeHtml(label)}\n\n${dedent(body)}\n`;
    },
  );

  // Unwrap layout-only wrappers
  s = s.replace(/<\/?(Frame|CodeGroup)(?:\s[^>]*)?>/g, "");

  // Collapse runs of 3+ newlines that may have piled up from added \n\n bookends
  s = s.replace(/\n{3,}/g, "\n\n");

  return s;
}

const INLINE_CODE_RE = /`[^`\n]+`/g;

// Self-delimiting placeholders — survive dedent/whitespace shuffling.
const FENCE_TAG = "CCTFENCE";
const INLINE_TAG = "CCTINLINE";

/** Clean theme={null} from the fence info string and align the closing fence
 *  to column 0 by removing the closer's indent from every line. */
function normalizeFence(m: string): string {
  let cleaned = m.replace(/^( *```+)([^\n]*?)\s*theme=\{null\}([^\n]*)/, "$1$2$3");
  const lines = cleaned.split("\n");
  if (lines.length < 2) return cleaned;
  const closer = lines[lines.length - 1];
  const closeIndentMatch = /^( +)`{3,}\s*$/.exec(closer);
  if (!closeIndentMatch) return cleaned;
  const pad = closeIndentMatch[1];
  return lines
    .map((l) => (l.startsWith(pad) ? l.slice(pad.length) : l))
    .join("\n");
}

export function preprocess(md: string): string {
  // 1. Strip the leading "Documentation Index" blockquote that every doc has
  md = md.replace(/^>\s*## Documentation Index[\s\S]*?(?:\n\n|$)/, "");

  // 2. Pull out code blocks in passes, widest fence first, so a 4-backtick
  //    fence wrapping inner 3-backtick fences is captured whole.
  //    Each pass: optional leading whitespace, exactly-N backticks (no more),
  //    info string, body (non-greedy), newline, optional whitespace,
  //    exactly-N backticks (no more), end of line.
  const fences: string[] = [];
  const push = (m: string): string => {
    fences.push(normalizeFence(m));
    return `\n${FENCE_TAG}${fences.length - 1}${FENCE_TAG}\n`;
  };
  // Pass A — 5+ backticks
  md = md.replace(
    /(?:^|\n)[ \t]*(`{5,})(?!`)[^\n]*\n[\s\S]*?\n[ \t]*\1(?!`)[ \t]*(?=\n|$)/g,
    (m) => "\n" + push(m.replace(/^\n/, "")),
  );
  // Pass B — exactly 4 backticks
  md = md.replace(
    /(?:^|\n)[ \t]*(`{4})(?!`)[^\n]*\n[\s\S]*?\n[ \t]*\1(?!`)[ \t]*(?=\n|$)/g,
    (m) => "\n" + push(m.replace(/^\n/, "")),
  );
  // Pass C — exactly 3 backticks
  md = md.replace(
    /(?:^|\n)[ \t]*(`{3})(?!`)[^\n]*\n[\s\S]*?\n[ \t]*\1(?!`)[ \t]*(?=\n|$)/g,
    (m) => "\n" + push(m.replace(/^\n/, "")),
  );

  // 3. Pull out inline code (single-line; no newlines needed)
  const inlines: string[] = [];
  md = md.replace(INLINE_CODE_RE, (m) => {
    inlines.push(m);
    return `${INLINE_TAG}${inlines.length - 1}${INLINE_TAG}`;
  });

  // 4. Aggressive dedent: Mintlify nests JSX with 2/4/6/8-space indent. After
  //    extracting fenced code (which preserves its own internal indentation),
  //    any remaining line starting with 4+ spaces is JSX-wrapper indent that
  //    would otherwise be interpreted as an indented code block. Strip it.
  //    Nested lists with <4 space indent are preserved.
  md = md.replace(/^ {4,}/gm, "");

  // 5. Transform JSX
  md = transformProse(md);

  // 6. Restore (inline first, then fences)
  md = md.replace(
    new RegExp(`${INLINE_TAG}(\\d+)${INLINE_TAG}`, "g"),
    (_m, i) => inlines[+i],
  );
  md = md.replace(
    new RegExp(`${FENCE_TAG}(\\d+)${FENCE_TAG}`, "g"),
    (_m, i) => fences[+i],
  );

  return md;
}

/** Extract H1 title + first blockquote line as a one-line summary. */
export function extractMeta(md: string): { title: string; lead: string } {
  const cleaned = md.replace(
    /^>\s*## Documentation Index[\s\S]*?(?:\n\n|$)/,
    "",
  );
  const h1 = /^#\s+(.+)$/m.exec(cleaned);
  const lead = /^>\s+(.+)$/m.exec(cleaned);
  return {
    title: h1 ? h1[1].trim() : "",
    lead: lead ? lead[1].trim() : "",
  };
}
