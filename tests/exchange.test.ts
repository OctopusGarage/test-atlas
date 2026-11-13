import { describe, it, expect } from "vitest";
import { encodeResult, decodeResult } from "../src/engine/exchange";
const a = {
  id: "a",
  version: 1,
  scoringVersion: 1,
  reportVersion: 1,
  contentHash: "hash",
  dimensions: [{ id: "x" }],
};
const r = {
  testId: "a",
  testVersion: 1,
  scoringVersion: 1,
  reportVersion: 1,
  contentHash: "hash",
  scores: { x: 55 },
  answers: { private: 4 },
  completedAt: "private",
};
describe("voluntary result exchange", () => {
  it("round trips scores without private answers or dates", () => {
    const text = encodeResult(a, r);
    expect(text).not.toContain("private");
    expect(decodeResult(text, [a]).scores).toEqual({ x: 55 });
  });
  it("rejects unknown, dangerous, missing and out of range data", () => {
    const base = JSON.parse(encodeResult(a, r));
    for (const payload of [
      { ...base, answers: {} },
      { ...base, scores: { x: 101 } },
      { ...base, scores: {} },
      { ...base, contentHash: "old" },
      JSON.parse('{"__proto__":{},"schema":"test-atlas-result/1"}'),
    ])
      expect(() => decodeResult(JSON.stringify(payload), [a])).toThrow();
  });
  it("bounds file size before parsing", () =>
    expect(() => decodeResult(" ".repeat(65537), [a])).toThrow());
});
