import StepShell from "../components/StepShell";
import CodeBlock from "../components/CodeBlock";
import type { WizardState } from "../state";
import { buildInstallCommand, OS_LABEL } from "../templates";

interface Props {
  state: WizardState;
  patch: (delta: Partial<WizardState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Install({ state, patch, onNext, onPrev }: Props) {
  const cmd = buildInstallCommand(state.os);
  const osLabel = state.os ? OS_LABEL[state.os] : "your OS";
  const shellName =
    state.os === "windows-ps" ? "powershell"
    : state.os === "windows-cmd" ? "batch"
    : "bash";

  return (
    <StepShell
      current="install"
      title="Install Claude Code"
      subtitle={`Run the command below in ${osLabel}. Copy it with the button on the right.`}
      nextDisabled={!state.installedConfirmed}
      onNext={onNext}
      onPrev={onPrev}
    >
      <CodeBlock code={cmd} filename={shellName} />

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Need a different installer (Homebrew, WinGet, manual)? See the{" "}
        <a href="#setup" className="text-brand-500 hover:underline">Advanced setup</a> page.
      </p>

      <label
        className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg border
                   border-zinc-200 dark:border-zinc-800 cursor-pointer
                   hover:border-zinc-300 dark:hover:border-zinc-700"
      >
        <input
          type="checkbox"
          checked={state.installedConfirmed}
          onChange={(e) => patch({ installedConfirmed: e.target.checked })}
          className="accent-brand-500 w-4 h-4"
        />
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          I've installed Claude Code
        </span>
      </label>
    </StepShell>
  );
}
