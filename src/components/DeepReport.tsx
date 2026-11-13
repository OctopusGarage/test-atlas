import type { Assessment, Result } from "../types";
import { useLocale } from "../i18n";
import { buildDeepReport } from "../engine/deep-report";

export function DeepReport({
  assessment,
  result,
}: {
  assessment: Assessment;
  result: Result;
}) {
  const { locale } = useLocale();
  const r = buildDeepReport(assessment, result, locale);
  const en = locale === "en";
  return (
    <section className="deep-report">
      <h2>{en ? "Your patterns in everyday life" : "日常生活中的你"}</h2>
      <p>{r.combination}</p>
      <h3>{en ? "What your answers suggest" : "回答呈现的倾向"}</h3>
      {r.interpretations.map((d) => (
        <article key={d.id}>
          <h4>{d.name}</h4>
          <p>{d.text}</p>
        </article>
      ))}
      <h3>{en ? "Where the tradeoff appears" : "值得留意的取舍"}</h3>
      <p>{r.watchout}</p>
      <ul>
        {r.scenarios.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <h3>{en ? "Questions worth sitting with" : "留给自己的问题"}</h3>
      <ul>
        {r.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
      <h3>{en ? "A seven-day experiment" : "七天小实验"}</h3>
      <p>{r.experiment.purpose}</p>
      <ol>
        {r.experiment.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {r.experiment.tailored.map((d) => (
        <p key={d.dimension}>
          <strong>{d.dimension}: </strong>
          {d.action}
        </p>
      ))}
      <p className="muted">{r.limitation}</p>
    </section>
  );
}
