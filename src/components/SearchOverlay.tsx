import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { search, type SearchHit } from "../lib/search";

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (id: string) => void;
}

export default function SearchOverlay({ open, onClose, onPick }: Props) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setHits([]);
      setActiveIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setHits(search(q, 25));
    setActiveIdx(0);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, hits.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const h = hits[activeIdx];
        if (h) onPick(h.item.id);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, hits, activeIdx, onClose, onPick]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <SearchIcon className="w-4 h-4 text-zinc-500" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 140 docs…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {q && hits.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No results for "{q}".
            </div>
          )}
          {hits.map((h, i) => (
            <button
              key={h.item.id}
              type="button"
              onClick={() => onPick(h.item.id)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`w-full text-left px-4 py-2.5 border-b last:border-b-0 border-zinc-100 dark:border-zinc-800/60
                ${i === activeIdx
                  ? "bg-brand-50 dark:bg-brand-900/20"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
            >
              <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                {h.item.title}
              </div>
              <div className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
                {h.snippet}
              </div>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
