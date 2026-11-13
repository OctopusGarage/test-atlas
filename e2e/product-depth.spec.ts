import { test, expect } from "@playwright/test";
import { encodeInvite } from "../src/engine/social";
import { assessments, archivedAssessments } from "../src/data/assessments";
import type { Result } from "../src/types";
const origin = "http://127.0.0.1:4173/test-atlas/";
function sample(id: string, values: number[] = []): Result {
  const a = assessments.find((a) => a.id === id)!;
  return {
    id: "seed",
    testId: id,
    testVersion: a.version,
    scoringVersion: a.scoringVersion,
    reportVersion: a.reportVersion,
    contentHash: a.contentHash,
    completedAt: "2026-11-13T00:00:00Z",
    scores: Object.fromEntries(
      a.dimensions.map((d, i) => [d.id, values[i] ?? 50]),
    ),
  };
}
async function seed(page, result: Result) {
  await page.goto(origin);
  await page.evaluate(
    (result) =>
      localStorage.setItem(
        "test_atlas_v1",
        JSON.stringify({
          schemaVersion: 1,
          revision: 1,
          drafts: {},
          results: [result],
        }),
      ),
    result,
  );
  await page.goto(origin + `#/results/${result.id}`);
  await page.reload();
}
test("every report includes distinct context, scenarios, reflection and experiment", async ({
  page,
}) => {
  await seed(page, sample("decision", [90, 20, 30, 50]));
  await expect(
    page.getByRole("heading", { name: "Your patterns in everyday life" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "A seven-day experiment" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your decision compass" }),
  ).toBeVisible();
  await page.getByLabel("Language / 语言").selectOption("zh");
  await expect(page.getByRole("heading", { name: "七天小实验" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "你的决策罗盘" }),
  ).toBeVisible();
});
test("career interests show real occupation sources and next steps", async ({
  page,
}) => {
  await seed(page, sample("career-interest", [100, 10, 10, 10, 10, 10]));
  await expect(
    page.getByRole("heading", { name: "Career directions to investigate" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Electrician", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(
      'a[href="https://www.onetonline.org/link/summary/47-2111.00"]',
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your RIASEC interest landscape" }),
  ).toBeVisible();
});
test("animal role portraits appear and share images contain original visual art", async ({
  page,
}) => {
  await seed(page, sample("animal", [90, 10, 30]));
  await expect(page.locator(".character-portrait svg")).toHaveCount(3);
  await expect(page.locator(".character-card.leading")).toHaveCount(1);
  await page
    .getByRole("checkbox", { name: "Include my dimension scores in the image" })
    .check();
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save share card" }).click();
  expect((await event).suggestedFilename()).toContain("animal");
});
test("published original reports survive expanded questionnaire versions", async ({
  page,
}) => {
  const a = archivedAssessments.find((a) => a.id === "strengths")!;
  await seed(page, {
    id: "old-report",
    testId: a.id,
    testVersion: a.version,
    scoringVersion: a.scoringVersion,
    reportVersion: a.reportVersion,
    contentHash: a.contentHash,
    scores: Object.fromEntries(a.dimensions.map((d) => [d.id, 75])),
  });
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "original questionnaire version" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "A seven-day experiment" }),
  ).toBeVisible();
});
test("invitation takes a new visitor through assessment into partner report", async ({
  page,
}) => {
  const a = assessments.find((a) => a.id === "attachment")!;
  const payload = encodeInvite(a, sample(a.id, [75, 25]));
  await page.goto(origin + `#/compare?invite=${payload}&mode=couple`);
  await expect(
    page.getByRole("heading", { name: "You have been invited" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Take the same assessment and return" })
    .click();
  for (let i = 0; i < 12; i++) {
    await page.getByRole("radio", { name: "Agree", exact: true }).check();
    await page
      .getByRole("button", {
        name: i === 11 ? "Read my report" : "Next question",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Your two-person relationship map" }),
  ).toBeVisible();
  expect(page.url()).toContain("/compare?invite=");
  await expect(
    page
      .getByText("Discuss reassurance, space, and a clear time to reconnect.", {
        exact: true,
      })
      .first(),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("test_atlas_v1")!).results.length,
    ),
  ).toBe(1);
});
test("score-bearing invitations require explicit consent and have a copy fallback", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", { value: undefined }),
  );
  await seed(page, sample("animal", [90, 10, 30]));
  await expect(
    page.getByRole("button", { name: "Copy invitation", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("checkbox", {
      name: "I agree to include these scores in an invitation link.",
    })
    .check();
  await page
    .getByRole("button", { name: "Copy invitation", exact: true })
    .click();
  await expect(
    page.getByLabel("Copy invitation link", { exact: true }),
  ).toHaveValue(/#\/compare\?invite=/);
  await page
    .getByRole("checkbox", {
      name: "I agree to include these scores in an invitation link.",
    })
    .uncheck();
  await expect(
    page.getByLabel("Copy invitation link", { exact: true }),
  ).toHaveCount(0);
});
test("an invalid invitation cannot silently use a different assessment", async ({
  page,
}) => {
  await page.goto(origin + "#/compare?invite=garbage&mode=couple");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Take the same assessment and return" }),
  ).toHaveCount(0);
});
test("friends can guess preferences and download a report with an optional agreement", async ({
  page,
}) => {
  const a = assessments.find((a) => a.id === "animal")!;
  const me = sample(a.id, [90, 20, 30]);
  await seed(page, me);
  const payload = encodeInvite(a, sample(a.id, [15, 85, 25]));
  await page.goto(origin + `#/compare?invite=${payload}&mode=friend`);
  await page.reload();
  await expect(page.locator(".insight-card")).toHaveCount(0);
  await page.getByLabel("Your guess", { exact: true }).selectOption("D2");
  await page.getByRole("button", { name: "Reveal their pattern" }).click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "among their leading preferences" }),
  ).toBeVisible();
  await expect(page.locator(".insight-card")).toHaveCount(3);
  await page
    .getByLabel("Our agreement (optional, stays on this page)")
    .fill("Try a quiet walk first, then ask before changing the plan.");
  const event = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download our two-person report" })
    .click();
  const download = await event;
  expect(download.suggestedFilename()).toContain("friend-report.txt");
  await page.getByLabel("Discussion mode").selectOption("couple");
  await expect(
    page.getByRole("heading", { name: "Make one shared agreement" }),
  ).toBeVisible();
});
test("expanded strengths and conflict reveal their source boundaries in both languages", async ({
  page,
}) => {
  await page.goto(origin + "#/tests/strengths");
  await expect(
    page.getByText("72 questions", { exact: false }).first(),
  ).toBeVisible();
  await page
    .getByText("What this questionnaire measures — and what it does not", {
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Coverage", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Language / 语言").selectOption("zh");
  await expect(
    page.getByRole("heading", { name: "内容覆盖", exact: true }),
  ).toBeVisible();
});
