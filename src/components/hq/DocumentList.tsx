import { Check, CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DocumentTask } from "@/types";

/* Sample document tasks with a simulated completion action (PRD H03/H04). No files are stored. */
interface DocumentListProps {
  documents: DocumentTask[];
  completedIds: string[];
  onComplete: (id: string) => void;
}

export function DocumentList({ documents, completedIds, onComplete }: DocumentListProps) {
  return (
    <div>
      <ul className="flex flex-col gap-3">
        {documents.map((doc) => {
          const done = completedIds.includes(doc.id);
          return (
            <li key={doc.id} className="flex flex-col gap-3 rounded-card border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-p3 font-semibold text-ink">{doc.name}</p>
                <p className="mt-0.5 text-p3 text-muted">{doc.detail}</p>
              </div>
              {done ? (
                <Badge tone="success" icon={CircleCheck} className="self-start sm:self-center">
                  Completed
                </Badge>
              ) : (
                <Button
                  variant="secondary"
                  size="m"
                  icon={Check}
                  onClick={() => onComplete(doc.id)}
                  aria-label={`Mark ${doc.name} as complete (simulated)`}
                  data-document-action
                  className="shrink-0"
                >
                  Mark as Complete
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-p4 text-muted">Simulated — nothing is uploaded, stored or verified in this demo.</p>
    </div>
  );
}
