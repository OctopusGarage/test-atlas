import { describeDimensionScore } from "../engine/interpretation";
import type { Assessment, Result } from "../types";
import { useLocale } from "../i18n";
import { getPresentation, roleSvg } from "../engine/presentation";
import { leadingDimensions, isCompatible } from "../engine/insights";
const colors = [
  "#597b61",
  "#b27f65",
  "#8a7aa3",
  "#7b9896",
  "#a18d58",
  "#809064",
  "#b57a86",
  "#668b9f",
  "#8e846c",
];
export default function ResultVisualization({
  assessment,
  result,
}: {
  assessment: Assessment;
  result: Result;
}) {
  const { locale, localizeAssessment } = useLocale();
  const a = localizeAssessment(assessment);
  if (!isCompatible(a, result)) return null;
  const view = getPresentation(a.id);
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const leaders = leadingDimensions(a, result);
  const max = Math.max(...Object.values(result.scores));
  const n = a.dimensions.length;
  const point = (i: number, r: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [250 + Math.cos(angle) * r, 250 + Math.sin(angle) * r];
  };
  const legend = (
    <ol className="visual-legend">
      {a.dimensions.map((d, i) => (
        <li key={d.id}>
          <span
            className="legend-index"
            style={{ background: colors[i % colors.length] }}
          >
            {i + 1}
          </span>
          <span>{d.name}</span>
          <strong>{Math.round(result.scores[d.id])}</strong>
        </li>
      ))}
    </ol>
  );
  let visual: React.ReactNode;
  if (view.kind === "characters")
    visual = (
      <div className="character-grid">
        {a.dimensions.map((d) => (
          <article
            key={d.id}
            className={
              max > 50 && leaders.some((x) => x.id === d.id)
                ? "character-card leading"
                : "character-card"
            }
          >
            <div
              className="character-portrait"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: roleSvg(a.id, d.id) }}
            />
            <h3>{d.name}</h3>
            <p>{Math.round(result.scores[d.id])} / 100</p>
            <p>{describeDimensionScore(d, result.scores[d.id], locale)}</p>
          </article>
        ))}
      </div>
    );
  else if (view.kind === "battery")
    visual = (
      <div className="battery-map">
        {a.dimensions.map((d) => (
          <article key={d.id}>
            <div>
              <h3>{d.name}</h3>
              <strong>{Math.round(result.scores[d.id])} / 100</strong>
            </div>
            <div className="battery-cells" aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(result.scores[d.id] / 10) ? "filled" : ""
                  }
                />
              ))}
            </div>
            <p>{d.action}</p>
          </article>
        ))}
      </div>
    );
  else if (view.kind === "ranked")
    visual = (
      <div className="ranked-map">
        {[...a.dimensions]
          .sort((x, y) => result.scores[y.id] - result.scores[x.id])
          .map((d) => (
            <article key={d.id}>
              <h3>
                {d.name}
                <span>{Math.round(result.scores[d.id])}</span>
              </h3>
              <div className="dimension-track">
                <span style={{ width: `${result.scores[d.id]}%` }} />
              </div>
            </article>
          ))}
      </div>
    );
  else if (view.kind === "path")
    visual = (
      <ol className="reflection-path">
        {a.dimensions.map((d, i) => (
          <li key={d.id}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>
                {d.name} <small>{Math.round(result.scores[d.id])} / 100</small>
              </h3>
              <p>{describeDimensionScore(d, result.scores[d.id], locale)}</p>
              <p>{d.action}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  else if (view.kind === "balance")
    visual = (
      <div className="balance-map">
        {a.dimensions.map((d, i) => (
          <article key={d.id}>
            <div
              className="score-orbit"
              style={{
                background: `conic-gradient(${colors[i % colors.length]} ${result.scores[d.id] * 3.6}deg,#e8eadd 0deg)`,
              }}
            >
              <strong>{Math.round(result.scores[d.id])}</strong>
            </div>
            <h3>{d.name}</h3>
            <p>{d.action}</p>
          </article>
        ))}
      </div>
    );
  else {
    const polygon = a.dimensions
      .map((d, i) => point(i, result.scores[d.id] * 1.55).join(","))
      .join(" ");
    visual = (
      <div className={`geometric-map ${view.kind}`}>
        <svg viewBox="0 0 500 500" role="img" aria-label={view.title[locale]}>
          {[25, 50, 75, 100].map((level) => (
            <polygon
              key={level}
              points={a.dimensions
                .map((_, i) => point(i, level * 1.55).join(","))
                .join(" ")}
              fill="none"
              stroke="#cbd3be"
              strokeWidth="1"
            />
          ))}
          {a.dimensions.map((d, i) => {
            const [x, y] = point(i, 155);
            const [lx, ly] = point(i, 185);
            return (
              <g key={d.id}>
                <line x1="250" y1="250" x2={x} y2={y} stroke="#cbd3be" />
                <text
                  x={lx}
                  y={ly + 5}
                  textAnchor="middle"
                  fill="#556e4c"
                  fontSize="16"
                >
                  {i + 1}
                </text>
                {view.kind === "wheel" && (
                  <circle
                    cx={x}
                    cy={y}
                    r="11"
                    fill={colors[i % colors.length]}
                    opacity=".25"
                  />
                )}
              </g>
            );
          })}
          <polygon
            points={polygon}
            fill="#70926944"
            stroke="#52744e"
            strokeWidth="3"
          />
          {a.dimensions.map((d, i) => {
            const [x, y] = point(i, result.scores[d.id] * 1.55);
            return (
              <circle
                key={d.id}
                cx={x}
                cy={y}
                r="5"
                fill={colors[i % colors.length]}
              />
            );
          })}
          {view.kind === "petals" && (
            <circle cx="250" cy="250" r="10" fill="#b27f65" />
          )}
        </svg>
        {legend}
      </div>
    );
  }
  return (
    <section
      className={`result-visual report-feature view-${view.kind}`}
      aria-label={view.title[locale]}
    >
      <p className="eyebrow">YOUR PATTERN, IN PERSPECTIVE</p>
      <h2>{view.title[locale]}</h2>
      {visual}
      <p className="small-note">
        {view.note[locale]}{" "}
        {view.kind === "characters"
          ? c(
              "Original fictional portraits are metaphors, not measured identities.",
              "原创角色形象是隐喻，不是测量得到的固定身份。",
            )
          : null}
      </p>
    </section>
  );
}
