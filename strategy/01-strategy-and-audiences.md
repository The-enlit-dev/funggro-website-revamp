# 01 — Strategy & audience analysis

## The job of each page (in one sentence)
- **Teen page `/earn`:** turn a curious, sceptical 14–25-year-old into a download by showing *exactly* what the work is, what it pays and why it's safe — and give the parent looking over their shoulder enough reassurance to say yes.
- **Company page `/about`:** prove Funngro is a real, accountable company run by real people, so that parents, brand partners, journalists, job-seekers and evaluators trust it.

The two pages work as a pair: the Teen page is the **promise**, the Company page is the **proof**. Each links to the other at the moment trust is needed.

## Why the current pages under-perform (from Phase 1)
- Teen page: text-only, repetitive, SEO-stuffed copy, single CTA, no parent content.
- Company page: no faces, unbalanced layout, contradictory facts.
- Both: client-rendered (invisible to non-JS crawlers), wrong canonicals/OG tags.
- The visual language (dark green glow, italic-serif accent words, tiny mono-caps labels) is close to the default look of AI site builders — polished but not distinctive.

## Audiences

### Teen page
| Segment | Who | What they need to see | Their main doubt | What moves them |
|---|---|---|---|---|
| **Primary: first-time teen earner** (14–18) | School student, smartphone-first, UPI-aware, often from Tier-2/3 cities (published stories: Koppal, Yavatmal, Bardhaman, Prayagraj…) | What the tasks are, how much, how fast, that it's free | "Is this fake?" — the most repeated line in Funngro's own stories ("Thought earning apps were fake") | Real app screens, real people like them, clear rupee numbers, store rating |
| **Primary: college-age earner** (18–25) | Student or fresher wanting side income / experience | Path to bigger work (content, referrals, leadership) | "Is it worth my time?" | Income ladder, skills, Clan Leader path |
| **Secondary: parent** | Reads over the teen's shoulder or checks later | Safety, moderation, no fees, data handling, who runs it | "Is my child safe and is this a scam?" | Safety block, age rule, company facts, Shark Tank, link to Company page |
| Search visitor | Lands from Google ("earn money online for teens in India") | Fast answer, credible | Spam-fatigue from "earn money" sites | Honest, specific copy; FAQ |

### Company page
| Segment | Need | What moves them |
|---|---|---|
| **Parents** | Accountability: who are the founders, where are they, who backs them | Faces, names, address, investors, press |
| **Brand partners / advertisers** | Scale, community quality, credibility | Verified numbers, Teenlancer engine, press, link to For Brands |
| **Journalists / investors** | Story, milestones, contacts | Timeline, press list, press email |
| **Job-seekers (often existing users)** | "Can I work here?" | Teenlancer engine, careers CTA |
| **Evaluators** (this brief) | Craft and judgement | Design quality, honest content handling |

## Messaging framework
**Core idea:** *Real work. Real brands. Real pay.* (Builds on the site's own "Real brands. Real rupees." but foregrounds work — Funngro sells experience, not easy money.)

| Pillar | Teen-page message | Company-page message | Proof (tier) |
|---|---|---|---|
| Real work | Four kinds of brand work you can do from your phone | We built a marketplace of real projects for young India | Task types (B) |
| Real pay | Know the range before you start; withdraw to UPI | Users have been paid through the app, at scale | Ladder (B, sign-off), Play downloads (A) |
| Real safety | Every campaign moderated; no fees; your data stays in India | Accountable founders, address, investors | Trust page (B), Shark Tank deal (A) |
| Real growth | Start small → grow → lead a clan | The company is run by people who started as users | Teenlancer engine (B), stories (B, consent) |

**Tone:** plain, warm, specific, a little playful — never hype. No "get rich", no superlatives, no countdown urgency. Every number is labelled with its source.

## Primary conversion & KPIs (to measure post-launch — not measured by me)
- Teen: app-store click-through (Android/iOS), QR scans on desktop, scroll depth to "How it works", FAQ opens.
- Company: clicks to Teen page, careers, press email, For Brands.
- Technical: Lighthouse ≥95 all categories on mobile; LCP <2.5 s, CLS <0.1, INP <200 ms; 0 axe violations.

## Scope boundaries
- Two pages delivered: `/earn/` and `/about/`. Other nav items (Stories, For Brands, Arcade, SheLancer, Blog, FAQ, Trust, Careers, Press, Contact) link **out to funngro.com** — not rebuilt.
- English only. The live site's EN / Hi-En / हिं toggle is out of scope; the design system will reserve space and font support for it (see technical plan).
