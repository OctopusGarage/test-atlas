import type { Assessment, Result } from "../types";
import { isCompatible, leadingDimensions, resultTime } from "./insights";
export interface NextTopic {
  assessment: Assessment;
  reason: { en: string; zh: string };
  evidence?: { testId: string; dimension: string };
}
const nextByTopic: Record<string, string[]> = {
  "big-five": ["values", "social-energy", "learning"],
  attachment: ["communication", "boundaries", "love-expression"],
  "dark-triad": ["boundaries", "conflict", "values"],
  enneagram: ["strengths", "decision", "romantic-style"],
  strengths: ["values", "career-interest", "learning"],
  "emotional-intelligence": ["conflict", "communication", "social-energy"],
  "six-factor": ["values", "work-style", "boundaries"],
  "love-expression": ["communication", "attachment", "conflict"],
  "romantic-style": ["love-expression", "boundaries", "attachment"],
  conflict: ["communication", "boundaries", "emotional-intelligence"],
  boundaries: ["communication", "values", "social-energy"],
  communication: ["conflict", "work-style", "love-expression"],
  "psychological-age": ["learning", "values", "animal"],
  animal: ["social-energy", "communication", "survival"],
  villain: ["decision", "values", "conflict"],
  survival: ["work-style", "career-interest", "decision"],
  "online-persona": ["communication", "social-energy", "boundaries"],
  "social-energy": ["boundaries", "communication", "romantic-style"],
  consumption: ["values", "decision", "procrastination"],
  "career-interest": ["values", "work-style", "strengths"],
  "work-style": ["communication", "values", "career-interest"],
  values: ["career-interest", "decision", "consumption"],
  learning: ["procrastination", "decision", "strengths"],
  procrastination: ["learning", "decision", "values"],
  decision: ["values", "procrastination", "work-style"],
};
const responseRoutes: Record<string, Record<string, string[]>> = {
  attachment: {
    anxiety: ["communication", "love-expression", "emotional-intelligence"],
    avoidance: ["boundaries", "romantic-style", "communication"],
  },
  "big-five": {
    E: ["social-energy", "communication"],
    A: ["boundaries", "conflict"],
    C: ["procrastination", "work-style"],
    S: ["emotional-intelligence", "learning"],
    O: ["strengths", "career-interest"],
  },
  "dark-triad": {
    strategy: ["values", "conflict"],
    attention: ["communication", "strengths"],
    impulse: ["decision", "emotional-intelligence"],
  },
  "social-energy": {
    D1: ["boundaries", "learning"],
    D2: ["communication", "work-style"],
    D3: ["emotional-intelligence", "boundaries"],
  },
  consumption: {
    D1: ["decision", "values"],
    D2: ["procrastination", "decision"],
    D3: ["values", "career-interest"],
  },
  procrastination: {
    D1: ["values", "learning"],
    D2: ["emotional-intelligence", "strengths"],
    D3: ["decision", "work-style"],
  },
  "career-interest": {
    D1: ["work-style", "values"],
    D2: ["learning", "decision"],
    D3: ["strengths", "values"],
    D4: ["communication", "boundaries"],
    D5: ["work-style", "decision"],
    D6: ["values", "learning"],
  },
};
export function recommendNext(
  all: Assessment[],
  results: Result[],
  current?: Result,
  limit = 3,
): NextTopic[] {
  const valid = results.filter((r) =>
    isCompatible(
      all.find((a) => a.id === r.testId),
      r,
    ),
  );
  const chosen =
    current &&
    isCompatible(
      all.find((a) => a.id === current.testId),
      current,
    )
      ? current
      : [...valid].sort(
          (a, b) => resultTime(b.completedAt) - resultTime(a.completedAt),
        )[0];
  const source = chosen && all.find((a) => a.id === chosen.testId);
  const leaders = source && chosen ? leadingDimensions(source, chosen) : [];
  const completed = new Set(valid.map((r) => r.testId));
  if (chosen) completed.add(chosen.testId);
  const routed = source
    ? leaders.flatMap((d) =>
        (responseRoutes[source.id]?.[d.id] || []).map((id) => ({
          id,
          dimension: d.id,
        })),
      )
    : [];
  const priorities = [
    ...routed,
    ...(source ? nextByTopic[source.id] || [] : []).map((id) => ({
      id,
      dimension: undefined,
    })),
    ...all.map((a) => ({ id: a.id, dimension: undefined })),
  ];
  const selected: NextTopic[] = [];
  const seen = new Set<string>();
  for (const target of priorities) {
    const a = all.find((a) => a.id === target.id);
    if (!a || completed.has(a.id) || seen.has(a.id)) continue;
    seen.add(a.id);
    const d = source?.dimensions.find((d) => d.id === target.dimension);
    selected.push({
      assessment: a,
      reason: d
        ? {
            en: `Your ${d.en} answers offer a starting point for exploring this related topic. This is a reflection connection, not a prediction of what you need.`,
            zh: `你在「${d.name}」维度的回答，可以作为探索这一相关主题的起点。这是反思线索，不是对你需求的预测。`,
          }
        : source
          ? {
              en: "Explore a related topic to put your latest reflection into a different everyday context.",
              zh: "探索一个相关主题，把最近的观察放进另一种日常情境。",
            }
          : {
              en: "Start with an unexplored topic that interests you.",
              zh: "从一个让你好奇的未探索主题开始。",
            },
      ...(d && source
        ? { evidence: { testId: source.id, dimension: d.id } }
        : {}),
    });
    if (selected.length >= Math.max(0, limit)) break;
  }
  return limit <= 0 ? [] : selected;
}
