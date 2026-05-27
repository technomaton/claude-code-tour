import { useMemo, useState } from "react";
import BuilderShell from "./components/BuilderShell";
import PreviewPane from "./components/PreviewPane";
import FormField, { inputClass } from "./components/FormField";
import { buildSkill, KEBAB_RE, type SkillState } from "./templates";

export default function SkillBuilder() {
  const [state, setState] = useState<SkillState>({
    name: "my-skill",
    description: "Use when the user asks to do X.",
    whenToUse: "User mentions Y\nFile contains Z",
    body: "Steps:\n\n1. Do A\n2. Do B\n",
    contextFork: false,
    userInvocable: true,
  });

  const output = useMemo(() => buildSkill(state), [state]);
  const nameError =
    state.name && !KEBAB_RE.test(state.name)
      ? "Use kebab-case: lowercase letters, digits, and hyphens (e.g. my-skill)."
      : undefined;

  return (
    <BuilderShell
      title="Skill builder"
      intro="Generate a SKILL.md file. Place it under ~/.claude/skills/<name>/SKILL.md."
      form={
        <>
          <FormField
            label="Skill name"
            required
            hint="kebab-case identifier; becomes the folder name."
            error={nameError}
          >
            <input
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="my-skill"
              className={`${inputClass} font-mono`}
            />
          </FormField>

          <FormField
            label="Description"
            required
            hint="Explain when Claude should load this skill. Be concrete — Claude reads this to decide."
          >
            <textarea
              value={state.description}
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
              rows={3}
              className={inputClass}
            />
          </FormField>

          <FormField
            label="When to use"
            hint="One trigger per line; rendered as a bullet list."
          >
            <textarea
              value={state.whenToUse}
              onChange={(e) =>
                setState({ ...state, whenToUse: e.target.value })
              }
              rows={4}
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Body"
            hint="Markdown instructions Claude follows when this skill is loaded."
          >
            <textarea
              value={state.body}
              onChange={(e) => setState({ ...state, body: e.target.value })}
              rows={8}
              className={`${inputClass} font-mono`}
            />
          </FormField>

          <div className="space-y-2">
            <label className="inline-flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.contextFork}
                onChange={(e) =>
                  setState({ ...state, contextFork: e.target.checked })
                }
                className="mt-0.5 accent-brand-500"
              />
              <span className="text-sm">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  context: fork
                </span>
                <span className="block text-xs text-zinc-500">
                  Runs in a subagent with a fresh context window.
                </span>
              </span>
            </label>

            <label className="inline-flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.userInvocable}
                onChange={(e) =>
                  setState({ ...state, userInvocable: e.target.checked })
                }
                className="mt-0.5 accent-brand-500"
              />
              <span className="text-sm">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  user-invocable
                </span>
                <span className="block text-xs text-zinc-500">
                  Visible in the slash-command menu. Default: on.
                </span>
              </span>
            </label>
          </div>
        </>
      }
      preview={
        <PreviewPane
          filename={`~/.claude/skills/${state.name || "my-skill"}/SKILL.md`}
          content={output}
          mime="text/markdown"
        />
      }
    />
  );
}
