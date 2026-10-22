# MVP — Arni AI Guided Business Setup Experience

**Product Requirements Document (PRD)**

| | |
|---|---|
| Product | Arnifi / Arni Assistant |
| Version | MVP 1.0 |
| Platform | Responsive Web Application |
| Implementation | Claude Code |
| Purpose | Interactive, functional MVP for stakeholder presentation and usability testing |
| Source | `~/Documents/mvp prd.rtf` (converted to Markdown; wording kept, tables rebuilt) |

---

## 1. Product Overview

### What are we building?

An improved version of Arni Assistant that helps founders go from a business idea to finding a suitable company
setup package, understanding costs, selecting additional services, and managing their business through Arnifi HQ.

The experience should feel like a knowledgeable business setup consultant, not a traditional chatbot.

Arnifi already offers Arni Assistant, a cost calculator, package comparison, accounting services, and Arnifi HQ.
The MVP should demonstrate how these existing capabilities could work together as one guided experience, rather
than recreate them as separate products.

---

## 2. Business Objectives

| Business goal | Product solution | Success metric |
|---|---|---|
| Increase conversion | Guided AI discovery and package recommendations | Visitor-to-qualified-lead conversion |
| Increase Average Order Value (AOV) | Relevant service recommendations | Services per order and AOV |
| Increase retention | Arnifi HQ integration for ongoing tasks | Customer renewal rate |
| Improve lead quality | Understand business requirements before consultation | Qualified leads / total leads |
| Reduce drop-offs | Simplified questions and transparent information | Journey completion rate |

**Primary MVP objective:** Validate whether a guided business setup experience makes it easier for founders to
discover suitable packages and submit a qualified enquiry.

Conversion, AOV, and retention improvements are hypotheses to test — not guaranteed outcomes.

---

## 3. MVP Scope

Build one complete, interactive user journey with six screens:

1. AI Business Discovery
2. Guided Conversation
3. Personalised Recommendations
4. Package Configuration & Upselling
5. Enquiry Submission & Confirmation
6. Arnifi HQ Dashboard Preview

Include a simulated ChatGPT Ads entry point through a tracking URL.

> **Important:** This is a working UX prototype. Use realistic sample data, functioning interactions, and simulated
> backend responses. Do not connect real payments, government portals, customer databases, or external AI services
> in the first version.

---

## 4. Target User & Real-Life Scenario

**Primary user:** First-time founder

| | |
|---|---|
| Name | Rahul (fictional) |
| Location | India |
| Business idea | Import fresh cherries and sell them in Dubai |

**User problem:** Rahul doesn't understand UAE business licences, jurisdictions, company registration costs, or
additional approvals. He wants to know:

- Can I start this business?
- Which business licence do I need?
- How much will it cost?
- What documents and approvals are required?
- How can Arnifi help me complete the process?

**Expected experience:** Rahul describes his business in everyday language. Arni understands his requirements,
asks relevant questions, and guides him toward suitable company setup options. The user should never need to
understand complicated licensing terminology before starting.

---

## 5. Complete User Flow

```
ENTRY POINT
ChatGPT Sponsored Ad / Arnifi Website
                |
                v
SCREEN 1: AI BUSINESS DISCOVERY
User describes their business
                |
                v
SCREEN 2: GUIDED CONVERSATION
Arni asks relevant questions
                |
                v
SCREEN 3: PERSONALISED RECOMMENDATIONS
Suggested licence + jurisdiction
Requirements + comparison
                |
                v
SCREEN 4: PACKAGE CONFIGURATION
Select package
Add relevant services
See estimated total
                |
                v
SCREEN 5: ENQUIRY SUBMISSION
Submit requirements
Receive confirmation
                |
                v
SCREEN 6: ARNIFI HQ PREVIEW
Track applications
View documents
See renewal requirements
```

**UX requirement:** Users should feel they are completing one continuous journey, not being redirected between
unrelated tools.

---

## 6. Screen-by-Screen Product Requirements

### Screen 1 — AI Business Discovery

**Objective:** Help founders describe their business without knowing which licence to select.

**UI requirements**

- Header: Arnifi logo · Minimal navigation · No distracting promotional elements
- Main section
  - Heading: *What business are you planning to start?*
  - Supporting text: *Tell Arni about your business, and we'll help you explore suitable setup options.*
  - Large input field: *e.g. I want to import cherries and sell them in Dubai.*
  - Primary CTA: **Find My Business Setup →**
  - Below the input, three example prompts: *Start a food trading business* · *Set up a consulting company* ·
    *Launch an online store*

**Functional requirements**

| ID | Requirement |
|---|---|
| D01 | User can enter a business description using natural language. |
| D02 | Input must not be empty. |
| D03 | User can click example prompts to populate the input. |
| D04 | Clicking the primary CTA starts guided discovery. |
| D05 | Preserve the entered description when navigating back. |
| D06 | Capture incoming URL campaign parameters for attribution. |

**Microinteractions:** Input border highlights on focus · CTA becomes enabled after valid input · Enter submits the
description · Show a brief loading state when advancing.

**User psychology:** Before: "I don't know which licence I need." → After: "I can just explain my business."

**Business metric:** Discovery start rate.

---

### Screen 2 — Guided AI Conversation

**Objective:** Understand the founder's requirements through a short conversation.

**Layout:** Use a clean conversational interface. Left/main area: Arni conversation. Top: small progress indicator.
Bottom: selectable answers and navigation controls. Avoid designing a traditional chatbot with excessive message
bubbles.

**Example conversation**

> Rahul: "I want to import cherries from India and sell them in Dubai."
>
> Arni: "Will you import the products yourself or purchase them from suppliers in the UAE?"
>
> Options: Import products | Buy locally | Not sure

After selecting an answer, Arni asks the next question.

**Required questions**

| Step | Question | Options |
|---|---|---|
| Q1 | How will you source your products? | Import / Buy locally / Not sure |
| Q2 | Where will you sell? | Businesses & supermarkets / Online / Both |
| Q3 | Will you need employee or investor visas? | Yes / No / Not sure |

Country should default to **Dubai, UAE** for this demo journey.

**Functional requirements**

| ID | Requirement |
|---|---|
| C01 | Display one question at a time. |
| C02 | Allow single-choice selection. |
| C03 | Automatically progress after selecting an answer. |
| C04 | Users can return to previous questions. |
| C05 | Previously selected answers must remain saved. |
| C06 | Changing an answer must update later recommendations. |
| C07 | Display progress such as "Question 2 of 3". |
| C08 | Allow "Not sure" without blocking the user. |

**Important design constraint:** Do not ask questions that do not affect the recommendation or next steps. Avoid
unnecessary fields like company name, date of birth, and passport number during discovery. Collect contact
information only when the founder decides to submit an enquiry.

**User psychology:** Before: "There are too many requirements." → After: "Arni is asking only what matters."

**Business metric:** Guided discovery completion rate.

---

### Screen 3 — Personalised Business Recommendations

**Objective:** Show founders relevant setup options and explain why they might suit their business.

**Recommended screen structure**

- Heading: *Your Business Setup Recommendations*
- Supporting text: *Based on your business requirements, here are the options worth exploring.*

**Primary recommendation card — Dubai Mainland — Trading Licence**

- Label: *Suggested option · Requires verification*
- Description: *Potentially suitable for businesses planning to sell directly to supermarkets and customers in Dubai.*

| Section | Information |
|---|---|
| Business activity | Fresh fruit trading — exact licensed activity to be verified |
| Jurisdiction | Dubai Mainland |
| Estimated cost | Illustrative setup estimate |
| Additional requirements | Food and import-related approvals may apply |

**Required interactions**

1. **Why this recommendation?** — expandable explanation describing why the structure may suit the user's business.
2. **View Requirements** — expandable checklist containing: Company formation documents · Licensing requirements ·
   Potential additional approvals · Banking and operational considerations.
3. **Compare with Free Zone** — a simple side-by-side comparison:

| Feature | Mainland | Free Zone |
|---|---|---|
| Direct UAE market sales | Generally more straightforward | Additional conditions may apply |
| Suitable for local distribution | Potentially suitable | Depends on structure |
| Importing products | Subject to applicable approvals | Depends on zone and activities |
| Starting cost | Demo estimate | Demo estimate |

*These are general considerations, not a regulatory determination.*

**CTAs:** Primary: **Configure Package** · Secondary: **Talk to an Expert**

**Functional requirements**

| ID | Requirement |
|---|---|
| R01 | Generate recommendations based on discovery answers. |
| R02 | Display a primary suggested setup option. |
| R03 | Explain the recommendation in plain English. |
| R04 | Allow comparison with one alternative. |
| R05 | Display possible additional approvals. |
| R06 | Allow users to return and edit their requirements. |
| R07 | Provide an expert consultation path for uncertain cases. |
| R08 | Continue to package configuration when an option is selected. |

**AI behaviour constraints — Arni must never:** guarantee licence approval · invent regulatory requirements ·
present unverified information as confirmed · guarantee exact costs or processing times · recommend an unsupported
business activity.

For unsupported business descriptions, show: *"We need a little more information to recommend a suitable setup."*
Then provide a consultation option.

**User psychology:** Before: "Which licence should I trust?" → After: "I understand why this option might be suitable."

**Business metric:** Recommendation-to-package conversion.

---

## 7. Screen 4 — Package Configuration & Upselling

**Objective:** Help the founder understand their estimated expenses and select additional services when relevant.

**Layout:** Two-column layout on desktop. Left: package and available services. Right: sticky order summary. On mobile,
the summary becomes a compact bottom section.

**Main package — Dubai Mainland Trading Package.** Display: package name · base setup estimate · included services ·
important exclusions.

**Additional service recommendations**

- Heading: *Services you may also need*
- Supporting line: *Choose the services that are relevant to your business.*

| Service | Description | Interaction |
|---|---|---|
| Accounting & Bookkeeping | Help manage business financial records | Add / Remove |
| Visa Assistance | Support with applicable visa processes | Add / Remove |
| Banking Assistance | Assistance with business bank account applications | Add / Remove |

Only suggest visa assistance prominently if the user indicated a visa requirement. For an importer, display
food-import compliance as an additional requirement to verify, not automatically as a purchasable product.

**Example pricing** (fictional numbers, strictly for the interactive prototype)

| Item | Demo price |
|---|---|
| Business setup package | AED 24,000 |
| Accounting service | AED 3,000 |
| Visa assistance | AED 2,500 |
| Banking assistance | AED 1,500 |

If the user selects accounting and visa assistance: **Estimated demo total: AED 29,500**.

All displayed prices must carry the label: *Illustrative pricing for prototype purposes. Final pricing and applicable
fees require confirmation.*

**Functional requirements**

| ID | Requirement |
|---|---|
| P01 | Display the selected base package. |
| P02 | Allow users to add or remove optional services. |
| P03 | Update the estimated total immediately. |
| P04 | Keep optional services unselected by default. |
| P05 | Explain what each service includes. |
| P06 | Preserve package selections when navigating backward. |
| P07 | Keep potential third-party fees separate from Arnifi's estimate. |
| P08 | Continue to enquiry submission. |

**Microinteraction:** When Rahul selects Accounting & Bookkeeping — the selection changes to a checked state, the
service appears in the order summary, the estimated total updates. Show subtle visual feedback without large animations.

**User psychology:** Before: "Why am I being offered additional services?" → After: "I understand which services I might need."

**Business metrics:** Average Order Value (AOV) and service attach rate. The design should encourage relevant service
selection, not pressure users into unnecessary purchases.

---

## 8. Screen 5 — Enquiry Submission & Confirmation

**Objective:** Convert an interested founder into a qualified business setup lead. This MVP should not process real payments.

**Layout** — Heading: *You're ready for the next step*. Display a summary of: business description · selected
jurisdiction · selected package · additional services · estimated cost · requirements that need expert verification.

**Contact information** — collect only:

| Field | Requirement |
|---|---|
| Full name | Required |
| Email address | Required |
| Phone / WhatsApp | Optional |

Provide a clear consent statement explaining the purpose of submitting contact details.

**CTAs:** Primary: **Request Expert Consultation** · Secondary: **Back to Package**

**Functional requirements**

| ID | Requirement |
|---|---|
| L01 | Validate required contact fields. |
| L02 | Display the complete enquiry summary. |
| L03 | Prevent duplicate submissions. |
| L04 | Simulate successful submission. |
| L05 | Preserve the selected package and services. |
| L06 | Show confirmation after submission. |
| L07 | Provide access to the Arnifi HQ demo. |

**Confirmation screen**

- Heading: *Your Business Setup Enquiry Is Ready*
- Supporting text: *Explore how Arnifi HQ could help you track your company setup after onboarding.*
- CTA: **Explore Arnifi HQ Demo →**

Since this MVP has no CRM integration, clearly indicate that the enquiry is saved only within the prototype and has
not been sent to Arnifi.

**User psychology:** Before: "Will I lose everything I've selected?" → After: "My requirements are organised and ready for review."

**Business metric:** Qualified enquiry conversion rate.

---

## 9. Screen 6 — Arnifi HQ Dashboard Preview

**Objective:** Demonstrate how Arni could continue helping customers after they begin the company setup process.
This is important for customer retention.

**Dashboard structure** (a simplified version of the Arnifi HQ direction)

**Section 1 — My Company:** one fictional company — *Rahul Fresh Produce Trading* · Location: Dubai, UAE ·
Status: Setup in progress.

**Section 2 — My Application** — progress indicator:

| Step | Status |
|---|---|
| Requirements submitted | Completed |
| Package selected | Completed |
| Documents submitted | Pending |
| Application processing | Not started |
| Licence issued | Not started |

**Section 3 — Documents:** card *2 documents require attention* · CTA **View Requirements**. Clicking opens a short
list of sample documents and a simulated completion action. Do not build actual document storage or government verification.

**Section 4 — Upcoming Compliance:** a sample upcoming compliance task, e.g. *Licence Renewal* · Status: Not due yet ·
CTA **View Details**. The demo should not display a fabricated official deadline as a real compliance obligation.

**Arni Assistant integration:** a small contextual assistant entry point, e.g. Arni: *"You have two outstanding setup
tasks. Would you like to review them?"* Options: **View Tasks** | **Not Now**. Clicking View Tasks opens the relevant
dashboard section.

**Functional requirements**

| ID | Requirement |
|---|---|
| H01 | Display the fictional company overview. |
| H02 | Display application progress. |
| H03 | Show pending document requirements. |
| H04 | Allow users to mark sample document tasks completed. |
| H05 | Update progress indicators accordingly. |
| H06 | Display a sample upcoming compliance task. |
| H07 | Allow Arni to navigate users to relevant tasks. |

**User psychology:** Before: "My company setup has started. What happens now?" → After: "I can track what needs attention in one place."

**Business metric:** Product engagement and, in a future production version, renewal retention.

---

## 10. AI Recommendation Logic

For the design MVP, do not require a real LLM connection. Implement a small deterministic recommendation system using
local mock data. This ensures the prototype remains functional without API keys.

**Required logic**

```
IF business description contains "cherries", "fruits", "fruit trading"
THEN Business category = Fresh Fruit Trading

IF user sells directly within Dubai
THEN Primary candidate = Dubai Mainland Trading
     Alternative = UAE Free Zone Trading
     Show explanation of possible distribution restrictions

IF user imports products
THEN Display potential customs and food-import requirements

IF user selects visa required
THEN Prioritise Visa Assistance as an optional service

IF business activity is not recognised
THEN Do not invent a licence recommendation
     Offer expert consultation
```

**Implementation requirements:** Keep matching logic separate from UI components · Store business activities and
package data in structured mock files · Display accurate explanations of what is known versus what requires
verification · Allow user answers to modify the recommendation · Make it possible to replace mock logic with real APIs later.

> **Important:** This is a demonstration of how intelligent recommendations would work, not an authoritative UAE
> licensing engine.

---

## 11. ChatGPT Ads Integration — MVP Scope

**Objective:** Demonstrate how a visitor arriving through a ChatGPT advertisement would enter the Arni discovery journey.

```
User asks ChatGPT about business setup
                |
                v
Relevant Arnifi sponsored ad
                |
                v
Arnifi discovery landing page
                |
                v
Arni guided business setup
                |
                v
Qualified enquiry
```

**Implementation:** support the test URL `/?utm_source=chatgpt&utm_medium=paid`. When accessed: load the normal
discovery screen · store the attribution source locally · continue through the same user journey · include the source
in the simulated lead record.

**Constraints — do not build:** a fake ChatGPT interface · ChatGPT ad placement or bidding systems · a real OpenAI
advertising integration · access to users' ChatGPT conversations. Real ad campaigns and conversion tracking can be
integrated later through the appropriate advertising tools.

**Business metric:** ChatGPT-ad-attributed qualified leads.

---

## 12. Design & UX Requirements

**Visual direction:** use Arnifi's existing visual identity as the reference. Principles: minimal · professional ·
trustworthy · calm · easy to understand · consistent across every screen.

**Typography:** Inter — primary UI typography. Lora — optional for prominent editorial headings where consistent with
Arnifi's brand.

**Colours:** follow Arnifi's existing brand palette. Use white and very light neutral backgrounds · dark charcoal for
primary text · brand purple for important interactive elements · subtle grey borders · restrained semantic colours for
statuses. Avoid unnecessary gradients and bright decorative backgrounds.

**Components** — reusable components for:

| Component | Usage |
|---|---|
| App Header | Consistent navigation |
| Progress Indicator | Guided conversation |
| Business Input | Natural-language discovery |
| Choice Button | Answer selection |
| Recommendation Card | Suggested business setups |
| Comparison Panel | Mainland versus Free Zone |
| Service Card | Optional add-ons |
| Price Summary | Estimated total |
| Status Indicator | Application progress |
| Task Card | Documents and renewals |
| Arni Assistant Panel | Contextual guidance |
| Primary / Secondary Buttons | Consistent actions |

**Interaction guidelines:** one primary CTA per section · do not overload screens with text · progressive disclosure
for complex requirements · provide back navigation · preserve previously entered information · subtle transitions of
approximately 150–200 ms · clear selection and completion states · avoid unnecessary animations, illustrations, and
chatbot decorations.

**Responsive requirements:** Desktop 1440px reference width · Tablet 768px · Mobile 390px. The entire journey must
work on desktop and mobile.

**Accessibility:** all interactive elements keyboard accessible · inputs require visible labels · clear focus states ·
readable colour contrast · descriptive error messages · do not rely on colour alone for status.

---

## 13. Functional UI States

Implement the following states, not just static screens.

| Screen | Required states |
|---|---|
| Discovery | Empty, typing, valid input, validation error |
| Conversation | Unanswered, selected, progressing, editing previous answer |
| Recommendations | Loading, suggested option, comparison expanded, no confident match |
| Package Configuration | No add-ons, add-on selected, removed, recalculated total |
| Enquiry | Empty form, validation error, submitting, confirmation |
| Arnifi HQ | Tasks pending, sample task completed, progress updated |

**Error handling:** if the user enters an unsupported business, display *"We couldn't confidently identify a suitable
licence. An Arnifi expert can help review your requirements."* Do not display unrelated package recommendations.

---

## 14. Analytics & Business Metrics

For the MVP, simulate analytics events locally. No real analytics service is required.

| Event name | Trigger |
|---|---|
| `discovery_started` | Founder begins setup discovery |
| `discovery_completed` | All questions answered |
| `recommendation_viewed` | Recommendation displayed |
| `package_selected` | Package selected |
| `service_added` | Optional service added |
| `service_removed` | Optional service removed |
| `lead_submitted` | Demo enquiry completed |
| `hq_task_completed` | Sample task marked completed |

Include attribution source with events when available.

**Metrics to measure in production**

| Metric | Calculation |
|---|---|
| Discovery completion | Completed discoveries / Started discoveries |
| Recommendation conversion | Package selections / Recommendation views |
| Lead conversion | Qualified enquiries / Relevant visitors |
| Service attach rate | Orders containing add-ons / Total orders |
| AOV | Revenue from completed orders / Number of completed orders |
| Retention | Customers retained over a defined period / Eligible customers |
| Customer acquisition cost | Acquisition spending / Acquired customers |

**MVP limitation:** actual AOV, revenue, CAC, and retention cannot be measured without production transaction,
marketing, and customer data. For stakeholder demos, display only simulated interactions — not fabricated business results.

---

## 15. Technical Implementation Requirements

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Reusable React components |
| Icons | Lucide React |
| Mock data | Local JSON / TypeScript |
| State management | React state and Context where necessary |
| Persistence | Browser sessionStorage |
| Backend | Not required for MVP |
| AI | Deterministic mock recommendation service |

**Suggested project structure**

```
src/
  app/        page.tsx · discovery/ · recommendations/ · configure/ · enquiry/ · hq/
  components/ layout/ · discovery/ · conversation/ · recommendations/ · packages/ · hq/ · ui/
  data/       activities.ts · packages.ts · services.ts · demo-company.ts
  lib/        recommendation-engine.ts · pricing.ts · analytics.ts
  context/    journey-context.tsx
  types/      index.ts
```

**Data requirements** — typed objects for:

| Object | Fields |
|---|---|
| User Requirements | Business description · Country/city · Product sourcing · Sales channel · Visa requirements |
| Recommendation | Business activity · Suggested jurisdiction · Explanation · Potential additional requirements · Verification status |
| Package | Package ID · Name · Jurisdiction · Estimated demo price · Inclusions · Exclusions |
| Additional Service | Service ID · Name · Description · Demo price · Selection state |
| Enquiry | Contact information · User requirements · Selected package · Selected services · Estimated total · Attribution source |
| Company Dashboard | Company · Application stage · Document tasks · Compliance tasks |

---

## 16. Implementation Constraints (mandatory)

**Do not build:** user authentication or signup flows · real payment processing · real document upload or storage ·
real government integrations · real WhatsApp or email notifications · real CRM integrations · live ChatGPT advertising
connections · a separate AI model training system · unnecessary analytics dashboards · multiple unrelated
business-management modules · complex charts or financial reports · admin panels · unrelated marketing pages.

**Do not add:** random features outside the requirements · excessive illustrations · decorative 3D objects · large
colourful dashboard widgets · unnecessary animations · multiple CTAs competing for attention · placeholder features
that appear functional but do nothing. Every visible interactive component should have a defined action.

**Data safety:** all prices are fictional demo values · all company information is fictional · no real customer
information should be sent externally · do not claim government or expert verification occurred · no genuine
compliance deadlines should be invented · clearly indicate when an action is simulated.

---

## 17. MVP Acceptance Criteria

| Test | Expected result |
|---|---|
| User enters a fresh-fruit business description | Guided discovery begins |
| User answers three questions | Recommendation screen appears |
| User selects importing | Import-related requirements appear |
| User changes a previous answer | Recommendation updates |
| User compares jurisdictions | Comparison opens correctly |
| User selects a package | Configuration screen opens |
| User adds accounting assistance | Estimated total increases |
| User removes accounting assistance | Estimated total decreases |
| User submits an incomplete enquiry | Validation error appears |
| User submits a valid demo enquiry | Confirmation appears |
| User opens Arnifi HQ preview | Sample company dashboard opens |
| User completes a sample document task | Task status updates |
| User refreshes the prototype | Journey progress remains available within the session |
| User enters an unsupported activity | Expert consultation option appears |
| User opens a URL with ChatGPT attribution | Attribution is preserved through the journey |

**Quality requirements:** no broken navigation · no overflowing text · no non-functional buttons · no horizontal
scrolling on mobile · no console errors · no unnecessary loading screens · no misleading claims about live integrations.

---

## 18. Development Order

| Phase | Development task | Deliverable |
|---|---|---|
| 1 | Set up the project, design foundations, types, and mock data | Base application |
| 2 | Build discovery and guided conversation | Functional input and question flow |
| 3 | Implement recommendation logic and comparison | Working recommendations |
| 4 | Build package configuration and pricing logic | Functional service selection |
| 5 | Build enquiry submission and confirmation | Complete conversion journey |
| 6 | Build Arnifi HQ preview | Interactive customer dashboard |
| 7 | Add persistence, attribution, analytics events, and responsive states | Connected MVP |
| 8 | Test complete journey and fix usability issues | Presentation-ready prototype |

---

## 19. Final Instructions

Build a complete, functional MVP of the Arni AI Guided Business Setup Experience using the product requirements above.

- Follow the existing Arnifi brand direction and keep the interface minimal, professional, and consistent.
- Demonstrate one connected customer journey: business discovery, guided questions, personalised recommendations,
  package comparison, service configuration, enquiry submission, and Arnifi HQ.
- Prioritise functionality and user experience over decorative design.
- Use realistic mock data and deterministic recommendation logic. Do not connect live APIs, payment systems,
  advertising platforms, or customer databases.
- Every visible button and interactive element must work.
- Implement conditional questions, recommendations, package selection, dynamic price calculations, form validation,
  application progress, and document task interactions.
- Ensure that all stages share the same journey state and that data persists during the browser session.
- Use the specified technology stack, or the existing project's conventions where appropriate.
- Create reusable components and maintain clean, understandable code.
- Do not introduce features that are not described in the PRD.
- Test the complete workflow on desktop and mobile. Fix broken interactions, layout problems, and TypeScript errors.
- Include a short README explaining how to run the prototype, the mock-data limitations, and how to demonstrate the user journey.

The final result should feel like a polished product experience that could be presented to Arnifi's Head of Design,
not a generic AI-generated dashboard or static mockup.

---

## 20. How to Present This MVP

| Demo step | What you show | What you explain |
|---|---|---|
| 1. Discovery | Founder describes their business | We're reducing the need to understand licensing terminology. |
| 2. Guided Questions | Arni collects requirements | We're keeping questions relevant and reducing friction. |
| 3. Recommendations | Arni explains setup options | We're helping founders make confident decisions. |
| 4. Package Configuration | Relevant services and updated estimate | We're creating opportunities for higher AOV. |
| 5. Enquiry | Founder submits requirements | We're improving the quality of leads handed to sales. |
| 6. Arnifi HQ | Company progress and outstanding tasks | We're extending the experience beyond incorporation to support retention. |

**What should we validate?** For the initial usability test, give founders this task:

> "You want to import cherries into Dubai and sell them to supermarkets. Use Arnifi to find a suitable setup option
> and submit your requirements."

Observe whether they: understand what to enter · complete the questions without assistance · understand why a package
was recommended · know what the estimated price includes · understand which additional services they might need · can
complete the enquiry without confusion. Compare the results with the existing Arnifi package-discovery experience.

**Final product vision** — From: a chatbot that answers business setup questions. To: an intelligent guided experience
that helps founders **discover → decide → configure → convert → manage**.

The MVP should demonstrate three business hypotheses:

- **Conversion:** a guided experience makes it easier to find suitable packages and submit enquiries.
- **Average Order Value:** contextual service recommendations help customers select more relevant services.
- **Retention:** a connected Arnifi HQ experience gives customers practical reasons to return after company incorporation.

The most important thing to demonstrate is not the AI itself. It's how each interaction helps the founder progress
while supporting a measurable business goal.

---

## Appendix A — Build decisions (MVP 1.0 implementation)

Decisions taken while implementing this PRD. Each one either fills a gap the PRD leaves open or maps a PRD instruction
onto the Arnifi Design System.

### A1. Example prompts (decided with the product owner)

All three Screen 1 example prompts lead to a real recommendation, not a dead end.

| Activity | Matched by (examples) | Questions asked | Primary option |
|---|---|---|---|
| Fresh Fruit Trading | cherries, fruit, fruits, fruit trading, produce | Q1 · Q2 · Q3 | Mainland if selling directly in Dubai; Free Zone if online only |
| Foodstuff Trading | food trading, foodstuff, grocery, spices | Q1 · Q2 · Q3 | as above |
| E-commerce Trading | online store, online shop, e-commerce | Q1 · Q2 · Q3 | as above |
| Management Consultancy | consulting, consultancy, advisory | Q2 (as "Where will your clients be?") · Q3 — Q1 is skipped because sourcing does not affect a service business | Mainland if UAE clients; Free Zone if clients are outside the UAE |
| Anything else | — | none (they would not change the outcome) | No confident match → expert consultation |

Food-import approvals appear only for the two food activities; customs appear for any product import.

### A2. Fictional demo prices

| Item | Demo price |
|---|---|
| Dubai Mainland Trading Package | AED 24,000 (PRD) |
| UAE Free Zone Trading Package | AED 19,000 |
| Dubai Mainland Professional Package | AED 20,000 |
| UAE Free Zone Consultancy Package | AED 16,500 |
| Accounting & Bookkeeping · Visa Assistance · Banking Assistance | AED 3,000 · 2,500 · 1,500 (PRD) |

Government and third-party fees are never priced; they are listed separately as "confirmed after expert review".

### A3. Routes and journey state

| Screen | Route |
|---|---|
| 1 AI Business Discovery | `/` |
| 2 Guided Conversation | `/discovery` |
| 3 Recommendations | `/recommendations` |
| 4 Package Configuration | `/configure` |
| 5 Enquiry & Confirmation | `/enquiry` |
| 6 Arnifi HQ Preview | `/hq` |

One journey store (React Context over `sessionStorage`) is shared by every screen. A screen whose prerequisites are
missing sends the founder to the earliest unfinished step. "Talk to an Expert" opens the enquiry screen without a
package. A submitted enquiry is fingerprinted, so submitting the same details twice never creates a second lead.

### A4. Design-system mapping (Arnifi Design System)

| PRD instruction | Arnifi DS token / pattern used |
|---|---|
| Brand purple for interactive elements | Arnique-900 `#2E2EA3`, hover Arnique-1000 `#16167A` |
| Dark charcoal primary text | `text-default` Dusk-1000 `#21272A`; headings `text-heading` Arnique-1000 |
| Subtle grey borders | `border-default` Dusk-300 `#DDE1E6`; focus ring `border-focused` Arnique-500 |
| Very light backgrounds | white, `bg-blue-superlight` Arnique-100, `bg-warm-light` Dawn-200 |
| Restrained status colours | Moss-700 success, Tang-700 pending, Ruby-700 error, True Blue-700 info — always with an icon and text |
| Inter / Lora | Lora for page headings and Arni's questions (L2–L4); Inter for everything else (SH, P, SPH styles) |
| Buttons | DS CTA: 2px radius, primary with darker arrow segment on the right |
| Inputs | DS text field: label → field → helper/error, 1.5px border, 4px radius |
| Cards | 8px radius, 1px `border-default`, Light/Medium Double shadow on raised surfaces |
| Transitions 150–200 ms | 200 ms ease-out (the DS hover is 300 ms; the PRD range wins), off for `prefers-reduced-motion` |
| Grid | 1440 → 1120 content (160 margins); tablet 768; mobile 390 with 24px margins |

Light theme only: the PRD asks for white and light neutral backgrounds, and several DS dark-mode values are undefined.

### A5. Things that are simulated

Recommendations (deterministic rules over local data), prices, the lead record (saved in `sessionStorage` only, never
sent), document completion in Arnifi HQ, and analytics events (stored in `sessionStorage` under `arni:events`).
