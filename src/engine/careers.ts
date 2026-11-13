import type { Assessment, Result } from "../types";
import { isCompatible, leadingDimensions } from "./insights";
export interface CareerExample {
  dimension: string;
  code: string;
  name: { en: string; zh: string };
  task: { en: string; zh: string };
  exercise: { en: string; zh: string };
  source: string;
}
const entry = (
  dimension: string,
  code: string,
  en: string,
  zh: string,
  taskEn: string,
  taskZh: string,
  exerciseEn: string,
  exerciseZh: string,
): CareerExample => ({
  dimension,
  code,
  name: { en, zh },
  task: { en: taskEn, zh: taskZh },
  exercise: { en: exerciseEn, zh: exerciseZh },
  source: `https://www.onetonline.org/link/summary/${code}`,
});
export const careerExamples: CareerExample[] = [
  entry(
    "D1",
    "47-2111.00",
    "Electrician",
    "电气安装与维护",
    "Work with circuits, tools and installation plans.",
    "接触电路、工具与安装图纸。",
    "Watch an introductory demonstration and list the training and safety requirements; do not experiment on live wiring.",
    "观看入门演示，列出培训和安全要求；不要自行操作带电线路。",
  ),
  entry(
    "D1",
    "17-3027.00",
    "Mechanical engineering technician",
    "机械工程技术支持",
    "Support physical prototypes, measurements and equipment testing.",
    "参与实体样机、测量和设备测试。",
    "Sketch a familiar mechanical object and explain how its parts interact.",
    "画一个熟悉机械物件的草图，解释部件如何配合。",
  ),
  entry(
    "D2",
    "15-2051.00",
    "Data scientist",
    "数据科学",
    "Use evidence and analysis to investigate questions in data.",
    "运用证据与分析探索数据中的问题。",
    "Find an openly available dataset and formulate one question before choosing a method.",
    "找一份开放数据，先提出一个问题，再考虑分析方法。",
  ),
  entry(
    "D2",
    "19-4021.00",
    "Biological technician",
    "生物实验技术支持",
    "Support observations, procedures and careful laboratory records.",
    "支持观察、操作流程和细致的实验记录。",
    "Read a published lab procedure and identify its variables, controls and safety prerequisites.",
    "阅读一份公开实验流程，标出变量、对照和安全前提。",
  ),
  entry(
    "D3",
    "27-1024.00",
    "Graphic designer",
    "平面设计",
    "Turn a communication goal into a visual composition.",
    "将沟通目标转化为视觉构图。",
    "Create two small layouts for the same message and explain the trade-offs.",
    "为同一条信息做两种小版式，说明各自取舍。",
  ),
  entry(
    "D3",
    "27-3042.00",
    "Technical writer",
    "技术写作",
    "Make complex information easier for a specific audience to use.",
    "让特定读者更容易使用复杂信息。",
    "Rewrite a confusing set of instructions and ask someone to follow it.",
    "改写一份难懂的操作说明，请一位读者实际照着做。",
  ),
  entry(
    "D4",
    "13-1151.00",
    "Training and development specialist",
    "培训与发展",
    "Design learning activities and check whether people can use what they learn.",
    "设计学习活动，检查学习内容能否应用。",
    "Explain one skill in ten minutes and invite the learner to demonstrate it.",
    "用十分钟讲解一项技能，请学习者演示一次。",
  ),
  entry(
    "D4",
    "21-1012.00",
    "Education or career advisor",
    "教育或职业咨询",
    "Help people explore educational choices and career information.",
    "帮助他人探索教育选择和职业信息。",
    "Compare two study routes using public requirements; verify local credentials before offering professional advice.",
    "按公开要求比较两条学习路径；提供专业服务前先核实当地资格要求。",
  ),
  entry(
    "D5",
    "13-1082.00",
    "Project management specialist",
    "项目协调与管理",
    "Coordinate people, scope, schedules and progress toward a shared deliverable.",
    "协调人员、范围、进度与共同交付。",
    "Plan a small volunteer task with milestones, owners and a check-in point.",
    "为一个小型志愿任务列出节点、负责人和沟通时间。",
  ),
  entry(
    "D5",
    "13-1161.00",
    "Market research specialist",
    "市场研究",
    "Investigate audiences and explain evidence behind a product or communication decision.",
    "研究受众，说明产品或沟通决策的证据。",
    "Draft five neutral interview questions and separate observations from assumptions.",
    "设计五个中立访谈问题，区分观察与假设。",
  ),
  entry(
    "D6",
    "43-3031.00",
    "Bookkeeping or accounting clerk",
    "账务记录与核对",
    "Maintain and reconcile detailed financial records under defined procedures.",
    "按规定流程维护与核对细致账务记录。",
    "Reconcile a fictional ledger and note where a checking procedure prevents mistakes.",
    "核对一份虚构账目，记录检查流程如何减少错误。",
  ),
  entry(
    "D6",
    "43-3051.00",
    "Payroll and timekeeping clerk",
    "薪酬与工时记录",
    "Check structured time and pay records for accuracy and completeness.",
    "检查结构化工时与薪资记录的准确性和完整性。",
    "Design an error-checking checklist using made-up time entries, without using personal payroll data.",
    "用虚构工时记录设计核对清单，不使用真实个人薪酬数据。",
  ),
];
export function careerSuggestions(a: Assessment, r: Result): CareerExample[] {
  if (a.id !== "career-interest" || !isCompatible(a, r)) return [];
  const leading = new Set(leadingDimensions(a, r).map((d) => d.id));
  return careerExamples.filter((role) => leading.has(role.dimension));
}
