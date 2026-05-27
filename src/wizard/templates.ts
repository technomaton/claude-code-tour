/**
 * Pure string generators for the files the wizard hands the user.
 * Inputs are slices of WizardState; outputs are plain text.
 */
import type { WizardState } from "./state";

const PROJECT_TYPE_LABEL: Record<WizardState["projectType"], string> = {
  "web-app": "web application",
  library: "library",
  "cli-tool": "CLI tool",
  "data-pipeline": "data pipeline",
  "docs-site": "documentation site",
  monorepo: "monorepo",
  other: "project",
};

export function buildClaudeMd(s: WizardState): string {
  const name = s.projectName.trim() || "Project";
  const type = PROJECT_TYPE_LABEL[s.projectType];
  const langs = s.languages.length > 0 ? s.languages.join(", ") : "(not specified)";

  const lines: string[] = [];
  lines.push(`# ${name}`);
  lines.push("");
  lines.push(`Claude Code project instructions for this ${type}.`);
  lines.push("");

  // ## Stack
  lines.push("## Stack");
  lines.push("");
  lines.push(`- **Languages:** ${langs}`);
  lines.push(`- **Package manager:** ${s.packageManager}`);
  lines.push("");

  // ## Common commands
  const cmds: { label: string; cmd: string }[] = [];
  if (s.testCommand.trim()) cmds.push({ label: "Test", cmd: s.testCommand.trim() });
  if (s.lintCommand.trim()) cmds.push({ label: "Lint", cmd: s.lintCommand.trim() });
  if (s.buildCommand.trim()) cmds.push({ label: "Build", cmd: s.buildCommand.trim() });
  if (cmds.length > 0) {
    lines.push("## Common commands");
    lines.push("");
    for (const c of cmds) {
      lines.push(`- ${c.label}: \`${c.cmd}\``);
    }
    lines.push("");
  }

  // ## Conventions
  if (s.conventions.trim()) {
    lines.push("## Conventions");
    lines.push("");
    lines.push(s.conventions.trim());
    lines.push("");
  } else {
    lines.push("## Conventions");
    lines.push("");
    lines.push("- All code, comments, commits, and docs in English");
    lines.push("- Match existing style; avoid drive-by refactors");
    lines.push("");
  }

  // ## Verification
  if (cmds.length > 0) {
    lines.push("## Verification");
    lines.push("");
    lines.push("After substantive changes, run the test and lint commands above before");
    lines.push("declaring work done.");
    lines.push("");
  }

  return lines.join("\n");
}

export function buildSettingsJson(s: WizardState): string {
  // Build a typed object then JSON.stringify (omit empty sections).
  const obj: Record<string, unknown> = {};

  if (s.model !== "default") {
    obj.model = s.model;
  }

  if (s.bashAllow.length > 0 || s.bashDeny.length > 0) {
    const perms: Record<string, string[]> = {};
    if (s.bashAllow.length > 0) perms.allow = [...s.bashAllow];
    if (s.bashDeny.length > 0) perms.deny = [...s.bashDeny];
    obj.permissions = perms;
  }

  if (s.envVars.length > 0) {
    const env: Record<string, string> = {};
    for (const { key, value } of s.envVars) {
      if (key.trim()) env[key.trim()] = value;
    }
    if (Object.keys(env).length > 0) obj.env = env;
  }

  const hooks: Record<string, unknown[]> = {};
  if (s.hooks.logPreTool) {
    hooks.PreToolUse = [
      {
        matcher: ".*",
        hooks: [
          {
            type: "command",
            command:
              "mkdir -p ~/.claude/logs && jq -c '{ts: now|todate, tool: .tool_name, input: .tool_input}' >> ~/.claude/logs/tools.jsonl",
          },
        ],
      },
    ];
  }
  if (s.hooks.autoFormat) {
    hooks.PostToolUse = [
      {
        matcher: "Edit|Write",
        hooks: [
          {
            type: "command",
            // Best-effort — picks whichever formatter is present.
            command:
              "command -v prettier >/dev/null && pnpm prettier --write \"$CLAUDE_FILE_PATHS\" 2>/dev/null || true",
          },
        ],
      },
    ];
  }
  if (s.hooks.stopNotify) {
    hooks.Stop = [
      {
        matcher: ".*",
        hooks: [{ type: "command", command: "printf '\\a'" }],
      },
    ];
  }
  if (Object.keys(hooks).length > 0) obj.hooks = hooks;

  if (Object.keys(obj).length === 0) {
    return "{\n  // Wizard didn't produce any settings — leaving the file empty.\n}\n";
  }

  return JSON.stringify(obj, null, 2) + "\n";
}

export function buildReviewCommand(): string {
  return `---
description: Review changed files in the working tree against project conventions.
allowed-tools: [Read, Bash, Grep, Glob]
---

# Review pending changes

Use \`git status\` and \`git diff\` to see what's changed. For each modified or
new file, check:

1. **Correctness** — does the change do what the surrounding code/tests imply?
2. **Conventions** — does it match the style used elsewhere in this file/module?
   Pay attention to existing CLAUDE.md.
3. **Tests** — are tests added or updated for new behavior? Do they fail
   meaningfully when the new code is wrong?
4. **Scope** — are there unrelated drive-by changes that should be reverted?
5. **Obvious issues** — null/undefined paths, error handling, race conditions,
   security (paths, shell injection, dependencies).

Report findings as a short bulleted list grouped by file. Don't write code —
this is review only.
`;
}

export function buildInstallCommand(os: WizardState["os"]): string {
  switch (os) {
    case "macos":
    case "linux":
    case "wsl":
      return "curl -fsSL https://claude.ai/install.sh | bash";
    case "windows-ps":
      return "irm https://claude.ai/install.ps1 | iex";
    case "windows-cmd":
      return "curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd";
    default:
      return "curl -fsSL https://claude.ai/install.sh | bash";
  }
}

export const OS_LABEL: Record<NonNullable<WizardState["os"]>, string> = {
  macos: "macOS",
  linux: "Linux",
  wsl: "Windows (WSL)",
  "windows-ps": "Windows (PowerShell)",
  "windows-cmd": "Windows (CMD)",
};
