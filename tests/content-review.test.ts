import { it, expect } from "vitest";
import { assessments, archivedAssessments, resolveAssessment } from "../src/data/assessments";
import { getLocalizedAssessment } from "../src/i18n";

it("includes both language definitions in every locked content snapshot", () => {
  for (const a of assessments) {
    expect(a.en?.questions).toHaveLength(a.questions.length);
    expect(a.en?.dimensions).toHaveLength(a.dimensions.length);
  }
});

it("preserves willingness rather than claiming enjoyment or actual behavior in reviewed translations", () => {
  for (const [id, questionIds] of [
    ["six-factor", ["D3Q1"]],
    ["career-interest", ["D2Q1", "D3Q3", "D6Q2"]],
    ["work-style", ["D2Q1"]],
    ["strengths", ["D9Q3", "D13Q2"]],
  ] as const) {
    const a = getLocalizedAssessment(assessments.find((a) => a.id === id)!, "en");
    for (const qid of questionIds) {
      const text = a.questions.find((q) => q.id === qid)!.text;
      expect(text).toMatch(/willing/i);
      expect(text).not.toMatch(/enjoy|only observe|only on my progress/i);
    }
  }
});

it("does not infer independent work or material-goods preference from unendorsed statements", () => {
  for (const [id, dim] of [["strengths", "D13"], ["consumption", "D3"]]) {
    const a = getLocalizedAssessment(assessments.find((a) => a.id === id)!, "en");
    const text = a.dimensions.find((d) => d.id === dim)!.low;
    expect(text).not.toMatch(/prefer working independently|lasting practical use/);
    expect(text).toMatch(/endors|statements/i);
  }
});

it("names receiving care separately from expressing it", () => {
  const a = assessments.find((a) => a.id === "love-expression")!;
  expect(a.name).toContain("感受");
  expect(getLocalizedAssessment(a, "en").name).toContain("Receiving");
});

it("does not infer recovery speed or opposite traits from an independent scale", () => {
  const big = getLocalizedAssessment(assessments.find((a) => a.id === "big-five")!, "en");
  expect(big.dimensions.find((d) => d.id === "S")!.high).not.toMatch(/may recover|recover.*more easily/);
  expect(big.dimensions.find((d) => d.id === "S")!.high).toContain("do not measure recovery speed");
  for (const [id, dim, unsupported] of [
    ["decision", "D4", /thinking a choice through/],
    ["work-style", "D3", /adapting to change/],
    ["communication", "D3", /concise information|factual lists/],
    ["emotional-intelligence", "D3", /offer explanations or advice/],
  ] as const) {
    const a = getLocalizedAssessment(assessments.find((a) => a.id === id)!, "en");
    expect(a.dimensions.find((d) => d.id === dim)!.low).not.toMatch(unsupported);
  }
});

it("keeps every replaced content snapshot resolvable without applying new items", () => {
  for (const old of archivedAssessments) {
    const result = {
      id: "old", testId: old.id, testVersion: old.version,
      scoringVersion: old.scoringVersion, reportVersion: old.reportVersion,
      contentHash: old.contentHash,
      scores: Object.fromEntries(old.dimensions.map((d) => [d.id, 50])),
    };
    expect(resolveAssessment(result)).toBe(old);
    expect(assessments.find((a) => a.id === old.id)!.version).toBeGreaterThan(old.version);
  }
});
