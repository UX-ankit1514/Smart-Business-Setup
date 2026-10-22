"use client";

import { useRef, useState } from "react";
import { CalendarClock, CircleCheck, FileText, TriangleAlert } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Container } from "@/components/layout/Container";
import { JourneyGate } from "@/components/layout/JourneyGate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { useJourney } from "@/context/journey-context";
import { DEMO_COMPANY } from "@/data/demo-company";
import { track } from "@/lib/analytics";
import type { ApplicationStep } from "@/types";
import { ArniAssistantPanel } from "./ArniAssistantPanel";
import { CompanyCard } from "./CompanyCard";
import { DocumentList } from "./DocumentList";
import { StatusIndicator } from "./StatusIndicator";
import { TaskCard } from "./TaskCard";

/* Screen 6 — Arnifi HQ preview. States: tasks pending, sample task completed, progress updated (PRD §13). */
export function HqScreen() {
  return (
    <>
      <AppHeader variant="hq" />
      <main id="main" className="flex-1">
        <JourneyGate>
          <Dashboard />
        </JourneyGate>
      </main>
      <SiteFooter />
    </>
  );
}

function Dashboard() {
  const { state, dispatch } = useJourney();
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const documentsHeading = useRef<HTMLHeadingElement>(null);

  const { company, documentTasks, complianceTasks } = DEMO_COMPANY;
  const completed = state.hq.completedDocIds;
  const pending = documentTasks.filter((d) => !completed.includes(d.id)).length;
  const steps = applicationSteps(pending === 0);
  const renewal = complianceTasks[0];

  function completeDocument(docId: string) {
    dispatch({ type: "completeDocument", docId });
    track("hq_task_completed", { task: docId, remaining: pending - 1 });
  }

  // Arni opens the relevant section and moves focus there (PRD H07).
  function viewTasks() {
    setDocumentsOpen(true);
    requestAnimationFrame(() => {
      document.getElementById("documents")?.scrollIntoView({ behavior: "smooth", block: "start" });
      documentsHeading.current?.focus({ preventScroll: true });
    });
  }

  return (
    <Container className="py-10 md:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-l3 text-heading md:text-l2">Welcome to Arnifi HQ</h1>
        <Badge tone="neutral">Sample data</Badge>
      </div>
      <p className="mt-3 max-w-[40rem] text-p1 text-muted">
        A preview of how you could track your company setup in one place after onboarding.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr]">
        <div className="lg:col-start-2 lg:row-start-1">
          <ArniAssistantPanel
            pendingTasks={pending}
            dismissed={state.hq.assistantDismissed}
            onViewTasks={viewTasks}
            onDismiss={() => dispatch({ type: "setAssistantDismissed", dismissed: true })}
            onReopen={() => dispatch({ type: "setAssistantDismissed", dismissed: false })}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <CompanyCard company={company} />
          <StatusIndicator steps={steps} />
          <TaskCard
            id="documents"
            eyebrow="Documents"
            icon={FileText}
            title={pending === 0 ? "All documents complete" : `${pending} ${pending === 1 ? "document requires" : "documents require"} attention`}
            status={pending === 0 ? { label: "Complete", tone: "success", icon: CircleCheck } : { label: "Action needed", tone: "warning", icon: TriangleAlert }}
            actionLabel="View Requirements"
            open={documentsOpen}
            onOpenChange={setDocumentsOpen}
            headingRef={documentsHeading}
          >
            <DocumentList documents={documentTasks} completedIds={completed} onComplete={completeDocument} />
          </TaskCard>
        </div>

        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2 lg:self-start">
          <TaskCard
            id="compliance"
            eyebrow="Upcoming Compliance"
            icon={CalendarClock}
            title={renewal.name}
            status={{ label: renewal.status, tone: "neutral" }}
            actionLabel="View Details"
            open={complianceOpen}
            onOpenChange={setComplianceOpen}
          >
            <p className="text-p3 text-ink">{renewal.detail}</p>
            <p className="mt-3 text-p4 text-muted">Sample task — this is not a real deadline or compliance obligation.</p>
          </TaskCard>
          {state.lead && (
            <ButtonLink href="/enquiry" variant="text" back>
              Back to My Enquiry
            </ButtonLink>
          )}
        </div>
      </div>
    </Container>
  );
}

/** Completing every sample document moves the application on a step (PRD H05). */
function applicationSteps(documentsDone: boolean): ApplicationStep[] {
  return DEMO_COMPANY.applicationSteps.map((step) => {
    if (!documentsDone) return step;
    if (step.id === "documents") return { ...step, status: "completed" };
    if (step.id === "processing") return { ...step, status: "in_progress" };
    return step;
  });
}
