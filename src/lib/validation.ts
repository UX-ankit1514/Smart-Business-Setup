import type { ContactDetails } from "@/types";

export const MIN_DESCRIPTION_LENGTH = 3;

export function validateDescription(description: string): string | null {
  const text = description.trim();
  if (!text) return "Tell Arni about your business to continue.";
  if (text.length < MIN_DESCRIPTION_LENGTH) return "Add a few more words about your business.";
  return null;
}

export type ContactErrors = Partial<Record<keyof ContactDetails, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(contact: ContactDetails): ContactErrors {
  const errors: ContactErrors = {};
  if (contact.fullName.trim().length < 2) errors.fullName = "Enter your full name";
  if (!contact.email.trim()) errors.email = "Enter your email address";
  else if (!EMAIL.test(contact.email.trim())) errors.email = "Enter a valid email address, like name@example.com";
  const phone = contact.phone.trim();
  if (phone) {
    const digits = phone.replace(/[\s()-]/g, "");
    if (!/^\+?\d{7,15}$/.test(digits)) errors.phone = "Enter a valid number with country code, like +971 50 123 4567";
  }
  return errors;
}
