import StepShell from "../components/StepShell";
import type { OS, WizardState } from "../state";
import { OS_LABEL } from "../templates";

interface Props {
  state: WizardState;
  patch: (delta: Partial<WizardState>) => void;
  onNext: () => void;
}

const ALL_OS: OS[] = ["macos", "linux", "wsl", "windows-ps", "windows-cmd"];

export default function Intro({ state, patch, onNext }: Props) {
  return (
    <StepShell
      current="intro"
      title="Set up Claude Code for your project"
      subtitle="Answer a few questions and we'll generate a starter CLAUDE.md, settings.json, and optional slash-command. Takes ~3 minutes."
      nextDisabled={state.os === null}
      onNext={onNext}
    >
      <div className="space-y-3">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Your operating system
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ALL_OS.map((os) => (
            <label
              key={os}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                          border-2 transition-colors
                          ${state.os === os
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
            >
              <input
                type="radio"
                name="os"
                value={os}
                checked={state.os === os}
                onChange={() => patch({ os })}
                className="accent-brand-500"
              />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {OS_LABEL[os]}
              </span>
            </label>
          ))}
        </div>
      </div>
    </StepShell>
  );
}
