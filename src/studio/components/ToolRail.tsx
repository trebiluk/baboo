import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import type { PlantKind, Tool } from '../types';
import { DEFAULT_SKILL_LEVEL, skillRank, toolsForLevel } from '../data/skill';
import { PLANT_CATALOG } from '../data/landscape';
import { Icon, type IconName } from '../icons';

const PLANT_ICON: Record<PlantKind, IconName> = {
  tree: 'tree',
  bed: 'bed',
  path: 'path',
};

const TOOLS: { id: Tool; label: string; tip: string; icon: IconName }[] = [
  { id: 'select', label: 'Select', tip: 'Click something to move it (V)', icon: 'select' },
  { id: 'wall', label: 'Wall', tip: 'Click start, then click end (W)', icon: 'wall' },
  { id: 'door', label: 'Door', tip: 'Click on a wall (D)', icon: 'door' },
  { id: 'window', label: 'Window', tip: 'Click on a wall (N)', icon: 'window' },
  { id: 'furniture', label: 'Furn.', tip: 'Pick an item, then click the plan (F)', icon: 'furniture' },
  { id: 'room', label: 'Room', tip: 'Pick a type, then click inside closed walls (R)', icon: 'room' },
  { id: 'dim', label: 'Size', tip: 'Click two points for a size label (M)', icon: 'dim' },
  { id: 'note', label: 'Note', tip: 'Click the plan, then type (T)', icon: 'note' },
  { id: 'plant', label: 'Plant', tip: 'Tree, bed, or path (L)', icon: 'plant' },
  { id: 'pan', label: 'Pan', tip: 'Drag to move the view (H)', icon: 'pan' },
];

export function ToolRail() {
  const tool = useProjectStore((s) => s.tool);
  const setTool = useProjectStore((s) => s.setTool);
  const catalogOpen = useProjectStore((s) => s.catalogOpen);
  const toggleCatalog = useProjectStore((s) => s.toggleCatalog);
  const wallDraft = useProjectStore((s) => s.wallDraft);
  const viewMode = useProjectStore((s) => s.viewMode);
  const toolsPinned = useProjectStore((s) => s.toolsPinned);
  const setToolsPinned = useProjectStore((s) => s.setToolsPinned);
  const minimizeTools = useProjectStore((s) => s.minimizeTools);
  const chromeEpoch = useProjectStore((s) => s.chromeEpoch);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const wallKind = useProjectStore((s) => s.wallKind);
  const setWallKind = useProjectStore((s) => s.setWallKind);
  const wallMode = useProjectStore((s) => s.wallMode);
  const setWallMode = useProjectStore((s) => s.setWallMode);
  const selectedPlantKind = useProjectStore((s) => s.selectedPlantKind);
  const setPlantKind = useProjectStore((s) => s.setPlantKind);
  const dimDraft = useProjectStore((s) => s.dimDraft);
  const selected = useProjectStore((s) => s.selected);
  const duplicateSelected = useProjectStore((s) => s.duplicateSelected);
  const rotateSelected = useProjectStore((s) => s.rotateSelected);
  const isPlan = viewMode === 'plan';
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreHover = useRef(false);

  useEffect(() => () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  useEffect(() => {
    setHover(false);
    setFocus(false);
    ignoreHover.current = true;
    const t = setTimeout(() => { ignoreHover.current = false; }, 280);
    return () => clearTimeout(t);
  }, [chromeEpoch]);

  if (!isPlan) return null;

  const allowed = toolsForLevel(skillLevel);
  const visible = TOOLS.filter((t) => allowed.includes(t.id));
  const expert = skillRank(skillLevel) >= 3;
  const showList = allowed.includes('furniture') || allowed.includes('room');
  const busy = tool !== 'select' || catalogOpen || wallDraft != null || dimDraft != null;
  const expanded = toolsPinned || hover || focus || busy;
  const current = visible.find((t) => t.id === tool) ?? visible[0];

  const onEnter = () => {
    if (ignoreHover.current) return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHover(true);
  };
  const onLeave = () => {
    ignoreHover.current = false;
    leaveTimer.current = setTimeout(() => setHover(false), 160);
  };

  return (
    <nav
      className={`tool-rail ${expanded ? 'is-open' : 'is-min'}`}
      aria-label="Draw tools"
      aria-expanded={expanded}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocusCapture={() => setFocus(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false);
      }}
    >
      {!expanded && (
        <button
          type="button"
          className="tool-rail-btn tool-rail-chip aw-pressable"
          onClick={() => setToolsPinned(true)}
          title="Show draw tools"
          aria-label={`Tools · ${current.label}. Click to show.`}
        >
          <span className="tool-rail-kicker">Tools</span>
          <Icon name={current.icon} />
          <span className="tool-rail-label">{current.label}</span>
        </button>
      )}
      {visible.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tool-rail-btn aw-pressable ${tool === t.id ? 'active' : ''} ${tool === t.id ? 'is-current' : ''}`}
          onClick={() => setTool(t.id)}
          title={t.tip}
          aria-pressed={tool === t.id}
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
        >
          <Icon name={t.icon} />
          <span className="tool-rail-label">{t.label}</span>
        </button>
      ))}
      <button
          type="button"
          className={`tool-rail-btn aw-pressable ${wallMode === 'clip' ? 'active' : ''}`}
          onClick={() => setWallMode(wallMode === 'clip' ? 'draw' : 'clip')}
          title="Clip a sharp corner — rooms keep the slant"
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
          aria-pressed={wallMode === 'clip'}
        >
          <Icon name="clip" />
          <span className="tool-rail-label">Clip</span>
        </button>
      {expert && tool === 'wall' && (
        <button
          type="button"
          className={`tool-rail-btn aw-pressable ${wallKind === 'interior' ? 'active' : ''}`}
          onClick={() => setWallKind(wallKind === 'interior' ? 'exterior' : 'interior')}
          title="Interior walls are thinner and skip the roof outline"
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
        >
          <span className="tool-rail-label">{wallKind === 'interior' ? 'In' : 'Out'}</span>
        </button>
      )}
      {tool === 'plant' && PLANT_CATALOG.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`tool-rail-btn aw-pressable ${selectedPlantKind === p.id ? 'active' : ''}`}
          onClick={() => setPlantKind(p.id)}
          title={p.name}
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
        >
          <Icon name={PLANT_ICON[p.id]} />
          <span className="tool-rail-label">{p.name.split(' ')[0]}</span>
        </button>
      ))}
      {expert && selected && (
        <button
          type="button"
          className="tool-rail-btn aw-pressable"
          onClick={duplicateSelected}
          title="Duplicate (Ctrl+D)"
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
        >
          <Icon name="copy" />
          <span className="tool-rail-label">Copy</span>
        </button>
      )}
      {expert && selected?.kind === 'furniture' && (
        <button
          type="button"
          className="tool-rail-btn aw-pressable"
          onClick={() => rotateSelected(1)}
          title="Rotate 90° (])"
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
        >
          <Icon name="rotate" />
          <span className="tool-rail-label">Rot</span>
        </button>
      )}
      {showList && (
        <button
          type="button"
          className={`tool-rail-btn tool-rail-dock aw-pressable ${catalogOpen ? 'active' : ''}`}
          onClick={toggleCatalog}
          title={tool === 'room' ? 'Show or hide room types' : 'Show or hide the furniture catalog'}
          aria-pressed={catalogOpen}
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
        >
          <Icon name="list" />
          <span className="tool-rail-label">{catalogOpen ? 'Hide' : 'List'}</span>
        </button>
      )}
      <button
        type="button"
        className="tool-rail-btn tool-rail-min aw-pressable"
        onClick={minimizeTools}
        title="Hide tools — grid stays full (Esc)"
        tabIndex={expanded ? 0 : -1}
        aria-hidden={!expanded}
      >
        <Icon name="min" />
        <span className="tool-rail-label">Min</span>
      </button>
    </nav>
  );
}
