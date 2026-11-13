import { describe, expect, it } from "vitest";
import { assessments } from "../src/data/assessments";
import { getLocalizedAssessment } from "../src/i18n";
import { score } from "../src/engine/score";
import { buildDeepReport } from "../src/engine/deep-report";
import { buildSocialReport } from "../src/engine/social";
import { leadingDimensions } from "../src/engine/insights";
import type { Assessment, Question, Result } from "../src/types";

// Deterministic rule evaluations, not AI judgments or evidence of psychometric
// validity. Translation meaning requires a separate bilingual editorial review.
// The oracle uses explicit response-position tables rather than the engine's
// reverse-then-normalize calculation. Every item contributes equal weight.
const positions = [0, 0, 25, 50, 75, 100];
const reversedPositions = [0, 100, 75, 50, 25, 0];
function oracle(a: Assessment, answers: Record<string, number>) {
  return Object.fromEntries(a.dimensions.map((d) => {
    const items = a.questions.filter((q) => q.dimension === d.id);
    const total = items.reduce((sum, q) => sum + (q.reverse ? reversedPositions : positions)[answers[q.id]], 0);
    return [d.id, total / items.length];
  }));
}
const answersFor = (a: Assessment, value: (q: Question, i: number) => number) =>
  Object.fromEntries(a.questions.map((q, i) => [q.id, value(q, i)]));
function randomProfile(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return 1 + seed % 5;
  };
}
const profiles = [
  { name: "keyed minimum", value: (q: Question) => q.reverse ? 5 : 1 },
  { name: "keyed maximum", value: (q: Question) => q.reverse ? 1 : 5 },
  { name: "neutral", value: () => 3 },
  { name: "raw disagreement", value: () => 1 },
  { name: "raw agreement", value: () => 5 },
  { name: "alternating endpoints", value: (_q: Question, i: number) => i % 2 ? 5 : 1 },
  ...[7, 42, 2026].map((seed) => ({ name: `seed ${seed}`, seed, value: () => 3 })),
];
function result(a: Assessment, scores: Record<string, number>): Result {
  return { id: "evaluation", testId: a.id, testVersion: a.version,
    scoringVersion: a.scoringVersion, reportVersion: a.reportVersion,
    contentHash: a.contentHash, scores };
}
const flatResult = (a: Assessment, n: number) => result(a, Object.fromEntries(a.dimensions.map((d) => [d.id, n])));

describe("repeatable assessment rule evaluation matrix (not a scientific validation)", () => {
  it("pins the complete catalog rather than silently evaluating a reduced set", () => {
    expect(assessments).toHaveLength(25);
    expect(new Set(assessments.map((a) => a.id)).size).toBe(25);
  });
  for (const original of assessments) {
    for (const locale of ["en", "zh"] as const) {
      const a = getLocalizedAssessment(original, locale);
      describe(`${original.id} / ${locale}`, () => {
        it("preserves item identity, dimension assignment, direction and version across translation", () => {
          const identity = (q: Question) => ({ id: q.id, dimension: q.dimension, reverse: !!q.reverse });
          expect(a.questions.map(identity)).toEqual(original.questions.map(identity));
          expect(a.dimensions.map((d) => d.id)).toEqual(original.dimensions.map((d) => d.id));
          expect([a.version, a.scoringVersion, a.reportVersion, a.contentHash]).toEqual(
            [original.version, original.scoringVersion, original.reportVersion, original.contentHash]);
          expect(new Set(a.questions.map((q) => q.id)).size).toBe(a.questions.length);
          for (const d of a.dimensions) expect(a.questions.some((q) => q.dimension === d.id)).toBe(true);
          if (locale === "en") {
            expect(a.questions.every((q, i) => q.text !== original.questions[i].text)).toBe(true);
          }
        });
        for (const profile of profiles) {
          it(`matches the independent item-position oracle for ${profile.name}`, () => {
            const value = "seed" in profile ? randomProfile(profile.seed!) : profile.value;
            const answers = answersFor(a, value);
            const expected = oracle(original, answers);
            const actual = score(a, answers);
            for (const d of a.dimensions) {
              expect(actual[d.id]).toBeCloseTo(expected[d.id], 10);
              expect(actual[d.id]).toBeGreaterThanOrEqual(0);
              expect(actual[d.id]).toBeLessThanOrEqual(100);
              if (profile.name === "keyed minimum") expect(actual[d.id]).toBe(0);
              if (profile.name === "keyed maximum") expect(actual[d.id]).toBe(100);
              if (profile.name === "neutral") expect(actual[d.id]).toBe(50);
            }
            // Reordering input and complementing responses must not change
            // membership or direction, and complementary scores sum to 100.
            expect(score({ ...a, questions: [...a.questions].reverse() }, answers)).toEqual(actual);
            const complement = score(a, Object.fromEntries(Object.entries(answers).map(([id, n]) => [id, 6 - n])));
            for (const d of a.dimensions) expect(actual[d.id] + complement[d.id]).toBeCloseTo(100, 10);
          });
        }
        it("keeps neutral and both endpoint flat profiles tied without presenting neutral as an endpoint", () => {
          const before = JSON.stringify(a);
          for (const n of [0, 50, 100]) {
            const r = flatResult(a, n);
            const report = buildDeepReport(original, r, locale);
            expect(leadingDimensions(a, r).map((d) => d.id)).toEqual(a.dimensions.map((d) => d.id));
            expect(report.experiment.tailored.map((x) => x.dimension)).toEqual(a.dimensions.map((d) => d.name));
            expect(report.combination).toContain(locale === "en" ? "no single leading style" : "没有单一领先风格");
            for (const d of a.dimensions) {
              const reading = report.interpretations.find((x) => x.id === d.id)!;
              expect(reading.score).toBe(n);
              if (n === 0) expect(reading.text).toBe(d.low);
              if (n === 100) expect(reading.text).toBe(d.high);
              if (n === 50) {
                expect(reading.text).not.toBe(d.low);
                expect(reading.text).not.toBe(d.high);
                expect(reading.text).toContain(locale === "en" ? "neither endpoint" : "没有明确偏向任一端");
              }
            }
          }
          expect(JSON.stringify(a)).toBe(before);
        });
        it("preserves every tied leader and orders social differences by magnitude with correct direction", () => {
          const ids = a.dimensions.map((d) => d.id);
          const tied = result(a, Object.fromEntries(ids.map((id, i) => [id, i < 2 ? 90 : 10])));
          expect(leadingDimensions(a, tied).map((d) => d.id)).toEqual(ids.slice(0, 2));
          const report = buildDeepReport(original, tied, locale);
          if (ids.length > 2) {
            for (const d of a.dimensions.slice(0, 2)) expect(report.combination).toContain(d.name);
          } else {
            expect(report.combination).toContain(locale === "en" ? "no single leading style" : "没有单一领先风格");
          }
          const neutral = flatResult(a, 50);
          const partner = result(a, Object.fromEntries(ids.map((id, i) => [id, i === 0 ? 100 : i === 1 ? 0 : 75])));
          const before = JSON.stringify([neutral, tied, partner]);
          for (const mode of ["friend", "couple"] as const) {
            const social = buildSocialReport(a, neutral, partner, mode, locale);
            const swapped = buildSocialReport(a, partner, neutral, mode, locale);
            expect(new Set(social.cards.map((c) => c.id))).toEqual(new Set(ids));
            for (const [i, card] of social.cards.entries()) {
              expect(card.first).toBe(50);
              expect(card.second).toBe(partner.scores[card.id]);
              expect(card.difference).toBe(partner.scores[card.id] - 50);
              expect(card.gap).toBe(card.id === ids[0] || card.id === ids[1] ? 50 : 25);
              expect(card.firstText).not.toBe(a.dimensions.find((d) => d.id === card.id)!.high);
              expect(swapped.cards.find((c) => c.id === card.id)!.difference).toBe(-card.difference);
              if (i) expect(social.cards[i - 1].gap).toBeGreaterThanOrEqual(card.gap);
            }
            const same = buildSocialReport(a, neutral, neutral, mode, locale);
            expect(same.cards.every((c) => c.gap === 0)).toBe(true);
            expect(same.cards[0].theme).not.toBe(social.cards[0].theme);
          }
          expect(JSON.stringify([neutral, tied, partner])).toBe(before);
        });
      });
    }
  }
});
