import type { Metadata } from "next";
import { ConversationScreen } from "@/components/conversation/ConversationScreen";

export const metadata: Metadata = { title: "A Few Quick Questions" };

/* Screen 2 — Guided conversation. */
export default function Page() {
  return <ConversationScreen />;
}
