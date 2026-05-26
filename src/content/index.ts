/** Vite glob-import all markdown docs as raw strings at build time. */
import { ITEMS } from "../manifest";

// Eagerly load every .md under docs/ — file count is small (~140) and total
// size is ~4MB. The Vite bundler tree-shakes per-route in production builds.
const modules = import.meta.glob<string>("./docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

// modules keys look like "./docs/overview.md" — normalize to "overview.md"
const RAW: Record<string, string> = {};
for (const [path, body] of Object.entries(modules)) {
  const slug = path.replace(/^\.\/docs\//, "");
  RAW[slug] = body;
}

export function getRaw(slug: string): string | undefined {
  return RAW[slug];
}

export function allRaw(): Record<string, string> {
  return RAW;
}

/** slug → manifest item id, for the search index. */
export const SLUG_TO_ID: Record<string, string> = Object.fromEntries(
  Object.values(ITEMS).map((i) => [i.slug, i.id]),
);
