import type { Metadata } from "next";
import { ConfigureScreen } from "@/components/packages/ConfigureScreen";

export const metadata: Metadata = { title: "Configure Your Package" };

/* Screen 4 — Package configuration & services. */
export default function Page() {
  return <ConfigureScreen />;
}
