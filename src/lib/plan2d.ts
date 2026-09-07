import { useProjectStore } from '../store/useProjectStore';
import { uid } from './geometry';

export function rotateSelected90(): void {
  const st = useProjectStore.getState();
  const sel = st.selected;
  if (sel?.kind !== 'furniture') {
    st.showToast('Select furniture first, then R to rotate', 2200);
    return;
  }
  st.pushHistory();
  const doc = JSON.parse(JSON.stringify(st.doc)) as typeof st.doc;
  const item = doc.floors[0].furniture.find((f) => f.id === sel.id);
  if (!item) return;
  item.rot = (item.rot + Math.PI / 2) % (Math.PI * 2);
  const tw = item.w;
  item.w = item.h;
  item.h = tw;
  useProjectStore.setState({ doc });
  st.markDirty();
  st.showToast('Rotated 90°', 1400);
}

export function duplicateSelected(): void {
  const st = useProjectStore.getState();
  const sel = st.selected;
  if (sel?.kind !== 'furniture') {
    st.showToast('Select furniture first, then Ctrl+D', 2200);
    return;
  }
  st.pushHistory();
  const doc = JSON.parse(JSON.stringify(st.doc)) as typeof st.doc;
  const src = doc.floors[0].furniture.find((f) => f.id === sel.id);
  if (!src) return;
  const grid = doc.settings.gridSize || 1;
  const copy = { ...src, id: uid('f'), x: src.x + grid, y: src.y + grid, label: src.label };
  doc.floors[0].furniture = [...doc.floors[0].furniture, copy];
  useProjectStore.setState({ doc, selected: { kind: 'furniture', id: copy.id } });
  st.markDirty();
  st.showToast('Duplicated', 1400);
}
