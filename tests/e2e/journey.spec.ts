import { expect, test, type Page } from "@playwright/test";

/*
 * PRD §17 acceptance criteria, run on desktop, tablet and mobile. Every test also fails on console errors
 * and on horizontal scrolling (PRD §17 quality requirements).
 */

const CHERRIES = "I want to import cherries from India and sell them in Dubai.";
const UAE_LISTING = "https://arnifi.com/product-listing?countries=1&productType=licence";
const ALL_LISTING = "https://arnifi.com/product-listing?productType=licence";
const PROFESSIONAL_PAGE =
  "https://arnifi.com/product-details/licence/dubai-mainland/dubai-mainland-license-(standard-professional-activity)";

let consoleErrors: string[] = [];

test.beforeEach(async ({ page, context }) => {
  consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  // Arnifi links open arnifi.com in a new tab; the tests check the destination without depending on the live site.
  await context.route("https://arnifi.com/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Arnifi</title>" }));
});

test.afterEach(() => {
  expect(consoleErrors, "console errors").toEqual([]);
});

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, `horizontal overflow on ${page.url()}`).toBeLessThanOrEqual(0);
}

// Next.js keeps recently visited routes mounted but hidden, so text and label queries must ignore hidden copies.
const text = (page: Page, value: string | RegExp, exact = true) => page.getByText(value, { exact }).filter({ visible: true });
const businessField = (page: Page) => page.getByLabel("Describe your business").filter({ visible: true });

async function describeBusiness(page: Page, description: string) {
  await businessField(page).fill(description);
  await page.getByRole("button", { name: "Find My Business Setup" }).click();
}

async function answer(page: Page, label: string) {
  await page.getByRole("button", { name: label, exact: true }).click();
}

async function reachRecommendations(page: Page, description = CHERRIES, visas = "Yes") {
  await page.goto("/");
  await describeBusiness(page, description);
  await expect(page).toHaveURL(/\/discovery$/);
  await answer(page, "United Arab Emirates");
  await expect(businessField(page)).toHaveValue(description);
  await page.getByRole("button", { name: "Continue" }).click();
  await answer(page, visas);
  await expect(page).toHaveURL(/\/recommendations$/);
  await expect(page.getByRole("heading", { name: "Your Business Setup Recommendations" })).toBeVisible();
}

test("complete journey from a ChatGPT ad to Arnifi HQ", async ({ page }) => {
  // Entry through the ChatGPT ad tracking URL: the existing start screen
  await page.goto("/?utm_source=chatgpt&utm_medium=paid");
  await expect(page.getByRole("heading", { name: "What business are you planning to start?" })).toBeVisible();
  await expectNoHorizontalScroll(page);

  // Start screen: empty input shows a validation error; a description starts the questions
  const cta = page.getByRole("button", { name: "Find My Business Setup" });
  await expect(cta).toHaveAttribute("aria-disabled", "true");
  await businessField(page).press("Enter");
  await expect(text(page, "Tell Arni about your business to continue.", false)).toBeVisible();
  // The CTA only looks disabled: it stays clickable so it can explain what's missing.
  await businessField(page).fill("ab");
  await cta.click({ force: true });
  await expect(text(page, "Add a few more words about your business.", false)).toBeVisible();
  await describeBusiness(page, CHERRIES);
  await expect(page).toHaveURL(/\/discovery$/);

  // Question 1 — location
  await expect(text(page, "Question 1 of 3", false)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Where do you want to set up your business?" })).toBeVisible();
  await expectNoHorizontalScroll(page);
  await answer(page, "United Arab Emirates");

  // Question 2 — business, in the founder's own words (prefilled from the start screen)
  await expect(text(page, "Question 2 of 3", false)).toBeVisible();
  await expect(page.getByRole("heading", { name: "What kind of business are you planning to start?" })).toBeVisible();
  await expect(businessField(page)).toHaveValue(CHERRIES);
  await expectNoHorizontalScroll(page);
  await page.getByRole("button", { name: "Continue" }).click();

  // Question 3 — visas, optional; the rejected client-location question never appears
  await expect(text(page, "Question 3 of 3", false)).toBeVisible();
  await expect(page.getByRole("button", { name: "Skip this question" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Where will your clients be?" })).toHaveCount(0);
  await answer(page, "Yes");

  // Recommendations: the suggested setup with its facts
  await expect(page).toHaveURL(/\/recommendations$/);
  await expect(page.getByRole("heading", { name: "Dubai Mainland — Trading Licence" })).toBeVisible();
  await expect(text(page, "Suggested option · Requires verification", false)).toBeVisible();
  await expect(text(page, "Estimated setup cost", false)).toBeVisible();
  await expect(text(page, `From your description: “${CHERRIES}”`, false)).toBeVisible();
  await expect(text(page, "Food and import-related approvals may apply", false)).toBeVisible();
  await expectNoHorizontalScroll(page);

  // Why this recommendation? and View Requirements
  await page.getByRole("button", { name: "Why this recommendation?" }).click();
  await expect(text(page, /You haven't said how you'll sell/, false)).toBeVisible();
  await page.getByRole("button", { name: "View Requirements" }).click();
  await expect(text(page, "Visa applications for you and any employees", false)).toBeVisible();

  // Comparison with the alternative, linked to Arnifi
  await page.getByRole("button", { name: "Compare with Free Zone" }).click();
  await expect(text(page, "Direct UAE market sales", false)).toBeVisible();
  await expect(text(page, "These are general considerations, not a regulatory determination.", false)).toBeVisible();
  await expect(page.getByRole("link", { name: /View Free Zone Options on Arnifi/ })).toHaveAttribute("href", UAE_LISTING);
  await expectNoHorizontalScroll(page);

  // The package continues on arnifi.com instead of an in-app configurator
  await expect(page.getByRole("button", { name: "Configure Package" })).toHaveCount(0);
  const packageLink = page.getByRole("link", { name: /View UAE Packages on Arnifi/ });
  await expect(packageLink).toHaveAttribute("target", "_blank");
  const [arnifi] = await Promise.all([page.waitForEvent("popup"), packageLink.click()]);
  await expect(arnifi).toHaveURL(UAE_LISTING);
  await arnifi.close();

  // The relationship manager, with direct contact details
  await expect(text(page, "John Smith")).toBeVisible();
  await expect(text(page, "Demo contact")).toBeVisible();
  await expect(page.getByRole("link", { name: "Call +971 50 000 0000" })).toHaveAttribute("href", "tel:+971500000000");
  await expect(page.getByRole("link", { name: "Email john@arnifi.com" })).toHaveAttribute("href", "mailto:john@arnifi.com");

  // Contacting the expert opens the enquiry
  await page.getByRole("button", { name: "Contact an Arnifi Expert" }).click();
  await expect(page).toHaveURL(/\/enquiry$/);
  await expect(page.getByRole("heading", { name: "You're ready for the next step" })).toBeVisible();
  await expect(text(page, "Dubai, UAE")).toBeVisible();
  await expect(text(page, "Dubai Mainland", false)).toBeVisible();
  await expectNoHorizontalScroll(page);

  // An incomplete enquiry shows validation errors
  await page.getByRole("button", { name: "Request Expert Consultation" }).click();
  await expect(text(page, "Enter your full name", false)).toBeVisible();
  await expect(text(page, "Enter your email address", false)).toBeVisible();
  await page.getByLabel(/Full name/).fill("Rahul Mehta");
  await page.getByLabel(/Email address/).fill("rahul@example");
  await page.getByRole("button", { name: "Request Expert Consultation" }).click();
  await expect(text(page, "Enter a valid email address", false)).toBeVisible();
  await page.getByLabel(/Email address/).fill("rahul@example.com");

  // A valid enquiry submits once and shows the confirmation with attribution preserved
  await page.getByRole("button", { name: "Request Expert Consultation" }).click();
  await expect(page.getByRole("heading", { name: "Your Business Setup Enquiry Is Ready" })).toBeVisible();
  await expect(text(page, "Saved in this prototype only", false)).toBeVisible();
  await expect(text(page, "ChatGPT · paid", false)).toBeVisible();
  await expectNoHorizontalScroll(page);

  // Arnifi HQ preview
  await page.getByRole("link", { name: "Explore Arnifi HQ Demo" }).click();
  await expect(page).toHaveURL(/\/hq$/);
  await expect(text(page, "Rahul Fresh Produce Trading", false)).toBeVisible();
  await expect(page.getByRole("heading", { name: "2 documents require attention" })).toBeVisible();
  await expect(text(page, "2 of 5 steps complete", false)).toBeVisible();
  await expectNoHorizontalScroll(page);

  // Arni takes the founder to the tasks; completing them updates status and progress
  await page.getByRole("button", { name: "View Tasks" }).click();
  await expect(page.getByRole("button", { name: "View Requirements" })).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: /Mark Passport copy/ }).click();
  await expect(page.getByRole("heading", { name: "1 document requires attention" })).toBeVisible();
  await expect(text(page, "You have one outstanding setup task", false)).toBeVisible();
  await page.getByRole("button", { name: /Mark Proof of residential address/ }).click();
  await expect(page.getByRole("heading", { name: "All documents complete" })).toBeVisible();
  await expect(text(page, "3 of 5 steps complete", false)).toBeVisible();

  // Upcoming compliance shows a sample task without a fabricated deadline
  await page.getByRole("button", { name: "View Details" }).click();
  await expect(text(page, "this is not a real deadline", false)).toBeVisible();

  // Simulated analytics carry the ChatGPT attribution
  const events = await page.evaluate(() => JSON.parse(sessionStorage.getItem("arni:events") ?? "[]"));
  const names = events.map((e: { name: string }) => e.name);
  for (const name of [
    "discovery_started",
    "discovery_completed",
    "recommendation_viewed",
    "package_selected",
    "lead_submitted",
    "hq_task_completed",
  ]) {
    expect(names).toContain(name);
  }
  expect(names.filter((n: string) => n === "lead_submitted")).toHaveLength(1);
  expect(events.every((e: { source: string }) => e.source === "chatgpt")).toBe(true);

  // Revisiting the enquiry does not create a duplicate submission
  await page.goto("/enquiry");
  await expect(page.getByRole("heading", { name: "Your Business Setup Enquiry Is Ready" })).toBeVisible();
});

test("changing a previous answer updates the recommendation", async ({ page }) => {
  await reachRecommendations(page);
  await expect(page.getByRole("heading", { name: "Dubai Mainland — Trading Licence" })).toBeVisible();

  await page.getByRole("link", { name: "Edit my answers" }).click();
  await expect(page.getByRole("heading", { name: "That's everything I need" })).toBeVisible();
  await page.getByRole("button", { name: "Edit business" }).click();
  await expect(page.getByRole("heading", { name: "What kind of business are you planning to start?" })).toBeVisible();
  await expect(businessField(page)).toHaveValue(CHERRIES);
  await businessField(page).fill("I want to import cherries and sell them online");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(/\/recommendations$/);
  await expect(page.getByRole("heading", { name: "UAE Free Zone — Trading Licence" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Compare with Mainland" })).toBeVisible();
});

test("buying locally shows no import requirements", async ({ page }) => {
  await reachRecommendations(page, "Buy cherries locally and sell them to supermarkets in Dubai", "No");
  await expect(text(page, "Food safety approvals may apply", false)).toBeVisible();
  await expect(text(page, "Food and import-related approvals may apply", false)).toHaveCount(0);
});

test("Back returns to previous questions with answers kept", async ({ page }) => {
  await page.goto("/");
  await describeBusiness(page, CHERRIES);
  await answer(page, "United Arab Emirates");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(text(page, "Question 3 of 3", false)).toBeVisible();

  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(text(page, "Question 2 of 3", false)).toBeVisible();
  await expect(businessField(page)).toHaveValue(CHERRIES);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(text(page, "Question 1 of 3", false)).toBeVisible();
  await expect(page.getByRole("button", { name: "United Arab Emirates" })).toHaveAttribute("aria-pressed", "true");

  // The description is preserved when going back to the start screen
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(businessField(page)).toHaveValue(CHERRIES);
});

test("the visa question can be skipped and a consultancy links to its Arnifi package", async ({ page }) => {
  await page.goto("/");
  await describeBusiness(page, "I want to open a consulting company");
  await answer(page, "United Arab Emirates");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Skip this question" }).click();

  await expect(page).toHaveURL(/\/recommendations$/);
  await expect(page.getByRole("heading", { name: "Dubai Mainland — Professional Licence" })).toBeVisible();
  await expect(text(page, /^Visas:/, false)).toHaveCount(0);
  await page.getByRole("button", { name: "View Requirements" }).click();
  await expect(text(page, "Visa needs, once you decide on owners and employees", false)).toBeVisible();
  await expect(page.getByRole("link", { name: /^View Package on Arnifi/ })).toHaveAttribute("href", PROFESSIONAL_PAGE);
  await expectNoHorizontalScroll(page);
});

test("a general start lets the founder describe the business in the questions", async ({ page }) => {
  await page.goto("/");
  await describeBusiness(page, "I want to start a business");
  await expect(page).toHaveURL(/\/discovery$/);
  await answer(page, "United Arab Emirates");

  // Nothing recognisable yet, so the business question starts empty, with everyday examples
  await expect(businessField(page)).toHaveValue("");
  await page.getByRole("button", { name: "I want to import and sell electronics in the UAE" }).click();
  await expect(businessField(page)).toHaveValue("I want to import and sell electronics in the UAE");
  await page.getByRole("button", { name: "Continue" }).click();
  await answer(page, "No");

  await expect(page.getByRole("heading", { name: "Dubai Mainland — Trading Licence" })).toBeVisible();
  await expect(text(page, "Customs and import registration may apply", false)).toBeVisible();
});

test("a setup outside the UAE goes to an Arnifi expert", async ({ page }) => {
  await page.goto("/");
  await describeBusiness(page, CHERRIES);
  await answer(page, "Outside the UAE");
  await page.getByLabel(/Which country\?/).fill("Saudi Arabia");
  await page.getByRole("button", { name: "Continue" }).click();

  // The UAE visa question isn't asked
  await expect(text(page, "Question 2 of 2", false)).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(/\/recommendations$/);
  await expect(page.getByRole("heading", { name: "Arni's suggestions currently cover the UAE" })).toBeVisible();
  await expect(text(page, /You'd like to set up in Saudi Arabia/, false)).toBeVisible();
  await expect(text(page, "Dubai Mainland", false)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /View Packages on Arnifi/ })).toHaveAttribute("href", ALL_LISTING);
  await expectNoHorizontalScroll(page);

  await page.getByRole("button", { name: "Talk to an Expert" }).click();
  await expect(page).toHaveURL(/\/enquiry$/);
  await expect(text(page, "Saudi Arabia")).toBeVisible();
});

test("an unsupported activity offers expert consultation without packages", async ({ page }) => {
  await page.goto("/");
  await describeBusiness(page, "I want to open a yoga studio");
  await answer(page, "United Arab Emirates");
  await businessField(page).fill("I want to open a yoga studio");
  await page.getByRole("button", { name: "Continue" }).click();
  await answer(page, "No");

  await expect(page).toHaveURL(/\/recommendations$/);
  await expect(text(page, "We couldn't confidently identify a suitable licence.", false)).toBeVisible();
  await expect(text(page, "Dubai Mainland", false)).toHaveCount(0);
  await expectNoHorizontalScroll(page);

  await page.getByRole("button", { name: "Talk to an Expert" }).click();
  await expect(page).toHaveURL(/\/enquiry$/);
  await expect(text(page, "None yet — you asked to talk to an expert first", false)).toBeVisible();
  await page.getByLabel(/Full name/).fill("Sam Lee");
  await page.getByLabel(/Email address/).fill("sam@example.com");
  await page.getByRole("button", { name: "Request Expert Consultation" }).click();
  await expect(page.getByRole("heading", { name: "Your Business Setup Enquiry Is Ready" })).toBeVisible();
  await expect(text(page, "Direct visit (no campaign)", false)).toBeVisible();
});

test("example prompts populate the start screen input", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Set up a consulting company" }).click();
  await expect(businessField(page)).toHaveValue("Set up a consulting company");
  await businessField(page).press("Enter");
  await expect(page).toHaveURL(/\/discovery$/);
  await expect(text(page, "Question 1 of 3", false)).toBeVisible();
});

test("a deep link without journey progress returns to the start", async ({ page }) => {
  await page.goto("/configure");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "What business are you planning to start?" })).toBeVisible();
});

test("Reset Demo clears the session", async ({ page }) => {
  await reachRecommendations(page);
  await page.getByRole("button", { name: "Reset Demo" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(businessField(page)).toHaveValue("");
  await page.goto("/recommendations");
  await expect(page).toHaveURL(/\/$/);
});
