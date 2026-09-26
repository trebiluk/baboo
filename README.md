# Baboo

Classroom floor-plan studio. Local-first. Dedicated to Dr. Donna Matteson.

**© 2026 Richard Kulibert Jr.**

**Version 2.2.5** — A new visit starts drawing. Houses live under New. The gear leads with Look. Stark stays the default.

Draw walls, doors, windows, rooms, furniture, and plants. Sketch first, then Trace to walls. Check access. Teach from the top chip. Plans save on the device as `.archworks.json`.

Live classroom: [baboo.kulibert.net](https://baboo.kulibert.net)

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
npm run typecheck
```

Class folder (a zip kids open as `index.html` from a drive, no server):

```bash
npm run pack:share
```

## Student files

- Autosave in IndexedDB on that Chromebook / computer
- **Save file** downloads `.archworks.json` for Classroom
- **Class folder** is a copy-to-the-share pack — Chrome, no login
- No Google login inside the app

## What’s in 2.1.2

- Plan stamps from FloorPlanSVGSymbols (MIT). A 3D peek uses model-viewer (Apache-2.0) — not the class canvas
- Kenney Furniture Kit CC0 subset (20). Quaternius Ultimate House Interior CC0 subset (18), not the full pack
- Autosave no longer drops off-screen edits. Save file waits for the Chromebook download. Small pieces are easier to tap

## What’s in 2.1.1

- Chromebook top bar stays one row at 1280 and 1366 — no stacked Arts & Craft / Undo / Saved labels
- Left Edge Pocket is fat chips with words: Select, Sketch, Wall, Door. Wall opens thickness (120/200/300mm), height (2.4/2.7/3.0m), and style
- When the pocket is open, the bottom plan card moves so it does not cover Furn/Plant or the status chip
- 2.1.0 snaps, exact length/angle, and arrow-key nudge stay. No right Enseñar ribbon

## What’s in 2.1.0

- Walls land on what you already drew — corner, middle, crossing, square-off, along-wall — each with its own marker shape and word
- Type an exact Length and Angle while a wall is in progress, or tap the boxes
- Arrow keys nudge the selection; measurements always read right side up
- Edge Pocket chrome from 2.0.1 stays: left overlay tools, Teach/Help on the top row, no right Enseñar ribbon. Stark white + blue is still the classroom default

See [CHANGELOG.md](CHANGELOG.md) for the rest.

## Stack

React 19 · Vite · TanStack Start · TypeScript · Konva · Zustand · Tailwind
