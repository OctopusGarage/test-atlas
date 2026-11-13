import { mkdir } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import sharp from "sharp";
import { assessments } from "../src/data/assessments";

// Run against a built preview: SCREENSHOT_BASE_URL=http://127.0.0.1:4174/test-atlas/ pnpm screenshots
const base = (process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:4174/test-atlas/").replace(/\/?$/, "/");
const output = new URL("../docs/images/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
    locale: "en-US",
    timezoneId: "UTC",
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  async function settle() {
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator(".route-scene")).toHaveAttribute("data-motion", "reduced");
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect.poll(() => page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" || a.pending).length)).toBe(0);
  }
  async function save(name: string, pixels: Buffer) {
    const image = sharp(pixels);
    const metadata = await image.metadata();
    if ((metadata.width ?? 0) < 2880) throw new Error(`${name}: expected native 2880px capture, received ${metadata.width}px`);
    await image.png({ compressionLevel: 9, effort: 10 }).toFile(new URL(name, output).pathname);
    console.log(`${name}: ${metadata.width} × ${metadata.height}, native 2× PNG`);
  }
  await page.goto(base + "#/?lang=en");
  await settle();
  await save("home.png", await page.screenshot({ fullPage: false, scale: "device" }));

  const assessment = assessments.find((a) => a.id === "animal")!;
  await page.evaluate((a) => {
    localStorage.setItem("test_atlas_v1", JSON.stringify({
      schemaVersion: 1,
      revision: 1,
      drafts: {},
      results: [{
        id: "readme-characters",
        testId: a.id,
        testVersion: a.version,
        scoringVersion: a.scoringVersion,
        reportVersion: a.reportVersion,
        contentHash: a.contentHash,
        completedAt: "2026-11-13T00:00:00Z",
        scores: Object.fromEntries(a.dimensions.map((d, i) => [d.id, [90, 20, 30][i] ?? 50])),
      }],
    }));
  }, assessment);
  await page.goto(base + "#/results/readme-characters?lang=en");
  await page.reload();
  await settle();
  const visual = page.locator(".result-visual.view-characters");
  await expect(visual.locator(".character-card")).toHaveCount(3);
  await expect(visual.locator("h2")).toBeVisible();
  // The report column is intentionally 850 CSS px wide. Keep its actual layout
  // and surrounding paper, cropping vertically to the visualization and title.
  const clip = await visual.evaluate((node) => {
    const bounds = node.getBoundingClientRect();
    const top = Math.max(0, Math.floor(bounds.top + window.scrollY) - 32);
    return { x: 0, y: top, width: 1440, height: Math.ceil(bounds.bottom + window.scrollY - top) + 32 };
  });
  await save("characters.png", await page.screenshot({ fullPage: true, clip, scale: "device" }));
  await context.close();
} finally {
  await browser.close();
}
