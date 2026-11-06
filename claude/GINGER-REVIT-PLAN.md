# GINGER — the Revit-style homebuilder, built on Baboo (BABOOOOO lane)

Diego, 2026-11-06: "Ginger will be the 'Autodesk Revit' advanced homebuilder based on Baboo." The choices he made are in DECISIONS-DIGEST.md: Baboo engine as a Pro mode; high school / CTE; first wave = levels + elevations, types & properties, schedules + sheets, dimensions & sections.

## Where it lives
- Code: this repo (trebiluk/baboo). Ginger is a second route, `/ginger`, on the same engine: the walls, openings, rooms, furniture, the 3D/dollhouse engine, saves, i18n (10 languages + Simple) and the Chromebook performance work. Kid Baboo stays at `/`.
- One switch, `settings.mode: 'kid' | 'pro'`, gates the Pro panels. Shared fixes reach both apps.
- Version line: Ginger 2.x, with its own chip and changelog (Ginger 2.0.0 = the first Pro build). Baboo stays 2.13.x.
- Old Ginger (apps-kulibert/ginger, 1.0.9) stays live until the new one passes step 9. Its plans import (step 1).

## Rules every step keeps
- 44 px targets with words; keyboard and touch; every language (ti, fa-AF and rw marked UNCHECKED); plan canvas LTR in RTL; no colour-only meaning; reduced motion; Chromebook low/mid floor; draw calls must not rise much; no network models; no PII. The title block says school · class · alias, never a name.
- One branch and one PR per step; the step name goes in the PR title; merge only on Diego's OK by number, and only when green.

## Steps
1. **Ginger shell (G2.0.0).**
   - `/ginger` route with the Ginger name, chip and changelog, and Pro mode on.
   - All tools unlocked. No kid coach, jobs or contests. CTE words (Level, Elevation, Section, Schedule, Sheet, Type, Instance).
   - Import old Ginger JSON (walls, doors, windows, rooms, items, ceiling) into a Baboo doc.
   - Accept: open, draw, save, reload, and import the Studio seed plan from old Ginger.
2. **Levels.**
   - A Levels panel: name, elevation, floor-to-floor height. Add, copy and delete a level; switch levels.
   - Walls take their height from the level by default, and can override it.
   - 3D stacks the levels; the level below shows as a grey underlay.
   - Accept: a 2-storey house drawn and shown in 3D.
3. **Types & properties.**
   - Wall, door and window types (name, thickness or width, height, material; layers later).
   - The Properties panel shows Type and Instance values. Editing a type changes every wall of that type. "Duplicate type".
   - Accept: change "Exterior 2×6" thickness and every exterior wall updates.
4. **Dimensions.**
   - Aligned dimension strings along walls.
   - Temporary dimensions on select; type a value to move the wall.
   - Overall and opening dimensions.
   - Accept: dimension the class Tiny House to the worksheet.
5. **Elevations.**
   - N / S / E / W exterior elevations as clean orthographic line views from the 3D model, with level lines and heights.
   - Accept: four elevations of a 2-storey house, printable.
6. **Sections.**
   - A section-line tool on the plan; the cut view shows walls, floors, roof and level lines.
   - Accept: one cut through the house that shows both levels.
7. **Schedules.**
   - Room, door and window schedules with marks (D1, W1, R1), live with the model. Sort and filter.
   - CSV export.
   - Accept: rename a room and its schedule row changes.
8. **Sheets.**
   - A sheet with a title block (school · class · alias · date · scale).
   - Place plan, elevation, section and schedule views at 1/4" = 1'-0"; print to PDF.
   - Accept: a one-sheet PDF from a Chromebook.
9. **Hub switch** (needs the Hub lane).
   - The Hub's Ginger tile points to the new `/ginger`; old Ginger moves to `/ginger-classic` for a term.
   - Accept: Diego OKs the switch.

## Open for Diego (not blocking step 1)
- Final URL: baboo.kulibert.net/ginger, or apps.kulibert.net/ginger rewritten to it (step 9).
- Units: feet-inches only, or metric too, for CTE.
