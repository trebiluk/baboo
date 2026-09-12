import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import type { PlantKind, Tool } from '../types';
import {
  DEFAULT_SKILL_LEVEL,
  isToolUnlocked,
  levelRequiredFor,
  skillInfo,
  skillRank,
  toolsForLevel,
  upcomingTools,
} from '../data/skill';
import { PLANT_CATALOG } from '../data/landscape';
import { Icon, type IconName } from '../icons';
import { usePhoneChrome } from '../hooks/usePhoneChrome';

const PLANT_ICON: Record<PlantKind, IconName> = {
  tree: 'tree',
  bed: 'bed',
  path: 'path',
};

const TOOLS: { id: Tool; label: string; tip: string; icon: IconName }[] = [
  { id: 'select', label: 'Select', tip: 'Click something to move it (V)', icon: 'select' },
  { id: 'sketch', label: 'Sketch', tip: 'Drag like a pencil, then Trace into walls (S)', icon: 'sketch' },
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

/** Always one tap away — the den gets drawn with these. */
const QUICK = new Set<Tool>(['select', 'sketch', 'wall', 'door']);

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
  const sketches = useProjectStore((s) => s.doc.floors[0].sketches);
  const traceSketch = useProjectStore((s) => s.traceSketch);
  const showToast = useProjectStore((s) => s.showToast);
  const accessOpen = useProjectStore((s) => s.accessOpen);
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const contestOpen = useProjectStore((s) => s.contestOpen);
  const helpOpen = useProjectStore((s) => s.helpOpen);
  const customizeOpen = useProjectStore((s) => s.customizeOpen);
  const isPlan = viewMode === 'plan';
  const phone = usePhoneChrome();
  const sheetOpen = accessOpen || teachingOpen || contestOpen || helpOpen || customizeOpen;
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
  const later = TOOLS.filter((t) => upcomingTools(skillLevel).includes(t.id));
  const expert = skillRank(skillLevel) >= 3;
  const showList = allowed.includes('furniture') || allowed.includes('room');
  const drawing = wallDraft != null || dimDraft != null;
  const expanded = !sheetOpen && (
    toolsPinned
    || catalogOpen
    || (!phone && (hover || focus || tool !== 'select' || drawing))
  );
  const hasSketch = (sketches?.length ?? 0) > 0;

  const onEnter = () => {
    if (phone || ignoreHover.current) return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHover(true);
  };
  const onLeave = () => {
    if (phone) return;
    ignoreHover.current = false;
    leaveTimer.current = setTimeout(() => setHover(false), 160);
  };

  const pick = (id: Tool) => {
    setTool(id);
    if (id === 'furniture' || id === 'room') {
      setToolsPinned(true);
      return;
    }
    if (phone && QUICK.has(id) && !toolsPinned) return;
    setToolsPinned(true);
  };

  const lockedTip = (id: Tool) => {
    const need = skillInfo(levelRequiredFor(id)).label;
    return `Unlocks at ${need} — Settings to change help`;
  };

  return (
    <nav
      className={`tool-rail ${expanded ? 'is-open' : 'is-min'}${phone ? ' is-coarse' : ''}${sheetOpen ? ' is-behind-sheet' : ''}`}
      aria-label="Draw tools"
      aria-expanded={expanded}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocusCapture={() => { if (!phone) setFocus(true); }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false);
      }}
    >
      {visible.map((t) => {
        const quick = QUICK.has(t.id);
        const extra = !quick && t.id === tool;
        return (
        <button
          key={t.id}
          type="button"
          className={`tool-rail-btn aw-pressable ${tool === t.id ? 'active is-current' : ''}${quick ? ' tool-rail-quick' : ''}${extra ? ' tool-rail-extra' : ''}`}
          onClick={() => pick(t.id)}
          title={t.tip}
          aria-pressed={tool === t.id}
          tabIndex={expanded || quick || extra ? 0 : -1}
          aria-hidden={!(expanded || quick || extra)}
        >
          <Icon name={t.icon} />
          <span className="tool-rail-label">{t.label}</span>
        </button>
        );
      })}
      {hasSketch && (
        <button
          type="button"
          className="tool-rail-btn tool-rail-trace-chip aw-pressable"
          onClick={() => traceSketch()}
          title="Turn the latest sketch into straight walls"
          tabIndex={0}
          aria-hidden={false}
        >
          <Icon name="wall" />
          <span className="tool-rail-label">Trace</span>
        </button>
      )}
      {(tool === 'wall' || wallMode === 'clip') && (
        <button
          type="button"
          className={`tool-rail-btn tool-rail-extra aw-pressable ${wallMode === 'clip' ? 'active' : ''}`}
          onClick={() => setWallMode(wallMode === 'clip' ? 'draw' : 'clip')}
          title="Clip a sharp corner — rooms keep the slant"
          tabIndex={0}
          aria-hidden={false}
          aria-pressed={wallMode === 'clip'}
        >
          <Icon name="clip" />
          <span className="tool-rail-label">Clip</span>
        </button>
      )}
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
      {later.length > 0 && (
        <>
          <span className="tool-rail-soon" hidden={!expanded}>Later</span>
          {later.map((t) => (
            <button
              key={`lock-${t.id}`}
              type="button"
              className="tool-rail-btn is-locked aw-pressable"
              onClick={() => {
                if (!isToolUnlocked(t.id, skillLevel)) {
                  showToast(lockedTip(t.id), 2800);
                }
              }}
              title={lockedTip(t.id)}
              aria-disabled="true"
              tabIndex={expanded ? 0 : -1}
              aria-hidden={!expanded}
            >
              <Icon name={t.icon} />
              <span className="tool-rail-label">{t.label}</span>
            </button>
          ))}
        </>
      )}
      {!expanded && (
        <button
          type="button"
          className="tool-rail-btn tool-rail-chip aw-pressable"
          onClick={() => setToolsPinned(true)}
          title="Show every draw tool"
          aria-label="More tools"
        >
          <span className="tool-rail-kicker">Tools</span>
          <Icon name="more" />
          <span className="tool-rail-label">More</span>
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
