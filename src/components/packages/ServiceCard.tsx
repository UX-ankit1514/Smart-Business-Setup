import { Check, Minus, Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatAED } from "@/lib/pricing";
import type { AdditionalService, ServiceEmphasis } from "@/types";

/* Service Card (PRD §12): optional add-on with what it includes, price and an Add / Remove toggle. */
interface ServiceCardProps {
  service: AdditionalService;
  selected: boolean;
  emphasis?: ServiceEmphasis;
  onToggle: () => void;
}

export function ServiceCard({ service, selected, emphasis, onToggle }: ServiceCardProps) {
  const titleId = `service-${service.id}`;
  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-4 rounded-card border-[1.5px] p-5 transition-colors sm:flex-row sm:items-start sm:justify-between",
        selected ? "border-brand bg-arnique-100" : "border-line bg-white",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id={titleId} className="text-sh7 font-semibold text-ink">
            {service.name}
          </h3>
          {emphasis === "recommended" && (
            <Badge tone="brand" icon={Sparkles}>
              Recommended — you need visas
            </Badge>
          )}
          {emphasis === "may_be_relevant" && <Badge tone="neutral">May be relevant</Badge>}
        </div>
        <p className="mt-1 text-p3 text-muted">{service.description}</p>
        <ul className="mt-3 flex flex-col gap-1.5" aria-label={`${service.name} includes`}>
          {service.includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-p3 text-dusk-800">
              <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-arnique-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="sm:text-right">
          <p className="text-p2 font-semibold text-ink">{formatAED(service.demoPrice)}</p>
          {selected ? (
            <p className="flex items-center gap-1 text-p4 font-medium text-arnique-900 sm:justify-end">
              <Check aria-hidden className="size-3.5" strokeWidth={3} />
              Added
            </p>
          ) : (
            <p className="text-p4 text-muted">Illustrative</p>
          )}
        </div>
        <Button
          variant={selected ? "tertiary" : "secondary"}
          size="m"
          icon={selected ? Minus : Plus}
          aria-pressed={selected}
          aria-label={`${selected ? "Remove" : "Add"} ${service.name}`}
          onClick={onToggle}
          className="w-28"
        >
          {selected ? "Remove" : "Add"}
        </Button>
      </div>
    </article>
  );
}
