"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Container } from "@/components/layout/Container";
import { JourneyGate } from "@/components/layout/JourneyGate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useJourney } from "@/context/journey-context";
import { DEMO_EXPERT } from "@/data/contact";
import { answerLabel, locationLabel } from "@/data/questions";
import { track } from "@/lib/analytics";
import { recommendationKey, selectQuestions } from "@/lib/journey";
import { recommend } from "@/lib/recommendation-engine";
import type { OptionId } from "@/types";
import { ExpertContactCard } from "./ExpertContactCard";
import { NoMatch } from "./NoMatch";
import { RecommendationCard } from "./RecommendationCard";

/* Screen 3 — Personalised recommendations. States: loading, suggested, comparison expanded, no confident match. */
export function RecommendationsScreen() {
  return (
    <>
      <AppHeader />
      <main id="main" className="flex-1">
        <JourneyGate screen="recommendations">
          <Recommendations />
        </JourneyGate>
      </main>
      <SiteFooter />
    </>
  );
}

const REVIEW_DELAY_MS = 700;

function Recommendations() {
  const router = useRouter();
  const { state, dispatch } = useJourney();
  const { description, answers } = state;
  const recommendation = useMemo(() => recommend(description, answers), [description, answers]);
  const key = recommendationKey(state);
  // The loading state appears only the first time a given set of answers is reviewed.
  const loading = !state.viewedRecommendations.includes(key);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "markRecommendationViewed", key });
      track("recommendation_viewed", {
        status: recommendation.status,
        activity: recommendation.status === "suggested" ? recommendation.activity.id : null,
        primary: recommendation.status === "suggested" ? recommendation.primary.packageId : null,
      });
    }, REVIEW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [loading, key, recommendation, dispatch]);

  function talkToExpert() {
    dispatch({ type: "setEnquiryMode", mode: "expert" });
    router.push("/enquiry");
  }

  // The package itself lives on arnifi.com; Arni records which one the founder went to look at.
  function viewPackage(optionId: OptionId) {
    if (recommendation.status !== "suggested") return;
    track("package_selected", {
      package: recommendation.activity.packages[optionId],
      choice: optionId === recommendation.primary.id ? "suggested" : "alternative",
      destination: "arnifi.com",
    });
  }

  if (loading) return <ReviewingSkeleton />;

  if (recommendation.status === "no_match") {
    return (
      <Container className="py-12 md:py-16">
        <NoMatch
          reason={recommendation.reason}
          description={state.description}
          location={locationLabel(state.answers)}
          onTalkToExpert={talkToExpert}
        />
      </Container>
    );
  }

  // A skipped (optional) visa question isn't listed.
  const visaQuestion = selectQuestions(state).find((q) => q.id === "visas");
  const visaLabel = visaQuestion && state.answers.visas !== "skipped" ? answerLabel(visaQuestion, state.answers.visas) : null;
  return (
    <Container className="py-10 md:py-14">
      <h1 className="font-serif text-l3 text-heading md:text-l2">Your Business Setup Recommendations</h1>
      <p className="mt-3 max-w-[40rem] text-p1 text-muted">
        Based on your business requirements, here are the options worth exploring.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-p3 text-muted">Based on:</span>
        <Badge tone="neutral" icon={Briefcase}>
          {recommendation.activity.name}
        </Badge>
        <Badge tone="neutral" icon={MapPin}>
          {locationLabel(state.answers)}
        </Badge>
        {visaLabel && <Badge tone="neutral">Visas: {visaLabel}</Badge>}
        <Link href="/discovery" className="ml-1 inline-flex min-h-11 items-center text-p3 font-medium text-brand underline-offset-4 hover:underline">
          Edit my answers
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0">
          <RecommendationCard recommendation={recommendation} description={state.description} onViewPackage={viewPackage} />
        </div>
        <div className="lg:sticky lg:top-24">
          <ExpertContactCard expert={DEMO_EXPERT} onContact={talkToExpert} />
        </div>
      </div>
    </Container>
  );
}

function ReviewingSkeleton() {
  return (
    <Container className="py-10 md:py-14" aria-busy="true">
      <p role="status" className="flex items-center gap-2 text-p3 font-medium text-arnique-900">
        <span className="size-2 animate-pulse rounded-full bg-arnique-700" aria-hidden />
        Arni is reviewing your answers…
      </p>
      <Skeleton className="mt-5 h-10 w-full max-w-xl" />
      <Skeleton className="mt-3 h-5 w-full max-w-md" />
      <div className="mt-8 rounded-panel border border-line p-6 md:p-8">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-4 h-7 w-full max-w-sm" />
        <Skeleton className="mt-3 h-5 w-full max-w-lg" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </Container>
  );
}
