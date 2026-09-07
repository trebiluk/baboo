import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { dist, formatLength, screenToWorld, uid } from '../lib/geometry';
import type { Point } from '../types';

type Mode = 'off' | 'measure' | 'label';
type Note = { id: string; x: number; y: number; text: string };

function notesKey(projectId: string) {
  return `baboo-plan-notes:${projectId}`;
}

function loadNotes(projectId: string): Note[] {
  try {
    const raw = localStorage.getItem(notesKey(projectId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotes(projectId: string, notes: Note[]) {
  try { localStorage.setItem(notesKey(projectId), JSON.stringify(notes)); } catch { /* ignore */ }
}

export function Plan2DOverlay() {
  const viewMode = useProjectStore((s) => s.viewMode);
  const panX = useProjectStore((s) => s.panX);
  const panY = useProjectStore((s) => s.panY);
  const zoom = useProjectStore((s) => s.zoom);
  const units = useProjectStore((s) => s.doc.settings.units);
  const projectId = useProjectStore((s) => s.doc.meta.id);
  const showToast = useProjectStore((s) => s.showToast);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('off');
  const [notes, setNotes] = useState<Note[]>([]);
  const [a, setA] = useState<Point | null>(null);
  const [hover, setHover] = useState<Point | null>(null);
  const [draftLabel, setDraftLabel] = useState('');

  useEffect(() => {
    setNotes(loadNotes(projectId));
    setA(null);
    setMode('off');
  }, [projectId]);

  if (viewMode !== 'plan') return null;

  const toWorld = (clientX: number, clientY: number): Point => {
    const el = wrapRef.current?.parentElement;
    const rect = el?.getBoundingClientRect();
    const sx = clientX - (rect?.left ?? 0);
    const sy = clientY - (rect?.top ?? 0);
    return screenToWorld(sx, sy, panX, panY, zoom, 0, 0);
  };

  const toScreen = (p: Point) => ({ left: p.x * zoom + panX, top: p.y * zoom + panY });

  const onPointer = (e: React.PointerEvent) => {
    if (mode === 'off') return;
    const w = toWorld(e.clientX, e.clientY);
    if (e.type === 'pointermove') { setHover(w); return; }
    if (e.type !== 'pointerdown') return;
    if (mode === 'measure') {
      if (!a) { setA(w); showToast('Click the other end', 1800); return; }
      showToast(`Measure: ${formatLength(dist(a, w), units)}`, 4200);
      setA(null);
      return;
    }
    if (mode === 'label') {
      const text = window.prompt('Room label', draftLabel || 'Room');
      if (!text?.trim()) return;
      const note: Note = { id: uid('note'), x: w.x, y: w.y, text: text.trim() };
      const next = [...notes, note];
      setNotes(next);
      saveNotes(projectId, next);
      setDraftLabel(text.trim());
      showToast('Label placed', 1400);
    }
  };

  const capturing = mode !== 'off';
  const measureB = a && hover ? hover : null;
  const measureLen = a && measureB ? formatLength(dist(a, measureB), units) : null;

  return (
    <div
      ref={wrapRef}
      className={`plan-2d-overlay${capturing ? ' plan-2d-capture' : ''}`}
      onPointerDown={onPointer}
      onPointerMove={onPointer}
    >
      <div className="plan-2d-bar" onPointerDown={(e) => e.stopPropagation()}>
        <button type="button" className={`ghost-btn aw-pressable${mode === 'measure' ? ' active' : ''}`} onClick={() => { setMode((m) => m === 'measure' ? 'off' : 'measure'); setA(null); }}>Measure</button>
        <button type="button" className={`ghost-btn aw-pressable${mode === 'label' ? ' active' : ''}`} onClick={() => { setMode((m) => m === 'label' ? 'off' : 'label'); setA(null); }}>Label</button>
        <span className="plan-2d-hint">{mode === 'measure' ? 'Click two points' : mode === 'label' ? 'Click the room' : 'R rotate · Ctrl+D copy'}</span>
      </div>
      {notes.map((n) => {
        const s = toScreen(n);
        return (
          <button key={n.id} type="button" className="plan-room-label" style={{ left: s.left, top: s.top }} title="Click to remove" onPointerDown={(e) => {
            e.stopPropagation();
            const next = notes.filter((x) => x.id !== n.id);
            setNotes(next);
            saveNotes(projectId, next);
          }}>{n.text}</button>
        );
      })}
      {a && <span className="plan-measure-dot" style={toScreen(a)} />}
      {a && measureB && (
        <svg className="plan-measure-svg" aria-hidden="true">
          <line x1={a.x * zoom + panX} y1={a.y * zoom + panY} x2={measureB.x * zoom + panX} y2={measureB.y * zoom + panY} />
        </svg>
      )}
      {measureLen && measureB && (
        <span className="plan-measure-tag" style={{ left: ((a?.x ?? 0) + measureB.x) / 2 * zoom + panX, top: ((a?.y ?? 0) + measureB.y) / 2 * zoom + panY }}>{measureLen}</span>
      )}
      <div className="plan-north" title="North"><span>N</span><span className="plan-north-arrow" aria-hidden="true" /></div>
      <div className="plan-scale" title="Scale"><span className="plan-scale-bar" /><span>{units === 'm' ? '1 m' : '4\''}</span></div>
    </div>
  );
}
