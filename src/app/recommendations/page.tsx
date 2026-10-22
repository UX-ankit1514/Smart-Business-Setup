import type { Metadata } from "next";
import { RecommendationsScreen } from "@/components/recommendations/RecommendationsScreen";

export const metadata: Metadata = { title: "Your Business Setup Recommendations" };

/* Screen 3 — Personalised recommendations. */
export default function Page() {
  return <RecommendationsScreen />;
}
