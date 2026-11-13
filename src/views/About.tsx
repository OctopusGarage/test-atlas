import { assessments } from "../data/assessments";
import { Eyebrow } from "../components/UI";
import { useLocale } from "../i18n";
export default function About() {
  const { locale, localizeAssessment } = useLocale();
  const copy = (en, zh) => (locale === "en" ? en : zh);
  return (
    <article className="about-page page-section">
      <Eyebrow>THE IDEA BEHIND THE ATLAS</Eyebrow>
      <h1 className="page-title">
        {copy(
          "See yourself. Leave room to change.",
          "看见自己，也允许自己改变。",
        )}
      </h1>
      <p className="about-lead">
        {copy(
          "Test Atlas is a self exploration atlas to browse at your own pace. Understanding yourself can begin with one good question.",
          "Test Atlas 是一本可以慢慢翻阅的自我探索地图。理解自己，可以从一个好问题开始。",
        )}
      </p>
      <section>
        <h2>
          {copy("A mirror with room for perspective", "一面镜子，留一点余地")}
        </h2>
        <p>
          {copy(
            "The library includes research informed questionnaires and original explorations. Every assessment states its sources and limits. Research informed does not mean this product or its Chinese translation has psychometric validation. Original explorations are not standardized scales. Results support reflection, not diagnosis, hiring decisions or relationship predictions.",
            "这里有参考人格研究的问卷，也有原创探索题。每份测试说明来源与边界。「理论参考」不意味着产品或中文译文经过心理测量验证；「原创探索」不是标准量表。结果用于反思，不是诊断、招聘依据或关系预测。",
          )}
        </p>
      </section>
      <section>
        <h2>
          {copy("Your data stays on your device", "你的数据，留在你的设备")}
        </h2>
        <p>
          {copy(
            "Scoring happens in your browser without an account, runtime AI or uploading answers. Drafts contain answers and are cleared after completion. History stores scores, versions and completion times, with up to 100 reports. Delete reports individually or clear local data from your journal. Records do not sync across browsers or devices. Clearing browser data removes them.",
            "计分在浏览器完成，无需账号，不调用运行时 AI，不上传答案。草稿包含答案，完成后清除；历史仅保存分数、版本与时间，最多 100 条。你可以在记录页逐条删除或清空。记录不跨设备同步，清除浏览器数据也会清除记录。",
          )}
        </p>
        <p>
          {copy(
            "If local storage is unavailable, a notice appears and records stay in memory for this session. Refreshing may lose them. GitHub Pages handles static resource requests; this app adds no analytics SDK.",
            "本地存储不可用时会显示提示，本次会话继续使用内存，刷新可能丢失。静态资源由 GitHub Pages 托管；应用没有添加分析 SDK。",
          )}
        </p>
      </section>
      <section>
        <h2>{copy("Take your atlas with you", "把探索地图，放进口袋")}</h2>
        <p>
          {copy(
            "Supported desktop and Android browsers offer an install button or browser menu option. On iPhone and iPad, use Safari’s Share menu and Add to Home Screen. Availability varies by browser.",
            "支持的桌面与 Android 浏览器可使用安装按钮或菜单。iPhone 与 iPad 请在 Safari 分享菜单选择「添加到主屏幕」。入口因浏览器而异。",
          )}
        </p>
        <p>
          {copy(
            "After a first online visit and the Ready to explore offline notice, you can open the app, answer questions, read reports and create cards offline. A first visit requires internet. Updates ask for confirmation and do not force a refresh during an assessment.",
            "首次联网访问并看到「已可离线探索」后，可以离线打开、答题、阅读报告与生成卡片。首次访问需要网络。更新由你确认，不会在答题中强制刷新。",
          )}
        </p>
      </section>
      <section>
        <h2>{copy("Assessments and sources", "题库与来源")}</h2>
        {assessments.map((base) => {
          const a = localizeAssessment(base);
          return (
            <div className="source-entry" key={a.id}>
              <h3>
                {a.name}{" "}
                <span>
                  {a.kind} · v{a.version}
                </span>
              </h3>
              <p>{a.basis}</p>
              <p>{a.source.rights}</p>
              <a href={a.source.url} target="_blank" rel="noreferrer">
                {a.source.label} ↗
              </a>
            </div>
          );
        })}
        <p>
          {copy(
            "All 0–100 scores describe positions on the item scale, not population percentiles. The fifth IPIP factor is Intellect / Imagination, not an overall ability evaluation.",
            "所有 0–100 分数表示题目刻度位置，不是人群百分位。IPIP 第五维度为智识与想象，并非完整的能力评价。",
          )}{" "}
          <a
            href="https://ipip.ori.org/newPermission.htm"
            target="_blank"
            rel="noreferrer"
          >
            IPIP Permission ↗
          </a>
        </p>
      </section>
      <section>
        <h2>{copy("Built for curiosity", "为好奇而作")}</h2>
        <a
          href="https://github.com/OctopusGarage/test-atlas"
          target="_blank"
          rel="noreferrer"
        >
          {copy("Source code and feedback ↗", "查看源代码与提交反馈 ↗")}
        </a>
      </section>
    </article>
  );
}
