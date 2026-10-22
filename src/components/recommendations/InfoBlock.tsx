import type { LucideIcon } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

/* One of the four recommendation facts, tagged with how certain it is (known vs to verify). */
interface InfoBlockProps {
  icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
  tag: { label: string; tone: BadgeTone };
}

export function InfoBlock({ icon: Icon, label, value, note, tag }: InfoBlockProps) {
  return (
    <div className="flex flex-col gap-2 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-p3 text-muted">
          <Icon aria-hidden className="size-4 shrink-0" />
          {label}
        </p>
        <Badge tone={tag.tone}>{tag.label}</Badge>
      </div>
      <p className="text-p2 font-semibold text-ink">{value}</p>
      {note && <p className="break-words text-p4 text-muted">{note}</p>}
    </div>
  );
}
