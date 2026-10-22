/*
 * Deterministic recommendation service (PRD §10).
 * Pure functions over local mock data — no React, no network — so a real API can replace it later.
 * It never guarantees approval, costs or timelines: every result is "requires_verification".
 */
import { ACTIVITY_MATCHERS } from "@/data/activities";
import { getPackage } from "@/data/packages";
import { getQuestions } from "@/data/questions";
import type {
  Activity,
  Answers,
  ComparisonRow,
  InferredSignals,
  OptionId,
  Recommendation,
  RequirementGroup,
  RequirementItem,
  SetupOption,
} from "@/types";
import { formatAED } from "./pricing";

const normalise = (description: string) => description.toLowerCase().replace(/\s+/g, " ").trim();

export function classifyBusiness(description: string): Activity | null {
  const text = normalise(description);
  if (!text) return null;
  for (const { activity, patterns, excludes } of ACTIVITY_MATCHERS) {
    if (excludes.some((p) => p.test(text))) continue;
    if (patterns.some((p) => p.test(text))) return activity;
  }
  return null;
}

/** Optional questions (visas) never block the recommendation. */
export function isDiscoveryComplete(answers: Answers): boolean {
  return getQuestions(answers)
    .filter((q) => !q.optional)
    .every((q) => answers[q.id] !== undefined);
}

const mentions = (text: string, ...terms: string[]) => terms.some((t) => new RegExp(`(^|[^a-z])${t}([^a-z]|$)`).test(text));

/**
 * How the founder will sell and source isn't asked any more — it's read from their own words when they mention it,
 * and left undefined otherwise, so an explanation never claims something the founder didn't say.
 */
export function inferSignals(description: string, activity: Activity): InferredSignals {
  const text = normalise(description);
  if (activity.kind === "service") {
    if (mentions(text, "international", "overseas", "abroad", "outside (the )?uae", "global", "worldwide")) {
      return { channel: "international_clients" };
    }
    return mentions(text, "(uae|dubai|local) (clients|companies|businesses)") ? { channel: "uae_clients" } : {};
  }
  const online =
    activity.id === "ecommerce-trading" ||
    mentions(text, "online", "e-?commerce", "website", "web ?shop", "instagram", "shopify", "amazon", "noon");
  const direct = mentions(
    text,
    "supermarkets?",
    "hypermarkets?",
    "retail(ers)?",
    "wholesale(rs)?",
    "distribut(e|ion|ors?)",
    "(to|in) (shops|stores|businesses|restaurants|hotels)",
  );
  return {
    channel: online && direct ? "both" : online ? "online" : direct ? "direct" : undefined,
    sourcing: mentions(text, "import(s|ed|ing|ers?)?")
      ? "import"
      : mentions(text, "(buy|source|purchase)(ing)? ([a-z]+ )?(locally|from (local|uae|dubai) suppliers)")
        ? "local"
        : undefined,
  };
}

/** Whether the founder sells (or serves clients) directly inside the UAE market — the default when not stated. */
function sellsDirectlyInUae(activity: Activity, signals: InferredSignals): boolean {
  if (activity.kind === "service") return signals.channel !== "international_clients";
  return signals.channel !== "online";
}

function setupOption(activity: Activity, optionId: OptionId, signals: InferredSignals): SetupOption {
  const pkg = getPackage(activity.packages[optionId]);
  const isService = activity.kind === "service";
  let description: string;
  if (optionId === "mainland") {
    description = isService
      ? "Potentially suitable for consultants serving clients across the UAE directly."
      : signals.channel === "both"
        ? "Potentially suitable for businesses planning to sell directly to customers in the UAE, as well as online."
        : "Potentially suitable for businesses planning to sell directly to customers and businesses across the UAE.";
  } else {
    description = isService
      ? "Potentially suitable for consultants working mainly with clients outside the UAE."
      : "Potentially suitable for businesses selling mainly online, with flexible setup options.";
  }
  return {
    id: optionId,
    title: `${pkg.jurisdiction} — ${pkg.licence}`,
    jurisdiction: pkg.jurisdiction,
    description,
    packageId: pkg.id,
  };
}

function reasonsFor(activity: Activity, signals: InferredSignals, answers: Answers, primary: OptionId): string[] {
  const reasons: string[] = [];
  if (activity.kind === "service") {
    if (primary === "mainland") {
      reasons.push(
        signals.channel === "uae_clients"
          ? "You mentioned clients in the UAE. A mainland company can generally serve clients across the UAE directly."
          : "A mainland company can generally serve clients anywhere in the UAE directly, which keeps the most options open.",
      );
      reasons.push("Free zone companies may face extra conditions when serving clients on the UAE mainland.");
      if (!signals.channel) {
        reasons.push("If most of your clients will be outside the UAE, a free zone may suit you better — see the comparison below.");
      }
    } else {
      reasons.push("You mentioned working with clients outside the UAE. Free zones often suit consultancies that work internationally.");
      reasons.push("If you later serve UAE-based clients directly, a mainland licence may be more suitable.");
    }
  } else if (primary === "mainland") {
    reasons.push(
      signals.channel
        ? "You plan to sell directly in the UAE market. A mainland company can generally trade across the UAE market without extra arrangements."
        : "You haven't said how you'll sell, so Arni suggests the option that keeps the most doors open: a mainland company can generally trade across the UAE market without extra arrangements.",
    );
    if (signals.channel === "both") {
      reasons.push("A mainland trading licence can potentially cover online sales too, depending on the licensed activities.");
    }
    reasons.push(
      "A free zone company may need additional arrangements, such as a local distributor, to sell directly to the UAE market.",
    );
    if (!signals.channel) {
      reasons.push("If you'll sell mainly online, a free zone setup may suit you better — see the comparison below.");
    }
  } else {
    reasons.push("You plan to sell online. Free zones often offer simpler setups for online trading.");
    reasons.push(
      "If you later sell directly to shops or supermarkets in the UAE, a mainland licence or a local distributor may be needed.",
    );
  }

  if (activity.kind === "product") {
    if (signals.sourcing === "import") {
      reasons.push(
        activity.isFood
          ? "Because you'll import fresh products, customs registration and food-import approvals may apply."
          : "Because you'll import products, customs registration may apply.",
      );
    } else if (!signals.sourcing) {
      reasons.push("You haven't said whether you'll import products — an Arnifi expert can confirm whether import approvals apply.");
    } else if (activity.isFood) {
      reasons.push("Buying from UAE suppliers avoids importing, though food safety approvals may still apply.");
    }
  }

  if (answers.visas === "yes") {
    reasons.push(
      "You'll need visas. How many visas a company can sponsor generally depends on its licence and office space, which an expert can confirm.",
    );
  }

  reasons.push(
    "This is a suggestion based on your description and answers. An Arnifi expert would verify the exact licensed activity before you apply.",
  );
  return reasons;
}

function additionalRequirementsSummary(activity: Activity, signals: InferredSignals): string {
  if (activity.kind === "service") return "Proof of qualifications may be requested";
  const importing = signals.sourcing === "import";
  if (activity.isFood) {
    if (importing) return "Food and import-related approvals may apply";
    if (!signals.sourcing) return "Food approvals may apply — import needs confirming";
    return "Food safety approvals may apply";
  }
  if (importing) return "Customs and import registration may apply";
  return "No extra approvals identified yet — to be verified";
}

const verify = (label: string): RequirementItem => ({ label, verification: "requires_verification" });
const general = (label: string): RequirementItem => ({ label, verification: "general" });

function requirementsFor(activity: Activity, signals: InferredSignals, answers: Answers, primary: OptionId): RequirementGroup[] {
  const approvals: RequirementItem[] = [];
  const importing = signals.sourcing === "import";
  // Not mentioned is treated as "might import": the approval stays on the list, marked To verify.
  const maybeImporting = !signals.sourcing;

  if (activity.kind === "product") {
    if (activity.isFood && (importing || maybeImporting)) approvals.push(verify("Food-import approvals"));
    if (importing || maybeImporting) approvals.push(verify("Customs registration for importing goods"));
    if (activity.isFood) approvals.push(verify("Food safety approvals for trading food products"));
  } else {
    approvals.push(verify("Attested qualifications, if your consultancy activity requires them"));
  }
  if (approvals.length === 0) {
    approvals.push(general("No additional approvals identified from your answers — an expert will confirm"));
  }

  const operations: RequirementItem[] = [
    general("Business bank account application"),
    general("Proof of your business activity and expected transactions for the bank"),
  ];
  if (activity.id === "fresh-fruit-trading") operations.push(verify("Suitable cold storage for perishable goods"));
  if (answers.visas === "yes") operations.push(verify("Visa applications for you and any employees"));
  else if (answers.visas !== "no") operations.push(verify("Visa needs, once you decide on owners and employees"));

  return [
    {
      id: "formation",
      title: "Company formation documents",
      items: [
        general("Passport copies for all shareholders"),
        general("Two or three proposed trade names"),
        general("Company constitution documents (Arnifi prepares these)"),
      ],
    },
    {
      id: "licensing",
      title: "Licensing requirements",
      items: [
        verify(`${activity.name} activity on your licence`),
        general(primary === "mainland" ? "Initial approval from the licensing authority" : "Free zone authority approval"),
        general("A registered business address"),
      ],
    },
    { id: "approvals", title: "Potential additional approvals", items: approvals },
    { id: "banking", title: "Banking and operational considerations", items: operations },
  ];
}

function comparisonFor(activity: Activity): ComparisonRow[] {
  const mainland = getPackage(activity.packages.mainland);
  const freezone = getPackage(activity.packages.freezone);
  const pkg: ComparisonRow = { feature: "Package", mainland: mainland.name, freezone: freezone.name };
  const cost: ComparisonRow = {
    feature: "Starting cost",
    mainland: `Demo estimate: ${formatAED(mainland.demoPrice)}`,
    freezone: `Demo estimate: ${formatAED(freezone.demoPrice)}`,
  };
  if (activity.kind === "service") {
    return [
      pkg,
      { feature: "Best for", mainland: "Clients across the UAE", freezone: "Clients mainly outside the UAE" },
      { feature: "Serving clients in the UAE", mainland: "Generally more straightforward", freezone: "Additional conditions may apply" },
      { feature: "Serving clients outside the UAE", mainland: "Potentially suitable", freezone: "Potentially suitable" },
      { feature: "Business address", mainland: "Office space typically needed", freezone: "Desk options may be available" },
      cost,
    ];
  }
  return [
    pkg,
    { feature: "Best for", mainland: "Selling directly to customers and businesses in the UAE", freezone: "Selling mainly online" },
    { feature: "Direct UAE market sales", mainland: "Generally more straightforward", freezone: "Additional conditions may apply" },
    { feature: "Suitable for local distribution", mainland: "Potentially suitable", freezone: "Depends on structure" },
    { feature: "Importing products", mainland: "Subject to applicable approvals", freezone: "Depends on zone and activities" },
    cost,
  ];
}

function checksToVerify(activity: Activity, signals: InferredSignals) {
  const checks: { title: string; detail: string }[] = [];
  if (activity.kind === "product") {
    if (activity.isFood && signals.sourcing === "import") {
      checks.push({
        title: "Food-import compliance",
        detail: "Food and import approvals may apply to your business. An expert confirms what's needed — it isn't part of this estimate.",
      });
    } else if (activity.isFood) {
      checks.push({
        title: "Food safety approvals",
        detail: "Trading food products may need approvals. An expert confirms what's needed — it isn't part of this estimate.",
      });
    } else if (signals.sourcing === "import") {
      checks.push({
        title: "Customs registration",
        detail: "Importing goods may need customs registration. An expert confirms what's needed — it isn't part of this estimate.",
      });
    }
    if (!signals.sourcing) {
      checks.push({
        title: "Import requirements",
        detail: "Once you decide how to source products, an expert can confirm whether import approvals apply.",
      });
    }
  } else {
    checks.push({
      title: "Qualification attestation",
      detail: "Some consultancy activities need attested qualifications. An expert confirms whether yours does.",
    });
  }
  checks.push({
    title: "Exact licensed activity",
    detail: "The precise activity on your licence is confirmed by an Arnifi expert before you apply.",
  });
  return checks;
}

/**
 * Builds the recommendation for a description and its answers.
 * Unrecognised activities and setups outside the UAE return `no_match` — the engine never invents a licence (PRD §10).
 */
export function recommend(description: string, answers: Answers): Recommendation {
  if (answers.country === "outside_uae") return { status: "no_match", reason: "outside_uae", verification: "requires_verification" };
  const activity = classifyBusiness(description);
  if (!activity) return { status: "no_match", reason: "unrecognised", verification: "requires_verification" };

  const signals = inferSignals(description, activity);
  const primaryId: OptionId = sellsDirectlyInUae(activity, signals) ? "mainland" : "freezone";
  const alternativeId: OptionId = primaryId === "mainland" ? "freezone" : "mainland";

  return {
    status: "suggested",
    activity,
    primary: setupOption(activity, primaryId, signals),
    alternative: setupOption(activity, alternativeId, signals),
    reasons: reasonsFor(activity, signals, answers, primaryId),
    alternativeNote:
      primaryId === "mainland"
        ? "A free zone setup has a lower demo estimate but can involve conditions for selling directly in the UAE."
        : "A mainland setup makes direct sales in the UAE more straightforward, with a higher demo estimate.",
    additionalRequirementsSummary: additionalRequirementsSummary(activity, signals),
    requirements: requirementsFor(activity, signals, answers, primaryId),
    comparison: comparisonFor(activity),
    checksToVerify: checksToVerify(activity, signals),
    serviceEmphasis:
      answers.visas === "yes"
        ? { visa: "recommended" }
        : answers.visas === "not_sure" || answers.visas === "skipped"
          ? { visa: "may_be_relevant" }
          : {},
    verification: "requires_verification",
  };
}
