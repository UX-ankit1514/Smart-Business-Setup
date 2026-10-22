import { Pencil } from "lucide-react";
import { answerLabel } from "@/data/questions";
import type { Answers, Question } from "@/types";
import { cn } from "@/lib/cn";

/* Previously answered questions stay visible and editable (PRD C04, C05). */
interface AnsweredListProps {
  questions: Question[];
  answers: Answers;
  activeIndex: number;
  onEdit: (index: number) => void;
  disabled?: boolean;
}

export function AnsweredList({ questions, answers, activeIndex, onEdit, disabled }: AnsweredListProps) {
  const answered = questions.map((q, index) => ({ q, index, label: answerLabel(q, answers[q.id]) })).filter((a) => a.label);
  if (answered.length === 0) return null;
  return (
    <section aria-labelledby="your-answers" className="mt-10">
      <h2 id="your-answers" className="text-sh8 font-semibold text-ink">
        Your answers
      </h2>
      <ul className="mt-3 divide-y divide-line rounded-card border border-line">
        {answered.map(({ q, index, label }) => {
          const editing = index === activeIndex;
          return (
            <li key={q.id} className={cn("flex items-center justify-between gap-4 px-4 py-3", editing && "bg-arnique-100")}>
              <div className="min-w-0">
                <p className="text-p4 text-muted">{q.summaryLabel}</p>
                <p className="break-words text-p3 font-medium text-ink">{label}</p>
              </div>
              {editing ? (
                <span className="text-p3 font-medium text-arnique-900">Editing</span>
              ) : (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onEdit(index)}
                  className="flex min-h-11 items-center gap-1.5 rounded-control px-2 text-p3 font-medium text-brand hover:text-brand-hover disabled:text-dusk-600"
                >
                  <Pencil aria-hidden className="size-3.5" />
                  Edit<span className="sr-only"> {q.summaryLabel.toLowerCase()}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
