import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/* Choice Button (PRD §12): single-choice answer. Selection shows a check and border, never colour alone. */
interface ChoiceButtonProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export function ChoiceButton({ label, selected, disabled, onSelect }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 rounded-control border-[1.5px] px-4 py-3 text-left text-p2 font-medium transition-colors",
        selected
          ? "border-brand bg-arnique-100 text-arnique-1000"
          : "border-line bg-white text-ink hover:border-arnique-500 hover:bg-arnique-100/60",
        disabled && !selected && "opacity-60",
        "disabled:cursor-default",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors",
          selected ? "border-brand bg-brand text-white" : "border-dusk-500 bg-white",
        )}
      >
        {selected && <Check className="size-3" strokeWidth={3} />}
      </span>
      <span>{label}</span>
    </button>
  );
}
