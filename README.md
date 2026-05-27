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

## Setup wizard

A guided 7-step flow at `#wizard` that produces a downloadable starter
`.claude/` config tailored to your project:

1. **Intro** — pick your OS
2. **Install** — the exact install command for your OS, with a Copy button
3. **First session** — `cd` + `claude` walkthrough
4. **CLAUDE.md** — form (project type, languages, package manager, commands,
   conventions) with **live markdown preview**
5. **settings.json** — model radio, Bash allow/deny lists, hooks toggles,
   env vars, with **live JSON preview**
6. **Extras** — optional `/review` slash-command
7. **Done** — one-click download of `claude-starter.zip` (CLAUDE.md +
   `.claude/settings.json` + `.claude/commands/review.md`)

State is persisted to `localStorage` (`cct-wizard-v1`) so you can resume.
ZIP generation uses [jszip](https://stuk.github.io/jszip/) entirely
client-side — no server, no upload.

## License

Documentation content is © Anthropic, under their terms. The tour shell (code in this repo) is MIT.
