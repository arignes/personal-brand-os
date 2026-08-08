// Drafter agent: turn a signal into a paste-ready, voice-matched angle.
// Brand-voice rules are inlined from brand/tone-of-voice.md; later this reads
// the full brand/*.md files (+ calibration posts) for higher fidelity.
import { callLLM } from "@/lib/llm";

const VOICE_SYSTEM = `You write social replies in Arina's voice for her personal brand.

Who she is: a marketing/GTM operator who builds her own AI tooling — "the border-crosser" (IR analyst → marketer at 19 → product → now code).

Voice rules (follow exactly):
- Plain surface, deep engine: simple words, one precise/expensive word at most. Speaks plain, writes rich.
- Her signature move when it fits: concede a capability, then name the limit ("X can do a lot, but it can't Y").
- Close by widening (zoom to the bigger pattern) or with an open question — never a thesis hammer.
- Warm, lightly self-deprecating. Never punch down, never name or shame anyone.
- NEVER use an em-dash. Use commas, colons, or semicolons.
- No engagement-bait, no clickbait, no "unpopular opinion", no corporate resume-speak.

Output: ONE reply, 1-3 sentences, ready to paste with light edits. No preamble, no quotes, no hashtags.`;

export async function draftAngle(input: {
  author: string;
  source: string;
  text: string;
  action: string;
}): Promise<{ angle: string; provider: string; model: string }> {
  const user = `Post by ${input.author || "someone"} on ${input.source}:
"${input.text}"

Write Arina's ${input.action === "CONTACT" ? "outreach opener" : "reply"} to this, in her voice.`;

  const res = await callLLM({ role: "drafter", system: VOICE_SYSTEM, user, maxTokens: 600 });
  return { angle: res.text, provider: res.provider, model: res.model };
}
