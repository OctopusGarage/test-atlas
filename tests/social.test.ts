import { describe, it, expect } from "vitest";
import {
  encodeInvite,
  decodeInvite,
  buildSocialReport,
  validateSocialReturn,
} from "../src/engine/social";
import { assessments } from "../src/data/assessments";
const a = assessments[0];
const result = (n: number) => ({
  testId: a.id,
  testVersion: a.version,
  scoringVersion: a.scoringVersion,
  reportVersion: a.reportVersion,
  contentHash: a.contentHash,
  scores: Object.fromEntries(a.dimensions.map((d, i) => [d.id, n + i])),
});
describe("consensual social invitations", () => {
  it("round trips minimal scores", () => {
    const encoded = encodeInvite(a, {
      ...result(30),
      id: "secret",
      completedAt: "secret",
    } as any);
    expect(decodeInvite(encoded, assessments).scores).toEqual(
      result(30).scores,
    );
    expect(atob(encoded.replace(/-/g, "+").replace(/_/g, "/"))).not.toContain(
      "secret",
    );
  });
  it("rejects invalid, oversized, prototype, NaN and stale payloads", () => {
    for (const s of [
      "abc",
      "x".repeat(12001),
      btoa('{"__proto__":{}}'),
      btoa(
        JSON.stringify({
          ...result(20),
          schema: "test-atlas-result/1",
          scores: { x: null },
        }),
      ),
    ])
      expect(() => decodeInvite(s, assessments)).toThrow();
    expect(() => encodeInvite(a, { ...result(20), testVersion: 99 })).toThrow();
    expect(() =>
      encodeInvite(a, {
        ...result(20),
        scores: { ...result(20).scores, [a.dimensions[0].id]: NaN },
      }),
    ).toThrow();
  });
  it("derives distinct friend challenges and partner agreements from differences", () => {
    const friend = buildSocialReport(a, result(20), result(70), "friend", "en");
    const couple = buildSocialReport(a, result(20), result(70), "couple", "en");
    expect(friend.cards[0].gap).toBe(50);
    expect(friend.cards[0].action).not.toBe(couple.cards[0].action);
    expect(
      buildSocialReport(a, result(20), result(20), "couple", "en").cards[0]
        .theme,
    ).not.toBe(couple.cards[0].theme);
    expect(couple.cards[0].action).toContain("agree");
  });
  it("allows only validated local invitation continuations", () => {
    const path = `/compare?invite=${encodeInvite(a, result(20))}&mode=couple`;
    expect(validateSocialReturn(path, assessments)).toBe(path);
    expect(validateSocialReturn("https://evil.test", assessments)).toBeNull();
    expect(
      validateSocialReturn("/compare?invite=bad&mode=friend", assessments),
    ).toBeNull();
  });
});
it("preserves explicitly selected language in a validated invitation continuation", async () => {
  const { invitationPath } = await import("../src/engine/social");
  const path = invitationPath(a, result(30), "friend", "zh");
  expect(path).toContain("&lang=zh");
  expect(validateSocialReturn(path, assessments)).toBe(path);
  expect(
    validateSocialReturn(path.replace("lang=zh", "lang=unknown"), assessments),
  ).toBeNull();
});
it("keeps a same-session invitation continuation when session storage is blocked", async () => {
  const { rememberSocialReturn, consumeSocialReturn } =
    await import("../src/engine/social");
  const descriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "sessionStorage",
  );
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    get() {
      throw Error("blocked");
    },
  });
  try {
    const path = `/compare?invite=${encodeInvite(a, result(20))}&mode=friend`;
    rememberSocialReturn(path, assessments);
    expect(consumeSocialReturn(a.id, assessments)).toBe(path);
    expect(consumeSocialReturn(a.id, assessments)).toBeNull();
  } finally {
    if (descriptor)
      Object.defineProperty(globalThis, "sessionStorage", descriptor);
    else delete (globalThis as any).sessionStorage;
  }
});
