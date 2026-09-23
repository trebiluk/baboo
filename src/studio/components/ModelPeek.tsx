import { createElement, useEffect, useState } from 'react';
import { peekFor } from '../data/objectPeek';

type Which = 'kenney' | 'quaternius';

/** Apache-2.0 model-viewer. Loaded only when a piece is selected. Not the class canvas. */
export function ModelPeek({ catalogId, name }: { catalogId: string; name: string }) {
  const peek = peekFor(catalogId);
  const kenney = peek?.kenney;
  const quat = peek?.quaternius;
  const [which, setWhich] = useState<Which>(kenney ? 'kenney' : 'quaternius');
  const [phase, setPhase] = useState<'load' | 'ready' | 'miss'>('load');
  const src = (which === 'kenney' ? kenney : quat) ?? kenney ?? quat;

  useEffect(() => {
    let live = true;
    void import('@google/model-viewer')
      .then(() => { if (live) setPhase('ready'); })
      .catch(() => { if (live) setPhase('miss'); });
    return () => { live = false; };
  }, []);

  if (!src) return null;

  return (
    <div className="model-peek">
      <p className="object-menu-meta">3D peek — the plan stays the drawing</p>
      {kenney && quat ? (
        <div className="model-peek-row" role="group" aria-label="3D peek model">
          <button
            type="button"
            className={`object-chip aw-pressable${which === 'kenney' ? ' active' : ''}`}
            aria-pressed={which === 'kenney'}
            onClick={() => setWhich('kenney')}
          >
            Kenney
          </button>
          <button
            type="button"
            className={`object-chip aw-pressable${which === 'quaternius' ? ' active' : ''}`}
            aria-pressed={which === 'quaternius'}
            onClick={() => setWhich('quaternius')}
          >
            Quaternius
          </button>
        </div>
      ) : (
        <p className="object-menu-meta">{kenney ? 'Kenney CC0' : 'Quaternius CC0'}</p>
      )}
      <div className="model-peek-view">
        {phase === 'ready'
          ? createElement('model-viewer', {
              key: src,
              src,
              alt: `${name} 3D peek`,
              'camera-controls': true,
              'touch-action': 'pan-y',
              exposure: '1.05',
              'shadow-intensity': '0.4',
              style: { width: '100%', height: '200px', background: '#fff', display: 'block' },
            })
          : (
            <p className="object-menu-meta">{phase === 'miss' ? 'Peek did not load.' : 'Loading peek…'}</p>
          )}
      </div>
    </div>
  );
}
