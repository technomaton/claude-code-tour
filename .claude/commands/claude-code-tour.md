---
description: Open the interactive Claude Code documentation tour in the browser
---

# Open Claude Code Tour

A locally-hosted interactive walkthrough of the official Claude Code documentation lives in `~/projects/claude-code-tour`.

Do the following, in order:

1. `cd ~/projects/claude-code-tour`
2. If the directory does **not** exist, tell the user the tour project is missing and stop.
3. If `node_modules/` is missing, run `pnpm install`.
4. Check whether a dev server is already listening on port 5173 (`lsof -ti tcp:5173`). If something is listening, skip step 5.
5. Start the Vite dev server in the background: `pnpm dev`.
6. Open the URL in the user's default browser: `open http://localhost:5173` on macOS, `xdg-open` on Linux, `start` on Windows.
7. Tell the user the URL and how to stop the server (Ctrl+C in the running process, or kill the PID).

If anything fails, surface the exact command + error and stop — don't paper over it.
