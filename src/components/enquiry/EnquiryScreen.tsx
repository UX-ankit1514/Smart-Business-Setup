"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Container } from "@/components/layout/Container";
import { JourneyGate } from "@/components/layout/JourneyGate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Notice } from "@/components/ui/Notice";
import { useJourney } from "@/context/journey-context";
import { track } from "@/lib/analytics";
import { buildEnquiry, createLeadReference, journeyFingerprint } from "@/lib/journey";
import type { Lead } from "@/types";
import { Confirmation } from "./Confirmation";
import { ContactForm } from "./ContactForm";
import { EnquirySummary } from "./EnquirySummary";

/* Screen 5 — Enquiry. States: empty form, validation error, submitting, confirmation (PRD §13). */
export function EnquiryScreen() {
  return (
    <>
      <AppHeader />
      <main id="main" className="flex-1">
        <JourneyGate screen="enquiry">
          <EnquiryFlow />
        </JourneyGate>
      </main>
      <SiteFooter />
    </>
  );
}

const SUBMIT_DELAY_MS = 900;

function EnquiryFlow() {
  const { state, dispatch } = useJourney();
  const [submitting, setSubmitting] = useState(false);
  const fingerprint = journeyFingerprint(state);
  const enquiry = useMemo(() => buildEnquiry(state), [state]);
  // The same journey is only ever submitted once (PRD L03); a changed journey can be submitted again.
  const alreadySubmitted = state.lead?.journeyFingerprint === fingerprint;

  if (alreadySubmitted && state.lead) {
    return (
      <Container className="py-12 md:py-16">
        <Confirmation lead={state.lead} />
      </Container>
    );
  }

  function submit() {
    if (submitting) return;
    setSubmitting(true);
    // Simulated submission — the lead is stored in this browser session only.
    window.setTimeout(() => {
      const lead: Lead = {
        reference: createLeadReference(),
        submittedAt: new Date().toISOString(),
        journeyFingerprint: fingerprint,
        enquiry,
      };
      dispatch({ type: "submitLead", lead });
      track("lead_submitted", {
        reference: lead.reference,
        mode: enquiry.mode,
        package: enquiry.selectedPackage?.id ?? null,
        services: enquiry.selectedServices.length,
        estimated_total: enquiry.estimatedTotal,
      });
      setSubmitting(false);
    }, SUBMIT_DELAY_MS);
  }

  const isPackage = enquiry.mode === "package";

  return (
    <Container className="py-10 md:py-14">
      <h1 className="font-serif text-l3 text-heading md:text-l2">You&apos;re ready for the next step</h1>
      <p className="mt-3 max-w-[40rem] text-p1 text-muted">
        Check your requirements and share how to reach you. An Arnifi expert would use this to prepare your consultation.
      </p>

      {state.lead && (
        <Notice tone="brand" className="mt-6 max-w-[45rem]">
          Your requirements changed after enquiry {state.lead.reference}. Submit again to update it.
        </Notice>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <EnquirySummary enquiry={enquiry} />
        <div className="lg:sticky lg:top-24">
          <ContactForm
            contact={state.contact}
            submitting={submitting}
            backHref={isPackage ? "/configure" : "/recommendations"}
            backLabel={isPackage ? "Back to Package" : "Back to Recommendations"}
            onChange={(contact) => dispatch({ type: "updateContact", contact })}
            onSubmit={submit}
          />
        </div>
      </div>
    </Container>
  );
}
