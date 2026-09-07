export const UNIT_1 = {
  id: 'unit-1',
  title: 'Unit 1 — Floor Plans & Scale',
  goal: 'Make walls that have a real size on the grid.',
  steps: [
    'Open Settings. Turn on grid. Turn on snap.',
    'Draw the outside walls of one simple room.',
    'Place one door.',
    'Place one window.',
    'Look at the size labels. Do they look right?',
    'Name your roof. Use a real word: gable, hip, grass, or conical.',
  ],
  doneLooksLike: 'Closed room · door · window · clear sizes · roof named.',
};

export const CHALLENGES = [
  {
    id: 'ch-scale-room',
    title: 'Challenge A — Scale a Room',
    prompt:
      '1. Draw a room about 12 ft × 10 ft.\n2. Put size labels on the walls.\n3. Put one door on the long wall.',
    rubric: [
      { id: 'r1', text: 'Room footprint is within 1 ft of 12×10', points: 4 },
      { id: 'r2', text: 'Door uses a swing-arc drafting symbol', points: 3 },
      { id: 'r3', text: 'Dimensions readable in feet', points: 3 },
    ],
  },
  {
    id: 'ch-openings',
    title: 'Challenge B — Openings & Path',
    prompt:
      '1. Add a window across from the door.\n2. Place a sofa.\n3. Leave a clear walking path door → window.',
    rubric: [
      { id: 'r1', text: 'Window shown as double-line wall break', points: 3 },
      { id: 'r2', text: 'Furniture does not block the door swing', points: 4 },
      { id: 'r3', text: 'Clear straight-ish path door → window', points: 3 },
    ],
  },
  {
    id: 'C-ROOF-NAME',
    title: 'Name that roof',
    prompt:
      '1. Look at the roof the computer drew.\n2. Pick its real name: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(The computer drew it. You still name it.)',
    rubric: [
      { id: 'r1', text: 'Correct roof id matches generated roof', points: 5 },
      { id: 'r2', text: 'Uses a real roof term (not “the pointy one”)', points: 5 },
    ],
  },
  {
    id: 'C-TINY-HOME-CONTEST',
    title: 'Tiny Home Contest',
    prompt:
      '1. Start from the Tiny Home template.\n2. Add a place to sleep.\n3. Add a place to cook.\n4. Add a bath.\n5. Add storage (closet).\n6. Add utility (washer or water heater).\n7. Keep walking paths (circulation) clear.\n8. Use Save file for the contest board.',
    rubric: [
      { id: 'r1', text: 'Sleep + kitchen + bath present', points: 4 },
      { id: 'r2', text: 'Storage or closet placed', points: 3 },
      { id: 'r3', text: 'Utility item (washer / water heater / mech) present', points: 3 },
    ],
  },
];

export const VOCAB = [
  { term: 'Scale', def: 'Drawing size vs real size. Example: 1 grid = 1 ft.' },
  { term: 'Floor plan', def: 'Looking down at the rooms from above.' },
  { term: 'Dimension', def: 'A size label on a wall or space.' },
  { term: 'Door swing', def: 'Curve that shows which way the door opens.' },
  { term: 'Opening', def: 'A door or window cut into a wall.' },
  { term: 'Circulation', def: 'How people walk through the plan. (Also called traffic.)' },
  { term: 'Grid', def: 'Even spacing lines that help you draw to size.' },
  { term: 'Snap', def: 'The pointer jumps to the grid so lines stay neat.' },
  { term: 'Gable', def: 'Two slopes meet at a ridge — triangle ends.' },
  { term: 'Hip', def: 'Slopes on all sides meet toward the top.' },
  { term: 'Gambrel', def: 'Barn-like roof — two pitches per side.' },
  { term: 'Shed', def: 'One single slope, like a lean-to.' },
  { term: 'Flat', def: 'Almost flat on top.' },
  { term: 'Mansard', def: 'Steep sides + flatter top.' },
  { term: 'Grass / sod', def: 'Green living roof with plants on top. (Hobbit.)' },
  { term: 'Conical', def: 'Cone roof on a round plan. (Yurt.)' },
  { term: 'Ridge', def: 'The high line where roof slopes meet.' },
  { term: 'Kitchen triangle', def: 'Path between sink, stove, and fridge. Keep it short.' },
  { term: 'Floor area', def: 'How big the house is inside, in square feet.' },
];

/** Stub prompts for build reflections (Diego). */
export const REFLECTION_PROMPTS = [
  {
    id: 'traffic',
    title: 'Traffic patterns',
    prompt:
      '1. Start at the front door.\n2. Trace the path to the kitchen.\n3. Trace the path to the bath.\n4. Trace the path to sleep.\n5. Does anyone bump or cross?',
  },
  {
    id: 'kitchen-triangle',
    title: 'Kitchen triangle',
    prompt:
      '1. Find the sink.\n2. Find the stove.\n3. Find the fridge.\n4. Are they close? (This is the kitchen triangle — the work path between them.)',
  },
  {
    id: 'utility-storage',
    title: 'Utility + storage',
    prompt:
      '1. Where is laundry?\n2. Where is the water heater?\n3. Where is a closet?\nEvery home needs these.',
  },
];

export const UTILITY_CHECKLIST = [
  { id: 'water-heater', label: 'Water heater (or mech closet)' },
  { id: 'washer', label: 'Washer (laundry)' },
  { id: 'closet', label: 'Closet / storage' },
];
