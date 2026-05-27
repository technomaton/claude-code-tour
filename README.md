# Claude Code Tour

An interactive walkthrough of the entire [Claude Code](https://code.claude.com/docs/en/overview) documentation — 140 pages organized into a sensible reading order, with read-tracking and full-text search.

Content is fetched from `code.claude.com/docs/en/*.md` and bundled at build time. The official source remains the authoritative one; this is an offline reading aid.

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Build for hosting

```bash
pnpm build        # → dist/
pnpm preview      # serve the built site at :4173
```

The `dist/` folder is a static SPA — host it anywhere (Netlify, Vercel, Cloudflare Pages, S3, GitHub Pages).

## Slash command

A `.claude/commands/claude-code-tour.md` is included. To make it available from any Claude Code session:

```bash
mkdir -p ~/.claude/commands
cp .claude/commands/claude-code-tour.md ~/.claude/commands/
```

Then in any project: `/claude-code-tour`.

## Refresh content

Re-run the downloader to pick up upstream doc changes:

```bash
cd raw-docs && cat urls.txt | xargs -n1 -P8 ./download.sh
```

## What it covers

17 sections, ~140 pages:

1. Start here · 2. Install & first session · 3. Day-to-day basics · 4. Memory & configuration · 5. Skills/commands/subagents/hooks · 6. Plugins · 7. MCP & channels · 8. Multi-agent & scheduling · 9. Surfaces & integrations · 10. CI/CD & code review · 11. Costs / monitoring / troubleshooting · 12. Security & data · 13. Enterprise deployment · 14. Agent SDK · 15. Reference · 16. Community & rollout · 17. What's new (weekly)

## Keyboard

- `/` — open search
- `j` / `k` — next / previous step
- `↑` `↓` `Enter` `Esc` — in search

## Stack

Vite + React 19 + Tailwind v4 + react-markdown + remark-gfm + rehype-raw + Fuse.js.

## Decision tree — "I want to…"

A non-linear entry at `#start`. Pick a goal from 12 cards (use Claude daily, review
PRs, run in CI, build an SDK agent, MCP, IDE, team workflows, big codebase, policy
enforcement, enterprise, background tasks, just exploring) and you get:

- 3-5 hand-picked docs to read first, with a one-line "why" for each
- A link to the setup wizard if it fits
- Links to the relevant config builders (hook / skill / settings / slash-command)

Lives under `src/decision-tree/`. Use cases are data in `src/decision-tree/useCases.ts` —
each `doc.id` is cross-checked against `src/manifest.ts`.

## License

Documentation content is © Anthropic, under their terms. The tour shell (code in this repo) is MIT.
