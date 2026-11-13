import { describe, it, expect } from "vitest";
import { extendedAssessments } from "../src/data/extended-assessments";
const ids = [
  "enneagram",
  "strengths",
  "emotional-intelligence",
  "six-factor",
  "love-expression",
  "romantic-style",
  "conflict",
  "boundaries",
  "communication",
  "psychological-age",
  "animal",
  "villain",
  "survival",
  "online-persona",
  "social-energy",
  "consumption",
  "career-interest",
  "work-style",
  "values",
  "learning",
  "procrastination",
  "decision",
];
describe("original extended content", () => {
  it("covers the remaining 22 topics exactly", () =>
    expect(extendedAssessments.map((a) => a.id).sort()).toEqual(ids.sort()));
  it("has complete bilingual metadata and aligned scoring keys", () => {
    for (const a of extendedAssessments) {
      const en = a.en!;
      for (const key of [
        "name",
        "category",
        "kind",
        "tagline",
        "description",
        "basis",
        "instruction",
      ] as const)
        expect(en[key]?.length, `${a.id}.${key}`).toBeGreaterThan(3);
      expect(en.source.label).toBeTruthy();
      expect(en.source.rights).toBeTruthy();
      expect(en.dimensions.map((d) => d.id)).toEqual(
        a.dimensions.map((d) => d.id),
      );
      expect(en.questions.map((q) => [q.id, q.dimension, q.reverse])).toEqual(
        a.questions.map((q) => [q.id, q.dimension, q.reverse]),
      );
      for (const d of a.dimensions) {
        const qs = a.questions.filter((q) => q.dimension === d.id);
        expect(qs.length).toBeGreaterThanOrEqual(3);
        expect(d.low).not.toEqual(d.high);
        expect(d.action.length).toBeGreaterThan(8);
        const lo = qs.reduce((n, q) => n + (q.reverse ? 5 : 1), 0);
        const hi = qs.reduce((n, q) => n + (q.reverse ? 1 : 5), 0);
        expect(lo).not.toEqual(hi);
      }
      for (const d of en.dimensions)
        for (const k of ["name", "low", "high", "action"])
          expect(d[k]).toBeTruthy();
    }
  });
  it("has no repeated question text in either language", () => {
    for (const locale of ["zh", "en"]) {
      const texts = extendedAssessments.flatMap((a) =>
        (locale === "en" ? a.en!.questions : a.questions).map((q) => q.text),
      );
      expect(new Set(texts).size).toBe(texts.length);
    }
  });
});
