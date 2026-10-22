import type { Metadata } from "next";
import { HqScreen } from "@/components/hq/HqScreen";

export const metadata: Metadata = { title: "Arnifi HQ Demo" };

/* Screen 6 — Arnifi HQ dashboard preview. */
export default function Page() {
  return <HqScreen />;
}
