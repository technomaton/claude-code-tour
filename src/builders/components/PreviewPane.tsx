import { useState } from "react";
import { Check, Clipboard, Download } from "lucide-react";

interface Props {
  filename: string;
  content: string;
  /** download MIME type, e.g. "application/json" or "text/markdown" */
  mime?: string;
}

export default function PreviewPane({
  filename,
  content,
  mime = "text/plain",
}: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const onDownload = () => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Use only the last segment as the actual filename.
    a.download = filename.split("/").pop() || "config.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <code className="text-xs font-mono text-zinc-500">{filename}</code>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md
                       border border-zinc-300 dark:border-zinc-700
                       bg-white dark:bg-zinc-900
                       text-zinc-700 dark:text-zinc-300
                       hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md
                       border border-zinc-300 dark:border-zinc-700
                       bg-white dark:bg-zinc-900
                       text-zinc-700 dark:text-zinc-300
                       hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>
      <pre
        className="m-0 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed
                   bg-zinc-950 text-zinc-100 border border-zinc-800
                   font-mono whitespace-pre"
      >
        <code>{content}</code>
      </pre>
    </div>
  );
}
