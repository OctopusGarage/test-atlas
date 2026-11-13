import MeasurementNotes from "../components/MeasurementNotes";
import { useLocale } from "../i18n";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Clock, ListChecks, ShieldCheck } from "lucide-react";
import { getAssessment } from "../data/assessments";
import { store } from "../storage/store";
import { Compass } from "../components/Art";
import { Breadcrumb, Eyebrow, Empty } from "../components/UI";
export default function Detail() {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const { testId } = useParams(),
    a = localizeAssessment(getAssessment(testId)),
    navigate = useNavigate();
  const [error, setError] = useState("");
  if (!a)
    return (
      <Empty title={t("这片地图还没有开放")}>
        {t("请从测试目录选择一个探索。")}
      </Empty>
    );
  const draft = store.get().drafts[a.id],
    canResume = draft?.version === a.version;
  function start(reset = false) {
    if (!a) return;
    try {
      if (!canResume || reset) {
        if (
          reset &&
          !confirm(t("重新开始会清除这项测试的当前草稿，历史报告会保留。"))
        )
          return;
        store.saveDraft(a.id, { version: a.version, index: 0, answers: {} });
      }
      navigate(`/tests/${a.id}/take`);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <section className="detail page-section">
      <Breadcrumb name={localizeAssessment(a).name} />
      <div className="detail-grid">
        <div>
          <Eyebrow>{a.english}</Eyebrow>
          <h1 className="page-title">{localizeAssessment(a).name}</h1>
          <p className="detail-tagline">{a.tagline}</p>
          <p className="page-intro">{a.description}</p>
          <p className="measurement-status">
            {a.id === "big-five"
              ? locale === "en"
                ? "Public-domain IPIP inventory. The project’s Chinese translation is unvalidated."
                : "公开领域的 IPIP 题库；本项目中文译文尚未完成效度验证。"
              : a.kind === "趣味探索" || a.kind === "Playful exploration"
                ? locale === "en"
                  ? "Original entertainment questionnaire. No scientific classification is established."
                  : "原创娱乐问卷，不构成科学分类。"
                : locale === "en"
                  ? "Original reflection questionnaire. No psychometric validation is established."
                  : "原创反思问卷，尚无心理测量效度验证。"}
          </p>
          <div className="detail-stats">
            <span>
              <ListChecks size={18} />
              {a.questions.length} {t("道题")}
            </span>
            <span>
              <Clock size={18} />
              {a.minutes} {t("分钟")}
            </span>
            <span>
              <ShieldCheck size={18} />
              {t("本地计分")}
            </span>
          </div>
          <button className="button primary" onClick={() => start()}>
            {canResume ? t("继续上次探索") : t("开始探索")}
            <ArrowRight size={18} />
          </button>
          {canResume && (
            <button className="button subtle" onClick={() => start(true)}>
              {t("重新开始")}
            </button>
          )}
          {error && <p role="alert">{localizeError(error)}</p>}
          {draft && !canResume && (
            <p role="status">
              {t("题库已更新，旧草稿不适用于当前版本。开始时将使用新题库。")}
            </p>
          )}
          <p className="small-note">
            {t("按自己的感受选择。可以暂停，也可以改变答案。")}
          </p>
        </div>
        <div className={`detail-art ${a.color}`}>
          <Compass variant={a.color} large />
          <span>{a.kind} / SELF EXPLORATION</span>
        </div>
      </div>
      <MeasurementNotes assessment={a} />
      <div className="detail-notes">
        <section>
          <Eyebrow>BEFORE YOU BEGIN</Eyebrow>
          <h2>{t("留一点时间，听听自己。")}</h2>
          <p>{a.instruction}</p>
        </section>
        <section>
          <Eyebrow>WHAT THIS CAN TELL YOU</Eyebrow>
          <h2>{t("了解依据，也了解边界。")}</h2>
          <p>{a.basis}</p>
          <p>
            {t(
              "结果用于自我反思，不是诊断、能力评价或关系预测。0–100 表示题目刻度上的位置，不是人群排名。",
            )}
          </p>
          <a
            className="text-link"
            href={a.source.url}
            target="_blank"
            rel="noreferrer"
          >
            {a.source.label} ↗
          </a>
          <p className="small-note">
            {a.source.rights} · {t("题库")} v{a.version}
          </p>
        </section>
      </div>
    </section>
  );
}
