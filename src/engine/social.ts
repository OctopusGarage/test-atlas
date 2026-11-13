import { describeDimensionScore } from "./interpretation";
import type { Assessment, Locale } from "../types";
import type { ScoreAssessment, ScoreResult } from "./insights";
import { compareResults } from "./insights";
import { encodeResult, decodeResult } from "./exchange";
export type SocialMode = "friend" | "couple";
export const MAX_INVITE_LENGTH = 12000;
export function encodeInvite(a: ScoreAssessment, result: ScoreResult): string {
  const json = JSON.stringify(JSON.parse(encodeResult(a, result)));
  const encoded = btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  if (encoded.length > MAX_INVITE_LENGTH)
    throw Error("Invitation is too large. / 邀请过大。");
  return encoded;
}
export function decodeInvite(payload: string, assessments: ScoreAssessment[]) {
  if (
    !payload ||
    payload.length > MAX_INVITE_LENGTH ||
    !/^[A-Za-z0-9_-]+$/.test(payload)
  )
    throw Error("Invalid invitation. / 邀请无效。");
  try {
    return decodeResult(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
      assessments,
    );
  } catch {
    throw Error(
      "Invitation is invalid or uses an older assessment version. / 邀请无效或测试版本已更新。",
    );
  }
}
export function invitationPath(
  a: ScoreAssessment,
  r: ScoreResult,
  mode: SocialMode,
  locale?: Locale,
) {
  return `/compare?invite=${encodeInvite(a, r)}&mode=${mode}${locale ? `&lang=${locale}` : ""}`;
}
export function validateSocialReturn(
  path: string,
  assessments: ScoreAssessment[],
) {
  try {
    if (!path.startsWith("/compare?") || path.length > MAX_INVITE_LENGTH + 100)
      return null;
    const url = new URL(path, "https://local.invalid");
    if (
      url.pathname != "/compare" ||
      url.hash ||
      (url.searchParams.has("lang") &&
        !["en", "zh"].includes(url.searchParams.get("lang")!)) ||
      [...url.searchParams.keys()].some(
        (k) => !["invite", "mode", "lang"].includes(k),
      ) ||
      !["friend", "couple"].includes(url.searchParams.get("mode") || "")
    )
      return null;
    decodeInvite(url.searchParams.get("invite") || "", assessments);
    return path;
  } catch {
    return null;
  }
}
const PENDING_KEY = "test-atlas-social-return/1";
let memoryReturn: string | null = null;
function clearSocialReturn() {
  memoryReturn = null;
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage may be blocked */
  }
}
export function rememberSocialReturn(
  path: string,
  assessments: ScoreAssessment[],
) {
  const valid = validateSocialReturn(path, assessments);
  if (!valid) {
    clearSocialReturn();
    return;
  }
  memoryReturn = valid;
  try {
    sessionStorage.setItem(PENDING_KEY, valid);
  } catch {
    /* memory keeps this page session functional */
  }
}
export function consumeSocialReturn(
  testId: string,
  assessments: ScoreAssessment[],
) {
  let path = memoryReturn;
  if (!path)
    try {
      path = sessionStorage.getItem(PENDING_KEY);
    } catch {
      /* use the page-session fallback */
    }
  if (!path) return null;
  const valid = validateSocialReturn(path, assessments);
  if (!valid) {
    clearSocialReturn();
    return null;
  }
  const target = decodeInvite(
    new URL(valid, "https://local.invalid").searchParams.get("invite")!,
    assessments,
  );
  if (target.testId !== testId) return null;
  clearSocialReturn();
  return valid;
}
export function buildSocialReport(
  a: Assessment,
  first: ScoreResult,
  second: ScoreResult,
  mode: SocialMode,
  locale: Locale,
) {
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const rows = compareResults(a, first, second).sort(
    (x, y) => Math.abs(y.difference) - Math.abs(x.difference),
  );
  const cards = rows.map((d) => {
    const gap = Math.abs(d.difference),
      similar = gap < 15;
    const firstText = describeDimensionScore(d, d.first, locale);
    const secondText = describeDimensionScore(d, d.second, locale);
    const care =
      a.id === "love-expression" ||
      /^(care|love|affection|service|touch|quality|gift|affirm)/i.test(d.id);
    const conflict = /conflict|avoid|accommod|comprom|compet|collab/i.test(
      a.id + " " + d.id,
    );
    const attachment = /attachment|anxiety|avoidance/i.test(a.id + " " + d.id);
    const need = attachment
      ? c(
          "Discuss reassurance, space, and a clear time to reconnect.",
          "讨论确认感、独处空间，以及明确的重新联系时间。",
        )
      : conflict
        ? c(
            "Discuss how to pause a disagreement and when to resume it.",
            "讨论分歧中如何暂停、以及何时回来继续沟通。",
          )
        : care
          ? c(
              "Each describe one concrete gesture that feels caring, and one that does not.",
              "各自说出一种能感受到关心的具体举动，以及一种不适合自己的举动。",
            )
          : c(
              "Each explain when this preference helps and when you need flexibility.",
              "各自说明这种偏好在哪些情境有帮助，以及何时需要灵活调整。",
            );
    return {
      ...d,
      gap,
      theme: similar
        ? c("Shared rhythm", "共同节奏")
        : c("Different rhythms to explore", "值得探索的不同节奏"),
      firstText,
      secondText,
      need,
      action:
        mode === "friend"
          ? c(
              `Try a two-round challenge around ${d.en || d.name}: each person chooses one activity reflecting their own preference, then swap the lead. Compare enjoyment, not who wins.`,
              `围绕「${d.name}」来一场双回合挑战：各选一个体现自己偏好的活动，轮流带队，再交流体验，不评谁更优秀。`,
            )
          : c(
              `For ${d.en || d.name}, agree together on one small experiment this week. ${d.action} Each person can decline or change it; choose a time to check how it felt.`,
              `围绕「${d.name}」，共同商定本周一个小尝试。${d.action} 双方均可拒绝或修改，并约定复盘体验的时间。`,
            ),
    };
  });
  return {
    title:
      mode === "friend"
        ? c("Your friendship challenge", "你们的好友挑战")
        : c("Your two-person relationship map", "你们的双人关系地图"),
    cards,
  };
}
