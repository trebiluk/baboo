# Baboo changelog

App version matches `src/studio/version.ts` (`APP_VERSION`). Newest first.
In-app notes live in `src/studio/data/changelog.ts`. Student product = **Baboo**; files stay `.archworks.json`.

## 2.1.1 — 2026-09-19 — ooh fancy Edge Pocket chrome
- One thin Chromebook top row: Baboo + version · plan name · Saved · Beginner · Undo/Redo · viewport · Save · Teach · Help. Labels never stack or overlap at 1280 or 1366
- Fat left Edge Pocket: Select · Sketch · Wall · Door (≥44px), icon + word, Stark white+blue. Wall docks a flyout — Thickness 120/200/300mm, Height 2.4/2.7/3.0m, style tiles, “Click grid to start, drag to draw.”
- Open pocket sits above the plan card. Furn/Plant rows are not clipped; the title block moves clear. No right Enseñar ribbon. 2.1.0 snaps / exact / nudge stay

## 2.1.0 — 2026-09-19 — Drafting precision
- Walls latch onto what is already drawn: corner, middle, crossing, square-off, along-wall. Each snap draws its own outline shape and its own word, so it reads without colour
- Dashed line-up guides pull the cursor onto the x or y of a corner across the room, without breaking a 90°/45° lock
- While a wall is in progress, Length and Angle boxes track the cursor until you type in one. They are real inputs, so a tap works as well as a keystroke
- The wall ghost reads out length and a real angle in degrees instead of a bare `· 45°`
- Arrow keys move the selection one grid square, Shift for one inch; a burst undoes as a single move
- The middle handle on a selected wall slides the whole wall — it was drawn but did nothing
- Snap to walls is a setting beside grid snap and straight walls, on by default
- Measurements never read upside down — labels fold to read left-to-right or bottom-to-top and stay on the outside of the room
- Wallpaper and floor swatch names sit on a solid band, so pale textures no longer hide their own label
- The title strip no longer paints over Undo / Redo when the window is narrow

## 2.0.1 — 2026-09-19 — P0.1 Edge Pocket (kill right Enseñar ribbon)
- Right Teach/Enseñar ribbon is gone — no leftover gutter. Teach and Help sit on the top row with Save
- Left Edge Pocket: Select · Sketch · Wall · Door · More as overlay chips. Tap opens the flyout; hover also opens when a pointer exists. Right-click / long-press (~500ms) empty canvas opens the same Tools pocket
- Menus overlay. Plan canvas fills remaining `100dvh` / `100svh` + safe-area. Stark white+blue stays the classroom default
- Fat taps stay ≥44px with icon + word. EN/ES and the rest of the tip pack still work

## 2.0.0 — 2026-09-19 — P0 inclusion / tools-ease UDL defaults
- Same Help for every student: bigger type, high contrast, and tip language sit at the top of Help and Settings
- High contrast stays on Stark white + blue — darker words, thicker lines, stronger focus rings
- Tip language pack (EN · ES · Cubano · UK · RU · TI · FA) via one `tipsLocale` setting. Teach / Matteson words stay English with a gloss line
- Fat taps (≥44px), icon above the label, Undo always on the bar
- Every place or miss shows a calm visual toast (Done / Try again / Full) — works with the sound off
- Cap toast before a stamp: rooms 12 · walls 40 · objects 60. Autosave writes dirty awake tiles only

## 1.3.5 — 2026-09-17
- Selected walls show squares on the ends — drag them to stretch, drag the middle to slide
- The right panel edits size, paint, and place for whatever you tap

## 1.3.4 — 2026-09-17
- Dollhouse 3/4 view opens the near walls so beds and toilets stay inside the room
- Furniture shows only the sides you should see — no stacked bowls or through-the-wall frames

## 1.3.3 — 2026-09-17
- Closed rooms meet clean at the corners — walls no longer blob or stack
- 3D shows the real floor inside each room, not a rectangle around the house
- More paints, wallpapers, yard looks, and furniture colors in Settings and the edit panel

## 1.3.2 — 2026-09-17
- Trace reads a wiggly pencil outline as straight walls — a wandering house still hard-lines

## 1.3.1 — 2026-09-16
- Tools, catalogs, Settings, Teach, and the edit panel dock to the sides and collapse — the grid stays open
- Busy houses stay snappy: extra furniture detail drops while you spin 3D or zoom the plan out

## 1.3.0 — 2026-09-16
- Furniture is modeled, not boxed: round tables, burner rings, toilet bowls, tubs, drums, legs
- Flooring: walnut, herringbone, slate, terracotta. Rotate the grain. 3D shows the pattern
- Catalog shows the object. Tap a room for its own floor, or House to follow the default

## 1.2.0 — 2026-09-16
- Furniture reads as the thing: beds with pillows, sofas with arms, stove burners, toilet and tub
- Flooring: oak, maple, tile, hex, carpet, linoleum, concrete, checker — house default plus per-room
- Same shapes in Plan, Dollhouse, and 3D. Tap a named room to change its floor

## 1.1.7 — 2026-09-16
- Dollhouse turns: Front, Right, Rear, Left — same house, new face
- Drawing views to teach: Isometric, Oblique (cabinet), Elevation, Orthographic + Top (a plan)
- Axis gizmo shows which lines are true size. Paper walls in elevation like a real sheet

## 1.1.6 — 2026-09-13
- Full 3D: drag to orbit the house, scroll to zoom, Shift-drag to pan. Still view-only
- Materials and Lighting are on — grass/shingles, sun, shade, dusk window glow
- Walkthrough: eye-height look inside. Same plan as 2D. Edit stays in Plan or Dollhouse

## 1.1.5 — 2026-09-13
- Architect sheet: title block, north arrow, and a 0–5–10 scale bar on the plan
- Overall width and depth ticks sit outside the envelope once walls close
- Teach → Read this plan: envelope, entry, daylight, named rooms, size, kitchen work triangle (classroom, not a stamp)

## 1.1.4 — 2026-09-13
- Teach English words (grades 5–8 ELL): Wall, Door, Sketch sit in English on the tools; home language sits under
- Teach → Vocab shows Say: Wall plus a simple English meaning. Tap-to-match practice, no timer
- Settings → Help for everyone: turn the English-first teaching on or off

## 1.1.3 — 2026-09-13
- Vocab pack: Ukrainian, Russian, Tigrigna, Cubano, and Farsi — Settings chips, Teach list, tools and tips
- Every language keeps the English CAD word in parentheses (Стіна (Wall) · دیوار (Wall))
- Farsi text reads right-to-left in drawers and tips. The plan grid stays left-to-right

## 1.1.2 — 2026-09-13
- Language: Settings → English or Español. Spanish keeps the English CAD word in parentheses (muro (Wall))
- Help for everyone: bigger 52px taps, bigger type on tips and Teach, slower toasts
- Empty-plan wall tip, bilingual coach, tools, Contest titles, and vocab for ELL + special-ed

## 1.1.1 — 2026-09-13
- Solid 3D: Day sky + grass yard by default. Doors and windows cut through the walls. Furniture shows as boxes
- Settings → 3D look: Sky (Day / Soft dusk / Overcast), Yard (Grass / Gravel / Pad), wall colors, Show furniture in 3D
- Blocky theme: chunky cubes, grass and dirt — Minecraft-inspired look for chrome, tools, Dollhouse, and 3D
- Keeps Dollhouse (roof-off wallpaper) and the side edit panel from 1.0.39. 3D stays view-only

## 1.0.39 — 2026-09-13
- Edit panel docks on the side — collapse it to a chip when you need the grid
- Dollhouse: roof-off isometric view. Tap a wall to paper it in 2D

## 1.0.38 — 2026-09-13
- New plan cards sit even, Contest is a quiet chip, and Close lives in the header
- Phones keep one version pill on the grid — the top bar stays icons. Drawers get a grab bar

## 1.0.37 — 2026-09-09
- Floating version chip on phones — tap for what’s new, hold for Teacher. Follow it even when the top bar is icons-only
- Access and Teach sheets sit on top of the tool rails, so landscape phones can still read the list

## 1.0.36 — 2026-09-09
- Tools fast: Sketch, Wall, and Door stay on the left — one tap, no extra open
- More opens the rest. Trace stays after a sketch. Clip sits with Wall. Grey tools wait for the next skill

## 1.0.35 — 2026-09-09
- Phone and tablet: the top bar no longer piles on itself — icons for undo, 2D/3D, and save, with More for the rest
- Tools and Teach stay as side chips. Drawers slide up from the bottom on a phone

## 1.0.34 — 2026-09-09
- Best Dog House Contest: New → Dog House, then Contest — Baboo scores the den from the textbook list
- She wants a snug closed box, a 12–18" door off-center, a pitched roof, and a shade tree — not a people bedroom

## 1.0.33 — 2026-09-09
- Sketch is the first tool: drag like a pencil on the plan — architecture starts here
- Tap a sketch → Trace to turn it into straight walls. The pencil line stays as an underlay
