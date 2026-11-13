import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { assessments } from "../src/data/assessments";

const origin = "http://127.0.0.1:4173/test-atlas/";

test("short mobile screens keep the next-question action in reach", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(origin + "#/tests/big-five/take?lang=en");
  const next = page.getByRole("button", { name: "Next question", exact: true });
  await expect(next).toBeInViewport();
  await page.getByRole("radio", { name: "Agree", exact: true }).check();
  await expect(next).toBeInViewport();
  await next.click();
  await expect(page.getByText("02 / 50")).toBeVisible();
  await expect(next).toBeInViewport();
});

test("history filters fit a narrow screen with wider or enlarged control fonts", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(origin + "#/history?lang=en");
  await page.locator(".history-filter select").waitFor();
  // Font metrics differ across operating systems; also cover enlarged text.
  await page.addStyleTag({ content: ".history-filter select { font-family: monospace !important; font-size: 20px !important; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

async function audit(page: Page) {
  await expect(page.locator("main h1")).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(a => a.playState === "running" || a.pending).length)).toBe(0);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => ({ target: n.target, reason: n.failureSummary })),
  }))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const locale of ["en", "zh"] as const) {
  test(`accessible narrow-screen navigation and forms: ${locale}`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 320, height: 740 });
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    for (const route of ["/", "/tests", "/tests/strengths", "/tests/big-five/take", "/history", "/compare", "/profile", "/about"]) {
      await page.goto(origin + `#${route}?lang=${locale}`);
      await audit(page);
      if (route === "/tests/strengths")
        await expect(page.getByText(locale === "en"
          ? "Original reflection questionnaire. No psychometric validation is established."
          : "原创反思问卷，尚无心理测量效度验证。")).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

for (const a of assessments) {
  test(`report accessibility and responsive layout: ${a.id}`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "All report content audited in Chromium; navigation/forms audited on all engines");
    test.setTimeout(60_000);
    await page.goto(origin);
    await page.evaluate((a) => localStorage.setItem("test_atlas_v1", JSON.stringify({
      schemaVersion: 1, revision: 1, drafts: {}, results: [{
        id: "quality", testId: a.id, testVersion: a.version,
        scoringVersion: a.scoringVersion, reportVersion: a.reportVersion,
        contentHash: a.contentHash, completedAt: "2026-11-13T00:00:00Z",
        scores: Object.fromEntries(a.dimensions.map((d, i) => [d.id, i === 0 ? 75 : 25])),
      }],
    })), a);
    for (const locale of ["en", "zh"]) {
      await page.goto(origin + `#/results/quality?lang=${locale}`);
      await page.reload();
      await page.setViewportSize({ width: 320, height: 740 });
      await audit(page);
      await page.setViewportSize({ width: 1280, height: 800 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}
