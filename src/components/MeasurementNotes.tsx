import type { Assessment } from "../types";
import { useLocale } from "../i18n";
import { getMeasurementNote } from "../data/measurement-notes";
export default function MeasurementNotes({
  assessment,
}: {
  assessment: Assessment;
}) {
  const { locale } = useLocale();
  const note = getMeasurementNote(assessment.id);
  if (!note) return null;
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  return (
    <details className="measurement-notes">
      <summary>
        {c(
          "What this questionnaire measures — and what it does not",
          "这份问卷测量什么，以及它不能说明什么",
        )}
      </summary>
      <div>
        <h3>{c("Coverage", "内容覆盖")}</h3>
        <p>{note.coverage[locale]}</p>
        <h3>{c("Scoring and interpretation", "计分与解释")}</h3>
        <p>{note.scoring?.[locale]}</p>
        <h3>{c("Limits", "适用边界")}</h3>
        <p>{note.limitations[locale]}</p>
        <p>{note.translation[locale]}</p>
        <h3>{c("Sources and original instruments", "来源与原始测量工具")}</h3>
        <ul>
          {note.references.map((ref) => (
            <li key={ref.url}>
              <a href={ref.url} target="_blank" rel="noreferrer">
                {ref.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="small-note">
          {c(
            "Links distinguish original providers from conceptual references. A link or a similar topic does not make this an official instrument, establish validation, or imply endorsement.",
            "链接区分原始提供方与概念参考。同主题或提供链接，不表示本问卷是官方量表、已完成效度验证或获得机构认可。",
          )}
        </p>
      </div>
    </details>
  );
}
