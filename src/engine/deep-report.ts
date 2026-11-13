import { describeDimensionScore, suggestDimensionAction } from "./interpretation";
import type { Assessment, Result, Locale } from "../types";
import { reportGuides } from "../data/report-guides";
import { getLocalizedAssessment } from "../i18n";
import { isCompatible } from "./insights";

export function buildDeepReport(
  assessment: Assessment,
  result: Result,
  locale: Locale,
) {
  if (!isCompatible(assessment, result))
    throw new Error("Incompatible report / 报告版本不兼容");
  const guide = reportGuides[assessment.id]?.[locale];
  if (!guide) throw new Error("Missing report guide / 缺少报告内容");
  const a = getLocalizedAssessment(assessment, locale);
  const max = Math.max(...Object.values(result.scores));
  const min = Math.min(...Object.values(result.scores));
  const leaders = a.dimensions.filter(
    (d) => Math.abs(result.scores[d.id] - max) < 1e-8,
  );
  const lower = a.dimensions.filter(
    (d) => Math.abs(result.scores[d.id] - min) < 1e-8,
  );
  const flat = Math.abs(max - min) < 1e-8;
  const names = (ds: typeof a.dimensions) =>
    ds.map((d) => d.name).join(locale === "en" ? ", " : "、");
  const en = locale === "en";
  // Relative position is not a high/low absolute endorsement. Midscale answers remain neutral.
  const interpretations = a.dimensions.map((d) => ({
    id: d.id,
    name: d.name,
    score: result.scores[d.id],
    text: describeDimensionScore(d, result.scores[d.id], locale),
    action: suggestDimensionAction(d, result.scores[d.id], locale),
  }));
  const combination = flat
    ? en
      ? `All dimensions share ${max.toFixed(0)} on this scale; there is no single leading style. Compare two real situations before choosing a label. ${guide.context}`
      : `所有维度同为${max.toFixed(0)}，没有单一领先风格。先比较两个真实情境，再考虑是否使用标签。${guide.context}`
    : en
      ? `${names(leaders)} ${leaders.length > 1 ? "are tied at the leading position" : "has the leading position"}; ${names(lower)} ${lower.length > 1 ? "share the lower position" : "has the lower position"}. This is a comparison within your answers, not a deficit ranking. Ask what contexts and consequences help explain this pattern; a lower position is not something to increase by default. ${guide.context}`
      : `${names(leaders)}${leaders.length > 1 ? "并列处于" : "处于"}相对领先位置，${names(lower)}处于相对较低位置。这只是本次回答内部的对照，不是缺陷排名。观察哪些情境与后果能够解释这一模式；相对较低的位置，并不意味着需要刻意提高。${guide.context}`;
  const selected = flat ? a.dimensions : [...leaders, ...lower];
  const tailored = selected.map((d) => ({
    dimension: d.name,
    action: suggestDimensionAction(d, result.scores[d.id], locale),
    interpretation: interpretations.find((x) => x.id === d.id)!.text,
  }));
  return {
    context: guide.context,
    combination,
    interpretations,
    watchout: guide.watchout,
    scenarios: [guide.scenarioOne, guide.scenarioTwo],
    questions: [
      guide.question,
      flat
        ? en
          ? "Which two dimensions felt different in real life despite receiving the same score here? What happened in each situation?"
          : "哪些维度虽然这次同分，在实际生活中感受却不同？各自发生了什么？"
        : en
          ? `In which recent situation did ${names(leaders)} help or carry a cost, and what circumstances explain your responses around ${names(lower)}?`
          : `最近什么情境中${names(leaders)}带来了帮助或代价，哪些处境能够解释你对${names(lower)}的回答？`,
    ],
    experiment: {
      purpose: guide.experiment,
      steps: [
        en
          ? "Days 1–2: Choose a safe, ordinary situation from the examples. Write down what you expect and what would count as useful."
          : "第1—2天：从例子中选一个安全、日常的情境，写下预期和什么结果算有帮助。",
        en
          ? "Days 3–4: Try one of the tailored actions below once. Note the situation, effort and other people’s response; do not assume an interpretation is correct."
          : "第3—4天：试一次下方适合你的行动，记录情境、投入和他人回应，不预设解读正确。",
        en
          ? "Days 5–6: Repeat in a comparable situation, changing one small part. Keep your usual approach available."
          : "第5—6天：在相近情境再试一次，只调整一个小环节，保留惯常做法作为选择。",
        en
          ? "Day 7: Compare what helped, what cost too much and what you would keep. A useful experiment need not increase a score."
          : "第7天：比较哪些有用、哪些代价过大、哪些值得保留。有用的实验不需要提高分数。",
      ],
      tailored,
    },
    limitation: en
      ? "This is an editorial reflection on your current answers, not a diagnosis, prediction or population percentile. Examples may not fit your circumstances; skip or adapt them."
      : "这是对本次回答的原创反思，不是诊断、预测或人群百分位。例子可能不符合你的处境，可以跳过或调整。",
  };
}
export type DeepReportModel = ReturnType<typeof buildDeepReport>;
