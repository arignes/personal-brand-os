# Visual Direction — iOS App + Content Identity

Reference: "lazygirl collective" brand board Arina shared 2026-06-12 (editorial serif + burgundy/pink/baby-blue/cream palette). Status: direction agreed in principle, tokens below are v1.

## Why this reference fits the brand (not just "pretty")

- **Editorial serif = her taste.** Classical craft, 19th-century art, bookworm, vinyl: the brand files literally say her aesthetic is "classical craft, no cheap concept." A magazine-editorial look IS that taste in UI form.
- **Warm + playful = her humor register** (warm, self-deprecating, never corporate).
- **Maximum differentiation.** Every AI/Web3 dashboard is dark-mode-neon-terminal. An editor's-desk cream-and-burgundy app is "simple words, deep engine" as design: soft surface, serious machine underneath.

One adjustment vs. the reference: lean **editorial** (burgundy ink on cream paper, "editor's desk") rather than **lifestyle-girly** (pink-first). Pinks become surfaces and moments, not the lead. The app must still feel right when it's showing Web3 signal feeds and analytics.

## Color tokens (hex from the reference board)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#720808` | headlines, primary text, icons |
| `primary` | `#A10728` | buttons, active states, links, key numbers |
| `blush` | `#FEC6D3` | highlight cards, badges, selected states |
| `surface` | `#F6E6E5` | card backgrounds, grouped sections |
| `accent` | `#BAD4ED` | info accents, charts secondary, "adjacent lane" tags |
| `accent-soft` | `#DAE9F7` | chart fills, subtle info backgrounds |
| `paper` | `#F6F0EA` | app background |

Semantic mapping: success = deep green to be added (palette has none — pick a muted olive that doesn't fight the reds, e.g. `#5F6E3A`, test it); danger/flags = `primary`; info = `accent`.

**Accessibility rules:** text is always `ink` or `primary` on light surfaces, `paper` on burgundy. Never pink-on-cream or blue-on-cream for text. Blush/accent are fills, not type colors.

## Typography

| Role | Reference font | Practical choice |
|---|---|---|
| Display / headlines | Editors Note (paid) | **Fraunces** (free, Google Fonts) — chosen for the web app pivot, very close editorial feel. Upgrade to Editors Note later if she buys it |
| Body / UI | Poppins Light + DM Sans Semi Bold | **DM Sans** (free, Google Fonts) for all UI; Poppins optional for large quiet labels |
| Script accent | Bestina Signature | Only for the personal-lane stamp and logo moments. Never for UI text |

Rule: serif for what Arina reads (headlines, post drafts), sans for what the app says (labels, buttons, meta).

## Screen application (the 3 v1 screens)

- **Today (signal feed):** paper background; date as big serif headline; signal cards on `surface` with lane tag (`mine` = blush badge, `adjacent` = accent badge); score as a serif numeral in `primary`; the ready-to-paste angle in italic serif inside a quote block.
- **Review (drafts):** draft text set in serif (it's editorial copy, treat it like a magazine proof); approve = `primary` filled button, edit = ink outline, skip = quiet text. Hook options as 3 selectable blush chips.
- **Stats:** numbers big in serif `primary`; charts in accent blues with one burgundy series; weekly digest reads like an editor's letter, not a dashboard panel.

## Depth layer (added 2026-06-12, from Arina's gradient/foil references)

The flat editorial base gets an atmospheric layer — gradient mesh + glass + grain, all within the existing palette:

- **Gradient blobs**: 3–4 large blurred radial shapes (blush, accent blue, primary at low opacity) fixed behind content
- **Grain**: full-screen SVG `feTurbulence` noise overlay at ~3.5% opacity, multiply blend (the foil-texture reference, dialed way down)
- **Glass cards**: `card-glass` = warm white at 72% + 12px backdrop blur + soft burgundy-tinted shadow (`--shadow-soft`)
- **Glow buttons**: `btn-glow` = burgundy gradient (`#B5123A → #A10728 → #720808`) + colored shadow (`--shadow-glow`) + 1px hover lift
- **Sparkles**: `✦` glyphs with a slow twinkle animation; headline-level accents only, max 2 per screen
- Angle/opener quote blocks: subtle `surface → blush` gradient fills

Rule of restraint: depth lives in the background and the primary action; cards stay readable, text never sits on gradients.

## Dark mode

Invert the metaphor: deep burgundy-black paper (`#2A0606`-ish), cream type, blush → muted rose fills, accent blues stay. Test later; light mode is the hero.

## Double duty: content visual identity

Same tokens style the **carousels and photo posts** (checklist item 6 partially solved by this board):
- Carousel slides: paper background, ink serif headline, one burgundy highlight word, page numbers in script
- This makes the app and the public content visually one brand — her feed and her tool match.

Still needed from Arina for content identity: headshot, and 1–2 carousel references she loves (layout, not palette).

## Open questions

1. Logo: a monogram like the reference's interlocked letters? "AN" monogram in script — needs her yes/no
2. Does she want the brand name/wordmark on carousels (e.g. small "arina" script) or stay clean?
3. Success-green token confirmation once we see it on real screens
