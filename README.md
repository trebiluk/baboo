# Baboo

Classroom floor-plan studio. Local-first. Dedicated to Dr. Donna Matteson.

**© 2026 Richard Kulibert Jr.**

**Version 2.0.1** — P0.1 Edge Pocket: left tools overlay, Teach/Help on the top row.

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

## What’s in 2.0.1

- Edge Pocket on the left: Select · Sketch · Wall · Door · More. Tap (or hover with a pointer) opens the flyout. Right-click / long-press empty canvas opens the same pocket
- No right Teach ribbon. Save · Teach · Help sit on the top row. The plan fills remaining `100dvh`
- Help and Settings still share the classroom bar: bigger type, high contrast (Stark white + blue), tip language
- Teach / Matteson words stay English. Tips follow `tipsLocale`

See [CHANGELOG.md](CHANGELOG.md) for the rest.

## Stack

React 19 · Vite · TanStack Start · TypeScript · Konva · Zustand · Tailwind
