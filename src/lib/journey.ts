/* Journey state shape, reducer and derived selectors. Pure — the React wiring lives in context/journey-context.tsx. */
import { getPackage } from "@/data/packages";
import { getQuestions, locationLabel } from "@/data/questions";
import { getService } from "@/data/services";
import type {
  Answers,
  ContactDetails,
  EnquiryMode,
  Enquiry,
  Lead,
  OptionId,
  Package,
  QuestionId,
  Recommendation,
  ServiceId,
} from "@/types";
import { getAttribution } from "./attribution";
import { buildEstimate } from "./pricing";
import { classifyBusiness, isDiscoveryComplete, recommend } from "./recommendation-engine";

export interface JourneyState {
  version: 2;
  description: string;
  answers: Answers;
  selectedOptionId: OptionId | null;
  selectedServiceIds: ServiceId[];
  enquiryMode: EnquiryMode;
  contact: ContactDetails;
  lead: Lead | null;
  /** Answer sets whose recommendation has been shown, so the loading state only appears the first time. */
  viewedRecommendations: string[];
  hq: { completedDocIds: string[]; assistantDismissed: boolean };
}

export const INITIAL_JOURNEY: JourneyState = {
  version: 2,
  description: "",
  answers: {},
  selectedOptionId: null,
  selectedServiceIds: [],
  enquiryMode: "package",
  contact: { fullName: "", email: "", phone: "" },
  lead: null,
  viewedRecommendations: [],
  hq: { completedDocIds: [], assistantDismissed: false },
};

export type JourneyAction =
  | { type: "setDescription"; description: string }
  | { type: "answer"; questionId: QuestionId; value: string }
  | { type: "setOtherCountry"; country: string }
  | { type: "selectOption"; optionId: OptionId }
  | { type: "toggleService"; serviceId: ServiceId }
  | { type: "setEnquiryMode"; mode: EnquiryMode }
  | { type: "updateContact"; contact: Partial<ContactDetails> }
  | { type: "submitLead"; lead: Lead }
  | { type: "markRecommendationViewed"; key: string }
  | { type: "completeDocument"; docId: string }
  | { type: "setAssistantDismissed"; dismissed: boolean }
  | { type: "reset" };

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "setDescription": {
      if (action.description === state.description) return state;
      // Every business gets the same questions, so answers are kept (C05); only the business question is asked again.
      const answers = { ...state.answers };
      delete answers.activity;
      return { ...state, description: action.description, answers, selectedOptionId: null };
    }
    case "answer": {
      if (state.answers[action.questionId] === action.value) return state;
      const answers = { ...state.answers, [action.questionId]: action.value };
      // The business question's answer is the description the recommendation is built from.
      const description = action.questionId === "activity" ? action.value : state.description;
      // A changed answer can change the recommendation (C06), so the chosen option is confirmed again.
      return { ...state, description, answers, selectedOptionId: null };
    }
    case "setOtherCountry":
      return state.answers.otherCountry === action.country
        ? state
        : { ...state, answers: { ...state.answers, otherCountry: action.country } };
    case "selectOption":
      return { ...state, selectedOptionId: action.optionId, enquiryMode: "package" };
    case "toggleService": {
      const has = state.selectedServiceIds.includes(action.serviceId);
      return {
        ...state,
        selectedServiceIds: has
          ? state.selectedServiceIds.filter((id) => id !== action.serviceId)
          : [...state.selectedServiceIds, action.serviceId],
      };
    }
    case "setEnquiryMode":
      return { ...state, enquiryMode: action.mode };
    case "updateContact":
      return { ...state, contact: { ...state.contact, ...action.contact } };
    case "submitLead":
      return { ...state, lead: action.lead };
    case "markRecommendationViewed":
      return state.viewedRecommendations.includes(action.key)
        ? state
        : { ...state, viewedRecommendations: [...state.viewedRecommendations, action.key] };
    case "completeDocument":
      return state.hq.completedDocIds.includes(action.docId)
        ? state
        : { ...state, hq: { ...state.hq, completedDocIds: [...state.hq.completedDocIds, action.docId] } };
    case "setAssistantDismissed":
      return { ...state, hq: { ...state.hq, assistantDismissed: action.dismissed } };
    case "reset":
      return INITIAL_JOURNEY;
  }
}

/* ---------- Derived selectors ---------- */

export function selectActivity(state: JourneyState) {
  return classifyBusiness(state.description);
}

export function selectQuestions(state: JourneyState) {
  return getQuestions(state.answers);
}

export function selectDiscoveryComplete(state: JourneyState): boolean {
  return isDiscoveryComplete(state.answers);
}

export function selectRecommendation(state: JourneyState): Recommendation {
  return recommend(state.description, state.answers);
}

/** Identifies one description + answer set; changes whenever the recommendation could change. */
export function recommendationKey(state: JourneyState): string {
  const { country = "-", otherCountry = "-", visas = "-" } = state.answers;
  return [state.description.trim().toLowerCase(), country, otherCountry.trim().toLowerCase(), visas].join("|");
}

export function selectPackage(state: JourneyState): Package | null {
  const activity = selectActivity(state);
  if (!activity || !state.selectedOptionId) return null;
  return getPackage(activity.packages[state.selectedOptionId]);
}

export function selectEstimate(state: JourneyState) {
  const pkg = selectPackage(state);
  return pkg ? buildEstimate(pkg.id, state.selectedServiceIds) : null;
}

/** Fingerprint of everything an enquiry contains apart from contact details. */
export function journeyFingerprint(state: JourneyState): string {
  return [
    recommendationKey(state),
    state.enquiryMode,
    state.enquiryMode === "package" ? (state.selectedOptionId ?? "-") : "-",
    state.enquiryMode === "package" ? [...state.selectedServiceIds].sort().join(",") : "-",
  ].join("#");
}

export function buildEnquiry(state: JourneyState): Enquiry {
  const recommendation = selectRecommendation(state);
  const suggested = recommendation.status === "suggested" ? recommendation : null;
  const pkg = state.enquiryMode === "package" ? selectPackage(state) : null;
  const services = pkg ? state.selectedServiceIds.map(getService) : [];
  const estimate = pkg ? buildEstimate(pkg.id, state.selectedServiceIds) : null;
  return {
    mode: pkg ? "package" : "expert",
    contact: {
      fullName: state.contact.fullName.trim(),
      email: state.contact.email.trim(),
      phone: state.contact.phone.trim(),
    },
    requirements: {
      description: state.description.trim(),
      country: state.answers.country === "uae" ? "United Arab Emirates" : (locationLabel(state.answers) ?? "Not specified"),
      city: state.answers.country === "uae" ? "Dubai" : null,
      answers: state.answers,
    },
    activityName: suggested?.activity.name ?? null,
    suggestedJurisdiction: pkg?.jurisdiction ?? suggested?.primary.jurisdiction ?? null,
    selectedPackage: pkg ? { id: pkg.id, name: pkg.name, demoPrice: pkg.demoPrice } : null,
    selectedServices: services.map((s) => ({ id: s.id, name: s.name, demoPrice: s.demoPrice })),
    estimatedTotal: estimate?.total ?? null,
    toVerify: suggested
      ? suggested.checksToVerify.map((c) => c.title)
      : ["Suitable business activity and licence", "Jurisdiction"],
    attribution: getAttribution(),
  };
}

/** Where a screen should send the founder when its prerequisites are missing; null when it can render. */
export function requiredRoute(state: JourneyState, screen: "conversation" | "recommendations" | "configure" | "enquiry"): string | null {
  if (!state.description.trim()) return "/";
  if (screen === "conversation") return null;
  if (!isDiscoveryComplete(state.answers)) return "/discovery";
  const activity = selectActivity(state);
  if (screen === "recommendations") return null;
  if (screen === "configure") return activity && state.selectedOptionId ? null : "/recommendations";
  // Enquiry: package mode needs a chosen option; expert mode only needs the questionnaire.
  if (state.enquiryMode === "package" && !state.selectedOptionId) return "/recommendations";
  return null;
}

export function createLeadReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "";
  for (let i = 0; i < 6; i++) ref += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `DEMO-${ref}`;
}
