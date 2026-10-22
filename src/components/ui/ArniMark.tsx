import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

/* Arni's mark: the DS four-point sparkle ("AI") in an Arnique tile. */
export function ArniMark({ size = "m", className }: { size?: "s" | "m"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-tile bg-arnique-200 text-arnique-900",
        size === "s" ? "size-7" : "size-9",
        className,
      )}
    >
      <Sparkles className={size === "s" ? "size-3.5" : "size-4"} />
    </span>
  );
}
