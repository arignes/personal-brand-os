// Advisor: takes a person's socials + goals + a 10-question intake and returns
// an audience read, focus recommendations, content pillars, and sample posts.
// Uses the provider-agnostic LLM adapter; falls back to a demo result with no key.
import { anyProviderConfigured, callLLM } from "@/lib/llm";
import { MARKETING_PLAYBOOK } from "@/lib/marketing-playbook";

export interface Intake {
  name: string;
  email?: string;
  socials: { linkedin?: string; instagram?: string; x?: string; other?: string };
  focus: string; // what they want to post / focus / goals (free text)
  q: {
    identity: string;
    audience: string;
    goals: string;
    pillars: string;
    services: string;
    tone: string;
    avoid: string;
    differentiator: string;
    success90: string;
    admire: string;
  };
}

export interface AdvisorResult {
  positioning: string;
  audience: { summary: string; segments: string[] };
  toneSummary: string;
  pillars: { name: string; why: string }[];
  recommendations: string[];
  samplePosts: { channel: string; hook: string; body: string; why?: string }[];
  demo?: boolean;
}

export const QUESTIONS: { key: keyof Intake["q"]; label: string; placeholder: string }[] = [
  { key: "identity", label: "In one line, who are you and what do you do?", placeholder: "e.g. Fractional CMO helping B2B SaaS founders build demand" },
  { key: "audience", label: "Who do you most want to reach?", placeholder: "e.g. Seed–Series A founders, heads of marketing" },
  { key: "goals", label: "What are your main goals for your personal brand?", placeholder: "e.g. Inbound leads, authority, speaking invites" },
  { key: "pillars", label: "What topics do you want to be known for?", placeholder: "e.g. GTM, positioning, demand gen, build-in-public" },
  { key: "services", label: "What services or offers do you provide (or want to)?", placeholder: "e.g. Fractional CMO, GTM audits, workshops" },
  { key: "tone", label: "How do you want to sound?", placeholder: "e.g. Warm, direct, a little contrarian; no corporate-speak" },
  { key: "avoid", label: "What do you NOT want to sound like, or topics to avoid?", placeholder: "e.g. No clickbait, no politics, no jargon" },
  { key: "differentiator", label: "What makes you different from others in your field?", placeholder: "e.g. I actually ran the playbooks I teach" },
  { key: "success90", label: "What does success look like in 90 days?", placeholder: "e.g. 3 inbound calls a week, 2k new followers" },
  { key: "admire", label: "Whose content style do you admire?", placeholder: "e.g. April Dunford, Dave Gerhardt" },
];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    positioning: { type: "string" },
    audience: {
      type: "object",
      additionalProperties: false,
      properties: {
        summary: { type: "string" },
        segments: { type: "array", items: { type: "string" } },
      },
      required: ["summary", "segments"],
    },
    toneSummary: { type: "string" },
    pillars: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { name: { type: "string" }, why: { type: "string" } },
        required: ["name", "why"],
      },
    },
    recommendations: { type: "array", items: { type: "string" } },
    samplePosts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          channel: { type: "string" },
          hook: { type: "string" },
          body: { type: "string" },
          why: { type: "string" },
        },
        required: ["channel", "hook", "body", "why"],
      },
    },
  },
  required: ["positioning", "audience", "toneSummary", "pillars", "recommendations", "samplePosts"],
} as const;

const SYSTEM = `You are a senior personal-brand strategist and direct-response copywriter. Given a person's social profiles, goals, and questionnaire, produce a sharp, specific brand plan.

Rules: be concrete and non-generic; use their actual words; no clickbait, no corporate filler, no em-dashes.

Sample posts: sound like a real person in their stated tone, ready to post, one idea each, first line must stop the scroll, end on a clear thought or open question (never a hard sell).

${MARKETING_PLAYBOOK}

For each post's "why": 1-2 sentences on what makes it work and which named formula/principle from the playbook above it uses, so the person learns the pattern.`;

function intakeToPrompt(i: Intake): string {
  const socials = Object.entries(i.socials)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
  const q = QUESTIONS.map((x) => `- ${x.label}\n  ${i.q[x.key] || "(blank)"}`).join("\n");
  return `Name: ${i.name || "(unnamed)"}
Social profiles: ${socials || "(none given)"}
What they want to post / focus / goals: ${i.focus || "(blank)"}

Questionnaire:
${q}

Produce: a refined one-line positioning; an audience read (summary + 2-4 segments); a one-line tone summary; 3-4 content pillars (name + why); 4-6 concrete focus recommendations; and 3 sample posts (channel, hook, body, and a "why" explaining why the post will perform, naming the framework) in their tone.`;
}

export async function analyzeIntake(
  i: Intake,
  research?: string | null,
): Promise<AdvisorResult> {
  if (!anyProviderConfigured()) return demoResult(i);
  try {
    // `research` is best-effort live context (Perplexity), fetched in the route.
    const prompt = research
      ? `Current research on this niche (use where relevant, don't quote verbatim):\n${research}\n\n${intakeToPrompt(i)}`
      : intakeToPrompt(i);

    const res = await callLLM({
      role: "drafter",
      system: SYSTEM,
      user: prompt,
      schema: SCHEMA as unknown as Record<string, unknown>,
      maxTokens: 2500,
    });
    return { ...(JSON.parse(res.text) as AdvisorResult) };
  } catch {
    // No key, unfunded key, or unparseable output → graceful demo result.
    return demoResult(i);
  }
}
// Persistence: the /api/advisor route saves each submission to Supabase
// (best-effort) when SUPABASE_URL + SUPABASE_API_KEY are set. See lib/supabase.ts.

export function demoResult(i: Intake): AdvisorResult {
  const who = i.q.identity || i.name || "You";
  return {
    demo: true,
    positioning: i.q.identity
      ? `${i.q.identity}, sharpened so the value lands in the first line.`
      : "A clear one-line positioning appears here once an LLM key is connected.",
    audience: {
      summary:
        i.q.audience ||
        "Your audience read appears here: who follows you, what they care about, and where the overlap with your goals is.",
      segments: [
        i.q.audience || "Primary audience",
        "Peers who amplify you",
        "People who could hire or refer you",
      ],
    },
    toneSummary: i.q.tone || "Your tone summary appears here (warm, direct, no filler).",
    pillars: [
      { name: i.q.pillars?.split(",")[0]?.trim() || "Core topic", why: "Where your expertise and your audience's questions overlap." },
      { name: "Behind the scenes", why: "Builds trust and shows the real work." },
      { name: "Point of view", why: "One clear take you repeat until you own it." },
    ],
    recommendations: [
      "Post 3x/week on one channel before adding a second.",
      "Lead every post with the outcome, not the setup.",
      "Turn your services into stories, not pitches.",
      "Reply to 5 people in your niche daily to grow reach.",
    ],
    samplePosts: [
      {
        channel: "LinkedIn",
        hook: "The advice that changed how I work.",
        body: "A real, on-brand post is generated here once an LLM key is connected. It uses your tone, your audience, and your goals.",
        why: "Once a key is connected, this explains why the post works and which framework it uses (hook, PAS structure, open loop).",
      },
    ],
  };
}
