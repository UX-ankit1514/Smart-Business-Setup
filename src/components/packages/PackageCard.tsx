import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatAED } from "@/lib/pricing";
import type { Package } from "@/types";

/* Main package (PRD §7): name, base estimate, included services, important exclusions. */
export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <section aria-labelledby="package-title" className="rounded-panel border border-line bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone="brand">Selected package</Badge>
        <Link href="/recommendations" className="inline-flex min-h-11 items-center text-p3 font-medium text-brand underline-offset-4 hover:underline">
          Change option
        </Link>
      </div>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="package-title" className="text-sh6 font-semibold text-heading">
            {pkg.name}
          </h2>
          <p className="mt-1 text-p3 text-muted">
            {pkg.jurisdiction} · {pkg.licence}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-sh6 font-semibold text-ink">{formatAED(pkg.demoPrice)}</p>
          <p className="text-p4 text-muted">Base setup estimate · illustrative</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sh8 font-semibold text-ink">Included</h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {pkg.inclusions.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-p3 text-ink">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-moss-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sh8 font-semibold text-ink">Not included</h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {pkg.exclusions.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-p3 text-dusk-800">
                <Minus aria-hidden className="mt-0.5 size-4 shrink-0 text-dusk-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
