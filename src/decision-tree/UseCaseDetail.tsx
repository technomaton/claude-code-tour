import { ArrowLeft, ArrowRight, BookOpen, Wrench, Wand2 } from "lucide-react";
import type { BuilderRef, UseCase } from "./useCases";

interface Props {
  useCase: UseCase;
  onBack: () => void;
}

const BUILDER_LABEL: Record<BuilderRef["type"], string> = {
  hook: "Hook builder",
  skill: "Skill scaffolder",
  settings: "Settings.json builder",
  "slash-command": "Slash command builder",
};

export default function UseCaseDetail({ useCase, onBack }: Props) {
  return (
    <div className="max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500
                   hover:text-brand-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All goals
      </button>

      <div className="flex items-start gap-4">
        <span className="text-5xl leading-none mt-1">{useCase.emoji}</span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {useCase.title}
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            {useCase.intro}
          </p>
        </div>
      </div>

      {/* Docs path */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <BookOpen className="w-5 h-5 text-brand-500" /> Your path through the docs
        </h2>
        <ol className="mt-4 space-y-2">
          {useCase.docs.map((d, idx) => (
            <li key={d.id}>
              <a
                href={`#${d.id}`}
                className="flex gap-4 px-4 py-3 rounded-lg
                           border border-zinc-200 dark:border-zinc-800
                           hover:border-brand-400 dark:hover:border-brand-600
                           hover:bg-brand-50 dark:hover:bg-brand-900/20
                           transition-colors"
              >
                <span className="shrink-0 w-7 h-7 rounded-full
                                 bg-brand-100 dark:bg-brand-900/40
                                 text-brand-700 dark:text-brand-200
                                 inline-flex items-center justify-center
                                 text-sm font-semibold tabular-nums">
                  {idx + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-zinc-900 dark:text-zinc-100">
                    {d.title}
                  </span>
                  <span className="block text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {d.why}
                  </span>
                </span>
                <ArrowRight className="shrink-0 self-center w-4 h-4 text-zinc-400" />
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Wizard CTA */}
      {useCase.wizardRecommended && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            <Wand2 className="w-5 h-5 text-brand-500" /> Start from scratch
          </h2>
          <a
            href="#wizard"
            className="mt-3 flex items-center justify-between gap-4 px-5 py-4 rounded-xl
                       border border-zinc-200 dark:border-zinc-800
                       hover:border-brand-400 dark:hover:border-brand-600
                       hover:bg-brand-50 dark:hover:bg-brand-900/20
                       transition-colors"
          >
            <span>
              <span className="block font-medium text-zinc-900 dark:text-zinc-100">
                Use the setup wizard
              </span>
              <span className="block text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                Guided 5-minute flow that generates a starter <code className="font-mono text-xs">.claude/</code> config.
              </span>
            </span>
            <ArrowRight className="shrink-0 w-4 h-4 text-zinc-400" />
          </a>
        </section>
      )}

      {/* Builders */}
      {useCase.builders && useCase.builders.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            <Wrench className="w-5 h-5 text-brand-500" /> Generate your config
          </h2>
          <div className="mt-3 space-y-2">
            {useCase.builders.map((b) => (
              <a
                key={b.type}
                href={`#builders/${b.type}`}
                className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg
                           border border-zinc-200 dark:border-zinc-800
                           hover:border-brand-400 dark:hover:border-brand-600
                           hover:bg-brand-50 dark:hover:bg-brand-900/20
                           transition-colors"
              >
                <span>
                  <span className="block font-medium text-zinc-900 dark:text-zinc-100">
                    {BUILDER_LABEL[b.type]}
                  </span>
                  <span className="block text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {b.reason}
                  </span>
                </span>
                <ArrowRight className="shrink-0 w-4 h-4 text-zinc-400" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Bottom back link */}
      <div className="mt-14 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-brand-500"
        >
          <ArrowLeft className="w-4 h-4" /> Have a different goal? All goals
        </button>
      </div>
    </div>
  );
}
