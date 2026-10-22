"use client";

import { CircleAlert } from "lucide-react";
import { forwardRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

/* Business Input (PRD §12): a large natural-language field. Enter submits, Shift+Enter adds a line. */
interface BusinessInputProps {
  id: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const BusinessInput = forwardRef<HTMLTextAreaElement, BusinessInputProps>(function BusinessInput(
  { id, value, error, onChange, onSubmit },
  ref,
) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-p3 font-medium text-ink">
        Describe your business
      </label>
      <textarea
        ref={ref}
        id={id}
        name="description"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. I want to import cherries and sell them in Dubai."
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : `${id}-helper`}
        maxLength={500}
        className={cn(
          "min-h-36 w-full resize-none rounded-control border-[1.5px] bg-white px-5 py-4 text-p1 text-ink shadow-raised transition-colors",
          "placeholder:text-dusk-600 hover:border-line-hover focus:border-focus focus:outline-none focus-visible:outline-none",
          error ? "border-ruby-500 hover:border-ruby-500 focus:border-ruby-500" : "border-line",
        )}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-p3 text-ruby-700">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : (
        <p id={`${id}-helper`} className="text-p3 text-muted">
          Plain words are fine — no licence terms needed. <span className="hidden md:inline">Press Enter to continue.</span>
        </p>
      )}
    </div>
  );
});
