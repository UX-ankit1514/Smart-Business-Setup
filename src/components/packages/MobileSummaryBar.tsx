"use client";

import { ChevronUp } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatAED, PRICING_DISCLAIMER } from "@/lib/pricing";
import type { Estimate } from "@/types";
import { FeesNote, SummaryLines } from "./PriceSummary";

/* On smaller screens the order summary becomes a compact bottom section (PRD §7) that expands on demand. */
export function MobileSummaryBar({ estimate, onContinue }: { estimate: Estimate; onContinue: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white shadow-overlay lg:hidden">
      <div id={panelId} inert={!open} className={cn("grid transition-[grid-template-rows] duration-200", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="mx-auto flex max-h-[50vh] max-w-[74rem] flex-col gap-4 overflow-y-auto px-6 pt-5 md:px-8">
            <SummaryLines estimate={estimate} />
            <FeesNote />
            <p className="text-p4 text-muted">{PRICING_DISCLAIMER}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[74rem] items-center justify-between gap-3 px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-8">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="flex min-h-11 flex-col items-start rounded-control text-left"
        >
          <span className="flex items-center gap-1 text-p4 text-muted">
            Estimated demo total
            <ChevronUp aria-hidden className={cn("size-3.5 transition-transform", !open && "rotate-180")} />
            <span className="sr-only">{open ? "Hide" : "Show"} details</span>
          </span>
          <span data-testid="estimated-total" className="text-sh7 font-semibold text-heading tabular-nums" aria-live="polite" aria-atomic="true">
            {formatAED(estimate.total)}
          </span>
        </button>
        <Button arrow size="l" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
