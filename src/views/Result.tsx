import { describeDimensionScore, suggestDimensionAction } from "../engine/interpretation";
import ResultVisualization from "../components/ResultVisualization";
import CareerPaths from "../components/CareerPaths";
import MeasurementNotes from "../components/MeasurementNotes";
import { DeepReport } from "../components/DeepReport";
import SocialShare from "../components/SocialShare";
import { useLocale } from "../i18n";
import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAssessment, resolveAssessment } from "../data/assessments";
import { store } from "../storage/store";
import { Breadcrumb, Empty, Eyebrow } from "../components/UI";
import SharePanel from "../components/SharePanel";
import ResultInsights from "../components/ResultInsights";
export default function Result() {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const { resultId } = useParams(),
    r = store.get().results.find((r) => r.id === resultId),
    a =
      r && localizeAssessment(resolveAssessment(r) || getAssessment(r.testId));
  if (!r || !a)
    return (
      <Empty title={t("这份记录暂时找不到了")}>
        {t("记录可能已删除，或保存在另一台设备中。")}
      </Empty>
    );
  if (
    r.testVersion !== a.version ||
    r.scoringVersion !== a.scoringVersion ||
    r.contentHash !== a.contentHash ||
    r.reportVersion !== a.reportVersion ||
    a.dimensions.some((d) => !Number.isFinite(r.scores[d.id]))
  )
    return (
      <Empty title={t("这份记录来自另一个版本")}>
        {t("旧记录已保留，当前版本无法准确展示。你可以重新探索。")}
      </Empty>
    );
  const date = r.completedAt && new Date(r.completedAt);
  return (
    <section className="result-page page-section">
      <Breadcrumb name={localizeAssessment(a).name} />
      <header className="report-header">
        <Eyebrow>YOUR PERSONAL FIELD NOTES</Eyebrow>
        <span className={`report-badge ${a.color}`}>{a.symbol}</span>
        <h1>
          {a.id === "attachment"
            ? t("你的关系感受地图")
            : a.id === "big-five"
              ? t("你的五维性格地图")
              : t("看见自己的不同侧面")}
        </h1>
        <p>
          {localizeAssessment(a).name} ·{" "}
          {date && !Number.isNaN(date.getTime())
            ? date.toLocaleDateString(locale === "en" ? "en-US" : "zh-CN")
            : t("完成时间未知")}{" "}
          · {a.kind}
        </p>
        <p className="report-lead">
          {t("这不是关于你是谁的定论，")}
          <br />
          {t("而是理解此刻自己的一个起点。")}
        </p>
      </header>
      {a.version !== getAssessment(a.id)?.version && (
        <p role="status" className="archive-notice">
          {locale === "zh"
            ? "这是原题库版本的已保存报告，未按新题目重新计算。"
            : "This saved report uses its original questionnaire version. New questions have not been applied to it."}
        </p>
      )}
      <ResultVisualization assessment={a} result={r} />
      <section className="score-panel">
        <div className="score-heading">
          <h2>{t("你的维度概览")}</h2>
          <span>{t("刻度位置 / 100")}</span>
        </div>
        {a.dimensions.map((d) => (
          <div className="dimension" key={d.id}>
            <div>
              <span>
                {d.name} <small>{d.en}</small>
              </span>
              <strong>
                {Math.round(r.scores[d.id])}
                <small> / 100</small>
              </strong>
            </div>
            <div className="dimension-track">
              <span style={{ width: `${r.scores[d.id]}%` }} />
            </div>
            <div className="dimension-endpoints">
              <span>{locale === "en" ? "Lower scale position" : "较低刻度位置"}</span>
              <span>{locale === "en" ? "Higher scale position" : "较高刻度位置"}</span>
            </div>
          </div>
        ))}
        <p className="small-note">
          {t(
            "分数是本次回答在量表刻度上的位置，不是准确率、能力值或人群百分位。",
          )}
        </p>
      </section>
      {a.id === "attachment" && (
        <section
          className="attachment-chart"
          aria-label={t("回应敏感与距离需要二维分布")}
        >
          <div className="plot">
            <span className="plot-top">{t("回应敏感较高")}</span>
            <span className="plot-bottom">{t("回应敏感较低")}</span>
            <span className="plot-left">{t("距离需要较低")}</span>
            <span className="plot-right">{t("距离需要较高")}</span>
            <span
              className="plot-point"
              role="img"
              style={{
                left: `${10 + r.scores.avoidance * 0.8}%`,
                bottom: `${10 + r.scores.anxiety * 0.8}%`,
              }}
              aria-label={`${locale === "en" ? "Response sensitivity" : "回应敏感"} ${Math.round(r.scores.anxiety)}, ${locale === "en" ? "Need for distance" : "距离需要"} ${Math.round(r.scores.avoidance)}`}
            />
          </div>
          <p className="small-note">
            {t("连续维度示意，不划分固定依恋类型，也不预测关系结果。")}
          </p>
        </section>
      )}
      <div className="report-chapters">
        <Eyebrow>PUTTING IT INTO PERSPECTIVE</Eyebrow>
        <h2>{t("把分数，放回生活里。")}</h2>
        {a.dimensions.map((d) => (
          <details key={d.id} open>
            <summary>
              {d.name}
              <span>+</span>
            </summary>
            <div className="chapter-content">
              <p>{describeDimensionScore(d, r.scores[d.id], locale)}</p>
              <div className="action-note">
                <strong>{t("试着做一件小事")}</strong>
                <p>{suggestDimensionAction(d, r.scores[d.id], locale)}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
      <aside className="interpretation">
        <h3>{t("给这份结果，留一点余地。")}</h3>
        <p>
          {a.basis}{" "}
          {t(
            "心情、近期经历和对题目的理解都可能影响回答。报告是固定的编辑解读，不是对你个人经历的事实判断。",
          )}
        </p>
        <a href={a.source.url} target="_blank" rel="noreferrer">
          {t("查看依据与来源 ↗")}
        </a>
      </aside>
      <DeepReport assessment={a} result={r} />
      <CareerPaths assessment={a} result={r} />
      {a.version === getAssessment(a.id)?.version && (
        <MeasurementNotes assessment={a} />
      )}
      <ResultInsights assessment={a} result={r} />
      {a.version === getAssessment(a.id)?.version && (
        <SocialShare assessment={getAssessment(a.id)!} result={r} />
      )}
      <SharePanel assessment={a} result={r} />
      <div className="report-next">
        <Link className="text-link" to="/tests">
          {t("还有更多侧面，等你发现")}
          <ArrowRight size={17} />
        </Link>
        <Link className="text-link" to="/history">
          {t("回看我的记录")}
        </Link>
      </div>
    </section>
  );
}
