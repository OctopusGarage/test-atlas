import type { Question } from "../types";
/** Pure 1–5 Likert scoring. Scores are scale positions, never population percentiles. */
export function score(
  definition: {
    questions: Pick<Question, "id" | "dimension" | "reverse">[];
    dimensions: { id: string }[];
  },
  answers: Record<string, number>,
) {
  const { questions, dimensions } = definition;
  if (!answers || Object.keys(answers).length !== questions.length)
    throw Error("请完成全部题目");
  const allowed = new Set(questions.map((q) => q.id));
  if (Object.keys(answers).some((id) => !allowed.has(id)))
    throw Error("未知答案");
  const totals: Record<string, number[]> = Object.fromEntries(
    dimensions.map((d) => [d.id, []]),
  );
  for (const q of questions) {
    const value = answers[q.id];
    if (!Number.isInteger(value) || value < 1 || value > 5)
      throw Error("无效答案");
    totals[q.dimension].push(q.reverse ? 6 - value : value);
  }
  return Object.fromEntries(
    dimensions.map((d) => {
      const values = totals[d.id];
      if (!values.length) throw Error("空维度");
      return [
        d.id,
        (values.reduce((a, b) => a + b, 0) / values.length - 1) * 25,
      ];
    }),
  );
}
