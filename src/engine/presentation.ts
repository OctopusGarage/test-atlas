export type PresentationKind =
  | "radar"
  | "triangle"
  | "wheel"
  | "ranked"
  | "petals"
  | "compass"
  | "characters"
  | "battery"
  | "hexagon"
  | "path"
  | "balance";
interface Presentation {
  kind: PresentationKind;
  title: { en: string; zh: string };
  note: { en: string; zh: string };
}
const definitions: Record<string, [PresentationKind, string, string]> = {
  "big-five": ["radar", "Five dimensions, one landscape", "五维人格轮廓"],
  attachment: ["balance", "Closeness and space", "亲近与空间"],
  "dark-triad": [
    "triangle",
    "Three tendencies to reflect on",
    "三种倾向的张力",
  ],
  enneagram: ["wheel", "Nine motivational directions", "九种动机方向"],
  strengths: ["ranked", "Your strength constellation", "你的优势星图"],
  "emotional-intelligence": [
    "path",
    "Notice, pause, connect",
    "觉察、停顿、连接",
  ],
  "six-factor": [
    "radar",
    "Six sides of everyday personality",
    "日常人格的六个侧面",
  ],
  "love-expression": ["petals", "How you feel cared for", "你感受关爱的方式"],
  "romantic-style": ["balance", "How connection unfolds", "亲密如何展开"],
  conflict: ["compass", "Your conflict compass", "你的冲突应对罗盘"],
  boundaries: ["ranked", "The boundaries you protect", "你关注的边界"],
  communication: [
    "compass",
    "How you make yourself understood",
    "你如何让人理解自己",
  ],
  "psychological-age": [
    "characters",
    "Your everyday story character",
    "你的日常故事角色",
  ],
  animal: ["characters", "Meet your animal archetype", "认识你的动物角色"],
  villain: ["characters", "Your fictional antagonist", "你的虚构反派原型"],
  survival: ["characters", "Your imaginary camp role", "你的假想营地角色"],
  "online-persona": [
    "characters",
    "Your corner of the internet",
    "你的网络角色",
  ],
  "social-energy": ["battery", "Where your energy goes", "你的社交能量流向"],
  consumption: [
    "balance",
    "What draws you to a purchase",
    "什么影响你的消费选择",
  ],
  "career-interest": [
    "hexagon",
    "Your RIASEC interest landscape",
    "你的 RIASEC 兴趣版图",
  ],
  "work-style": [
    "compass",
    "Four ways you contribute",
    "你为团队带来的四种方式",
  ],
  values: ["ranked", "The trade-offs that matter", "你重视的取舍"],
  learning: ["path", "Your learning loop", "你的学习循环"],
  procrastination: ["path", "Where starting gets difficult", "开始行动的阻力"],
  decision: ["compass", "Your decision compass", "你的决策罗盘"],
};
export function getPresentation(id: string): Presentation {
  const row = definitions[id];
  if (!row) throw Error("Unknown assessment presentation");
  return {
    kind: row[0],
    title: { en: row[1], zh: row[2] },
    note: {
      en: "Shapes show positions on this questionnaire’s scales, not ability, population rank, or a fixed identity.",
      zh: "图形表示本问卷刻度位置，不是能力、人群排名或固定身份。",
    },
  };
}
export const characterTopics = new Set([
  "animal",
  "villain",
  "survival",
  "online-persona",
  "psychological-age",
]);
/** Original vector portraits, no third-party characters or external assets. */
export function roleSvg(topic: string, dimension: string): string {
  const index = Math.max(0, Number(dimension.replace(/\D/g, "")) - 1) % 3;
  const colors = ["#6f916f", "#bc8c70", "#8c7fa7"];
  const ink = "#244c3c",
    fill = colors[index];
  let art = "";
  if (topic === "animal") {
    art =
      index === 0
        ? '<path d="M76 118 70 47 113 82Q150 65 187 82L230 47 224 118Q245 174 215 212Q150 250 85 212Q55 174 76 118Z"/>'
        : index === 1
          ? '<path d="M91 88Q150 63 209 88L235 183 203 222Q150 246 97 222L65 183Z"/><path d="M91 88Q37 80 48 173L78 197 103 115M209 88Q263 80 252 173L222 197 197 115"/>'
          : '<path d="m63 66 64 33q23-8 46 0l64-33-21 98-66 80-66-80Z"/><path d="m84 164 66 80 66-80-41 21-25-25-25 25Z" fill="#f7f6f2"/>';
    art +=
      '<path d="m108 146 18 5m66-5-18 5" stroke-width="7"/><path d="m140 177 10 12 10-12Z" fill="#244c3c"/><path d="M150 189v14m0 0-16 7m16-7 16 7" fill="none"/>';
  } else if (topic === "villain") {
    art =
      index === 0
        ? '<path d="m103 75-18 50 14 102h102l14-102-18-50Z"/><path d="M87 117h126M150 75v152M109 160h25m32 0h25" fill="none"/><circle cx="150" cy="48" r="22" fill="none"/><path d="M150 35v14l10 8" fill="none"/>'
        : index === 1
          ? '<path d="M82 78q68-22 136 0v87q-14 57-68 72-54-15-68-72Z"/><path d="m102 131 32 9m64-9-32 9M119 190q31 22 62 0" fill="none"/><path d="m150 65 0 173" fill="none" stroke-dasharray="6 7"/>'
          : '<path d="m89 81 43-29 82 47-5 93-66 45-59-50Z"/><path d="m151 61-20 66 37 10-32 79" fill="none" stroke-width="9"/><path d="M58 222h184M67 254h166" fill="none"/>';
  } else {
    const badge =
      topic === "survival"
        ? index === 0
          ? '<path d="m150 25 13 26 29 4-21 21 5 29-26-14-26 14 5-29-21-21 29-4Z"/>'
          : index === 1
            ? '<rect x="118" y="29" width="64" height="54" rx="6"/><path d="M150 30v53m-31-27h62"/>'
            : '<path d="m150 25 40 60h-80Z"/><path d="m150 45 0 21"/>'
        : topic === "online-persona"
          ? index === 0
            ? '<path d="M111 62q39-48 78 0-39 48-78 0Z"/><circle cx="150" cy="62" r="10"/>'
            : index === 1
              ? '<path d="m112 79 63-47 13 17-63 47-20 1Z"/>'
              : '<circle cx="123" cy="53" r="13"/><circle cx="177" cy="53" r="13"/><path d="M136 53h28m-41 13 27 24 27-24"/>'
          : index === 0
            ? '<path d="M111 52h78m-39-39v78m-27-66 54 54m0-54-54 54"/>'
            : index === 1
              ? '<path d="M113 27h74v62h-74Z"/><path d="M130 40h40m-40 15h40m-40 15h26"/>'
              : '<path d="m116 71 34-47 34 47Z"/><circle cx="150" cy="64" r="20" fill="#f7f6f2"/>';
    art =
      badge +
      '<circle cx="150" cy="142" r="42"/><path d="M75 251v-20q0-46 75-46t75 46v20Z"/><path d="M133 141h3m28 0h3M136 161q14 12 28 0" fill="none" stroke-width="5"/>';
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect x="6" y="6" width="288" height="288" rx="144" fill="#e9eddf"/><g fill="${fill}" stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${art}</g></svg>`;
}
