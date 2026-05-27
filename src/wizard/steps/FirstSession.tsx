import StepShell from "../components/StepShell";
import CodeBlock from "../components/CodeBlock";
import type { WizardState } from "../state";

interface Props {
  state: WizardState;
  patch: (delta: Partial<WizardState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function FirstSession({ state, patch, onNext, onPrev }: Props) {
  return (
    <StepShell
      current="first-session"
      title="Run your first session"
      subtitle="Open a terminal in your project, then launch Claude Code."
      nextDisabled={!state.firstSessionConfirmed}
      onNext={onNext}
      onPrev={onPrev}
    >
      <div className="space-y-3">
        <CodeBlock code={"cd path/to/your/project"} filename="bash" />
        <CodeBlock code={"claude"} filename="bash" />
      </div>

      <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">
        Claude opens a chat in your terminal. Type a question or task. Useful first
        prompts: <span className="font-mono text-xs">"explain the structure of this repo"</span>,
        {" "}<span className="font-mono text-xs">"add a CONTRIBUTING.md"</span>,
        {" "}<span className="font-mono text-xs">"run the tests and fix any failures"</span>.
        Type <code className="font-mono text-xs">exit</code> or hit
        <kbd className="ml-1 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 text-xs">Ctrl+D</kbd> to quit.
      </p>

      <label
        className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg border
                   border-zinc-200 dark:border-zinc-800 cursor-pointer
                   hover:border-zinc-300 dark:hover:border-zinc-700"
      >
        <input
          type="checkbox"
          checked={state.firstSessionConfirmed}
          onChange={(e) => patch({ firstSessionConfirmed: e.target.checked })}
          className="accent-brand-500 w-4 h-4"
        />
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          I've started a session
        </span>
      </label>
    </StepShell>
  );
}
