import { it, expect } from "vitest";
import { assessments } from "../src/data/assessments";
import { getPresentation } from "../src/engine/presentation";
import { recommendNext } from "../src/engine/recommendations";
import { careerSuggestions } from "../src/engine/careers";
import type { Result } from "../src/types";
function result(id: string, values: number[]): Result {
  const a = assessments.find((x) => x.id === id)!;
  return {
    id: "r",
    testId: id,
    testVersion: a.version,
    scoringVersion: a.scoringVersion,
    reportVersion: a.reportVersion,
    contentHash: a.contentHash,
    completedAt: "2026-11-13",
    scores: Object.fromEntries(
      a.dimensions.map((d, i) => [d.id, values[i] ?? 50]),
    ),
  };
}
it("gives every topic an intentional presentation and uses more than bars", () => {
  expect(
    new Set(assessments.map((a) => getPresentation(a.id).kind)).size,
  ).toBeGreaterThan(6);
  expect(getPresentation("animal").kind).toBe("characters");
  expect(getPresentation("career-interest").kind).toBe("hexagon");
  expect(getPresentation("social-energy").kind).toBe("battery");
});
it("recommends different follow-ups from different response patterns", () => {
  const sensitive = result("attachment", [90, 20]),
    distance = result("attachment", [20, 90]);
  const first = recommendNext(assessments, [sensitive], sensitive);
  const second = recommendNext(assessments, [distance], distance);
  expect(first[0].assessment.id).not.toBe(second[0].assessment.id);
  expect(first.every((r) => r.reason.en && r.reason.zh)).toBe(true);
  expect(first.some((r) => r.assessment.id === "attachment")).toBe(false);
});
it("does not use an incompatible past score for recommendations", () => {
  const old = { ...result("attachment", [100, 0]), contentHash: "old" };
  expect(recommendNext(assessments, [old], old)[0].evidence).toBeUndefined();
});
it("career examples respond to interest dimensions without promising employment", () => {
  const a = assessments.find((a) => a.id === "career-interest")!;
  const practical = careerSuggestions(
    a,
    result(a.id, [100, 10, 10, 10, 10, 10]),
  );
  const creative = careerSuggestions(
    a,
    result(a.id, [10, 10, 100, 10, 10, 10]),
  );
  expect(practical[0].code).not.toBe(creative[0].code);
  expect(practical[0].source).toMatch(/^https:\/\/www.onetonline.org/);
  expect(practical[0].exercise.en).toBeTruthy();
});
it("preserves tied career interests without pretending a unique fit", () => {
  const a = assessments.find((a) => a.id === "career-interest")!;
  const roles = careerSuggestions(a, result(a.id, [50, 50, 50, 50, 50, 50]));
  expect(new Set(roles.map((r) => r.dimension)).size).toBe(6);
});
it("keeps the original versions readable when questionnaire coverage expands", async () => {
  const { archivedAssessments, resolveAssessment } =
    await import("../src/data/assessments");
  expect(archivedAssessments.map((a) => a.id)).toEqual(expect.arrayContaining([
    "conflict", "strengths",
  ]));
  for (const a of archivedAssessments) {
    const r: Result = {
      id: "saved",
      testId: a.id,
      testVersion: a.version,
      scoringVersion: a.scoringVersion,
      reportVersion: a.reportVersion,
      contentHash: a.contentHash,
      scores: Object.fromEntries(a.dimensions.map((d) => [d.id, 50])),
    };
    expect(resolveAssessment(r)).toBe(a);
    expect(assessments.find((x) => x.id === a.id)!.version).toBeGreaterThan(
      a.version,
    );
  }
});
