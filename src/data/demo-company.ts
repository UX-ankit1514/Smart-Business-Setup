import type { CompanyDashboard } from "@/types";

/** Fictional company for the Arnifi HQ preview (PRD §9). Nothing here is a real record or deadline. */
export const DEMO_COMPANY: CompanyDashboard = {
  company: {
    name: "Rahul Fresh Produce Trading",
    location: "Dubai, UAE",
    status: "Setup in progress",
    activity: "Fresh fruit trading",
    packageName: "Dubai Mainland Trading Package",
  },
  applicationSteps: [
    { id: "requirements", label: "Requirements submitted", status: "completed" },
    { id: "package", label: "Package selected", status: "completed" },
    { id: "documents", label: "Documents submitted", status: "pending" },
    { id: "processing", label: "Application processing", status: "not_started" },
    { id: "licence", label: "Licence issued", status: "not_started" },
  ],
  documentTasks: [
    { id: "passport", name: "Passport copy — shareholder", detail: "A clear colour copy of Rahul's passport." },
    { id: "address", name: "Proof of residential address", detail: "A recent utility bill or bank statement." },
  ],
  complianceTasks: [
    {
      id: "licence-renewal",
      name: "Licence Renewal",
      status: "Not due yet",
      detail:
        "Your renewal date is set once your licence is issued. Arnifi HQ would remind you well ahead of time and help you prepare.",
    },
  ],
};
