// Carousel generator — slide-by-slide copy grounded in the carousel
// architectures from the marketing playbook. Rendered as real designed slides
// (see components/Carousel.tsx), not AI-generated-text images.
import { anyProviderConfigured, callLLM } from "@/lib/llm";
import { MARKETING_PLAYBOOK } from "@/lib/marketing-playbook";

export interface Slide {
  kind: "cover" | "point" | "cta";
  headline: string;
  body: string;
}

export interface Carousel {
  architecture: string;
  slides: Slide[];
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    architecture: { type: "string" },
    slides: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          kind: { type: "string", enum: ["cover", "point", "cta"] },
          headline: { type: "string" },
          body: { type: "string" },
        },
        required: ["kind", "headline", "body"],
      },
    },
  },
  required: ["architecture", "slides"],
} as const;

const SYSTEM = `You are a LinkedIn carousel designer and direct-response copywriter.

${MARKETING_PLAYBOOK}

Design a 6 to 8 slide carousel. Pick ONE carousel architecture from the playbook and name it in "architecture". Slides:
- Slide 1 = cover (kind "cover"): a scroll-stopping hook headline plus one supporting line.
- Middle slides (kind "point"): ONE idea each, a punchy headline and 1 to 2 short lines. Never a wall of text.
- Last slide (kind "cta"): a soft call to action in the person's voice, not a hard sell.

Rules: headline <= 8 words, body <= 24 words. No em-dashes. Match the person's tone. Be specific, not generic.`;

export async function generateCarousel(topic: string, tone: string): Promise<Carousel> {
  if (!anyProviderConfigured()) return demoCarousel(topic);
  try {
    const res = await callLLM({
      role: "drafter",
      system: SYSTEM,
      user: `Topic: ${topic}\nTone: ${tone || "clear and useful"}\n\nDesign the carousel.`,
      schema: SCHEMA as unknown as Record<string, unknown>,
      maxTokens: 1600,
    });
    return JSON.parse(res.text) as Carousel;
  } catch {
    return demoCarousel(topic);
  }
}

function demoCarousel(topic: string): Carousel {
  return {
    architecture: "Hack-List (demo)",
    slides: [
      { kind: "cover", headline: topic || "A carousel about your topic", body: "Connect a funded LLM key for a fully written, on-brand carousel." },
      { kind: "point", headline: "One idea per slide", body: "Each slide makes a single point, easy to swipe." },
      { kind: "point", headline: "Real design, real text", body: "Slides render in your brand style, crisp and readable." },
      { kind: "cta", headline: "Want the full version?", body: "Add a key and regenerate to see it written in your voice." },
    ],
  };
}
