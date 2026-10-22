"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { useJourney } from "@/context/journey-context";
import { requiredRoute } from "@/lib/journey";
import { cn } from "@/lib/cn";

const STEPS = [
  { label: "Discover", href: "/", paths: ["/", "/discovery"], screen: null },
  { label: "Recommend", href: "/recommendations", paths: ["/recommendations"], screen: "recommendations" },
  { label: "Enquire", href: "/enquiry", paths: ["/enquiry"], screen: "enquiry" },
] as const;

/*
 * Keeps the screens feeling like one journey (PRD §5). Finished steps link back; later steps are plain text.
 * Packages are configured on arnifi.com, so the in-app Configure screen is no longer a journey step.
 */
export function JourneySteps() {
  const pathname = usePathname();
  const { state, hydrated } = useJourney();
  const currentIndex = STEPS.findIndex((s) => (s.paths as readonly string[]).includes(pathname));
  if (currentIndex < 0) return null;

  const reachable = (index: number) => {
    const step = STEPS[index];
    if (!hydrated) return false;
    if (step.screen === null) return true;
    return requiredRoute(state, step.screen) === null;
  };

  return (
    <nav aria-label="Your setup journey">
      {/* Laptop and up: labelled steps */}
      <ol className="hidden items-center gap-1 lg:flex">
        {STEPS.map((step, index) => {
          const isCurrent = index === currentIndex;
          const isDone = index < currentIndex && reachable(index);
          const content = (
            <>
              <span
                aria-hidden
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border text-p4 font-semibold",
                  isCurrent && "border-brand bg-brand text-white",
                  isDone && "border-brand bg-arnique-100 text-brand",
                  !isCurrent && !isDone && "border-line text-muted",
                )}
              >
                {isDone ? <Check className="size-3" /> : index + 1}
              </span>
              <span>{step.label}</span>
            </>
          );
          return (
            <li key={step.label} className="flex items-center gap-1">
              {index > 0 && <span aria-hidden className="mx-1 h-px w-6 bg-line" />}
              {isDone ? (
                <Link href={step.href} className="flex min-h-11 items-center gap-2 rounded-control px-2 text-p3 font-medium text-ink hover:text-brand">
                  {content}
                  <span className="sr-only">(completed)</span>
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn("flex min-h-11 items-center gap-2 px-2 text-p3 font-medium", isCurrent ? "text-heading" : "text-muted")}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Tablet and mobile: a slim segmented bar */}
      <div className="lg:hidden">
        <p className="sr-only">
          Step {currentIndex + 1} of {STEPS.length}: {STEPS[currentIndex].label}
        </p>
        <div aria-hidden className="flex gap-1">
          {STEPS.map((step, index) => (
            <span key={step.label} className={cn("h-1 flex-1 rounded-full", index <= currentIndex ? "bg-brand" : "bg-line")} />
          ))}
        </div>
      </div>
    </nav>
  );
}
