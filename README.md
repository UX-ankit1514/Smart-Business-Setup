# Arni — Guided Business Setup (MVP prototype)

An interactive prototype of the Arni AI guided business setup experience for Arnifi: a founder describes their
business, answers three short questions (where, what, visas), sees a personalised setup recommendation, continues
to the matching package on arnifi.com or contacts an Arnifi expert, and previews Arnifi HQ. The full product requirements are in [`MVP.md`](./MVP.md); build decisions are in its
Appendix A.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4 and Lucide, following the Arnifi Design System
(Lora + Inter, Arnique / Dusk / Dawn tokens, 2px CTAs with arrow segment, 4px fields).

## Run it

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build: `npm run build && npm start`.

### Single HTML file

`arni-mvp-prototype.html` is the whole prototype in one self-contained file (≈ 460 KB): double-click it to open
it in a browser — no server, no install, nothing loaded from the internet. For the ChatGPT ad entry, add
`#/?utm_source=chatgpt&utm_medium=paid` to the file's address. Screens use hash URLs (`…html#/recommendations`).

Rebuild it after code changes with `npm run build:html`. It bundles the same screen components with Vite
(`standalone/` holds the hash router and small stand-ins for `next/link`, `next/navigation` and `next/image`),
reuses the exact stylesheet from the Next.js build, and embeds the fonts, logo and favicon.

## Demo script (≈ 5 minutes)

1. **ChatGPT ad entry** — open `http://localhost:3000/?utm_source=chatgpt&utm_medium=paid`. It's the normal
   discovery screen; the source is stored for the session.
2. **Start screen** — type *"I want to import cherries from India and sell them in Dubai."* and press Enter
   (or click an example prompt).
3. **Guided questions** — *Where do you want to set up your business?* → **United Arab Emirates**. *What kind of
   business are you planning to start?* is prefilled with your description → **Continue**. The visa question is
   optional → **Yes** (or **Skip this question**). Use **Back** or **Edit** to change an answer.
4. **Recommendations** — Dubai Mainland — Trading Licence. Open *Why this recommendation?*, *View Requirements* and
   *Compare with Free Zone*. **View UAE Packages on Arnifi** opens arnifi.com in a new tab. Try **Edit my answers** →
   edit *Business* to *"I want to import cherries and sell them online"*: the suggestion becomes a Free Zone.
5. **Contact an Arnifi Expert** — the side card shows the (demo) relationship manager with phone and email; its button
   opens the enquiry. Submit empty to see validation, then enter a name and email. The confirmation shows the
   simulated lead record with *Source: ChatGPT · paid*.
6. **Arnifi HQ** — click **View Tasks** in the Arni panel, then **Mark as Complete** on both sample documents: the
   task card and application progress update.

Other paths worth showing:

| Try | What happens |
|---|---|
| *"I want to open a yoga studio"* | No confident match → expert consultation, no packages shown |
| *"I want to start a business"* | The business question starts empty, with everyday examples to pick from |
| *I want to open a consulting company* | Dubai Mainland — Professional Licence, linked to its Arnifi package page |
| **Outside the UAE** (+ *Saudi Arabia*) | Visa question skipped; Arni hands over to an expert and Arnifi's country listing |
| **Reset Demo** (header) | Clears the session and starts over |

## What is simulated

This is a UX prototype. Nothing is connected to a live system.

- **Recommendations** come from a small deterministic rules engine (`src/lib/recommendation-engine.ts`) over local
  mock data (`src/data/`). It recognises five activities: fresh fruit, foodstuff, e-commerce trading, general trading
  and management consultancy. Sourcing and sales channel are no longer asked: the engine reads words like *import*,
  *online* or *supermarkets* from the description, and says so plainly when they aren't mentioned (Mainland is the
  default, import approvals stay "To verify"). Anything unrecognised, or outside the UAE, gets the expert path. It is
  not an authoritative UAE licensing engine.
- **Prices** are fictional demo values (Dubai Mainland Trading Package AED 24,000; others in `MVP.md` Appendix A2).
  Government and third-party fees are never priced. Prices on arnifi.com differ.
- **Arnifi links** (`src/data/packages.ts`) are real arnifi.com pages: the Dubai Mainland professional licence page
  for consultancies, otherwise Arnifi's UAE licence listing (no single page matches the demo trading or free zone
  packages). Outside the UAE links to Arnifi's all-countries listing.
- **The relationship manager** (John Smith, `src/data/contact.ts`) is placeholder demo data — replace it with a real
  Arnifi contact before live use.
- **Package configuration** (`/configure`) is no longer part of the journey — packages continue on arnifi.com. The
  screen's code is kept.
- **The enquiry** is saved only in the browser tab (`sessionStorage`) and is never sent to Arnifi.
- **Arnifi HQ** shows a fictional company; document completion is simulated and no deadlines are real.
- **Analytics** events are stored locally. Inspect them in the browser console:
  `JSON.parse(sessionStorage.getItem("arni:events"))`.
- Journey progress lasts for the browser session (closing the tab clears it).

## Code map

```
src/app/              routes: / · /discovery · /recommendations · /configure · /enquiry · /hq
src/components/       ui/ (DS primitives) · layout/ · one folder per screen
src/context/          journey-context.tsx — one shared journey store over sessionStorage
src/data/             activities, packages, services, questions, demo company (mock data)
src/lib/              recommendation-engine, pricing, journey (reducer + selectors), analytics, attribution, validation
src/app/globals.css   Arnifi Design System tokens as Tailwind theme values
standalone/           entry + hash router for the single-file build (scripts/build-html.mjs)
```

The engine and pricing are plain TypeScript with no React, so they can be replaced by real APIs later.

## Checks

```bash
npm run typecheck
npm run lint
npm test             # unit tests: recommendation engine and pricing
npm run test:e2e     # PRD §17 acceptance tests at 1440, 768 and 390 px (uses the installed Google Chrome)
```
