import type { StoredState, StorageAdapter, Result, Draft } from "../types";
const KEY = "test_atlas_v1";
const fresh = (): StoredState => ({
  schemaVersion: 1,
  revision: 0,
  drafts: {},
  results: [],
});
const valid = (v: unknown): v is StoredState => isStoredState(v);
function isStoredState(v: any): v is StoredState {
  return !!(
    v &&
    v.schemaVersion === 1 &&
    Number.isInteger(v.revision) &&
    v.drafts &&
    typeof v.drafts === "object" &&
    !Array.isArray(v.drafts) &&
    Array.isArray(v.results) &&
    v.results.every(
      (r) =>
        r &&
        typeof r.id === "string" &&
        typeof r.testId === "string" &&
        r.scores &&
        Object.values(r.scores).every(
          (n) =>
            typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100,
        ),
    )
  );
}
export function createStore(storage?: StorageAdapter) {
  let state = fresh(),
    warning = "",
    original: string | null = null,
    blocked = false;
  try {
    original = storage!.getItem(KEY);
    if (original) {
      const value = JSON.parse(original);
      if (!valid(value)) throw Error("corrupt");
      state = value;
    }
  } catch {
    warning = original
      ? "本地记录已损坏，原始内容已保留；当前仅在内存保存。"
      : "本地存储不可用，刷新或关闭页面会丢失本次记录。";
    blocked = true;
  }
  function write(next: StoredState, deletion = false) {
    if (!blocked || deletion) {
      try {
        if (storage!.getItem(KEY) !== original) throw Error("conflict");
        const encoded = JSON.stringify({
          ...next,
          revision: state.revision + 1,
        });
        storage!.setItem(KEY, encoded);
        original = encoded;
        next.revision = state.revision + 1;
        blocked = false;
        warning = "";
      } catch (error) {
        if (error.message === "conflict")
          throw Error("其他窗口已修改记录，请刷新后继续。");
        if (deletion)
          throw Error(
            "无法从设备删除记录，请检查浏览器存储权限后重试；原记录尚未删除。",
          );
        warning = "本地保存失败，刷新或关闭页面会丢失本次记录。";
        blocked = true;
      }
    }
    state = next;
    globalThis.dispatchEvent?.(new Event("test-atlas-storage"));
  }
  return {
    get: () => structuredClone(state),
    status: () => warning,
    saveDraft: (id: string, draft: Pick<Draft, "answers"> & Partial<Draft>) =>
      write({
        ...state,
        drafts: { ...state.drafts, [id]: { version: 0, index: 0, ...draft } },
      }),
    discard: (id: string) => {
      const drafts = { ...state.drafts };
      delete drafts[id];
      write({ ...state, drafts });
    },
    complete: (result: Result) => {
      const drafts = { ...state.drafts };
      delete drafts[result.testId];
      write({
        ...state,
        drafts,
        results: [result, ...state.results].slice(0, 100),
      });
    },
    remove: (id: string) =>
      write(
        { ...state, results: state.results.filter((r) => r.id !== id) },
        true,
      ),
    clear: () => write({ ...fresh(), revision: state.revision }, true),
  };
}
let browserStorage: StorageAdapter | undefined;
try {
  if (typeof window !== "undefined") browserStorage = window.localStorage;
} catch {
  /* adapter reports the unavailable state */
}
export const store = createStore(browserStorage);
