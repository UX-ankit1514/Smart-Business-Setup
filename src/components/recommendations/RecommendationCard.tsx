import { Briefcase, ClipboardList, Landmark, Lightbulb, MapPin, Scale, ShieldCheck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { getPackage } from "@/data/packages";
import { formatAED } from "@/lib/pricing";
import type { OptionId, Package, Recommendation } from "@/types";
import { ComparisonPanel } from "./ComparisonPanel";
import { InfoBlock } from "./InfoBlock";
import { RequirementsChecklist } from "./RequirementsChecklist";

type Suggested = Extract<Recommendation, { status: "suggested" }>;

interface RecommendationCardProps {
  recommendation: Suggested;
  /** The founder's own words, shown next to Arni's reading of the activity. */
  description: string;
  /** Called as the founder leaves for the package on arnifi.com. */
  onViewPackage: (optionId: OptionId) => void;
}

/** CTA label that is honest about the destination: the matching package, or Arnifi's UAE package listing. */
export function arnifiPackageLabel(pkg: Package, optionName?: string): string {
  if (pkg.arnifiUrlKind === "listing") return optionName ? `View ${optionName} Options on Arnifi` : "View UAE Packages on Arnifi";
  return optionName ? `View ${optionName} Package on Arnifi` : "View Package on Arnifi";
}

const NEW_TAB = <span className="sr-only"> (opens arnifi.com in a new tab)</span>;

/* Recommendation Card (PRD §6 Screen 3): suggested option, four facts, progressive disclosure, CTAs. */
export function RecommendationCard({ recommendation: rec, description, onViewPackage }: RecommendationCardProps) {
  const pkg = getPackage(rec.primary.packageId);
  const alternativePackage = getPackage(rec.alternative.packageId);
  const alternativeName = rec.alternative.id === "freezone" ? "Free Zone" : "Mainland";
  const quoted = description.length > 90 ? `${description.slice(0, 90).trimEnd()}…` : description;

  return (
    <article aria-labelledby="primary-recommendation" className="overflow-hidden rounded-panel border border-line bg-white shadow-raised">
      <div className="p-6 md:p-8">
        <Badge tone="brand" icon={ShieldCheck}>
          Suggested option · Requires verification
        </Badge>
        <h2 id="primary-recommendation" className="mt-4 text-sh6 font-semibold text-heading">
          {rec.primary.title}
        </h2>
        <p className="mt-2 max-w-[40rem] text-p2 text-muted">{rec.primary.description}</p>

        <div className="mt-6 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
          <InfoBlock
            icon={Briefcase}
            label="Business activity"
            value={rec.activity.activityLabel}
            note={`From your description: “${quoted}”`}
            tag={{ label: "To verify", tone: "warning" }}
          />
          <InfoBlock icon={MapPin} label="Jurisdiction" value={rec.primary.jurisdiction} tag={{ label: "Suggested", tone: "brand" }} />
          <InfoBlock
            icon={Wallet}
            label="Estimated setup cost"
            value={formatAED(pkg.demoPrice)}
            note="Illustrative setup estimate · excludes government fees"
            tag={{ label: "Illustrative", tone: "neutral" }}
          />
          <InfoBlock
            icon={Landmark}
            label="Additional requirements"
            value={rec.additionalRequirementsSummary}
            tag={{ label: "To verify", tone: "warning" }}
          />
        </div>
      </div>

      <div className="px-6 md:px-8">
        <Disclosure title="Why this recommendation?" icon={Lightbulb}>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-p2 text-ink marker:text-arnique-600">
            {rec.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </Disclosure>
        <Disclosure title="View Requirements" icon={ClipboardList}>
          <RequirementsChecklist groups={rec.requirements} />
        </Disclosure>
        <Disclosure title={`Compare with ${alternativeName}`} icon={Scale}>
          <ComparisonPanel
            rows={rec.comparison}
            primaryId={rec.primary.id}
            alternative={rec.alternative}
            alternativeNote={rec.alternativeNote}
            alternativeLink={{ href: alternativePackage.arnifiUrl, label: arnifiPackageLabel(alternativePackage, alternativeName) }}
            onViewAlternative={() => onViewPackage(rec.alternative.id)}
          />
        </Disclosure>
      </div>

      <div className="flex flex-col gap-4 border-t border-line bg-tint p-6 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-p3 text-muted lg:max-w-[26rem]">
          A suggestion based on your answers — not a guarantee of approval, cost or timing. Opens arnifi.com, where
          packages and prices may differ from this demo estimate.
        </p>
        <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row">
          <ButtonLink href={pkg.arnifiUrl} arrow onClick={() => onViewPackage(rec.primary.id)} className="whitespace-nowrap">
            {arnifiPackageLabel(pkg)}
            {NEW_TAB}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
