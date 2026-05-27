import { useEffect, useState } from "react";
import HookBuilder from "./HookBuilder";
import SkillBuilder from "./SkillBuilder";
import SettingsBuilder from "./SettingsBuilder";
import SlashCommandBuilder from "./SlashCommandBuilder";

type BuilderKey = "hook" | "skill" | "settings" | "slash-command";

interface TileSpec {
  key: BuilderKey;
  emoji: string;
  title: string;
  description: string;
}

const TILES: TileSpec[] = [
  {
    key: "hook",
    emoji: "🪝",
    title: "Hook",
    description: "Generate a hook block for settings.json.",
  },
  {
    key: "skill",
    emoji: "🧠",
    title: "Skill",
    description: "Generate a SKILL.md file.",
  },
  {
    key: "settings",
    emoji: "⚙️",
    title: "Settings.json",
    description: "Generate a full ~/.claude/settings.json.",
  },
  {
    key: "slash-command",
    emoji: "⌨️",
    title: "Slash command",
    description: "Generate a .claude/commands/<name>.md.",
  },
];

function readSubroute(): BuilderKey | null {
  const h = window.location.hash.slice(1);
  if (!h.startsWith("builders/")) return null;
  const rest = h.slice("builders/".length);
  if (
    rest === "hook" ||
    rest === "skill" ||
    rest === "settings" ||
    rest === "slash-command"
  ) {
    return rest;
  }
  return null;
}

export default function Builders() {
  const [sub, setSub] = useState<BuilderKey | null>(() => readSubroute());

  useEffect(() => {
    const onHash = () => setSub(readSubroute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (sub === "hook") return <HookBuilder />;
  if (sub === "skill") return <SkillBuilder />;
  if (sub === "settings") return <SettingsBuilder />;
  if (sub === "slash-command") return <SlashCommandBuilder />;

  return <BuildersLanding />;
}

function BuildersLanding() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Config builders
      </h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
        Visual editors for Claude Code config files. Form → live preview → copy
        or download.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {TILES.map((t) => (
          <a
            key={t.key}
            href={`#builders/${t.key}`}
            className="group block p-5 rounded-xl
                       border border-zinc-200 dark:border-zinc-800
                       bg-white dark:bg-zinc-900
                       hover:border-brand-400 dark:hover:border-brand-500
                       hover:shadow-md hover:-translate-y-0.5
                       transition-all"
          >
            <div className="text-3xl">{t.emoji}</div>
            <div className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-brand-500">
              {t.title}
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {t.description}
            </div>
          </a>
        ))}
      </div>

      <p className="mt-10 text-xs text-zinc-500">
        Output stays in your browser — nothing is uploaded. Each form holds its
        own state; reloading clears it.
      </p>
    </div>
  );
}
