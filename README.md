# Baboo

Classroom floor-plan studio. Local-first. Dedicated to Dr. Donna Matteson.

**© 2026 Richard Kulibert Jr.**

**Version 1.1.7** — Dollhouse drawing views (isometric, oblique, elevation, orthographic). Full look-only 3D. ELL vocab. Architect sheet.

Draw walls, doors, windows, rooms, furniture, and plants. Sketch first, then Trace to walls. Check access. Teach from the side rail. Plans save on the device as `.archworks.json`.

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

## What’s in 1.1.7

- Dollhouse turns Front / Right / Rear / Left
- Drawing views: Isometric, Oblique (cabinet), Elevation, Orthographic + Top (a plan)
- 3D orbit, materials, lighting, walkthrough — still view-only
- Teach English CAD words for grades 5–8 ELL (7 languages)
- Architect sheet: title block, north, scale, kitchen triangle

See [CHANGELOG.md](CHANGELOG.md) for the rest.

## Stack

React 19 · Vite · TanStack Start · TypeScript · Konva · Zustand · Tailwind
