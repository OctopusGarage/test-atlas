import { describe, expect, it } from "vitest";
import { assessments } from "../src/data/assessments";
import {
  measurementNotes,
  coveredDimensionNames,
} from "../src/data/measurement-notes";

describe("measurement transparency and topic coverage", () => {
  it("provides bilingual construct boundaries, translation status and limitations for every assessment", () => {
    expect(Object.keys(measurementNotes).sort()).toEqual(
      assessments.map((a) => a.id).sort(),
    );
    for (const assessment of assessments) {
      const note = measurementNotes[assessment.id];
      for (const field of [note.coverage, note.limitations, note.translation]) {
        expect(field.zh.length).toBeGreaterThan(8);
        expect(field.en.length).toBeGreaterThan(20);
      }
      expect(coveredDimensionNames(assessment.id, "en")).toEqual(
        assessment.dimensions.map((d) => d.en),
      );
      expect(note.status).toBe(
        assessment.id === "big-five"
          ? "public-domain-inventory"
          : "original-exploration",
      );
      for (const source of note.references)
        expect(new URL(source.url).protocol).toBe("https:");
    }
  });
  it("represents all 24 strengths independently with three original bilingual scenarios each", () => {
    const a = assessments.find((a) => a.id === "strengths")!;
    expect(a.version).toBe(3);
    expect(a.dimensions).toHaveLength(24);
    expect(new Set(a.dimensions.map((d) => d.en)).size).toBe(24);
    expect(a.questions).toHaveLength(72);
    expect(a.en?.questions).toHaveLength(72);
    for (const d of a.dimensions) {
      expect(a.questions.filter((q) => q.dimension === d.id)).toHaveLength(3);
      expect(a.en?.questions.filter((q) => q.dimension === d.id)).toHaveLength(
        3,
      );
    }
    expect(
      measurementNotes.strengths.references.some(
        (r) => r.url === "https://ipip.ori.org/newVIAKey.htm",
      ),
    ).toBe(true);
  });
  it("includes accommodation and compromise as separate conflict responses", () => {
    const a = assessments.find((a) => a.id === "conflict")!;
    expect(a.version).toBe(3);
    expect(a.dimensions.map((d) => d.en)).toEqual([
      "Taking space",
      "Firm advocacy",
      "Mutual compromise",
      "Collaborative repair",
      "Accommodation",
    ]);
    expect(a.questions).toHaveLength(15);
  });
});
