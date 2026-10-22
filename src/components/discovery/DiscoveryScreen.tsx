"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Container } from "@/components/layout/Container";
import { JourneyGate } from "@/components/layout/JourneyGate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ArniMark } from "@/components/ui/ArniMark";
import { Button } from "@/components/ui/Button";
import { useJourney } from "@/context/journey-context";
import { track } from "@/lib/analytics";
import { classifyBusiness } from "@/lib/recommendation-engine";
import { validateDescription } from "@/lib/validation";
import { BusinessInput } from "./BusinessInput";
import { ExamplePrompts } from "./ExamplePrompts";

/* Screen 1 — AI Business Discovery. States: empty, typing, valid input, validation error (PRD §13). */
export function DiscoveryScreen() {
  return (
    <>
      <AppHeader />
      <main id="main" className="flex-1">
        <JourneyGate>
          <DiscoveryForm />
        </JourneyGate>
      </main>
      <SiteFooter />
    </>
  );
}

function DiscoveryForm() {
  const router = useRouter();
  const { state, dispatch } = useJourney();
  const [text, setText] = useState(state.description);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isValid = validateDescription(text) === null;

  // A screen restored with browser back must not come back mid-submit.
  useLayoutEffect(() => () => setSubmitting(false), []);

  function handleChange(value: string) {
    setText(value);
    if (error && validateDescription(value) === null) setError(null);
  }

  function pickExample(prompt: string) {
    setText(prompt);
    setError(null);
    inputRef.current?.focus();
  }

  function submit() {
    if (submitting) return;
    const problem = validateDescription(text);
    if (problem) {
      setError(problem);
      inputRef.current?.focus();
      return;
    }
    const description = text.trim();
    const activity = classifyBusiness(description);
    setSubmitting(true);
    router.prefetch("/discovery");
    dispatch({ type: "setDescription", description });
    track("discovery_started", { activity: activity?.id ?? null, recognised: activity !== null });
    // A brief loading state while Arni "reads" the description (PRD §6 microinteractions).
    window.setTimeout(() => router.push("/discovery"), 450);
  }

  return (
    <Container className="py-12 md:py-20">
      <div className="mx-auto max-w-[45rem]">
        <div className="flex items-center gap-2.5">
          <ArniMark size="s" />
          <p className="text-sph5 font-semibold uppercase text-arnique-700">Arni · Business setup assistant</p>
        </div>
        <h1 className="mt-5 font-serif text-l3 text-heading md:text-l2">What business are you planning to start?</h1>
        <p className="mt-3 max-w-[36rem] text-p1 text-muted">
          Tell Arni about your business, and we&apos;ll help you explore suitable setup options.
        </p>

        <form
          noValidate
          className="mt-8 flex flex-col gap-6 md:mt-10"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <BusinessInput id="business-description" ref={inputRef} value={text} error={error} onChange={handleChange} onSubmit={submit} />
          <Button type="submit" size="xl" arrow softDisabled={!isValid} loading={submitting} className="w-full md:w-auto md:self-start">
            {submitting ? "Finding Your Options" : "Find My Business Setup"}
          </Button>
          <ExamplePrompts onPick={pickExample} />
        </form>
      </div>
    </Container>
  );
}
