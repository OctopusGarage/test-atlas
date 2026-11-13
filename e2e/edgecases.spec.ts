import { test, expect, type Page } from "@playwright/test";
import { assessments } from "../src/data/assessments";
import { encodeInvite } from "../src/engine/social";
import type { Result } from "../src/types";

const origin = "http://127.0.0.1:4173/test-atlas/";
function sample(testId: string, id: string, high = 80): Result {
  const a = assessments.find((a) => a.id === testId)!;
  return {
    id, testId, testVersion: a.version, scoringVersion: a.scoringVersion,
    reportVersion: a.reportVersion, contentHash: a.contentHash,
    completedAt: "2026-11-13T00:00:00Z",
    scores: Object.fromEntries(a.dimensions.map((d, i) => [d.id, i ? 20 : high])),
  };
}
function invite(result: Result, mode = "couple", locale = "en") {
  const a = assessments.find((a) => a.id === result.testId)!;
  return `/compare?invite=${encodeInvite(a, result)}&mode=${mode}&lang=${locale}`;
}
async function changeRoute(page: Page, route: string) {
  await page.evaluate((route) => { location.hash = route; }, route);
  await expect(page).toHaveURL(new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
}
async function seed(page: Page) {
  await page.addInitScript((results) => {
    localStorage.setItem("test_atlas_v1", JSON.stringify({
      schemaVersion: 1, revision: 1, drafts: {}, results,
    }));
  }, [sample("attachment", "own-attachment"), sample("big-five", "own-big-five")]);
}

test("unknown assessment take links show an unavailable assessment without crashing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(origin + "?lang=zh#/tests/not-real/take");
  await expect(page.getByRole("heading", { name: "这片地图还没有开放" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("another invitation clears the previous participant's agreement and game state", async ({ page }) => {
  await seed(page);
  await page.goto(origin + "?lang=en#" + invite(sample("attachment", "friend-a"), "friend"));
  await page.getByLabel("Your guess", { exact: true }).selectOption("anxiety");
  await page.getByRole("button", { name: "Reveal their pattern", exact: true }).click();
  const agreement = page.getByLabel("Our agreement (optional, stays on this page)", { exact: true });
  await agreement.fill("Private agreement with A");
  await changeRoute(page, invite(sample("attachment", "friend-b", 25), "friend"));
  await expect(agreement).toHaveValue("");
  await expect(page.getByLabel("Your guess", { exact: true })).toHaveValue("");
  await expect(page.getByRole("button", { name: "Reveal their pattern", exact: true })).toBeDisabled();
});

test("invitation transitions select the matching own assessment and requested mode", async ({ page }) => {
  await seed(page);
  await page.goto(origin + "?lang=en#" + invite(sample("attachment", "friend-a"), "friend"));
  await expect(page.getByRole("combobox", { name: "Discussion mode", exact: true })).toHaveValue("friend");
  await changeRoute(page, invite(sample("big-five", "friend-b"), "couple"));
  await expect(page.getByRole("combobox", { name: "Discussion mode", exact: true })).toHaveValue("couple");
  await expect(page.getByRole("combobox", { name: "Your result", exact: true })).toHaveValue("own-big-five");
  await expect(page.getByRole("heading", { name: "Make one shared agreement", exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("language-only invitation changes preserve the typed agreement", async ({ page }) => {
  await seed(page);
  await page.goto(origin + "?lang=en#" + invite(sample("attachment", "friend-a")));
  await page.getByLabel("Our agreement (optional, stays on this page)", { exact: true }).fill("Keep our agreement across languages");
  await page.getByLabel("Language / 语言", { exact: true }).selectOption("zh");
  await expect(page.getByLabel("我们的约定（可选，仅留在当前页面）", { exact: true })).toHaveValue("Keep our agreement across languages");
  await expect(page).toHaveURL(/lang=zh/);
});
