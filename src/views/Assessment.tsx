import { QuestionStep } from "../components/Motion";
import { consumeSocialReturn } from "../engine/social";
import { useLocale } from "../i18n";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { getAssessment, options, assessments } from "../data/assessments";
import { score } from "../engine/score";
import { store } from "../storage/store";
import { Empty, Eyebrow } from "../components/UI";
export default function Assessment() {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const { testId } = useParams(),
    a = localizeAssessment(getAssessment(testId)),
    navigate = useNavigate();
  const [draft, setDraft] = useState(() => {
    const d = store.get().drafts[testId || ""];
    return a && d && d.version === a.version &&
      Number.isInteger(d.index) &&
      d.index >= 0 &&
      d.index < a.questions.length &&
      d.answers &&
      typeof d.answers === "object" &&
      !Array.isArray(d.answers) &&
      Object.entries(d.answers).every(
        ([id, v]) =>
          a.questions.some((q) => q.id === id) &&
          Number.isInteger(v) &&
          typeof v === "number" &&
          v >= 1 &&
          v <= 5,
      )
      ? d
      : { version: a?.version, index: 0, answers: {} };
  });
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [draft.index]);
  if (!a) return <Empty title={t("这片地图还没有开放")} />;
  const q = a.questions[draft.index],
    completed = Object.keys(draft.answers).length;
  const persist = (next) => {
    try {
      store.saveDraft(a.id, next);
      setDraft(next);
      setError("");
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };
  const next = () => {
    if (!draft.answers[q.id]) return;
    if (draft.index < a.questions.length - 1) {
      persist({ ...draft, index: draft.index + 1 });
    } else {
      try {
        const scores = score(a, draft.answers),
          id = crypto.randomUUID();
        if (
          store.get().results.length >= 100 &&
          !confirm(t("本地已保存 100 条记录，继续会移除最早一条。"))
        )
          return;
        store.complete({
          id,
          testId: a.id,
          testVersion: a.version,
          scoringVersion: a.scoringVersion,
          reportVersion: a.reportVersion,
          locale: locale === "en" ? "en-US" : "zh-CN",
          contentHash: a.contentHash,
          completedAt: new Date().toISOString(),
          scores,
        });
        navigate(consumeSocialReturn(a.id, assessments) || `/results/${id}`, {
          replace: true,
        });
      } catch (e) {
        setError(e.message);
      }
    }
  };
  return (
    <section className="assessment-page">
      <div className="test-top">
        <Link to={`/tests/${a.id}`} className="text-link">
          <ArrowLeft size={16} />
          {t("暂停探索")}
        </Link>
        <span>{localizeAssessment(a).name}</span>
        <span className="question-count">
          {String(draft.index + 1).padStart(2, "0")} / {a.questions.length}
        </span>
      </div>
      <div
        className="progress-track"
        aria-label={t("答题进度")}
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={a.questions.length}
      >
        <div style={{ width: `${(completed / a.questions.length) * 100}%` }} />
      </div>
      <div className="question-content">
        <Eyebrow>TAKE A MOMENT. LISTEN TO YOURSELF.</Eyebrow>
        <QuestionStep question={q.id} index={draft.index}>
        <p className="question-instruction">
          {a.id === "attachment"
            ? t("请想着同一位亲近的人，按实际感受回答。")
            : t("根据平时的自己，选择最接近的感受。")}
        </p>
        <h1 ref={heading} tabIndex={-1}>
          {q.text}
        </h1>
        <fieldset className="answer-options">
          <legend className="sr-only">{t("这句话符合你的程度")}</legend>
          {(locale === "en"
            ? [
                "Strongly disagree",
                "Disagree",
                "Neutral / unsure",
                "Agree",
                "Strongly agree",
              ]
            : options
          ).map((label, i) => (
            <label
              key={i}
              className={`answer ${draft.answers[q.id] === i + 1 ? "selected" : ""}`}
            >
              <input
                type="radio"
                aria-label={label}
                name={q.id}
                value={i + 1}
                checked={draft.answers[q.id] === i + 1}
                onChange={() =>
                  persist({
                    ...draft,
                    answers: { ...draft.answers, [q.id]: i + 1 },
                  })
                }
              />
              <span className="answer-number">{i + 1}</span>
              <span>{label}</span>
              <span className="answer-check">
                {draft.answers[q.id] === i + 1 ? <Check size={17} /> : null}
              </span>
            </label>
          ))}
        </fieldset>
        </QuestionStep>
        {error && (
          <p role="alert" className="error-message">
            {localizeError(error)}
          </p>
        )}
        <div className="question-actions">
          <button
            className="button"
            disabled={draft.index === 0}
            onClick={() => persist({ ...draft, index: draft.index - 1 })}
          >
            <ArrowLeft size={16} />
            {t("上一题")}
          </button>
          <button
            className="button primary"
            disabled={!draft.answers[q.id]}
            onClick={next}
          >
            {draft.index === a.questions.length - 1
              ? t("生成我的报告")
              : t("下一题")}
            <ArrowRight size={17} />
          </button>
        </div>
        <p className="save-note">
          <LockKeyhole size={13} />
          {store.status()
            ? t("当前仅在本次页面会话中保存")
            : t("进度自动保存在这台设备，你可以随时回来。")}
        </p>
      </div>
    </section>
  );
}
