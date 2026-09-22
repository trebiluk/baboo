# Baboo 2.0 — Build plan (upgrade live, do not redo)

**Owner:** Debugzy (plan) → Grok Build (code) · **Assigned:** Flo 2026-09-19  
**Law:** upgrade of live **v1.3.5**, not a rewrite  
**Prove host:** https://baboo.kulibert.net  
**Live baseline (curl 2026-09-19):** routes bundle carries `appVersion` **1.3.5**  
**Default theme stays Stark** (Diego light-sensitive). Dream purple = TechWorks only.

Fold existing briefs — do not invent a second product:
- Tools-ease / UDL: `/workspace/shared/archworks/crew-reports/BABOO-TOOLS-EASE-1.0.10.md`, age-10 study, BabooBot tools-ease special-ed
- Wolf Mode A: `/workspace/shared/archworks/crew-reports/BABOO-1.2.0-WOLF-MODE-BRIEF.md` (Phase A only)
- Ginger: **parked** (`/workspace/shared/ginger/FAMILY-KIT-BABOO-GINGER.md`)
- Curriculum spine: Donna **Matteson** CEA (PLTW Civil Engineering & Architecture) — kid-plain Teaching; shop terms stay English

---

## Goal of 2.0

One classroom Chromebook path where **every** student can draw a plan, switch 3D without getting lost, and learn architecture words — including D/HH, low-vision, ELL (~7 langs), ED, and mixed literacy — **in the defaults**, not as a hidden “special” pack.

Ship in three cuts. Each cut bumps the live chip and is smoke-proven on baboo.kulibert.net before the next starts.

---

## P0 — Tools-ease / UDL / inclusion defaults (first ship)

**What**
1. Fat targets (≥44px), icon-above-label, plain-language tips on by default.
2. High-contrast + big-type toggles reachable in one tap from Help/Settings (persist in local settings).
3. Tip language pack ~**7 langs** (start EN+ES already in orbit; add the classroom set Curriculum names — wire one `tipsLocale` setting; Teaching/Matteson spine stays EN with optional gloss line).
4. D/HH: captions/visual success states for every tool action (no audio-only feedback).
5. Low-vis: focus rings, 4.5:1 body text on Stark, no critical info in color alone.
6. ED / mixed literacy: short steps, undo always visible, calm toasts, no surprise modal stacks.
7. Empty-state CTA stays “Wall → click start → click end” class (tools-ease T1–T10 still true).

**Where (expected)**
- Chrome / Help / Settings / tip strings / Teaching drawer
- `version` chip → **2.0.0** (or **1.4.0** if Diego prefers minor — Flo picks; plan assumes **2.0.0-P0** label in changelog even if semver is 1.4.x)
- Do **not** touch Wolf art, Ginger, or schema unless a tip key needs a settings field (DataBot twin if so)

**How to prove on https://baboo.kulibert.net**
| # | Check | Pass |
|---|--------|------|
| P0.1 | Chip ≥ baseline 1.3.5 and changelog names inclusion cut | chip + Help about |
| P0.2 | New blank plan: wall CTA readable; wall two-click works | draw one room |
| P0.3 | Tools ≥44px; focus-visible ring; Undo always on screen @1366 and @1024 | Chromebook sizes |
| P0.4 | Toggle big-type + high-contrast; plan still editable | both on |
| P0.5 | Switch tip language through full classroom set; no missing keys on Wall/Door/Window | spot-check 3 tools × langs |
| P0.6 | Mute device: every place/miss still shows a visual toast/hint | Door miss + success |
| P0.7 | No “accommodations / ELL / special Help” ghetto UI — same Help for all | Help home |

**FeatureBot fold (P0 storage/touch):** `/workspace/shared/archworks/crew-reports/BABOO-CAP-TOAST-IDB-CONTRACT.md` — fat cap toast *before* mute; IDB dirty = awake tiles only (Chromebook wifi). Do not invent a second storage path.

**Grok Build brief (smallest):** one PR — chrome+tips+settings only; no 3D redesign; no Wolf.

---

## P1 — 3D knobs + preview same screen (no menu scroll trap)

**What**
1. 3D view: height/roof/sky (or current knobs) **and** live preview share one screen — no nested menu that forces scroll to find Apply.
2. Floating panels: **no scroll trap** (away-pass law) — content fits or paginates with big Next, never a skinny overflow menu that eats the plan.
3. 3D stays **view / knobs only** — 2D keeps Wall/Door/Window/Furniture (A2 lock).
4. Customize/Settings preview not clipped (@~390 secondary + @1024 class).

**Where**
- 3D view shell + Customize / Settings panels
- Reuse existing 3D site+sky from 1.0.9+ line — relocate controls, don’t rewrite renderer

**How to prove on https://baboo.kulibert.net**
| # | Check | Pass |
|---|--------|------|
| P1.1 | Enter 3D: knobs visible beside/above preview without scrolling the page | one viewport @1366×800 |
| P1.2 | Change one knob → preview updates without closing a submenu | see change <2s |
| P1.3 | Open Settings/Customize: no scroll inside floating menu; Apply/Close always visible | @1024 and @390 |
| P1.4 | Back to 2D: place tools restored; plan intact | round-trip |
| P1.5 | Chromebook CPU: pan/orbit near a normal class house stays usable | no freeze >2s |

**Grok Build brief:** one PR after P0 live; layout/CSS/panel structure only unless a knob is unbound.

---

## P2 — Wolf Mode A (after Diego GO) · Ginger parked · Matteson spine

**What**
1. **Wolf Mode A only** (opt-in Block/Chunk build feel) — Stark remains default. See Wolf brief: chunk grid, fog sleeping rings, original Baboo blocky art, architecture win loop unchanged.
2. **No** “Minecraft” string on student chrome; **no** Mojang art; **no** `.mcworld` (Phase B parked until counsel/Diego).
3. **Ginger** stays parked — shared bones only, no HS CAD graft.
4. **Matteson CEA spine:** Teaching units keep gable/hip/circulation/kitchen-triangle class terms; chrome tips stay kid-plain; dedication/About stays Donna + Baboo Bichon.

**Where**
- Theme/mode toggle + StyleBot Wolf tokens + Curriculum Wolf words
- Export stays `.archworks.json` / school share (Phase A)

**Gate:** **Diego GO** required before Build starts P2. Until then: docs only.

**How to prove on https://baboo.kulibert.net**
| # | Check | Pass |
|---|--------|------|
| P2.1 | Stark default on fresh load | screenshot |
| P2.2 | Enable Wolf: chunk read + architecture win (closed room+door) still works | play path |
| P2.3 | Grep student UI bundle: no `Minecraft` / Mojang marks | build check |
| P2.4 | Teaching still shows Matteson terms; chrome tips still plain | Teaching open |
| P2.5 | Ginger not linked from student chrome | no HS entry |

**Grok Build brief:** one PR after Diego GO + StyleBot tokens ready; Mode A only.

---

## Sequence (do not reshuffle)

```
live 1.3.5
  → P0 inclusion/tools-ease defaults     → smoke on baboo.kulibert.net → Flo PASS
  → P1 3D knobs+preview same screen      → smoke → Flo PASS
  → (Diego GO) P2 Wolf Mode A            → smoke → Flo PASS
  → Ginger / .mcworld / pets / fancy     → stay parked
```

## Out of scope for 2.0 ladder
- Ginger HS rigor, meltdown-as-default, pets catalog binge
- Wolf Phase B `.mcworld`
- Dream purple as Baboo default
- Full IEP system, fake Submit OAuth
- TechWorks grafts

## Owners
| Lane | Who |
|------|-----|
| This plan / functional accept smoke | Debugzy |
| Implementation | Grok Build (on Flo GO per cut) |
| Visual tokens / Wolf chrome | StyleBot |
| Tip + Matteson Teaching copy | Curriculum |
| Orchestration / Diego GO | Flo |

## READY yell
Path: `/workspace/shared/baboo/crew-reports/BABOO-2.0-BUILD-PLAN.md`  
Prove host: https://baboo.kulibert.net (baseline **v1.3.5**)

*Debugzy · 2026-09-19 · plan only, no code thrash*
