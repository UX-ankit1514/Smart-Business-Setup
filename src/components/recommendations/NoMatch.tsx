import { Quote } from "lucide-react";
import { ArniMark } from "@/components/ui/ArniMark";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ARNIFI_ALL_LICENCES_URL } from "@/data/packages";

/*
 * No confident match (PRD §13 error handling): no package is shown, only an expert path. A setup outside the UAE
 * gets the same treatment — Arni only suggests UAE setups — plus Arnifi's own listing for other countries.
 */
interface NoMatchProps {
  reason: "unrecognised" | "outside_uae";
  description: string;
  location: string | null;
  onTalkToExpert: () => void;
}

export function NoMatch({ reason, description, location, onTalkToExpert }: NoMatchProps) {
  const outsideUae = reason === "outside_uae";
  const where = location && location !== "Outside the UAE" ? `in ${location}` : "outside the UAE";
  return (
    <article aria-labelledby="no-match-title" className="mx-auto max-w-[45rem]">
      <div className="flex items-center gap-2.5">
        <ArniMark size="s" />
        <p className="text-p3 font-semibold text-ink">Arni</p>
      </div>
      <h1 id="no-match-title" className="mt-4 font-serif text-l4 text-heading md:text-l3">
        {outsideUae ? "Arni's suggestions currently cover the UAE" : "We need a little more information to recommend a suitable setup"}
      </h1>
      <p className="mt-3 text-p1 text-muted">
        {outsideUae
          ? `You'd like to set up ${where}. Arnifi offers business setup in other countries too — an Arnifi expert can review your requirements.`
          : "We couldn't confidently identify a suitable licence. An Arnifi expert can help review your requirements."}
      </p>

      <div className="mt-8 rounded-card bg-warm p-4 md:p-5">
        <p className="flex items-center gap-2 text-p4 font-medium text-dawn-800">
          <Quote aria-hidden className="size-4" />
          You described
        </p>
        <p className="mt-1 break-words text-p2 text-ink">{description}</p>
      </div>

      <p className="mt-6 text-p3 text-muted">
        {outsideUae
          ? "Arni won't suggest a licence for a country it has no setup information for."
          : "Arni only suggests a setup when it recognises the business activity — it won't guess a licence for you."}
      </p>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
        <ButtonLink href="/discovery" variant="tertiary" back>
          Edit My Answers
        </ButtonLink>
        {outsideUae && (
          <ButtonLink href={ARNIFI_ALL_LICENCES_URL} variant="secondary">
            View Packages on Arnifi
            <span className="sr-only"> (opens arnifi.com in a new tab)</span>
          </ButtonLink>
        )}
        <Button arrow onClick={onTalkToExpert}>
          Talk to an Expert
        </Button>
      </div>
    </article>
  );
}
