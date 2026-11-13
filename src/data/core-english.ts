const bigQuestions = {
  E: [
    "I am the life of the party.",
    "I feel comfortable around people.",
    "I start conversations.",
    "I talk to a lot of different people at parties.",
    "I do not mind being the center of attention.",
    "I do not talk a lot.",
    "I keep in the background.",
    "I have little to say.",
    "I do not like drawing attention to myself.",
    "I am quiet around strangers.",
  ],
  A: [
    "I am interested in people.",
    "I sympathize with others’ feelings.",
    "I have a soft heart.",
    "I take time out for others.",
    "I feel others’ emotions.",
    "I make people feel at ease.",
    "I am not really interested in others.",
    "I insult people.",
    "I am not interested in other people’s problems.",
    "I feel little concern for others.",
  ],
  C: [
    "I am always prepared.",
    "I pay attention to details.",
    "I get chores done right away.",
    "I like order.",
    "I follow a schedule.",
    "I am exacting in my work.",
    "I leave my belongings around.",
    "I make a mess of things.",
    "I often forget to put things back in their proper place.",
    "I shirk my duties.",
  ],
  S: [
    "I am relaxed most of the time.",
    "I seldom feel blue.",
    "I get stressed out easily.",
    "I worry about things.",
    "I am easily disturbed.",
    "I get upset easily.",
    "I change my mood a lot.",
    "I have frequent mood swings.",
    "I get irritated easily.",
    "I often feel blue.",
  ],
  O: [
    "I have a rich vocabulary.",
    "I have a vivid imagination.",
    "I have excellent ideas.",
    "I am quick to understand things.",
    "I use difficult words.",
    "I spend time reflecting on things.",
    "I am full of ideas.",
    "I have difficulty understanding abstract ideas.",
    "I am not interested in abstract ideas.",
    "I do not have a good imagination.",
  ],
};
const interleave = (groups) =>
  Array.from(
    { length: Math.max(...Object.values(groups).map((g: any) => g.length)) },
    (_, i) => Object.values(groups).flatMap((g: any) => (g[i] ? [g[i]] : [])),
  ).flat();
const dimension = (name, low, high, action) => ({ name, low, high, action });
export const coreEnglish = {
  "big-five": {
    name: "Big Five Personality",
    category: "Personality",
    kind: "Research informed",
    tagline: "Unfold your personality across five dimensions.",
    description:
      "Explore everyday tendencies, from extraversion to imagination. Personality is a continuous spectrum with room for more than one label.",
    basis:
      "Uses all 50 IPIP Big-Five Factor Markers, with 10 items per factor and the original scoring directions. The project’s Chinese translation has not been independently validated.",
    instruction:
      "Answer about your usual self rather than your ideal self. There are no right answers and nothing to prove.",
    source: {
      label: "Original IPIP items and scoring key",
      rights:
        "IPIP items and scales are public domain. Chinese translation by Test Atlas.",
    },
    dimensions: [
      dimension(
        "Extraversion",
        "You tend to prefer quiet, independent activities and smaller conversations.",
        "You often find energy in expression, interaction and group participation.",
        "Plan a comfortable conversation and some time alone. Notice how each feels.",
      ),
      dimension(
        "Agreeableness",
        "Your answers endorse interpersonal concern, understanding and helping less; they do not establish your communication style or independence of judgment.",
        "You often notice others’ feelings and value understanding, helping and cooperation.",
        "Before responding to a request, check your time and willingness, then say what help you can offer.",
      ),
      dimension(
        "Conscientiousness",
        "Your answers endorse preparation, order and follow-through less. Context, resources and habits merit consideration; these answers do not establish which schedule suits you.",
        "Preparation, order and follow-through often help you feel settled.",
        "Choose a small task and define one step you can complete today.",
      ),
      dimension(
        "Emotional stability",
        "Your answers suggest you readily notice stress and emotional changes. This is not a mental health diagnosis.",
        "Your answers endorse steadiness more and distress or mood changes less. These items do not measure recovery speed after stress.",
        "Write down a recent stressful situation, your feelings and available support.",
      ),
      dimension(
        "Intellect / Imagination",
        "You tend to prefer concrete, familiar and directly useful information and activities.",
        "You often enjoy imagination, reflection, abstract ideas and exploring new concepts.",
        "Spend fifteen minutes trying an unfamiliar form of expression without expecting immediate skill.",
      ),
    ],
    questions: interleave(bigQuestions),
  },
  attachment: {
    name: "Attachment Tendencies",
    category: "Relationships",
    kind: "Original exploration",
    tagline: "What helps you feel safe when you get close?",
    description:
      "Notice how you experience responses, space and support in a close relationship. Understanding your needs can open a conversation.",
    basis:
      "Original scenarios organized around anxiety and avoidance dimensions from attachment research. This is not the ECR or ECR-RS scale and uses no clinical or authoritative type thresholds.",
    instruction:
      "Keep the same close adult in mind, such as a partner or close friend. Answer about recent interactions. Results describe your feelings about this particular relationship.",
    source: {
      label:
        "Background on attachment dimensions (not the source of these items)",
      rights:
        "These 12 original Test Atlas items have not undergone standardized scale validation.",
    },
    dimensions: [
      dimension(
        "Response sensitivity",
        "You are less likely to worry about the relationship because of reply times or small changes.",
        "You tend to notice responses and may need clearer reassurance.",
        "Replace “Don’t you care about me?” with a specific request, such as asking when they will be free to talk.",
      ),
      dimension(
        "Need for distance",
        "You are more willing to share feelings and seek support.",
        "You value independent space; sharing vulnerability or relying on others may feel uncomfortable.",
        "Choose a small issue, explain the help you need and agree on space for each of you.",
      ),
    ],
    questions: interleave({
      anxiety: [
        "When replies are later than usual, I repeatedly wonder whether something is wrong in the relationship.",
        "Even without clear conflict, I worry I am not valued enough.",
        "I need repeated reassurance to believe the other person still cares.",
        "When the other person wants time alone, I tend to see it as rejection.",
        "When we explain the situation, I can usually wait calmly for a reply.",
        "After an unpleasant interaction, I can still trust the foundation of our relationship.",
      ],
      avoidance: [
        "When things are difficult, I prefer to handle them alone without telling the other person.",
        "When a conversation touches on my vulnerability, I want to change the subject.",
        "When the other person wants more closeness, I often feel pressure first.",
        "I worry that accepting help will cost me my independence.",
        "I can explain my real needs to the other person.",
        "I can enjoy closeness while keeping space for each of us.",
      ],
    }),
  },
  "dark-triad": {
    name: "The Shadow Side",
    category: "Personality",
    kind: "Original exploration",
    tagline: "Notice the sides we rarely talk about.",
    description:
      "How do you make choices around advantage, attention and impulse? Observe with curiosity and give yourself room to reflect.",
    basis:
      "Original items about strategic behavior, self-focus and impulsivity / detachment. This is not SD3, Dirty Dozen or a diagnostic tool. Scores reflect self-reports on these items only.",
    instruction:
      "Answer about actual behavior. Some thoughts may be hard to admit; answers stay on this device. Do not use these results to label yourself or others as dangerous.",
    source: {
      label: "Original research on the dark triad concept",
      rights:
        "These 18 items and reports are original Test Atlas content. Items from the cited paper are not reproduced.",
    },
    dimensions: [
      dimension(
        "Strategic behavior",
        "You less often endorse hiding intentions or using information advantages in these situations.",
        "Your answers more often endorse strategy and control. Notice their effects on trust.",
        "In your next negotiation, share your core needs and reduce information gaps.",
      ),
      dimension(
        "Self-focus",
        "You less often rely on attention and recognition to confirm your worth in these situations.",
        "You place more importance on being valued, recognized or having a distinctive position.",
        "After hearing someone’s story, ask about a detail before sharing your own.",
      ),
      dimension(
        "Impulsivity / detachment",
        "You more often consider consequences and other people’s feelings in these situations.",
        "Your answers more often endorse immediate action or distance from others’ feelings.",
        "Pause ten minutes before an important decision. Write down its effects on you and another person.",
      ),
    ],
    questions: interleave({
      strategy: [
        "To get what I want, I sometimes deliberately conceal my real purpose.",
        "In competition, I think having information others lack matters more than being open.",
        "If I would not be caught, I would consider exploiting a loophole.",
        "I judge what someone can offer me before deciding how much to invest in the relationship.",
        "I am willing to explain important conditions, even if I lose an advantage.",
        "I do not want to trade someone’s trust for a short-term benefit.",
      ],
      attention: [
        "I feel especially upset when my effort goes unnoticed.",
        "In groups, I want my opinions to receive more attention.",
        "I easily feel that I deserve special treatment.",
        "When others are praised, I rush to show that I am good too.",
        "I can enjoy time together without being the focus.",
        "I can accept that others may not recognize my contribution for a while.",
      ],
      impulse: [
        "For immediate excitement, I act before considering the effects on others.",
        "In conflict, I sometimes do not care whether my words hurt someone.",
        "Even after making a commitment, I may change plans on impulse.",
        "When my choices affect others, I tend to think it is mainly their problem.",
        "When I hurt someone, I am willing to take responsibility for repairing the harm.",
        "I would give up a tempting opportunity if it might hurt someone.",
      ],
    }),
  },
};
