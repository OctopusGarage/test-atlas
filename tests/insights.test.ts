import { it, expect } from "vitest";
import {
  leadingDimensions,
  compareResults,
  latestResults,
  recommendAssessments,
} from "../src/engine/insights";
const a = {
  id: "a",
  version: 1,
  scoringVersion: 1,
  reportVersion: 1,
  contentHash: "h",
  dimensions: [{ id: "x" }, { id: "y" }],
};
const r = {
  id: "r",
  testId: "a",
  testVersion: 1,
  scoringVersion: 1,
  reportVersion: 1,
  contentHash: "h",
  scores: { x: 50, y: 50 },
  completedAt: "2026-01-01",
};
it("preserves exact ties without picking a winner", () =>
  expect(leadingDimensions(a, r).map((d) => d.id)).toEqual(["x", "y"]));
it("compares matching scales and rejects changed versions", () => {
  expect(
    compareResults(a, r, { ...r, scores: { x: 80, y: 20 } })[0].difference,
  ).toBe(30);
  expect(() => compareResults(a, r, { ...r, testVersion: 2 })).toThrow();
});
it("keeps latest valid record and recommends unexplored assessments", () => {
  const newer = { ...r, id: "new", completedAt: "2026-02-01" };
  expect(
    latestResults([a], [newer, r, { ...newer, testVersion: 0 }])[0].id,
  ).toBe("new");
  expect(
    recommendAssessments([a, { ...a, id: "b" }], [r]).map((x) => x.id),
  ).toEqual(["b"]);
});

it("does not treat obsolete results as completed recommendations", () =>
  expect(
    recommendAssessments([a], [{ ...r, testVersion: 0 }]).map((x) => x.id),
  ).toEqual(["a"]));
