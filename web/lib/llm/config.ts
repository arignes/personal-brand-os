// Per-role provider + model resolution. Defaults send voice-sensitive roles to
// Claude (quality) and bulk roles to Nous (cost), each overridable by env:
//   LLM_PROVIDER_DRAFTER=nous   LLM_MODEL_DRAFTER=Hermes-4-405B
import type { AgentRole, Provider } from "./types";

interface RoleConfig {
  provider: Provider;
  model: string;
  thinking: boolean; // adaptive thinking on Claude (generative roles benefit)
}

export const DEFAULT_MODEL: Record<Provider, string> = {
  claude: "claude-opus-4-8",
  nous: "Hermes-4-405B",
  gemini: "gemini-2.0-flash",
};

const DEFAULTS: Record<AgentRole, RoleConfig> = {
  scorer: { provider: "nous", model: "Hermes-4-405B", thinking: false },
  drafter: { provider: "claude", model: "claude-opus-4-8", thinking: true },
  voice_check: { provider: "claude", model: "claude-opus-4-8", thinking: true },
  contact: { provider: "claude", model: "claude-opus-4-8", thinking: true },
  digest: { provider: "claude", model: "claude-opus-4-8", thinking: true },
};

export function resolveRole(role: AgentRole): RoleConfig {
  const upper = role.toUpperCase();
  const provider = (process.env[`LLM_PROVIDER_${upper}`] as Provider) || DEFAULTS[role].provider;
  const model = process.env[`LLM_MODEL_${upper}`] || DEFAULTS[role].model;
  return { ...DEFAULTS[role], provider, model };
}
