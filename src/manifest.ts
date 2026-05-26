/**
 * Content manifest — categorized, ordered list of all 140 Claude Code docs.
 * Tour follows the order of categories, then items within each category.
 */

export interface DocItem {
  /** Stable id (also used as URL hash). */
  id: string;
  /** Path inside content/docs/, no leading slash. */
  slug: string;
  /** Display title. */
  title: string;
  /** One-line description (from docs.claude.com llms.txt). */
  description: string;
  /** Original URL on code.claude.com. */
  source: string;
}

export interface Category {
  id: string;
  title: string;
  blurb: string;
  /** Item ids in linear tour order. */
  items: string[];
}

const SOURCE = (p: string) => `https://code.claude.com/docs/en/${p}`;
const item = (
  id: string,
  slug: string,
  title: string,
  description: string,
): DocItem => ({ id, slug, title, description, source: SOURCE(slug.replace(/\.md$/, "")) });

export const ITEMS: Record<string, DocItem> = Object.fromEntries(
  [
    item("overview", "overview.md", "Overview", "What Claude Code is, what you can do with it, and where it runs."),
    item("how-claude-code-works", "how-claude-code-works.md", "How Claude Code works", "The agentic loop, built-in tools, and how Claude Code interacts with your project."),
    item("platforms", "platforms.md", "Platforms and integrations", "Where you can run Claude Code and what you can connect it to."),
    item("features-overview", "features-overview.md", "Extend Claude Code", "When to use CLAUDE.md, Skills, subagents, hooks, MCP, and plugins."),
    item("glossary", "glossary.md", "Glossary", "Definitions for Claude Code terminology."),

    item("setup", "setup.md", "Advanced setup", "System requirements, platform-specific installation, version management, uninstall."),
    item("quickstart", "quickstart.md", "Quickstart (Terminal)", "Walk through your first real task in the terminal."),
    item("desktop-quickstart", "desktop-quickstart.md", "Desktop quickstart", "Install Claude Code on desktop and start your first session."),
    item("web-quickstart", "web-quickstart.md", "Web quickstart", "Run Claude Code in your browser. Connect GitHub, submit a task, review the PR."),
    item("vs-code", "vs-code.md", "VS Code", "Install and configure the Claude Code extension for VS Code."),
    item("jetbrains", "jetbrains.md", "JetBrains IDEs", "IntelliJ, PyCharm, WebStorm — interactive diffs and selection context."),
    item("desktop", "desktop.md", "Desktop application", "Parallel sessions, pane layout, integrated terminal, Dispatch from your phone, more."),
    item("claude-code-on-the-web", "claude-code-on-the-web.md", "Claude Code on the web", "Cloud environments, setup scripts, --remote and --teleport."),
    item("troubleshoot-install", "troubleshoot-install.md", "Troubleshoot install", "Fix command-not-found, PATH, permission, network, auth errors during install."),

    item("common-workflows", "common-workflows.md", "Common workflows", "Step-by-step guides for everyday tasks."),
    item("best-practices", "best-practices.md", "Best practices", "Patterns for getting the most out of Claude Code."),
    item("interactive-mode", "interactive-mode.md", "Interactive mode", "Keyboard shortcuts, input modes, interactive features."),
    item("sessions", "sessions.md", "Manage sessions", "Name, resume, branch, switch between conversations."),
    item("checkpointing", "checkpointing.md", "Checkpointing", "Track, rewind, and summarize edits and conversation."),
    item("permission-modes", "permission-modes.md", "Permission modes", "Control whether Claude asks before editing files or running commands."),
    item("permissions", "permissions.md", "Permissions", "Fine-grained permission rules, modes, and managed policies."),
    item("context-window", "context-window.md", "Context window", "Interactive simulation of how the context fills during a session."),
    item("prompt-caching", "prompt-caching.md", "Prompt caching", "Why model switches trigger uncached turns, what /compact costs, cache hit rate."),
    item("goal", "goal.md", "/goal — work toward a goal", "Set a completion condition; Claude keeps working until met."),
    item("voice-dictation", "voice-dictation.md", "Voice dictation", "Speak your prompts in the CLI with hold-to-record or tap-to-record."),
    item("fast-mode", "fast-mode.md", "Fast mode", "Faster Opus responses by toggling fast mode."),
    item("fullscreen", "fullscreen.md", "Fullscreen rendering", "Flicker-free rendering with mouse support and stable memory."),

    item("memory", "memory.md", "Memory & CLAUDE.md", "Give Claude persistent instructions with CLAUDE.md files and auto memory."),
    item("claude-directory", "claude-directory.md", ".claude directory", "Where CLAUDE.md, settings, hooks, skills, commands, subagents, rules live."),
    item("output-styles", "output-styles.md", "Output styles", "Adapt Claude Code for uses beyond software engineering."),
    item("statusline", "statusline.md", "Status line", "Configure a custom status bar — context usage, costs, git status."),
    item("keybindings", "keybindings.md", "Keybindings", "Customize keyboard shortcuts in Claude Code."),
    item("terminal-config", "terminal-config.md", "Terminal config", "Shift+Enter for newlines, terminal bell, tmux, color theme, Vim mode."),
    item("model-config", "model-config.md", "Model configuration", "Model aliases like opusplan."),
    item("auto-mode-config", "auto-mode-config.md", "Auto mode config", "Tell the auto-mode classifier which repos, buckets, and domains your org trusts."),

    item("skills", "skills.md", "Skills", "Create, manage, and share skills to extend Claude's capabilities."),
    item("commands", "commands.md", "Slash commands", "Reference for slash commands available in Claude Code."),
    item("sub-agents", "sub-agents.md", "Subagents", "Create specialized AI subagents for task-specific workflows."),
    item("hooks-guide", "hooks-guide.md", "Hooks — guide", "Run shell commands automatically when Claude edits files or finishes tasks."),
    item("hooks", "hooks.md", "Hooks — reference", "Hook events, schema, JSON I/O, exit codes, async hooks, HTTP hooks, MCP tool hooks."),

    item("plugins", "plugins.md", "Plugins", "Create custom plugins to extend Claude Code with skills, agents, hooks, MCP."),
    item("plugins-reference", "plugins-reference.md", "Plugins reference", "Schemas, CLI commands, component specifications."),
    item("discover-plugins", "discover-plugins.md", "Discover plugins", "Find and install plugins from marketplaces."),
    item("plugin-marketplaces", "plugin-marketplaces.md", "Plugin marketplaces", "Build and host marketplaces to distribute Claude Code extensions."),
    item("plugin-dependencies", "plugin-dependencies.md", "Plugin dependencies", "Declare version constraints on plugin dependencies."),
    item("plugin-hints", "plugin-hints.md", "Plugin hints", "Emit a one-line marker from your CLI so Claude Code recommends your plugin."),

    item("mcp", "mcp.md", "MCP — connect tools", "Connect Claude Code to your tools with the Model Context Protocol."),
    item("managed-mcp", "managed-mcp.md", "Managed MCP", "Restrict which MCP servers users can add or connect to."),
    item("channels", "channels.md", "Channels — push events", "Push messages, alerts, and webhooks into a Claude Code session."),
    item("channels-reference", "channels-reference.md", "Channels reference", "Build an MCP server that pushes events into a Claude Code session."),

    item("agents", "agents.md", "Run agents in parallel", "Compare subagents, agent view, agent teams, and isolated worktree sessions."),
    item("agent-view", "agent-view.md", "Agent view", "Dispatch and manage many sessions from one screen."),
    item("agent-teams", "agent-teams.md", "Agent teams", "Coordinate multiple Claude Code instances with shared tasks and messaging."),
    item("worktrees", "worktrees.md", "Worktrees", "Isolate parallel sessions in separate git worktrees."),
    item("scheduled-tasks", "scheduled-tasks.md", "Scheduled tasks (/loop, cron)", "Run prompts repeatedly, poll for status, set one-time reminders."),
    item("routines", "routines.md", "Routines", "Define routines that run on schedule, API calls, or GitHub events."),
    item("desktop-scheduled-tasks", "desktop-scheduled-tasks.md", "Desktop scheduled tasks", "Schedule recurring Claude Code runs in the Desktop app."),

    item("chrome", "chrome.md", "Chrome (beta)", "Connect Claude Code to Chrome — test web apps, debug, automate, extract data."),
    item("slack", "slack.md", "Slack", "Delegate coding tasks directly from your Slack workspace."),
    item("remote-control", "remote-control.md", "Remote control", "Continue a local session from your phone, tablet, or any browser."),
    item("deep-links", "deep-links.md", "Deep links", "Open a Claude Code terminal session from a URL (claude-cli://)."),
    item("computer-use", "computer-use.md", "Computer use", "Let Claude use your computer from the CLI — open apps, click, type, see your screen."),

    item("github-actions", "github-actions.md", "GitHub Actions", "Integrate Claude Code into your dev workflow with Claude Code GitHub Actions."),
    item("github-enterprise-server", "github-enterprise-server.md", "GitHub Enterprise Server", "Connect to your self-hosted GitHub Enterprise Server instance."),
    item("gitlab-ci-cd", "gitlab-ci-cd.md", "GitLab CI/CD", "Integrate Claude Code into your GitLab CI/CD workflow."),
    item("code-review", "code-review.md", "Code review", "Automated PR reviews that catch logic errors, security issues, regressions."),
    item("headless", "headless.md", "Headless / programmatic", "Run Claude Code programmatically from the CLI, Python, or TypeScript."),
    item("ultraplan", "ultraplan.md", "Ultraplan", "Plan in the cloud — draft on the web, then execute remotely or in terminal."),
    item("ultrareview", "ultrareview.md", "Ultrareview", "Deep multi-agent code review in the cloud to find bugs before you merge."),

    item("costs", "costs.md", "Manage costs", "Token tracking, team spend limits, model selection, extended thinking, preprocessing hooks."),
    item("analytics", "analytics.md", "Analytics", "Usage metrics, adoption tracking, engineering velocity."),
    item("monitoring-usage", "monitoring-usage.md", "Monitoring (OpenTelemetry)", "Enable and configure OpenTelemetry for Claude Code."),
    item("debug-your-config", "debug-your-config.md", "Debug your config", "Diagnose why CLAUDE.md, settings, hooks, MCP, or skills aren't taking effect."),
    item("errors", "errors.md", "Errors", "Look up runtime error messages and how to fix each one."),
    item("troubleshooting", "troubleshooting.md", "Troubleshooting", "Fix high CPU/memory, hangs, auto-compact thrashing, search problems."),

    item("security", "security.md", "Security overview", "Security safeguards and best practices for safe usage."),
    item("sandbox-environments", "sandbox-environments.md", "Sandbox environments", "Compare sandboxed Bash, sandbox runtime, dev containers, Docker, VMs."),
    item("sandboxing", "sandboxing.md", "Sandboxed Bash", "Filesystem and network isolation for safer agent execution."),
    item("data-usage", "data-usage.md", "Data usage", "Anthropic's data usage policies for Claude."),
    item("zero-data-retention", "zero-data-retention.md", "Zero data retention", "ZDR scope, disabled features, how to request enablement."),
    item("legal-and-compliance", "legal-and-compliance.md", "Legal & compliance", "Legal agreements, compliance certifications, security info."),

    item("admin-setup", "admin-setup.md", "Admin setup", "Decision map for administrators deploying Claude Code."),
    item("authentication", "authentication.md", "Authentication", "Log in for individuals, teams, organizations."),
    item("third-party-integrations", "third-party-integrations.md", "Enterprise deployment overview", "Integrate with third-party services and infrastructure."),
    item("devcontainer", "devcontainer.md", "Dev containers", "Run Claude Code inside a dev container."),
    item("llm-gateway", "llm-gateway.md", "LLM gateway", "Configure Claude Code to work with LLM gateway solutions."),
    item("network-config", "network-config.md", "Enterprise network", "Proxies, custom CAs, mutual TLS."),
    item("server-managed-settings", "server-managed-settings.md", "Server-managed settings", "Centrally configure Claude Code without device management infrastructure."),
    item("amazon-bedrock", "amazon-bedrock.md", "Amazon Bedrock", "Configure Claude Code through Amazon Bedrock."),
    item("google-vertex-ai", "google-vertex-ai.md", "Google Vertex AI", "Configure Claude Code through Google Vertex AI."),
    item("microsoft-foundry", "microsoft-foundry.md", "Microsoft Foundry", "Configure Claude Code through Microsoft Foundry."),
    item("claude-platform-on-aws", "claude-platform-on-aws.md", "Claude Platform on AWS", "Anthropic-operated Claude API with AWS auth + Marketplace billing."),

    item("sdk-overview", "agent-sdk/overview.md", "Agent SDK — overview", "Build production AI agents with Claude Code as a library."),
    item("sdk-quickstart", "agent-sdk/quickstart.md", "Agent SDK — quickstart", "Get started with the Python or TypeScript Agent SDK."),
    item("sdk-agent-loop", "agent-sdk/agent-loop.md", "Agent loop", "Message lifecycle, tool execution, context window, architecture."),
    item("sdk-cc-features", "agent-sdk/claude-code-features.md", "Use CC features in SDK", "Load project instructions, skills, hooks, etc. into your SDK agents."),
    item("sdk-permissions", "agent-sdk/permissions.md", "SDK — permissions", "Permission modes, hooks, declarative allow/deny rules."),
    item("sdk-hooks", "agent-sdk/hooks.md", "SDK — hooks", "Intercept and customize agent behavior at key execution points."),
    item("sdk-custom-tools", "agent-sdk/custom-tools.md", "SDK — custom tools", "Define custom tools with the in-process MCP server."),
    item("sdk-tool-search", "agent-sdk/tool-search.md", "SDK — tool search", "Scale your agent to thousands of tools by loading on demand."),
    item("sdk-mcp", "agent-sdk/mcp.md", "SDK — MCP", "Configure MCP servers to extend your agent with external tools."),
    item("sdk-plugins", "agent-sdk/plugins.md", "SDK — plugins", "Load custom plugins through the Agent SDK."),
    item("sdk-skills", "agent-sdk/skills.md", "SDK — skills", "Extend Claude with Agent Skills in the SDK."),
    item("sdk-slash-commands", "agent-sdk/slash-commands.md", "SDK — slash commands", "Control Claude Code sessions through the SDK with slash commands."),
    item("sdk-subagents", "agent-sdk/subagents.md", "SDK — subagents", "Define and invoke subagents to isolate context and run tasks in parallel."),
    item("sdk-sessions", "agent-sdk/sessions.md", "SDK — sessions", "Persist conversation history; continue, resume, fork prior runs."),
    item("sdk-session-storage", "agent-sdk/session-storage.md", "SDK — session storage", "Mirror session transcripts to S3, Redis, or your own backend."),
    item("sdk-system-prompts", "agent-sdk/modifying-system-prompts.md", "SDK — system prompts", "claude_code preset vs custom system prompt; CLAUDE.md, append, fully custom."),
    item("sdk-user-input", "agent-sdk/user-input.md", "SDK — user input", "Surface approval requests and clarifying questions to users."),
    item("sdk-streaming-modes", "agent-sdk/streaming-vs-single-mode.md", "SDK — streaming vs single-mode", "Two input modes for the Agent SDK and when to use each."),
    item("sdk-streaming-output", "agent-sdk/streaming-output.md", "SDK — streaming output", "Get real-time responses as text and tool calls stream in."),
    item("sdk-structured-outputs", "agent-sdk/structured-outputs.md", "SDK — structured outputs", "Validated JSON from agent workflows using JSON Schema, Zod, or Pydantic."),
    item("sdk-todo-tracking", "agent-sdk/todo-tracking.md", "SDK — todo lists", "Track and display todos using the Agent SDK."),
    item("sdk-file-checkpointing", "agent-sdk/file-checkpointing.md", "SDK — file checkpointing", "Track file changes during agent sessions and restore to prior state."),
    item("sdk-cost-tracking", "agent-sdk/cost-tracking.md", "SDK — cost tracking", "Track token usage, estimate costs, configure prompt caching."),
    item("sdk-observability", "agent-sdk/observability.md", "SDK — observability (OTel)", "Export traces, metrics, events using OpenTelemetry."),
    item("sdk-secure-deployment", "agent-sdk/secure-deployment.md", "SDK — secure deployment", "Isolation, credential management, network controls."),
    item("sdk-hosting", "agent-sdk/hosting.md", "SDK — hosting", "Deploy and host the Agent SDK in production environments."),
    item("sdk-migration", "agent-sdk/migration-guide.md", "SDK — migration guide", "Migrate from TypeScript/Python SDKs to the Claude Agent SDK."),
    item("sdk-python", "agent-sdk/python.md", "SDK — Python reference", "Complete API reference for the Python Agent SDK."),
    item("sdk-typescript", "agent-sdk/typescript.md", "SDK — TypeScript reference", "Complete API reference for the TypeScript Agent SDK."),
    item("sdk-ts-v2-preview", "agent-sdk/typescript-v2-preview.md", "SDK — TypeScript V2 (removed)", "Reference for the removed V2 TS Agent SDK session API."),

    item("cli-reference", "cli-reference.md", "CLI reference", "Complete reference for Claude Code command-line interface."),
    item("tools-reference", "tools-reference.md", "Tools reference", "Reference for tools Claude Code can use — permissions and per-tool behavior."),
    item("settings", "settings.md", "Settings", "Global and project-level settings, environment variables."),
    item("env-vars", "env-vars.md", "Environment variables", "Reference for environment variables that control Claude Code behavior."),
    item("changelog", "changelog.md", "Changelog", "Release notes by version."),
    item("desktop-changelog", "desktop-changelog.md", "Desktop changelog", "Release notes for the Desktop app."),
    item("prompt-library", "prompt-library.md", "Prompt library", "Copy-paste prompts, tagged by task and role."),
    item("champion-kit", "champion-kit.md", "Champion kit", "Playbook for engineers advocating Claude Code internally."),
    item("communications-kit", "communications-kit.md", "Communications kit", "Launch announcements, drip messages, FAQ responses for rollout."),

    item("whats-new", "whats-new/index.md", "What's new — index", "Weekly digest of notable Claude Code features."),
    item("whats-new-w20", "whats-new/2026-w20.md", "W20 · May 11–15, 2026", "Agent view, /goal until condition holds, fast mode on Opus 4.7 by default."),
    item("whats-new-w19", "whats-new/2026-w19.md", "W19 · May 4–8, 2026", "Plugins from .zip and URLs, Ctrl+R history search, branch from local HEAD."),
    item("whats-new-w18", "whats-new/2026-w18.md", "W18 · April 27 – May 1, 2026", "CC on Windows without Git Bash, claude auth login paste, project purge."),
    item("whats-new-w17", "whats-new/2026-w17.md", "W17 · April 20–24, 2026", "/ultrareview preview, session recaps, custom color themes, redesigned web."),
    item("whats-new-w16", "whats-new/2026-w16.md", "W16 · April 13–17, 2026", "Claude Opus 4.7 with xhigh, routines on web, mobile push, /usage."),
    item("whats-new-w15", "whats-new/2026-w15.md", "W15 · April 6–10, 2026", "Ultraplan cloud planning, Monitor tool with self-pacing /loop, /team-onboarding."),
    item("whats-new-w14", "whats-new/2026-w14.md", "W14 · March 30 – April 3, 2026", "Computer use in CLI, in-product lessons, per-tool MCP overrides."),
    item("whats-new-w13", "whats-new/2026-w13.md", "W13 · March 23–27, 2026", "Auto mode, computer use, PR auto-fix in cloud, transcript search."),
  ].map((i) => [i.id, i] as const),
);

export const CATEGORIES: Category[] = [
  {
    id: "intro",
    title: "1 · Start here",
    blurb: "Get a feel for what Claude Code is and how it fits into your workflow.",
    items: ["overview", "how-claude-code-works", "platforms", "features-overview", "glossary"],
  },
  {
    id: "install",
    title: "2 · Install & first session",
    blurb: "Pick where you want to run Claude Code and complete your first task.",
    items: [
      "setup", "quickstart", "desktop-quickstart", "web-quickstart",
      "vs-code", "jetbrains", "desktop", "claude-code-on-the-web",
      "troubleshoot-install",
    ],
  },
  {
    id: "basics",
    title: "3 · Day-to-day basics",
    blurb: "The workflow patterns you'll use every day.",
    items: [
      "common-workflows", "best-practices", "interactive-mode",
      "sessions", "checkpointing",
      "permission-modes", "permissions",
      "context-window", "prompt-caching",
      "goal", "voice-dictation", "fast-mode", "fullscreen",
    ],
  },
  {
    id: "config",
    title: "4 · Memory & configuration",
    blurb: "Give Claude persistent instructions and tune it to your environment.",
    items: [
      "memory", "claude-directory",
      "output-styles", "statusline",
      "keybindings", "terminal-config",
      "model-config", "auto-mode-config",
    ],
  },
  {
    id: "extending",
    title: "5 · Extend with skills, commands, subagents, hooks",
    blurb: "Package repeatable workflows and customize the agent loop.",
    items: ["skills", "commands", "sub-agents", "hooks-guide", "hooks"],
  },
  {
    id: "plugins",
    title: "6 · Plugins",
    blurb: "Bundle, distribute, and consume Claude Code extensions.",
    items: ["plugins", "plugins-reference", "discover-plugins", "plugin-marketplaces", "plugin-dependencies", "plugin-hints"],
  },
  {
    id: "mcp",
    title: "7 · MCP & channels",
    blurb: "Connect Claude Code to external tools and event sources.",
    items: ["mcp", "managed-mcp", "channels", "channels-reference"],
  },
  {
    id: "multi-agent",
    title: "8 · Multi-agent & scheduling",
    blurb: "Run many sessions in parallel and schedule recurring work.",
    items: ["agents", "agent-view", "agent-teams", "worktrees", "scheduled-tasks", "routines", "desktop-scheduled-tasks"],
  },
  {
    id: "integrations",
    title: "9 · Surfaces & integrations",
    blurb: "Browser, chat, mobile, and other places Claude Code can run from.",
    items: ["chrome", "slack", "remote-control", "deep-links", "computer-use"],
  },
  {
    id: "cicd",
    title: "10 · CI/CD & code review",
    blurb: "Bring Claude Code into your pipelines and pull requests.",
    items: ["github-actions", "github-enterprise-server", "gitlab-ci-cd", "code-review", "headless", "ultraplan", "ultrareview"],
  },
  {
    id: "ops",
    title: "11 · Costs, monitoring, troubleshooting",
    blurb: "Track spend, observe usage, and unstick yourself when things break.",
    items: ["costs", "analytics", "monitoring-usage", "debug-your-config", "errors", "troubleshooting"],
  },
  {
    id: "security",
    title: "12 · Security & data",
    blurb: "Sandboxes, data policies, and compliance.",
    items: ["security", "sandbox-environments", "sandboxing", "data-usage", "zero-data-retention", "legal-and-compliance"],
  },
  {
    id: "enterprise",
    title: "13 · Enterprise deployment",
    blurb: "Roll Claude Code out across an organization.",
    items: [
      "admin-setup", "authentication", "third-party-integrations",
      "devcontainer", "llm-gateway", "network-config", "server-managed-settings",
      "amazon-bedrock", "google-vertex-ai", "microsoft-foundry", "claude-platform-on-aws",
    ],
  },
  {
    id: "sdk",
    title: "14 · Agent SDK",
    blurb: "Build your own agents on the Claude Code engine.",
    items: [
      "sdk-overview", "sdk-quickstart", "sdk-agent-loop", "sdk-cc-features",
      "sdk-permissions", "sdk-hooks", "sdk-custom-tools", "sdk-tool-search",
      "sdk-mcp", "sdk-plugins", "sdk-skills", "sdk-slash-commands", "sdk-subagents",
      "sdk-sessions", "sdk-session-storage", "sdk-system-prompts", "sdk-user-input",
      "sdk-streaming-modes", "sdk-streaming-output", "sdk-structured-outputs",
      "sdk-todo-tracking", "sdk-file-checkpointing",
      "sdk-cost-tracking", "sdk-observability", "sdk-secure-deployment", "sdk-hosting",
      "sdk-migration", "sdk-python", "sdk-typescript", "sdk-ts-v2-preview",
    ],
  },
  {
    id: "reference",
    title: "15 · Reference",
    blurb: "Lookup material — CLI flags, settings, env vars, errors.",
    items: ["cli-reference", "tools-reference", "settings", "env-vars", "changelog", "desktop-changelog"],
  },
  {
    id: "community",
    title: "16 · Community & rollout",
    blurb: "Prompts, champion kit, and comms for spreading Claude Code internally.",
    items: ["prompt-library", "champion-kit", "communications-kit"],
  },
  {
    id: "whats-new",
    title: "17 · What's new (weekly)",
    blurb: "Newest first.",
    items: [
      "whats-new", "whats-new-w20", "whats-new-w19", "whats-new-w18",
      "whats-new-w17", "whats-new-w16", "whats-new-w15", "whats-new-w14", "whats-new-w13",
    ],
  },
];

/** Flat linear list of all item ids in tour order. */
export const TOUR_ORDER: string[] = CATEGORIES.flatMap((c) => c.items);

export function findCategory(itemId: string): Category | undefined {
  return CATEGORIES.find((c) => c.items.includes(itemId));
}

export function getItem(id: string): DocItem | undefined {
  return ITEMS[id];
}

export function neighbors(id: string): { prev?: DocItem; next?: DocItem } {
  const i = TOUR_ORDER.indexOf(id);
  if (i < 0) return {};
  return {
    prev: i > 0 ? ITEMS[TOUR_ORDER[i - 1]] : undefined,
    next: i < TOUR_ORDER.length - 1 ? ITEMS[TOUR_ORDER[i + 1]] : undefined,
  };
}

export const TOTAL_ITEMS = TOUR_ORDER.length;
