import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  intro: string;
  form: ReactNode;
  preview: ReactNode;
}

export default function BuilderShell({ title, intro, form, preview }: Props) {
  return (
    <div className="max-w-[1400px] mx-auto">
      <a
        href="#builders"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-brand-500 mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All builders
      </a>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{intro}</p>

      <div className="mt-8 grid lg:grid-cols-[3fr_2fr] gap-6">
        <div className="space-y-5">{form}</div>
        <div className="lg:sticky lg:top-20 self-start">{preview}</div>
      </div>
    </div>
  );
}
