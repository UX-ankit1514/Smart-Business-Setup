import { describe, expect, it } from "vitest";
import { classifyBusiness, inferSignals, isDiscoveryComplete, recommend } from "@/lib/recommendation-engine";
import { getQuestions } from "@/data/questions";
import type { Answers } from "@/types";

const CHERRIES = "I want to import cherries from India and sell them in Dubai.";
const UAE: Answers = { country: "uae", visas: "no" };

function suggested(description: string, answers: Answers = UAE) {
  const rec = recommend(description, { ...answers, activity: description });
  if (rec.status !== "suggested") throw new Error("expected a suggestion");
  return rec;
}

describe("classifyBusiness", () => {
  it.each([
    [CHERRIES, "fresh-fruit-trading"],
    ["fruit trading", "fresh-fruit-trading"],
    ["Start a food trading business", "foodstuff-trading"],
    ["Launch an online store", "ecommerce-trading"],
    ["I want to start an online clothing business in Dubai", "ecommerce-trading"],
    ["I want to import and sell electronics in the UAE", "general-trading"],
    ["Set up a consulting company", "management-consultancy"],
    ["I want to open a consulting company", "management-consultancy"],
    ["An online consulting business", "management-consultancy"],
  ])("recognises %s", (description, id) => {
    expect(classifyBusiness(description)?.id).toBe(id);
  });

  it.each(["Open a yoga studio", "I want to open a restaurant serving food", "I want to start a business", "", "   "])(
    "does not guess for %j",
    (description) => {
      expect(classifyBusiness(description)).toBeNull();
    },
  );
});

describe("questionnaire", () => {
  it("asks location, business and an optional visa question — the client-location question is gone", () => {
    const questions = getQuestions({ country: "uae" });
    expect(questions.map((q) => q.id)).toEqual(["country", "activity", "visas"]);
    expect(questions.map((q) => q.prompt)).not.toContain("Where will your clients be?");
    expect(questions.find((q) => q.id === "visas")?.optional).toBe(true);
  });

  it("skips the UAE visa question for a setup outside the UAE", () => {
    expect(getQuestions({ country: "outside_uae" }).map((q) => q.id)).toEqual(["country", "activity"]);
  });

  it("is complete with location and business only — visas never block", () => {
    expect(isDiscoveryComplete({ country: "uae" })).toBe(false);
    expect(isDiscoveryComplete({ activity: CHERRIES })).toBe(false);
    expect(isDiscoveryComplete({ country: "uae", activity: CHERRIES })).toBe(true);
  });
});

describe("inferSignals", () => {
  const fruit = classifyBusiness(CHERRIES)!;
  const consultancy = classifyBusiness("Set up a consulting company")!;

  it("reads sourcing and sales channel from the founder's own words", () => {
    expect(inferSignals(CHERRIES, fruit)).toEqual({ sourcing: "import", channel: undefined });
    expect(inferSignals("Sell fruit online and to supermarkets", fruit).channel).toBe("both");
    expect(inferSignals("Buy fruit locally and sell it to supermarkets", fruit)).toEqual({ sourcing: "local", channel: "direct" });
    expect(inferSignals("A consultancy for clients outside the UAE", consultancy)).toEqual({ channel: "international_clients" });
  });

  it("leaves anything not mentioned undefined", () => {
    expect(inferSignals("Start a fruit trading business", fruit)).toEqual({ sourcing: undefined, channel: undefined });
    expect(inferSignals("Set up a consulting company", consultancy)).toEqual({});
  });
});

describe("recommend", () => {
  it("suggests Dubai Mainland trading with a Free Zone alternative when the sales channel isn't stated", () => {
    const rec = suggested(CHERRIES);
    expect(rec.primary.title).toBe("Dubai Mainland — Trading Licence");
    expect(rec.alternative.id).toBe("freezone");
    expect(rec.reasons.join(" ")).toMatch(/haven't said how you'll sell/);
    expect(rec.reasons.join(" ")).toMatch(/local distributor/);
    expect(rec.verification).toBe("requires_verification");
  });

  it("shows import-related requirements when the description mentions importing", () => {
    const importing = suggested(CHERRIES);
    expect(importing.additionalRequirementsSummary).toBe("Food and import-related approvals may apply");
    const approvals = importing.requirements.find((g) => g.id === "approvals")!.items.map((i) => i.label);
    expect(approvals).toContain("Food-import approvals");
    expect(importing.checksToVerify.map((c) => c.title)).toContain("Food-import compliance");

    const local = suggested("Buy cherries locally and sell them to supermarkets in Dubai");
    expect(local.additionalRequirementsSummary).toBe("Food safety approvals may apply");
    expect(local.requirements.find((g) => g.id === "approvals")!.items.map((i) => i.label)).not.toContain("Food-import approvals");
  });

  it("keeps import approvals as To verify when sourcing isn't mentioned", () => {
    const rec = suggested("Start a fruit trading business");
    expect(rec.additionalRequirementsSummary).toBe("Food approvals may apply — import needs confirming");
    expect(rec.checksToVerify.map((c) => c.title)).toContain("Import requirements");
  });

  it("suggests a Free Zone for online selling", () => {
    const rec = suggested("I want to start an online clothing business in Dubai");
    expect(rec.primary.id).toBe("freezone");
    expect(rec.alternative.id).toBe("mainland");
  });

  it("recommends the trading package for general trading, with customs for imports", () => {
    const rec = suggested("I want to import and sell electronics in the UAE");
    expect(rec.primary.packageId).toBe("mainland-trading");
    expect(rec.additionalRequirementsSummary).toBe("Customs and import registration may apply");
  });

  it("uses the description, not a question, to place consultancies", () => {
    expect(suggested("Set up a consulting company").primary.packageId).toBe("mainland-professional");
    expect(suggested("A consulting company for clients overseas").primary.packageId).toBe("freezone-consultancy");
  });

  it("compares the package names and what each option is best for", () => {
    const features = suggested(CHERRIES).comparison.map((row) => row.feature);
    expect(features.slice(0, 2)).toEqual(["Package", "Best for"]);
    expect(features).toContain("Starting cost");
  });

  it("prioritises Visa Assistance only when visas are needed, and never requires the answer", () => {
    expect(suggested(CHERRIES, { country: "uae", visas: "yes" }).serviceEmphasis).toEqual({ visa: "recommended" });
    expect(suggested(CHERRIES, { country: "uae", visas: "not_sure" }).serviceEmphasis).toEqual({ visa: "may_be_relevant" });
    expect(suggested(CHERRIES, { country: "uae", visas: "no" }).serviceEmphasis).toEqual({});
    const skipped = suggested(CHERRIES, { country: "uae", visas: "skipped" });
    const operations = skipped.requirements.find((g) => g.id === "banking")!.items.map((i) => i.label);
    expect(operations).toContain("Visa needs, once you decide on owners and employees");
  });

  it("never invents a licence for an unrecognised business", () => {
    expect(recommend("Open a yoga studio", { country: "uae" })).toEqual({
      status: "no_match",
      reason: "unrecognised",
      verification: "requires_verification",
    });
  });

  it("doesn't suggest a UAE licence for a setup outside the UAE", () => {
    expect(recommend(CHERRIES, { country: "outside_uae", otherCountry: "Saudi Arabia" })).toEqual({
      status: "no_match",
      reason: "outside_uae",
      verification: "requires_verification",
    });
  });
});
