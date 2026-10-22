import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatAED, PRICING_DISCLAIMER } from "@/lib/pricing";
import type { Estimate } from "@/types";

/* Price Summary (PRD §7): Arnifi's estimate, with third-party fees kept separate (P07). */
export function SummaryLines({ estimate }: { estimate: Estimate }) {
  const services = estimate.lines.filter((l) => l.kind === "service");
  return (
    <ul className="flex flex-col gap-3">
      {estimate.lines.map((line) => (
        <li key={line.id} className="flex animate-fade-in items-start justify-between gap-4 text-p3">
          <span className={line.kind === "package" ? "font-medium text-ink" : "text-dusk-800"}>{line.label}</span>
          <span className="shrink-0 font-medium text-ink tabular-nums">{formatAED(line.amount)}</span>
        </li>
      ))}
      {services.length === 0 && <li className="text-p3 text-muted">No additional services selected</li>}
    </ul>
  );
}

export function FeesNote() {
  return (
    <div className="flex gap-2.5 rounded-control bg-warm p-3">
      <Landmark aria-hidden className="mt-0.5 size-4 shrink-0 text-dawn-800" />
      <p className="text-p4 text-dawn-800">
        <span className="font-semibold">Government and third-party fees are not included.</span> They depend on your exact
        activity and are confirmed separately after expert review.
      </p>
    </div>
  );
}

export function PriceSummary({ estimate, onContinue }: { estimate: Estimate; onContinue: () => void }) {
  return (
    <aside aria-labelledby="summary-title" className="rounded-panel border border-line bg-white p-6 shadow-raised">
      <h2 id="summary-title" className="text-sh7 font-semibold text-heading">
        Your Estimate
      </h2>
      <div className="mt-5">
        <SummaryLines estimate={estimate} />
      </div>
      <div className="mt-5 border-t border-line pt-5">
        <div className="flex items-end justify-between gap-4" aria-live="polite" aria-atomic="true">
          <p className="text-p3 text-muted">Estimated demo total</p>
          <p data-testid="estimated-total" className="text-sh6 font-semibold text-heading tabular-nums">
            {formatAED(estimate.total)}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        <FeesNote />
        <p className="text-p4 text-muted">{PRICING_DISCLAIMER}</p>
        <Button arrow fullWidth onClick={onContinue}>
          Continue to Enquiry
        </Button>
      </div>
    </aside>
  );
}
