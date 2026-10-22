import { Container } from "./Container";

/* Makes the simulated nature of the prototype explicit on every screen (PRD §16 data safety). */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <Container>
        <p className="border-t border-line py-6 text-p4 text-muted">
          Prototype for demonstration. Prices and company details are fictional, recommendations are simulated, and
          nothing you enter leaves this browser tab.
        </p>
      </Container>
    </footer>
  );
}
