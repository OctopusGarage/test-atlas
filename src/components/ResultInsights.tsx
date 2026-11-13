import { recommendNext } from "../engine/recommendations";
import type { Assessment, Result } from "../types";
import { Link } from "react-router-dom";
import { assessments } from "../data/assessments";
import { store } from "../storage/store";
import { useLocale } from "../i18n";
import {
  leadingDimensions,
  recommendAssessments,
  isCompatible,
  compareResults,
} from "../engine/insights";
import { downloadResult } from "../engine/exchange";
export default function ResultInsights({
  assessment,
  result,
}: {
  assessment: Assessment;
  result: Result;
}) {
  const { locale, localizeAssessment } = useLocale();
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const a = localizeAssessment(assessment);
  if (!isCompatible(a, result)) return null;
  const leaders = leadingDimensions(a, result);
  const archetypes = a.archetypes || [];
  const names = leaders.map((d) => {
    const type = archetypes.find((t) => (t.dimension || t.id) === d.id);
    return type
      ? locale === "zh"
        ? type.name
        : type.enName || type.name
      : d.name;
  });
  const history = store.get().results;
  const prior = history
    .filter(
      (r) =>
        r.id !== result.id &&
        isCompatible(a, r) &&
        Date.parse(r.completedAt || "") < Date.parse(result.completedAt || ""),
    )
    .sort(
      (x, y) =>
        Date.parse(y.completedAt || "") - Date.parse(x.completedAt || ""),
    )[0];
  const next = recommendNext(assessments, [...history, result], result);
  return (
    <>
      {prior && (
        <section className="score-panel">
          <h2>{c("Since your previous exploration", "与上一次探索相比")}</h2>
          <p>
            {c(
              "Same content and scoring version. Changes describe answers at two moments; they do not establish growth, decline, or reliable psychological change.",
              "内容与计分版本相同。变化仅描述两个时刻的回答，不能证明成长、退步或可靠的心理变化。",
            )}
          </p>
          {compareResults(a, prior, result).map((d) => (
            <p key={d.id}>
              {d.name}: {d.difference > 0 ? "+" : ""}
              {d.difference.toFixed(1)}
            </p>
          ))}
        </section>
      )}
      <section className="score-panel">
        <h2>{c("Continue exploring", "继续探索")}</h2>
        <p>
          {c(
            "Follow a connection from your answers into a related topic. Each reason is visible; these are exploration prompts, not predictions.",
            "沿着回答中的线索探索相关主题，每项都说明理由；这些是探索提示，不是预测。",
          )}
        </p>
        {next.map((raw) => {
          const item = localizeAssessment(raw.assessment);
          return (
            <p key={item.id}>
              <Link to={`/tests/${item.id}`}>{item.name}</Link>
              <span className="recommendation-reason">
                {raw.reason[locale]}
              </span>
            </p>
          );
        })}
        <Link to="/profile">
          {c("View your exploration profile", "查看个人探索档案")}
        </Link>
      </section>
      <section className="score-panel">
        <h2>{c("Share by choice", "自愿分享")}</h2>
        <p>
          {c(
            "Export a small JSON file containing only assessment versions and dimension scores. It excludes answers, dates, and record IDs. Share only with someone you trust; they can keep or forward the file.",
            "导出仅含测试版本与维度分数的小型 JSON 文件，不含答案、日期与记录编号。请只分享给信任的人；对方可以保留或转发文件。",
          )}
        </p>
        <button className="button" onClick={() => downloadResult(a, result)}>
          {c("Export result JSON", "导出结果 JSON")}
        </button>{" "}
        <Link to="/compare">{c("Compare results", "对照结果")}</Link>
      </section>
    </>
  );
}
