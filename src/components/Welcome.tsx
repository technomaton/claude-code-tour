import { ArrowRight, BookOpen, Map, Sparkles, Target, Wrench } from "lucide-react";
import { CATEGORIES, TOTAL_ITEMS } from "../manifest";

interface Props {
  readCount: number;
  lastItemId?: string;
  onStart: () => void;
  onResume: () => void;
  onGo: (id: string) => void;
}

export default function Welcome({
  readCount,
  lastItemId,
  onStart,
  onResume,
  onGo,
}: Props) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-brand-500 text-sm font-medium mb-2">
        <Sparkles className="w-4 h-4" /> Welcome
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        A guided tour through Claude Code
      </h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
        Every page of the official documentation, in a sensible reading order.
        Mark steps as you read; your progress lives in this browser.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {readCount > 0 && lastItemId ? (
          <>
            <button
              type="button"
              onClick={onResume}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium"
            >
              Resume tour <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
            >
              Start over
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium"
          >
            Start the tour <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* FEATURE: decision-tree — non-linear entry. The most prominent CTA. */}
      <a
        href="#start"
        className="mt-10 flex items-center gap-4 p-5 rounded-xl
                   border-2 border-brand-400 dark:border-brand-700
                   bg-brand-50 dark:bg-brand-900/20
                   hover:bg-brand-100 dark:hover:bg-brand-900/30
                   hover:border-brand-500 dark:hover:border-brand-500
                   transition-colors group"
      >
        <span className="shrink-0 w-12 h-12 rounded-full
                         bg-brand-500 text-white
                         inline-flex items-center justify-center">
          <Target className="w-6 h-6" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-zinc-900 dark:text-zinc-50">
            Where do I start?
          </span>
          <span className="block text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">
            Tell us your goal — we'll show the right docs, wizard step, and config builders.
          </span>
        </span>
        <ArrowRight className="shrink-0 w-5 h-5 text-brand-600 dark:text-brand-300
                                group-hover:translate-x-0.5 transition-transform" />
      </a>

      {/* FEATURE: config-builders */}
      <a
        href="#builders"
        className="group mt-3 flex items-start gap-4 p-5 rounded-xl
                   border border-zinc-200 dark:border-zinc-800
                   bg-white dark:bg-zinc-900
                   hover:border-brand-400 dark:hover:border-brand-500
                   hover:shadow-md transition-all no-underline"
      >
        <div className="shrink-0 mt-0.5 p-2 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300">
          <Wrench className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-brand-500">
            Config builders
          </div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Visual editors for hooks, skills, settings, and slash-commands.
            Form → JSON/Markdown.
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-500 mt-1" />
      </a>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <Stat icon={<BookOpen className="w-4 h-4" />} value={String(TOTAL_ITEMS)} label="Doc pages" />
        <Stat icon={<Map className="w-4 h-4" />} value={String(CATEGORIES.length)} label="Sections" />
        <Stat icon={<Sparkles className="w-4 h-4" />} value={`${readCount}`} label="Read so far" />
      </div>

      <h2 className="mt-14 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        What you'll cover
      </h2>
      <div className="mt-4 space-y-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onGo(c.items[0])}
            className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg
                       border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800
                       hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <span className="shrink-0 mt-0.5 px-2 py-0.5 text-xs font-mono rounded
                             bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200">
              {c.items.length}
            </span>
            <span className="flex-1">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {c.title}
              </span>
              <span className="block text-sm text-zinc-600 dark:text-zinc-400">
                {c.blurb}
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="mt-12 text-xs text-zinc-500">
        Content fetched from{" "}
        <a
          href="https://code.claude.com/docs/en/overview"
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
        >
          code.claude.com/docs
        </a>{" "}
        — this site is an offline reading aid, not the official source.
      </p>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        {icon} {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
        {value}
      </div>
    </div>
  );
}
