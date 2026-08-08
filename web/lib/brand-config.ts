// Scoring config derived from brand/messaging.md. The heuristic scorer reads
// this; later, Claude scoring reads the full brand/*.md files. Keep in sync.

export const SIGNAL_KEYWORDS = [
  "ai marketing",
  "marketing agent",
  "marketing automation",
  "gtm",
  "go-to-market",
  "web3 marketing",
  "crypto marketing",
  "kol",
  "mindshare",
  "growth marketing",
  "claude",
  "ai agent",
  "martech",
  "pr analytics",
  "build in public",
  "content marketing",
  "founder brand",
  "personal brand",
];

// Lane keywords — see brand/messaging.md "Lanes".
export const LANE_MINE = [
  "ai marketing",
  "marketing agent",
  "gtm",
  "go-to-market",
  "web3",
  "crypto marketing",
  "build in public",
  "martech",
  "marketing automation",
  "ai agent",
  "personal brand",
  "founder brand",
];

export const LANE_NEVER = [
  "politic",
  "election",
  "token price",
  "shill",
  "pump and dump",
  "exit scam",
  "conspiracy",
  "doom",
];

export const PILLARS = [
  {
    name: "AI-powered marketing ops",
    kws: ["ai marketing", "marketing agent", "martech", "automation", "ai agent", "claude", "tool", "workflow"],
  },
  {
    name: "Web3 GTM",
    kws: ["web3", "crypto", "kol", "mindshare", "airdrop", "defi", "token", "onchain"],
  },
  {
    name: "Learning in public",
    kws: ["build in public", "shipped", "learning", "journey", "i built", "experiment", "side project"],
  },
];
