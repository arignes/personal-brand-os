// Personalized brand playbook: a full "how to run your brand" guide (socials,
// content, PR, community, first 30 days), grounded in Corey Haines's marketing
// methodology + the person's own brand.
import "server-only";
import type { ActiveBrand } from "@/lib/active-brand";
import { BRAND_GUIDE_SKILLS } from "@/lib/brand-guide-skills";
import { anyProviderConfigured, callLLM } from "@/lib/llm";

export interface GuideSection {
  title: string;
  intro: string;
  steps: string[];
}

export interface Playbook {
  sections: GuideSection[];
  demo?: boolean;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    sections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          intro: { type: "string" },
          steps: { type: "array", items: { type: "string" } },
        },
        required: ["title", "intro", "steps"],
      },
    },
  },
  required: ["sections"],
} as const;

const SYSTEM = `You are a senior brand strategist writing a practical, personalized brand playbook. Ground everything in the methodology below and in the person's own brand (use their positioning, pillars, audience, tone, and goals by name). Be specific to them, never generic. No fluff, no em-dashes.

${BRAND_GUIDE_SKILLS}

Write exactly these six sections, in order:
1. "Your foundation" — their positioning and exactly who they are for.
2. "Show up on socials" — cadence, formats, and hook types for their pillars.
3. "What to create" — searchable vs shareable content mapped to their pillars.
4. "Earned media and PR" — whether and how to pursue it, and their first moves.
5. "Community and engagement" — where to be useful and how.
6. "Your first 30 days" — a concrete weekly routine they can start Monday.

Each section: a 1-2 sentence intro plus 3 to 6 concrete, do-this-now steps.`;

function brandToPrompt(b: ActiveBrand): string {
  const r = b.result;
  return `Name: ${b.name || "(unnamed)"}
Positioning: ${r.positioning}
Tone: ${r.toneSummary}
Audience: ${r.audience.summary}
Pillars: ${r.pillars.map((p) => p.name).join(", ")}
Goals / focus: ${b.intake.focus} ${b.intake.q.goals} ${b.intake.q.services}

Write their brand playbook.`;
}

export async function generatePlaybook(b: ActiveBrand): Promise<Playbook> {
  if (!anyProviderConfigured()) return demoPlaybook();
  try {
    const res = await callLLM({
      role: "drafter",
      system: SYSTEM,
      user: brandToPrompt(b),
      schema: SCHEMA as unknown as Record<string, unknown>,
      maxTokens: 3000,
    });
    return JSON.parse(res.text) as Playbook;
  } catch {
    return demoPlaybook();
  }
}

function demoPlaybook(): Playbook {
  return {
    demo: true,
    sections: [
      {
        title: "Your foundation",
        intro: "Connect a funded LLM key to generate your full, personalized playbook.",
        steps: ["This is a placeholder. Add a key and regenerate for the real thing."],
      },
    ],
  };
}
