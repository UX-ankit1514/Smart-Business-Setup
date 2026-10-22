import { Info, TriangleAlert, CircleCheck, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* DS outlined alert: icon tile + optional title + text. */
type Tone = "info" | "warning" | "success" | "brand";

const tones: Record<Tone, { box: string; tile: string; icon: LucideIcon }> = {
  info: { box: "border-trueblue-100 bg-white", tile: "bg-trueblue-100 text-trueblue-700", icon: Info },
  warning: { box: "border-tang-100 bg-white", tile: "bg-tang-100 text-tang-800", icon: TriangleAlert },
  success: { box: "border-moss-100 bg-white", tile: "bg-moss-100 text-moss-800", icon: CircleCheck },
  brand: { box: "border-arnique-200 bg-arnique-100", tile: "bg-arnique-200 text-arnique-900", icon: Info },
};

export function Notice({ tone = "info", title, icon, children, className, role }: { tone?: Tone; title?: string; icon?: LucideIcon; children: ReactNode; className?: string; role?: "status" | "alert" }) {
  const t = tones[tone];
  const Icon = icon ?? t.icon;
  return (
    <div role={role} className={cn("flex gap-3 rounded-card border p-4", t.box, className)}>
      <span aria-hidden className={cn("flex size-8 shrink-0 items-center justify-center rounded-tile", t.tile)}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1 text-p3 text-ink">
        {title && <p className="font-semibold">{title}</p>}
        <div className={cn(title && "mt-0.5", "text-dusk-800")}>{children}</div>
      </div>
    </div>
  );
}
