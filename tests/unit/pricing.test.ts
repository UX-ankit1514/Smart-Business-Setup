import { describe, expect, it } from "vitest";
import { buildEstimate, formatAED, orderServices } from "@/lib/pricing";

describe("buildEstimate", () => {
  it("starts with the package alone — optional services are unselected by default", () => {
    expect(buildEstimate("mainland-trading", []).total).toBe(24000);
  });

  it("matches the PRD example: package + accounting + visa = AED 29,500", () => {
    const estimate = buildEstimate("mainland-trading", ["visa", "accounting"]);
    expect(estimate.total).toBe(29500);
    expect(formatAED(estimate.total)).toBe("AED 29,500");
    expect(estimate.lines.map((l) => l.id)).toEqual(["mainland-trading", "accounting", "visa"]);
  });

  it("recalculates when a service is removed", () => {
    expect(buildEstimate("mainland-trading", ["accounting"]).total).toBe(27000);
    expect(buildEstimate("mainland-trading", []).total).toBe(24000);
  });
});

describe("orderServices", () => {
  it("puts Visa Assistance first only when recommended, and last when visas aren't needed", () => {
    expect(orderServices({ visa: "recommended" }, "yes")[0].id).toBe("visa");
    expect(orderServices({}, "no").at(-1)?.id).toBe("visa");
    expect(orderServices({}, "not_sure").map((s) => s.id)).toEqual(["accounting", "visa", "banking"]);
  });
});
