// Pure template functions for the config builders.
// Each accepts a state object and returns the rendered file string.

// ---------- Hook ----------

export type HookEvent =
  | "PreToolUse"
  | "PostToolUse"
  | "Stop"
  | "UserPromptSubmit"
  | "SubagentStop"
  | "Notification";

export type HookType = "command" | "mcp";

export interface HookState {
  event: HookEvent;
  matcher: string;
  command: string;
  hookType: HookType;
  mcpTool: string;
}

export function buildHookSnippet(state: HookState): string {
  const hook =
    state.hookType === "mcp"
      ? { type: state.mcpTool || "mcp__server__tool" }
      : { type: "command", command: state.command || "echo 'hook ran'" };

  const out = {
    hooks: {
      [state.event]: [
        {
          matcher: state.matcher || ".*",
          hooks: [hook],
        },
      ],
    },
  };
  return JSON.stringify(out, null, 2);
}

// ---------- Skill ----------

export interface SkillState {
  name: string;
  description: string;
  whenToUse: string;
  body: string;
  contextFork: boolean;
  userInvocable: boolean;
}

export const KEBAB_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

export function buildSkill(state: SkillState): string {
  const fm: string[] = ["---"];
  fm.push(`name: ${state.name || "my-skill"}`);
  fm.push(
    `description: ${state.description || "Describe when Claude should load this skill."}`,
  );
  if (state.contextFork) fm.push("context: fork");
  if (!state.userInvocable) fm.push("user-invocable: false");
  fm.push("---");

  const bullets = state.whenToUse
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const whenSection =
    bullets.length > 0
      ? `\n# When to use\n\n${bullets.map((b) => `- ${b}`).join("\n")}\n`
      : "";

  const bodySection = state.body.trim()
    ? `\n# Instructions\n\n${state.body.trim()}\n`
    : "";

  return `${fm.join("\n")}\n${whenSection}${bodySection}`;
}

// ---------- Settings ----------

export type SettingsModel =
  | "default"
  | "claude-sonnet-4-5"
  | "claude-opus-4-5"
  | "claude-haiku-4-5";

export interface EnvVar {
  key: string;
  value: string;
}

export interface SettingsState {
  model: SettingsModel;
  allow: string[];
  deny: string[];
  env: EnvVar[];
}

export const BASH_PRESETS: Record<string, string[]> = {
  "Node ecosystem": ["bash:npm *", "bash:pnpm *", "bash:yarn *", "bash:node *"],
  "Git workflow": ["bash:git *", "bash:gh *"],
  Python: ["bash:python *", "bash:pip *", "bash:poetry *", "bash:uv *"],
  "Build tools": ["bash:make *", "bash:task *", "bash:cargo *", "bash:go *"],
};

export const SAFETY_DENY_PRESETS = [
  "bash:rm -rf /*",
  "bash:sudo *",
  "bash:curl * | sh",
  "bash:wget * | sh",
];

export function buildSettings(state: SettingsState): string {
  const out: Record<string, unknown> = {};
  if (state.model && state.model !== "default") out.model = state.model;

  const allow = state.allow.map((s) => s.trim()).filter(Boolean);
  const deny = state.deny.map((s) => s.trim()).filter(Boolean);
  if (allow.length > 0 || deny.length > 0) {
    const permissions: Record<string, string[]> = {};
    if (allow.length > 0) permissions.allow = allow;
    if (deny.length > 0) permissions.deny = deny;
    out.permissions = permissions;
  }

  const env: Record<string, string> = {};
  for (const { key, value } of state.env) {
    if (key.trim()) env[key.trim()] = value;
  }
  if (Object.keys(env).length > 0) out.env = env;

  return JSON.stringify(out, null, 2);
}

// ---------- Slash command ----------

export type SlashModel = "inherit" | "sonnet" | "opus" | "haiku";

export const ALL_TOOLS = [
  "Read",
  "Write",
  "Edit",
  "Bash",
  "Glob",
  "Grep",
  "WebFetch",
  "WebSearch",
] as const;

export type Tool = (typeof ALL_TOOLS)[number];

export interface SlashCommandState {
  name: string;
  description: string;
  body: string;
  allowedTools: Tool[];
  model: SlashModel;
}

export function buildSlashCommand(state: SlashCommandState): string {
  const fm: string[] = ["---"];
  if (state.description.trim())
    fm.push(`description: ${state.description.trim()}`);
  if (state.allowedTools.length > 0) {
    fm.push(`allowed-tools: [${state.allowedTools.join(", ")}]`);
  }
  if (state.model !== "inherit") fm.push(`model: ${state.model}`);
  fm.push("---");

  const body = state.body.trim() || "Write your prompt template here.";
  // If no metadata fields beyond the fences, omit the frontmatter entirely.
  if (fm.length === 2) return `${body}\n`;
  return `${fm.join("\n")}\n\n${body}\n`;
}
