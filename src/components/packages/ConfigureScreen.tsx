"use client";

import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Container } from "@/components/layout/Container";
import { JourneyGate } from "@/components/layout/JourneyGate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { useJourney } from "@/context/journey-context";
import { track } from "@/lib/analytics";
import { selectEstimate, selectPackage, selectRecommendation } from "@/lib/journey";
import { orderServices } from "@/lib/pricing";
import type { ServiceId } from "@/types";
import { MobileSummaryBar } from "./MobileSummaryBar";
import { PackageCard } from "./PackageCard";
import { PriceSummary } from "./PriceSummary";
import { ServiceCard } from "./ServiceCard";

/* Screen 4 — Package configuration. States: no add-ons, add-on selected, removed, recalculated total. */
export function ConfigureScreen() {
  return (
    <>
      <AppHeader />
      <main id="main" className="flex-1">
        <JourneyGate screen="configure">
          <Configure />
        </JourneyGate>
      </main>
      <SiteFooter className="pb-28 lg:pb-0" />
    </>
  );
}

function Configure() {
  const router = useRouter();
  const { state, dispatch } = useJourney();
  const pkg = selectPackage(state);
  const estimate = selectEstimate(state);
  const recommendation = selectRecommendation(state);
  if (!pkg || !estimate || recommendation.status !== "suggested") return null;

  const services = orderServices(recommendation.serviceEmphasis, state.answers.visas);
  const checks = recommendation.checksToVerify;

  function toggle(serviceId: ServiceId) {
    const adding = !state.selectedServiceIds.includes(serviceId);
    dispatch({ type: "toggleService", serviceId });
    track(adding ? "service_added" : "service_removed", { service: serviceId, package: pkg!.id });
  }

  function continueToEnquiry() {
    dispatch({ type: "setEnquiryMode", mode: "package" });
    router.push("/enquiry");
  }

  return (
    <Container className="py-10 md:py-14">
      <ButtonLink href="/recommendations" variant="text" back>
        Back to Recommendations
      </ButtonLink>
      <h1 className="mt-4 font-serif text-l3 text-heading md:text-l2">Configure Your Package</h1>
      <p className="mt-3 max-w-[40rem] text-p1 text-muted">
        Review what&apos;s included, then add only the services that are relevant to your business.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-8">
          <PackageCard pkg={pkg} />

          <Notice tone="warning" title="Requirements to verify — not part of this estimate">
            <ul className="mt-2 flex flex-col gap-2">
              {checks.map((check) => (
                <li key={check.title}>
                  <span className="font-medium text-ink">{check.title}:</span> {check.detail}
                </li>
              ))}
            </ul>
          </Notice>

          <section aria-labelledby="services-title">
            <h2 id="services-title" className="text-sh6 font-semibold text-heading">
              Services you may also need
            </h2>
            <p className="mt-1 text-p2 text-muted">Choose the services that are relevant to your business.</p>
            <div className="mt-5 flex flex-col gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={state.selectedServiceIds.includes(service.id)}
                  emphasis={recommendation.serviceEmphasis[service.id]}
                  onToggle={() => toggle(service.id)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="hidden lg:sticky lg:top-24 lg:block">
          <PriceSummary estimate={estimate} onContinue={continueToEnquiry} />
        </div>
      </div>

      <MobileSummaryBar estimate={estimate} onContinue={continueToEnquiry} />
    </Container>
  );
}
