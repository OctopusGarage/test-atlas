import { assessments } from "./assessments";

export interface MeasurementNote {
  status: "public-domain-inventory" | "original-exploration";
  coverage: { zh: string; en: string };
  limitations: { zh: string; en: string };
  translation: { zh: string; en: string };
  scoring?: { zh: string; en: string };
  references: { label: string; url: string }[];
}

// Links describe conceptual sources or an original provider, never an endorsement.
// Only the Big Five items reproduce a public-domain inventory in this registry.
export const measurementNotes: Record<string, MeasurementNote> = {
  "big-five": {
    status: "public-domain-inventory",
    coverage: {
      zh: "五个广域人格维度，每维10题；无细分面向。",
      en: "Five broad personality factors, ten items each; no facet scores.",
    },
    limitations: {
      zh: "50题保留IPIP方向，但0–100是答题范围换算，非人群百分位；神经质的方向必须按界面维度理解。",
      en: "The 50 items retain IPIP keying, but 0–100 is a response-range transformation, not a population percentile; read the displayed emotional-stability direction carefully.",
    },
    translation: {
      zh: "英文保留IPIP原文；中文为本项目翻译，未完成独立跨文化验证。",
      en: "English retains IPIP wording; Chinese is a project translation without independent cross-cultural validation.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://ipip.ori.org/newBigFive5broadKey.htm",
      },
    ],
  },
  attachment: {
    status: "original-exploration",
    coverage: {
      zh: "焦虑相关的回应敏感与回避相关的距离需要。",
      en: "Response sensitivity related to anxiety and distance needs related to avoidance.",
    },
    limitations: {
      zh: "12道原创题不是ECR-R或ECR-RS；不推定安全型类型，结果限于作答时所想的关系。",
      en: "Twelve original items are neither ECR-R nor ECR-RS; no secure-type classification is established, and answers concern the relationship held in mind.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm",
      },
    ],
  },
  "dark-triad": {
    status: "original-exploration",
    coverage: {
      zh: "策略性、自我关注、冲动冷淡三个自报行为主题。",
      en: "Three self-reported themes: strategy, self-focus and impulsive callousness.",
    },
    limitations: {
      zh: "这些原创主题不能与马基雅维利主义、自恋、精神病态标准分数互换；没有危险性或临床阈值。",
      en: "These original themes cannot substitute for standardized Machiavellianism, narcissism or psychopathy scores; no dangerousness or clinical cutoff is established.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://doi.org/10.1016/S0092-6566(02)00505-6",
      },
    ],
  },
  enneagram: {
    status: "original-exploration",
    coverage: {
      zh: "九种动机叙事的原创情景。",
      en: "Original scenarios organized around nine motivational narratives.",
    },
    limitations: {
      zh: "最高维只表示本次最被认可的叙事；没有验证核心类型、翼、成长路径或稳定人格分类。",
      en: "The highest score is the most endorsed narrative here; core types, wings, growth paths and stable classifications are not established.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://www.enneagraminstitute.com/type-descriptions/",
      },
    ],
  },
  strengths: {
    status: "original-exploration",
    coverage: {
      zh: "24种性格优势分别呈现，每种3题；区分创造力与好奇心等相邻主题。",
      en: "Twenty-four separately represented strengths, three original items each, separating adjacent themes such as creativity and curiosity.",
    },
    limitations: {
      zh: "覆盖24种概念不等于官方VIA量表；不是IPIP-VIA题项或短版，三题均正向且无常模，排序不能证明天赋或品德。",
      en: "Conceptual coverage of 24 strengths does not make this the official VIA Survey; these are neither IPIP-VIA items nor a validated short form. Three positive items per dimension and no norms cannot establish talent or moral worth.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://www.viacharacter.org/character-strengths",
      },
      {
        label: "Public-domain IPIP-VIA alternative (not used here)",
        url: "https://ipip.ori.org/newVIAKey.htm",
      },
      {
        label: "IPIP public-domain reuse statement",
        url: "https://ipip.ori.org/",
      },
    ],
  },
  "emotional-intelligence": {
    status: "original-exploration",
    coverage: {
      zh: "情绪辨认、自我调节与回应他人三个习惯。",
      en: "Three habits: noticing emotion, regulating oneself and responding to others.",
    },
    limitations: {
      zh: "自报习惯不同于能力任务，没有正确答案评分；不产生标准EQ或智力商数。",
      en: "Self-reported habits differ from ability tasks with right answers; this produces no standardized EQ or intelligence quotient.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  "six-factor": {
    status: "original-exploration",
    coverage: {
      zh: "六个原创主题对应诚实谦逊、情绪性、外向、宜人、尽责、开放的概念。",
      en: "Six original themes reflect concepts of honesty-humility, emotionality, extraversion, agreeableness, conscientiousness and openness.",
    },
    limitations: {
      zh: "不是HEXACO-PI-R，也不是IPIP初步类似构念量表；每维3题不覆盖24细分面向，情绪性不能视为大五神经质。 官方HEXACO-PI-R下载限非营利学术研究，公开网站或App使用受限；本项目未取得官方量表授权。",
      en: "Neither HEXACO-PI-R nor the preliminary IPIP analog; three items per domain do not cover 24 facets, and emotionality is not Big Five neuroticism. Official HEXACO-PI-R downloads are restricted to nonprofit academic research and public-site/app administration is restricted; this project has no license for that official instrument.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://hexaco.org/hexaco-inventory",
      },
      {
        label: "Preliminary IPIP analog (not HEXACO-PI-R; not used here)",
        url: "https://ipip.ori.org/newHEXACO_PI_key.htm",
      },
    ],
  },
  "love-expression": {
    status: "original-exploration",
    coverage: {
      zh: "肯定、陪伴、礼物、服务、身体接触五种关爱表达偏好。",
      en: "Five care-expression preferences: affirmation, time, gifts, service and touch.",
    },
    limitations: {
      zh: "不是官方爱情语言测验；偏好可并存，身体接触须有同意，分差不是关系匹配率。",
      en: "Not the official love-languages quiz; preferences can coexist, touch requires consent, and score differences are not relationship compatibility.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://5lovelanguages.com/quizzes/love-language",
      },
    ],
  },
  "romantic-style": {
    status: "original-exploration",
    coverage: {
      zh: "主动表达、慢热建立、理想意义三个关系主题。",
      en: "Three relationship themes: initiative, gradual trust and idealized meaning.",
    },
    limitations: {
      zh: "不是恋爱类型诊断；不能从主动程度推断依恋、忠诚或适合哪位伴侣。",
      en: "No romantic-type diagnosis; initiative cannot establish attachment, fidelity or partner suitability.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  conflict: {
    status: "original-exploration",
    coverage: {
      zh: "退开、争取、折中、合作、迁就五种原创应对主题。",
      en: "Five original response themes: taking space, advocacy, compromise, collaboration and accommodation.",
    },
    limitations: {
      zh: "不是Thomas–Kilmann TKI；暂停不同于全面回避，争取不同于强迫竞争；各维独立评分而非强迫选择，情境和权力差异会改变策略。",
      en: "Not the Thomas–Kilmann TKI; pausing differs from general avoidance and advocacy from coercive competition. Dimensions score independently rather than through forced choice; context and power alter appropriate strategies.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://kilmanndiagnostics.com/overview-thomas-kilmann-conflict-mode-instrument-tki/",
      },
    ],
  },
  boundaries: {
    status: "original-exploration",
    coverage: {
      zh: "时间拒绝、隐私选择、情绪责任。",
      en: "Time limits, privacy choices and emotional responsibility.",
    },
    limitations: {
      zh: "边界是情境中的协商；分数不判断他人是否有害，也不是虐待或创伤筛查。",
      en: "Boundaries are negotiated in context; scores do not identify harmful people or screen for abuse or trauma.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  communication: {
    status: "original-exploration",
    coverage: {
      zh: "直接澄清、理由解释与故事连接三种原创表达方式。",
      en: "Three original expression preferences: direct clarity, reasoned explanation and story-led connection.",
    },
    limitations: {
      zh: "不是沟通能力考试；更常使用一种方式不表示更有效，语言和权力环境影响表达。",
      en: "Not a communication skill exam; more frequent use does not mean greater effectiveness, and language and power affect expression.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  "psychological-age": {
    status: "original-exploration",
    coverage: {
      zh: "对新鲜、稳妥与玩心的趣味叙事。",
      en: "Playful narratives about novelty, steadiness and playfulness.",
    },
    limitations: {
      zh: "不估计实际心理年龄、成熟度或认知功能，不用年龄刻板印象评判人。",
      en: "Does not estimate mental age, maturity or cognition, and should not justify age stereotypes.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  animal: {
    status: "original-exploration",
    coverage: {
      zh: "以动物意象描述日常偏好。",
      en: "Animal metaphors for everyday preferences.",
    },
    limitations: {
      zh: "动物只是虚构隐喻；不是生物学分类或真实人格类型。",
      en: "Animals are fictional metaphors, not biological classifications or real personality types.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  villain: {
    status: "original-exploration",
    coverage: {
      zh: "虚构反派叙事与创作偏好。",
      en: "Fictional villain narratives and storytelling preferences.",
    },
    limitations: {
      zh: "喜爱虚构角色不代表真实攻击、道德或犯罪风险；不与暗黑三联征量表互换。",
      en: "Enjoying a fictional role does not imply aggression, morality or crime risk and is not a Dark Triad score.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  survival: {
    status: "original-exploration",
    coverage: {
      zh: "假设困境中的组织、准备与应变偏好。",
      en: "Preferences for organizing, preparing and adapting in imagined adversity.",
    },
    limitations: {
      zh: "不测生存技能、急救知识或真实危险下的表现；不能用来制定安全决策。",
      en: "Does not measure survival skills, first-aid knowledge or real performance under danger; it cannot guide safety decisions.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  "online-persona": {
    status: "original-exploration",
    coverage: {
      zh: "网络中的观察、表达与互动偏好。",
      en: "Online observation, expression and interaction preferences.",
    },
    limitations: {
      zh: "不根据账号数据推断身份；平台规则、受众和使用目的可能改变行为。",
      en: "Does not infer identity from account data; platform rules, audiences and goals can change behavior.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  "social-energy": {
    status: "original-exploration",
    coverage: {
      zh: "社交前后感到的精力与恢复偏好。",
      en: "Perceived energy and recovery preferences around social contact.",
    },
    limitations: {
      zh: "不是社交障碍、抑郁或疲劳筛查，也不能等同外向性；睡眠与压力影响回答。",
      en: "Not a screen for social disorders, depression or fatigue, and not equivalent to extraversion; sleep and stress influence answers.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  consumption: {
    status: "original-exploration",
    coverage: {
      zh: "计划、即时满足与体验相关消费偏好。",
      en: "Spending preferences around planning, immediate gratification and experience.",
    },
    limitations: {
      zh: "不评估偿债能力或提供财务建议；预算和生活资源影响可选行为。",
      en: "Does not assess solvency or provide financial advice; budgets and resources constrain behavior.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  "career-interest": {
    status: "original-exploration",
    coverage: {
      zh: "RIASEC六种职业活动兴趣，每种3道原创情景。",
      en: "Six RIASEC activity interests, three original scenarios per area.",
    },
    limitations: {
      zh: "不是O*NET Interest Profiler；兴趣不等于能力、资格、职位适配或劳动力市场机会。",
      en: "Not the O*NET Interest Profiler; interest does not establish ability, qualifications, job fit or labor-market opportunity.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://www.onetcenter.org/IP.html",
      },
    ],
  },
  "work-style": {
    status: "original-exploration",
    coverage: {
      zh: "主导、影响、稳健与谨慎相关的原创工作主题。",
      en: "Original work themes related to dominance, influence, steadiness and care.",
    },
    limitations: {
      zh: "不是官方DISC或Everything DiSC；不使用供应商常模，不能用于招聘或绩效评定。",
      en: "Not an official DISC or Everything DiSC instrument; no vendor norms are used, and results are unsuitable for hiring or performance appraisal.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [
      {
        label: "Original provider / conceptual background",
        url: "https://www.everythingdisc.com/",
      },
    ],
  },
  values: {
    status: "original-exploration",
    coverage: {
      zh: "收入、自由、稳定、成就与影响等工作价值主题。",
      en: "Work-value themes including income, freedom, stability, achievement and impact.",
    },
    limitations: {
      zh: "逐维认可并非必须取舍的价值排序；无法直接换算薪资或岗位推荐。",
      en: "Independent endorsement is not a forced trade-off ranking; scores cannot directly determine salary or job recommendations.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  learning: {
    status: "original-exploration",
    coverage: {
      zh: "学习策略、环境与反馈的近期偏好。",
      en: "Recent preferences in learning strategies, environments and feedback.",
    },
    limitations: {
      zh: "不把人分为固定视觉或听觉学习者；偏好不证明某教学法能提高成绩。",
      en: "Does not classify fixed visual or auditory learners; preferences do not demonstrate that a teaching method improves achievement.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  procrastination: {
    status: "original-exploration",
    coverage: {
      zh: "任务厌恶、标准压力、选择负担三个原创拖延情境。",
      en: "Three original delay themes: task aversion, standards pressure and choice overload.",
    },
    limitations: {
      zh: "不诊断ADHD或其他心理疾病；拖延受工作量、健康、资源和任务设计影响。",
      en: "Does not diagnose ADHD or other conditions; workload, health, resources and task design affect delay.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
  decision: {
    status: "original-exploration",
    coverage: {
      zh: "证据分析、经验直觉、风险谨慎、小步试行四种方式。",
      en: "Four approaches: evidence analysis, experienced intuition, risk caution and small experiments.",
    },
    limitations: {
      zh: "这些方式可同时使用；没有最佳类型或正确率推断，涉及高风险时需独立证据与专业意见。",
      en: "Approaches can coexist; no best type or accuracy level is established, and high-stakes choices require independent evidence and professional input.",
    },
    translation: {
      zh: "中英文题目及报告由本项目编写，未完成回译、测量等值性或人群效度研究。",
      en: "Chinese and English items and reports are project-authored; back-translation, measurement invariance and population validation have not been established.",
    },
    references: [],
  },
};

export function getMeasurementNote(id: string) {
  return measurementNotes[id];
}

export function coveredDimensionNames(id: string, locale: "zh" | "en") {
  const assessment = assessments.find((entry) => entry.id === id);
  return (
    assessment?.dimensions.map((dimension) =>
      locale === "en" ? dimension.en : dimension.name,
    ) ?? []
  );
}

for (const [id, note] of Object.entries(measurementNotes)) {
  note.scoring =
    id === "big-five"
      ? {
          zh: "按IPIP计分键反向处理后，每维取均值并换算为0–100。没有项目人群常模、置信区间或可靠变化阈值。",
          en: "Reverse-key items using the IPIP key, average within each domain and transform to 0–100. No project population norms, confidence intervals or reliable-change threshold are available.",
        }
      : {
          zh: "各维题目独立取均值并换算为0–100，表示这些情景的认可程度。最高维标签只是本次回答的相对描述；不同维度、测试或语言分数不可视为等值，分差和重测变化没有统计显著性解释。",
          en: "Items are averaged independently within each dimension and transformed to 0–100, describing endorsement of these scenarios. A top-dimension label is only a relative description of these answers; scores across dimensions, tests or languages are not established as equivalent, and gaps or retest changes have no statistical-significance interpretation.",
        };
}
