import { useMemo, useRef, useState, useCallback, type PointerEvent as REPointerEvent } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import type { RenderTier, RoofGeometry } from '../types';
import { roofStyleName } from '../lib/roof';

const TIERS: { tier: RenderTier; label: string; blurb: string; ready: boolean }[] = [
  { tier: 0, label: 'Plan (2D)', blurb: 'Traditional drafting symbols — edit here.', ready: true },
  { tier: 1, label: 'Solid 3D', blurb: 'Simple 3D shape · view only.', ready: true },
  { tier: 2, label: 'Materials', blurb: 'Later — better surfaces.', ready: false },
  { tier: 3, label: 'Lighting', blurb: 'Later — soft lights.', ready: false },
];

function iso(x: number, y: number, z = 0) {
  const ix = (x - y) * 8 + 280;
  const iy = (x + y) * 4 - z * 10 + 140;
  return { ix, iy, s: `${ix},${iy}` };
}

function roofMassPaths(roof: RoofGeometry): { d: string; fill: string; stroke: string }[] {
  const o = roof.outline;
  if (o.length < 3) return [];
  const eh = roof.eavesHeight;
  const rh = roof.ridgeHeight;
  const out: { d: string; fill: string; stroke: string }[] = [];

  if (roof.styleId === 'flat') {
    const top = o.map((p) => iso(p.x, p.y, eh + 0.5).s).join(' L ');
    out.push({
      d: `M ${top} Z`,
      fill: 'rgba(120,140,170,0.45)',
      stroke: '#9ab0d0',
    });
    return out;
  }

  if (roof.styleId === 'grass') {
    // Soft turf mound — Apple-polish (subtle shade bands, one specular facet), not cartoon zebra
    const pts = roof.sodEdge ?? o;
    const edge = pts.map((p) => iso(p.x, p.y, eh + 0.75).s).join(' L ');
    out.push({ d: `M ${edge} Z`, fill: 'rgba(40,95,60,0.5)', stroke: '#3d7a52' });
    const cx = o.reduce((s, p) => s + p.x, 0) / o.length;
    const cy = o.reduce((s, p) => s + p.y, 0) / o.length;
    const crown = iso(cx, cy, rh);
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      const ia = iso(a.x, a.y, eh + 0.75);
      const ib = iso(b.x, b.y, eh + 0.75);
      // Smooth shade ramp around mound; one brighter "shine" facet
      const shine = i === Math.floor(n * 0.15);
      const t = i / Math.max(1, n - 1);
      const fill = shine
        ? 'rgba(120,175,130,0.55)'
        : `rgba(${Math.round(48 + t * 28)},${Math.round(105 + t * 25)},${Math.round(68 + t * 18)},0.5)`;
      out.push({
        d: `M ${ia.s} L ${ib.s} L ${crown.s} Z`,
        fill,
        stroke: shine ? '#9ec9a8' : '#356f48',
      });
    }
    return out;
  }

  if (roof.styleId === 'conical') {
    // Simple cone massing — radial facets to peak (Yurt)
    const pts = o;
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const crown = iso(cx, cy, rh);
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      const ia = iso(a.x, a.y, eh);
      const ib = iso(b.x, b.y, eh);
      const shade = i % 2 === 0;
      out.push({
        d: `M ${ia.s} L ${ib.s} L ${crown.s} Z`,
        fill: shade ? 'rgba(90,110,150,0.52)' : 'rgba(50,75,130,0.58)',
        stroke: '#8aa0c8',
      });
    }
    return out;
  }

  // Pitched: eaves polygon + ridge peak(s)
  const eaves = o.map((p) => iso(p.x, p.y, eh).s);
  if (roof.ridges.length) {
    const r = roof.ridges[0];
    const ra = iso(r.a.x, r.a.y, rh);
    const rb = iso(r.b.x, r.b.y, rh);
    // Two big roof planes (simplified from eaves corners)
    const c0 = iso(o[0].x, o[0].y, eh);
    const c1 = iso(o[1].x, o[1].y, eh);
    const c2 = iso(o[2].x, o[2].y, eh);
    const c3 = iso(o[3].x, o[3].y, eh);
    if (roof.longAxis === 'x') {
      out.push({
        d: `M ${c0.s} L ${c1.s} L ${rb.s} L ${ra.s} Z`,
        fill: 'rgba(90,110,150,0.5)',
        stroke: '#8aa0c8',
      });
      out.push({
        d: `M ${c3.s} L ${c2.s} L ${rb.s} L ${ra.s} Z`,
        fill: 'rgba(50,75,130,0.55)',
        stroke: '#7a90b8',
      });
    } else {
      out.push({
        d: `M ${c0.s} L ${c3.s} L ${ra.s} L ${rb.s} Z`,
        fill: 'rgba(90,110,150,0.5)',
        stroke: '#8aa0c8',
      });
      out.push({
        d: `M ${c1.s} L ${c2.s} L ${rb.s} L ${ra.s} Z`,
        fill: 'rgba(50,75,130,0.55)',
        stroke: '#7a90b8',
      });
    }
    // Ridge line
    out.push({
      d: `M ${ra.s} L ${rb.s}`,
      fill: 'none',
      stroke: '#c8daf5',
    });
  } else if (roof.hips.length) {
    // Hip / mansard: draw eaves + hips to approximate
    out.push({
      d: `M ${eaves.join(' L ')} Z`,
      fill: 'rgba(70,95,140,0.35)',
      stroke: '#8aa0c8',
    });
    for (const h of roof.hips) {
      const a = iso(h.a.x, h.a.y, eh);
      const b = iso(h.b.x, h.b.y, rh);
      out.push({ d: `M ${a.s} L ${b.s}`, fill: 'none', stroke: '#9ab0d0' });
    }
  } else {
    out.push({
      d: `M ${eaves.join(' L ')} Z`,
      fill: 'rgba(70,95,140,0.4)',
      stroke: '#8aa0c8',
    });
  }
  return out;
}

/** Iso site pad from node bounds (or calm default yard when empty). */
function sitePadPath(nodes: { x: number; y: number }[]): { pad: string; shadeCx: number; shadeCy: number } {
  let minX = 0, maxX = 24, minY = 0, maxY = 18;
  if (nodes.length) {
    minX = Math.min(...nodes.map((n) => n.x));
    maxX = Math.max(...nodes.map((n) => n.x));
    minY = Math.min(...nodes.map((n) => n.y));
    maxY = Math.max(...nodes.map((n) => n.y));
  }
  const pad = 6;
  const x0 = minX - pad, x1 = maxX + pad, y0 = minY - pad, y1 = maxY + pad;
  const a = iso(x0, y0, 0);
  const b = iso(x1, y0, 0);
  const c = iso(x1, y1, 0);
  const d = iso(x0, y1, 0);
  const mid = iso((x0 + x1) / 2, (y0 + y1) / 2, 0);
  return {
    pad: `M ${a.s} L ${b.s} L ${c.s} L ${d.s} Z`,
    shadeCx: mid.ix + 18,
    shadeCy: mid.iy + 8,
  };
}

export function View3DStub() {
  const viewMode = useProjectStore((s) => s.viewMode);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const setRenderTier = useProjectStore((s) => s.setRenderTier);
  const tier = useProjectStore((s) => s.doc.settings.renderTier);
  const roofStyleId = useProjectStore((s) => s.doc.settings.roofStyleId);
  const roofLabel = useProjectStore((s) => s.doc.settings.roofLabel);
  const floor = useProjectStore((s) => s.doc.floors[0]);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null);

  const onPointerDown = useCallback((e: REPointerEvent<SVGSVGElement>) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    drag.current = { ox: e.clientX, oy: e.clientY, px: pan.x, py: pan.y };
  }, [pan.x, pan.y]);

  const onPointerMove = useCallback((e: REPointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.ox;
    const dy = e.clientY - drag.current.oy;
    setPan({ x: drag.current.px + dx, y: drag.current.py + dy });
  }, []);

  const onPointerUp = useCallback(() => { drag.current = null; }, []);

  const wallPaths = useMemo(() => {
    const nodes = Object.fromEntries(floor.nodes.map((n) => [n.id, n]));
    return floor.walls.map((w, wi) => {
      const a = nodes[w.a];
      const b = nodes[w.b];
      if (!a || !b) return null;
      const a0 = iso(a.x, a.y, 0);
      const b0 = iso(b.x, b.y, 0);
      const b1 = iso(b.x, b.y, 9);
      const a1 = iso(a.x, a.y, 9);
      // Soft sun cue: alternate fill warmth (one cheap shade feel — not a light stack)
      const sunlit = wi % 2 === 0;
      return {
        d: `M ${a0.s} L ${b0.s} L ${b1.s} L ${a1.s} Z`,
        fill: sunlit ? 'rgba(55,95,185,0.42)' : 'rgba(30,65,145,0.38)',
        stroke: sunlit ? '#8eb0f0' : '#6e90d0',
      };
    }).filter(Boolean) as { d: string; fill: string; stroke: string }[];
  }, [floor.nodes, floor.walls]);

  const roofPaths = useMemo(
    () => (floor.roof ? roofMassPaths(floor.roof) : []),
    [floor.roof],
  );

  const site = useMemo(() => sitePadPath(floor.nodes), [floor.nodes]);

  if (viewMode === 'plan') return null;

  return (
    <div className="view3d-stub">
      <div className="view3d-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <strong>3D preview</strong>
          <span className="save-chip" style={{ color: 'var(--accent-hot)' }}>view-only</span>
          {roofStyleId && (
            <span className="save-chip">Roof: {roofLabel?.trim() || roofStyleName(roofStyleId)}</span>
          )}
        </div>
        <span>Edit walls, doors, and furniture in <button type="button" className="linkish" onClick={() => { setRenderTier(0); setViewMode('plan'); }}>2D Plan</button>. Upgrade tiers change how you see the same project — not a second editor.</span>
      </div>
      <div className="tier-ladder">
        {TIERS.map((t) => (
          <button
            key={t.tier}
            type="button"
            className={`tier-card ${tier === t.tier ? 'active' : ''} ${t.ready ? '' : 'locked'}`}
            disabled={!t.ready && t.tier > 1}
            onClick={() => {
              if (t.tier === 0) { setRenderTier(0); setViewMode('plan'); }
              else if (t.ready) { setRenderTier(t.tier); setViewMode('solid3d'); }
            }}
          >
            <strong>{t.label}</strong>
            <span>{t.blurb}</span>
            {!t.ready && <em>Later</em>}
          </button>
        ))}
        <button type="button" className="tier-card locked" disabled>
          <strong>Walkthrough</strong>
          <span>Later — camera path preview.</span>
          <em>Later</em>
        </button>
      </div>
      <div className="solid-preview" aria-label="Solid 3D preview with site and sky">
        <svg
          className="solid-preview-svg"
          viewBox="0 0 560 320"
          width="100%"
          height="100%"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: 'none', cursor: 'grab' }}
        >
          <defs>
            {/* StyleBot: soft blue sky — zenith → mid → horizon (not dream-purple fill) */}
            <linearGradient id="aw3d-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8EB6D8" />
              <stop offset="55%" stopColor="#B7CCE0" />
              <stop offset="100%" stopColor="#D6E2EE" />
            </linearGradient>
            <linearGradient id="aw3d-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6D7A62" />
              <stop offset="55%" stopColor="#5F6F52" />
              <stop offset="100%" stopColor="#4A5642" />
            </linearGradient>
          </defs>
          {/* Sky backdrop */}
          <rect width="560" height="320" fill="url(#aw3d-sky)" />
          {/* Distant haze band (solid, no blur) */}
          <rect x="0" y="168" width="560" height="52" fill="#C5D0DC" opacity="0.35" />
          {/* Horizon cyan hairline — static, StyleBot edge accent */}
          <line x1="0" y1="198" x2="560" y2="198" stroke="#A8D4E8" strokeWidth="1" opacity="0.35" />
          <g transform={`translate(${pan.x}, ${pan.y})`}>
            {/* Site ground pad */}
            <path d={site.pad} fill="url(#aw3d-ground)" stroke="#6D7A62" strokeWidth="1" />
            {/* Soft sun shade cue on ground (one ellipse — not a shadow stack) */}
            <ellipse
              cx={site.shadeCx}
              cy={site.shadeCy}
              rx="52"
              ry="18"
              fill="#4A5642"
              opacity="0.35"
            />
            {wallPaths.map((w, i) => (
              <path key={`w${i}`} d={w.d} fill={w.fill} stroke={w.stroke} strokeWidth="1.5" />
            ))}
            {roofPaths.map((r, i) => (
              <path key={`rf${i}`} d={r.d} fill={r.fill} stroke={r.stroke} strokeWidth="1.25" />
            ))}
            {!wallPaths.length && (
              <text x="280" y="150" textAnchor="middle" fill="#4A5642" fontSize="14" fontWeight="500">
                Draw walls in 2D to see them in 3D
              </text>
            )}
          </g>
        </svg>
        <p className="muted center">Drag to pan · view only — edit in 2D Plan. Materials / walkthrough unlock later.</p>
      </div>
    </div>
  );
}
