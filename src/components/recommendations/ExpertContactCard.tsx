import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ExpertContact } from "@/data/contact";

/* The second way forward from a recommendation: a named Arnifi expert with direct contact details. */
export function ExpertContactCard({ expert, onContact }: { expert: ExpertContact; onContact: () => void }) {
  const initials = expert.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside aria-labelledby="expert-title" className="rounded-panel border border-line bg-white p-6 shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <h2 id="expert-title" className="text-sh7 font-semibold text-heading">
          Your Arnifi Expert
        </h2>
        <Badge tone="neutral">Demo contact</Badge>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-arnique-100 text-p2 font-semibold text-arnique-900">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-p2 font-semibold text-ink">{expert.name}</p>
          <p className="text-p3 text-muted">{expert.role}</p>
        </div>
      </div>

      <p className="mt-4 text-p3 text-dusk-800">
        Can confirm the exact licensed activity, costs and next steps for your business before you apply.
      </p>

      <ul className="mt-5 flex flex-col gap-1 border-t border-line pt-4">
        <li>
          <a
            href={`tel:${expert.phone.replace(/\s+/g, "")}`}
            className="flex min-h-11 items-center gap-2.5 rounded-control text-p3 font-medium text-brand hover:text-brand-hover"
          >
            <Phone aria-hidden className="size-4 shrink-0" />
            <span className="sr-only">Call </span>
            {expert.phone}
          </a>
        </li>
        <li>
          <a
            href={`mailto:${expert.email}`}
            className="flex min-h-11 items-center gap-2.5 rounded-control text-p3 font-medium break-all text-brand hover:text-brand-hover"
          >
            <Mail aria-hidden className="size-4 shrink-0" />
            <span className="sr-only">Email </span>
            {expert.email}
          </a>
        </li>
      </ul>

      <Button variant="secondary" arrow fullWidth onClick={onContact} className="mt-4">
        Contact an Arnifi Expert
      </Button>
    </aside>
  );
}
