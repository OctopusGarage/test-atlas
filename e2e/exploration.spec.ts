import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import jsQR from "jsqr";
import { assessments } from "../src/data/assessments";
import { getLocalizedAssessment } from "../src/i18n";
const origin = "http://127.0.0.1:4173/test-atlas/";
async function complete(page, count: number) {
  for (let i = 0; i < count; i++) {
    await page
      .getByRole("radio", {
        name: i % 3 === 0 ? "Strongly agree" : "Agree",
        exact: true,
      })
      .check();
    await page
      .getByRole("button", {
        name: i === count - 1 ? "Read my report" : "Next question",
        exact: true,
      })
      .click();
  }
}
for (const a of assessments)
  test(`English assessment journey: ${a.id}`, async ({ page, browserName }) => {
    test.setTimeout(Math.max(30_000, a.questions.length * 1_000));
    test.skip(
      browserName !== "chromium",
      "All content paths checked in Chromium; common journeys cover all engines",
    );
    await page.goto(origin + `#/tests/${a.id}`);
    await expect(
      page.getByRole("heading", {
        name: getLocalizedAssessment(a).name,
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Start exploring", exact: true })
      .click();
    await complete(page, a.questions.length);
    await expect(
      page.getByRole("heading", {
        name: "Your dimensions at a glance",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Export result JSON", exact: true }),
    ).toBeVisible();
    const record = await page.evaluate(
      () => JSON.parse(localStorage.getItem("test_atlas_v1")!).results[0],
    );
    expect(record.testId).toBe(a.id);
    expect(Object.keys(record.scores)).toHaveLength(a.dimensions.length);
    expect(record.answers).toBeUndefined();
    if (a.dimensions.length > 5) {
      await page
        .getByRole("checkbox", {
          name: "Include my dimension scores in the image",
        })
        .check();
      const event = page.waitForEvent("download");
      await page
        .getByRole("button", { name: "Save share card", exact: true })
        .click();
      const download = await event;
      const { data, info } = await sharp(await download.path())
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      expect(info.height).toBeGreaterThan(1350);
      expect(
        jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data,
      ).toBe(
        `https://octopusgarage.github.io/test-atlas/#/tests/${a.id}?lang=en`,
      );
    }
  });
test("default English, language switching, linked language and draft persistence", async ({
  page,
}) => {
  await page.goto(origin + "#/tests/attachment?lang=en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page
    .getByRole("button", { name: "Start exploring", exact: true })
    .click();
  await page.getByRole("radio", { name: "Agree", exact: true }).check();
  await page
    .getByRole("button", { name: "Next question", exact: true })
    .click();
  await page.getByLabel("Language / 语言").selectOption("zh");
  await expect(page.getByText("02 / 12")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "下一题", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByText("02 / 12")).toBeVisible();
  await page.getByLabel("Language / 语言").selectOption("en");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("02 / 12")).toBeVisible();
});
test("voluntary result export/import compares without copying into history", async ({
  page,
}) => {
  await page.goto(origin + "#/tests/attachment");
  await page
    .getByRole("button", { name: "Start exploring", exact: true })
    .click();
  await complete(page, 12);
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export result JSON" }).click();
  const download = await event;
  const text = await readFile(await download.path(), "utf8");
  const parsed = JSON.parse(text);
  expect(parsed.answers).toBeUndefined();
  expect(parsed.completedAt).toBeUndefined();
  expect(parsed.id).toBeUndefined();
  await page
    .getByRole("link", { name: "Compare", exact: true })
    .first()
    .click();
  await page.getByLabel("Import result JSON (64 KiB maximum)").setInputFiles({
    name: "result.json",
    mimeType: "application/json",
    buffer: Buffer.from(text),
  });
  await page.getByText("See score details", { exact: true }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(
    page.getByText("Your friendship challenge", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Discussion mode").selectOption("couple");
  await expect(
    page.getByText("Your two-person relationship map", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("test_atlas_v1")!).results.length,
    ),
  ).toBe(1);
  await page.getByLabel("Import result JSON (64 KiB maximum)").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ ...parsed, scores: { bad: 100 } })),
  });
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await page.getByRole("link", { name: "My atlas", exact: true }).click();
  await expect(
    page.getByText("1 / 25 assessments explored", { exact: false }),
  ).toBeVisible();
});
test("catalog covers all categories in both languages and preserves filters", async ({
  page,
}) => {
  await page.goto(origin + "#/tests");
  await expect(page.locator(".test-card")).toHaveCount(25);
  await page
    .getByRole("button", { name: "Career & growth", exact: true })
    .click();
  await expect(page.locator(".test-card")).toHaveCount(6);
  await page.getByLabel("Language / 语言").selectOption("zh");
  await expect(
    page.getByRole("button", { name: "职业成长", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByPlaceholder("搜索你想了解的自己").fill("Decision approaches");
  await expect(page.locator(".test-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "决策方式探索" }),
  ).toBeVisible();
});
