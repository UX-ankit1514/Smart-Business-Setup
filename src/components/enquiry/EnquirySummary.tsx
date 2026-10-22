import Link from "next/link";
import { CircleHelp } from "lucide-react";
import type { ReactNode } from "react";
import { getQuestions, answerLabel, locationLabel } from "@/data/questions";
import { formatAED, PRICING_DISCLAIMER } from "@/lib/pricing";
import type { Enquiry } from "@/types";

/* Complete enquiry summary (PRD L02) — everything the founder chose, before contact details are shared. */
export function EnquirySummary({ enquiry }: { enquiry: Enquiry }) {
  const { answers } = enquiry.requirements;
  // Location and the business description have their own rows; the remaining choices are listed as answers.
  const questions = getQuestions(answers).filter((q) => q.kind === "choice" && q.id !== "country" && answers[q.id]);
  const isPackage = enquiry.mode === "package";
  return (
    <section aria-labelledby="summary-heading" className="rounded-panel border border-line bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
        <h2 id="summary-heading" className="text-sh7 font-semibold text-heading">
          Your Requirements
        </h2>
        <Link
          href={isPackage ? "/configure" : "/recommendations"}
          className="inline-flex min-h-11 items-center text-p3 font-medium text-brand underline-offset-4 hover:underline"
        >
          {isPackage ? "Edit package" : "Edit"}
        </Link>
      </div>
      <dl className="divide-y divide-line">
        <Row label="Business description">
          <span className="break-words">{enquiry.requirements.description}</span>
        </Row>
        <Row label="Location">{locationLabel(answers) ?? "Not specified"}</Row>
        {questions.length > 0 && (
          <Row label="Your answers">
            <ul className="flex flex-col gap-1">
              {questions.map((q) => (
                <li key={q.id}>
                  <span className="text-muted">{q.summaryLabel}:</span> {answerLabel(q, answers[q.id])}
                </li>
              ))}
            </ul>
          </Row>
        )}
        <Row label="Suggested jurisdiction">{enquiry.suggestedJurisdiction ?? "To be advised by an expert"}</Row>
        <Row label="Selected package">
          {enquiry.selectedPackage ? (
            <span className="flex flex-wrap justify-between gap-x-4">
              <span>{enquiry.selectedPackage.name}</span>
              <span className="font-medium tabular-nums">{formatAED(enquiry.selectedPackage.demoPrice)}</span>
            </span>
          ) : (
            "None yet — you asked to talk to an expert first"
          )}
        </Row>
        {isPackage && (
          <Row label="Additional services">
            {enquiry.selectedServices.length === 0 ? (
              "None selected"
            ) : (
              <ul className="flex flex-col gap-1">
                {enquiry.selectedServices.map((s) => (
                  <li key={s.id} className="flex flex-wrap justify-between gap-x-4">
                    <span>{s.name}</span>
                    <span className="font-medium tabular-nums">{formatAED(s.demoPrice)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Row>
        )}
        {enquiry.estimatedTotal !== null && (
          <Row label="Estimated cost">
            <span className="flex flex-wrap justify-between gap-x-4">
              <span className="font-semibold">Estimated demo total</span>
              <span className="font-semibold tabular-nums text-heading">{formatAED(enquiry.estimatedTotal)}</span>
            </span>
            <span className="mt-1 block text-p4 text-muted">
              Excludes government and third-party fees. {PRICING_DISCLAIMER}
            </span>
          </Row>
        )}
        <Row label="Needs expert verification">
          <ul className="flex flex-col gap-1.5">
            {enquiry.toVerify.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CircleHelp aria-hidden className="mt-0.5 size-4 shrink-0 text-tang-700" />
                {item}
              </li>
            ))}
          </ul>
        </Row>
      </dl>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 px-6 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
      <dt className="text-p3 text-muted">{label}</dt>
      <dd className="min-w-0 text-p3 text-ink">{children}</dd>
    </div>
  );
}
