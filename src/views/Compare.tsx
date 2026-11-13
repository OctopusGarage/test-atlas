import SocialActivities from "../components/SocialActivities";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  decodeInvite,
  buildSocialReport,
  rememberSocialReturn,
  type SocialMode,
} from "../engine/social";
import { assessments, getAssessment } from "../data/assessments";
import { store } from "../storage/store";
import { useLocale } from "../i18n";
import { isCompatible, compareResults } from "../engine/insights";
import { decodeResult, MAX_RESULT_BYTES } from "../engine/exchange";
export default function Compare() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // A new invitation starts a separate conversation. Language changes keep it open.
  const conversation = JSON.stringify([
    params.get("invite"),
    params.get("mode"),
  ]);
  return <CompareConversation key={conversation} />;
}
function CompareConversation() {
  const { locale, localizeAssessment, localizeError } = useLocale();
  const c = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let invitation: ReturnType<typeof decodeInvite> | null = null;
  let invitationError = "";
  if (params.has("invite")) {
    try {
      if (!["friend", "couple"].includes(params.get("mode") || ""))
        throw Error(c("Unknown invitation mode.", "未知邀请模式。"));
      invitation = decodeInvite(params.get("invite") || "", assessments);
    } catch (err) {
      invitationError = (err as Error).message;
    }
  }
  const results = store
    .get()
    .results.filter((r) => isCompatible(getAssessment(r.testId), r));
  const [firstId, setFirstId] = useState(
    results.find((r) => !invitation || r.testId === invitation.testId)?.id ||
      "",
  );
  const [secondId, setSecondId] = useState("");
  const [friendRevealed, setFriendRevealed] = useState(false);
  const [imported, setImported] = useState<any>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<SocialMode>(
    params.get("mode") === "couple" ? "couple" : "friend",
  );
  useEffect(
    () => setFriendRevealed(false),
    [firstId, secondId, mode, params.get("invite")],
  );
  const first = results.find((r) => r.id === firstId),
    second =
      invitation ||
      (secondId === "import"
        ? imported
        : results.find((r) => r.id === secondId));
  const raw = first && getAssessment(first.testId);
  const a = raw && localizeAssessment(raw);
  let rows: any[] = [];
  let mismatch = false;
  if (a && second) {
    try {
      rows = compareResults(a, first, second);
    } catch {
      mismatch = true;
    }
  }
  const social =
    raw && first && second && !mismatch
      ? buildSocialReport(localizeAssessment(raw), first, second, mode, locale)
      : null;
  return (
    <section className="page-section comparison-page">
      <header className="report-header">
        <h1>{c("Compare with curiosity", "带着好奇看见彼此")}</h1>
        <p>
          {c(
            "Explore differences with a friend, partner, or your earlier self. Scores cannot predict relationship success or compatibility.",
            "和朋友、伴侣或过去的自己探索差异。分数无法预测关系成功率或匹配程度。",
          )}
        </p>
      </header>
      {invitationError && <p role="alert">{localizeError(invitationError)}</p>}
      {invitation && (
        <section className="score-panel">
          <h2>{c("You have been invited", "你收到了一份邀请")}</h2>
          <p>
            {c(
              "Their scores are ready. Choose your own matching result below, or take the same assessment. Your scores stay on your device unless you explicitly share them.",
              "对方分数已就绪。请选择自己的同版本结果，或完成相同测试。除非主动分享，你的分数只保留在本机。",
            )}
          </p>
          <Link
            className="button"
            to={`/tests/${invitation.testId}/take`}
            onClick={() =>
              rememberSocialReturn(
                location.pathname + location.search,
                assessments,
              )
            }
          >
            {c("Take the same assessment and return", "完成相同测试并返回")}
          </Link>
        </section>
      )}
      {!results.length ? (
        <p>
          {c("Complete an assessment first.", "请先完成一份测试。")}{" "}
          <Link to="/tests">{c("Explore assessments", "探索测试")}</Link>
        </p>
      ) : (
        <>
          <label>
            {c("Discussion mode", "讨论模式")}{" "}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as SocialMode)}
            >
              <option value="friend">{c("Friends", "朋友")}</option>
              <option value="couple">{c("Partners", "伴侣")}</option>
            </select>
          </label>
          <label>
            {c("Your result", "你的结果")}{" "}
            <select
              value={firstId}
              onChange={(e) => {
                setFirstId(e.target.value);
                setSecondId("");
              }}
            >
              {!firstId && (
                <option value="">
                  {c("Choose your result", "选择你的结果")}
                </option>
              )}
              {results
                .filter((r) => !invitation || r.testId === invitation.testId)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {localizeAssessment(getAssessment(r.testId))?.name} ·{" "}
                    {r.completedAt?.slice(0, 10)}
                  </option>
                ))}
            </select>
          </label>
          {!invitation && (
            <label>
              {c("Compare to", "对照结果")}{" "}
              <select
                value={secondId}
                onChange={(e) => setSecondId(e.target.value)}
              >
                <option value="">
                  {c("Choose another result", "选择另一份结果")}
                </option>
                {results
                  .filter((r) => r.id !== firstId && r.testId === first?.testId)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.completedAt?.slice(0, 10)} · {r.id.slice(-6)}
                    </option>
                  ))}
                {imported && (
                  <option value="import">
                    {c("Imported result", "导入的结果")}
                  </option>
                )}
              </select>
            </label>
          )}
          <p>
            {c(
              "Ask the other person to export their result voluntarily. The file contains scores and version information only. Imports stay in this page and are never uploaded or added to history.",
              "请对方自愿导出结果。文件仅含分数与版本信息；导入只保留在当前页面，不上传、不加入历史。",
            )}
          </p>
          <label>
            {c(
              "Import result JSON (64 KiB maximum)",
              "导入结果 JSON（最多 64 KiB）",
            )}{" "}
            <input
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImported(null);
                setSecondId("");
                setError("");
                try {
                  if (file.size > MAX_RESULT_BYTES)
                    throw Error(c("File is too large.", "文件过大。"));
                  const result = decodeResult(await file.text(), assessments);
                  setImported(result);
                  setSecondId("import");
                } catch (err) {
                  setError((err as Error).message);
                }
                e.target.value = "";
              }}
            />
          </label>
          {error && <p role="alert">{localizeError(error)}</p>}
          {mismatch && (
            <p role="alert">
              {c(
                "Choose results from exactly the same assessment and content version.",
                "请选择完全相同测试与内容版本的结果。",
              )}
            </p>
          )}
          {!!rows.length && (
            <section className="score-panel">
              <h2>{social?.title}</h2>
              <p>
                {c(
                  "A conversation map based on your two actual score profiles. Differences describe preferences, not ability or relationship success.",
                  "根据两份实际分数生成的对话地图。差异描述偏好，不代表能力或关系成功率。",
                )}
              </p>
              {raw && first && second && (
                <SocialActivities
                  key={`${raw.id}:${first.id}:${secondId}:${mode}`}
                  assessment={raw}
                  first={first}
                  second={second}
                  mode={mode}
                  onReveal={() => setFriendRevealed(true)}
                />
              )}
              {(mode === "couple" || friendRevealed) &&
                social?.cards.map((d) => (
                  <article className="insight-card" key={d.id}>
                    <h3>
                      {d.name} · {d.theme}
                    </h3>
                    <p>
                      {c("You", "你")}: {d.first.toFixed(1)} — {d.firstText}
                    </p>
                    <p>
                      {c("Other person", "对方")}: {d.second.toFixed(1)} —{" "}
                      {d.secondText}
                    </p>
                    <p>
                      {c("Descriptive gap", "描述性差距")}: {d.gap.toFixed(1)} /
                      100
                    </p>
                    {mode === "couple" && <p>{d.need}</p>}
                    <p>{d.action}</p>
                  </article>
                ))}
              <details>
                <summary>{c("See score details", "查看分数明细")}</summary>
                <h2>{a?.name}</h2>
                <p>
                  {c(
                    "Scale positions out of 100; difference = second result minus first. These are descriptive differences, not statistical significance.",
                    "满分 100 的刻度位置；差值为第二份减第一份。这是描述性差异，不代表统计显著性。",
                  )}
                </p>
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>{c("Dimension", "维度")}</th>
                        <th>{c("First", "第一份")}</th>
                        <th>{c("Second", "第二份")}</th>
                        <th>{c("Difference", "差值")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((d) => (
                        <tr key={d.id}>
                          <th>{d.name}</th>
                          <td>{d.first.toFixed(1)}</td>
                          <td>{d.second.toFixed(1)}</td>
                          <td>
                            {d.difference > 0 ? "+" : ""}
                            {d.difference.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
              <p>
                {c(
                  "Similar scores can have different causes. Ask for examples; let each person explain their own experience.",
                  "相近分数也可能有不同原因。请用例子交流，让每个人解释自己的体验。",
                )}
              </p>
            </section>
          )}
        </>
      )}
    </section>
  );
}
