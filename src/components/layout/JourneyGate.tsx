"use client";

import { Fragment, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useJourney } from "@/context/journey-context";
import { requiredRoute } from "@/lib/journey";
import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "./Container";

type Screen = Parameters<typeof requiredRoute>[1];

/*
 * Renders a screen once the session has been read. If the founder lands on a step whose prerequisites
 * are missing (e.g. a bookmarked /configure), they're sent to the earliest unfinished step — no dead ends.
 *
 * Next.js keeps recently visited routes alive (React <Activity>), so local screen state would survive
 * navigation. Keying on `bfcacheId` starts each screen fresh from the journey store on a forward
 * navigation, while browser back/forward still restores it as it was.
 */
export function JourneyGate({ screen, children }: { screen?: Screen; children: ReactNode }) {
  const router = useRouter();
  const { state, hydrated } = useJourney();
  const redirect = hydrated && screen ? requiredRoute(state, screen) : null;

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  if (!hydrated || redirect) return <PageSkeleton />;
  return <Fragment key={router.bfcacheId}>{children}</Fragment>;
}

export function PageSkeleton() {
  return (
    <Container className="py-12 md:py-16" aria-busy="true">
      <span className="sr-only">Loading your setup journey</span>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-10 w-full max-w-xl" />
      <Skeleton className="mt-3 h-5 w-full max-w-md" />
      <Skeleton className="mt-10 h-48 w-full" />
    </Container>
  );
}
