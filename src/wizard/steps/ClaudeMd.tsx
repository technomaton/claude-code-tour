import { useMemo } from "react";
import StepShell from "../components/StepShell";
import CodeBlock from "../components/CodeBlock";
import {
  ALL_LANGUAGES,
  defaultsFor,
  type PackageManager,
  type ProjectType,
  type WizardState,
} from "../state";
import { buildClaudeMd } from "../templates";

interface Props {
  state: WizardState;
  patch: (delta: Partial<WizardState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "web-app", label: "Web app" },
  { value: "library", label: "Library" },
  { value: "cli-tool", label: "CLI tool" },
  { value: "data-pipeline", label: "Data pipeline" },
  { value: "docs-site", label: "Docs site" },
  { value: "monorepo", label: "Monorepo" },
  { value: "other", label: "Other" },
];

const PACKAGE_MANAGERS: { value: PackageManager; label: string }[] = [
  { value: "pnpm", label: "pnpm" },
  { value: "npm", label: "npm" },
  { value: "yarn", label: "yarn" },
  { value: "cargo", label: "cargo" },
  { value: "pip", label: "pip" },
  { value: "poetry", label: "poetry" },
  { value: "uv", label: "uv" },
  { value: "other", label: "other" },
];

export default function ClaudeMd({ state, patch, onNext, onPrev }: Props) {
  const preview = useMemo(() => buildClaudeMd(state), [state]);

  const onPMChange = (pm: PackageManager) => {
    const d = defaultsFor(pm);
    patch({
      packageManager: pm,
      // Only auto-populate empty fields so we don't trample user edits
      testCommand: state.testCommand || d.test,
      lintCommand: state.lintCommand || d.lint,
      buildCommand: state.buildCommand || d.build,
    });
  };

  return (
    <StepShell
      current="claude-md"
      title="Generate your CLAUDE.md"
      subtitle="Fill in the form on the left — the preview on the right updates as you type."
      onNext={onNext}
      onPrev={onPrev}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <Field label="Project name">
            <input
              type="text"
              value={state.projectName}
              onChange={(e) => patch({ projectName: e.target.value })}
              placeholder="my-app"
              className={INPUT}
            />
          </Field>

          <Field label="Project type">
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm
                              border ${state.projectType === t.value
                                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                >
                  <input
                    type="radio"
                    name="projectType"
                    checked={state.projectType === t.value}
                    onChange={() => patch({ projectType: t.value })}
                    className="accent-brand-500"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Primary languages">
            <div className="grid grid-cols-3 gap-2">
              {ALL_LANGUAGES.map((lang) => {
                const checked = state.languages.includes(lang);
                return (
                  <label
                    key={lang}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm
                                border ${checked
                                  ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...state.languages, lang]
                          : state.languages.filter((l) => l !== lang);
                        patch({ languages: next });
                      }}
                      className="accent-brand-500"
                    />
                    {lang}
                  </label>
                );
              })}
            </div>
          </Field>

          <Field label="Package manager">
            <select
              value={state.packageManager}
              onChange={(e) => onPMChange(e.target.value as PackageManager)}
              className={INPUT}
            >
              {PACKAGE_MANAGERS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Test command">
            <input
              type="text"
              value={state.testCommand}
              onChange={(e) => patch({ testCommand: e.target.value })}
              placeholder="pnpm test"
              className={INPUT}
            />
          </Field>

          <Field label="Lint command">
            <input
              type="text"
              value={state.lintCommand}
              onChange={(e) => patch({ lintCommand: e.target.value })}
              placeholder="pnpm lint"
              className={INPUT}
            />
          </Field>

          <Field label="Build command">
            <input
              type="text"
              value={state.buildCommand}
              onChange={(e) => patch({ buildCommand: e.target.value })}
              placeholder="pnpm build"
              className={INPUT}
            />
          </Field>

          <Field label="Special conventions (optional)">
            <textarea
              value={state.conventions}
              onChange={(e) => patch({ conventions: e.target.value })}
              rows={4}
              placeholder="- e.g. avoid drive-by refactors&#10;- always run tests before commit"
              className={INPUT}
            />
          </Field>
        </div>

        {/* Preview */}
        <div>
          <div className="text-xs font-medium text-zinc-500 mb-2">Live preview</div>
          <CodeBlock code={preview} filename="CLAUDE.md" />
        </div>
      </div>
    </StepShell>
  );
}

const INPUT =
  "w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 " +
  "bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1.5">
        {label}
      </div>
      {children}
    </div>
  );
}
