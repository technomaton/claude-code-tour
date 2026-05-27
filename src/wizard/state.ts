/**
 * Wizard state — single object persisted to localStorage at key cct-wizard-v1.
 * Imported by useWizardState.ts (the React hook) and templates.ts (the pure
 * generators).
 */
import { useEffect, useState, useCallback } from "react";

export type OS = "macos" | "linux" | "wsl" | "windows-ps" | "windows-cmd";
export type ProjectType =
  | "web-app"
  | "library"
  | "cli-tool"
  | "data-pipeline"
  | "docs-site"
  | "monorepo"
  | "other";
export type PackageManager = "pnpm" | "npm" | "yarn" | "cargo" | "pip" | "poetry" | "uv" | "other";
export type Model = "default" | "claude-sonnet-4-5" | "claude-opus-4-5" | "claude-haiku-4-5";

export interface WizardState {
  os: OS | null;
  installedConfirmed: boolean;
  firstSessionConfirmed: boolean;
  projectName: string;
  projectType: ProjectType;
  languages: string[];
  packageManager: PackageManager;
  testCommand: string;
  lintCommand: string;
  buildCommand: string;
  conventions: string;
  model: Model;
  bashAllow: string[];
  bashDeny: string[];
  hooks: {
    logPreTool: boolean;
    autoFormat: boolean;
    stopNotify: boolean;
  };
  envVars: { key: string; value: string }[];
  includeReviewCommand: boolean;
}

export const INITIAL_STATE: WizardState = {
  os: null,
  installedConfirmed: false,
  firstSessionConfirmed: false,
  projectName: "",
  projectType: "web-app",
  languages: [],
  packageManager: "pnpm",
  testCommand: "",
  lintCommand: "",
  buildCommand: "",
  conventions: "",
  model: "default",
  bashAllow: [],
  bashDeny: [],
  hooks: { logPreTool: false, autoFormat: false, stopNotify: false },
  envVars: [],
  includeReviewCommand: true,
};

const KEY = "cct-wizard-v1";

function load(): WizardState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    // Shallow merge with INITIAL_STATE so future schema additions don't break loads.
    return {
      ...INITIAL_STATE,
      ...parsed,
      hooks: { ...INITIAL_STATE.hooks, ...(parsed.hooks ?? {}) },
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function useWizardState() {
  const [state, setState] = useState<WizardState>(() => load());

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode — drop silently */
    }
  }, [state]);

  const patch = useCallback(
    (delta: Partial<WizardState>) => setState((s) => ({ ...s, ...delta })),
    [],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch { /* ignore */ }
    setState(INITIAL_STATE);
  }, []);

  return { state, patch, reset, setState };
}

/** Sensible default test/lint/build commands per package manager. */
export function defaultsFor(pm: PackageManager): {
  test: string;
  lint: string;
  build: string;
} {
  switch (pm) {
    case "pnpm":
      return { test: "pnpm test", lint: "pnpm lint", build: "pnpm build" };
    case "npm":
      return { test: "npm test", lint: "npm run lint", build: "npm run build" };
    case "yarn":
      return { test: "yarn test", lint: "yarn lint", build: "yarn build" };
    case "cargo":
      return { test: "cargo test", lint: "cargo clippy", build: "cargo build --release" };
    case "pip":
    case "poetry":
      return { test: "pytest", lint: "ruff check .", build: "" };
    case "uv":
      return { test: "uv run pytest", lint: "uv run ruff check .", build: "" };
    case "other":
    default:
      return { test: "", lint: "", build: "" };
  }
}

export const ALL_LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C#",
  "Ruby",
  "PHP",
  "Other",
];

export const ALL_BASH_ALLOW = [
  { value: "Bash(npm *)", label: "npm" },
  { value: "Bash(pnpm *)", label: "pnpm" },
  { value: "Bash(yarn *)", label: "yarn" },
  { value: "Bash(git *)", label: "git" },
  { value: "Bash(gh *)", label: "gh (GitHub CLI)" },
  { value: "Bash(python *)", label: "python" },
  { value: "Bash(node *)", label: "node" },
  { value: "Bash(cargo *)", label: "cargo" },
  { value: "Bash(go *)", label: "go" },
  { value: "Bash(make *)", label: "make" },
  { value: "Bash(task *)", label: "task" },
  { value: "Bash(docker *)", label: "docker" },
];

export const ALL_BASH_DENY = [
  { value: "Bash(rm -rf /*)", label: "rm -rf /…" },
  { value: "Bash(sudo *)", label: "sudo" },
  { value: "Bash(curl * | sh)", label: "curl | sh" },
  { value: "Bash(wget * | sh)", label: "wget | sh" },
];
