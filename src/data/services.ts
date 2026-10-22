import type { AdditionalService, ServiceId } from "@/types";

/** Optional services, unselected by default (PRD §7, P04). Prices are fictional demo values. */
export const SERVICES: AdditionalService[] = [
  {
    id: "accounting",
    name: "Accounting & Bookkeeping",
    description: "Help manage business financial records",
    includes: ["Monthly bookkeeping", "Quarterly financial summaries", "VAT registration guidance"],
    demoPrice: 3000,
  },
  {
    id: "visa",
    name: "Visa Assistance",
    description: "Support with applicable visa processes",
    includes: ["Eligibility check for investor and employee visas", "Application preparation and tracking", "Medical test and Emirates ID guidance"],
    demoPrice: 2500,
  },
  {
    id: "banking",
    name: "Banking Assistance",
    description: "Assistance with business bank account applications",
    includes: ["Bank shortlist for your activity", "Document checklist for the application", "Coordination with the bank"],
    demoPrice: 1500,
  },
];

export function getService(id: ServiceId): AdditionalService {
  const service = SERVICES.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service: ${id}`);
  return service;
}
