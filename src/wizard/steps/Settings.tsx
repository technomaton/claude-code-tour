import { useMemo } from "react";
import { Plus, X } from "lucide-react";
import StepShell from "../components/StepShell";
import CodeBlock from "../components/CodeBlock";
import {
  ALL_BASH_ALLOW,
  ALL_BASH_DENY,
  type Model,
  type WizardState,
} from "../state";
import { buildSettingsJson } from "../templates";

interface Props {
  state: WizardState;
  patch: (delta: Partial<WizardState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MODELS: { value: Model; label: string }[] = [
  { value: "default", label: "Default (don't pin)" },
  { value: "claude-sonnet-4-5", label: "Sonnet 4.5" },
  { value: "claude-opus-4-5", label: "Opus 4.5" },
  { value: "claude-haiku-4-5", label: "Haiku 4.5" },
];

export default function Settings({ state, patch, onNext, onPrev }: Props) {
  const preview = useMemo(() => buildSettingsJson(state), [state]);

  const toggleAllow = (val: string) => {
    const next = state.bashAllow.includes(val)
      ? state.bashAllow.filter((v) => v !== val)
      : [...state.bashAllow, val];
    patch({ bashAllow: next });
  };
  const toggleDeny = (val: string) => {
    const next = state.bashDeny.includes(val)
      ? state.bashDeny.filter((v) => v !== val)
      : [...state.bashDeny, val];
    patch({ bashDeny: next });
  };

  const addEnv = () => patch({ envVars: [...state.envVars, { key: "", value: "" }] });
  const updateEnv = (i: number, delta: { key?: string; value?: string }) => {
    const next = state.envVars.map((e, idx) => (idx === i ? { ...e, ...delta } : e));
    patch({ envVars: next });
  };
  const removeEnv = (i: number) =>
    patch({ envVars: state.envVars.filter((_, idx) => idx !== i) });

  return (
    <StepShell
      current="settings"
      title="Generate your settings.json"
      subtitle="Pick model, permissions, and hooks. Updates the JSON preview live."
      onNext={onNext}
      onPrev={onPrev}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <Field label="Model preference">
            <div className="grid grid-cols-2 gap-2">
              {MODELS.map((m) => (
                <label
                  key={m.value}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm
                              border ${state.model === m.value
                                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                >
                  <input
                    type="radio"
                    name="model"
                    checked={state.model === m.value}
                    onChange={() => patch({ model: m.value })}
                    className="accent-brand-500"
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Bash — allow list">
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_BASH_ALLOW.map((p) => (
                <Pill
                  key={p.value}
                  label={p.label}
                  checked={state.bashAllow.includes(p.value)}
                  onChange={() => toggleAllow(p.value)}
                />
              ))}
            </div>
          </Field>

          <Field label="Bash — deny list (safety)">
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_BASH_DENY.map((p) => (
                <Pill
                  key={p.value}
                  label={p.label}
                  checked={state.bashDeny.includes(p.value)}
                  onChange={() => toggleDeny(p.value)}
                  variant="deny"
                />
              ))}
            </div>
          </Field>

          <Field label="Hooks">
            <div className="space-y-1.5">
              <Toggle
                label="Log every tool use"
                description="PreToolUse → append JSON line to ~/.claude/logs/tools.jsonl"
                checked={state.hooks.logPreTool}
                onChange={(v) => patch({ hooks: { ...state.hooks, logPreTool: v } })}
              />
              <Toggle
                label="Auto-format after edits"
                description="PostToolUse on Edit|Write → run pnpm prettier on changed files (best-effort)"
                checked={state.hooks.autoFormat}
                onChange={(v) => patch({ hooks: { ...state.hooks, autoFormat: v } })}
              />
              <Toggle
                label="Terminal bell on session end"
                description="Stop hook → printf '\\a'"
                checked={state.hooks.stopNotify}
                onChange={(v) => patch({ hooks: { ...state.hooks, stopNotify: v } })}
              />
            </div>
          </Field>

          <Field label="Environment variables">
            <div className="space-y-1.5">
              {state.envVars.map((e, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={e.key}
                    onChange={(ev) => updateEnv(i, { key: ev.target.value })}
                    placeholder="KEY"
                    className={INPUT + " w-32 font-mono text-xs"}
                  />
                  <span className="text-zinc-400">=</span>
                  <input
                    type="text"
                    value={e.value}
                    onChange={(ev) => updateEnv(i, { value: ev.target.value })}
                    placeholder="value"
                    className={INPUT + " flex-1 font-mono text-xs"}
                  />
                  <button
                    type="button"
                    onClick={() => removeEnv(i)}
                    className="p-1.5 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addEnv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm
                           border border-dashed border-zinc-300 dark:border-zinc-700
                           rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800
                           text-zinc-600 dark:text-zinc-400"
              >
                <Plus className="w-3.5 h-3.5" /> Add env var
              </button>
            </div>
          </Field>
        </div>

        <div>
          <div className="text-xs font-medium text-zinc-500 mb-2">Live preview</div>
          <CodeBlock code={preview} filename=".claude/settings.json" />
        </div>
      </div>
    </StepShell>
  );
}

const INPUT =
  "px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 " +
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

function Pill({
  label,
  checked,
  onChange,
  variant = "allow",
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  variant?: "allow" | "deny";
}) {
  const activeCls =
    variant === "allow"
      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
      : "border-red-500 bg-red-50 dark:bg-red-900/20";
  return (
    <label
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-xs
                  border ${checked ? activeCls : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={variant === "allow" ? "accent-brand-500" : "accent-red-500"}
      />
      <span className="font-mono">{label}</span>
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 px-3 py-2.5 rounded-md cursor-pointer
                  border ${checked
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-brand-500 mt-0.5"
      />
      <span>
        <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </span>
        <span className="block text-xs text-zinc-600 dark:text-zinc-400">
          {description}
        </span>
      </span>
    </label>
  );
}
