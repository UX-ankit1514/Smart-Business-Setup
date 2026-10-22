/*
 * Entry for the single-file HTML build (`npm run build:html`). Renders the same screens as the
 * Next.js app, routed by URL hash so the file works without a server.
 */
import { StrictMode, useEffect, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { ConfigureScreen } from "@/components/packages/ConfigureScreen";
import { ConversationScreen } from "@/components/conversation/ConversationScreen";
import { DiscoveryScreen } from "@/components/discovery/DiscoveryScreen";
import { EnquiryScreen } from "@/components/enquiry/EnquiryScreen";
import { HqScreen } from "@/components/hq/HqScreen";
import { RecommendationsScreen } from "@/components/recommendations/RecommendationsScreen";
import { JourneyProvider } from "@/context/journey-context";
import { captureAttribution } from "@/lib/attribution";
import { navigate } from "./router";
import { usePathname } from "./shims/navigation";

const ROUTES: Record<string, { screen: ComponentType; title: string }> = {
  "/": { screen: DiscoveryScreen, title: "Arni — Guided Business Setup | Arnifi" },
  "/discovery": { screen: ConversationScreen, title: "A Few Quick Questions | Arni by Arnifi" },
  "/recommendations": { screen: RecommendationsScreen, title: "Your Business Setup Recommendations | Arni by Arnifi" },
  "/configure": { screen: ConfigureScreen, title: "Configure Your Package | Arni by Arnifi" },
  "/enquiry": { screen: EnquiryScreen, title: "Request Expert Consultation | Arni by Arnifi" },
  "/hq": { screen: HqScreen, title: "Arnifi HQ Demo | Arni by Arnifi" },
};

// Campaign parameters may sit in the hash when the file is opened from disk: "#/?utm_source=chatgpt&utm_medium=paid".
const hashQuery = window.location.hash.split("?")[1];
if (hashQuery) captureAttribution(hashQuery, "/");

function App() {
  const path = usePathname();
  const route = ROUTES[path];

  useEffect(() => {
    if (route) document.title = route.title;
    else navigate("/", { replace: true });
  }, [route]);

  if (!route) return null;
  const Screen = route.screen;
  return <Screen />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JourneyProvider>
      <App />
    </JourneyProvider>
  </StrictMode>,
);
