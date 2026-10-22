"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { describeAttribution } from "@/lib/attribution";
import { formatAED } from "@/lib/pricing";
import type { Lead } from "@/types";

/* Confirmation (PRD §8, L06–L07): the simulated lead record, clearly marked as not sent. */
export function Confirmation({ lead }: { lead: Lead }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { enquiry } = lead;

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, []);

  const submitted = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.submittedAt));

  return (
    <div className="mx-auto max-w-[45rem]">
      <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-moss-100 text-moss-700">
        <CircleCheck className="size-6" />
      </span>
      <h1 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-l3 text-heading outline-none md:text-l2">
        Your Business Setup Enquiry Is Ready
      </h1>
      <p className="mt-3 text-p1 text-muted">Explore how Arnifi HQ could help you track your company setup after onboarding.</p>

      <Notice tone="info" title="Saved in this prototype only" className="mt-8" role="status">
        This enquiry has not been sent to Arnifi, and no one will contact you. In a live version it would go to an Arnifi
        expert for review.
      </Notice>

      <section aria-labelledby="lead-record" className="mt-6 rounded-panel border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-4">
          <h2 id="lead-record" className="text-sh7 font-semibold text-heading">
            Simulated Lead Record
          </h2>
          <span className="font-mono text-p3 font-medium text-ink">{lead.reference}</span>
        </div>
        <dl className="divide-y divide-line">
          <Row label="Submitted">{submitted}</Row>
          <Row label="Name">{enquiry.contact.fullName}</Row>
          <Row label="Email">{enquiry.contact.email}</Row>
          {enquiry.contact.phone && <Row label="Phone / WhatsApp">{enquiry.contact.phone}</Row>}
          <Row label="Request">{enquiry.selectedPackage ? enquiry.selectedPackage.name : "Expert consultation"}</Row>
          {enquiry.selectedPackage && (
            <Row label="Additional services">
              {enquiry.selectedServices.length ? enquiry.selectedServices.map((s) => s.name).join(", ") : "None"}
            </Row>
          )}
          {enquiry.estimatedTotal !== null && <Row label="Estimated demo total">{formatAED(enquiry.estimatedTotal)}</Row>}
          <Row label="Source">{describeAttribution(enquiry.attribution)}</Row>
        </dl>
      </section>

      <div className="mt-8">
        <ButtonLink href="/hq" arrow size="xl" className="w-full sm:w-auto">
          Explore Arnifi HQ Demo
        </ButtonLink>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 px-6 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
      <dt className="text-p3 text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-p3 text-ink">{children}</dd>
    </div>
  );
}
