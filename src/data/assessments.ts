import archived from "./archived-assessments.json" with { type: "json" };
import type { Result } from "../types";
import { extendedAssessments } from "./extended-assessments";
import { coreEnglish } from "./core-english";
import type { Assessment, Dimension } from "../types";
import contentLock from "./content-lock.json" with { type: "json" };
const dimension = (
  id: string,
  name: string,
  en: string,
  low: string,
  high: string,
  action: string,
): Dimension => ({
  id,
  name,
  en,
  low,
  high,
  action,
});
const bigDimensions = [
  dimension(
    "E",
    "外向性",
    "Extraversion",
    "你更习惯安静、独立的活动，小范围交流可能更自在。",
    "你较常从表达、互动和参与群体活动中获得动力。",
    "安排一次让你自在的交流，再留一段独处时间，观察各自带来的感受。",
  ),
  dimension(
    "A",
    "宜人性",
    "Agreeableness",
    "你的回答较少认同关心、体谅和帮助他人的题目；这不说明你的表达方式或独立判断能力。",
    "你较常关注他人感受，愿意体谅、帮助与建立合作。",
    "下次回应请求前，先确认自己的时间与意愿，再表达能提供的帮助。",
  ),
  dimension(
    "C",
    "尽责性",
    "Conscientiousness",
    "你的回答较少认同准备、秩序和落实的题目；情境、资源与习惯都值得了解，不能据此判断哪种安排更适合你。",
    "你较常重视准备、秩序与落实，清晰的安排能让你更安心。",
    "选一个小任务，把完成标准缩到今天能做到的一步。",
  ),
  dimension(
    "S",
    "情绪稳定性",
    "Emotional stability",
    "你的回答显示自己较容易察觉压力与情绪波动；这不是心理健康诊断。",
    "你的回答较多认同平稳、较少认同压力与情绪波动；题目没有测量压力后的恢复速度。",
    "记录一个最近有压力的场景，分别写下事件、感受和能获得的支持。",
  ),
  dimension(
    "O",
    "智识与想象",
    "Intellect / Imagination",
    "你更偏好具体、熟悉、可直接运用的信息与活动。",
    "你较常享受想象、反思与抽象概念，愿意探索新的想法。",
    "花十五分钟尝试一种不熟悉的表达方式，不用要求自己立刻擅长。",
  ),
];
// IPIP Big-Five Factor Markers: all ten items per factor, original key preserved.
const bank: Record<string, [string, number][]> = {
  E: [
    ["我常是聚会中带动气氛的人。", 0],
    ["我与他人相处时感到自在。", 0],
    ["我会主动开启谈话。", 0],
    ["聚会时，我会与许多不同的人交谈。", 0],
    ["我不介意成为大家关注的中心。", 0],
    ["我平时不太说话。", 1],
    ["我倾向待在不显眼的位置。", 1],
    ["我常觉得没有太多话可说。", 1],
    ["我不喜欢把大家的注意力引到自己身上。", 1],
    ["在陌生人面前，我比较安静。", 1],
  ],
  A: [
    ["我对他人很感兴趣。", 0],
    ["我能体谅他人的感受。", 0],
    ["我心肠柔软。", 0],
    ["我会抽时间帮助别人。", 0],
    ["我能感受到他人的情绪。", 0],
    ["我能让他人感到放松自在。", 0],
    ["我其实对他人不太感兴趣。", 1],
    ["我会出言侮辱别人。", 1],
    ["我对别人的困难不感兴趣。", 1],
    ["我很少关心他人。", 1],
  ],
  C: [
    ["我总会提前做好准备。", 0],
    ["我会注意细节。", 0],
    ["我会立即完成日常杂务。", 0],
    ["我喜欢井然有序。", 0],
    ["我会遵循时间安排。", 0],
    ["我对自己的工作要求严格。", 0],
    ["我常把物品随手乱放。", 1],
    ["我会把事情弄得杂乱无章。", 1],
    ["我经常忘记把东西放回原处。", 1],
    ["我会逃避自己应尽的责任。", 1],
  ],
  S: [
    ["大多数时候，我感到放松。", 0],
    ["我很少感到低落。", 0],
    ["我很容易感到压力。", 1],
    ["我常为各种事情担忧。", 1],
    ["我容易受到干扰而心烦。", 1],
    ["我很容易心烦意乱。", 1],
    ["我的心情变化很大。", 1],
    ["我的情绪经常起伏。", 1],
    ["我很容易烦躁。", 1],
    ["我经常感到低落。", 1],
  ],
  O: [
    ["我的词汇量丰富。", 0],
    ["我有生动的想象力。", 0],
    ["我常有很棒的想法。", 0],
    ["我能很快理解事物。", 0],
    ["我会使用较难的词语。", 0],
    ["我会花时间反思事情。", 0],
    ["我的脑海里充满点子。", 0],
    ["我觉得抽象的概念很难理解。", 1],
    ["我对抽象的概念不感兴趣。", 1],
    ["我的想象力不太丰富。", 1],
  ],
};
const makeQuestions = (groups: Record<string, [string, number][]>) => {
  const keys = Object.keys(groups);
  return Array.from(
    { length: Math.max(...keys.map((k) => groups[k].length)) },
    (_, i) =>
      keys.flatMap((k) =>
        groups[k][i]
          ? [
              {
                id: `${k}${i + 1}`,
                dimension: k,
                text: groups[k][i][0],
                reverse: !!groups[k][i][1],
              },
            ]
          : [],
      ),
  ).flat();
};
export const assessments: Assessment[] = [
  {
    id: "big-five",
    version: 2,
    scoringVersion: 1,
    reportVersion: 2,
    name: "大五人格",
    english: "THE BIG FIVE",
    category: "人格认知",
    kind: "理论参考",
    symbol: "✳",
    color: "green",
    minutes: "8–10",
    tagline: "用五个维度，展开你的性格地图。",
    description:
      "从外向性到想象力，看看你在日常生活中的行为倾向。性格可以是连续的光谱，不必只有一种标签。",
    basis:
      "采用 IPIP Big-Five Factor Markers 每维 10 题，共 50 题；保留原始计分方向。中文为本项目翻译，未经独立效度验证。",
    source: {
      label: "IPIP 原始题目与计分键",
      url: "https://ipip.ori.org/newBigFive5broadKey.htm",
      rights: "IPIP 原文与量表为 public domain；中文由 Test Atlas 翻译。",
    },
    instruction:
      "请根据平时的自己回答，而不是理想中的自己。没有标准答案，也不需要向任何人证明什么。",
    dimensions: bigDimensions,
    questions: makeQuestions(bank),
  },
  {
    id: "attachment",
    version: 2,
    scoringVersion: 1,
    reportVersion: 2,
    name: "依恋倾向",
    english: "CLOSER CONNECTIONS",
    category: "亲密关系",
    kind: "原创探索",
    symbol: "◎",
    color: "peach",
    minutes: "3–4",
    tagline: "靠近他人时，你需要怎样的安全感？",
    description:
      "观察你在亲密关系中对回应、距离与支持的感受。理解需要，是沟通的第一步。",
    basis:
      "参考依恋研究的焦虑与回避维度组织原创情境题。不是 ECR 或 ECR-RS 量表，不使用临床或权威类型阈值。",
    source: {
      label: "依恋维度研究背景（非本题库来源）",
      url: "https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm",
      rights: "本问卷 12 题由 Test Atlas 原创，无标准量表验证。",
    },
    instruction:
      "请始终想着同一位与你亲近的成年人（如伴侣或好友），按最近的实际互动回答。结果只描述你对此段关系的感受。",
    dimensions: [
      dimension(
        "anxiety",
        "回应敏感",
        "Response sensitivity",
        "你较少因回复速度或小变化而担心关系。",
        "你更容易留意对方的回应，也可能需要更明确的确认。",
        "把一次「你是不是不在乎我」换成具体请求，例如「忙时能否告诉我大概何时方便聊」。",
      ),
      dimension(
        "avoidance",
        "距离需要",
        "Need for distance",
        "你较愿意让对方了解感受，也愿意寻求支持。",
        "你较看重独立空间，表达脆弱或依赖他人可能让你不自在。",
        "选一件负担不大的事情，试着说明你需要什么帮助，同时约定彼此的空间。",
      ),
    ],
    questions: makeQuestions({
      anxiety: [
        ["对方比往常晚回复时，我会反复猜测关系是否出了问题。", 0],
        ["即使没有明显冲突，我也会担心自己不够被重视。", 0],
        ["我需要多次听到确认，才能相信对方仍然在意我。", 0],
        ["对方想独处时，我容易把它理解为对我的疏远。", 0],
        ["只要彼此说明情况，我通常能安心等待回复。", 1],
        ["一次不愉快后，我仍能相信彼此的关系有基础。", 1],
      ],
      avoidance: [
        ["遇到难事时，我更愿意独自处理，不让对方知道。", 0],
        ["当谈话涉及自己的脆弱时，我会想转移话题。", 0],
        ["对方希望更靠近我时，我常先感到压力。", 0],
        ["我担心接受帮助会让我失去自主。", 0],
        ["我能向对方说明自己的真实需要。", 1],
        ["在保留各自空间的同时，我也能享受亲近。", 1],
      ],
    }),
  },
  {
    id: "dark-triad",
    version: 2,
    scoringVersion: 1,
    reportVersion: 2,
    name: "暗黑人格探索",
    english: "THE SHADOW SIDE",
    category: "人格认知",
    kind: "原创探索",
    symbol: "◈",
    color: "lavender",
    minutes: "4–5",
    tagline: "看见不常谈起的那一面。",
    description:
      "在利益、关注与冲动面前，我们如何做选择？带着好奇观察自己，不用急着下定义。",
    basis:
      "围绕策略性、自我关注与冲动冷淡编写的原创题目，不是 SD3、Dirty Dozen 或诊断工具。分数只反映这些题目的自我报告。",
    source: {
      label: "暗黑三联征概念的原始研究",
      url: "https://doi.org/10.1016/S0092-6566(02)00505-6",
      rights: "本问卷 18 题及报告由 Test Atlas 原创；未复用原论文量表。",
    },
    instruction:
      "请根据真实行为回答。题目涉及不容易承认的想法，回答只留在当前设备。不要用结果给自己或别人贴上「危险」标签。",
    dimensions: [
      dimension(
        "strategy",
        "策略性",
        "Strategic behavior",
        "你较少认可在这些情境中隐藏意图或利用信息差。",
        "你的回答较多认可策略与控制；值得观察它们如何影响互信。",
        "在下一次需要协商时，先公开自己的核心诉求，尝试减少信息不对称。",
      ),
      dimension(
        "attention",
        "自我关注",
        "Self-focus",
        "你较少依靠关注和认可来确认自己在这些情境中的价值。",
        "你较在意被重视、被认可或拥有独特的位置。",
        "听完对方的一段经历后，先追问一个细节，再分享自己的经历。",
      ),
      dimension(
        "impulse",
        "冲动与冷淡",
        "Impulsivity / detachment",
        "你在这些情境中较常考虑后果与他人感受。",
        "你的回答较多认可即时行动或与他人感受保持距离。",
        "重要决定前停十分钟，写下它对自己和另一个人各有什么影响。",
      ),
    ],
    questions: makeQuestions({
      strategy: [
        ["为了得到想要的结果，我有时会刻意不说明自己的真正目的。", 0],
        ["在竞争中，我觉得掌握他人不知道的信息比坦诚更重要。", 0],
        ["只要不被发现，我会考虑利用规则的漏洞。", 0],
        ["我会先判断一个人能给我带来什么，再决定投入多少关系。", 0],
        ["即使会失去一些优势，我也愿意把重要条件说明白。", 1],
        ["我不愿用别人的信任交换短期利益。", 1],
      ],
      attention: [
        ["当努力没有被注意到时，我会格外难受。", 0],
        ["在群体里，我希望自己的意见得到更多关注。", 0],
        ["我容易觉得自己应当获得例外待遇。", 0],
        ["别人受到表扬时，我会急着证明自己也很出色。", 0],
        ["即使不是焦点，我也能享受一段相处。", 1],
        ["我能接受别人暂时没有认可我的贡献。", 1],
      ],
      impulse: [
        ["为了当下的刺激，我会先行动，再考虑对别人的影响。", 0],
        ["冲突中，我有时并不在意自己的话是否让人受伤。", 0],
        ["即使已经答应别人，我也可能因为一时兴起改变安排。", 0],
        ["别人因我的选择受影响时，我容易觉得那主要是他们的问题。", 0],
        ["做了让别人难受的事，我会愿意承担修复的责任。", 1],
        ["我会因为可能伤害他人而放弃一个诱人的机会。", 1],
      ],
    }),
  },
];
assessments.push(...extendedAssessments);

// Lock the actual English content alongside Chinese, including core inventories.
// Archived definitions carry their own translations instead of using newer wording.
for (const a of assessments) {
  const en = coreEnglish[a.id];
  if (!en) continue;
  a.en = {
    ...en,
    source: { ...a.source, ...en.source },
    dimensions: a.dimensions.map((d, i) => ({ ...d, ...en.dimensions[i] })),
    questions: a.questions.map((q, i) => ({ ...q, text: en.questions[i] })),
  };
}

for (const assessment of assessments)
  assessment.contentHash = (contentLock as Record<string, { hash: string }>)[
    assessment.id
  ]?.hash;

export const getAssessment = (id: string | undefined) =>
  assessments.find((a) => a.id === id);
export function validateDefinition(a: Assessment) {
  if (!a.id || !a.version || !a.dimensions?.length || !a.questions?.length)
    throw Error("不完整的测试定义");
  const ids = new Set(),
    dims = new Set(a.dimensions.map((d) => d.id));
  for (const q of a.questions) {
    if (ids.has(q.id) || !dims.has(q.dimension) || !q.text)
      throw Error("题目定义无效");
    ids.add(q.id);
  }
  for (const d of dims)
    if (!a.questions.some((q) => q.dimension === d))
      throw Error("维度没有题目");
}
export const options = [
  "很不符合",
  "不太符合",
  "中立 / 不确定",
  "比较符合",
  "很符合",
];

export const archivedAssessments = archived as Assessment[];
export function resolveAssessment(result: Result): Assessment | undefined {
  return [getAssessment(result.testId), ...archivedAssessments].find(
    (a) =>
      a &&
      a.id === result.testId &&
      a.version === result.testVersion &&
      a.scoringVersion === result.scoringVersion &&
      a.reportVersion === result.reportVersion &&
      a.contentHash === result.contentHash,
  );
}
