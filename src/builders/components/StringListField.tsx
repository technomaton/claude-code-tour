import { useState } from "react";
import { Plus, X } from "lucide-react";
import { inputClass } from "./FormField";

interface Props {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

export default function StringListField({
  values,
  onChange,
  placeholder,
  addLabel = "Add",
}: Props) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...values, v]);
    setDraft("");
  };

  const remove = (i: number) => {
    onChange(values.filter((_, idx) => idx !== i));
  };

  const update = (i: number, v: string) => {
    onChange(values.map((x, idx) => (idx === i ? v : x)));
  };

  return (
    <div className="space-y-1.5">
      {values.length > 0 && (
        <ul className="space-y-1.5">
          {values.map((v, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                value={v}
                onChange={(e) => update(i, e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove"
                className="p-1.5 rounded-md text-zinc-500 hover:text-red-500
                           hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-md
                     border border-zinc-300 dark:border-zinc-700
                     bg-white dark:bg-zinc-900
                     text-zinc-700 dark:text-zinc-300
                     hover:bg-zinc-100 dark:hover:bg-zinc-800
                     whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
    </div>
  );
}
