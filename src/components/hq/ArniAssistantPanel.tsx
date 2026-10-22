import { ArniMark } from "@/components/ui/ArniMark";
import { Button } from "@/components/ui/Button";

/* Arni Assistant Panel (PRD §9): a small contextual prompt that takes the founder to outstanding tasks (H07). */
interface ArniAssistantPanelProps {
  pendingTasks: number;
  dismissed: boolean;
  onViewTasks: () => void;
  onDismiss: () => void;
  onReopen: () => void;
}

const COUNT_WORDS = ["no", "one", "two", "three"];

export function ArniAssistantPanel({ pendingTasks, dismissed, onViewTasks, onDismiss, onReopen }: ArniAssistantPanelProps) {
  if (dismissed) {
    return (
      <aside aria-label="Arni assistant" className="flex items-center justify-between gap-3 rounded-panel border border-line bg-white p-4">
        <div className="flex items-center gap-3">
          <ArniMark size="s" />
          <p className="text-p3 text-muted">Arni is here when you need help.</p>
        </div>
        <Button variant="text" onClick={onReopen}>
          Ask Arni
        </Button>
      </aside>
    );
  }

  const count = COUNT_WORDS[pendingTasks] ?? String(pendingTasks);
  return (
    <aside aria-label="Arni assistant" className="rounded-panel border border-arnique-200 bg-tint p-5">
      <div className="flex items-center gap-2.5">
        <ArniMark size="s" />
        <p className="text-p3 font-semibold text-ink">Arni</p>
      </div>
      <p className="mt-3 text-p2 text-ink" aria-live="polite">
        {pendingTasks === 0
          ? "Both sample documents are marked complete. In a live version, Arnifi would now review them for you."
          : `You have ${count} outstanding setup ${pendingTasks === 1 ? "task" : "tasks"}. Would you like to review ${pendingTasks === 1 ? "it" : "them"}?`}
      </p>
      {pendingTasks > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="m" onClick={onViewTasks}>
            View Tasks
          </Button>
          <Button size="m" variant="tertiary" onClick={onDismiss}>
            Not Now
          </Button>
        </div>
      )}
    </aside>
  );
}
