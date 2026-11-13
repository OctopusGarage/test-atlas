import { describe, it, expect } from "vitest";
import {
  getLocalizedAssessment,
  translateError,
  initialLocale,
  replaceLinkedLocale,
} from "../src/i18n";
import { assessments } from "../src/data/assessments";
import { score } from "../src/engine/score";
import { publicLink, cardLayout } from "../src/sharing/card";
describe("localized assessment content", () => {
  it("updates linked locales without changing the route and filters", () => {
    const url = new URL(
      replaceLinkedLocale(
        "https://example.com/app/?lang=zh#/tests?q=work&category=career&lang=zh",
        "en",
      ),
    );
    expect(url.searchParams.get("lang")).toBe("en");
    expect(url.hash).toBe("#/tests?q=work&category=career&lang=en");
    expect(
      replaceLinkedLocale("https://example.com/#/tests/big-five/take", "zh"),
    ).toBe("https://example.com/#/tests/big-five/take");
  });
  it("keeps nine-dimension score cards above the QR block", () => {
    for (const dimensions of [2, 5, 9]) {
      const layout = cardLayout(dimensions, true);
      const lastBarBottom = 450 + (dimensions - 1) * 105 + 32;
      expect(lastBarBottom).toBeLessThan(layout.qrTop);
      expect(layout.qrTop + 160).toBeLessThan(layout.footer);
    }
    expect(cardLayout(5, true).height).toBe(1350);
    expect(cardLayout(9, false).height).toBe(1350);
  });
  it("defaults to English and respects saved preference and linked language", () => {
    const empty = { getItem: () => null } as any;
    const chinese = { getItem: () => "zh" } as any;
    expect(initialLocale("", "", empty)).toBe("en");
    expect(initialLocale("", "", chinese)).toBe("zh");
    expect(initialLocale("#/tests/big-five?lang=en", "", chinese)).toBe("en");
    expect(initialLocale("#/tests/big-five?lang=zh", "", empty)).toBe("zh");
    expect(
      initialLocale("", "", {
        getItem: () => {
          throw Error("blocked");
        },
      } as any),
    ).toBe("en");
  });
  it("defaults to English while preserving scoring identities and hashes", () => {
    for (const base of assessments) {
      const en = getLocalizedAssessment(base);
      expect(en.id).toBe(base.id);
      expect(en.contentHash).toBe(base.contentHash);
      expect(en.questions.map((q) => q.id)).toEqual(
        base.questions.map((q) => q.id),
      );
      expect(en.dimensions.map((d) => d.id)).toEqual(
        base.dimensions.map((d) => d.id),
      );
      expect(en.questions.every((q) => !/[\u4e00-\u9fff]/.test(q.text))).toBe(
        true,
      );
      const answers = Object.fromEntries(base.questions.map((q) => [q.id, 3]));
      expect(score(en, answers)).toEqual(score(base, answers));
      expect(getLocalizedAssessment(base, "zh")).toBe(base);
    }
  });
  it("preserves the language in public links without sharing scores", () => {
    expect(publicLink("big-five")).toContain("?lang=en");
    expect(publicLink("attachment", "zh")).toContain("?lang=zh");
    expect(publicLink("attachment", "zh")).not.toContain("scores");
  });
  it("selects a single language from domain errors", () => {
    expect(translateError("Invalid JSON result file. / JSON 文件无效。")).toBe(
      "Invalid JSON result file.",
    );
    expect(
      translateError("Invalid JSON result file. / JSON 文件无效。", "zh"),
    ).toBe("JSON 文件无效。");
  });
  it("localizes storage errors", () =>
    expect(translateError("其他窗口已修改记录，请刷新后继续。")).toContain(
      "Another window",
    ));
});
it("falls back to the outer language when route filters have no language", () => {
  expect(
    initialLocale("#/tests?q=love&category=relationship", "?lang=zh", {
      getItem: () => null,
    }),
  ).toBe("zh");
});
