import { it, expect } from "vitest";
import { createStore } from "../src/storage/store";
const adapter = () => {
  const data = new Map();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, v),
  };
};
it("keeps independent versioned drafts and atomically completes one", () => {
  const s = createStore(adapter());
  s.saveDraft("a", { version: 1, answers: { q: 2 }, index: 0 });
  s.saveDraft("b", { version: 1, answers: { q: 4 }, index: 1 });
  s.complete({ id: "r", testId: "a", testVersion: 1, scores: { x: 50 } });
  expect(s.get().drafts.a).toBeUndefined();
  expect(s.get().drafts.b.answers.q).toBe(4);
  expect(s.get().results).toHaveLength(1);
});
it("recovers history and supports deletion", () => {
  const a = adapter();
  createStore(a).complete({ id: "r", testId: "a", scores: { x: 50 } });
  const s = createStore(a);
  expect(s.get().results[0].id).toBe("r");
  s.remove("r");
  expect(createStore(a).get().results).toEqual([]);
});
it("falls back to memory when storage throws", () => {
  const s = createStore({
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
  });
  s.saveDraft("a", { answers: { q: 3 } });
  expect(s.get().drafts.a.answers.q).toBe(3);
  expect(s.status()).toBeTruthy();
});
it("preserves corrupted original storage", () => {
  let value = "{broken";
  const s = createStore({
    getItem: () => value,
    setItem: (_, v) => {
      value = v;
    },
  });
  s.saveDraft("a", { answers: {} });
  expect(value).toBe("{broken");
  expect(s.status()).toContain("损坏");
});
it("caps retained history at 100", () => {
  const s = createStore(adapter());
  for (let i = 0; i < 101; i++)
    s.complete({ id: String(i), testId: "a", scores: { x: 0 } });
  expect(s.get().results).toHaveLength(100);
  expect(s.get().results.at(-1).id).toBe("1");
});
it("detects stale writes from other tabs", () => {
  const a = adapter();
  const first = createStore(a),
    second = createStore(a);
  first.saveDraft("a", { answers: { q: 2 } });
  expect(() => second.saveDraft("a", { answers: { q: 5 } })).toThrow(
    "其他窗口",
  );
});
it("explicit clear erases a corrupt stored snapshot", () => {
  let disk = "{broken";
  const s = createStore({
    getItem: () => disk,
    setItem: (_, v) => {
      disk = v;
    },
  });
  s.clear();
  expect(JSON.parse(disk).results).toEqual([]);
  expect(s.status()).toBe("");
});
it("deletion retries persistence after a recoverable quota failure", () => {
  const disk = adapter();
  let fail = false;
  const s = createStore({
    getItem: disk.getItem,
    setItem: (k, v) => {
      if (fail) throw Error("quota");
      disk.setItem(k, v);
    },
  });
  s.complete({ id: "r", testId: "a", scores: { x: 50 } });
  fail = true;
  s.saveDraft("a", { answers: { q: 3 } });
  fail = false;
  s.remove("r");
  expect(createStore(disk).get().results).toEqual([]);
});
it("does not falsely confirm deletion when persistence still fails", () => {
  const disk = adapter();
  let fail = false;
  const s = createStore({
    getItem: disk.getItem,
    setItem: (k, v) => {
      if (fail) throw Error("quota");
      disk.setItem(k, v);
    },
  });
  s.complete({ id: "r", testId: "a", scores: { x: 50 } });
  fail = true;
  s.saveDraft("a", { answers: { q: 3 } });
  expect(() => s.clear()).toThrow("删除");
  expect(s.get().results).toHaveLength(1);
});
