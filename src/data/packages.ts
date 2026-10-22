import type { Package, PackageId } from "@/types";

/*
 * Arnifi website destinations, taken from arnifi.com's own navigation. A demo package links to its matching
 * Arnifi package page when one exists, otherwise to the UAE licence listing — never to a guessed URL.
 */
export const ARNIFI_UAE_LICENCES_URL = "https://arnifi.com/product-listing?countries=1&productType=licence";
export const ARNIFI_ALL_LICENCES_URL = "https://arnifi.com/product-listing?productType=licence";
const ARNIFI_DUBAI_MAINLAND_PROFESSIONAL_URL =
  "https://arnifi.com/product-details/licence/dubai-mainland/dubai-mainland-license-(standard-professional-activity)";

/** All prices are fictional demo values (PRD §7, MVP.md Appendix A2). */
export const PACKAGES: Record<PackageId, Package> = {
  "mainland-trading": {
    id: "mainland-trading",
    name: "Dubai Mainland Trading Package",
    optionId: "mainland",
    jurisdiction: "Dubai Mainland",
    licence: "Trading Licence",
    demoPrice: 24000,
    arnifiUrl: ARNIFI_UAE_LICENCES_URL,
    arnifiUrlKind: "listing",
    inclusions: [
      "Trade licence application support",
      "Trade name and initial approval support",
      "Company documents prepared for you",
      "Establishment card application support",
      "A dedicated setup consultant",
    ],
    exclusions: [
      "Government and third-party fees",
      "Office space lease",
      "Food and import approvals",
      "Visa fees and medical tests",
    ],
  },
  "freezone-trading": {
    id: "freezone-trading",
    name: "UAE Free Zone Trading Package",
    optionId: "freezone",
    jurisdiction: "UAE Free Zone",
    licence: "Trading Licence",
    demoPrice: 19000,
    arnifiUrl: ARNIFI_UAE_LICENCES_URL,
    arnifiUrlKind: "listing",
    inclusions: [
      "Free zone licence application support",
      "Company registration documents",
      "Guidance on desk and office options",
      "A dedicated setup consultant",
    ],
    exclusions: [
      "Government and free zone authority fees",
      "Distribution arrangements for local UAE sales",
      "Food and import approvals",
      "Visa fees and medical tests",
    ],
  },
  "mainland-professional": {
    id: "mainland-professional",
    name: "Dubai Mainland Professional Package",
    optionId: "mainland",
    jurisdiction: "Dubai Mainland",
    licence: "Professional Licence",
    demoPrice: 20000,
    arnifiUrl: ARNIFI_DUBAI_MAINLAND_PROFESSIONAL_URL,
    arnifiUrlKind: "package",
    inclusions: [
      "Professional licence application support",
      "Trade name and initial approval support",
      "Company documents prepared for you",
      "A dedicated setup consultant",
    ],
    exclusions: [
      "Government and third-party fees",
      "Office space lease",
      "Attestation of professional qualifications",
      "Visa fees and medical tests",
    ],
  },
  "freezone-consultancy": {
    id: "freezone-consultancy",
    name: "UAE Free Zone Consultancy Package",
    optionId: "freezone",
    jurisdiction: "UAE Free Zone",
    licence: "Consultancy Licence",
    demoPrice: 16500,
    arnifiUrl: ARNIFI_UAE_LICENCES_URL,
    arnifiUrlKind: "listing",
    inclusions: [
      "Free zone licence application support",
      "Company registration documents",
      "Guidance on desk and office options",
      "A dedicated setup consultant",
    ],
    exclusions: [
      "Government and free zone authority fees",
      "Attestation of professional qualifications",
      "Visa fees and medical tests",
    ],
  },
};

export function getPackage(id: PackageId): Package {
  return PACKAGES[id];
}
