"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { useId, type ReactNode, type Ref } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

/* Task Card (PRD §12): documents and renewals. The action reveals the task details in place. */
interface TaskCardProps {
  id: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  status: { label: string; tone: BadgeTone; icon?: LucideIcon };
  actionLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headingRef?: Ref<HTMLHeadingElement>;
  children: ReactNode;
}

export function TaskCard({ id, eyebrow, icon: Icon, title, status, actionLabel, open, onOpenChange, headingRef, children }: TaskCardProps) {
  const panelId = useId();
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="@container scroll-mt-24 rounded-panel border border-line bg-white p-6">
      <p className="text-sph5 font-semibold uppercase text-arnique-700">{eyebrow}</p>
      <div className="mt-4 flex flex-col gap-4 @lg:flex-row @lg:items-center @lg:justify-between">
        <div className="flex items-start gap-4">
          <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-tile bg-arnique-200 text-arnique-900">
            <Icon className="size-5" />
          </span>
          <div>
            <h2 id={`${id}-title`} ref={headingRef} tabIndex={-1} className="text-sh7 font-semibold text-heading outline-none">
              {title}
            </h2>
            <Badge tone={status.tone} icon={status.icon} className="mt-1.5">
              {status.label}
            </Badge>
          </div>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onOpenChange(!open)}
          className="flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-cta border border-line bg-white px-4 text-p3 font-medium whitespace-nowrap text-ink transition-colors hover:border-line-hover hover:bg-cool"
        >
          {actionLabel}
          <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      <div id={panelId} inert={!open} className={cn("grid transition-[grid-template-rows] duration-200", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="mt-5 border-t border-line pt-5">{children}</div>
        </div>
      </div>
    </section>
  );
}
