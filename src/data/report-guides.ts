export interface ReportGuide {
  context: string;
  watchout: string;
  scenarioOne: string;
  scenarioTwo: string;
  question: string;
  experiment: string;
}
/** Original editorial reflection guides; these make no clinical or predictive claims. */
export const reportGuides: Record<string, Record<"en" | "zh", ReportGuide>> = {
  "big-five": {
    en: {
      context:
        "Your traits describe preferred ways of engaging, and different settings can reward different tendencies.",
      watchout:
        "A reliable habit can become restrictive when the situation asks for its opposite.",
      scenarioOne:
        "At a group meeting, compare your wish to speak with the time others need to prepare.",
      scenarioTwo:
        "On an unstructured weekend, notice whether a plan creates freedom or obligation.",
      question: "Which setting brings out a side of you these answers missed?",
      experiment:
        "Choose one meeting and one free afternoon. Try your usual approach first, then one small opposite approach. Compare energy and usefulness, not popularity.",
    },
    zh: {
      context: "特质描述你习惯如何参与生活，不同情境需要不同倾向。",
      watchout: "稳定的习惯遇到相反需求时，也可能限制选择。",
      scenarioOne: "集体会议中，对照自己的表达意愿与他人需要的准备时间。",
      scenarioTwo: "没有安排的周末，观察计划带来的是自由还是负担。",
      question: "什么情境会让你表现出本次回答没有呈现的一面？",
      experiment:
        "选一次会议和一个自由下午，先试惯常方式，再试一个小幅相反的选择，比较精力和实际帮助，而非受欢迎程度。",
    },
  },
  attachment: {
    en: {
      context:
        "Connection needs can change with trust, recent events and the particular relationship.",
      watchout:
        "Seeking certainty or protecting space can both leave the other person guessing if needs stay unspoken.",
      scenarioOne:
        "When a reply is late, separate the observable delay from the meaning you assign it.",
      scenarioTwo:
        "Before spending a weekend apart, agree on contact and personal time rather than testing closeness.",
      question:
        "What specific response would help you feel connected without giving up your space?",
      experiment:
        "Choose a low-stakes conversation. State one contact preference and invite the other person’s preference; test an agreement for two days and review whether both felt free to say no.",
    },
    zh: {
      context: "连接需求会随信任、近期事件和具体关系而变化。",
      watchout: "寻求确定感或保护空间，若没有说出需求，都可能让对方猜测。",
      scenarioOne: "消息迟迟未回时，区分实际延迟和你赋予它的含义。",
      scenarioTwo: "周末各自安排前，约定联系与个人时间，避免靠试探确认亲近。",
      question: "什么具体回应能让你感到连接，又保有自己的空间？",
      experiment:
        "选择一次低压力对话，说出一个联系偏好并邀请对方表达，试行两天后回看双方能否自在拒绝。",
    },
  },
  "dark-triad": {
    en: {
      context:
        "These answers invite reflection on influence, recognition and responsibility, not a moral label.",
      watchout:
        "A tactic that wins a short negotiation may cost trust when people learn how the decision was made.",
      scenarioOne:
        "When taking credit for a shared project, name contributions others can verify.",
      scenarioTwo:
        "When negotiating a favor, make the request and the other person’s right to decline explicit.",
      question:
        "Would I accept this tactic if someone used it on me with the same information?",
      experiment:
        "Review one decision affecting someone else. Explain your interests, ask what information they lack, and document a freely agreed next step. Revisit whether the agreement remained fair.",
    },
    zh: {
      context: "这些回答用于反思影响、认可与责任，不是道德标签。",
      watchout: "短期谈判有效的策略，可能在决策过程被看见后损害信任。",
      scenarioOne: "为团队成果争取认可时，明确他人可以核实的贡献。",
      scenarioTwo: "协商帮忙时，明确请求，也明确对方可以拒绝。",
      question: "若对方掌握同样信息并对我使用这种方式，我能接受吗？",
      experiment:
        "回看一个影响他人的决定，说明自己的利益，询问对方缺少的信息，记录自愿同意的下一步，再复盘约定是否仍公平。",
    },
  },
  enneagram: {
    en: {
      context:
        "Motives can overlap; a familiar story about yourself is a hypothesis to test.",
      watchout:
        "A preferred coping motive can crowd out another legitimate need.",
      scenarioOne:
        "When receiving criticism, notice whether you defend standards, connection or competence.",
      scenarioTwo:
        "When choosing a project, distinguish what interests you from what earns approval.",
      question: "What am I protecting when my reaction feels urgent?",
      experiment:
        "Record one recurring reaction twice, naming the need before responding. Try asking directly for that need once.",
    },
    zh: {
      context: "动机可能重叠，熟悉的自我故事需要用经历检验。",
      watchout: "惯常应对动机可能挤压另一种合理需求。",
      scenarioOne: "收到批评时，观察自己维护的是标准、连接还是能力感。",
      scenarioTwo: "选择项目时，区分兴趣和认可。",
      question: "反应急切时，我在保护什么？",
      experiment: "记录两次重复反应，回应前写下需求，并试着直接表达一次。",
    },
  },
  strengths: {
    en: {
      context:
        "A strength is useful when the task actually needs it and you can sustain the effort.",
      watchout:
        "Being good at something does not make it your permanent responsibility.",
      scenarioOne:
        "In group work, choose a contribution you can explain rather than taking every loose task.",
      scenarioTwo:
        "In a difficult task, ask which complementary contribution someone else could supply.",
      question:
        "Which strength leaves me satisfied, and which merely earns requests?",
      experiment:
        "Volunteer for one bounded contribution with a finish line; ask a collaborator what changed because of it.",
    },
    zh: {
      context: "优势在任务需要且投入可持续时才有用。",
      watchout: "擅长某件事不等于永远由你负责。",
      scenarioOne: "合作时选择能说明价值的贡献，避免接下所有杂事。",
      scenarioTwo: "遇到难题时，询问谁能提供互补贡献。",
      question: "哪种优势让我满足，哪种只带来更多请求？",
      experiment:
        "主动承担一项边界清晰的贡献，完成后询问合作者具体改变了什么。",
    },
  },
  "emotional-intelligence": {
    en: {
      context:
        "Understanding feelings requires checking interpretations with the people involved.",
      watchout:
        "Naming an emotion does not authorize deciding what another person needs.",
      scenarioOne:
        "During disagreement, describe what you noticed and ask whether your reading fits.",
      scenarioTwo:
        "After a frustrating delay, distinguish feelings from the action you choose.",
      question:
        "When did I last check an emotional guess rather than treating it as fact?",
      experiment:
        "In two conversations, pause to name your feeling privately, then ask one open question before offering advice.",
    },
    zh: {
      context: "理解情绪需要向当事人核实解读。",
      watchout: "能说出情绪不代表可以替别人决定需求。",
      scenarioOne: "分歧时描述观察，并询问理解是否贴切。",
      scenarioTwo: "等待受挫后，区分感受和选择的行动。",
      question: "上次核实情绪猜测而非当成事实是什么时候？",
      experiment:
        "在两次对话中先私下辨认自己的感受，再问一个开放问题，之后才给建议。",
    },
  },
  "six-factor": {
    en: {
      context:
        "These six perspectives describe tradeoffs in conduct, relationships and exploration.",
      watchout:
        "No trait score can certify someone’s integrity or predict a specific choice.",
      scenarioOne:
        "When dividing shared resources, check whether your rule would feel fair from every seat.",
      scenarioTwo:
        "When meeting an unfamiliar idea, compare curiosity with the practical cost of exploring it.",
      question:
        "Which value stays visible when acting on it costs convenience?",
      experiment:
        "Choose one small shared decision, write the fairness rule before choosing, and ask a participant whether the rule was clear.",
    },
    zh: {
      context: "六个视角呈现行为、关系与探索中的取舍。",
      watchout: "分数无法证明品格，也不能预言具体选择。",
      scenarioOne: "分配共同资源时，从每个参与者的位置检查规则。",
      scenarioTwo: "面对陌生想法时，对照好奇心和探索成本。",
      question: "哪种价值在牺牲方便时仍看得见？",
      experiment:
        "选一个共同决定，先写公平规则再选择，并请参与者反馈规则是否清楚。",
    },
  },
  "love-expression": {
    en: {
      context:
        "Expressions of care work through the recipient’s meaning, not just the giver’s intention.",
      watchout:
        "A preferred expression is an invitation, not a debt others must repay.",
      scenarioOne:
        "Before buying a gift, ask what would feel useful or thoughtful this week.",
      scenarioTwo:
        "After a tiring day, check whether listening, help or company would land best.",
      question:
        "How does someone close to me describe care in their own words?",
      experiment:
        "Ask a willing person for one small preferred gesture, offer it once, and compare intention with their actual experience.",
    },
    zh: {
      context: "关心是否被接收，取决于对方的理解。",
      watchout: "偏好的表达是邀请，不是要求回报的债务。",
      scenarioOne: "买礼物前，询问这周什么最有用或贴心。",
      scenarioTwo: "疲惫的一天后，确认对方需要倾听、帮助还是陪伴。",
      question: "亲近的人会如何用自己的话描述关心？",
      experiment:
        "请一位愿意参与的人提出一个小小的关心方式，做一次并核对实际感受。",
    },
  },
  "romantic-style": {
    en: {
      context:
        "Romantic preferences concern pace and meaning, and need agreement between people.",
      watchout:
        "Intensity and compatibility can feel similar at first but ask different questions over time.",
      scenarioOne:
        "Before making plans together, compare expectations about pace and commitment.",
      scenarioTwo:
        "During a quiet week, notice whether ordinary reliability feels connecting or disappointing.",
      question:
        "Which expectation have I assumed we share without discussing it?",
      experiment:
        "Choose one expectation about time together; discuss it plainly and try a reversible arrangement for a week.",
    },
    zh: {
      context: "浪漫偏好涉及节奏和意义，需要双方协商。",
      watchout: "强烈感受和相处契合在初期可能相似，长期需要不同检验。",
      scenarioOne: "一起计划前，比较对关系节奏和承诺的期待。",
      scenarioTwo: "平淡的一周中，观察日常可靠让你连接还是失落。",
      question: "哪种期待是我默认双方相同却未讨论的？",
      experiment: "选一个相处时间的期待，坦诚讨论并试行一周可调整的安排。",
    },
  },
  conflict: {
    en: {
      context:
        "Conflict responses solve different problems: urgency, voice, connection and durable agreement.",
      watchout:
        "A calm ending can hide an unresolved issue, while directness can exceed another person’s capacity.",
      scenarioOne:
        "In a scheduling dispute, separate the practical constraint from the feeling of being ignored.",
      scenarioTwo:
        "In a heated conversation, agree a return time if either person needs a pause.",
      question: "Did the last resolution give both people a usable next step?",
      experiment:
        "Choose a manageable disagreement, state the shared problem, hear both constraints and write one agreement to review after two days.",
    },
    zh: {
      context: "冲突方式分别处理紧急性、表达、连接与持久约定。",
      watchout: "平静收场可能隐藏问题，直率也可能超出对方承受范围。",
      scenarioOne: "时间安排争执中，区分实际限制与被忽略的感受。",
      scenarioTwo: "对话激烈时，若需暂停就约定回来继续的时间。",
      question: "上次解决是否让双方都有可执行的下一步？",
      experiment:
        "选一个小分歧，说明共同问题，听取双方限制，写下一条约定并两天后回看。",
    },
  },
  boundaries: {
    en: {
      context:
        "Boundaries describe what you can offer and what you will do when a limit is reached.",
      watchout:
        "An unspoken limit is difficult to respect; a boundary should not dictate another person’s feelings.",
      scenarioOne:
        "When asked for extra work, name the time available and what would need to move.",
      scenarioTwo:
        "When a private topic comes up, redirect it without needing to justify your whole history.",
      question:
        "Which yes would I change if I did not fear disappointing someone?",
      experiment:
        "Practice one small limit with an alternative, such as a shorter call. Observe whether your time and the relationship both remained workable.",
    },
    zh: {
      context: "边界说明你能提供什么，以及到达限度时如何行动。",
      watchout: "未说出的界限难以被尊重；边界不应规定别人的感受。",
      scenarioOne: "被要求加工作时，说明可用时间和必须顺延的任务。",
      scenarioTwo: "私人话题出现时，可以转移话题而不必解释全部经历。",
      question: "若不担心让人失望，我会改变哪一次答应？",
      experiment:
        "练习一个带替代方案的小界限，例如缩短通话，观察时间与关系是否都可持续。",
    },
  },
  communication: {
    en: {
      context:
        "Communication succeeds when the listener can understand and respond, not simply when you have spoken.",
      watchout:
        "Detail can overwhelm, brevity can omit context, and questions can feel like interrogation without explanation.",
      scenarioOne:
        "In a handoff, put the decision needed before supporting detail.",
      scenarioTwo:
        "In a sensitive conversation, check what the other person heard before adding examples.",
      question:
        "Which misunderstanding keeps recurring across different people?",
      experiment:
        "Rewrite one real message with a purpose, essential context and clear request. Ask the recipient what they understood before comparing versions.",
    },
    zh: {
      context: "沟通需要让对方理解并能回应。",
      watchout: "细节会压倒重点，简短会遗漏背景，提问也需要说明用意。",
      scenarioOne: "交接时先说需要的决定，再补充细节。",
      scenarioTwo: "敏感对话中，补例子前先确认对方听到了什么。",
      question: "哪种误解会在不同人之间重复？",
      experiment:
        "重写一条真实消息，包含目的、必要背景和明确请求，请接收者说出理解后再比较。",
    },
  },
  "psychological-age": {
    en: {
      context:
        "These playful age metaphors describe attitudes toward novelty, duty and play, not actual maturity.",
      watchout:
        "A youthful or seasoned metaphor should never become an excuse to dismiss a real need.",
      scenarioOne: "In a routine chore, notice whether play helps you engage.",
      scenarioTwo:
        "In a new activity, compare the appeal of spontaneity with the comfort of preparation.",
      question: "Where do I want more play, and where more steadiness?",
      experiment:
        "Choose one routine task, add a small playful element, and retain its practical finish line; compare willingness to start.",
    },
    zh: {
      context: "年龄隐喻只描述新鲜感、责任和玩心，不测量成熟度。",
      watchout: "年轻或老练的比喻不能成为忽视真实需求的借口。",
      scenarioOne: "日常杂务中，观察玩心能否帮助投入。",
      scenarioTwo: "新活动中，对照即兴乐趣和准备带来的安心。",
      question: "哪里想多一点玩心，哪里想多一点稳定？",
      experiment: "选一项日常任务，加入小小趣味并保留完成标准，比较启动意愿。",
    },
  },
  animal: {
    en: {
      context:
        "An animal metaphor is a playful lens on how you use space, company and attention.",
      watchout:
        "A memorable mascot can hide how much your behavior changes with safety and fatigue.",
      scenarioOne:
        "At a gathering, notice whether observing first makes joining easier.",
      scenarioTwo:
        "In a solo afternoon, compare exploration with staying in a familiar spot.",
      question: "Which part of the animal story fits today but not last month?",
      experiment:
        "Try one small behavior associated with a different metaphor in a safe setting, then note what felt useful or artificial.",
    },
    zh: {
      context: "动物隐喻帮助玩味空间、陪伴和注意力偏好。",
      watchout: "鲜明形象可能遮住安全感与疲劳带来的变化。",
      scenarioOne: "聚会中，观察先旁观是否更容易加入。",
      scenarioTwo: "独处下午，对照探索和留在熟悉地方的感受。",
      question: "动物故事哪部分今天贴切，上个月却不适用？",
      experiment: "在安全场景试一个不同隐喻的小行为，记下有用和别扭之处。",
    },
  },
  villain: {
    en: {
      context:
        "Fictional villain styles turn motives such as control or recognition into storytelling prompts.",
      watchout:
        "A dramatic character is not evidence of cruelty or permission to manipulate real people.",
      scenarioOne:
        "In a fictional team dispute, imagine what your character fears losing.",
      scenarioTwo:
        "In a game with friends, distinguish enjoyable theatrics from behavior everyone agreed to.",
      question:
        "What would let this character pursue the same need without harming someone?",
      experiment:
        "Write a short fictional scene twice: once with the familiar strategy and once with an honest request. Compare the endings, keeping real people out of the role assignment.",
    },
    zh: {
      context: "虚构反派风格把控制或认可等动机变成故事提示。",
      watchout: "戏剧角色不能证明残酷，也不是操纵现实他人的许可。",
      scenarioOne: "虚构团队争执中，想象角色害怕失去什么。",
      scenarioTwo: "朋友游戏里，区分戏剧效果与大家同意的玩法。",
      question: "角色怎样不伤害别人也能追求同样需求？",
      experiment:
        "把一个虚构短场景写两遍，分别使用熟悉策略和坦诚请求，比较结局，不给现实人物贴角色标签。",
    },
  },
  survival: {
    en: {
      context:
        "Imagined survival choices reveal story preferences rather than emergency readiness.",
      watchout:
        "A compelling strategy in a quiz has not been tested against real hazards or limited information.",
      scenarioOne:
        "In a fictional supply shortage, compare solo speed with group coordination.",
      scenarioTwo:
        "In an ordinary travel delay, notice whether you seek information, company or a backup plan first.",
      question: "Which resource would my imagined strategy depend on most?",
      experiment:
        "Use a harmless planning game, such as a rainy picnic: list constraints, assign roles and choose a backup. Compare assumptions afterward; do not stage an emergency.",
    },
    zh: {
      context: "生存情景只呈现故事偏好，不代表应急能力。",
      watchout: "问答里有吸引力的策略没有经过真实危险检验。",
      scenarioOne: "虚构物资短缺中，对照单独行动速度与团队协调。",
      scenarioTwo: "普通旅行延误中，观察先找信息、同伴还是备选方案。",
      question: "想象中的策略最依赖什么资源？",
      experiment:
        "用下雨野餐等无风险规划练习，列限制、分角色、选备选，事后对照假设，不制造应急事件。",
    },
  },
  "online-persona": {
    en: {
      context:
        "An online persona is shaped by audience, platform and what you choose to keep private.",
      watchout:
        "Visibility and connection are different outcomes; engagement counts cannot tell you whether sharing felt worthwhile.",
      scenarioOne:
        "Before posting a personal update, choose who should actually see it.",
      scenarioTwo:
        "In a lively thread, notice whether contributing serves connection, performance or curiosity.",
      question: "Which post would I still value if its metrics were hidden?",
      experiment:
        "Draft one post for a specific audience, pause before publishing, and choose whether private sharing meets the goal better. Review satisfaction without checking metrics.",
    },
    zh: {
      context: "网络形象受受众、平台和隐私选择影响。",
      watchout: "曝光和连接是不同结果，互动数字无法说明分享是否值得。",
      scenarioOne: "发个人近况前，选择真正希望看到的人。",
      scenarioTwo: "热闹讨论中，观察发言为了连接、展示还是好奇。",
      question: "隐藏数据后，我仍会珍惜哪条内容？",
      experiment:
        "为明确受众起草一条内容，发布前暂停，考虑私下分享是否更合适，并在不看数据时回顾满意度。",
    },
  },
  "social-energy": {
    en: {
      context:
        "Social energy depends on company, activity and recovery time as well as preference.",
      watchout:
        "Enjoying people does not remove the need for rest, and solitude does not mean disconnection.",
      scenarioOne:
        "Before accepting back-to-back invitations, account for travel and recovery.",
      scenarioTwo:
        "After a meaningful one-to-one conversation, compare energy with a large gathering.",
      question:
        "Which social setting leaves me tired but glad, rather than depleted and resentful?",
      experiment:
        "Choose one invitation intentionally, add a clear ending and a recovery window, and note energy before, immediately after and next morning.",
    },
    zh: {
      context: "社交精力受同伴、活动和恢复时间影响。",
      watchout: "喜欢相处也需要休息，独处也不等于失去连接。",
      scenarioOne: "接受连续邀请前，算入路程与恢复。",
      scenarioTwo: "深入一对一交流后，对照大型聚会的精力变化。",
      question: "哪种场景让我虽累却满足，而非耗尽又怨怼？",
      experiment:
        "有意识地选一次邀请，设结束时间和恢复空档，记录之前、刚结束和次日的精力。",
    },
  },
  consumption: {
    en: {
      context:
        "Spending preferences express convenience, pleasure and priorities within real constraints.",
      watchout:
        "A purchase can solve a practical problem while still being a poor fit for your available budget.",
      scenarioOne:
        "Before a discretionary purchase, name the job you expect it to do.",
      scenarioTwo:
        "When a limited offer appears, compare the offer with your plans before seeing the discount.",
      question:
        "Would I still want this if nobody saw it and the promotion ended?",
      experiment:
        "Track one discretionary purchase or deliberate nonpurchase: write the expected benefit first, wait a day if feasible, then compare usefulness a few days later.",
    },
    zh: {
      context: "消费偏好表达便利、愉悦和现实限制中的优先级。",
      watchout: "商品能解决问题，也可能不适合现有预算。",
      scenarioOne: "可选消费前，写出希望它解决什么。",
      scenarioTwo: "限时优惠出现时，先对照原计划再看折扣。",
      question: "若没人看见且优惠结束，我仍想要吗？",
      experiment:
        "追踪一次可选购买或主动不买，先写预期用途，条件允许则等一天，几天后对照实际帮助。",
    },
  },
  "career-interest": {
    en: {
      context:
        "Interest points toward activities worth sampling, not a job you must choose.",
      watchout:
        "Enjoying an imagined occupation can differ from enjoying its ordinary tasks and constraints.",
      scenarioOne:
        "When reading a job description, underline actual weekly activities rather than the title.",
      scenarioTwo:
        "In a volunteer project, notice which tasks you seek out without prompting.",
      question:
        "Which appealing career includes daily work I have never actually tried?",
      experiment:
        "Choose a free, small sample task from an interesting field; spend thirty minutes on it and ask a practitioner what routine work the sample leaves out.",
    },
    zh: {
      context: "兴趣指向值得试做的活动，不指定必须选择的职业。",
      watchout: "喜欢职业想象与喜欢日常任务可能不同。",
      scenarioOne: "看岗位说明时，标出每周实际活动而非头衔。",
      scenarioTwo: "志愿项目中，观察自己主动靠近什么任务。",
      question: "哪个吸引我的职业包含从未尝试的日常工作？",
      experiment:
        "选兴趣领域里一个免费小任务，做三十分钟，并询问从业者这个样本遗漏哪些日常事务。",
    },
  },
  "work-style": {
    en: {
      context:
        "A work style becomes useful when collaborators know how to coordinate with it.",
      watchout:
        "A personally productive routine can create bottlenecks if others cannot see progress or dependencies.",
      scenarioOne:
        "At project kickoff, clarify which decisions need discussion and which can proceed independently.",
      scenarioTwo:
        "Before deep work, agree when colleagues can expect a response.",
      question:
        "Which friction is a preference mismatch and which is a missing agreement?",
      experiment:
        "For one task, agree a deliverable, update time and escalation rule with a collaborator. Review interruption cost and handoff clarity after completion.",
    },
    zh: {
      context: "工作风格在合作者知道如何配合时才发挥作用。",
      watchout: "个人高效的习惯，若进度和依赖不可见，也会形成堵点。",
      scenarioOne: "项目启动时，确认哪些决定需讨论，哪些可独立推进。",
      scenarioTwo: "专注前，约定同事何时能收到回复。",
      question: "摩擦来自偏好差异，还是缺少约定？",
      experiment:
        "为一个任务与合作者约定交付、更新时间和求助规则，完成后回顾打断成本与交接清晰度。",
    },
  },
  values: {
    en: {
      context:
        "Values become visible through tradeoffs between things you genuinely care about.",
      watchout:
        "A high stated priority can be aspirational when time, money or obligations make it hard to enact.",
      scenarioOne:
        "When two worthwhile invitations conflict, identify what each protects.",
      scenarioTwo:
        "When reviewing your calendar, compare actual time with the priorities you named.",
      question: "Which compromise feels chosen, and which feels inherited?",
      experiment:
        "Choose one small calendar change that expresses a priority without neglecting an obligation. Record the cost and whether it felt worth making.",
    },
    zh: {
      context: "价值在真正重视的事物之间取舍时更清楚。",
      watchout: "时间、金钱和责任可能让高优先级暂时停留在愿望。",
      scenarioOne: "两个有意义的邀请冲突时，辨认各自保护什么。",
      scenarioTwo: "回看日程时，对照实际时间与口头优先级。",
      question: "哪种妥协是主动选择，哪种来自惯性？",
      experiment:
        "调整一小块日程表达优先级，同时顾及已有责任，记下代价和是否值得。",
    },
  },
  learning: {
    en: {
      context:
        "Study preferences are starting points for choosing practice, not fixed learning types or ability measures.",
      watchout:
        "A comfortable format may feel fluent while leaving recall or application untested.",
      scenarioOne:
        "After reading an explanation, try using the idea with the page closed.",
      scenarioTwo:
        "When learning a practical task, compare watching a demonstration with attempting a small example.",
      question: "What can I now do independently that I could not do before?",
      experiment:
        "Pick one concept, use your preferred approach for fifteen minutes, then solve an unfamiliar example without notes. Adjust the next session based on the specific gap.",
    },
    zh: {
      context: "学习偏好只是选择练习的起点，不是固定类型或能力测量。",
      watchout: "舒服的形式可能很流畅，却未检验回忆与应用。",
      scenarioOne: "读完解释后，合上页面试着使用概念。",
      scenarioTwo: "学习实际任务时，对照看演示和动手试小例子。",
      question: "现在我能独立完成哪件以前不会的事？",
      experiment:
        "选一个概念，用偏好方式学十五分钟，再不看笔记做陌生例子，根据具体缺口调整下次练习。",
    },
  },
  procrastination: {
    en: {
      context:
        "Delay can reflect unclear tasks, competing needs, unpleasant feelings or real limits.",
      watchout:
        "Calling every delay a discipline failure can hide a task that needs renegotiation.",
      scenarioOne:
        "Before an avoided email, name the uncomfortable decision inside it.",
      scenarioTwo:
        "When a large task stalls, distinguish not knowing the next step from lacking the time to do it.",
      question:
        "What would need to change for starting to become reasonable today?",
      experiment:
        "Choose one delayed task, identify its obstacle and try a five-minute first step. If blocked, ask for missing information or renegotiate scope; record what actually unlocked progress.",
    },
    zh: {
      context: "拖延可能来自任务不清、需求冲突、不适感或实际限制。",
      watchout: "把所有延迟归咎自律，会隐藏需要重新协商的任务。",
      scenarioOne: "写回避的邮件前，辨认其中令人不适的决定。",
      scenarioTwo: "大任务停滞时，区分不知道下一步与没有时间。",
      question: "改变什么，今天开始才合理？",
      experiment:
        "选一个拖延任务，辨认障碍并试五分钟第一步；若受阻，索取信息或协商范围，记录真正推动进展的条件。",
    },
  },
  decision: {
    en: {
      context:
        "Decision habits balance information, reversibility, time and personal priorities.",
      watchout:
        "More analysis can help an irreversible choice but waste time on an easily reversible one.",
      scenarioOne:
        "For a small purchase, set a search limit before comparing options.",
      scenarioTwo:
        "For a shared commitment, check whose preferences and constraints are missing.",
      question: "Which uncertainty matters enough to change the choice?",
      experiment:
        "Choose a low-stakes reversible decision, write two criteria and a time limit, decide, then review the outcome once rather than reopening it repeatedly.",
    },
    zh: {
      context: "决策习惯平衡信息、可逆性、时间和优先级。",
      watchout:
        "更多分析有助于难以逆转的选择，却可能耗费在可轻易调整的小事上。",
      scenarioOne: "小额购买前，先定信息搜索上限。",
      scenarioTwo: "共同承诺前，检查遗漏了谁的偏好和限制。",
      question: "哪个不确定因素足以改变选择？",
      experiment:
        "选一个低风险可逆决定，写两条标准和时限，决定后集中复盘一次，避免反复重开。",
    },
  },
};
