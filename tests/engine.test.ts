import { describe, it, expect } from "vitest";
import { score } from "../src/engine/score";
import { assessments, validateDefinition } from "../src/data/assessments";
const fixture = {
  dimensions: [{ id: "x" }],
  questions: [
    { id: "a", dimension: "x" },
    { id: "b", dimension: "x", reverse: true },
  ],
};
describe("deterministic scoring", () => {
  it("reverses keys and normalizes endpoints", () => {
    expect(score(fixture, { a: 5, b: 1 }).x).toBe(100);
    expect(score(fixture, { a: 1, b: 5 }).x).toBe(0);
  });
  it("retains midpoint without manufacturing a type", () =>
    expect(score(fixture, { a: 3, b: 3 })).toEqual({ x: 50 }));
  it.each([
    {},
    { a: 0, b: 2 },
    { a: NaN, b: 2 },
    { a: 2, b: 6 },
    { a: 2, b: "3" },
    { a: 2, b: 3, unknown: 1 },
  ])("rejects invalid answer set %j", (answers) =>
    expect(() => score(fixture, answers)).toThrow(),
  );
  it("has complete, valid content for every assessment", () => {
    expect(assessments).toHaveLength(25);
    assessments.forEach(validateDefinition);
    expect(assessments[0].questions).toHaveLength(50);
  });
  it("rejects duplicate question IDs", () =>
    expect(() =>
      validateDefinition({
        ...fixture,
        id: "bad",
        version: 1,
        questions: [fixture.questions[0], fixture.questions[0]],
      }),
    ).toThrow());
  it("scores each real bank reproducibly", () =>
    assessments.forEach((a) => {
      const answers = Object.fromEntries(a.questions.map((q) => [q.id, 3]));
      expect(Object.values(score(a, answers))).toEqual(
        a.dimensions.map(() => 50),
      );
    }));
});
it("preserves IPIP five-factor direction using independent all-high fixture", () => {
  const a = assessments[0];
  const answers = Object.fromEntries(a.questions.map((q) => [q.id, 5]));
  expect(score(a, answers)).toEqual({ E: 50, A: 60, C: 60, S: 20, O: 70 });
  expect(Object.values(answers).every((v) => v === 5)).toBe(true);
});
