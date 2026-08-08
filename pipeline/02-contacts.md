# Contact Engine — Turn Signals into Relationships

Signals tagged `CONTACT` become outreach candidates. This is a lightweight personal CRM, not a spam machine.

## Hard rule

**Nothing auto-sends.** Every connection request, DM, or reply is drafted by the system and approved (or edited) by Arina in the iOS app. This protects her accounts (LinkedIn/X automation bans) and her reputation.

## Contact lifecycle

```
DISCOVERED → QUEUED → DRAFTED → APPROVED → SENT → REPLIED → RELATIONSHIP / CLOSED
```

(Same state-machine pattern as job-agent's Application lifecycle.)

## What a contact record holds

- person: name, handle(s), title, company, follower counts
- why: the signal that surfaced them + Claude's reason
- pillar fit: which messaging pillar connects Arina to them
- draft opener: connection note / DM / reply, written in Arina's voice from `brand/tone-of-voice.md`
- channel: LinkedIn or X
- status + timestamps + outcome notes

## Drafting rules for openers

1. Reference the specific signal (their post/news) — never generic
2. One clear reason to connect, no pitch in first touch
3. Match channel norms: LinkedIn note ≤ 300 chars; X DM short and casual
4. Voice-check against `brand/tone-of-voice.md` banned-phrases list

## Daily flow in the iOS app

1. Review queue shows new `DRAFTED` contacts (cap: ~5/day LinkedIn, ~10/day X — stay under platform radar; caps are enforced in worker code, not just suggested in prompts)
2. Arina: approve / edit / skip
3. Approved → copy-to-clipboard + deep link to the person's profile (v1: manual send) or API send where safe
4. Reply detection: v1 manual ("mark as replied"), later via API polling

## Metrics (feed analytics engine)

- accept rate (LinkedIn), reply rate (both)
- by pillar, by opener style, by source signal type
- relationship conversions: calls booked, collabs, inbound opportunities
