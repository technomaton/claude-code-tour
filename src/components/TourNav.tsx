import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { neighbors, findCategory, TOUR_ORDER } from "../manifest";

interface Props {
  itemId: string;
  read: boolean;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onGo: (id: string) => void;
}

export default function TourNav({
  itemId,
  read,
  onMarkRead,
  onMarkUnread,
  onGo,
}: Props) {
  const { prev, next } = neighbors(itemId);
  const cat = findCategory(itemId);
  const i = TOUR_ORDER.indexOf(itemId);

  return (
    <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 max-w-3xl">
      <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
        <span>
          {cat?.title} · step {i + 1} of {TOUR_ORDER.length}
        </span>
        {read ? (
          <button
            type="button"
            onClick={onMarkUnread}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          >
            <Check className="w-3.5 h-3.5" /> Marked as read
          </button>
        ) : (
          <button
            type="button"
            onClick={onMarkRead}
            className="flex items-center gap-1.5 px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Mark as read
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prev ? (
          <button
            type="button"
            onClick={() => onGo(prev.id)}
            className="text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-brand-300 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors group"
          >
            <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-brand-500">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </div>
            <div className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {prev.title}
            </div>
          </button>
        ) : (
          <div />
        )}
        {next ? (
          <button
            type="button"
            onClick={() => onGo(next.id)}
            className="text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-brand-300 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors group sm:text-right"
          >
            <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-brand-500 sm:justify-end">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {next.title}
            </div>
          </button>
        ) : null}
      </div>
    </div>
  );
}
