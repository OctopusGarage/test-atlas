import { useLocale } from "../i18n";
import { useEffect, useState, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Download, WifiOff } from "lucide-react";
import { store } from "../storage/store";
export default function PwaStatus() {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const [install, setInstall] = useState<any>(null),
    [controlled, setControlled] = useState(
      !!navigator.serviceWorker?.controller,
    ),
    [message, setMessage] = useState("");
  const requested = useRef(false);
  const {
    needRefresh: [refresh],
    updateServiceWorker,
  } = useRegisterSW({
    // A worker activated by another tab must not reload an active assessment here.
    onNeedReload() {
      if (requested.current) location.reload();
    },
  });
  useEffect(() => {
    const capture = (e) => {
      e.preventDefault();
      setInstall(e);
    };
    const control = () => {
      setControlled(true);
      if (requested.current) location.reload();
    };
    window.addEventListener("beforeinstallprompt", capture);
    navigator.serviceWorker?.addEventListener("controllerchange", control);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      navigator.serviceWorker?.removeEventListener("controllerchange", control);
    };
  }, []);
  async function promptInstall() {
    try {
      await install.prompt();
      await install.userChoice;
      setInstall(null);
    } catch {
      setMessage("请使用浏览器菜单安装，或查看关于页面的安装说明。");
    }
  }
  async function update() {
    const transient = !!store.status();
    if (
      transient &&
      !confirm(
        t("本次记录仅在内存中，更新会丢失尚未保存的草稿与报告。确定仍要更新？"),
      )
    )
      return;
    if (
      !transient &&
      location.hash.includes("/take") &&
      !confirm(t("更新将刷新页面，已保存的进度可继续。现在更新？"))
    )
      return;
    requested.current = true;
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) await updateServiceWorker(true);
      else location.reload();
    } catch {
      requested.current = false;
      setMessage("暂时无法更新，请稍后重试。");
    }
  }
  return (
    <>
      {refresh && (
        <div className="update-banner" role="status">
          <span>
            {store.status()
              ? t("新版本已准备好。本次记录仅在内存中，更新会丢失未保存内容。")
              : t("新的探索地图已准备好。答题进度已自动保存。")}
          </span>
          <button onClick={update}>{t("更新应用 ↗")}</button>
        </div>
      )}
      <span className="offline-state">
        {controlled && (
          <>
            <WifiOff size={13} />
            <span>{t("已可离线探索")}</span>
          </>
        )}
      </span>
      {install && (
        <button className="install-button" onClick={promptInstall}>
          <Download size={15} />
          {t("安装应用")}
        </button>
      )}
      {message && <span role="status">{localizeError(message)}</span>}
    </>
  );
}
