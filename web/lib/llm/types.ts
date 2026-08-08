// Provider-agnostic LLM layer. Each agent role can run on Claude or Nous,
// resolved per-role from config (lib/llm/config.ts). See docs/06-llm-layer.md.

export type Provider = "claude" | "nous" | "gemini";

export type AgentRole = "scorer" | "drafter" | "voice_check" | "contact" | "digest";

export interface LLMRequest {
  role: AgentRole;
  system: string;
  user: string;
  schema?: Record<string, unknown>; // JSON schema → structured output
  provider?: Provider; // override; else resolved from config
  maxTokens?: number;
}

export interface LLMResult {
  text: string;
  provider: Provider;
  model: string;
}
