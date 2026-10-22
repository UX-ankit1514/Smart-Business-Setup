import { getPackage } from "@/data/packages";
import { SERVICES } from "@/data/services";
import type { Estimate, PackageId, ServiceEmphasis, ServiceId, AdditionalService } from "@/types";

export const PRICING_DISCLAIMER =
  "Illustrative pricing for prototype purposes. Final pricing and applicable fees require confirmation.";

export function formatAED(amount: number): string {
  return `AED ${amount.toLocaleString("en-US")}`;
}

/** Arnifi's estimate only — government and third-party fees are kept separate (PRD P07). */
export function buildEstimate(packageId: PackageId, serviceIds: ServiceId[]): Estimate {
  const pkg = getPackage(packageId);
  const lines: Estimate["lines"] = [{ id: pkg.id, label: pkg.name, amount: pkg.demoPrice, kind: "package" }];
  // Keep the catalogue order so the summary doesn't reshuffle as services are toggled.
  for (const service of SERVICES) {
    if (serviceIds.includes(service.id)) {
      lines.push({ id: service.id, label: service.name, amount: service.demoPrice, kind: "service" });
    }
  }
  return { lines, total: lines.reduce((sum, line) => sum + line.amount, 0) };
}

/**
 * Visa Assistance is shown prominently only when the founder said they need visas (PRD §7);
 * when they said no, it moves to the end of the list.
 */
export function orderServices(emphasis: Partial<Record<ServiceId, ServiceEmphasis>>, visasAnswer?: string): AdditionalService[] {
  const rank = (s: AdditionalService) =>
    emphasis[s.id] === "recommended" ? 0 : s.id === "visa" && visasAnswer === "no" ? 2 : 1;
  return [...SERVICES].sort((a, b) => rank(a) - rank(b));
}
