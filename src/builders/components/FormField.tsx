import type { ReactNode } from "react";

interface Props {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({
  label,
  hint,
  error,
  required,
  children,
}: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
        {required && <span className="text-brand-500 ml-0.5">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && (
        <span className="block mt-1 text-xs text-zinc-500">{hint}</span>
      )}
      {error && (
        <span className="block mt-1 text-xs text-red-500">{error}</span>
      )}
    </label>
  );
}

export const inputClass =
  "w-full px-3 py-2 text-sm rounded-md " +
  "border border-zinc-300 dark:border-zinc-700 " +
  "bg-white dark:bg-zinc-900 " +
  "text-zinc-900 dark:text-zinc-100 " +
  "placeholder:text-zinc-400 dark:placeholder:text-zinc-600 " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";
