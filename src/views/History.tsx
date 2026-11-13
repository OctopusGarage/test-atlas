import { useLocale } from "../i18n";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { assessments, getAssessment } from "../data/assessments";
import { store } from "../storage/store";
import { Eyebrow, Empty, Confirm } from "../components/UI";
export default function History() {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const [data, setData] = useState(store.get()),
    [filter, setFilter] = useState(""),
    [pending, setPending] = useState<string | null>(null),
    [error, setError] = useState("");
  const results = data.results.filter((r) => !filter || r.testId === filter);
  function remove() {
    try {
      pending === "all" ? store.clear() : store.remove(pending!);
      setData(store.get());
      setPending(null);
    } catch (e) {
      setError(e.message);
      setPending(null);
    }
  }
  return (
    <section className="page-section history">
      <Eyebrow>YOUR EXPLORATION JOURNAL</Eyebrow>
      <div className="section-heading">
        <h1 className="page-title">
          {t("每次探索，")}
          <em>{t("都是一页自己。")}</em>
        </h1>
        {(data.results.length > 0 ||
          Object.keys(data.drafts).length > 0 ||
          store.status().includes("损坏")) && (
          <button className="button subtle" onClick={() => setPending("all")}>
            <Trash2 size={15} />
            {t("清空本地记录")}
          </button>
        )}
      </div>
      <p className="page-intro">
        {t(
          "记录保存在当前浏览器。换设备、清除浏览器数据后，这些记录不会自动同步。",
        )}
      </p>
      <label className="history-filter">
        {t("筛选测试")}
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">{t("全部测试")}</option>
          {assessments.map((a) => (
            <option key={a.id} value={a.id}>
              {localizeAssessment(a).name}
            </option>
          ))}
        </select>
      </label>
      {results.length ? (
        <div className="history-list">
          {results.map((r) => {
            const a = localizeAssessment(getAssessment(r.testId));
            return (
              <article key={r.id}>
                <span className={`history-symbol ${a?.color || "green"}`}>
                  {a?.symbol || "◎"}
                </span>
                <div>
                  <h2>
                    <Link to={`/results/${r.id}`}>
                      {a?.name || t("历史测试")} <ArrowUpRight size={17} />
                    </Link>
                  </h2>
                  <p>
                    {r.completedAt && Number.isFinite(Date.parse(r.completedAt))
                      ? new Date(r.completedAt).toLocaleString(
                          locale === "en" ? "en-US" : "zh-CN",
                        )
                      : t("完成时间未知")}{" "}
                    · v{r.testVersion || t("未知")}
                  </p>
                </div>
                <button
                  className="icon-button"
                  aria-label={t("删除这条记录")}
                  onClick={() => setPending(r.id)}
                >
                  <Trash2 size={17} />
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty
          headingLevel={2}
          title={filter ? t("这个测试还没有记录") : t("还没有留下探索记录")}
        >
          {t("你的第一份报告，会成为这本小小探索日记的第一页。")}
        </Empty>
      )}
      {error && <p role="alert">{localizeError(error)}</p>}
      {pending && (
        <Confirm
          title={
            pending === "all"
              ? t("清空全部本地数据？")
              : t("删除这条探索记录？")
          }
          onConfirm={remove}
          onCancel={() => setPending(null)}
        >
          {pending === "all"
            ? t("所有历史报告和答题草稿都会删除，无法恢复。")
            : t("这份报告将从当前设备删除，无法恢复。")}
        </Confirm>
      )}
      <p className="small-note">
        {t(
          "最多保留最近 100 条结果。原始答案只用于草稿，完成后不随历史报告长期保存。",
        )}
      </p>
    </section>
  );
}
