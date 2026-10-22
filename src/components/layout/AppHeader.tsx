"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useJourney } from "@/context/journey-context";
import { Badge } from "@/components/ui/Badge";
import { Container } from "./Container";
import { JourneySteps } from "./JourneySteps";

/* App Header (PRD §12): logo, minimal navigation, no promotional elements. */
export function AppHeader({ variant = "journey" }: { variant?: "journey" | "hq" }) {
  const router = useRouter();
  const { dispatch } = useJourney();

  function resetDemo() {
    dispatch({ type: "reset" });
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex min-h-11 items-center rounded-control" aria-label="Arnifi — start of the setup journey">
            <Image src="/brand/arnifi-logo.svg" alt="" width={86} height={24} priority />
          </Link>
          {variant === "hq" && (
            <>
              <span aria-hidden className="h-5 w-px bg-line" />
              <span className="text-p2 font-semibold text-heading">HQ</span>
            </>
          )}
        </div>

        {variant === "journey" && (
          <div className="hidden lg:block">
            <JourneySteps />
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Badge tone="neutral">Prototype</Badge>
          </span>
          <button
            type="button"
            onClick={resetDemo}
            className="flex min-h-11 items-center gap-1.5 rounded-control px-2 text-p3 font-medium whitespace-nowrap text-muted transition-colors hover:text-brand"
          >
            <RotateCcw aria-hidden className="size-4" />
            Reset Demo
          </button>
        </div>
      </Container>
      {variant === "journey" && (
        <Container className="pb-2 lg:hidden">
          <JourneySteps />
        </Container>
      )}
    </header>
  );
}
