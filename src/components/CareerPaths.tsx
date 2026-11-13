import type { Assessment, Result } from "../types";
import { useLocale } from "../i18n";
import { careerSuggestions } from "../engine/careers";
export default function CareerPaths({
  assessment,
  result,
}: {
  assessment: Assessment;
  result: Result;
}) {
  const { locale } = useLocale();
  const roles = careerSuggestions(assessment, result);
  if (!roles.length) return null;
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  return (
    <section className="career-paths report-feature">
      <p className="eyebrow">TURN INTEREST INTO EXPLORATION</p>
      <h2>
        {c("Career directions to investigate", "值得进一步了解的职业方向")}
      </h2>
      <p>
        {c(
          "These occupation examples relate to your leading interest areas. They do not evaluate your skills, qualifications or job prospects. O*NET describes US occupations; local duties and entry requirements vary.",
          "这些岗位示例与你较突出的兴趣领域相关，不评估技能、资格或就业前景。O*NET 描述美国职业；当地职责与准入要求可能不同。",
        )}
      </p>
      <div className="career-grid">
        {roles.map((role) => (
          <article key={role.code}>
            <span className="career-code">O*NET {role.code}</span>
            <h3>{role.name[locale]}</h3>
            <p>{role.task[locale]}</p>
            <strong>{c("Try a small exploration", "做一个小探索")}</strong>
            <p>{role.exercise[locale]}</p>
            <a href={role.source} target="_blank" rel="noreferrer">
              {c(
                "Read tasks, preparation and requirements",
                "查看职责、准备与资格要求",
              )}{" "}
              ↗
            </a>
          </article>
        ))}
      </div>
      <div className="action-note">
        <strong>{c("A practical next step", "下一步行动")}</strong>
        <p>
          {c(
            "Choose two examples. Compare one ordinary working day, the training involved and the constraints that matter to you. Talk to someone doing the work before committing to training or a career change.",
            "挑选两个示例，比较普通工作日、所需培训与自己在意的限制。在投入培训或转行前，与实际从业者交流。",
          )}
        </p>
      </div>
    </section>
  );
}
