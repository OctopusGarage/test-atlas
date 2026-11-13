import { useState } from "react";
import type { Assessment } from "../types";
import type { ScoreResult } from "../engine/insights";
import { leadingDimensions } from "../engine/insights";
import { buildSocialReport, type SocialMode } from "../engine/social";
import { useLocale } from "../i18n";
export default function SocialActivities({
  assessment,
  first,
  second,
  mode,
  onReveal,
}: {
  assessment: Assessment;
  first: ScoreResult;
  second: ScoreResult;
  mode: SocialMode;
  onReveal?: () => void;
}) {
  const { locale, localizeAssessment } = useLocale();
  const a = localizeAssessment(assessment);
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const [guess, setGuess] = useState(""),
    [reveal, setReveal] = useState(false),
    [focus, setFocus] = useState(a.dimensions[0].id),
    [agreement, setAgreement] = useState(""),
    [status, setStatus] = useState("");
  const leaders = leadingDimensions(a, second);
  const chosen = a.dimensions.find((d) => d.id === focus)!;
  function download() {
    const report = buildSocialReport(a, first, second, mode, locale);
    const content = [
      report.title,
      c(
        "A reflection report, not a measure of compatibility, ability or relationship success.",
        "反思报告，不测量匹配度、能力或关系成功率。",
      ),
      ...report.cards.flatMap((d) => [
        "",
        d.name,
        `${c("First", "第一份")}: ${d.first.toFixed(1)} / 100`,
        `${c("Second", "第二份")}: ${d.second.toFixed(1)} / 100`,
        d.theme,
        d.firstText,
        d.secondText,
        d.need,
        d.action,
      ]),
      "",
      c("Our chosen focus", "我们选择的议题"),
      chosen.name,
      c("Our voluntary agreement", "我们的自愿约定"),
      agreement.trim() || c("No agreement recorded.", "尚未记录约定。"),
      "",
      c(
        "Keep or change this agreement only by mutual choice. The exported file contains both score profiles and your note.",
        "仅在双方自愿时保留或修改约定。导出文件包含双方分数和填写的备注。",
      ),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `test-atlas-${a.id}-${mode}-report.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      c(
        "Report downloaded. It includes both score profiles and any note you entered.",
        "报告已下载，包含双方分数及你填写的备注。",
      ),
    );
  }
  return (
    <section className="social-activities">
      <h3>
        {mode === "friend"
          ? c("A friendly guessing game", "好友偏好猜猜看")
          : c("Make one shared agreement", "商定一个共同的小约定")}
      </h3>
      {mode === "friend" ? (
        <>
          <p>
            {c(
              "Before looking at the score details, guess which preference the other person endorsed most. This is a conversation game, not a test of friendship quality.",
              "查看分数明细前，猜猜对方最认同哪种偏好。这是聊天小游戏，不是友谊质量测试。",
            )}
          </p>
          <label>
            {c("Your guess", "你的猜测")}
            <select
              aria-label={c("Your guess", "你的猜测")}
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
                setReveal(false);
              }}
            >
              <option value="">
                {c("Choose a preference", "选择一种偏好")}
              </option>
              {a.dimensions.map((d) => (
                <option value={d.id} key={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button"
            disabled={!guess}
            onClick={() => {
              setReveal(true);
              onReveal?.();
            }}
          >
            {c("Reveal their pattern", "揭晓对方的偏好")}
          </button>
          {reveal && (
            <p role="status">
              {leaders.some((d) => d.id === guess)
                ? c(
                    "Your guess is among their leading preferences.",
                    "你猜中了对方较突出的偏好之一。",
                  )
                : c(
                    "Their leading preference was different. Ask for a recent example and discover what surprised you.",
                    "对方较突出的偏好与你猜的不同。请对方举个最近的例子，聊聊意外之处。",
                  )}{" "}
              {leaders.map((d) => d.name).join(" / ")}
              {leaders.length > 1
                ? c(
                    " — tied; there is no single winner.",
                    "——并列，没有单一领先项。",
                  )
                : ""}
            </p>
          )}
        </>
      ) : (
        <>
          <p>
            {c(
              "Choose a concrete focus together. Either person may decline. Start with a small, reversible change and choose when you will discuss how it felt.",
              "共同选择一个具体议题，任何一方都可以拒绝。从可撤回的小改变开始，并约定何时交流感受。",
            )}
          </p>
        </>
      )}
      <label>
        {c("Focus for this week", "本周共同议题")}
        <select
          aria-label={c("Focus for this week", "本周共同议题")}
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
        >
          {a.dimensions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        {c(
          "Our agreement (optional, stays on this page)",
          "我们的约定（可选，仅留在当前页面）",
        )}
        <textarea
          aria-label={c(
            "Our agreement (optional, stays on this page)",
            "我们的约定（可选，仅留在当前页面）",
          )}
          maxLength={1000}
          value={agreement}
          onChange={(e) => setAgreement(e.target.value)}
          placeholder={c(
            "What will we try, what can each person decline, and when will we check in?",
            "尝试什么、双方各自可以拒绝什么、何时复盘？",
          )}
        />
      </label>
      <p className="small-note">
        {c(
          "Downloading includes both score profiles and your note. Nothing is uploaded or added to either person’s history.",
          "下载会包含双方分数及填写的备注。不上传，不加入任一方的历史记录。",
        )}
      </p>
      <button className="button primary" onClick={download}>
        {c("Download our two-person report", "下载双人报告")}
      </button>
      {status && <p role="status">{status}</p>}
    </section>
  );
}
