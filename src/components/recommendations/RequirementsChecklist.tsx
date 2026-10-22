import { Check, CircleHelp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { RequirementGroup } from "@/types";

/* "View Requirements" checklist: general items vs items an expert must verify (PRD R05). */
export function RequirementsChecklist({ groups }: { groups: RequirementGroup[] }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-p3 text-muted">
        Items marked <span className="font-medium text-tang-800">To verify</span> depend on your exact activity and are
        confirmed by an Arnifi expert.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`req-${group.id}`}>
            <h4 id={`req-${group.id}`} className="text-sh8 font-semibold text-ink">
              {group.title}
            </h4>
            <ul className="mt-3 flex flex-col gap-2.5">
              {group.items.map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-p3 text-ink">
                  {item.verification === "requires_verification" ? (
                    <CircleHelp aria-hidden className="mt-0.5 size-4 shrink-0 text-tang-700" />
                  ) : (
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-moss-700" />
                  )}
                  <span className="flex-1">
                    {item.label}
                    {item.verification === "requires_verification" && (
                      <Badge tone="warning" className="ml-2 align-middle">
                        To verify
                      </Badge>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
