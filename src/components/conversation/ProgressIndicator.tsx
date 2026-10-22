/* Progress Indicator (PRD C07): "Question 2 of 3" plus a slim bar. */
export function ProgressIndicator({ current, total, complete }: { current: number; total: number; complete: boolean }) {
  const done = complete ? total : current - 1;
  const label = complete ? `All ${total} questions answered` : `Question ${current} of ${total}`;
  return (
    <div>
      <p className="text-p3 font-medium text-muted" aria-live="polite">
        {label}
      </p>
      <div
        role="progressbar"
        aria-label="Questions answered"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="mt-2 flex gap-1.5"
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={
              "h-1.5 flex-1 rounded-full transition-colors " +
              (i < done ? "bg-brand" : i === done && !complete ? "bg-arnique-300" : "bg-line")
            }
          />
        ))}
      </div>
    </div>
  );
}
