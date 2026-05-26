import { Moon, RotateCcw, Search, Sun } from "lucide-react";
import { reset } from "../lib/progress";
import { TOTAL_ITEMS } from "../manifest";

interface Props {
  readCount: number;
  dark: boolean;
  onToggleDark: () => void;
  onOpenSearch: () => void;
  onHome: () => void;
}

export default function Header({
  readCount,
  dark,
  onToggleDark,
  onOpenSearch,
  onHome,
}: Props) {
  const pct = Math.round((readCount / TOTAL_ITEMS) * 100);
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/85 backdrop-blur">
      <div className="flex items-center gap-3 px-4 h-14 max-w-[1600px] mx-auto">
        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50 hover:opacity-80"
          title="Go to start"
        >
          <span className="inline-block w-7 h-7 rounded-md bg-brand-500" />
          <span className="hidden sm:inline">Claude Code Tour</span>
        </button>
        <button
          type="button"
          onClick={onOpenSearch}
          className="ml-2 flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 text-sm
                     rounded-md border border-zinc-200 dark:border-zinc-800
                     bg-zinc-100 dark:bg-zinc-900 text-zinc-500
                     hover:bg-white dark:hover:bg-zinc-800"
        >
          <Search className="w-4 h-4" />
          <span>Search docs…</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-950/60">
            /
          </kbd>
        </button>
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="w-32 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="tabular-nums">
            {readCount}/{TOTAL_ITEMS} · {pct}%
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset your reading progress?")) reset();
          }}
          title="Reset progress"
          className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleDark}
          title={dark ? "Light mode" : "Dark mode"}
          className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
