import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import { JourneyProvider } from "@/context/journey-context";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Arni — Guided Business Setup | Arnifi", template: "%s | Arni by Arnifi" },
  description: "Describe your business and let Arni guide you to suitable UAE company setup options. Prototype.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${lora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JourneyProvider>{children}</JourneyProvider>
      </body>
    </html>
  );
}
