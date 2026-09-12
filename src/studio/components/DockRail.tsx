import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { Icon, type IconName } from '../icons';
import { usePhoneChrome } from '../hooks/usePhoneChrome';

const PANELS = [
  { id: 'teach' as const, label: 'Teach', tip: 'Lesson prompts, vocab, challenges', icon: 'teach' as IconName },
  { id: 'contest' as const, label: 'Contest', tip: 'Baboo judges the Best Dog House from the textbook list', icon: 'contest' as IconName },
  { id: 'access' as const, label: 'Access', tip: 'Classroom ADA check — doors, halls, baths', icon: 'access' as IconName },
  { id: 'help' as const, label: 'Help', tip: 'How to draw in Baboo', icon: 'help' as IconName },
  { id: 'settings' as const, label: 'Settings', tip: 'Grid, units, roof, theme', icon: 'settings' as IconName },
];

export function DockRail() {
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const accessOpen = useProjectStore((s) => s.accessOpen);
  const contestOpen = useProjectStore((s) => s.contestOpen);
  const helpOpen = useProjectStore((s) => s.helpOpen);
  const customizeOpen = useProjectStore((s) => s.customizeOpen);
  const toggleTeaching = useProjectStore((s) => s.toggleTeaching);
  const toggleAccess = useProjectStore((s) => s.toggleAccess);
  const toggleContest = useProjectStore((s) => s.toggleContest);
  const toggleHelp = useProjectStore((s) => s.toggleHelp);
  const toggleCustomize = useProjectStore((s) => s.toggleCustomize);
  const panelsPinned = useProjectStore((s) => s.panelsPinned);
  const setPanelsPinned = useProjectStore((s) => s.setPanelsPinned);
  const minimizePanels = useProjectStore((s) => s.minimizePanels);
  const chromeEpoch = useProjectStore((s) => s.chromeEpoch);
  const phone = usePhoneChrome();
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

  const open = {
    teach: teachingOpen,
    contest: contestOpen,
    access: accessOpen,
    help: helpOpen,
    settings: customizeOpen,
  };
  const toggle = {
    teach: toggleTeaching,
    contest: toggleContest,
    access: toggleAccess,
    help: toggleHelp,
    settings: toggleCustomize,
  };
  const busy = teachingOpen || accessOpen || contestOpen || helpOpen || customizeOpen;
  const expanded = phone
    ? (panelsPinned && !busy)
    : (panelsPinned || hover || focus || busy);
  const current = PANELS.find((p) => open[p.id]) ?? PANELS[0];

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

  return (
    <nav
      className={`dock-rail ${expanded ? 'is-open' : 'is-min'}${busy ? ' is-behind-sheet' : ''}`}
      aria-label="Studio panels"
      aria-expanded={expanded}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocusCapture={() => { if (!phone) setFocus(true); }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false);
      }}
    >
      {!expanded && (
        <button
          type="button"
          className="dock-rail-btn dock-rail-chip aw-pressable"
          onClick={() => setPanelsPinned(true)}
          title="Show Teach, Contest, Access, Help, and Settings"
          aria-label="Show Teach, Contest, Access, Help, and Settings"
        >
          <Icon name={current.icon} />
          <span className="dock-rail-label">{current.label}</span>
        </button>
      )}
      {PANELS.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`dock-rail-btn aw-pressable ${open[p.id] ? 'active' : ''}`}
          onClick={toggle[p.id]}
          title={p.tip}
          aria-pressed={open[p.id]}
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
        >
          <Icon name={p.icon} />
          <span className="dock-rail-label">{p.label}</span>
        </button>
      ))}
      <button
        type="button"
        className="dock-rail-btn dock-rail-min aw-pressable"
        onClick={minimizePanels}
        title="Hide panels (Esc)"
        tabIndex={expanded ? 0 : -1}
        aria-hidden={!expanded}
      >
        <Icon name="min" />
        <span className="dock-rail-label">Hide</span>
      </button>
    </nav>
  );
}
