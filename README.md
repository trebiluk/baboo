# Baboo

Classroom floor-plan studio. Local-first. Dedicated to Dr. Donna Matteson.

**© 2026 Richard Kulibert Jr.**

**Version 2.0.0** — P0 inclusion: fat taps, tip language, high contrast on Stark.

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

## What’s in 2.0.0

- Help and Settings share the same classroom bar: bigger type, high contrast (Stark white + blue), tip language
- Tools stay fat and icon-first. Every place or miss shows a visual toast. Caps refuse with a fat toast
- Teach / Matteson words stay English. Tips follow `tipsLocale`

See [CHANGELOG.md](CHANGELOG.md) for the rest.

## Stack

React 19 · Vite · TanStack Start · TypeScript · Konva · Zustand · Tailwind
