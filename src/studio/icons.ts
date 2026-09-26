import { createElement } from 'react';

const base = `${import.meta.env.BASE_URL}icons`;

export const ICON = {
  select: `${base}/select.png`,
  sketch: `${base}/sketch.png`,
  wall: `${base}/wall.png`,
  box: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" fill="none" stroke="#0a0a0a" stroke-width="2"/></svg>'),
  door: `${base}/door.png`,
  window: `${base}/window.png`,
  furniture: `${base}/furniture.png`,
  room: `${base}/room.png`,
  dim: `${base}/dim.png`,
  note: `${base}/note.png`,
  plant: `${base}/plant.png`,
  pan: `${base}/pan.png`,
  clip: `${base}/clip.png`,
  teach: `${base}/teach.png`,
  access: `${base}/access.png`,
  help: `${base}/help.png`,
  settings: `${base}/settings.png`,
  more: `${base}/more.png`,
  fit: `${base}/fit.png`,
  undo: `${base}/undo.png`,
  redo: `${base}/redo.png`,
  save: `${base}/save.png`,
  new: `${base}/new.png`,
  list: `${base}/list.png`,
  min: `${base}/min.png`,
  copy: `${base}/copy.png`,
  rotate: `${base}/rotate.png`,
  tree: `${base}/tree.png`,
  bed: `${base}/bed.png`,
  path: `${base}/path.png`,
  plan: `${base}/plan.png`,
  view3d: `${base}/view3d.png`,
  trash: `${base}/trash.png`,
  folder: `${base}/folder.png`,
  import: `${base}/import.png`,
  drive: `${base}/drive.png`,
  contest: `${base}/contest.png`,
} as const;

export type IconName = keyof typeof ICON;

export function Icon({ name }: { name: IconName }) {
  return createElement('img', {
    className: 'tool-icon',
    src: ICON[name],
    alt: '',
    width: 24,
    height: 24,
    draggable: false,
    'aria-hidden': true,
  });
}
