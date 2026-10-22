import type { Activity, ActivityId } from "@/types";

export interface ActivityMatcher {
  activity: Activity;
  /** Whole-word patterns that identify the activity. */
  patterns: RegExp[];
  /** Phrases that mean a different business (e.g. a restaurant is not food trading). */
  excludes: RegExp[];
}

const ACTIVITIES: Record<ActivityId, Activity> = {
  "fresh-fruit-trading": {
    id: "fresh-fruit-trading",
    name: "Fresh Fruit Trading",
    kind: "product",
    isFood: true,
    activityLabel: "Fresh fruit trading — exact licensed activity to be verified",
    packages: { mainland: "mainland-trading", freezone: "freezone-trading" },
  },
  "foodstuff-trading": {
    id: "foodstuff-trading",
    name: "Foodstuff Trading",
    kind: "product",
    isFood: true,
    activityLabel: "Foodstuff trading — exact licensed activity to be verified",
    packages: { mainland: "mainland-trading", freezone: "freezone-trading" },
  },
  "ecommerce-trading": {
    id: "ecommerce-trading",
    name: "E-commerce Trading",
    kind: "product",
    isFood: false,
    activityLabel: "E-commerce trading — exact licensed activity to be verified",
    packages: { mainland: "mainland-trading", freezone: "freezone-trading" },
  },
  "general-trading": {
    id: "general-trading",
    name: "General Trading",
    kind: "product",
    isFood: false,
    activityLabel: "General trading — exact licensed activity to be verified",
    packages: { mainland: "mainland-trading", freezone: "freezone-trading" },
  },
  "management-consultancy": {
    id: "management-consultancy",
    name: "Management Consultancy",
    kind: "service",
    isFood: false,
    activityLabel: "Management consultancy — exact licensed activity to be verified",
    packages: { mainland: "mainland-professional", freezone: "freezone-consultancy" },
  },
};

const words = (...terms: string[]) => terms.map((t) => new RegExp(`(^|[^a-z])${t}([^a-z]|$)`));

/** Ordered most specific first: the first matching activity wins. */
export const ACTIVITY_MATCHERS: ActivityMatcher[] = [
  {
    activity: ACTIVITIES["fresh-fruit-trading"],
    patterns: words(
      "cherr(y|ies)",
      "fruits?",
      "fruit trading",
      "fresh produce",
      "mango(s|es)?",
      "apples?",
      "bananas?",
      "berries",
      "grapes",
      "avocados?",
      "citrus",
    ),
    excludes: words("juice bar", "smoothie", "restaurant", "caf(e|é)"),
  },
  {
    activity: ACTIVITIES["foodstuff-trading"],
    patterns: words("food", "foods", "foodstuffs?", "food trading", "grocer(y|ies)", "spices?", "snacks?", "rice", "nuts"),
    excludes: words("restaurant", "caf(e|é)", "food truck", "catering", "cloud kitchen", "delivery app", "bakery"),
  },
  {
    activity: ACTIVITIES["ecommerce-trading"],
    patterns: words(
      "online store",
      "online shop",
      "online( [a-z]+){0,3} (business|store|shop|brand|boutique|company)",
      "e-?commerce",
      "web ?shop",
      "sell(ing)? online",
      "shopify",
    ),
    // "An online consulting business" is a service, not e-commerce trading.
    excludes: words("consult(ing|ancy|ant|ants)", "advisory"),
  },
  {
    activity: ACTIVITIES["general-trading"],
    patterns: words(
      "general trading",
      "trading (company|business|firm)",
      "import and (sell|export|distribute)",
      "electronics?",
      "gadgets?",
      "cloth(es|ing)",
      "apparel",
      "garments?",
      "fashion",
      "furniture",
      "cosmetics",
      "perfumes?",
      "(auto|spare) parts",
    ),
    excludes: words("consult(ing|ancy|ant|ants)", "advisory", "repair", "tailor(ing)?", "salon"),
  },
  {
    activity: ACTIVITIES["management-consultancy"],
    patterns: words("consult(ing|ancy|ant|ants)", "advisory", "business advice"),
    excludes: [],
  },
];

export function getActivity(id: ActivityId): Activity {
  return ACTIVITIES[id];
}
