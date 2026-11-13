import { recommendNext } from "../engine/recommendations";
import { Link } from "react-router-dom";
import { assessments, getAssessment } from "../data/assessments";
import { store } from "../storage/store";
import { useLocale } from "../i18n";
import { latestResults } from "../engine/insights";
export default function Profile() {
  const { locale, localizeAssessment } = useLocale();
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const all = store.get().results;
  const latest = latestResults(assessments, all);
  const next = recommendNext(assessments, latest);
  const categories = new Set(
    latest.map((r) => getAssessment(r.testId)?.category),
  );
  return (
    <section className="page-section profile-page">
      <header className="report-header">
        <h1>{c("Your exploration profile", "你的探索档案")}</h1>
        <p>
          {c(
            "A collection of reflections, shaped by your context and choices.",
            "一组由当时情境与选择构成的自我观察。",
          )}
        </p>
        <p>
          {latest.length} / {assessments.length}{" "}
          {c("assessments explored", "项已探索")} · {categories.size}{" "}
          {c("categories", "个分类")}
        </p>
      </header>
      <section className="score-panel">
        <h2>{c("Your latest field notes", "最近的探索记录")}</h2>
        <p>
          {c(
            "Each assessment measures a different topic. Scores are not combined into an overall personality rating.",
            "每份测试关注不同主题，分数不会合成为总人格评分。",
          )}
        </p>
        {!latest.length && (
          <p>
            {c(
              "Your first assessment will appear here.",
              "完成第一份测试后，结果会出现在这里。",
            )}
          </p>
        )}
        {latest.map((r) => {
          const a = localizeAssessment(getAssessment(r.testId));
          if (!a) return null;
          return (
            <article key={r.id}>
              <h3>
                <Link to={`/results/${r.id}`}>{a.name}</Link>
              </h3>
              <p>{r.completedAt?.slice(0, 10)}</p>
              <p>
                {a.dimensions
                  .map((d) => `${d.name}: ${Math.round(r.scores[d.id])}`)
                  .join(" · ")}
              </p>
              <Link to={`/tests/${a.id}`}>
                {c("Explore again", "再次探索")}
              </Link>
            </article>
          );
        })}
      </section>
      <section className="score-panel">
        <h2>{c("A next direction", "下一步探索")}</h2>
        <p>
          {c(
            "These suggestions connect your latest response pattern to related topics. The reason for each suggestion is shown; it is not a diagnosis or a prediction of your needs.",
            "这些建议把最近的回答模式连接到相关主题，每项都说明推荐理由，不是诊断或对需求的预测。",
          )}
        </p>
        {next.map((raw) => {
          const a = localizeAssessment(raw.assessment);
          return (
            <p key={a.id}>
              <Link to={`/tests/${a.id}`}>{a.name}</Link> — {raw.reason[locale]}
            </p>
          );
        })}
        {!next.length && (
          <p>
            {c(
              "You have explored every current topic. Revisit one after a meaningful change in context.",
              "你已探索全部当前主题。情境发生有意义的变化后，可以重访其中一项。",
            )}
          </p>
        )}
      </section>
      <section className="score-panel">
        <h2>{c("Exploration timeline", "探索时间线")}</h2>
        {[...all]
          .sort(
            (a, b) =>
              (Date.parse(b.completedAt || "") || 0) -
              (Date.parse(a.completedAt || "") || 0),
          )
          .map((r) => (
            <p key={r.id}>
              {r.completedAt?.slice(0, 10)} ·{" "}
              <Link to={`/results/${r.id}`}>
                {localizeAssessment(getAssessment(r.testId))?.name || r.testId}
              </Link>
            </p>
          ))}
        <Link to="/history">{c("Manage local history", "管理本地记录")}</Link>
      </section>
    </section>
  );
}
