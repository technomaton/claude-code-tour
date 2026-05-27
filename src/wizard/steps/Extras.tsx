import StepShell from "../components/StepShell";
import CodeBlock from "../components/CodeBlock";
import type { WizardState } from "../state";
import { buildReviewCommand } from "../templates";

interface Props {
  state: WizardState;
  patch: (delta: Partial<WizardState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Extras({ state, patch, onNext, onPrev }: Props) {
  return (
    <StepShell
      current="extras"
      title="Bonus: a starter slash-command"
      subtitle="Optional — give your project a /review command that audits changed files against your conventions."
      onNext={onNext}
      onPrev={onPrev}
    >
      <label
        className={`flex items-start gap-3 px-4 py-3 rounded-lg cursor-pointer
                    border-2 ${state.includeReviewCommand
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
      >
        <input
          type="checkbox"
          checked={state.includeReviewCommand}
          onChange={(e) => patch({ includeReviewCommand: e.target.checked })}
          className="accent-brand-500 mt-0.5 w-4 h-4"
        />
        <span>
          <span className="block font-medium text-zinc-900 dark:text-zinc-100">
            Include <code className="font-mono text-sm">/review</code> slash-command
          </span>
          <span className="block text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Adds <code className="font-mono text-xs">.claude/commands/review.md</code> to the ZIP.
            Available in any session in your project.
          </span>
        </span>
      </label>

      {state.includeReviewCommand && (
        <div className="mt-6">
          <div className="text-xs font-medium text-zinc-500 mb-2">Preview</div>
          <CodeBlock code={buildReviewCommand()} filename=".claude/commands/review.md" />
        </div>
      )}
    </StepShell>
  );
}
