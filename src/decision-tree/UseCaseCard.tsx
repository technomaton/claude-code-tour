import { ArrowRight } from "lucide-react";
import type { UseCase } from "./useCases";

interface Props {
  useCase: UseCase;
  onPick: (slug: string) => void;
}

export default function UseCaseCard({ useCase, onPick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onPick(useCase.slug)}
      className="group text-left flex flex-col gap-3 p-5 rounded-xl
                 border border-zinc-200 dark:border-zinc-800
                 bg-white dark:bg-zinc-900
                 hover:border-brand-400 dark:hover:border-brand-600
                 hover:shadow-md hover:-translate-y-0.5
                 transition-all duration-150"
    >
      <div className="text-3xl leading-none">{useCase.emoji}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
          {useCase.title}
        </h3>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-snug">
          {useCase.description}
        </p>
      </div>
      <div className="text-brand-500 text-sm font-medium inline-flex items-center gap-1
                      opacity-0 group-hover:opacity-100 transition-opacity">
        See path <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}
