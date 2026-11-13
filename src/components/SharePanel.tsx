import { useLocale } from "../i18n";
import { useState } from "react";
import { Download, Link as LinkIcon } from "lucide-react";
import { downloadCard, publicLink } from "../sharing/card";
export default function SharePanel({ assessment, result }) {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const [include, setInclude] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function save() {
    setBusy(true);
    try {
      await downloadCard(assessment, result, include, locale);
      setMessage("卡片已生成。链接与二维码只打开测试介绍。");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(publicLink(assessment.id, locale));
      setMessage("测试介绍链接已复制，不含个人分数。");
    } catch {
      setMessage("自动复制不可用，请选择下方链接手动复制。");
    }
  }
  return (
    <section className="share-box">
      <div>
        <p className="eyebrow">SHARE A LITTLE CURIOSITY</p>
        <h2>{t("把好奇，也分享给朋友。")}</h2>
        <p>{t("默认分享通用卡片。是否展示维度分数，由你选择。")}</p>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={include}
            onChange={(e) => setInclude(e.target.checked)}
          />
          {t("在图片中展示我的维度分数")}
        </label>
      </div>
      <div className="share-actions">
        <button className="button primary" disabled={busy} onClick={save}>
          <Download size={16} />
          {busy ? t("正在生成卡片…") : t("保存分享卡片")}
        </button>
        <button className="button" onClick={copy}>
          <LinkIcon size={16} />
          {t("复制测试链接")}
        </button>
        <input
          aria-label={t("公开测试链接")}
          readOnly
          value={publicLink(assessment.id, locale)}
          onFocus={(e) => e.target.select()}
        />
      </div>
      {message && (
        <p role="status" className="share-status">
          {localizeError(message)}
        </p>
      )}
    </section>
  );
}
