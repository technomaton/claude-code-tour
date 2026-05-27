import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = "Copy", className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — silent */
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
                  border border-zinc-300 dark:border-zinc-700
                  bg-white dark:bg-zinc-900
                  hover:bg-zinc-50 dark:hover:bg-zinc-800
                  text-zinc-700 dark:text-zinc-300 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" /> {label}
        </>
      )}
    </button>
  );
}
