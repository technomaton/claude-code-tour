import { useMemo, useState } from "react";
import BuilderShell from "./components/BuilderShell";
import PreviewPane from "./components/PreviewPane";
import FormField, { inputClass } from "./components/FormField";
import {
  ALL_TOOLS,
  buildSlashCommand,
  KEBAB_RE,
  type SlashCommandState,
  type SlashModel,
  type Tool,
} from "./templates";

const MODELS: { v: SlashModel; label: string }[] = [
  { v: "inherit", label: "Inherit" },
  { v: "sonnet", label: "Sonnet" },
  { v: "opus", label: "Opus" },
  { v: "haiku", label: "Haiku" },
];

export default function SlashCommandBuilder() {
  const [state, setState] = useState<SlashCommandState>({
    name: "review",
    description: "Review the staged changes for bugs and style.",
    body: "Run `git diff --staged` and summarize each hunk. Flag risks.",
    allowedTools: ["Read", "Bash"],
    model: "inherit",
  });

  const output = useMemo(() => buildSlashCommand(state), [state]);
  const nameError =
    state.name && !KEBAB_RE.test(state.name)
      ? "Use kebab-case: lowercase letters, digits, and hyphens."
      : undefined;

  const toggleTool = (t: Tool) => {
    setState((s) => ({
      ...s,
      allowedTools: s.allowedTools.includes(t)
        ? s.allowedTools.filter((x) => x !== t)
        : [...s.allowedTools, t],
    }));
  };

  return (
    <BuilderShell
      title="Slash command builder"
      intro="Generate a .claude/commands/<name>.md slash command."
      form={
        <>
          <FormField label="Command name" required error={nameError}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">/</span>
              <input
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="review"
                className={`${inputClass} font-mono`}
              />
            </div>
          </FormField>

          <FormField label="Description">
            <input
              value={state.description}
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
              placeholder="Short summary shown in the slash menu."
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Body / prompt template"
            hint="Markdown. This is sent to Claude when the command is invoked."
          >
            <textarea
              value={state.body}
              onChange={(e) => setState({ ...state, body: e.target.value })}
              rows={8}
              className={`${inputClass} font-mono`}
            />
          </FormField>

          <FormField
            label="Allowed tools"
            hint="If none selected, the command inherits the session's tool list."
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {ALL_TOOLS.map((t) => (
                <label
                  key={t}
                  className="inline-flex items-center gap-2 text-sm cursor-pointer
                             px-2.5 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700
                             hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <input
                    type="checkbox"
                    checked={state.allowedTools.includes(t)}
                    onChange={() => toggleTool(t)}
                    className="accent-brand-500"
                  />
                  <span className="font-mono text-xs">{t}</span>
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Model override">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {MODELS.map((m) => (
                <label
                  key={m.v}
                  className="inline-flex items-center gap-2 text-sm cursor-pointer
                             px-2.5 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700
                             hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <input
                    type="radio"
                    name="slash-model"
                    checked={state.model === m.v}
                    onChange={() => setState({ ...state, model: m.v })}
                    className="accent-brand-500"
                  />
                  <span className="text-xs">{m.label}</span>
                </label>
              ))}
            </div>
          </FormField>
        </>
      }
      preview={
        <PreviewPane
          filename={`.claude/commands/${state.name || "command"}.md`}
          content={output}
          mime="text/markdown"
        />
      }
    />
  );
}
