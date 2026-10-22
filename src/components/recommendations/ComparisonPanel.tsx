import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import type { ComparisonRow, OptionId, SetupOption } from "@/types";

/* Comparison Panel (PRD §6 R04): Mainland vs Free Zone. A table on desktop, stacked rows on mobile. */
interface ComparisonPanelProps {
  rows: ComparisonRow[];
  primaryId: OptionId;
  alternative: SetupOption;
  alternativeNote: string;
  /** The alternative's package on arnifi.com. */
  alternativeLink: { href: string; label: string };
  onViewAlternative: () => void;
}

const COLUMNS: { id: OptionId; label: string }[] = [
  { id: "mainland", label: "Mainland" },
  { id: "freezone", label: "Free Zone" },
];

export function ComparisonPanel({ rows, primaryId, alternative, alternativeNote, alternativeLink, onViewAlternative }: ComparisonPanelProps) {
  const suggested = <Badge tone="brand">Suggested</Badge>;
  return (
    <div className="flex flex-col gap-5">
      <table className="hidden w-full border-collapse overflow-hidden rounded-card text-left md:table">
        <caption className="sr-only">Mainland compared with Free Zone</caption>
        <thead>
          <tr className="bg-cool">
            <th scope="col" className="w-1/3 border-b border-line px-4 py-3 text-sh8 font-semibold text-ink">
              Feature
            </th>
            {COLUMNS.map((col) => (
              <th key={col.id} scope="col" className="border-b border-line px-4 py-3 text-sh8 font-semibold text-ink">
                <span className="flex items-center gap-2">
                  {col.label}
                  {col.id === primaryId && suggested}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-4 py-3 text-p3 font-medium text-ink">
                {row.feature}
              </th>
              <td className={"px-4 py-3 text-p3 " + (primaryId === "mainland" ? "bg-arnique-100 text-ink" : "text-dusk-800")}>{row.mainland}</td>
              <td className={"px-4 py-3 text-p3 " + (primaryId === "freezone" ? "bg-arnique-100 text-ink" : "text-dusk-800")}>{row.freezone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <div key={row.feature} className="rounded-card border border-line p-4">
            <dt className="text-p3 font-semibold text-ink">{row.feature}</dt>
            {COLUMNS.map((col) => (
              <dd key={col.id} className="mt-2 flex flex-wrap items-baseline gap-x-2 text-p3 text-dusk-800">
                <span className="font-medium text-ink">{col.label}:</span>
                {col.id === "mainland" ? row.mainland : row.freezone}
                {col.id === primaryId && <span className="text-p4 font-medium text-arnique-900">(suggested)</span>}
              </dd>
            ))}
          </div>
        ))}
      </dl>

      <p className="text-p3 text-muted">These are general considerations, not a regulatory determination. {alternativeNote}</p>
      <div>
        <ButtonLink href={alternativeLink.href} variant="secondary" onClick={onViewAlternative} className="w-full sm:w-auto">
          {alternativeLink.label}
          <span className="sr-only"> (opens arnifi.com in a new tab, {alternative.title})</span>
        </ButtonLink>
      </div>
    </div>
  );
}
