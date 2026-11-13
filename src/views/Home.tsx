import { useLocale } from "../i18n";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  WifiOff,
  Sparkles,
} from "lucide-react";
import { assessments } from "../data/assessments";
import { store } from "../storage/store";
import { Compass } from "../components/Art";
import { Eyebrow, TestCard } from "../components/UI";
export default function Home() {
  const { t, locale, localizeAssessment, localizeError } = useLocale();
  const drafts = store.get().drafts;
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <Eyebrow>A LITTLE CURIOSITY. A NEW PERSPECTIVE.</Eyebrow>
          <h1>
            {t("循着好奇，")}
            <br />
            <em>{t("认识自己。")}</em>
          </h1>
          <p className="hero-description">
            {t("你比任何一个标签都丰富。")}
            <br />
            {t("从性格到关系，用一点时间，发现自己的不同侧面。")}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/tests">
              {t("开启一段探索")}
              <ArrowUpRight size={18} />
            </Link>
            <span>{t("不用注册，按自己的节奏来")}</span>
          </div>
          <div className="hero-note">
            <span className="tiny-star">✳</span>{" "}
            {t("没有标准答案，只有更了解自己的线索。")}
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-top">
            <span>YOUR INNER LANDSCAPE</span>
            <span>↗</span>
          </div>
          <Compass large />
          <div className="visual-bottom">
            <span>{t("每个人，都有自己的坐标。")}</span>
            <span>A MAP IN PROGRESS</span>
          </div>
          <span className="floating-label">{t("保持好奇 / STAY CURIOUS")}</span>
        </div>
      </section>
      {Object.keys(drafts).some((id) =>
        assessments.some((a) => a.id === id),
      ) && (
        <section className="resume-strip">
          <div>
            <strong>{t("接着上次的好奇，继续走走。")}</strong>
            <p>{t("你的答题进度已保留在这台设备。")}</p>
          </div>
          <div className="actions">
            {assessments
              .filter((a) => drafts[a.id])
              .map((a) => (
                <Link key={a.id} className="text-link" to={`/tests/${a.id}`}>
                  {t("继续")} {localizeAssessment(a).name}{" "}
                  <ArrowRight size={16} />
                </Link>
              ))}
          </div>
        </section>
      )}
      <section className="discovery">
        <div className="section-heading">
          <div>
            <Eyebrow>FIND YOUR NEXT QUESTION</Eyebrow>
            <h2>{t("今天，想了解哪一面？")}</h2>
          </div>
          <Link className="text-link" to="/tests">
            {t("全部测试")} ({assessments.length})<ArrowRight size={17} />
          </Link>
        </div>
        <div className="card-grid">
          {assessments.slice(0, 3).map((a, i) => (
            <TestCard key={a.id} test={localizeAssessment(a)} index={i} />
          ))}
        </div>
      </section>
      <section className="principles" data-reveal="section">
        <div>
          <ShieldCheck />
          <h3>{t("记录，只属于你")}</h3>
          <p>
            {t("无需账号，答案与记录留在当前设备。")}
            <br />
            {t("分享什么，由你决定。")}
          </p>
        </div>
        <div>
          <WifiOff />
          <h3>{t("随时暂停，安心回来")}</h3>
          <p>
            {t("自动保留答题进度。资源准备好后，")}
            <br />
            {t("没有网络也能继续探索。")}
          </p>
        </div>
        <div>
          <Sparkles />
          <h3>{t("多一点理解，少一点定义")}</h3>
          <p>
            {t("看见倾向与变化，而非给自己贴标签。")}
            <br />
            {t("每份报告都标明依据与边界。")}
          </p>
        </div>
      </section>
      <section className="closing" data-reveal="section">
        <Eyebrow>A NOTE BEFORE YOU BEGIN</Eyebrow>
        <p>
          {t("测试是一面小小的镜子，")}
          <br />
          {t("而你的人生，比镜子里的画面辽阔得多。")}
        </p>
        <Link to="/about" className="text-link">
          {t("了解我们的出发点")}
          <ArrowUpRight size={16} />
        </Link>
      </section>
    </>
  );
}
