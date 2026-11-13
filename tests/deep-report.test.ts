import { describe, expect, it } from "vitest";
import { assessments } from "../src/data/assessments";
import { reportGuides } from "../src/data/report-guides";
import { buildDeepReport } from "../src/engine/deep-report";
import type { Assessment, Result } from "../src/types";
const result = (a: Assessment, values: number[]): Result => ({
  id: "sample",
  testId: a.id,
  testVersion: a.version,
  scoringVersion: a.scoringVersion,
  reportVersion: a.reportVersion,
  contentHash: a.contentHash,
  scores: Object.fromEntries(
    a.dimensions.map((d, i) => [d.id, values[i] ?? 50]),
  ),
});
describe("individual reports", () => {
  it("covers all 25 topics with complete original bilingual guides", () => {
    expect(assessments).toHaveLength(25);
    expect(Object.keys(reportGuides).sort()).toEqual(
      assessments.map((a) => a.id).sort(),
    );
    for (const locale of ["en", "zh"] as const) {
      expect(
        new Set(Object.values(reportGuides).map((g) => g[locale].experiment))
          .size,
      ).toBe(25);
      for (const a of assessments) {
        for (const text of Object.values(reportGuides[a.id][locale])) {
          expect(text.length).toBeGreaterThan(10);
          expect(text).not.toMatch(/TODO|placeholder|待补充/i);
        }
        const report = buildDeepReport(a, result(a, [80, 20]), locale);
        expect(report.scenarios).toHaveLength(2);
        expect(report.experiment.steps).toHaveLength(4);
        expect(report.questions).toHaveLength(2);
      }
    }
  });
  it("changes interpretations, combinations and selected actions with answers for every topic", () => {
    for (const a of assessments) {
      const first = buildDeepReport(a, result(a, [90, 10]), "en");
      const second = buildDeepReport(a, result(a, [10, 90]), "en");
      expect(first.combination).not.toBe(second.combination);
      expect(first.interpretations).not.toEqual(second.interpretations);
      expect(first.experiment.tailored).not.toEqual(second.experiment.tailored);
    }
  });
  it("preserves ties, middle neutrality and original scores", () => {
    const a = assessments[0];
    const r = result(a, []);
    const before = JSON.stringify(r);
    const report = buildDeepReport(a, r, "en");
    expect(report.combination).toContain("no single leading style");
    expect(report.interpretations.every((d) => d.text.includes("middle"))).toBe(
      true,
    );
    expect(JSON.stringify(r)).toBe(before);
    const tied = buildDeepReport(a, result(a, [80, 80, 20]), "en");
    expect(tied.combination).toContain("tied");
  });
  it("rejects missing, stale and invalid results", () => {
    const a = assessments[0];
    const r = result(a, []);
    for (const bad of [
      { ...r, scores: {} },
      { ...r, testVersion: -1 },
      { ...r, scores: { ...r.scores, [a.dimensions[0].id]: NaN } },
    ])
      expect(() => buildDeepReport(a, bad, "en")).toThrow();
  });
});
