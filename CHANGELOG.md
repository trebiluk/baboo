# Baboo changelog

App version matches `src/studio/version.ts` (`APP_VERSION`). Newest first.
In-app notes live in `src/studio/data/changelog.ts`. Student product = **Baboo**; files stay `.archworks.json`.

## 2.13.87 — 2026-11-06 — Sketch: closed shapes trace themselves; the tracer tries harder
- Sketch a closed shape and it turns into walls by itself (Undo keeps it a sketch). Tracing is smarter about wobbly, crooked or not-quite-closed drawings.
- Diego: Sketch & Trace should auto-trace a closed shape, and it didn't try very hard. New closed-shape fitter: finds the loop (trims running past the start, bridges a small gap), starts at a real corner, fits one straight line per side (0/45/90, snapped to the grid), drops rounded corners and the closing gap, meets the lines at clean corners. Same 160-drawing sweep: old tracer 94/160 right (81 extra shaky), new 160/160 (157); 0/80 open strokes or scribbles auto-traced. Open strokes keep the old tracer. Hints and the new toast in every language; ti, fa-AF and rw UNCHECKED.

## 2.13.86 — 2026-11-06 — Height off the floor for furniture (stack things)
- Every piece of furniture has a Height off floor setting: put the microwave on a counter or a shelf, a TV on a desk, or a loft bed over a desk.
- Diego: the microwave, and anything that can sit above or below another item, needs an elevation. The item panel shows Height off floor (where the piece's lowest part sits) with On the floor / On a counter buttons; plan, dollhouse and 3D all lift the piece; higher pieces draw on top in the plan; anything lifted above the door head no longer counts as in the door's swing. Saved as an optional elev (feet), capped 0–20 ft; bad values are dropped on load. Strings in every language; ti, fa-AF and rw UNCHECKED.

## 2.13.85 — 2026-11-06 — Worksheet items: bathroom sink, mirror, counter, microwave, TV or computer
- New furniture from the class worksheet: bathroom sink, mirror, counter, microwave, and TV or computer.
- The class Tiny House worksheet checklist had 5 items Baboo did not: each now has a plan picture, a 3D shape and a name in every language (ti, fa-AF and rw UNCHECKED). The mirror hangs on the wall and the microwave sits at counter height, so neither counts as in a door's way.

## 2.13.84 — 2026-11-06 — Windows and furniture at every help level
- Windows and furniture work at every help level, even Novice. The tips stay simple.
- Diego: the item libraries are for everyone; keep the directions simple. Window and Furniture tools now unlock at Novice (were Beginner and Moderate). Plants unchanged (parked). Level help text updated in every language; ti, fa-AF and rw UNCHECKED. Found by the class Tiny House sweep: the worksheet needs 2 windows and furniture, which a Novice kid could not add.

## 2.13.83 — 2026-11-05 — the class tiny house
- New plan has an empty Tiny House, 14 ft by 7 ft with 7 ft walls, the same size as the class worksheet. Contests and the Mansion now have their own section.
- Sized from the "Rough Draft: Blueprints" worksheet net (floor 7 × 14 squares, walls 7 squares tall; 1 square = 1 ft assumed — the sheet prints no scale). No door, windows, furniture, yard or roof: kids add the checklist. The Tiny Home contest, Dog House and the Mansion moved under "Contests and the Mansion". Strings in every language; ti, fa-AF and rw UNCHECKED.

## 2.13.82 — 2026-11-05 — Tigrinya menu: two different words
- In Tigrinya, the menu no longer shows the same word for "What's new" and "New plan".
- The phone menu listed "ሓድሽ" twice: What's new (chrome.whatsNew) and New (chrome.new). New now reads "ሓድሽ ትልሚ" (new plan). Tigrinya is UNCHECKED native copy. Found by dumping the phone menu per language on the live site.

## 2.13.81 — 2026-11-05 — photo bar on one line
- In Arabic and Dari, the photo bar buttons on a phone stay on one line instead of breaking into three.
- The Snap / Postcard / Done buttons wrapped ("بطاقة بريدية" became three lines, 74 px tall, buttons of three heights). They are nowrap now and all 44 px. Checker: rb/photobar.mjs (Photo bar on a phone per language).

## 2.13.80 — 2026-11-05 — Class section and the postcard caption
- A new Class section in Settings: school, class or period, and a nickname you choose. They go on your postcard — Baboo never asks for your real name.
- Diego's decision (2026-11-05): the postcard caption may carry the school name and the class or period, and a nickname only if the kid chose one — never a kid's name. Settings gains a Class section (three 44 px text boxes, 40 chars each, trimmed on load); the postcard prints school · class · nickname under the plan name; the class-card alias box starts from the chosen nickname. Nothing new is exported in the class card file.

## 2.13.79 — 2026-11-05 — Settings boxes 44 px
- Every box in Settings is tall enough to tap (44 px), including the grid size and the roof name.
- The Settings drawer's number boxes, pickers (units, drawing method, roof) and the roof-name box were 40 px tall (27 px for the roof name) — under the 44 px tap rule. Checker: rb/settings.mjs (Settings per language on a phone: direction, overflow, targets under 44 px, English-looking words).

## 2.13.78 — 2026-11-05 — hint steps aside
- On a phone, the hint line at the bottom steps aside while a message shows, instead of peeking out from behind it.
- Same move as the plan sheet in 2.13.68: on screens ≤ 1100 px the canvas hint fades while a toast is up. Landscape phone (882×411) scanned in 8 languages: no clipped or off-screen buttons.

## 2.13.77 — 2026-11-05 — Export on screen on phones
- On a phone in Ukrainian, the Export button sits fully on the screen again.
- The phone view row (views · version chip · saved tick · Export) overflowed by 5 px in Ukrainian ("v2.13.76 · Що нового"); the version chip now gives way (shrinks with …) and Export never does. Checker: rb/phonetrunc.mjs (clipped/off-screen buttons per language on a 411 px phone).

## 2.13.76 — 2026-11-05 — bar words wrap
- Long words on the top bar, like Casa de muñecas or Igenamiterere, wrap to two lines instead of being cut off with "…".
- Desktop bar tiles were a fixed 68 px with nowrap+ellipsis labels: Spanish, Ukrainian, Russian and Kinyarwanda words were truncated (Casa de muñ…, Кукольный д…, Igenamite…). Tiles now size 68–88 px and labels wrap to two lines. Checkers: rb/trunc.mjs (clipped labels per language) and rb/barfit.mjs (bar fits at 1366/1100/1000/915, no overflow, no clipped two-liners).

## 2.13.75 — 2026-11-05 — Teach panel roof line
- The Teach panel says "No roof" in your language when a plan has no roof.
- Every word in the Teach panel's word list has an Arabic and Kinyarwanda meaning now, not just eight of them. (rw UNCHECKED native copy.)
- Same family as 2.13.74: the Teach panel fell back to the English "None" for a plan without a roof. Postcard (ar, Dollhouse) and photo-in-the-walk checks re-run after the roof-name change: clean, note reads date · style · translated roof.

## 2.13.74 — 2026-11-04 — Blank card roof line
- The Blank card in New plan says "Roof: No roof" again instead of a blank space.
- 2.13.72 switched the New plan cards to translated roof names; a template with no roof (Blank) then printed "Roof:" and nothing. It reads "Roof: No roof" in every language now. Checker: rb/newplan.mjs (New plan on a phone, ar/fa-AF: dir, overflow, 44 px targets).

## 2.13.73 — 2026-11-04 — What's new and wallpaper names in your language
- What's new reads fully in your language, and wallpaper names like Linen and Subway tile do too.
- Five What's new bullets since 2.13.48 (2.13.49 ×2, 2.13.50, 2.13.51, 2.13.67) had no translation key and showed in English in every locale; keys added and a test now pins every bullet from 2.13.48 on. The stored English wallpaper name (textureLabel) showed in Settings' summary, the class card and the wallpaper toast; texShown() translates it, a typed name still wins.

## 2.13.72 — 2026-11-04 — roof names in your language
- Roof names like Gable, Shed and Grass read in your language now — on the plan chip, in Settings, on the sheet and on the postcard.
- The eight roof style names were English in every locale (roof chip menu, Settings picker, plan sheet, Teach panel, New plan cards, class card, postcard note, toasts). New roof.name.* keys with roofWord()/roofShown() in i18n; a roof name the student typed still wins. 'Imported image' wallpaper label translated too.

## 2.13.71 — 2026-11-04 — wall chip off the job card
- On a phone, the wall chip no longer sits on top of the job card words.
- With the Wall tool on a phone, the folded wall chip (Wall · 8" · 8'-10") rendered over the job card's text. When a job card is up, the chip now sits at the foot of the tool rail. Checker: rb/flyout.mjs. Drawing on phone (en, ar) and desktop (ar) re-verified; Dollhouse hides roofs by design.

## 2.13.70 — 2026-11-04 — shed and gambrel roofs
- Shed and Gambrel roofs look right in 3D now: one clean slope, and a barn roof with its bend.
- 3D View pushed both through the gable builder: Shed (sideways ridge) came out as a twisted cross, Gambrel lost its break and drew as a plain gable. Each has its own builder now, with boarded ends so the roof sits on the walls. Checker: rb/roofs.mjs (picks each roof on the Ranch and shoots 3D).

## 2.13.69 — 2026-11-04 — turf mound and a clean horizon
- The Hobbit house wears a soft turf mound in 3D, and the ground no longer ends in a pale shape in the sky on phones.
- 3D View drew the Grass/sod roof as a flat green polygon; it is now a rounded mound (three rings stepping in and up to a cap). On tall phones the camera sits far back and the 240 ft ground disc ended inside the view; the ground now runs to 640 ft, past the fog, and the camera far plane moved to 900 so nothing clips.

## 2.13.68 — 2026-11-04 — a real cone roof
- The Yurt's cone roof is a real cone in 3D now, and a toast no longer covers the plan card on a phone.
- 3D View drew the Conical roof as a flat disc (the fallback for any roof without ridges). It now fans slate triangles from each eave edge to the peak with a small crown ring. On phones the plan sheet steps aside while a toast shows; they overlapped at the bottom edge.

## 2.13.67 — 2026-11-04 — class card in your language
- The class card preview in Help now reads in your language.
- Every label, hint, field and note on the class card (and its Help toggle) goes through i18n; the dog-house ribbon uses the contest words. ti, fa-AF, rw unchecked native copy.
- The card's words spilled 100px out of the Help panel (Style/Roof/Wallpaper values were off-screen). The card now stacks in Help and its body can't push past its edge.

## 2.13.66 — 2026-11-04 — every message in your language
- Every message now reads in your language: the crash screen, the roof and wallpaper notes, and the catalog button tip.
- The crash screen, the roof/wallpaper toasts and the catalog button tip were still English-only in the student view. All go through i18n now (ti, fa-AF, rw unchecked native copy).

## 2.13.65 — 2026-11-04 — 3D on phones
- 3D on phones: the whole house fits a tall screen, and the buttons stay out of the way on a phone turned sideways.
- The 3D camera now steps back until the house's footprint fits the screen's real field of view (the Mansion lost both ends on a tall phone). On a short screen the 3D bar drops its hint and shrinks its buttons; it covered most of the Hobbit house.

## 2.13.64 — 2026-11-04 — Phone menu name
- On phones, the plan name box in the menu says “Untitled plan” in your language too. (The laptop name box was fixed in 2.13.55; the phone menu's copy still said “Untitled Plan”.)
- Looked over on an Arabic phone: the Teach panel, What's new and the New plan window read right-to-left with no sideways scroll.

## 2.13.63 — 2026-11-04 — Templates pass
- Every house template now passes the Access check: the Tiny Home has a 3'-0" front door, and nothing sits in a door swing.
- Tiny Home: 3'-0" front door in the middle of the long wall; fridge, stove and sink in one run along the left wall.
- Arts & Crafts: bed and nightstand moved out of the bedroom door swing. Mansion: stair-hall door opens into the hall; the banister is now the stair rail beside the steps.
- Access check: wall and ceiling fixtures (sconces, paintings, chandeliers, paneling) and rugs no longer count as blocking a door; openings 6 ft or wider (porches) are not swinging doors.
- Bug: the kitchen-aisle check read furniture rotation as degrees (it is radians), so turned pieces were measured unturned.

## 2.13.62 — 2026-11-04 — Photo in the walk
- Photo mode works in the Walkthrough too, and template room names like Parlor and Porch show in your language. Pinch-zoom keeps working while you frame a shot on a phone; a stray touch no longer throws.
- Checked by a test that snaps real pictures in 3D, Walkthrough and Dollhouse on laptop and phone sizes.

## 2.13.61 — 2026-11-04 — Postcard
- Postcard: in 3D or the Dollhouse, tap Photo then Postcard for your house on a cream card with its name, the date, style and roof. Cards are always 1200×900 so a class board lines up; a footer says “Made with Baboo · v…”. Right-to-left languages mirror the captions.
- Photo mode now works in the Dollhouse too (Photo button in its toolbar).

## 2.13.60 — 2026-11-04 — Photo mode
- Photo mode in 3D: tap Photo, frame the house, Snap — a sharp picture to share or save. Every panel hides while you frame; Snap draws the view at 2× and hands it to the phone's share sheet, or downloads “Plan name date.png”. Done or Escape brings the panels back. Nothing leaves the device unless you share it.
- Postcard (captions, Dollhouse) comes next.

## 2.13.59 — 2026-11-04 — New York code
- Baboo's Access check and “Read this plan” follow the 2025 Residential Code of New York State (in force since December 31, 2025; based on the 2024 IRC).
- Rooms people live in (bedroom, living, dining, office) need at least 70 sq ft and 7 ft each way; kitchens, baths and halls are not counted.
- Front door: one door on an outside wall with 32" clear — a 3'-0" door. Inside doors have no minimum, so 2'-6" inside doors no longer “need a fix”.
- Bath turning circle (5') and kitchen aisle (40") are accessibility guidelines for wheelchair homes: they now say “Take a look”, not “Needs a fix”.
- New York City has its own code; the drawer says so.

## 2.13.58 — 2026-11-04 — Right-to-left sizes
- In Arabic and Dari, a size filled into a sentence (1'-0", 2'-6", 80) was reordered by the right-to-left text, so 1'-0" showed as "0-'1 with the inch mark at the far end. Filled-in values now sit in a Unicode isolate and keep their order (sheet, Access, Contest, Teach, toasts, screen-reader summary).
- The plan sheet date is in your language (it said “Nov 4, 2026” in Arabic).
- The version chip tip (“long-press for Teacher”) is translated.

## 2.13.57 — 2026-11-04 — Fit in view
- Fit centers the plan in the space you can see, not under the job card or the tool rail. On a phone turned sideways the top of a template sat under the job card.

## 2.13.56 — 2026-11-04 — Readable tags
- Dollhouse room names sit on a soft rounded tag. Before, “Kitchen” was drawn on top of the fridge and “Bedroom” on the bed head.
- Phone turned sideways (short screen): the “Draw a 16 by 24 box” job card stays one row, so it covers about a third less of the plan.

## 2.13.55 — 2026-11-04 — Plan names
- Saving a plan named in Arabic, Russian, Dari or Tigrinya downloaded “project.archworks.json”: every letter outside A–Z was dropped. File names now keep letters from every language (class cards too).
- A new plan's name box shows “Untitled plan” in your language as a hint; typing replaces it. The plan sheet and the saved card say it in your language too.
- The “Class share” chip is translated.

## 2.13.54 — 2026-11-04 — Wall units
- Wall options on a feet plan read 5" · 8" · 12" thick and 7'-10" · 8'-10" · 9'-10" tall (they said mm and m while the plan said feet). Metric plans keep mm and m. The sizes underneath are unchanged.
- Room areas say sq ft in your language on the plan, in panels and in the screen-reader summary.
- On phones the wall options fold to one line, so they no longer cover a quarter of the grid.
- The wall options tip said "drag to draw", which draws nothing. It now says to click each corner, like the Wall tool's own tip.

## 2.13.53 — 2026-11-04 — Challenge words
- Teach panel challenges and their scoring lines are in your language.
- A test keeps every English lesson key equal to the lesson text in teaching.ts.

## 2.13.52 — 2026-11-04 — Teach panel words
- The Teach panel’s plan reading, unit steps and reflections are in your language.
- The “Read this plan” checks name rooms and kitchen pieces in your language. Challenges are still English.

## 2.13.51 — 2026-11-04 — Dog House words
- Baboo’s Dog House contest and the Teach panel labels are in your language.
- With extra doors on a dog house, Baboo blames the extra doors instead of calling a good door too tight.
- Teach panel: floor area, roof, style term, named rooms and the storage checklist are translated. Reflection prompts and unit steps are still English.

## 2.13.50 — 2026-11-04 — Access check words
- The Access check is in your language, with room and furniture names translated too.
- The headline, the check titles, the details, the tips and the ADA note all come from the translation table.
- The kitchen aisle check measures the floor between counters that face each other. A sink and stove side by side on one counter no longer fail (the Ranch failed its own check).
- Template furniture nicknames (Sink, Ice box, WC…) show the translated name outside English.

## 2.13.49 — 2026-11-04 — Sturdier
- Plan files with broken pieces now open safely: Baboo leaves out the broken parts and tells you how many.
- If 3D cannot start on a computer (no WebGL, graphics dropped, or the 3D download failed), the rest of Baboo keeps working and offers the Dollhouse, 2D, or Try 3D again.
- Escape closes every window and drawer.
- A file that is not a Baboo plan says so and leaves your plan alone.

## 2.13.48 — 2026-11-04 — Tips and labels
- Hover tips on the tools, save messages, and screen-reader labels are in your language.
- The saved-on-Chromebook card and the Mansion-ready message are translated.

## 2.13.47 — 2026-11-03 — Settings words
- Settings is fully in your language: layers, roof, wallpaper, the look themes, and the corner-clip and wallpaper messages.
- Roof style names (Gable, Hip, Mansard…) stay as the terms students learn.

## 2.13.46 — 2026-11-03 — One room, one name
- One name per room: using the Room tool inside a named room changes its type, and tool tips are in your language.
- The Wall tip describes corner-to-corner drawing; room messages are translated.

## 2.13.45 — 2026-11-03 — New plan on phones
- On phones the New plan screen shows the houses first, house descriptions are in your language, and Settings has bigger tick boxes.

## 2.13.44 — 2026-11-03 — Join walls
- Walls join up as you draw: keep clicking corners and the room closes when you click the first corner again.
- Esc or a second tap on the last corner stops; a room's starter name shows in your language in its panel.

## 2.13.43 — 2026-11-03 — More rooms
- Arts & Crafts, Victorian and Tudor now have real rooms too: bedrooms, kitchens, a parlor with a fireplace, and windows on every side.

## 2.13.42 — 2026-11-03 — Real rooms
- Starter houses have real rooms: the Ranch gets a kitchen, bath and bedroom, every room shows its own size, and more windows.
- Greek Revival gets a centre hall between a parlor and a dining room; Cape Cod gets a bedroom and a bath; Colonial's front door no longer sits on its centre wall.

## 2.13.41 — 2026-11-03 — House looks
- Every starter house has its own outside: brick Colonial, sage Arts & Crafts, white Greek Revival, stone Hobbit, and more.

## 2.13.40 — 2026-11-02 — Screen readers
- Screen readers can hear the plan: each room and its size, plus how many walls, doors and windows there are.
- The plan can be reached with Tab and shows a clear focus ring.

## 2.13.39 — 2026-11-02 — One font
- One clean font across the top bar, and the tool list button that hides the names now says Fold.

## 2.13.38 — 2026-11-02 — Clear sizes
- Wall sizes slide along the wall to a clear spot, so they never sit on a door or a room name.

## 2.13.37 — 2026-11-02 — Sizes on top
- Wall sizes on the plan stay on top of flower beds and paths, with a soft halo so they are easy to read.

## 2.13.36 — 2026-11-02 — Lighter walk
- Walking through the house is lighter work for the computer: faraway rooms’ furniture waits until you get close.
- Walkthrough draws 43% fewer pieces in the Mansion (221 → 127).

## 2.13.35 — 2026-11-02 — Speed readout
- Teachers can see how fast 3D runs: hold the version chip for Teacher, then open 3D to see frames a second.

## 2.13.34 — 2026-11-02 — Furniture
- Nicer 3D furniture (tufted sofa, real beds, a pedestal dining table), and the Mansion's chairs face the table.

## 2.13.33 — 2026-11-02 — Soft shade
- On phones and Chromebooks, rooms get soft shade where walls meet the floor and ceiling, so they look deep, not flat.

## 2.13.32 — 2026-11-02 — Glass
- Windows look like glass in 3D: a soft sky in the panes and light streaks, even up in the roof windows.

## 2.13.31 — 2026-11-02 — Crown
- Rooms get crown molding at the ceiling, and the Mansion's lampposts stand outside instead of in the parlor.

## 2.13.30 — 2026-11-02 — Lamps
- Wall lamps and floor lamps look real in 3D: brass arms, little shades and a warm glow.

## 2.13.29 — 2026-11-02 — Fixtures
- Inside the 3D house: a real brass chandelier with shades, and panelled doors with knobs that open back out of the way.

## 2.13.28 — 2026-11-02 — Roof tag
- The plan is less crowded: the roof is named on the plan card, not on top of the flower beds.

## 2.13.27 — 2026-11-01 — Tidy
- Wall sizes sit neatly outside the house, room paint can be undone, and the item panel folds away in 3D.
- Overall sizes keep one line (35'-10") and sit past the wall sizes; picking a room shows it from above in 3D without the outside wall in the way.

## 2.13.26 — 2026-11-01 — Touch 3D
- On phones, 3D shows the whole house, pinch zooms and spreading two fingers walks you in; the buttons take less room.
- The walk button that leaves the walkthrough now says Step outside; touch screens get touch hints.

## 2.13.25 — 2026-11-01 — Polish
- Cleaner screens: even color grids, 3D buttons that keep their words, and nothing hiding under the tool list.
- Tapping a room's name picks the room; wall panels show each side first and fold the Dollhouse wallpaper away; the header keeps the version chip whole on mid-size laptops.

## 2.13.24 — 2026-11-01 — Finishes
- Paint each room and each side of each wall: brick, siding, stone or wood outside, and a ground for the porch.
- Phones: 2D Plan, Dollhouse and 3D View sit in the top row; the version chip no longer covers the piece count or the 3D buttons; Dollhouse room names are not cut off.

## 2.13.23 — 2026-11-01 — Frames
- Room names stay whole, doorways get painted frames, and things you pick in 2D show from above in 3D.

## 2.13.22 — 2026-11-01 — Inside 3D
- Walk inside: painted walls, white trim, bright ceilings, glowing lamps and real furniture models.

## 2.13.21 — 2026-11-01 — Modes
- 3D remembers where you were, arrow keys walk and turn, Front and Top views, and each level shows what it gives you.

## 2.13.20 — 2026-11-01 — Grand Mansion
- The Mansion looks grand in 3D: an open porch with columns, dormer windows, chimneys, shutters and stone trim.

## 2.13.19 — 2026-11-01 — 2D tools
- Notes take your typing right away, tool panels are in your language, and room names move off furniture.

## 2.13.18 — 2026-11-01 — Richer 3D
- 3D View looks richer: a sunny sky, real floors, brick you can feel, and glowing lamps.

## 2.13.17 — 2026-11-01 — Furniture list
- Furniture names are in your language, and the desk, table, toilet and fireplace look right.

## 2.13.16 — 2026-11-01 — Dollhouse and 3D fixes
- Dollhouse and 3D View are fixed: whole roofs, paths on the grass, no extra floors.

## 2.13.15 — 2026-11-01 — More languages
- More words are now in Arabic, Kinyarwanda and Tigrinya.

## 2.13.14 — 2026-10-15 — Save status
- You can now see if your work is saved, next to Export.

## 2.13.13 — 2026-10-03 — 3D viewer update
- The 3D viewer is updated. 3D View and the 3D peek look the same.

## 2.13.12 — 2026-10-02 — Drawing engine update
- The plan drawing engine is updated. Drawing, moving and deleting walls work the same.

## 2.13.11 — 2026-10-02 — Own 3D decoders
- 3D models no longer need outside sites, so they open on school wifi.

## 2.13.10 — 2026-10-02 — Menu Close
- The Menu starts under the top bar, so Close is easy to tap.

## 2.13.9 — 2026-10-02 — One Menu
- One Menu button, at the top left. Nothing covers Select.

## 2.13.8 — 2026-10-02 — Bottom edge
- Nothing is cut off at the bottom of the screen.

## 2.13.7 — 2026-10-02 — 3D View, More menu, Ink
- 3D View and Dollhouse open every time. More shows whole words. Ink is easy to read.

## 2.13.6 — 2026-10-02 — Safety update
- Safety update to the app engine.

## 2.13.5 — 2026-10-02 — Left menu
- Baboo follows your Hub language. Settings and the menu open on the left.

## 2.13.4 — 2026-10-02 — Hub languages
- Baboo follows the Hub language. Arabic and Kinyarwanda added. Farsi is now Dari.

## 2.13.3 — 2026-10-01 — Phone job
- On a phone the job sentence sits beside the tools, not under them

## 2.13.2 — 2026-10-01 — Tech Room job
- The first job sits at the top: draw a 16 by 24 box and put a door on the long wall
- A passing job saves 3 stars to the Tech Room

## 2.13.1 — 2026-09-29 — Close the upstairs
- The upstairs floor is solid, with a hole only at the stair
- The roof has a finished underside, so it no longer reads as a white wing

## 2.13.0 — 2026-09-29 — Second floor
- The Mansion has a second floor. The porch stays one story, with its own roof
- Upstairs windows replace the flat dormer squares. The stair runs up to the new floor

## 2.12.2 — 2026-09-29 — Walk through doors
- Walkthrough goes through doors. A wall still stops you. A doorway does not

## 2.12.1 — 2026-09-29 — Roof and grounds
- The roof lid sits on the shingles. Look straight down and the roof steps aside
- Grass fades into the sky. Hedges are one trim, not a row of balls. Room names stay on one line

## 2.12.0 — 2026-09-28 — Overall polish
- The 3D view has a sky, window frames, and rounded hedges
- Furniture sits on a soft shadow. The view controls are one quiet bar

## 2.11.1 — 2026-09-27 — Engine tuned
- The 3D engine stays up when you walk in. Shadows cover the house, not the whole field
- Brick, floors, and the roof pick up a light texture. A small screen draws fewer pixels

## 2.11.0 — 2026-09-27 — WebGL engine
- The cube and the walk are a real WebGL engine: lights, shadows, and walls with holes
- Drag to orbit. Walk in stops at walls. The plan and the dollhouse stay the same

## 2.10.1 — 2026-09-27 — Roof that reads
- Mansard roof is steep sides, a flat cap, and two dormers — not one dark pyramid
- Brick walls use a masonry pattern in 3D. Chandeliers are thinner. Walk buttons sit lower

## 2.10.0 — 2026-09-27 — Bay and brick
- The Mansion is brick, with a parlor bay, a window seat, and four porch columns
- A portrait hangs over the fireplace. Brick walls read in the plan, dollhouse, and 3D

## 2.9.1 — 2026-09-27 — Mansion polish
- The Mansion keeps its furniture detail instead of flat stamps
- Hedges, lampposts, and stairs read as objects. The grounds stay in the dollhouse view

## 2.9.0 — 2026-09-27 — The Mansion
- The Mansion: parlor, hall, stairs, dining, kitchen, bath, library, and grounds
- New pieces: fireplace, rug, stairs, banister, lamps, sconces, chandelier, paneling, hedges, lampposts
- More menu → The Mansion

## 2.8.1 — 2026-09-27 — Day one, checked
- Until the walls close, the rail is Sketch, Wall, and Door even on Beginner
- Show me only draws when the plan is empty. Save waits until the write finishes

## 2.8.0 — 2026-09-27 — Day one
- Day one is the grid, Sketch, Wall, and Door, plus one job
- Show me draws a 16 by 24 box. Save stays on screen until you tap OK
- 3D and the dollhouse wait until the walls close. The hello card is gone

## 2.7.0 — 2026-09-27 — Objects with light
- Furniture has a light top, darker sides, and a shadow on the floor
- Sofas and chairs use a cushion, not a box. Round parts are smoother

## 2.6.0 — 2026-09-27 — A room is one thing
- Click a room name to select the whole room: floor, walls, doors, and what is inside
- That properties pane sits on the left. Teach stays on the right

## 2.5.3 — 2026-09-27 — Furniture with height
- Dollhouse furniture has height, and the floor keeps its wood grain
- The coach card stays on the plan, so it does not cover the dollhouse

## 2.5.2 — 2026-09-27 — 3D fills the frame
- 3D fills the screen. The house is closer. The fog stripe across the middle is gone
- The drag hint sits with the buttons, not on the toolbar

## 2.5.1 — 2026-09-27 — Yard graphics
- Trees are round canopies, the walk is stone pavers, and flower beds have blooms
- The same yard drawing is on the plan, the dollhouse, and the 3D view

## 2.5.0 — 2026-09-27 — Inside and outside
- Starter houses have a yard: a walk to the door, two trees, and flowers
- Arts & Crafts living room has a bookcase instead of a washer

## 2.4.3 — 2026-09-27 — Box rubber-band
- Box rubber-bands as you drag. The preview is the room. Release, and it becomes solid walls

## 2.4.2 — 2026-09-27 — Dollhouse, less junk
- Dollhouse: the dashed roof box is gone. The door is a slab, not a spike
- The tool list stays icons in the dollhouse, so it does not cover the turn buttons

## 2.4.1 — 2026-09-27 — Solid walls
- 3D walls are solid. The sky no longer shows through them like glass
- The sun disk is gone from the roof. The hint line no longer sits in a card

## 2.4.0 — 2026-09-26 — The door opens
- The dollhouse door swings open. You can see the jamb and the head of the hole
- Closing a box names the room Living. Rename it whenever you want

## 2.3.2 — 2026-09-26 — Openings cut the wall
- A door or window cuts through the dollhouse wall. It is not a sticker
- Roof, Fit, and zoom read as buttons. The tool column scrolls instead of covering the title

## 2.3.1 — 2026-09-26 — Nothing on top of the title
- The title block sits clear of the tool rail
- The Baboo button no longer covers Select

## 2.3.0 — 2026-09-26 — One look
- The plan ribbon is roof and zoom. Snap, straight walls, and units stay in the gear
- The dollhouse is turn left and turn right. Other drawings stay in the gear
- 3D opens as a finished look. Walk is one button. The tier cards are gone
- Class tools stay behind the teacher unlock. The student menu is short

## 2.2.9 — 2026-09-26 — A model, not a line
- Dollhouse walls have thickness, a top, and a lawn under the house
- The view stays on the house. A far tree no longer shrinks it to a line

## 2.2.8 — 2026-09-26 — Box and one ribbon
- Box draws a room in two clicks. Wall still draws one line
- Plan taps and dollhouse controls share one ribbon
- The version chip no longer sits on the hint

## 2.2.7 — 2026-09-26 — Object pictures
- Every house object has its own scalable vector picture
- Paint changes the color. Porcelain, metal, and glass stay themselves
- In 3D, wood, fabric, metal, and ceramic show on the top of the object

## 2.2.6 — 2026-09-26 — Full screen
- On a phone the plan is the screen. The bar is one floating row, not two
- Full screen hides that bar. The Baboo mark brings it back
- Tools stay icons. Furniture and the size card sit on the bottom, not over the grid

## 2.2.5 — 2026-09-26 — Start drawing
- A new visit lands on a blank plan and the coach. Sketch comes first
- The 13 houses live under the hamburger, on New
- The gear opens on Look: Stark, Ink, Projector, Blocky. Stark stays the default

## 2.2.4 — 2026-09-26 — Gear, hamburger, Stark stays put
- A phone or Chromebook in dark mode does not restyle Baboo
- The gear is the only way to pick Ink, Projector, or Blocky. Stark stays the default
- The top bar is pictograms. The hamburger holds Teach, Help, and the rest

## 2.2.3 — 2026-09-26 — A quieter desk
- Tools share one card. Tucked in, they are a slim icon stack so the plan stays open
- Plan, Rooms, and 3D are one switch. Save is the blue button. The version stays in the top bar, not on the drawing
- Stark stays the default

## 2.2.2 — 2026-09-25 — A closed house in 3D
- 3D closes the gable ends and tucks a soffit under the eaves
- The yard is a field to the horizon, not a diamond of grass. Walkthrough has a ceiling so the sun stays outside
- On a phone the version chip sits above the scale. Stark stays the default

## 2.2.1 — 2026-09-25 — Name the roof, keep the sheet
- Roof is a tap on the plan. Pick a real word: gable, hip, shed, flat, and the rest
- The title block sits above the coach so it is not covered. The tap row stays one line and leaves the north arrow clear
- Stark stays the default

## 2.2.0 — 2026-09-25 — Ten taps on the plan
- The next card stays up while a sketch is selected. Trace sits on that card
- Snap, Straight, Wall snap, Fit, zoom, and feet/meters are taps on the plan — not buried in Settings
- The sheet names the roof. Closing the box toasts the outside size. Stark stays the default

## 2.1.4 — 2026-09-24 — One first step
- The first card says Tap Sketch on the left. The extra Wall card stays hidden until a wall exists, so a new plan has one next action
- After a sketch, the toast says it landed, then the card asks for a wall. Stark stays the default

## 2.1.3 — 2026-09-23 — Plant marks
- A tree in the dollhouse is a trunk and a canopy, not a flat green dot
- On the plan, a tree is a circle and a cross clipped to its spot, so it does not blob over the toolbar. Plant beds and paths stay inside their outlines
- Stark stays the default

## 2.1.2 — 2026-09-23 — Plan symbols and a 3D peek
- Furniture on the plan uses Floor Plan SVG symbols (MIT). Zoomed-out pieces stay simple boxes
- Select a piece for a model-viewer peek. Kenney Furniture Kit CC0 (20) matches the plan. Quaternius Ultimate House Interior CC0 is 18 models, not the full pack
- Autosave writes the whole plan when an edit is off the screen, so a pan no longer drops it. Save file stays attached long enough for a Chromebook download
- Small pieces grow their tap target toward 44px, capped so neighbors still win. Stark stays the default
- floorist was not vendored. The class canvas is still this plan

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
