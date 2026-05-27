import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { USE_CASES, getUseCase } from "./useCases";
import UseCaseCard from "./UseCaseCard";
import UseCaseDetail from "./UseCaseDetail";

function readSubroute(): string | null {
  const h = window.location.hash.slice(1);
  if (h === "start") return null;
  const m = /^start\/(.+)$/.exec(h);
  return m ? m[1] : null;
}

export default function DecisionTree() {
  const [slug, setSlug] = useState<string | null>(() => readSubroute());

  useEffect(() => {
    const onHash = () => setSlug(readSubroute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const activeUseCase = slug ? getUseCase(slug) : undefined;

  if (slug && activeUseCase) {
    return (
      <UseCaseDetail
        useCase={activeUseCase}
        onBack={() => {
          window.location.hash = "#start";
        }}
      />
    );
  }

  // Landing — grid of all use cases
  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 text-brand-500 text-sm font-medium mb-2">
        <Target className="w-4 h-4" /> Where do I start?
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        What do you want to do with Claude Code?
      </h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
        Pick a goal — we'll show you the relevant docs, an optional setup wizard,
        and any config builders that help.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {USE_CASES.map((u) => (
          <UseCaseCard
            key={u.slug}
            useCase={u}
            onPick={(slug) => {
              window.location.hash = `#start/${slug}`;
            }}
          />
        ))}
      </div>

      <p className="mt-12 text-xs text-zinc-500">
        Prefer the linear tour? <a href="#overview" className="underline">Start from page 1 →</a>
      </p>
    </div>
  );
}
