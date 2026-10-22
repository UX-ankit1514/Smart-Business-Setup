/* Shared domain types for the Arni guided business setup prototype (PRD §15 "Data requirements"). */

export type ActivityId =
  | "fresh-fruit-trading"
  | "foodstuff-trading"
  | "ecommerce-trading"
  | "general-trading"
  | "management-consultancy";
export type ActivityKind = "product" | "service";

export type QuestionId = "country" | "activity" | "visas";
export type CountryAnswer = "uae" | "outside_uae";
export type VisaAnswer = "yes" | "no" | "not_sure" | "skipped";

export interface Answers {
  country?: CountryAnswer;
  /** Free text from "Which country?" when the founder sets up outside the UAE. */
  otherCountry?: string;
  /** The business description the founder confirmed in the questionnaire. */
  activity?: string;
  visas?: VisaAnswer;
}

/* Sourcing and sales channel are no longer asked; the engine reads them from the description when mentioned. */
export type SourcingAnswer = "import" | "local";
export type ChannelAnswer = "direct" | "online" | "both" | "uae_clients" | "international_clients";

export interface InferredSignals {
  sourcing?: SourcingAnswer;
  channel?: ChannelAnswer;
}

/** User Requirements. Dubai is the only city Arni suggests setups for. */
export interface UserRequirements {
  description: string;
  country: string;
  city: string | null;
  answers: Answers;
}

export type OptionId = "mainland" | "freezone";
export type PackageId =
  | "mainland-trading"
  | "freezone-trading"
  | "mainland-professional"
  | "freezone-consultancy";

export interface Activity {
  id: ActivityId;
  name: string;
  kind: ActivityKind;
  /** Food activities trigger food-import and food-safety considerations. */
  isFood: boolean;
  /** Plain-English activity line shown on the recommendation card. */
  activityLabel: string;
  packages: Record<OptionId, PackageId>;
}

export interface Package {
  id: PackageId;
  name: string;
  optionId: OptionId;
  jurisdiction: string;
  licence: string;
  /** Fictional demo price in AED. */
  demoPrice: number;
  /** Arnifi website destination: the matching package page, or the licence listing when none matches. */
  arnifiUrl: string;
  arnifiUrlKind: "package" | "listing";
  inclusions: string[];
  exclusions: string[];
}

export type ServiceId = "accounting" | "visa" | "banking";

export interface AdditionalService {
  id: ServiceId;
  name: string;
  description: string;
  includes: string[];
  /** Fictional demo price in AED. */
  demoPrice: number;
}

export interface QuestionOption<V extends string = string> {
  value: V;
  label: string;
}

export interface Question {
  id: QuestionId;
  kind: "choice" | "text";
  /** Optional questions can be skipped without blocking the recommendation. */
  optional?: boolean;
  prompt: string;
  helper: string;
  /** Short label for the answered-questions list and summaries. */
  summaryLabel: string;
  options: QuestionOption[];
}

export type Verification = "general" | "requires_verification";

export interface RequirementItem {
  label: string;
  verification: Verification;
}

export interface RequirementGroup {
  id: "formation" | "licensing" | "approvals" | "banking";
  title: string;
  items: RequirementItem[];
}

export interface ComparisonRow {
  feature: string;
  mainland: string;
  freezone: string;
}

export interface SetupOption {
  id: OptionId;
  title: string;
  jurisdiction: string;
  description: string;
  packageId: PackageId;
}

export type ServiceEmphasis = "recommended" | "may_be_relevant";

/** Recommendation (PRD §15): activity, jurisdiction, explanation, additional requirements, verification status. */
export type Recommendation =
  | {
      status: "suggested";
      activity: Activity;
      primary: SetupOption;
      alternative: SetupOption;
      reasons: string[];
      alternativeNote: string;
      additionalRequirementsSummary: string;
      requirements: RequirementGroup[];
      comparison: ComparisonRow[];
      /** Items an Arnifi expert must confirm — shown on the package and enquiry screens. */
      checksToVerify: { title: string; detail: string }[];
      serviceEmphasis: Partial<Record<ServiceId, ServiceEmphasis>>;
      verification: "requires_verification";
    }
  | {
      status: "no_match";
      /** Unrecognised activity, or a country outside the UAE (Arni only suggests UAE setups). */
      reason: "unrecognised" | "outside_uae";
      verification: "requires_verification";
    };

export interface ContactDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface Attribution {
  source: string;
  medium: string | null;
  campaign: string | null;
  landingPath: string;
  capturedAt: string;
}

export interface EstimateLine {
  id: string;
  label: string;
  amount: number;
  kind: "package" | "service";
}

export interface Estimate {
  lines: EstimateLine[];
  total: number;
}

export type EnquiryMode = "package" | "expert";

/** Enquiry (PRD §15): contact, requirements, package, services, total, attribution. */
export interface Enquiry {
  mode: EnquiryMode;
  contact: ContactDetails;
  requirements: UserRequirements;
  activityName: string | null;
  suggestedJurisdiction: string | null;
  selectedPackage: { id: PackageId; name: string; demoPrice: number } | null;
  selectedServices: { id: ServiceId; name: string; demoPrice: number }[];
  estimatedTotal: number | null;
  toVerify: string[];
  attribution: Attribution | null;
}

export interface Lead {
  reference: string;
  submittedAt: string;
  /** Fingerprint of the journey at submission — the same journey is never submitted twice. */
  journeyFingerprint: string;
  enquiry: Enquiry;
}

export type StepStatus = "completed" | "in_progress" | "pending" | "not_started";

export interface ApplicationStep {
  id: string;
  label: string;
  status: StepStatus;
}

export interface DocumentTask {
  id: string;
  name: string;
  detail: string;
}

export interface ComplianceTask {
  id: string;
  name: string;
  status: string;
  detail: string;
}

/** Company Dashboard (PRD §15). */
export interface CompanyDashboard {
  company: { name: string; location: string; status: string; activity: string; packageName: string };
  applicationSteps: ApplicationStep[];
  documentTasks: DocumentTask[];
  complianceTasks: ComplianceTask[];
}
