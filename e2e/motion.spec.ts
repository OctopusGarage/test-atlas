import { test, expect, type Page } from "@playwright/test";

const origin = "http://127.0.0.1:4173/test-atlas/";
const next = (page: Page) => page.getByRole("button", { name: "Next question", exact: true });
const previous = (page: Page) => page.getByRole("button", { name: "Previous question", exact: true });

async function expectSettledReducedMotion(page: Page) {
  await expect(page.locator(".route-scene")).toHaveAttribute("data-motion", "reduced");
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter((animation) => {
    const duration = animation.effect?.getComputedTiming().duration;
    return (animation.playState === "running" || animation.pending) &&
      (typeof duration !== "number" || duration > 1);
  }).length)).toBe(0);
  await expect.poll(() => page.locator(".route-scene, [data-reveal], .question-step").evaluateAll((nodes) =>
    nodes.every((node) => {
      const style = getComputedStyle(node);
      return Number(style.opacity) === 1 && style.visibility === "visible";
    }),
  )).toBe(true);
}

test("reduced motion leaves home, catalog cards and question content fully visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", "/tests", "/tests/attachment", "/tests/attachment/take"]) {
    await page.goto(origin + `#${route}?lang=en`);
    await expect(page.locator("main h1")).toBeVisible();
    await expectSettledReducedMotion(page);
  }
  await page.getByRole("radio", { name: "Agree", exact: true }).check();
  await next(page).click();
  await expect(page.getByText("02 / 12")).toBeVisible();
  await expectSettledReducedMotion(page);
});

test("animated route changes keep one main heading, English and a working keyboard skip link", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(origin);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  // iPhone WebKit emulation does not tab to links by default.
  if (browserName === "webkit") await page.getByRole("link", { name: "Skip to content", exact: true }).focus();
  else await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  for (const route of ["/tests", "/history", "/about", "/"]) {
    await page.evaluate((route) => { location.hash = route; }, route);
    await expect(page.locator(".route-scene")).toHaveCount(1);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  }
});

test("question motion allows consecutive navigation and preserves answers through reload", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(origin + "#/tests/attachment/take?lang=en");
  const firstQuestion = await page.locator(".question-step").getAttribute("data-question");
  expect(firstQuestion).toBeTruthy();
  await page.getByRole("radio", { name: "Agree", exact: true }).check();
  await next(page).click();
  await expect(page.locator(".question-step")).not.toHaveAttribute("data-question", firstQuestion!);
  await page.getByRole("radio", { name: "Strongly agree", exact: true }).check();
  await previous(page).click();
  await expect(page.locator(".question-step")).toHaveAttribute("data-question", firstQuestion!);
  await expect(page.getByRole("radio", { name: "Agree", exact: true })).toBeChecked();
  await next(page).click();
  await expect(page.getByRole("radio", { name: "Strongly agree", exact: true })).toBeChecked();
  await page.reload();
  await expect(page.getByText("02 / 12")).toBeVisible();
  await expect(page.getByRole("radio", { name: "Strongly agree", exact: true })).toBeChecked();
  await previous(page).click();
  await expect(page.getByRole("radio", { name: "Agree", exact: true })).toBeChecked();
});

test("full motion keeps next reachable on a short mobile screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(origin + "#/tests/big-five/take?lang=en");
  for (let index = 1; index <= 3; index++) {
    await expect(next(page)).toBeInViewport();
    await page.getByRole("radio", { name: "Agree", exact: true }).check();
    await expect(next(page)).toBeInViewport();
    await next(page).click();
    await expect(page.getByText(`${String(index + 1).padStart(2, "0")} / 50`)).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("focus reveals a distant card and a live reduced-motion change reveals all pending content", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 650 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(origin + "#/tests?lang=en");
  await expect(page.locator(".test-card")).toHaveCount(25);
  const lastCard = page.locator(".test-card").last();
  // Programmatic focus has the same focusin event as keyboard traversal, without
  // scrolling through every preceding card and consuming its reveal beforehand.
  await lastCard.evaluate((card) => {
    const target = card.matches("a") ? card : card.querySelector("a");
    (target as HTMLElement | null)?.focus();
  });
  await expect.poll(() => lastCard.evaluate((card) => {
    let node: Element | null = card;
    while (node && node.tagName !== "MAIN") {
      if (Number(getComputedStyle(node).opacity) !== 1) return false;
      node = node.parentElement;
    }
    return card.contains(document.activeElement);
  })).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expectSettledReducedMotion(page);
  await expect(page.locator(".test-card").first()).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".route-scene")).toHaveAttribute("data-motion", "full");
  await lastCard.scrollIntoViewIfNeeded();
  await expect(lastCard).toBeVisible();
});
