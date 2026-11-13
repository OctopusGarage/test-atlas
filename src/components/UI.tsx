import { useLocale } from "../i18n";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Clock, ChevronRight } from "lucide-react";
import { Compass } from "./Art";
export function Eyebrow({ children }) {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  return <p className="eyebrow">{children}</p>;
}
export function TestCard({ test, index = 0 }) {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  test = localizeAssessment(test);
  return (
    <Link
      to={`/tests/${test.id}`}
      className={`test-card ${test.color}`}
      data-reveal="card"
      style={{ "--reveal-delay": `${(index % 3) * 60}ms` } as React.CSSProperties}
    >
      <div className="card-art">
        <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
        <Compass variant={test.color} />
        <span className="round-arrow">
          <ArrowUpRight size={21} />
        </span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{test.kind}</span>
          <span>
            <Clock size={12} /> {test.minutes} {t("分钟")}
          </span>
        </div>
        <h3>{test.name}</h3>
        <p>{test.tagline}</p>
        <div className="card-bottom">
          <span>
            {test.questions.length} {t("道题")} · {test.dimensions.length}{" "}
            {t("个维度")}
          </span>
          <span>
            {t("开始了解")}
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
export function Breadcrumb({ name }) {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  return (
    <div className="breadcrumb">
      <Link to="/tests">{t("全部测试")}</Link>
      <ChevronRight size={14} />
      <span>{name}</span>
    </div>
  );
}
export function Empty({
  title,
  children,
  headingLevel = 1,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
  headingLevel?: 1 | 2;
}) {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section className="empty">
      <span className="empty-symbol">◎</span>
      <Heading>{title}</Heading>
      <p>{children}</p>
      <Link className="button primary" to="/tests">
        {t("发现一个测试")}
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}
export function Confirm({ title, children, onConfirm, onCancel }) {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="confirm"
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
    >
      <h2>{title}</h2>
      <p>{children}</p>
      <div className="actions">
        <button autoFocus onClick={onCancel} className="button">
          {t("取消")}
        </button>
        <button className="button primary" onClick={onConfirm}>
          {t("确认删除")}
        </button>
      </div>
    </dialog>
  );
}
