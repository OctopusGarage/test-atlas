import { it, expect } from "vitest";
import { describeDimensionScore, suggestDimensionAction } from "../src/engine/interpretation";
import { buildDeepReport } from "../src/engine/deep-report";
import { assessments } from "../src/data/assessments";
const d = {
  id: "x",
  name: "Example",
  en: "Example",
  low: "LOW",
  high: "HIGH",
  action: "ACTION",
};
it("uses one explicit neutral band without presenting it as a diagnosis", () => {
  expect(describeDimensionScore(d, 58, "en")).toContain("middle");
  expect(describeDimensionScore(d, 50, "en")).toContain("middle");
  expect(describeDimensionScore(d, 90, "en")).toBe("HIGH");
  expect(describeDimensionScore(d, 10, "en")).toBe("LOW");
});
it("offers observation instead of assuming a low or neutral tendency needs correcting", () => {
  for (const locale of ["en", "zh"] as const) {
    const low = suggestDimensionAction(d, 0, locale);
    const middle = suggestDimensionAction(d, 50, locale);
    const high = suggestDimensionAction(d, 100, locale);
    expect(low).not.toContain(d.action);
    expect(middle).not.toContain(d.action);
    expect(high).toContain(d.action);
    expect(low).not.toBe(middle);
    expect(() => suggestDimensionAction(d, NaN, locale)).toThrow();
  }
});
it("does not equate a reverse-keyed low position with low raw agreement", () => {
  const a = assessments.find((a) => a.id === "big-five")!;
  const stability = a.dimensions.find((d) => d.id === "S")!;
  expect(suggestDimensionAction(stability, 20, "en")).not.toMatch(/endorsed these statements less/);
  expect(suggestDimensionAction(stability, 20, "zh")).not.toContain("较少认同这些题目");
});
it("does not prescribe increasing an unwanted lower tendency", () => {
  const a = assessments.find((a) => a.id === "dark-triad")!;
  const r = {
    id: "r",
    testId: a.id,
    testVersion: a.version,
    scoringVersion: a.scoringVersion,
    reportVersion: a.reportVersion,
    contentHash: a.contentHash,
    scores: { strategy: 90, attention: 50, impulse: 10 },
  };
  for (const locale of ["en", "zh"] as const) {
    const report = buildDeepReport(a, r, locale);
    expect(report.combination).not.toMatch(/leaves enough room|更多空间/);
    expect(report.questions.join(" ")).not.toMatch(
      /deserve more space|更多空间/,
    );
  }
});
