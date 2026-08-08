export type Lane = "mine" | "adjacent";
export type SignalAction = "REPLY" | "CONTENT" | "CONTACT";

export interface Signal {
  id: string;
  lane: Lane;
  action: SignalAction;
  score: number;
  author: string;
  source: string;
  age: string;
  text: string;
  angle: string;
  pillar: string;
  caveat?: string;
  url?: string;
  whyRelevant?: string | null;
}

export interface Draft {
  id: string;
  channel: "linkedin" | "x";
  format: "text" | "carousel" | "photo" | "thread";
  pillar: string;
  topic: string;
  rationale: string;
  engagementHook: string;
  hooks: string[];
  body: string;
  voiceCheck: { passed: boolean; note: string };
}

export const signals: Signal[] = [
  {
    id: "s1",
    lane: "mine",
    action: "REPLY",
    score: 4.6,
    author: "@signulll",
    source: "X",
    age: "2h ago",
    text: "Most marketing teams are one good operator with AI away from being half the size. Nobody wants to say it out loud.",
    angle:
      "Half the size, yes. But the half that stays is the half that learned to build.",
    pillar: "AI-powered marketing ops",
  },
  {
    id: "s2",
    lane: "adjacent",
    action: "CONTENT",
    score: 4.1,
    author: "TechCrunch",
    source: "news",
    age: "4h ago",
    text: "New report: 70% of CMOs say they cannot evaluate AI tools before buying them.",
    angle:
      "Carousel: the evaluation setup nobody teaches. You do not need more tools, you need a better setup.",
    pillar: "AI-powered marketing ops",
    caveat: "Stay at pattern level, do not pick a vendor side.",
  },
  {
    id: "s3",
    lane: "mine",
    action: "CONTACT",
    score: 3.8,
    author: "@gtm_builder",
    source: "X",
    age: "6h ago",
    text: "Looking for examples of marketers who actually ship internal tooling, not just talk about AI.",
    angle:
      "I built a small analytics tool myself this year. Happy to swap notes on what worked and what absolutely did not.",
    pillar: "Behind the scenes",
  },
];

export const drafts: Draft[] = [
  {
    id: "d1",
    channel: "linkedin",
    format: "text",
    pillar: "AI-powered marketing ops",
    topic: "Building a tool instead of buying one",
    rationale:
      "Build-vs-buy is in your lane and CMO budget season is live on LinkedIn this week.",
    engagementHook: "Ends on an open question to pull budget-owners into the comments.",
    hooks: [
      "The best marketing tool I use this year is one I built myself.",
      "I stopped paying for a tool I realised I could build in a weekend.",
      "Build-vs-buy gets interesting once you can code a little.",
    ],
    body: "I needed media monitoring this year. The off-the-shelf options cost more than I wanted to spend, and none of them answered the exact question I had.\n\nSo I built a small version myself: a scraper, a simple ranking step, a model to summarise. It does one job, the one I actually needed.\n\nI believe tooling can do a lot for a marketing team. But it cannot decide what is worth measuring; that part stayed with me.\n\nWhich makes me wonder how many line items in a marketing budget are really just unasked questions.",
    voiceCheck: {
      passed: true,
      note: "Signature move present, widening close, no banned phrases",
    },
  },
  {
    id: "d3",
    channel: "linkedin",
    format: "carousel",
    pillar: "AI-powered marketing ops",
    topic: "The tool-evaluation setup nobody teaches",
    rationale:
      "Rides the TechCrunch CMO report (signal in your feed) while it is fresh. Carousels are mid-test (bet #1).",
    engagementHook: "Slide 6 asks readers to share their own evaluation checklist.",
    hooks: [
      "70% of CMOs can't evaluate an AI tool before buying it. Here's the setup that fixes that.",
      "You don't need more tools. You need a better way to judge them.",
    ],
    body: "Six slides: the question before the demo, the fifty-dollar test, the one metric that matters, the walk-away rule, the setup I actually use, your turn.\n\nGrounded in the better-setup take, no vendor named.",
    voiceCheck: {
      passed: true,
      note: "Stays at pattern level, no vendor side taken",
    },
  },
  {
    id: "d2",
    channel: "x",
    format: "photo",
    pillar: "Personal lane",
    topic: "Legos and shipping software",
    rationale:
      "Personal-lane slot for the week (1/week cadence). Warm, self-deprecating register.",
    engagementHook: "Photo + relatable analogy invites quote-tweets from other builders.",
    hooks: [
      "My Lego order arrived before my programming course homework was done. Priorities.",
      "Started collecting Legos this year. It is suspiciously similar to building software.",
    ],
    body: "Started collecting Legos this year. Same joy as shipping a small tool: a hundred pieces, one picture in your head, and the quiet satisfaction when the last brick clicks.\n\nPhoto: the half-built set next to the laptop.",
    voiceCheck: {
      passed: false,
      note: "Voice unverified: calibration set is still empty",
    },
  },
  {
    id: "d4",
    channel: "x",
    format: "text",
    pillar: "AI-powered marketing ops",
    topic: "Reply to @signulll on lean teams",
    rationale:
      "@signulll is a Priority account (4.6 signal). Quote-reply window is open now, in-lane.",
    engagementHook: "Quote-tweet keeps your take attached to a high-reach post.",
    hooks: [
      "Half the size, yes. But the half that stays is the half that learned to build.",
    ],
    body: "Half the size, yes. But the half that stays is the half that learned to build. The operator who can wire two tools together does the work three coordinators used to schedule.",
    voiceCheck: {
      passed: true,
      note: "In your voice, no banned phrases",
    },
  },
];

export interface Contact {
  id: string;
  name: string;
  handle: string;
  title: string;
  channel: "linkedin" | "x";
  why: string;
  pillar: string;
  opener: string;
  status: "DRAFTED" | "APPROVED" | "SENT" | "REPLIED";
}

export const contacts: Contact[] = [
  {
    id: "c1",
    name: "Maya Chen",
    handle: "@gtm_builder",
    title: "Head of Growth, DeFi infra",
    channel: "x",
    why: "Asked for examples of marketers who ship internal tooling (signal s3)",
    pillar: "Behind the scenes",
    opener:
      "Saw your question about marketers who actually ship. I built a small analytics tool myself this year; happy to swap notes on what worked and what absolutely did not.",
    status: "DRAFTED",
  },
  {
    id: "c2",
    name: "Tomás Rivera",
    handle: "tomas-rivera-gtm",
    title: "CMO, B2B SaaS",
    channel: "linkedin",
    why: "Posted about cutting martech spend; matches the better-setup take",
    pillar: "AI-powered marketing ops",
    opener:
      "Your martech-spend post said out loud what most CMOs only admit in DMs. I went the build route this year and the numbers surprised me; would be glad to compare notes.",
    status: "DRAFTED",
  },
  {
    id: "c3",
    name: "Lena Kovač",
    handle: "@lenak_web3",
    title: "Founder, Web3 community studio",
    channel: "x",
    why: "Replied warmly to your mindshare comment last week",
    pillar: "Web3 GTM",
    opener: "",
    status: "REPLIED",
  },
];

export const caps = {
  linkedin: { used: 2, max: 5 },
  x: { used: 3, max: 10 },
};

export const bets = [
  {
    id: 1,
    text: "Carousels about my AI builds get more saves than text posts",
    started: "Week 22",
    status: "testing" as const,
    evidence: "2 carousels in, save rate 2.1x text average",
  },
  {
    id: 2,
    text: "Cost numbers in the hook outperform curiosity hooks",
    started: "Week 23",
    status: "leaning proven" as const,
    evidence: "3 of 3 posts above median impressions",
  },
  {
    id: 3,
    text: "Threads work on X for long breakdowns",
    started: "Week 21",
    status: "leaning retire" as const,
    evidence: "4 threads, all below median",
  },
];

export const people = {
  priority: [
    { handle: "@signulll", platform: "X", why: "AI x marketing takes, big reach" },
    { handle: "@gtm_builder", platform: "X", why: "Ships tooling, warm contact" },
  ],
  watch: [
    { handle: "@lenak_web3", platform: "X", why: "Web3 community peer" },
    { handle: "tomas-rivera-gtm", platform: "LinkedIn", why: "CMO voice, spend angle" },
  ],
  avoid: [{ handle: "@cryptodrama_xyz", platform: "X", why: "Drama-prone" }],
};

export const positioning =
  "The border-crosser: international relations analyst, marketer at 19, now learning to build. A marketer who keeps crossing professional borders nobody told her she was allowed to cross, and shows what is on the other side.";

export const toneOfVoice = {
  northStar: "Fei-Fei Li, The Worlds I See: the scholar braided with the memoirist.",
  formula: "Plain surface, deep engine. Simple words, one expensive word. Speaks plain, writes rich.",
  rules: [
    "Close by widening or with an open question, never the thesis hammer",
    "Warm, self-deprecating humour; never at a person's expense",
    "No em-dashes (lifelong aversion, and the AI tell)",
    "No engagement-bait, no clickbait, no naming names",
  ],
};

export const messaging = {
  pillars: [
    { name: "AI-powered marketing ops", share: 40 },
    { name: "Web3 GTM", share: 25 },
    { name: "Learning in public", share: 25 },
    { name: "Personal lane", share: 10 },
  ],
  povs: [
    "You don't need more AI, you need a better setup.",
    "Information inflation is the real problem; being selective is a skill.",
    "AI can do a lot, but it can't be you.",
    "Dignity over effectiveness: no clickbait, even though it works.",
  ],
};

export interface Persona {
  name: string;
  who: string;
  believe: string;
  pillars: string;
}

export const personas: Persona[] = [
  {
    name: "Web3 founders & CMOs",
    who: "Early-stage crypto/Web3 leaders running lean",
    believe: "She can run my GTM with half the budget.",
    pillars: "AI ops · Web3 GTM",
  },
  {
    name: "Marketers leveling up on AI",
    who: "B2B/SaaS marketers feeling behind on AI",
    believe: "She's ahead of me on this, worth following closely.",
    pillars: "AI ops · Learning in public",
  },
  {
    name: "Technical founders & builders",
    who: "People who ship and respect those who do",
    believe: "A marketer who actually builds, not just talks.",
    pillars: "Learning in public · Personal lane",
  },
];

export const lanes = {
  mine: ["AI for marketing", "GTM", "Web3 growth", "build in public", "tool costs"],
  adjacent: ["AI industry news", "crypto market takes", "hiring in tech"],
  never: ["politics", "personal drama", "token shilling", "doom or hype extremes"],
};

export interface Metric {
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
}

export interface Platform {
  name: string;
  dot: string;
  followers: number;
  followerDelta: number;
  metrics: Metric[];
}

export const platforms: Platform[] = [
  {
    name: "LinkedIn",
    dot: "bg-accent",
    followers: 2840,
    followerDelta: 64,
    metrics: [
      { label: "Impressions", value: 18400 },
      { label: "Unique views", value: 11200 },
      { label: "Engagement rate", value: 4.2, suffix: "%" },
      { label: "Reactions", value: 540 },
      { label: "Comments", value: 142 },
      { label: "Reposts", value: 91 },
      { label: "Post clicks", value: 430 },
      { label: "Profile views", value: 612 },
      { label: "Search appearances", value: 88 },
      { label: "SSI", value: 61, hint: "social selling index" },
    ],
  },
  {
    name: "X",
    dot: "bg-blush",
    followers: 1190,
    followerDelta: 31,
    metrics: [
      { label: "Impressions", value: 9600 },
      { label: "Engagement rate", value: 2.8, suffix: "%" },
      { label: "Likes", value: 180 },
      { label: "Replies", value: 44 },
      { label: "Reposts", value: 28 },
      { label: "Quotes", value: 9 },
      { label: "Bookmarks", value: 17 },
      { label: "Profile visits", value: 388 },
      { label: "Link clicks", value: 96 },
      { label: "Mentions", value: 12 },
    ],
  },
];

export interface FunnelStage {
  stage: string;
  value: number;
  note: string;
  source: string;
}

export const marketingFunnel: FunnelStage[] = [
  {
    stage: "Reach",
    value: 28000,
    note: "Total impressions across both channels",
    source: "X + LinkedIn impressions",
  },
  {
    stage: "Engaged",
    value: 1042,
    note: "Liked, replied, reposted or commented",
    source: "all reactions + comments + reposts",
  },
  {
    stage: "Profile visits",
    value: 1000,
    note: "Clicked through to look at you",
    source: "profile views + visits",
  },
  {
    stage: "New followers",
    value: 95,
    note: "Chose to follow this week",
    source: "follower growth",
  },
  {
    stage: "Conversations",
    value: 9,
    note: "DMs and replies that became threads",
    source: "outreach sent + inbound",
  },
  {
    stage: "Opportunities",
    value: 4,
    note: "Calls, collabs, inbound interest",
    source: "replied + booked",
  },
];

export interface ScheduledPost {
  id: string;
  channel: "linkedin" | "x";
  time: string;
  topic: string;
  status: "scheduled" | "draft";
}

export interface CalendarDay {
  day: string;
  date: string;
  today?: boolean;
  posts: ScheduledPost[];
}

export const schedule: CalendarDay[] = [
  {
    day: "Mon",
    date: "16 Jun",
    posts: [
      { id: "p1", channel: "linkedin", time: "09:00", topic: "Building a tool instead of buying one", status: "scheduled" },
      { id: "p2", channel: "x", time: "12:30", topic: "Reply to @signulll on lean teams", status: "scheduled" },
    ],
  },
  {
    day: "Tue",
    date: "17 Jun",
    posts: [
      { id: "p3", channel: "x", time: "10:00", topic: "Quote-tweet: agent commerce take", status: "scheduled" },
    ],
  },
  {
    day: "Wed",
    date: "18 Jun",
    posts: [
      { id: "p4", channel: "linkedin", time: "09:00", topic: "Tool-evaluation carousel", status: "draft" },
      { id: "p5", channel: "x", time: "15:00", topic: "Legos and shipping software", status: "draft" },
    ],
  },
  {
    day: "Thu",
    date: "19 Jun",
    today: true,
    posts: [
      { id: "p6", channel: "x", time: "11:00", topic: "Thread: the better-setup principle", status: "draft" },
    ],
  },
  { day: "Fri", date: "20 Jun", posts: [] },
  {
    day: "Sat",
    date: "21 Jun",
    posts: [
      { id: "p7", channel: "x", time: "10:00", topic: "Weekend build-in-public note", status: "draft" },
    ],
  },
  { day: "Sun", date: "22 Jun", posts: [] },
];

export const weekSummary = {
  postsThisWeek: 4,
  postsTarget: 7,
  followersGained: 95,
  topImpressions: 18400,
};

export const stats = {
  week: "Week 24",
  channels: [
    { name: "LinkedIn", followers: 2840, delta: 64, impressions: 18400, engagement: 4.2 },
    { name: "X", followers: 1190, delta: 31, impressions: 9600, engagement: 2.8 },
  ],
  pillarMix: [
    { pillar: "AI-powered marketing ops", target: 40, actual: 47 },
    { pillar: "Web3 GTM", target: 25, actual: 18 },
    { pillar: "Learning in public", target: 25, actual: 24 },
    { pillar: "Personal lane", target: 10, actual: 11 },
  ],
  funnel: { queued: 14, sent: 9, replied: 4 },
  topPost: {
    title: "The build-it-yourself tool post",
    note: "3.1x your median impressions; the build-vs-buy angle landed",
  },
  bottomPost: {
    title: "Thread about agent frameworks",
    note: "Threads keep underperforming for you; bet #1 leaning toward retire",
  },
  suggestions: [
    "Add \"circle back\" to banned phrases (removed from 3 drafts this month)",
    "You replied to @gtm_builder three times; add to Priority people list?",
  ],
};
