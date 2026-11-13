import { useState } from "react";
import type { Assessment, Result } from "../types";
import { useLocale } from "../i18n";
import { invitationPath, type SocialMode } from "../engine/social";
export default function SocialShare({
  assessment,
  result,
}: {
  assessment: Assessment;
  result: Result;
}) {
  const { locale, localizeAssessment } = useLocale();
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const [mode, setMode] = useState<SocialMode>("friend"),
    [consent, setConsent] = useState(false),
    [status, setStatus] = useState(""),
    [fallback, setFallback] = useState("");
  const a = localizeAssessment(assessment);
  const share = async (native: boolean) => {
    if (!consent) return;
    try {
      const url = new URL(window.location.href);
      url.hash = invitationPath(assessment, result, mode, locale);
      const link = url.href;
      if (native && navigator.share)
        await navigator.share({
          title: c("Explore our preferences", "探索我们的偏好"),
          url: link,
        });
      else if (navigator.clipboard?.writeText)
        await navigator.clipboard.writeText(link);
      else {
        setFallback(link);
        setStatus(
          c("Select and copy the invitation below.", "请选择并复制下方邀请。"),
        );
        return;
      }
      setStatus(
        c(
          "Invitation ready. Anyone with this link can read these scores.",
          "邀请已就绪。任何持有链接的人均可读取这些分数。",
        ),
      );
    } catch {
      setStatus(
        c(
          "Sharing was cancelled or unavailable. Try copying the link.",
          "分享已取消或不可用，请尝试复制链接。",
        ),
      );
      const url = new URL(window.location.href);
      url.hash = invitationPath(assessment, result, mode, locale);
      setFallback(url.href);
    }
  };
  return (
    <section className="social-share score-panel">
      <h2>{c("Invite someone to explore together", "邀请对方一起探索")}</h2>
      <label>
        {c("Play together", "一起玩")}{" "}
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as SocialMode);
            setConsent(false);
            setFallback("");
            setStatus("");
          }}
        >
          <option value="friend">
            {c("Friend PK · swap perspectives", "好友 PK · 交换视角")}
          </option>
          <option value="couple">
            {c("Partners · relationship map", "伴侣 · 关系地图")}
          </option>
        </select>
      </label>
      <p>
        {c(
          "Preview: the invitation contains the assessment, its version and these scores. No answers, dates or history IDs. The scores travel inside the link; recipients can forward it.",
          "预览：邀请包含测试、版本及以下分数，不含答案、日期或历史记录编号。分数包含在链接中，对方可以转发。",
        )}
      </p>
      <ul>
        {a.dimensions.map((d) => (
          <li key={d.id}>
            {d.name}: {result.scores[d.id].toFixed(1)} / 100
          </li>
        ))}
      </ul>
      <label>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (!e.target.checked) setFallback("");
          }}
        />
        {c(
          "I agree to include these scores in an invitation link.",
          "我同意将这些分数放入邀请链接。",
        )}
      </label>
      <div className="button-row">
        <button
          className="button primary"
          disabled={!consent}
          onClick={() => share(false)}
        >
          {c("Copy invitation", "复制邀请")}
        </button>
        <button
          className="button primary"
          disabled={!consent}
          onClick={() => share(true)}
        >
          {c("Share invitation", "分享邀请")}
        </button>
      </div>
      {status && <p role="status">{status}</p>}
      {fallback && consent && (
        <label>
          {c("Copy invitation link", "复制邀请链接")}
          <textarea
            aria-label={c("Copy invitation link", "复制邀请链接")}
            readOnly
            value={fallback}
            onFocus={(e) => e.target.select()}
          />
        </label>
      )}
    </section>
  );
}
