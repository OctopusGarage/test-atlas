import { test, expect } from "@playwright/test";
import sharp from "sharp";
import jsQR from "jsqr";
async function verifyCard(page, id) {
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "保存分享卡片" }).click();
  const download = await event;
  expect(download.suggestedFilename()).toMatch(/\.png$/);
  const { data, info } = await sharp(await download.path())
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  expect([info.width, info.height]).toEqual([1080, 1350]);
  const qr = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  expect(qr?.data).toBe(
    `https://octopusgarage.github.io/test-atlas/#/tests/${id}?lang=zh`,
  );
}
const begin = async (page, id = "attachment") => {
  await page.goto(`#/tests/${id}`);
  await page.getByRole("button", { name: "开始探索", exact: true }).click();
};
const finish = async (page, count = 12) => {
  for (let i = 0; i < count; i++) {
    await page.getByRole("radio", { name: "比较符合", exact: true }).check();
    await page
      .getByRole("button", {
        name: i === count - 1 ? "生成我的报告" : "下一题",
        exact: true,
      })
      .click();
  }
};
test("catalog filters and searches", async ({ page }) => {
  await page.goto("");
  await expect(
    page.getByRole("heading", { name: /循着好奇，\s*认识自己。/ }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "全部测试", exact: true })
    .first()
    .click();
  await page.getByPlaceholder("搜索你想了解的自己").fill("依恋");
  await expect(
    page.getByRole("heading", { name: "依恋倾向", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "大五人格", exact: true }),
  ).toHaveCount(0);
});
test("draft survives reload, completes, exports and deletes history", async ({
  page,
}) => {
  await begin(page);
  await page.getByRole("radio", { name: "比较符合", exact: true }).check();
  await page.getByRole("button", { name: "下一题", exact: true }).click();
  await page.reload();
  await expect(page.getByText("02 / 12")).toBeVisible();
  await page.getByRole("button", { name: "上一题", exact: true }).click();
  await finish(page);
  await expect(
    page.getByRole("heading", { name: "你的关系感受地图" }),
  ).toBeVisible();
  await expect(
    page.locator("summary").filter({ hasText: "回应敏感" }),
  ).toBeVisible();
  await verifyCard(page, "attachment");
  await page
    .getByRole("link", { name: "我的记录", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "删除这条记录" }).click();
  await page.getByRole("button", { name: "确认删除", exact: true }).click();
  await expect(page.getByText("还没有留下探索记录")).toBeVisible();
});
test("invalid result is handled", async ({ page }) => {
  await page.goto("#/results/no-such-result");
  await expect(
    page.getByRole("heading", { name: "这份记录暂时找不到了" }),
  ).toBeVisible();
});
test("blocked storage reports limitation without breaking flow", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw Error("blocked");
      },
    });
  });
  await begin(page);
  await expect(
    page.getByRole("alert").filter({ hasText: "本地存储不可用" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "中立 / 不确定", exact: true }).check();
  await page.getByRole("button", { name: "下一题", exact: true }).click();
  await expect(page.getByText("02 / 12")).toBeVisible();
});
test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await begin(page, "big-five");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
test("cached app works after offline reload and can complete a report", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Service worker lifecycle verified in Chromium",
  );
  await page.goto("");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((r) =>
        navigator.serviceWorker.addEventListener("controllerchange", r, {
          once: true,
        }),
      );
  });
  await expect(page.getByText("已可离线探索", { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await page
    .getByRole("link", { name: "全部测试", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: /依恋倾向/ }).click();
  await page.getByRole("button", { name: "开始探索", exact: true }).click();
  await finish(page);
  await expect(
    page.getByRole("heading", { name: "你的关系感受地图" }),
  ).toBeVisible();
});
for (const [id, count, heading] of [
  ["big-five", 50, "你的五维性格地图"],
  ["dark-triad", 18, "看见自己的不同侧面"],
])
  test(`${id} completes with all dimensions`, async ({ page }) => {
    test.setTimeout(Math.max(30_000, Number(count) * 1_200));
    await begin(page, id);
    await finish(page, count);
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await page
      .getByRole("checkbox", { name: "在图片中展示我的维度分数" })
      .check();
    await verifyCard(page, id);
  });
test("no unanswered submission and separate drafts", async ({ page }) => {
  await begin(page);
  await expect(
    page.getByRole("button", { name: "下一题", exact: true }),
  ).toBeDisabled();
  await page.getByRole("radio", { name: "很符合", exact: true }).check();
  await page.getByRole("button", { name: "下一题", exact: true }).click();
  await begin(page, "dark-triad");
  await page.getByRole("radio", { name: "很不符合", exact: true }).check();
  await page.goto("#/tests/attachment");
  await page.getByRole("button", { name: "继续上次探索" }).click();
  await expect(page.getByText("02 / 12")).toBeVisible();
});
test("corrupt storage shows warning but still allows exploration", async ({
  page,
}) => {
  await page.goto("");
  await page.evaluate(() => localStorage.setItem("test_atlas_v1", "{broken"));
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("损坏");
  await begin(page);
  await page.getByRole("radio", { name: "很符合", exact: true }).check();
  expect(await page.evaluate(() => localStorage.getItem("test_atlas_v1"))).toBe(
    "{broken",
  );
});
test("unknown test and stale result do not crash", async ({ page }) => {
  await page.goto("#/tests/unknown");
  await expect(
    page.getByRole("heading", { name: "这片地图还没有开放" }),
  ).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem(
      "test_atlas_v1",
      JSON.stringify({
        schemaVersion: 1,
        revision: 1,
        drafts: {},
        results: [
          { id: "old", testId: "big-five", testVersion: 0, scores: { E: 20 } },
        ],
      }),
    ),
  );
  await page.goto("#/results/old");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "这份记录来自另一个版本" }),
  ).toBeVisible();
});
test("delete dialog traps focus and Escape cancels", async ({ page }) => {
  await begin(page);
  await finish(page);
  await page
    .getByRole("link", { name: "我的记录", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "删除这条记录" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "删除这条记录" }),
  ).toBeVisible();
});
test("draft-only user can erase local answers", async ({ page }) => {
  await begin(page);
  await page.getByRole("radio", { name: "很符合", exact: true }).check();
  await page
    .getByRole("link", { name: "我的记录", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "清空本地记录" }).click();
  await page.getByRole("button", { name: "确认删除", exact: true }).click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("test_atlas_v1")).drafts,
    ),
  ).toEqual({});
});
