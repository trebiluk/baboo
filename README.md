# Baboo

Classroom floor-plan studio. Local-first. Dedicated to Dr. Donna Matteson.

**© 2026 Richard Kulibert Jr.**

**Version 2.1.0** — Drafting precision: snap to walls, exact length and angle, arrow-key nudge. Edge Pocket chrome from 2.0.1 stays.

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

## What’s in 2.1.0

- Walls land on what you already drew — corner, middle, crossing, square-off, along-wall — each with its own marker shape and word
- Type an exact Length and Angle while a wall is in progress, or tap the boxes
- Arrow keys nudge the selection; measurements always read right side up
- Edge Pocket chrome from 2.0.1 stays: left overlay tools, Teach/Help on the top row, no right Enseñar ribbon. Stark white + blue is still the classroom default

See [CHANGELOG.md](CHANGELOG.md) for the rest.

## Stack

React 19 · Vite · TanStack Start · TypeScript · Konva · Zustand · Tailwind
