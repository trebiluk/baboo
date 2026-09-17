# Baboo

Classroom floor-plan studio. Local-first. Dedicated to Dr. Donna Matteson.

**© 2026 Richard Kulibert Jr.**

**Version 1.3.1** — Side-attached collapsible toolbars. Busy houses stay snappy.

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

## What’s in 1.3.1

- Tools, catalogs, Settings, and Teach dock to the sides and collapse — the grid stays open
- Extra furniture detail drops while you spin 3D or zoom the plan out, so a packed house stays snappy
- Furniture is modeled, not boxed: round tables, burner rings, toilet bowls, tubs, drums, legs
- Flooring: walnut, herringbone, slate, terracotta, plus oak/maple/tile. Rotate the grain. Per-room or house default

See [CHANGELOG.md](CHANGELOG.md) for the rest.

## Stack

React 19 · Vite · TanStack Start · TypeScript · Konva · Zustand · Tailwind
