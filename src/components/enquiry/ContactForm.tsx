"use client";

import { useRef, useState, type FormEvent } from "react";
import { CircleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { validateContact, type ContactErrors } from "@/lib/validation";
import type { ContactDetails } from "@/types";

/* Collects only name, email and an optional phone (PRD §8), with validation and a clear consent statement. */
interface ContactFormProps {
  contact: ContactDetails;
  submitting: boolean;
  backHref: string;
  backLabel: string;
  onChange: (contact: Partial<ContactDetails>) => void;
  onSubmit: () => void;
}

const FIELD_ORDER: (keyof ContactDetails)[] = ["fullName", "email", "phone"];
const FIELD_NAMES: Record<keyof ContactDetails, string> = { fullName: "Full name", email: "Email address", phone: "Phone / WhatsApp" };

export function ContactForm({ contact, submitting, backHref, backLabel, onChange, onSubmit }: ContactFormProps) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  function change(field: keyof ContactDetails, value: string) {
    onChange({ [field]: value });
    // After the first attempt, errors clear as soon as a field becomes valid.
    if (attempted) setErrors(validateContact({ ...contact, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const found = validateContact(contact);
    setErrors(found);
    setAttempted(true);
    const firstInvalid = FIELD_ORDER.find((f) => found[f]);
    if (firstInvalid) {
      const refs = { fullName: nameRef, email: emailRef, phone: phoneRef };
      refs[firstInvalid].current?.focus();
      return;
    }
    onSubmit();
  }

  const invalid = FIELD_ORDER.filter((f) => errors[f]);

  return (
    <form noValidate onSubmit={handleSubmit} aria-labelledby="contact-heading" className="rounded-panel border border-line bg-white p-6 shadow-raised">
      <h2 id="contact-heading" className="text-sh7 font-semibold text-heading">
        Your Contact Details
      </h2>
      <p className="mt-1 text-p3 text-muted">Only what an Arnifi expert needs to reach you.</p>

      {invalid.length > 0 && (
        <div role="alert" className="mt-5 flex gap-2.5 rounded-control border border-ruby-500 bg-ruby-100 p-3 text-p3 text-ruby-700">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>
            Please check {invalid.length === 1 ? "this field" : `these ${invalid.length} fields`}:{" "}
            {invalid.map((f) => FIELD_NAMES[f]).join(", ")}.
          </p>
        </div>
      )}

      <fieldset disabled={submitting} className="mt-5 flex flex-col gap-5">
        <legend className="sr-only">Contact details</legend>
        <TextField
          ref={nameRef}
          label="Full name"
          required
          autoComplete="name"
          value={contact.fullName}
          error={errors.fullName}
          onChange={(e) => change("fullName", e.target.value)}
        />
        <TextField
          ref={emailRef}
          label="Email address"
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          value={contact.email}
          error={errors.email}
          onChange={(e) => change("email", e.target.value)}
        />
        <TextField
          ref={phoneRef}
          label="Phone / WhatsApp"
          optional
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+971 50 123 4567"
          value={contact.phone}
          error={errors.phone}
          onChange={(e) => change("phone", e.target.value)}
        />
      </fieldset>

      <p className="mt-5 text-p4 text-muted">
        By requesting a consultation, you agree that Arnifi may use these details to contact you about this enquiry.
        In this prototype, your details stay in this browser tab and are not sent to Arnifi.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Button type="submit" arrow fullWidth loading={submitting} disabled={submitting}>
          {submitting ? "Submitting" : "Request Expert Consultation"}
        </Button>
        <ButtonLink href={backHref} variant="tertiary" back fullWidth>
          {backLabel}
        </ButtonLink>
      </div>
    </form>
  );
}
