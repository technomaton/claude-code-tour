import { useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORIES, ITEMS, findCategory } from "../manifest";
import { isRead } from "../lib/progress";

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ activeId, onSelect }: Props) {
  const activeCategory = findCategory(activeId)?.id;
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.id, c.id === activeCategory])),
  );

  return (
    <nav
      aria-label="Documentation sections"
      className="h-full overflow-y-auto pr-1 pb-12 text-sm"
    >
      {CATEGORIES.map((cat) => {
        const isOpen = open[cat.id];
        const completed = cat.items.filter(isRead).length;
        return (
          <div key={cat.id} className="mb-1">
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [cat.id]: !o[cat.id] }))}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md font-medium
                         text-left text-zinc-700 dark:text-zinc-300
                         hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
            >
              {isOpen ? (
                <ChevronDown className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )}
              <span className="flex-1 truncate">{cat.title}</span>
              <span className="text-xs tabular-nums text-zinc-500">
                {completed}/{cat.items.length}
              </span>
            </button>
            {isOpen && (
              <ul className="mt-0.5 ml-3 border-l border-zinc-200 dark:border-zinc-800">
                {cat.items.map((id) => {
                  const it = ITEMS[id];
                  if (!it) return null;
                  const active = id === activeId;
                  const read = isRead(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => onSelect(id)}
                        aria-current={active ? "page" : undefined}
                        className={`w-full text-left flex items-center gap-1.5 pl-3 pr-2 py-1 -ml-px border-l-2
                          ${active
                            ? "border-brand-500 text-brand-600 dark:text-brand-300 font-medium bg-brand-50/70 dark:bg-brand-900/20"
                            : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                          }`}
                      >
                        <span className="w-3.5 h-3.5 shrink-0">
                          {read && (
                            <Check
                              className={`w-3.5 h-3.5 ${active ? "text-brand-500" : "text-emerald-500"}`}
                            />
                          )}
                        </span>
                        <span className="truncate">{it.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
