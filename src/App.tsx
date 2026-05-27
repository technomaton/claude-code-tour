import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import { ExternalLink, Menu, X } from "lucide-react";
import { ITEMS, TOUR_ORDER, findCategory, getItem } from "./manifest";
import { allRaw, getRaw, SLUG_TO_ID } from "./content";
import { buildIndex } from "./lib/search";
import * as progress from "./lib/progress";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Markdown from "./components/Markdown";
import TourNav from "./components/TourNav";
import SearchOverlay from "./components/SearchOverlay";
import Welcome from "./components/Welcome";
import Wizard from "./wizard/Wizard";

// Build the search index once on module load
buildIndex(allRaw(), SLUG_TO_ID);

// Map /en/<slug> links inside docs to manifest ids
const slugBaseToId: Record<string, string> = Object.fromEntries(
  Object.values(ITEMS).map((i) => [
    i.slug.replace(/\.md$/, "").replace(/^agent-sdk\//, "agent-sdk/"),
    i.id,
  ]),
);

function resolveInternalHref(href: string): string | null {
  // /en/foo or /en/agent-sdk/foo (possibly with #anchor)
  const m = /^\/en\/(.+?)(#.*)?$/.exec(href);
  if (!m) return null;
  const base = m[1].replace(/\.md$/, "");
  return slugBaseToId[base] ?? null;
}

function readHash(): string {
  const h = window.location.hash.slice(1);
  return h || "";
}

function writeHash(id: string) {
  const current = window.location.hash.slice(1);
  if (current === id) return;
  if (id) {
    history.replaceState(null, "", `#${id}`);
  } else {
    // Clear the hash without leaving a "#" behind.
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

export default function App() {
  const snap = useSyncExternalStore(progress.subscribe, progress.getSnapshot);
  const [activeId, setActiveId] = useState<string>(() => readHash());
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("cct.dark") === "1" ||
      (localStorage.getItem("cct.dark") === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("cct.dark", dark ? "1" : "0");
  }, [dark]);

  // Listen for hash changes (back/forward, manual edit)
  useEffect(() => {
    const onHash = () => setActiveId(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Sync state → hash + scroll-to-top on navigation
  useEffect(() => {
    writeHash(activeId);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (activeId) progress.setLast(activeId);
  }, [activeId]);

  // Keyboard shortcuts: "/" to open search, "j/k" for next/prev
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const t = e.target.tagName;
        if (t === "INPUT" || t === "TEXTAREA") return;
      }
      if (e.key === "/" && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "j" && activeId) {
        const i = TOUR_ORDER.indexOf(activeId);
        if (i >= 0 && i < TOUR_ORDER.length - 1) setActiveId(TOUR_ORDER[i + 1]);
      } else if (e.key === "k" && activeId) {
        const i = TOUR_ORDER.indexOf(activeId);
        if (i > 0) setActiveId(TOUR_ORDER[i - 1]);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, activeId]);

  const go = useCallback((id: string) => {
    setActiveId(id);
    setSearchOpen(false);
    setSidebarOpen(false);
  }, []);

  const handleInternalLink = useCallback(
    (href: string) => {
      const id = resolveInternalHref(href);
      if (id) go(id);
      else window.open(`https://code.claude.com/docs${href.startsWith("/") ? "" : "/"}${href}`, "_blank");
    },
    [go],
  );

  const activeItem = activeId ? getItem(activeId) : undefined;
  const readCount = Object.keys(snap.read).length;
  const isWizard = activeId === "wizard" || activeId.startsWith("wizard/");

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        readCount={readCount}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        onOpenSearch={() => setSearchOpen(true)}
        onHome={() => setActiveId("")}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen((s) => !s)}
          className="lg:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full
                     bg-brand-500 text-white shadow-lg"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-14 left-0 right-0 lg:right-auto lg:left-auto
                      lg:top-14 z-20
                      h-[calc(100vh-3.5rem)] w-72 lg:w-64 xl:w-72 shrink-0
                      border-r border-zinc-200 dark:border-zinc-800
                      bg-white dark:bg-zinc-950
                      p-3 transition-transform
                      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <Sidebar activeId={activeId} onSelect={go} />
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8">
          {isWizard ? (
            <Wizard />
          ) : !activeId || !activeItem ? (
            <Welcome
              readCount={readCount}
              lastItemId={snap.lastItemId}
              onStart={() => go(TOUR_ORDER[0])}
              onResume={() => snap.lastItemId && go(snap.lastItemId)}
              onGo={go}
            />
          ) : (
            <article>
              <div className="text-xs text-zinc-500 mb-2 flex items-center gap-2">
                {findCategory(activeItem.id)?.title}
                <a
                  href={activeItem.source}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ml-auto inline-flex items-center gap-1 text-zinc-500 hover:text-brand-500"
                  title="View on code.claude.com"
                >
                  view source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <Markdown
                source={getRaw(activeItem.slug) ?? "# Missing\n\nThis doc could not be loaded."}
                onInternalLink={handleInternalLink}
              />
              <TourNav
                itemId={activeItem.id}
                read={progress.isRead(activeItem.id)}
                onMarkRead={() => progress.markRead(activeItem.id)}
                onMarkUnread={() => progress.markUnread(activeItem.id)}
                onGo={go}
              />
            </article>
          )}
        </main>
      </div>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onPick={go}
      />
    </div>
  );
}
