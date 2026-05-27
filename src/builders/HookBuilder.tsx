import { useMemo, useState } from "react";
import BuilderShell from "./components/BuilderShell";
import PreviewPane from "./components/PreviewPane";
import FormField, { inputClass } from "./components/FormField";
import {
  buildHookSnippet,
  type HookEvent,
  type HookState,
  type HookType,
} from "./templates";

const EVENTS: HookEvent[] = [
  "PreToolUse",
  "PostToolUse",
  "Stop",
  "UserPromptSubmit",
  "SubagentStop",
  "Notification",
];

export default function HookBuilder() {
  const [state, setState] = useState<HookState>({
    event: "PostToolUse",
    matcher: "Edit|Write",
    command: "pnpm prettier --write",
    hookType: "command",
    mcpTool: "",
  });

  const output = useMemo(() => buildHookSnippet(state), [state]);

  return (
    <BuilderShell
      title="Hook builder"
      intro="Generate a hooks block to merge into your settings.json."
      form={
        <>
          <FormField label="Event">
            <select
              value={state.event}
              onChange={(e) =>
                setState({ ...state, event: e.target.value as HookEvent })
              }
              className={inputClass}
            >
              {EVENTS.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Tool matcher"
            hint="Regex matching tool name. Examples: Bash, Edit|Write, .*"
          >
            <input
              value={state.matcher}
              onChange={(e) => setState({ ...state, matcher: e.target.value })}
              placeholder=".*"
              className={inputClass}
            />
          </FormField>

          <FormField label="Type">
            <div className="flex gap-4">
              {(
                [
                  { v: "command", label: "Shell command" },
                  { v: "mcp", label: "MCP tool" },
                ] as { v: HookType; label: string }[]
              ).map((opt) => (
                <label
                  key={opt.v}
                  className="inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="hook-type"
                    checked={state.hookType === opt.v}
                    onChange={() => setState({ ...state, hookType: opt.v })}
                    className="accent-brand-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </FormField>

          {state.hookType === "command" ? (
            <FormField
              label="Command"
              hint="The shell command to run. Multi-line allowed."
            >
              <textarea
                value={state.command}
                onChange={(e) =>
                  setState({ ...state, command: e.target.value })
                }
                rows={4}
                placeholder="pnpm prettier --write"
                className={`${inputClass} font-mono`}
              />
            </FormField>
          ) : (
            <FormField
              label="MCP tool"
              hint="Format: mcp__<server>__<tool>"
            >
              <input
                value={state.mcpTool}
                onChange={(e) =>
                  setState({ ...state, mcpTool: e.target.value })
                }
                placeholder="mcp__server__tool"
                className={`${inputClass} font-mono`}
              />
            </FormField>
          )}
        </>
      }
      preview={
        <PreviewPane
          filename=".claude/settings.json (merge hooks block)"
          content={output}
          mime="application/json"
        />
      }
    />
  );
}
