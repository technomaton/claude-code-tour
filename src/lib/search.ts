import Fuse from "fuse.js";
import { ITEMS, type DocItem } from "../manifest";

export interface SearchEntry extends DocItem {
  /** Plain-text searchable body (markdown stripped of fences/JSX). */
  body: string;
}

let fuse: Fuse<SearchEntry> | null = null;
let entries: SearchEntry[] = [];

function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]+`/g, (m) => m.slice(1, -1))
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildIndex(
  rawDocs: Record<string, string>,
  slugToId: Record<string, string>,
) {
  entries = Object.entries(rawDocs)
    .map(([slug, body]) => {
      const id = slugToId[slug];
      if (!id) return null;
      const item = ITEMS[id];
      if (!item) return null;
      return { ...item, body: plainText(body) };
    })
    .filter((x): x is SearchEntry => x !== null);

  fuse = new Fuse(entries, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "description", weight: 0.3 },
      { name: "body", weight: 0.2 },
    ],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.35,
    ignoreLocation: true,
  });
}

export interface SearchHit {
  item: SearchEntry;
  snippet: string;
}

export function search(query: string, limit = 20): SearchHit[] {
  if (!fuse || !query.trim()) return [];
  const results = fuse.search(query, { limit });
  return results.map((r) => {
    const m = r.matches?.find((mm) => mm.key === "body");
    let snippet = r.item.description;
    if (m && m.value && m.indices.length > 0) {
      const [start, end] = m.indices[0];
      const from = Math.max(0, start - 40);
      const to = Math.min(m.value.length, end + 80);
      snippet =
        (from > 0 ? "…" : "") +
        m.value.slice(from, to) +
        (to < m.value.length ? "…" : "");
    }
    return { item: r.item, snippet };
  });
}
