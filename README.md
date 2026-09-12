# Baboo

Classroom floor-plan studio. Local-first. Dedicated to Dr. Donna Matteson.

**© 2026 Richard Kulibert Jr.**  


**Version 1.0.37** — Floating version chip, phone tools, Access sheets over rails.

Draw walls, doors, windows, rooms, furniture, and plants. Sketch first, then Trace to walls. Check access. Teach from the side rail. Plans save on the device as `.archworks.json`.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (this build listens on port 8080).

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

## What’s in 1.0.37

- Floating version chip on phones — tap for what’s new, hold for Teacher
- Sketch, Wall, and Door stay on the left — one tap. More opens the rest
- Access and Teach sit on top of the rails on a landscape phone
- Best Dog House Contest: New → Dog House, then Contest
- Sketch is the first tool; Trace turns a pencil line into straight walls

See [CHANGELOG.md](CHANGELOG.md) for the rest.

## Stack

React 19 · Vite · TanStack Start · TypeScript · Konva · Zustand · Tailwind
