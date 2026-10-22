import { Building2, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { CompanyDashboard } from "@/types";

/* Section 1 — My Company (PRD H01). */
export function CompanyCard({ company }: { company: CompanyDashboard["company"] }) {
  return (
    <section aria-labelledby="my-company" className="rounded-panel border border-line bg-white p-6">
      <h2 id="my-company" className="text-sph5 font-semibold uppercase text-arnique-700">
        My Company
      </h2>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-tile bg-arnique-200 text-arnique-900">
            <Building2 className="size-5" />
          </span>
          <div>
            <p className="text-sh7 font-semibold text-heading">{company.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-p3 text-muted">
              <MapPin aria-hidden className="size-3.5" />
              {company.location}
            </p>
          </div>
        </div>
        <Badge tone="info" icon={Clock} className="self-start">
          {company.status}
        </Badge>
      </div>
      <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
        <div>
          <dt className="text-p4 text-muted">Business activity</dt>
          <dd className="mt-0.5 text-p3 font-medium text-ink">{company.activity}</dd>
        </div>
        <div>
          <dt className="text-p4 text-muted">Package</dt>
          <dd className="mt-0.5 text-p3 font-medium text-ink">{company.packageName}</dd>
        </div>
      </dl>
    </section>
  );
}
