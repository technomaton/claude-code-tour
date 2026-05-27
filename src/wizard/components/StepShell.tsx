import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export const STEPS = [
  { slug: "intro", label: "Intro" },
  { slug: "install", label: "Install" },
  { slug: "first-session", label: "First session" },
  { slug: "claude-md", label: "CLAUDE.md" },
  { slug: "settings", label: "Settings" },
  { slug: "extras", label: "Extras" },
  { slug: "done", label: "Done" },
] as const;

export type StepSlug = (typeof STEPS)[number]["slug"];

interface Props {
  current: StepSlug;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Next-button disabled state (e.g. "you must tick the checkbox to proceed") */
  nextDisabled?: boolean;
  /** Custom Next label (default "Next") */
  nextLabel?: string;
  /** Hide nav (for the Done step) */
  hideNav?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function StepShell({
  current,
  title,
  subtitle,
  children,
  nextDisabled,
  nextLabel = "Next",
  hideNav,
  onPrev,
  onNext,
}: Props) {
  const currentIndex = STEPS.findIndex((s) => s.slug === current);

  return (
    <div className="max-w-3xl">
      {/* Progress */}
      <div className="flex items-center gap-1.5 mb-6">
        {STEPS.map((s, i) => (
          <div
            key={s.slug}
            className={`h-2 rounded-full flex-1 transition-colors ${
              i < currentIndex
                ? "bg-brand-500"
                : i === currentIndex
                  ? "bg-brand-400 dark:bg-brand-500"
                  : "bg-zinc-200 dark:bg-zinc-800"
            }`}
            title={`${i + 1}. ${s.label}`}
          />
        ))}
      </div>
      <div className="text-xs text-zinc-500 mb-2 font-medium">
        Step {currentIndex + 1} of {STEPS.length} · {STEPS[currentIndex].label}
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{subtitle}</p>
      )}

      <div className="mt-8">{children}</div>

      {!hideNav && (
        <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800
                        flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev || currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                       border border-zinc-300 dark:border-zinc-700
                       hover:bg-zinc-100 dark:hover:bg-zinc-800
                       disabled:opacity-40 disabled:cursor-not-allowed
                       text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                       bg-brand-500 hover:bg-brand-600
                       disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-semibold"
          >
            {nextLabel} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
