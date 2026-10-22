import type { Answers, Question } from "@/types";

const country: Question = {
  id: "country",
  kind: "choice",
  prompt: "Where do you want to set up your business?",
  helper: "Arni currently suggests setups in the UAE. Elsewhere, an Arnifi expert can help.",
  summaryLabel: "Location",
  options: [
    { value: "uae", label: "United Arab Emirates" },
    { value: "outside_uae", label: "Outside the UAE" },
  ],
};

const activity: Question = {
  id: "activity",
  kind: "text",
  prompt: "What kind of business are you planning to start?",
  helper: "Describe it in your own words — what you'll sell or offer, and to whom.",
  summaryLabel: "Business",
  options: [],
};

const visas: Question = {
  id: "visas",
  kind: "choice",
  optional: true,
  prompt: "Will you need employee or investor visas?",
  helper: "Optional — choose “Not sure” or skip this if you haven't decided yet.",
  summaryLabel: "Visas",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not_sure", label: "Not sure" },
  ],
};

/**
 * Only questions that change the recommendation are asked (PRD §6 design constraint).
 * Visas are UAE-specific, so they are skipped for a setup outside the UAE.
 */
export function getQuestions(answers: Answers): Question[] {
  return answers.country === "outside_uae" ? [country, activity] : [country, activity, visas];
}

export function answerLabel(question: Question, value: string | undefined): string | null {
  if (!value) return null;
  if (question.kind === "text") return value;
  if (question.optional && value === "skipped") return "Skipped";
  return question.options.find((o) => o.value === value)?.label ?? null;
}

/** Where the founder wants to set up, in words — null until the location question is answered. */
export function locationLabel(answers: Answers): string | null {
  if (answers.country === "uae") return "Dubai, UAE";
  if (answers.country === "outside_uae") return answers.otherCountry?.trim() || "Outside the UAE";
  return null;
}
