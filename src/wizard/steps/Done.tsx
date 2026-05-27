import { useState } from "react";
import { Download, RotateCcw, CheckCircle2 } from "lucide-react";
import StepShell from "../components/StepShell";
import type { WizardState } from "../state";
import { downloadZip } from "../zip";

interface Props {
  state: WizardState;
  reset: () => void;
  onPrev: () => void;
}

export default function Done({ state, reset, onPrev }: Props) {
  const [downloading, setDownloading] = useState(false);

  const onDownload = async () => {
    setDownloading(true);
    try {
      await downloadZip(state);
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  };

  const files: string[] = ["CLAUDE.md", ".claude/settings.json"];
  if (state.includeReviewCommand) files.push(".claude/commands/review.md");
  files.push("README.txt");

  return (
    <StepShell
      current="done"
      title="🎉 You're ready"
      subtitle="Download the starter pack, extract it into your project root, and you're set."
      hideNav
    >
      <ul className="space-y-2 mb-8">
        {files.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
            <code className="font-mono text-zinc-700 dark:text-zinc-300">{f}</code>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onDownload}
        disabled={downloading}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                   bg-brand-500 hover:bg-brand-600 disabled:opacity-60
                   text-white font-semibold text-lg shadow-md hover:shadow-lg
                   transition-all"
      >
        <Download className="w-5 h-5" />
        {downloading ? "Building zip…" : "Download claude-starter.zip"}
      </button>

      <div className="mt-8 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
          Next steps
        </div>
        <ol className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1 list-decimal list-inside">
          <li>Extract the ZIP into your project root (it adds <code className="font-mono text-xs">CLAUDE.md</code> + <code className="font-mono text-xs">.claude/</code>).</li>
          <li>Run <code className="font-mono text-xs">claude</code> from that directory.</li>
          <li>Verify it picked up your settings by typing <code className="font-mono text-xs">/config</code>.</li>
        </ol>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 pt-6
                      border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                     border border-zinc-300 dark:border-zinc-700
                     hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium"
        >
          Back to extras
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                     border border-zinc-300 dark:border-zinc-700
                     hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium
                     text-zinc-600 dark:text-zinc-400"
        >
          <RotateCcw className="w-4 h-4" /> Restart wizard
        </button>
      </div>
    </StepShell>
  );
}
