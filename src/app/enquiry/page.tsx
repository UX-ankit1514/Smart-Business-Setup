import type { Metadata } from "next";
import { EnquiryScreen } from "@/components/enquiry/EnquiryScreen";

export const metadata: Metadata = { title: "Request Expert Consultation" };

/* Screen 5 — Enquiry submission & confirmation. */
export default function Page() {
  return <EnquiryScreen />;
}
