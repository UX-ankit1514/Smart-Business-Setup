import { AppHeader } from "@/components/layout/AppHeader";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <AppHeader variant="hq" />
      <main id="main" className="flex-1">
        <Container className="py-16">
          <h1 className="font-serif text-l3 text-heading">We couldn&apos;t find that page</h1>
          <p className="mt-3 text-p1 text-muted">Let&apos;s get you back to your business setup.</p>
          <ButtonLink href="/" arrow className="mt-8">
            Start Your Setup
          </ButtonLink>
        </Container>
      </main>
    </>
  );
}
