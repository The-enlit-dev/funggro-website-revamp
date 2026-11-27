# 06 — Verified facts register (single source of truth for page copy)

Rule for Phase 4: **page copy may only use facts from Tier A or Tier B.** Tier C items show as visible placeholders (`{{ }}`) until the client confirms them. Tier D must not appear.
Checked 2026-11-27. "Site" = funngro.com pages crawled in Phase 1 (`research/raw/`).

## Tier A — Confirmed by an independent source (or a store listing the client doesn't control)
| Fact | Value | Source(s) |
|---|---|---|
| Legal entity | Wishbanc Technologies Private Limited | Google Play & App Store developer name; site footer |
| Co-founders | Payal Jain and Anik Jain | Outlook Startup; eChai; site About & Press |
| Shark Tank India | Appeared in **Season 2** | Outlook Startup; Women's Web; Business Insider India; site |
| Shark Tank deal | ₹50 lakh for ~4% equity, from **Amit Jain and Namita Thapar** (₹25L each) | Outlook Startup; Venture Intelligence |
| Google Play (on 2026-11-27) | **4.1★, 54.6K reviews, 50L+ downloads**; app "Funngro: Freelance & Earn App" | play.google.com listing (rendered) |
| App Store India (on 2026-11-27) | **3.3★, 897 ratings, age rating 16+**, category Finance | apps.apple.com/in listing (rendered) |
| Headquarters | Mumbai | Site JSON-LD address (Jogeshwari E, Mumbai 400060), Press page; consistent |
| Press coverage exists (links live on site) | Entrackr (Dec 2022), IBS Intelligence, Business News Week, Times of India blog, FM Live, The Daily Brunch | URLs in `raw/press.desktop.json` |

Store ratings and downloads change — any figure used must carry an "as of" date, and should be refreshed at launch.

## Tier B — Company-published and consistent across the site + store listing (use, attributed to Funngro)
| Fact | Value | Where |
|---|---|---|
| Eligibility | "Any young Indian between 14 and 25" | Site FAQ; Play & App Store descriptions say 14–25 |
| Cost to join | Free; no joining fee; Funngro is paid by brands | FAQ, Earn, Home |
| Payout method | UPI or bank transfer, via the in-app Wallet | FAQ, Earn, Trust, store listing |
| Sign-up | OTP verification, about two minutes | FAQ, Earn, Trust |
| Four kinds of work | Brand promotion · Referrals · Micro tasks (sampling, surveys, app testing, ideation) · Content creation (UGC, reviews, video) | FAQ, Home, Earn |
| Pay ranges per task type | Brand promotion ₹200–1,500 · Sampling ₹100–800 · Referrals ₹300–2,000 · Influencer briefs ₹500–3,000 | Earn page only (single source — use with "typical range" label) |
| Income ladder | Start ₹1K–3K/mo · Grow ₹3K–7K/mo · Build ₹7K–15K+/mo; average active user ~₹4,100/mo; top 5% ₹18,000+/mo (FY26) | Home, Earn, FAQ (consistent) — still a financial claim: **needs client sign-off + footnote** |
| Safety rules for campaigns | Every campaign moderated; no adult content, gambling or MLM | Trust page |
| Data | Data stored in India; DPDP-compliant handling; in-app account deletion, PII removed within 90 days | Trust page |
| Support routes | Help icon in app → Live support, chatbot, Clan Leader, WhatsApp, email | FAQ |
| Contact emails | hello@funngro.com (press/general), teenlancer@funngro.com (safety/earner) | Press, Trust, footer |
| Skills users can learn | Writing, editing, marketing, research, communication, design basics | FAQ |
| Teenlancer engine | Support, QA, content and community roles are staffed by people who started as users | About, Careers |
| Published earner stories | 15 named earners with city, quote, earnings (e.g. Sarthak, Delhi, ₹3.9L+) and portraits | /stories, Home — **reuse needs client confirmation that consent covers a redesign** |

## Tier C — Company-published but INCONSISTENT → placeholder until the client confirms
| Topic | Conflict |
|---|---|
| Founder titles | About: **Payal = Founder & CEO, Anik = Co-founder & CFO**. Press: **Anik = Co-founder & CEO, Payal = Co-founder & CTO**. eChai lists Payal as CEO. |
| Founder bios | About and Press bios describe different careers for the same person |
| Founding year | Site: 2022 / FY22. Independent coverage (CB Insights, a startup profile): 2021 |
| User count | Site: 70 lakh+. Store listing: 60 lakh+. Verified downloads: 50L+ (downloads ≠ users) |
| Brands | Site: 5,000+ brands. Store: "2500+ brands" and "5000+ companies". About: "1,000+ live projects"; Earn: "5,000 live campaigns" |
| Shark Tank date | Site: "December 2022". Season 2 aired 2 Jan – 13 Mar 2023 (Wikipedia). Possibly the filming date — unconfirmed |
| Investors | Site banner: Amit Jain / SucSEED Indovation only. About bio + press: Amit Jain **and** Namita Thapar |
| Play rating | Site footer: 4.2★. Play Store today: 4.1★ |
| Payout speed | "In seconds / instant" (FAQ, Trust) vs "Most projects get marked in less than 10 days" (FAQ) |
| Withdrawal fees | "Zero withdrawal fees" vs "Any applicable fees will be clearly mentioned before you proceed" (FAQ) |
| Age policy | 14–25 (site, store text) vs App Store age rating 16+. Parental-consent rule mentioned only in third-party coverage, not on the site |
| Instagram | Brief gives `instagram.com/funngro/`; site links `instagram.com/fun.n.gro`. Neither verified (login wall) |
| Organisation name in schema | JSON-LD "Funngro Innovations Pvt Ltd" vs footer/store "Wishbanc Technologies Private Limited" |

## Tier D — Do not use
- "India's #1 youth earning app", "#1 Trusted by Gen Z" — unsubstantiated superlatives.
- Live "Paid this week ₹15,62,184" ticker with masked names: the list visibly repeats in the DOM; can't verify it's real data.
- Profitability claims ("first profitable quarter", "10 of 12 months profitable") — financial claims, unaudited.
- "Ranked #9 education app" — no date or source.
- Brand partner logos (ICICI, Kotak, Paytm, Toluna, Nielsen, CarDekho…) — names appear on the site, but **logo usage needs client permission**; text mention only if the client confirms current partnerships.

## Official assets archived (`assets/source/`)
| Asset | Notes |
|---|---|
| `brand/funngro-logo.svg` | Wordmark + mark, extracted from site; uses `currentColor` + leaf→primary gradient |
| `brand/og-image.jpg`, favicons | og-image uses a different lowercase wordmark — inconsistency to flag |
| `app-screens/*.webp` (5) | Home, growth ladder, daily bonus, tiers, wallet. Some appear to be rendered mock screens (sample names); confirm they're approved marketing screens |
| `earners/*.jpg` (10) | Portraits published on /stories; amateur photos, mixed quality and crops |
| `press/sharktank-thumb.jpg` | Shark Tank "Full pitch" thumbnail. Alt on site: "Funngro founders on Shark Tank India". The people pictured are **not identified** by me — don't caption names without client confirmation |

## Missing — requirements for the client
1. Confirm founder titles + approved bios, and supply official founder portraits.
2. Confirm founding year, current user count, brand count (as of a date) — or approve using only Tier A numbers.
3. Approved parent / age-consent wording (14–25 vs 16+).
4. Payout-time and fee wording that legal is comfortable with.
5. Consent for re-using earner stories and photos.
6. Permission to show partner brand logos (and which).
7. Official Instagram handle.
8. Official app-store badges usage (Google/Apple guidelines) and a canonical app download link / QR target.
9. Team/office photography for the Company page (optional but strongly recommended).

---

## Update 2026-11-27 (Phase 4) — Co-founder research

### Payal Jain — **Co-founder & CEO** (verified)
| Field | Finding | Sources |
|---|---|---|
| Name | Payal Jain | all sources |
| Designation | **Co-founder & CEO** | Entrackr, 15 Dec 2022 ("CEO and co-founder Payal") · Inc42 Datalabs ("CEO & Founder at Funngro") · eChai ("Founder & CEO - Funngro") · SugerMint interview ("Founder & CEO of Funngro") · funngro.com/about ("Founder · CEO") |
| Conflict investigated | funngro.com/press calls her "Co-founder & CTO". Every independent source and Funngro's own About page say CEO → the Press page is the outlier. |
| Background | Previously Customer Success Director at Worldline Global (digital payments) | Entrackr; Inc42 ("Ex- Worldline Global"); funngro.com/about (Worldline) |
| Education | IIM Calcutta alumna | Inc42 ("Alumni- Indian Institute of Management, Calcutta"); funngro.com/about |
| Experience | Pitched Funngro on Shark Tank India S2 | funngro.com/about; Women's Web coverage of the pitch (search result) |
| LinkedIn | https://www.linkedin.com/in/payal-jain-8780191/ | linked by funngro.com/about, Inc42 and eChai; her LinkedIn posts about the Funngro Teenlancer program use this handle |
| Photo | Not used — no Funngro-published, identified portrait; third-party photos (Inc42) have no licence | — |

### Anik Jain — **Co-founder** (title at Funngro NOT verified)
| Field | Finding | Sources |
|---|---|---|
| Name | Anik Jain | all sources |
| Designation | **Co-founder** only | Entrackr ("Founded in 2021 by Payal and Anik Jain"); Inc42 ("Co-Founder at Funngro") |
| Conflict investigated | funngro.com/about: "Co-founder · CFO"; funngro.com/press: "Co-founder & CEO" (contradicts the verified CEO, Payal); one search snippet: "Chief Growth Officer". No independent source confirms any C-level title → none shown. |
| Background | Second-time founder; previously co-founder & CEO of insurtech Symbo (Symbo India Insurance Broking) | Entrackr ("second time founder… Symbo"); Entrepreneur India, 4 Mar 2021 ("co-founder, and chief executive officer, Symbo India Insurance Broking"); StartupTalky, 27 May 2022 (Symbo-approved profile) |
| Experience | Insurance & financial services: ICICI Lombard, Marsh, Mahindra Insurance Brokers | CB Insights people listing (search result) + funngro.com/about (ICICI Lombard, Reliance Life, Marsh, Mahindra) — two sources agree on these three |
| LinkedIn | https://www.linkedin.com/in/anik-jain-7966404 | Inc42 person page (headline "Co-Founder at Funngro \| Ex - Symbo Insurance") + coffeemug.ai listing ("Anik Jain - Co-Founder at Funngro - Mumbai") |
| LinkedIn conflict | funngro.com/about links `linkedin.com/in/anik-jain/` (generic handle; not tied to him by any other source; another Anik Jain — a design-agency founder — exists). **Client should confirm.** LinkedIn pages themselves could not be opened from this environment (login wall). |
| Photo | Not used — only third-party photo found (StartupTalky), no licence | — |

### Founding year — resolved to **2021**
Entrackr (Dec 2022), Inc42 and RocketReach say 2021. Funngro's own "FY22" (Apr 2021–Mar 2022) is consistent; its "started in 2022" line is the outlier. → Moved from Tier C to Tier A.

### Still unresolved
Official founder portraits; Anik Jain's exact title; which LinkedIn URL Funngro considers official for Anik.
