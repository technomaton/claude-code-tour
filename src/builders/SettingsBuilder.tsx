import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import BuilderShell from "./components/BuilderShell";
import PreviewPane from "./components/PreviewPane";
import FormField, { inputClass } from "./components/FormField";
import StringListField from "./components/StringListField";
import {
  BASH_PRESETS,
  SAFETY_DENY_PRESETS,
  buildSettings,
  type EnvVar,
  type SettingsModel,
  type SettingsState,
} from "./templates";

const MODELS: { v: SettingsModel; label: string }[] = [
  { v: "default", label: "Default (inherit)" },
  { v: "claude-sonnet-4-5", label: "claude-sonnet-4-5" },
  { v: "claude-opus-4-5", label: "claude-opus-4-5" },
  { v: "claude-haiku-4-5", label: "claude-haiku-4-5" },
];

export default function SettingsBuilder() {
  const [state, setState] = useState<SettingsState>({
    model: "default",
    allow: ["bash:git status", "bash:pnpm *"],
    deny: [],
    env: [{ key: "EDITOR", value: "vim" }],
  });

  const output = useMemo(() => buildSettings(state), [state]);

  const addPreset = (key: string) => {
    const entries = BASH_PRESETS[key];
    if (!entries) return;
    setState((s) => ({
      ...s,
      allow: Array.from(new Set([...s.allow, ...entries])),
    }));
  };

  const addSafetyDeny = () => {
    setState((s) => ({
      ...s,
      deny: Array.from(new Set([...s.deny, ...SAFETY_DENY_PRESETS])),
    }));
  };

  const updateEnv = (i: number, patch: Partial<EnvVar>) => {
    setState((s) => ({
      ...s,
      env: s.env.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
    }));
  };

  const addEnv = () =>
    setState((s) => ({ ...s, env: [...s.env, { key: "", value: "" }] }));

  const removeEnv = (i: number) =>
    setState((s) => ({ ...s, env: s.env.filter((_, idx) => idx !== i) }));

  return (
    <BuilderShell
      title="Settings.json builder"
      intro="Generate a full settings.json. Drop it at ~/.claude/settings.json (global) or .claude/settings.json (per project)."
      form={
        <>
          <FormField label="Model">
            <div className="grid sm:grid-cols-2 gap-2">
              {MODELS.map((m) => (
                <label
                  key={m.v}
                  className="inline-flex items-center gap-2 text-sm cursor-pointer
                             px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700
                             hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <input
                    type="radio"
                    name="settings-model"
                    checked={state.model === m.v}
                    onChange={() => setState({ ...state, model: m.v })}
                    className="accent-brand-500"
                  />
                  <span className="font-mono text-xs">{m.label}</span>
                </label>
              ))}
            </div>
          </FormField>

          <FormField
            label="Bash allow list"
            hint="Patterns Claude is allowed to run without prompting."
          >
            <StringListField
              values={state.allow}
              onChange={(allow) => setState({ ...state, allow })}
              placeholder="bash:git status"
            />
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-500">Presets:</span>
              {Object.keys(BASH_PRESETS).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => addPreset(k)}
                  className="text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700
                             hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  + {k}
                </button>
              ))}
            </div>
          </FormField>

          <FormField
            label="Bash deny list"
            hint="Patterns Claude must refuse. Always evaluated before allow."
          >
            <StringListField
              values={state.deny}
              onChange={(deny) => setState({ ...state, deny })}
              placeholder="bash:rm -rf /*"
            />
            <div className="mt-2">
              <button
                type="button"
                onClick={addSafetyDeny}
                className="text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700
                           hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                + Add safety presets
              </button>
            </div>
          </FormField>

          <FormField label="Environment variables">
            <div className="space-y-1.5">
              {state.env.map((e, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={e.key}
                    onChange={(ev) => updateEnv(i, { key: ev.target.value })}
                    placeholder="KEY"
                    className={`${inputClass} font-mono w-1/3`}
                  />
                  <input
                    value={e.value}
                    onChange={(ev) => updateEnv(i, { value: ev.target.value })}
                    placeholder="value"
                    className={`${inputClass} font-mono flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeEnv(i)}
                    aria-label="Remove"
                    className="p-1.5 rounded-md text-zinc-500 hover:text-red-500
                               hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addEnv}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-md
                           border border-zinc-300 dark:border-zinc-700
                           bg-white dark:bg-zinc-900
                           text-zinc-700 dark:text-zinc-300
                           hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Plus className="w-3.5 h-3.5" /> Add env var
              </button>
            </div>
          </FormField>

          <FormField label="Hooks">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Use the{" "}
              <a
                href="#builders/hook"
                className="text-brand-500 underline hover:text-brand-600"
              >
                Hook builder
              </a>{" "}
              to generate the <code className="font-mono text-xs">hooks</code>{" "}
              block and paste it into the resulting settings.json.
            </p>
          </FormField>
        </>
      }
      preview={
        <PreviewPane
          filename="~/.claude/settings.json"
          content={output}
          mime="application/json"
        />
      }
    />
  );
}
