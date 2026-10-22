import { Circle, CircleCheck, CircleDot, Clock, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ApplicationStep, StepStatus } from "@/types";

/* Status Indicator (PRD §12, H02/H05): application progress. Each status has its own icon and words. */
const STATUS: Record<StepStatus, { label: string; icon: LucideIcon; tone: string }> = {
  completed: { label: "Completed", icon: CircleCheck, tone: "text-moss-700" },
  in_progress: { label: "In progress", icon: CircleDot, tone: "text-trueblue-700" },
  pending: { label: "Pending", icon: Clock, tone: "text-tang-700" },
  not_started: { label: "Not started", icon: Circle, tone: "text-dusk-500" },
};

export function StatusIndicator({ steps }: { steps: ApplicationStep[] }) {
  const done = steps.filter((s) => s.status === "completed").length;
  return (
    <section aria-labelledby="my-application" className="rounded-panel border border-line bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="my-application" className="text-sph5 font-semibold uppercase text-arnique-700">
          My Application
        </h2>
        <p className="text-p3 font-medium text-ink" aria-live="polite">
          {done} of {steps.length} steps complete
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Application progress"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={done}
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
      >
        <div className="h-full rounded-full bg-moss-700 transition-[width] duration-200" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ol className="mt-5">
        {steps.map((step, index) => {
          const status = STATUS[step.status];
          const Icon = status.icon;
          const last = index === steps.length - 1;
          return (
            <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!last && <span aria-hidden className="absolute top-6 left-[9px] h-[calc(100%-1.25rem)] w-px bg-line" />}
              <Icon aria-hidden className={cn("relative z-10 size-5 shrink-0 bg-white", status.tone)} />
              <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4">
                <p className={cn("text-p3", step.status === "not_started" ? "text-muted" : "font-medium text-ink")}>{step.label}</p>
                <p className={cn("text-p3 font-medium", status.tone === "text-dusk-500" ? "text-muted" : status.tone)}>{status.label}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
