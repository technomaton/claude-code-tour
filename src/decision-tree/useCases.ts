/**
 * Decision tree data — non-linear entry point to the tour.
 * Each use case routes the user to a curated subset of docs +
 * optional links to the setup wizard (#wizard) and config builders
 * (#builders/<type>), both of which are being built in parallel.
 *
 * All `docs[].id` values MUST exist in src/manifest.ts.
 */

export type BuilderRef = {
  type: "hook" | "skill" | "settings" | "slash-command";
  reason: string;
};

export type UseCase = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  intro: string;
  docs: { id: string; title: string; why: string }[];
  builders?: BuilderRef[];
  wizardRecommended?: boolean;
};

export const USE_CASES: UseCase[] = [
  {
    slug: "daily-coding",
    title: "Use Claude Code daily for general coding",
    description: "Pair programming, refactors, exploring unfamiliar code.",
    emoji: "💻",
    intro:
      "The general-purpose path: get Claude Code running, learn the everyday workflow patterns, and pick up the practices that the heaviest users have converged on.",
    docs: [
      { id: "overview", title: "Overview", why: "What Claude Code is and what you can do with it." },
      { id: "quickstart", title: "Quickstart (Terminal)", why: "Walk through your first real task end-to-end." },
      { id: "common-workflows", title: "Common workflows", why: "Step-by-step guides for tasks you'll repeat daily." },
      { id: "best-practices", title: "Best practices", why: "Patterns the most effective users rely on." },
      { id: "commands", title: "Slash commands", why: "Built-in commands to keep around (/clear, /compact, /init…)." },
    ],
    wizardRecommended: true,
  },
  {
    slug: "pr-review",
    title: "Get Claude to review my PRs",
    description: "Inline PR comments, security checks, regressions.",
    emoji: "🔍",
    intro:
      "Wire Claude Code into your pull-request review process — either as a manual command you trigger, or as an automated reviewer that runs against every PR.",
    docs: [
      { id: "code-review", title: "Code review", why: "Automated PR reviews that catch logic errors and regressions." },
      { id: "github-actions", title: "GitHub Actions", why: "Run Claude Code inside CI to comment on PRs." },
      { id: "ultrareview", title: "Ultrareview", why: "Deep multi-agent review in the cloud before merge." },
      { id: "sub-agents", title: "Subagents", why: "Specialized reviewers for security, accessibility, etc." },
    ],
    builders: [
      { type: "slash-command", reason: "Generate a /review slash-command to run reviews on demand." },
    ],
  },
  {
    slug: "ci-automation",
    title: "Run Claude in CI (GitHub Actions)",
    description: "Headless mode, scheduled tasks, PR fix workflows.",
    emoji: "🤖",
    intro:
      "Run Claude Code without an interactive terminal — drive it from CI pipelines, scheduled jobs, or webhooks. Headless mode is the foundation; routines and GitHub Actions sit on top.",
    docs: [
      { id: "headless", title: "Headless / programmatic", why: "The non-interactive entrypoint everything else builds on." },
      { id: "github-actions", title: "GitHub Actions", why: "Drop-in Action for PR reviews, auto-fixes, scheduled jobs." },
      { id: "gitlab-ci-cd", title: "GitLab CI/CD", why: "Same idea on GitLab — pipeline integration." },
      { id: "routines", title: "Routines", why: "Schedule recurring runs from the web UI or API." },
      { id: "scheduled-tasks", title: "Scheduled tasks (/loop, cron)", why: "Run prompts on an interval from within a session." },
    ],
  },
  {
    slug: "build-agent",
    title: "Build a custom agent with the SDK",
    description: "Use the Agent SDK in Python or TypeScript.",
    emoji: "🛠",
    intro:
      "Use Claude Code as a library, not a CLI. The Agent SDK exposes the same agentic loop with full programmatic control — define tools, hooks, permissions, system prompts, and stream output.",
    docs: [
      { id: "sdk-overview", title: "Agent SDK — overview", why: "Concepts and when to choose the SDK over the CLI." },
      { id: "sdk-quickstart", title: "Agent SDK — quickstart", why: "Get a working SDK agent running in Python or TS." },
      { id: "sdk-agent-loop", title: "Agent loop", why: "Understand the lifecycle: messages, tools, context window." },
      { id: "sdk-custom-tools", title: "SDK — custom tools", why: "Define your own tools via the in-process MCP server." },
      { id: "sdk-permissions", title: "SDK — permissions", why: "Allow/deny rules, hooks, declarative modes." },
    ],
    builders: [
      { type: "settings", reason: "Build a settings.json template you can ship with your agent." },
    ],
  },
  {
    slug: "mcp-integration",
    title: "Connect external tools via MCP",
    description: "Slack, GitHub, internal APIs — anything with an MCP server.",
    emoji: "🔌",
    intro:
      "The Model Context Protocol lets Claude Code talk to external systems through standardized servers. Add Slack, Linear, your internal API — anything someone has wrapped as an MCP server, or you can write one yourself.",
    docs: [
      { id: "mcp", title: "MCP — connect tools", why: "What MCP is and how to add servers to Claude Code." },
      { id: "managed-mcp", title: "Managed MCP", why: "Restrict which MCP servers users in your org can add." },
      { id: "sdk-mcp", title: "SDK — MCP", why: "Configure MCP servers when running via the Agent SDK." },
      { id: "channels", title: "Channels — push events", why: "Push messages and events into a live session." },
    ],
  },
  {
    slug: "ide-workflow",
    title: "Use Claude Code in my IDE",
    description: "VS Code, JetBrains, Desktop app, or browser.",
    emoji: "🧩",
    intro:
      "Beyond the terminal: install the extension for your editor, run the standalone desktop app, or use the browser version. Each surface has slightly different ergonomics — pick the one that matches how you already work.",
    docs: [
      { id: "vs-code", title: "VS Code", why: "Inline diffs and editor selection context." },
      { id: "jetbrains", title: "JetBrains IDEs", why: "IntelliJ, PyCharm, WebStorm — interactive diffs." },
      { id: "desktop", title: "Desktop application", why: "Parallel sessions, pane layout, integrated terminal." },
      { id: "claude-code-on-the-web", title: "Claude Code on the web", why: "Cloud environments and --remote workflows." },
    ],
  },
  {
    slug: "team-workflows",
    title: "Share workflows with my team",
    description: "Skills, plugins, slash commands, subagents.",
    emoji: "👥",
    intro:
      "Capture the things your team does repeatedly so everyone gets the same starting point. Skills bundle knowledge + instructions; plugins bundle skills + hooks + MCP servers; slash commands and subagents wrap specific tasks.",
    docs: [
      { id: "skills", title: "Skills", why: "The primary unit for packaging repeatable workflows." },
      { id: "plugins", title: "Plugins", why: "Bundle skills, hooks, MCP servers into one installable extension." },
      { id: "plugin-marketplaces", title: "Plugin marketplaces", why: "Host an internal marketplace for your org." },
      { id: "sub-agents", title: "Subagents", why: "Specialized AI roles your team can invoke by name." },
    ],
    builders: [
      { type: "skill", reason: "Scaffold a SKILL.md from a form." },
      { type: "slash-command", reason: "Scaffold a team slash-command." },
    ],
  },
  {
    slug: "big-codebase",
    title: "Navigate or refactor a large codebase",
    description: "Memory, subagents, worktrees, parallel sessions.",
    emoji: "🗺",
    intro:
      "Large codebases push Claude Code's context window and require strategy: prime with CLAUDE.md, isolate context using subagents, run several sessions in parallel with worktrees, and use checkpointing to stay safe.",
    docs: [
      { id: "memory", title: "Memory & CLAUDE.md", why: "Persistent project instructions Claude reads on every session." },
      { id: "sub-agents", title: "Subagents", why: "Run focused tasks in their own clean context." },
      { id: "agents", title: "Run agents in parallel", why: "Compare subagents, agent view, agent teams, worktrees." },
      { id: "worktrees", title: "Worktrees", why: "Isolate parallel sessions on independent branches." },
      { id: "checkpointing", title: "Checkpointing", why: "Track, rewind, and summarize edits and conversation." },
    ],
    builders: [
      { type: "skill", reason: "Capture a refactor playbook as a reusable skill." },
    ],
  },
  {
    slug: "policy-enforcement",
    title: "Enforce policies and audit usage",
    description: "Hooks, permissions, channels, sandboxing.",
    emoji: "🛡",
    intro:
      "When Claude Code is doing real work in real systems, you'll want guardrails: declarative permission rules, hooks that fire on tool use, sandboxes that contain blast radius, and channels for audit trails.",
    docs: [
      { id: "hooks-guide", title: "Hooks — guide", why: "Run shell commands on tool use, file edits, session end." },
      { id: "permissions", title: "Permissions", why: "Fine-grained allow/deny rules and managed policies." },
      { id: "sandboxing", title: "Sandboxed Bash", why: "Filesystem and network isolation for safer execution." },
      { id: "channels-reference", title: "Channels reference", why: "MCP servers that push audit events into sessions." },
    ],
    builders: [
      { type: "hook", reason: "Generate a hook snippet (PreToolUse / PostToolUse) for settings.json." },
      { type: "settings", reason: "Build a settings.json with permission allow/deny lists." },
    ],
  },
  {
    slug: "enterprise-deploy",
    title: "Deploy at enterprise scale",
    description: "Admin setup, auth, network, gateways, managed settings.",
    emoji: "🏢",
    intro:
      "Roll Claude Code out across an organization. There's a decision map for admins, and then specifics for auth (SSO, SAML), network (proxies, custom CAs), LLM routing (Bedrock, Vertex, Foundry, gateways), and centrally-managed settings.",
    docs: [
      { id: "admin-setup", title: "Admin setup", why: "Decision map for administrators deploying Claude Code." },
      { id: "authentication", title: "Authentication", why: "Identity for individuals, teams, organizations." },
      { id: "network-config", title: "Enterprise network", why: "Proxies, custom CAs, mutual TLS." },
      { id: "llm-gateway", title: "LLM gateway", why: "Route through internal LLM gateways." },
      { id: "server-managed-settings", title: "Server-managed settings", why: "Central config without device-management infra." },
    ],
    builders: [
      { type: "settings", reason: "Template a managed settings.json for distribution." },
    ],
  },
  {
    slug: "background-tasks",
    title: "Schedule background tasks",
    description: "Cron, routines, /loop, desktop scheduled tasks.",
    emoji: "⏰",
    intro:
      "Have Claude Code do work on a schedule, poll for external state, or run unattended. There are several layers — routines run remotely on a cron, /loop self-paces within a session, and headless mode is the building block underneath both.",
    docs: [
      { id: "scheduled-tasks", title: "Scheduled tasks (/loop, cron)", why: "Run prompts repeatedly, poll status, set reminders." },
      { id: "routines", title: "Routines", why: "Remote routines that run on schedule or webhook." },
      { id: "headless", title: "Headless / programmatic", why: "Non-interactive mode for unattended runs." },
      { id: "desktop-scheduled-tasks", title: "Desktop scheduled tasks", why: "Recurring Claude Code runs from the Desktop app." },
    ],
  },
  {
    slug: "just-exploring",
    title: "Just exploring — show me what's possible",
    description: "Get the lay of the land, then dive into the latest features.",
    emoji: "🌱",
    intro:
      "No specific goal yet — just curious. Start with the overview and quickstart to get a feel, skim best-practices for what mature usage looks like, then read the most recent weekly digest to see where the product is heading.",
    docs: [
      { id: "overview", title: "Overview", why: "What Claude Code is and what you can do with it." },
      { id: "quickstart", title: "Quickstart (Terminal)", why: "Hands-on first session in a few minutes." },
      { id: "common-workflows", title: "Common workflows", why: "Tasks people use Claude Code for every day." },
      { id: "best-practices", title: "Best practices", why: "What heavy users have converged on." },
      { id: "whats-new-w20", title: "What's new — latest week", why: "Newest features in the most recent weekly digest." },
    ],
    wizardRecommended: true,
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
