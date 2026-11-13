import { test, expect } from "@playwright/test";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";

for (const transient of [false, true])
  test(`waiting update requires confirmation and handles transient storage ${transient}`, async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Real service worker update verified in Chromium",
    );
    let revision = 1;
    const root = resolve("dist");
    const server = createServer(async (req, res) => {
      try {
        const pathname = new URL(req.url, "http://localhost").pathname.replace(
          /^\/test-atlas\//,
          "",
        );
        const target = resolve(root, pathname || "index.html");
        if (!target.startsWith(root + "/") && target !== root + "/index.html") {
          res.writeHead(404);
          res.end();
          return;
        }
        let content = await readFile(target);
        if (pathname === "sw.js")
          content = Buffer.concat([
            content,
            Buffer.from(`\n// update-test-revision-${revision}\n`),
          ]);
        const mime = {
          ".js": "text/javascript",
          ".html": "text/html",
          ".css": "text/css",
          ".png": "image/png",
          ".webmanifest": "application/manifest+json",
        };
        res.writeHead(200, {
          "Content-Type": mime[extname(target)] || "application/octet-stream",
          "Cache-Control": "no-store",
        });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end();
      }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const url = `http://127.0.0.1:${server.address().port}/test-atlas/`;
      await page.goto(url + "?lang=zh#/tests/attachment");
      await page.getByRole("button", { name: "开始探索", exact: true }).click();
      if (transient)
        await page.evaluate(() => {
          Storage.prototype.setItem = function () {
            throw Error("quota");
          };
        });
      await page.getByRole("radio", { name: "比较符合", exact: true }).check();
      await page.getByRole("button", { name: "下一题", exact: true }).click();
      await expect(
        page.getByText("已可离线探索", { exact: true }),
      ).toBeVisible();
      revision = 2;
      await page.evaluate(async () => {
        const r = await navigator.serviceWorker.ready;
        await r.update();
      });
      await expect(
        page.getByRole("button", { name: "更新应用 ↗" }),
      ).toBeVisible();
      if (transient)
        await expect(
          page.getByText(
            "新版本已准备好。本次记录仅在内存中，更新会丢失未保存内容。",
          ),
        ).toBeVisible();
      await expect(page.getByText("02 / 12")).toBeVisible();
      page.once("dialog", (d) => d.dismiss());
      await page.getByRole("button", { name: "更新应用 ↗" }).click();
      await expect(
        page.getByRole("button", { name: "更新应用 ↗" }),
      ).toBeVisible();
      page.once("dialog", (d) => d.accept());
      await page.getByRole("button", { name: "更新应用 ↗" }).click();
      await expect(
        page.getByRole("button", { name: "更新应用 ↗" }),
      ).toHaveCount(0);
      await expect(
        page.getByText(transient ? "01 / 12" : "02 / 12"),
      ).toBeVisible();
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
