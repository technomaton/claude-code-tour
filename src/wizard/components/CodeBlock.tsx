import CopyButton from "./CopyButton";

interface Props {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
}

export default function CodeBlock({ code, language, filename, showCopy = true }: Props) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
      {(filename || showCopy) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800
                        bg-zinc-900 text-xs">
          <span className="font-mono text-zinc-400">
            {filename || language || ""}
          </span>
          {showCopy && <CopyButton text={code} />}
        </div>
      )}
      <pre className="p-4 overflow-auto text-sm font-mono text-zinc-100 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
