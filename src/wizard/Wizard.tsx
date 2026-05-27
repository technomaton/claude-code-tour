import { useCallback, useEffect, useState } from "react";
import { useWizardState } from "./state";
import { STEPS, type StepSlug } from "./components/StepShell";
import Intro from "./steps/Intro";
import Install from "./steps/Install";
import FirstSession from "./steps/FirstSession";
import ClaudeMd from "./steps/ClaudeMd";
import Settings from "./steps/Settings";
import Extras from "./steps/Extras";
import Done from "./steps/Done";

function readSlug(): StepSlug {
  const h = window.location.hash.slice(1);
  const m = /^wizard\/(.+)$/.exec(h);
  const candidate = m?.[1] ?? "intro";
  return (STEPS.find((s) => s.slug === candidate)?.slug ?? "intro") as StepSlug;
}

function goTo(slug: StepSlug) {
  window.location.hash = `#wizard/${slug}`;
}

export default function Wizard() {
  const { state, patch, reset } = useWizardState();
  const [slug, setSlug] = useState<StepSlug>(() => readSlug());

  useEffect(() => {
    const onHash = () => setSlug(readSlug());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goNext = useCallback(() => {
    const i = STEPS.findIndex((s) => s.slug === slug);
    if (i < STEPS.length - 1) goTo(STEPS[i + 1].slug);
  }, [slug]);

  const goPrev = useCallback(() => {
    const i = STEPS.findIndex((s) => s.slug === slug);
    if (i > 0) goTo(STEPS[i - 1].slug);
  }, [slug]);

  switch (slug) {
    case "intro":
      return <Intro state={state} patch={patch} onNext={goNext} />;
    case "install":
      return <Install state={state} patch={patch} onNext={goNext} onPrev={goPrev} />;
    case "first-session":
      return <FirstSession state={state} patch={patch} onNext={goNext} onPrev={goPrev} />;
    case "claude-md":
      return <ClaudeMd state={state} patch={patch} onNext={goNext} onPrev={goPrev} />;
    case "settings":
      return <Settings state={state} patch={patch} onNext={goNext} onPrev={goPrev} />;
    case "extras":
      return <Extras state={state} patch={patch} onNext={goNext} onPrev={goPrev} />;
    case "done":
      return <Done state={state} reset={reset} onPrev={goPrev} />;
  }
}
