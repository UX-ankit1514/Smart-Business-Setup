"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Quote } from "lucide-react";
import { BusinessInput } from "@/components/discovery/BusinessInput";
import { ExamplePrompts } from "@/components/discovery/ExamplePrompts";
import { AppHeader } from "@/components/layout/AppHeader";
import { Container } from "@/components/layout/Container";
import { JourneyGate } from "@/components/layout/JourneyGate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ArniMark } from "@/components/ui/ArniMark";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useJourney } from "@/context/journey-context";
import { getQuestions, locationLabel } from "@/data/questions";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { selectQuestions } from "@/lib/journey";
import { classifyBusiness } from "@/lib/recommendation-engine";
import { validateDescription } from "@/lib/validation";
import type { Answers } from "@/types";
import { AnsweredList } from "./AnsweredList";
import { ChoiceButton } from "./ChoiceButton";
import { ProgressIndicator } from "./ProgressIndicator";

/* Screen 2 — Guided conversation. States: unanswered, selected, progressing, editing previous answer (PRD §13). */
export function ConversationScreen() {
  return (
    <>
      <AppHeader />
      <main id="main" className="flex-1">
        <JourneyGate screen="conversation">
          <Conversation />
        </JourneyGate>
      </main>
      <SiteFooter />
    </>
  );
}

const ADVANCE_DELAY_MS = 280;

// Everyday sentences from the stakeholder review — a founder needs no licensing terms to answer.
const ACTIVITY_EXAMPLES = [
  "I want to start an online clothing business in Dubai",
  "I want to open a consulting company",
  "I want to import and sell electronics in the UAE",
];

function Conversation() {
  const router = useRouter();
  const { state, dispatch } = useJourney();
  const questions = selectQuestions(state);
  const firstUnanswered = questions.findIndex((q) => !state.answers[q.id]);
  // Landing here with everything answered (e.g. "Edit my answers") opens the review state.
  const [step, setStep] = useState(firstUnanswered === -1 ? questions.length : firstUnanswered);
  const [progressing, setProgressing] = useState<string | null>(null);
  // The business question starts from the start-screen text when Arni recognised a business in it.
  const [businessText, setBusinessText] = useState(
    () => state.answers.activity ?? (classifyBusiness(state.description) ? state.description : ""),
  );
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [otherCountry, setOtherCountry] = useState(state.answers.otherCountry ?? "");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const businessRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true);

  const reviewing = step >= questions.length;
  const question = reviewing ? null : questions[step];
  const location = locationLabel(state.answers);

  // A screen restored with browser back must not come back mid-transition.
  useLayoutEffect(() => () => setProgressing(null), []);

  // Move focus to the new question so keyboard and screen-reader users follow the conversation.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  /* Goes to the next unanswered question, or to the recommendations once every question has an answer. */
  function advance(answers: Answers) {
    const next = getQuestions(answers).findIndex((q) => !answers[q.id]);
    if (next === -1) {
      track("discovery_completed", {
        activity: classifyBusiness(answers.activity ?? state.description)?.id ?? null,
        country: answers.country ?? null,
        visas: answers.visas ?? null,
      });
      router.push("/recommendations");
      return;
    }
    setProgressing(null);
    setStep(next);
  }

  function answerAndAdvance(value: string) {
    if (!question || progressing) return;
    setProgressing(value);
    dispatch({ type: "answer", questionId: question.id, value });
    const answers: Answers = { ...state.answers, [question.id]: value };
    window.setTimeout(() => advance(answers), ADVANCE_DELAY_MS);
  }

  function select(value: string) {
    if (!question || progressing) return;
    // Outside the UAE pauses to ask which country, so the expert knows where the founder wants to set up.
    if (question.id === "country" && value === "outside_uae") {
      dispatch({ type: "answer", questionId: "country", value });
      return;
    }
    answerAndAdvance(value);
  }

  function continueOutsideUae() {
    if (progressing) return;
    const country = otherCountry.trim();
    dispatch({ type: "setOtherCountry", country });
    advance({ ...state.answers, country: "outside_uae", otherCountry: country });
  }

  function handleBusinessChange(value: string) {
    setBusinessText(value);
    if (businessError && validateDescription(value) === null) setBusinessError(null);
  }

  function pickExample(prompt: string) {
    setBusinessText(prompt);
    setBusinessError(null);
    businessRef.current?.focus();
  }

  function submitBusiness() {
    if (progressing) return;
    const problem = validateDescription(businessText);
    if (problem) {
      setBusinessError(problem);
      businessRef.current?.focus();
      return;
    }
    answerAndAdvance(businessText.trim());
  }

  function goBack() {
    if (step === 0) router.push("/");
    else setStep(step - 1);
  }

  const askingWhichCountry = question?.id === "country" && state.answers.country === "outside_uae" && progressing === null;

  return (
    <Container className="py-10 md:py-14">
      <div className="mx-auto max-w-[45rem]">
        <ProgressIndicator current={Math.min(step + 1, questions.length)} total={questions.length} complete={reviewing} />

        <div className="mt-8 rounded-card bg-warm p-4 md:p-5">
          <div className="flex items-start gap-3">
            <Quote aria-hidden className="mt-0.5 size-4 shrink-0 text-dawn-800" />
            <div className="min-w-0 flex-1">
              <p className="text-p4 font-medium text-dawn-800">Your business</p>
              <p className="mt-1 break-words text-p2 text-ink">{state.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                {location && (
                  <Badge tone="neutral" icon={MapPin}>
                    {location}
                  </Badge>
                )}
                <Link href="/" className="text-p3 font-medium text-brand underline-offset-4 hover:underline">
                  Edit description
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="arni-question" className="mt-10">
          <div className="flex items-center gap-2.5">
            <ArniMark size="s" />
            <p className="text-p3 font-semibold text-ink">Arni</p>
          </div>
          <div key={question?.id ?? "review"} className="animate-fade-in">
            <h1 id="arni-question" ref={headingRef} tabIndex={-1} className="mt-4 font-serif text-l5 text-heading outline-none md:text-l4">
              {question ? question.prompt : "That's everything I need"}
            </h1>
            <p className="mt-2 text-p2 text-muted">
              {question ? question.helper : "Change any answer below, or see the setup options worth exploring."}
            </p>

            {question?.kind === "choice" && (
              <>
                <div
                  role="group"
                  aria-labelledby="arni-question"
                  className={cn("mt-6 grid gap-3", question.options.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2")}
                >
                  {question.options.map((option) => {
                    const selected = progressing ? progressing === option.value : state.answers[question.id] === option.value;
                    return (
                      <ChoiceButton
                        key={option.value}
                        label={option.label}
                        selected={selected}
                        disabled={progressing !== null}
                        onSelect={() => select(option.value)}
                      />
                    );
                  })}
                </div>

                {askingWhichCountry && (
                  <form
                    noValidate
                    className="mt-6 flex animate-fade-in flex-col gap-4 sm:flex-row sm:items-end"
                    onSubmit={(e) => {
                      e.preventDefault();
                      continueOutsideUae();
                    }}
                  >
                    <TextField
                      label="Which country?"
                      optional
                      name="country"
                      autoComplete="country-name"
                      placeholder="e.g. Saudi Arabia"
                      maxLength={60}
                      value={otherCountry}
                      onChange={(e) => setOtherCountry(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" arrow>
                      Continue
                    </Button>
                  </form>
                )}

                {question.optional && (
                  <Button variant="text" onClick={() => answerAndAdvance("skipped")} disabled={progressing !== null} className="mt-4">
                    Skip this question
                  </Button>
                )}
              </>
            )}

            {question?.kind === "text" && (
              <form
                noValidate
                className="mt-6 flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitBusiness();
                }}
              >
                <BusinessInput
                  id="business-activity"
                  ref={businessRef}
                  value={businessText}
                  error={businessError}
                  onChange={handleBusinessChange}
                  onSubmit={submitBusiness}
                />
                <Button
                  type="submit"
                  arrow
                  softDisabled={validateDescription(businessText) !== null}
                  loading={progressing !== null}
                  className="w-full md:w-auto md:self-start"
                >
                  Continue
                </Button>
                <ExamplePrompts id="activity-examples-label" prompts={ACTIVITY_EXAMPLES} onPick={pickExample} />
              </form>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="tertiary" back onClick={goBack} disabled={progressing !== null} className="sm:w-auto">
              Back
            </Button>
            {reviewing && (
              <Button arrow onClick={() => router.push("/recommendations")}>
                See Recommendations
              </Button>
            )}
          </div>
        </section>

        <AnsweredList
          questions={questions}
          answers={state.answers}
          activeIndex={step}
          disabled={progressing !== null}
          onEdit={setStep}
        />
      </div>
    </Container>
  );
}
