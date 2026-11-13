import { getLocalizedAssessment, useLocale } from "../i18n";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { assessments } from "../data/assessments";
import { Eyebrow, TestCard } from "../components/UI";
export default function Catalog() {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "",
    category = params.get("category") || "全部";
  const filtered = assessments.filter(
    (a) =>
      (category === "全部" || a.category === category) &&
      (
        a.name +
        a.description +
        a.english +
        getLocalizedAssessment(a, "en").name +
        getLocalizedAssessment(a, "en").description
      )
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const change = (key, value) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    setParams(p, { replace: true });
  };
  return (
    <section className="page-section">
      <Eyebrow>THE EXPLORATION LIBRARY</Eyebrow>
      <h1 className="page-title">
        {t("每一种好奇，")}
        <em>{t("都值得探索。")}</em>
      </h1>
      <p className="page-intro">{t("不急着成为谁，先看看此刻的自己。")}</p>
      <div className="catalog-controls">
        <div className="filters" aria-label={t("测试类别")}>
          {["全部", "人格认知", "亲密关系", "趣味探索", "职业成长"].map((c) => (
            <button
              key={t(c)}
              aria-pressed={category === c}
              className={category === c ? "active" : ""}
              onClick={() => change("category", c)}
            >
              {t(c)}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={17} />
          <input
            placeholder={t("搜索你想了解的自己")}
            value={q}
            onChange={(e) => change("q", e.target.value)}
          />
        </label>
      </div>
      <div className="catalog-count">
        {filtered.length} {t("个可探索的测试")}{" "}
        <span>{t("持续生长的自我探索地图")}</span>
      </div>
      {filtered.length ? (
        <div className="card-grid">
          {filtered.map((a) => (
            <TestCard
              key={a.id}
              test={localizeAssessment(a)}
              index={assessments.indexOf(a)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h2>
            {q ? t("暂时没有找到匹配的测试") : t("这一片地图，还在慢慢生长。")}
          </h2>
          <p>{t("换一个关键词，或先从其他方向开始探索。")}</p>
          <button className="button" onClick={() => setParams({})}>
            {t("查看全部测试")}
          </button>
        </div>
      )}
    </section>
  );
}
