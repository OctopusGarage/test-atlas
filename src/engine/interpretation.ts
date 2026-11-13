import type { Dimension, Locale } from "../types";
/** Display bands are editorial reading aids, not validated clinical cutoffs. */
export function describeDimensionScore(
  d: Pick<Dimension, "name" | "low" | "high">,
  score: number,
  locale: Locale,
): string {
  if (!Number.isFinite(score) || score < 0 || score > 100)
    throw Error("Invalid dimension score");
  if (score >= 65) return d.high;
  if (score <= 35) return d.low;
  return locale === "en"
    ? `${d.name} sits in the middle of this response scale. Your preference may depend on the situation; neither endpoint is clearly endorsed.`
    : `${d.name}位于本次回答尺度中段，偏好可能随情境改变，没有明确偏向任一端。`;
}

/** Optional reflection prompts, never a prescription to raise a low score. */
export function suggestDimensionAction(
  d: Pick<Dimension, "name" | "action">,
  score: number,
  locale: Locale,
): string {
  if (!Number.isFinite(score) || score < 0 || score > 100)
    throw Error("Invalid dimension score");
  if (score <= 35)
    return locale === "en"
      ? `Recall a recent situation related to ${d.name}. Your position is lower on this dimension after any reverse-key scoring. What circumstances help explain your answers? Keep what works; there is no need to increase this score.`
      : `回想一个与${d.name}有关的近期情境。按计分方向处理后，你在这个维度的位置较低。哪些处境可以帮助解释你的回答？保留适合自己的做法，不需要刻意提高分数。`;
  if (score < 65)
    return locale === "en"
      ? `For ${d.name}, compare two recent situations where your responses differed. Note what changed before deciding whether any experiment would be useful.`
      : `关于${d.name}，比较两个回答可能不同的近期情境，记录发生了什么变化，再决定是否需要尝试调整。`;
  return locale === "en"
    ? `If this fits a safe, relevant situation, consider: ${d.action}`
    : `如果适合一个安全、相关的情境，可以考虑：${d.action}`;
}
