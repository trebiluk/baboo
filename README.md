# Baboo

Classroom floor-plan studio. Local-first. Dedicated to Dr. Donna Matteson.

**© 2026 Richard Kulibert Jr.**  


**Version 1.0.31** — Stark theme (white + black, periwinkle flash).

Draw walls, doors, windows, rooms, furniture, and plants. Check access. Teach from the side rail. Plans save on the device as `.archworks.json`.

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

## What’s in 1.0.31

- Matched toolbar icons for every draw tool, Teach, Access, Help, and Settings
- Clip is a cut corner, not scissors
- Tree, bed, and path each have their own picture
- 2D Plan / 3D View marks, plus Drive, class folder, import, and delete

See [CHANGELOG.md](CHANGELOG.md) for the rest.

## Stack

React 19 · Vite · TanStack Start · TypeScript · Konva · Zustand · Tailwind
