import React, { useEffect, useState, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Home from "./views/Home";
const Catalog = lazy(() => import("./views/Catalog"));
const Detail = lazy(() => import("./views/Detail"));
const Assessment = lazy(() => import("./views/Assessment"));
const Result = lazy(() => import("./views/Result"));
const History = lazy(() => import("./views/History"));
const About = lazy(() => import("./views/About"));
import PwaStatus from "./components/PwaStatus";
import { Empty } from "./components/UI";
import { store } from "./storage/store";
import "./styles.css";
import "./styles/polish.css";
import "./styles/motion.css";
import { MotionScene } from "./components/Motion";
const Compare = lazy(() => import("./views/Compare"));
const Profile = lazy(() => import("./views/Profile"));
import { LocaleProvider, useLocale } from "./i18n";
class Boundary extends React.Component<{
  children: React.ReactNode;
  locale: "en" | "zh";
}> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="empty">
        <h1>
          {this.props.locale === "zh"
            ? "地图暂时没有展开"
            : "The map could not load"}
        </h1>
        <p>
          {this.props.locale === "zh"
            ? "请刷新重试，已保存的记录仍留在设备本地。"
            : "Please reload and try again. Saved records remain on this device."}
        </p>
        <button className="button" onClick={() => location.reload()}>
          {this.props.locale === "zh" ? "刷新重试" : "Reload"}
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function App() {
  const { locale, setLocale, localizeError } = useLocale();
  const copy = (en: string, zh: string) => (locale === "zh" ? zh : en);
  const location = useLocation(),
    [warning, setWarning] = useState(store.status());
  useEffect(() => {
    const local = () => setWarning(store.status()),
      other = (e: StorageEvent) => {
        if (e.key === "test_atlas_v1")
          setWarning("其他窗口已修改记录，请刷新后继续，以免覆盖新进度。");
      };
    window.addEventListener("test-atlas-storage", local);
    window.addEventListener("storage", other);
    return () => {
      window.removeEventListener("test-atlas-storage", local);
      window.removeEventListener("storage", other);
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    setWarning(store.status());
    document.title = `Test Atlas · ${copy("Discover more of yourself", "自我探索地图")}`;
  }, [location.pathname, locale]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        {copy("Skip to content", "跳到主要内容")}
      </a>
      <header className="site-header">
        <Link
          className="brand"
          to="/"
          aria-label={copy("Test Atlas home", "Test Atlas 首页")}
        >
          <span className="brand-symbol">✳</span>
          <span>
            test atlas<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav aria-label={copy("Main navigation", "主要导航")}>
          <NavLink end to="/">
            {copy("Discover", "发现")}
          </NavLink>
          <NavLink to="/tests">{copy("All tests", "全部测试")}</NavLink>
          <NavLink to="/history">{copy("My journal", "我的记录")}</NavLink>
          <NavLink to="/compare">{copy("Compare", "双人对照")}</NavLink>
          <NavLink to="/profile">{copy("My atlas", "探索档案")}</NavLink>
        </nav>
        <Link to="/about" className="about-link">
          {copy("About", "关于")} <ArrowUpRight size={14} />
        </Link>
        <label className="language-select">
          <span className="sr-only">Language / 语言</span>
          <select
            aria-label="Language / 语言"
            value={locale}
            onChange={(e) => setLocale(e.target.value as "en" | "zh")}
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </label>
      </header>
      {warning && (
        <div className="storage-warning" role="alert">
          {localizeError(warning)}
        </div>
      )}
      <main id="main-content" tabIndex={-1}>
        <Boundary key={location.pathname} locale={locale}>
          <Suspense
            fallback={
              <p className="route-loading" role="status">
                {copy("Opening your atlas…", "正在展开地图…")}
              </p>
            }
          >
            <MotionScene key={location.pathname} sceneKey={location.pathname}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tests" element={<Catalog />} />
              <Route path="/tests/:testId" element={<Detail />} />
              <Route path="/tests/:testId/take" element={<Assessment />} />
              <Route path="/results/:resultId" element={<Result />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="*"
                element={
                  <Empty
                    title={copy(
                      "Beyond the edge of the map",
                      "似乎走到了地图之外",
                    )}
                  >
                    {copy(
                      "Find a new question to begin again.",
                      "从一个新的问题重新出发。",
                    )}
                  </Empty>
                }
              />
            </Routes>
            </MotionScene>
          </Suspense>
        </Boundary>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <Link className="brand" to="/">
            <span className="brand-symbol">✳</span>
            <span>test atlas.</span>
          </Link>
          <span>
            {copy(
              "Always a little more to discover.",
              "探索没有终点，认识自己也是。",
            )}
          </span>
          <Link to="/about">
            {copy("Sources, privacy & installation", "依据、隐私与安装")} ↗
          </Link>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Test Atlas · An OctopusGarage project
          </span>
          <PwaStatus />
          <a
            href="https://github.com/OctopusGarage/test-atlas"
            target="_blank"
            rel="noreferrer"
          >
            {copy("View on GitHub", "查看源代码")} ↗
          </a>
        </div>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </HashRouter>,
);
