// Router: callLLM({ role, system, user, schema }) dispatches to the provider
// resolved for that role, with graceful fallback to whichever provider has a key.
import { DEFAULT_MODEL, resolveRole } from "./config";
import { callClaude, claudeAvailable } from "./claude";
import { callGemini, geminiAvailable } from "./gemini";
import { callNous, nousAvailable } from "./nous";
import type { LLMRequest, LLMResult, Provider } from "./types";

export type { AgentRole, LLMRequest, LLMResult, Provider } from "./types";
export { resolveRole } from "./config";
export { claudeAvailable } from "./claude";
export { nousAvailable } from "./nous";
export { geminiAvailable } from "./gemini";

export function providerAvailable(p: Provider): boolean {
  if (p === "claude") return claudeAvailable();
  if (p === "gemini") return geminiAvailable();
  return nousAvailable();
}

export function anyProviderConfigured(): boolean {
  return claudeAvailable() || nousAvailable() || geminiAvailable();
}

export async function callLLM(req: LLMRequest): Promise<LLMResult> {
  const cfg = resolveRole(req.role);
  let provider = req.provider ?? cfg.provider;

  // Fall back to whatever has a key, so one configured provider runs everything.
  if (!providerAvailable(provider)) {
    if (claudeAvailable()) provider = "claude";
    else if (geminiAvailable()) provider = "gemini";
    else if (nousAvailable()) provider = "nous";
    else
      throw new Error(
        "No LLM provider configured (set ANTHROPIC_API_KEY, GEMINI_API_KEY, or NOUS_PORTAL_API_KEY)",
      );
  }

  // Use the role's model if it targets this provider, else the provider default.
  const model = cfg.provider === provider ? cfg.model : DEFAULT_MODEL[provider];

  if (provider === "claude") return callClaude(req, model, cfg.thinking);
  if (provider === "gemini") return callGemini(req, model);
  return callNous(req, model);
}
