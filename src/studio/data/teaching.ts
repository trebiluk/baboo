import { asLocale, homePhrase } from './i18n.ts';
import type { Locale } from '../types';

export const UNIT_1 = {
  id: 'unit-1',
  title: 'Unit 1 — Floor Plans & Scale',
  goal: 'Make one room that feels like a real size on the grid.',
  steps: [
    'Tap Snap, Straight, and Wall snap on the plan. They stay on.',
    'Sketch the rooms first — Tools → Sketch, then drag like a pencil.',
    'Tap the sketch → Trace, or draw the outside walls with two clicks.',
    'Place one door.',
    'Place one window.',
    'Look at the size labels. Do they look right?',
    'Name your roof. Tap Roof on the plan and pick a real word: gable, hip, grass, or conical.',
    'Name the room. Room tool → pick a type → click inside the walls.',
  ],
  doneLooksLike: 'Closed room · named · door · window · clear sizes · roof named.',
};

export const DOG_HOUSE_UNIT = {
  id: 'dog-house-contest',
  title: 'Best Dog House Contest',
  goal: 'A snug outdoor den Baboo would pick — textbook size, not a people house.',
  steps: [
    'Sketch the den first. Tools → Sketch, then drag.',
    'Trace or hard-line walls. Close the box.',
    'One door. Tap it and pick 12" or 18" — dogs are not 3 feet wide.',
    'Slide the door off-center so wind and rain miss the bed.',
    'Keep a pitched roof (gable or shed). Flat roofs puddle.',
    'Put size labels on two walls.',
    'Plant a tree for summer shade.',
    'Open Contest — Baboo judges from the textbook list.',
  ],
  doneLooksLike: 'Closed den · 8–18 sq ft · dog-sized offset door · pitched roof · shade tree · Baboo’s ribbon',
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
  {
    id: 'C-DOG-HOUSE-CONTEST',
    title: 'Best Dog House Contest',
    prompt:
      '1. New → Dog House.\n2. Sketch a snug den, then Trace or Wall until it closes.\n3. One door: tap it and pick 12" or 18" — not a people door.\n4. Slide the door off-center so wind misses the bed.\n5. Keep a gable or shed roof.\n6. Label two walls. Plant a tree for shade.\n7. Open Contest — Baboo judges from the textbook list.',
    rubric: [
      { id: 'r1', text: 'Closed den about 8–18 sq ft (body heat, not a bedroom)', points: 4 },
      { id: 'r2', text: 'One 12–18" door, offset from center', points: 3 },
      { id: 'r3', text: 'Pitched roof + size labels + shade tree', points: 3 },
    ],
  },
  {
    id: 'C-BRIEF',
    title: 'Challenge — Name the rooms',
    prompt:
      '1. Draw interior walls to split spaces.\n2. Room tool → pick Kitchen, Bath, Living…\n3. Click inside each closed space.\n4. Read the square-foot label. Does the size feel right?',
    rubric: [
      { id: 'r1', text: 'At least two named rooms', points: 4 },
      { id: 'r2', text: 'Kitchen or living tagged', points: 3 },
      { id: 'r3', text: 'Each room shows a real area (sq ft)', points: 3 },
    ],
  },
];

export const VOCAB = [
  { term: 'Sketch', def: 'A freehand pencil line on the plan. Sketch first, then hard-line walls.' },
  { term: 'Trace', def: 'Turn a sketch into straight walls. The pencil line stays as an underlay.' },
  { term: 'Wall', def: 'A line that makes a room. Click start, then click the other end.' },
  { term: 'Door', def: 'An opening you walk through. Click it right on a wall.' },
  { term: 'Window', def: 'An opening that lets light in. Click it on a wall across from a door.' },
  { term: 'Scale', def: 'Drawing size vs real size. Example: 1 grid = 1 ft.' },
  { term: 'North', def: 'The top of the sheet. Plans keep north up so everyone reads them the same way.' },
  { term: 'Title block', def: 'Name, scale, and date on the drawing. Every sheet has one.' },
  { term: 'Envelope', def: 'The outside walls that close the house against weather.' },
  { term: 'Overall dimension', def: 'The big outside size — width and depth of the whole envelope.' },
  { term: 'Isometric', def: 'A 3/4 view. All three axes. Height stays true. Not a photo.' },
  { term: 'Oblique', def: 'Front is true size. Depth recedes at 45° and is drawn shorter (cabinet).' },
  { term: 'Elevation', def: 'One face of the house, true width and height. Looking straight at a wall.' },
  { term: 'Orthographic', def: 'No angle, no squeeze. Front / side / rear elevations and a top view (the plan).' },
  { term: 'Floor plan', def: 'Looking down at the rooms from above.' },
  { term: 'Flooring', def: 'The finish on the floor — wood, tile, carpet, or concrete.' },
  { term: 'Hardwood', def: 'Wood planks on the floor. Oak and maple are hardwoods.' },
  { term: 'Tile', def: 'Hard squares or hexes — kitchens and baths stay dry.' },
  { term: 'Carpet', def: 'Soft pile. Quiet in bedrooms.' },
  { term: 'Room', def: 'A closed space with a name — kitchen, bath, bedroom.' },
  { term: 'Interior wall', def: 'A wall that splits one big space into rooms.' },
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
  { term: 'Accessible route', def: 'A 3-foot-wide path a wheelchair can roll — door to rooms.' },
  { term: 'Clear width', def: 'The open space through a door. ADA asks for 32 inches.' },
  { term: 'Turning circle', def: 'A 5-foot circle so a wheelchair can spin around, usually in a bath.' },
  { term: 'Den', def: 'A snug sleeping box. A dog house is one room, not a people plan.' },
  { term: 'Offset door', def: 'Opening not in the middle of the wall — wind and rain miss the bed.' },
  { term: 'Body heat', def: 'A den just big enough stays warm. Too big and the dog cannot heat it.' },
];

/** Spanish classroom gloss — English CAD term stays in ( ). */
export const VOCAB_ES: Record<string, { term: string; def: string }> = {
  Sketch: { term: 'Boceto (Sketch)', def: 'Línea a mano. Primero boceto, luego muros derechos.' },
  Trace: { term: 'Trazar (Trace)', def: 'Convierte un boceto en muros derechos. El lápiz queda debajo.' },
  Wall: { term: 'Muro (Wall)', def: 'Línea que hace un cuarto. Clic inicio, luego el otro extremo.' },
  Door: { term: 'Puerta (Door)', def: 'Vano para entrar. Clic justo en un muro.' },
  Window: { term: 'Ventana (Window)', def: 'Vano que deja entrar luz. Clic en un muro frente a la puerta.' },
  Scale: { term: 'Escala (Scale)', def: 'Tamaño del dibujo vs tamaño real. Ejemplo: 1 cuadro = 1 pie.' },
  North: { term: 'Norte (North)', def: 'Arriba de la hoja. Los planos dejan el norte arriba para leerlos igual.' },
  'Title block': { term: 'Cajetín (Title block)', def: 'Nombre, escala y fecha en el dibujo. Cada hoja tiene uno.' },
  Envelope: { term: 'Recinto (Envelope)', def: 'Los muros de afuera que cierran la casa contra el clima.' },
  'Overall dimension': { term: 'Cota general (Overall dimension)', def: 'El tamaño grande de afuera — ancho y fondo de todo el recinto.' },
  Isometric: { term: 'Isométrica (Isometric)', def: 'Vista 3/4. Tres ejes. La altura queda verdadera. No es una foto.' },
  Oblique: { term: 'Oblicua (Oblique)', def: 'El frente es tamaño verdadero. La profundidad huye a 45° y se dibuja más corta (cabinet).' },
  Elevation: { term: 'Alzado (Elevation)', def: 'Una cara de la casa, ancho y alto verdaderos. Mirar de frente un muro.' },
  Orthographic: { term: 'Ortográfica (Orthographic)', def: 'Sin ángulo ni achique. Alzados frente/lado/atrás y una vista de arriba (la planta).' },
  'Floor plan': { term: 'Planta (Floor plan)', def: 'Mirar los cuartos desde arriba.' },
  Flooring: { term: 'Piso (Flooring)', def: 'El acabado del suelo — madera, loseta, alfombra o concreto.' },
  Hardwood: { term: 'Madera (Hardwood)', def: 'Tablas de madera. Roble y arce son maderas duras.' },
  Tile: { term: 'Loseta (Tile)', def: 'Cuadros duros — cocina y baño se quedan secos.' },
  Carpet: { term: 'Alfombra (Carpet)', def: 'Pelo suave. Silencio en recámaras.' },
  Room: { term: 'Cuarto (Room)', def: 'Espacio cerrado con nombre — cocina, baño, recámara.' },
  'Interior wall': { term: 'Muro interior (Interior wall)', def: 'Muro que parte un espacio grande en cuartos.' },
  Dimension: { term: 'Cota (Dimension)', def: 'Etiqueta de tamaño en un muro o espacio.' },
  'Door swing': { term: 'Giro de puerta (Door swing)', def: 'Curva que muestra hacia dónde abre la puerta.' },
  Opening: { term: 'Vano (Opening)', def: 'Puerta o ventana cortada en un muro.' },
  Circulation: { term: 'Circulación (Circulation)', def: 'Cómo camina la gente por el plano. (También tráfico.)' },
  Grid: { term: 'Cuadrícula (Grid)', def: 'Líneas parejas que ayudan a dibujar a escala.' },
  Snap: { term: 'Imán (Snap)', def: 'El puntero salta a la cuadrícula para que las líneas queden limpias.' },
  Gable: { term: 'A dos aguas (Gable)', def: 'Dos pendientes se juntan en una cumbrera — extremos en triángulo.' },
  Hip: { term: 'A cuatro aguas (Hip)', def: 'Pendientes en todos los lados hacia arriba.' },
  Gambrel: { term: 'Gambrel', def: 'Techo de granero — dos pendientes por lado.' },
  Shed: { term: 'Un agua (Shed)', def: 'Una sola pendiente, como un cobertizo.' },
  Flat: { term: 'Plano (Flat)', def: 'Casi plano arriba.' },
  Mansard: { term: 'Mansarda (Mansard)', def: 'Lados empinados + cima más plana.' },
  'Grass / sod': { term: 'Cesped / sod (Grass)', def: 'Techo vivo verde con plantas. (Hobbit.)' },
  Conical: { term: 'Cónico (Conical)', def: 'Techo de cono sobre planta redonda. (Yurta.)' },
  Ridge: { term: 'Cumbrera (Ridge)', def: 'La línea alta donde se juntan las pendientes.' },
  'Kitchen triangle': { term: 'Triángulo de cocina', def: 'Camino entre fregadero, estufa y refrigerador. Que sea corto.' },
  'Floor area': { term: 'Área de piso (Floor area)', def: 'Qué tan grande es la casa por dentro, en pies cuadrados.' },
  'Accessible route': { term: 'Ruta accesible', def: 'Camino de 3 pies para silla de ruedas — de la puerta a los cuartos.' },
  'Clear width': { term: 'Ancho libre (Clear width)', def: 'El hueco de una puerta. ADA pide 32 pulgadas.' },
  'Turning circle': { term: 'Círculo de giro', def: 'Un círculo de 5 pies para girar una silla, casi siempre en el baño.' },
  Den: { term: 'Guarida (Den)', def: 'Caja chica para dormir. Una perrera es un cuarto, no un plano de personas.' },
  'Offset door': { term: 'Puerta descentrada (Offset door)', def: 'Vano no en el medio — el viento y la lluvia no dan en la cama.' },
  'Body heat': { term: 'Calor corporal (Body heat)', def: 'Una guarida justa se calienta. Si es muy grande, el perro no la calienta.' },
};

type VocabGloss = { term: string; def: string };

/** Cuban Spanish — pared / caseta, English CAD in ( ). */
export const VOCAB_CU: Record<string, VocabGloss> = {
  Sketch: { term: 'Boceto (Sketch)', def: 'Línea a mano. Primero boceto, luego paredes derechas.' },
  Trace: { term: 'Trazar (Trace)', def: 'Convierte un boceto en paredes derechas. El lápiz queda debajo.' },
  Wall: { term: 'Pared (Wall)', def: 'Línea que hace un cuarto. Toca inicio, luego el otro extremo.' },
  Door: { term: 'Puerta (Door)', def: 'Vano para entrar. Toca justo en una pared.' },
  Window: { term: 'Ventana (Window)', def: 'Vano que deja entrar luz. Toca una pared frente a la puerta.' },
  Scale: { term: 'Escala (Scale)', def: 'Tamaño del dibujo vs tamaño real. Ejemplo: 1 cuadro = 1 pie.' },
  North: { term: 'Norte (North)', def: 'Arriba de la hoja. Los planos dejan el norte arriba para leerlos igual.' },
  'Title block': { term: 'Cajetín (Title block)', def: 'Nombre, escala y fecha en el dibujo. Cada hoja tiene uno.' },
  Envelope: { term: 'Recinto (Envelope)', def: 'Las paredes de afuera que cierran la casa contra el clima.' },
  'Overall dimension': { term: 'Cota general (Overall dimension)', def: 'El tamaño grande de afuera — ancho y fondo de todo el recinto.' },
  Isometric: { term: 'Isométrica (Isometric)', def: 'Vista 3/4. Tres ejes. La altura queda verdadera. No es una foto.' },
  Oblique: { term: 'Oblicua (Oblique)', def: 'El frente es tamaño verdadero. La profundidad huye a 45° y se dibuja más corta (cabinet).' },
  Elevation: { term: 'Alzado (Elevation)', def: 'Una cara de la casa, ancho y alto verdaderos. Mirar de frente una pared.' },
  Orthographic: { term: 'Ortográfica (Orthographic)', def: 'Sin ángulo ni achique. Alzados frente/lado/atrás y una vista de arriba (la planta).' },
  'Floor plan': { term: 'Planta (Floor plan)', def: 'Mirar los cuartos desde arriba.' },
  Flooring: { term: 'Piso (Flooring)', def: 'El acabado del suelo — madera, loseta, alfombra o concreto.' },
  Hardwood: { term: 'Madera (Hardwood)', def: 'Tablas de madera. Roble y arce son maderas duras.' },
  Tile: { term: 'Loseta (Tile)', def: 'Cuadros duros — cocina y baño se quedan secos.' },
  Carpet: { term: 'Alfombra (Carpet)', def: 'Pelo suave. Silencio en recámaras.' },
  Room: { term: 'Cuarto (Room)', def: 'Espacio cerrado con nombre — cocina, baño, recámara.' },
  'Interior wall': { term: 'Pared interior (Interior wall)', def: 'Pared que parte un espacio grande en cuartos.' },
  Dimension: { term: 'Cota (Dimension)', def: 'Etiqueta de tamaño en una pared o espacio.' },
  'Door swing': { term: 'Giro de puerta (Door swing)', def: 'Curva que muestra hacia dónde abre la puerta.' },
  Opening: { term: 'Vano (Opening)', def: 'Puerta o ventana cortada en una pared.' },
  Circulation: { term: 'Circulación (Circulation)', def: 'Cómo camina la gente por el plano. (También tráfico.)' },
  Grid: { term: 'Cuadrícula (Grid)', def: 'Líneas parejas que ayudan a dibujar a escala.' },
  Snap: { term: 'Imán (Snap)', def: 'El puntero salta a la cuadrícula para que las líneas queden limpias.' },
  Gable: { term: 'A dos aguas (Gable)', def: 'Dos pendientes se juntan en una cumbrera — extremos en triángulo.' },
  Hip: { term: 'A cuatro aguas (Hip)', def: 'Pendientes en todos los lados hacia arriba.' },
  Gambrel: { term: 'Gambrel', def: 'Techo de granero — dos pendientes por lado.' },
  Shed: { term: 'Un agua (Shed)', def: 'Una sola pendiente, como un cobertizo.' },
  Flat: { term: 'Plano (Flat)', def: 'Casi plano arriba.' },
  Mansard: { term: 'Mansarda (Mansard)', def: 'Lados empinados + cima más plana.' },
  'Grass / sod': { term: 'Yerba / sod (Grass)', def: 'Techo vivo verde con plantas. (Hobbit.)' },
  Conical: { term: 'Cónico (Conical)', def: 'Techo de cono sobre planta redonda. (Yurta.)' },
  Ridge: { term: 'Cumbrera (Ridge)', def: 'La línea alta donde se juntan las pendientes.' },
  'Kitchen triangle': { term: 'Triángulo de cocina', def: 'Camino entre fregadero, fogón y refrigerador. Que sea corto.' },
  'Floor area': { term: 'Área de piso (Floor area)', def: 'Qué tan grande es la casa por dentro, en pies cuadrados.' },
  'Accessible route': { term: 'Ruta accesible', def: 'Camino de 3 pies para silla de ruedas — de la puerta a los cuartos.' },
  'Clear width': { term: 'Ancho libre (Clear width)', def: 'El hueco de una puerta. ADA pide 32 pulgadas.' },
  'Turning circle': { term: 'Círculo de giro', def: 'Un círculo de 5 pies para girar una silla, casi siempre en el baño.' },
  Den: { term: 'Caseta (Den)', def: 'Caja chica para dormir. Una caseta de perro es un cuarto, no un plano de personas.' },
  'Offset door': { term: 'Puerta descentrada (Offset door)', def: 'Vano no en el medio — el viento y la lluvia no dan en la cama.' },
  'Body heat': { term: 'Calor corporal (Body heat)', def: 'Una caseta justa se calienta. Si es muy grande, el perro no la calienta.' },
};

/** Ukrainian classroom gloss — English CAD term stays in ( ). */
export const VOCAB_UK: Record<string, VocabGloss> = {
  Sketch: { term: 'Ескіз (Sketch)', def: 'Вільна олівцева лінія. Спочатку ескіз, потім прямі стіни.' },
  Trace: { term: 'Обвести (Trace)', def: 'Перетворює ескіз на прямі стіни. Олівець лишається знизу.' },
  Wall: { term: 'Стіна (Wall)', def: 'Лінія, що робить кімнату. Клікни початок, потім інший кінець.' },
  Door: { term: 'Двері (Door)', def: 'Проріз, крізь який заходять. Клікни саме на стіну.' },
  Window: { term: 'Вікно (Window)', def: 'Проріз, що пускає світло. Клікни стіну навпроти дверей.' },
  Scale: { term: 'Масштаб (Scale)', def: 'Розмір рисунка проти справжнього. Приклад: 1 клітинка = 1 фут.' },
  North: { term: 'Північ (North)', def: 'Верх аркуша. Плани тримають північ угорі, щоб усі читали однаково.' },
  'Title block': { term: 'Штамп (Title block)', def: 'Назва, масштаб і дата на кресленні. На кожному аркуші є.' },
  Envelope: { term: 'Оболонка (Envelope)', def: 'Зовнішні стіни, що замикають дім від погоди.' },
  'Overall dimension': { term: 'Габарит (Overall dimension)', def: 'Великий зовнішній розмір — ширина й глибина всієї оболонки.' },
  Isometric: { term: 'Ізометрія (Isometric)', def: 'Вид 3/4. Три осі. Висота правдива. Не фото.' },
  Oblique: { term: 'Коса (Oblique)', def: 'Фасад правдивого розміру. Глибина тікає під 45° і малюється коротшою (cabinet).' },
  Elevation: { term: 'Фасад (Elevation)', def: 'Одна стіна будинку, правдива ширина й висота. Дивитись просто на стіну.' },
  Orthographic: { term: 'Ортогональна (Orthographic)', def: 'Без кута й стиску. Фасади спереду/збоку/ззаду і вид зверху (план).' },
  'Floor plan': { term: 'План поверху (Floor plan)', def: 'Дивитись на кімнати згори.' },
  Flooring: { term: 'Підлога (Flooring)', def: 'Оздоблення підлоги — дерево, кахель, килим або бетон.' },
  Hardwood: { term: 'Паркет (Hardwood)', def: 'Дерев’яні дошки. Дуб і клен — тверді породи.' },
  Tile: { term: 'Кахель (Tile)', def: 'Тверді квадрати — кухня й ванна лишаються сухими.' },
  Carpet: { term: 'Килим (Carpet)', def: 'М’який ворс. Тихо в спальні.' },
  Room: { term: 'Кімната (Room)', def: 'Замкнений простір з назвою — кухня, ванна, спальня.' },
  'Interior wall': { term: 'Внутрішня стіна (Interior wall)', def: 'Стіна, що ділить великий простір на кімнати.' },
  Dimension: { term: 'Розмір (Dimension)', def: 'Підпис розміру на стіні чи просторі.' },
  'Door swing': { term: 'Дуга дверей (Door swing)', def: 'Крива, що показує, куди відчиняються двері.' },
  Opening: { term: 'Проріз (Opening)', def: 'Двері або вікно, вирізані в стіні.' },
  Circulation: { term: 'Рух (Circulation)', def: 'Як люди ходять планом. (Також трафік.)' },
  Grid: { term: 'Сітка (Grid)', def: 'Рівні лінії, що допомагають малювати в розмір.' },
  Snap: { term: 'Прив’язка (Snap)', def: 'Вказівник стрибає на сітку, щоб лінії були рівні.' },
  Gable: { term: 'Двосхилий (Gable)', def: 'Два схили зустрічаються на гребені — трикутні торці.' },
  Hip: { term: 'Вальмовий (Hip)', def: 'Схили з усіх боків сходяться вгору.' },
  Gambrel: { term: 'Гамбрель (Gambrel)', def: 'Дах як у стодоли — два нахили з кожного боку.' },
  Shed: { term: 'Односхилий (Shed)', def: 'Один схил, як навіс.' },
  Flat: { term: 'Плоский (Flat)', def: 'Майже рівний зверху.' },
  Mansard: { term: 'Мансарда (Mansard)', def: 'Круті боки + плоскіша вершина.' },
  'Grass / sod': { term: 'Трава / дерен (Grass)', def: 'Живий зелений дах із рослинами. (Гобіт.)' },
  Conical: { term: 'Конічний (Conical)', def: 'Дах-конус на круглому плані. (Юрта.)' },
  Ridge: { term: 'Гребінь (Ridge)', def: 'Висока лінія, де сходяться схили даху.' },
  'Kitchen triangle': { term: 'Кухонний трикутник', def: 'Шлях між мийкою, плитою й холодильником. Хай буде короткий.' },
  'Floor area': { term: 'Площа підлоги (Floor area)', def: 'Наскільки великий будинок усередині, у квадратних футах.' },
  'Accessible route': { term: 'Доступний шлях', def: 'Доріжка завширшки 3 фути для візка — від дверей до кімнат.' },
  'Clear width': { term: 'Чиста ширина (Clear width)', def: 'Вільний прохід у дверях. ADA просить 32 дюйми.' },
  'Turning circle': { term: 'Коло розвороту', def: 'Коло 5 футів, щоб візок міг розвернутися, часто у ванні.' },
  Den: { term: 'Лігво (Den)', def: 'Тісна спальна коробка. Будка — одна кімната, не план для людей.' },
  'Offset door': { term: 'Зсунуті двері (Offset door)', def: 'Проріз не посередині — вітер і дощ минають ліжко.' },
  'Body heat': { term: 'Тілесне тепло (Body heat)', def: 'Лігво якраз за розміром гріється. Завелике — собака не нагріє.' },
};

/** Russian classroom gloss — English CAD term stays in ( ). */
export const VOCAB_RU: Record<string, VocabGloss> = {
  Sketch: { term: 'Эскиз (Sketch)', def: 'Свободная карандашная линия. Сначала эскиз, потом прямые стены.' },
  Trace: { term: 'Обвести (Trace)', def: 'Превращает эскиз в прямые стены. Карандаш остаётся снизу.' },
  Wall: { term: 'Стена (Wall)', def: 'Линия, которая делает комнату. Кликни начало, потом другой конец.' },
  Door: { term: 'Дверь (Door)', def: 'Проём, через который входят. Кликни прямо на стену.' },
  Window: { term: 'Окно (Window)', def: 'Проём, который пускает свет. Кликни стену напротив двери.' },
  Scale: { term: 'Масштаб (Scale)', def: 'Размер рисунка против настоящего. Пример: 1 клетка = 1 фут.' },
  North: { term: 'Север (North)', def: 'Верх листа. Планы держат север вверху, чтобы все читали одинаково.' },
  'Title block': { term: 'Штамп (Title block)', def: 'Имя, масштаб и дата на чертеже. На каждом листе есть.' },
  Envelope: { term: 'Оболочка (Envelope)', def: 'Наружные стены, которые закрывают дом от погоды.' },
  'Overall dimension': { term: 'Габарит (Overall dimension)', def: 'Большой внешний размер — ширина и глубина всей оболочки.' },
  Isometric: { term: 'Изометрия (Isometric)', def: 'Вид 3/4. Три оси. Высота верная. Не фото.' },
  Oblique: { term: 'Косая (Oblique)', def: 'Фасад верного размера. Глубина уходит под 45° и рисуется короче (cabinet).' },
  Elevation: { term: 'Фасад (Elevation)', def: 'Одна стена дома, верная ширина и высота. Смотреть прямо на стену.' },
  Orthographic: { term: 'Ортогональная (Orthographic)', def: 'Без угла и сжатия. Фасады спереди/сбоку/сзади и вид сверху (план).' },
  'Floor plan': { term: 'План этажа (Floor plan)', def: 'Смотреть на комнаты сверху.' },
  Flooring: { term: 'Пол (Flooring)', def: 'Отделка пола — дерево, кафель, ковёр или бетон.' },
  Hardwood: { term: 'Паркет (Hardwood)', def: 'Деревянные доски. Дуб и клён — твёрдые породы.' },
  Tile: { term: 'Кафель (Tile)', def: 'Твёрдые квадраты — кухня и ванная остаются сухими.' },
  Carpet: { term: 'Ковёр (Carpet)', def: 'Мягкий ворс. Тихо в спальне.' },
  Room: { term: 'Комната (Room)', def: 'Закрытое пространство с именем — кухня, ванная, спальня.' },
  'Interior wall': { term: 'Внутренняя стена (Interior wall)', def: 'Стена, которая делит большое пространство на комнаты.' },
  Dimension: { term: 'Размер (Dimension)', def: 'Подпись размера на стене или пространстве.' },
  'Door swing': { term: 'Дуга двери (Door swing)', def: 'Кривая, которая показывает, куда открывается дверь.' },
  Opening: { term: 'Проём (Opening)', def: 'Дверь или окно, вырезанные в стене.' },
  Circulation: { term: 'Движение (Circulation)', def: 'Как люди ходят по плану. (Также трафик.)' },
  Grid: { term: 'Сетка (Grid)', def: 'Ровные линии, которые помогают рисовать в размер.' },
  Snap: { term: 'Привязка (Snap)', def: 'Указатель прыгает на сетку, чтобы линии были ровные.' },
  Gable: { term: 'Двускатная (Gable)', def: 'Два ската встречаются на коньке — треугольные торцы.' },
  Hip: { term: 'Вальмовая (Hip)', def: 'Скаты со всех сторон сходятся вверх.' },
  Gambrel: { term: 'Гамбрель (Gambrel)', def: 'Крыша как у сарая — два наклона с каждой стороны.' },
  Shed: { term: 'Односкатная (Shed)', def: 'Один скат, как навес.' },
  Flat: { term: 'Плоская (Flat)', def: 'Почти ровная сверху.' },
  Mansard: { term: 'Мансарда (Mansard)', def: 'Крутые бока + более плоская вершина.' },
  'Grass / sod': { term: 'Трава / дёрн (Grass)', def: 'Живая зелёная крыша с растениями. (Хоббит.)' },
  Conical: { term: 'Коническая (Conical)', def: 'Крыша-конус на круглом плане. (Юрта.)' },
  Ridge: { term: 'Конёк (Ridge)', def: 'Высокая линия, где сходятся скаты крыши.' },
  'Kitchen triangle': { term: 'Кухонный треугольник', def: 'Путь между мойкой, плитой и холодильником. Пусть будет короткий.' },
  'Floor area': { term: 'Площадь пола (Floor area)', def: 'Насколько большой дом внутри, в квадратных футах.' },
  'Accessible route': { term: 'Доступный путь', def: 'Дорожка шириной 3 фута для коляски — от двери до комнат.' },
  'Clear width': { term: 'Чистая ширина (Clear width)', def: 'Свободный проход в двери. ADA просит 32 дюйма.' },
  'Turning circle': { term: 'Круг разворота', def: 'Круг 5 футов, чтобы коляска могла развернуться, часто в ванной.' },
  Den: { term: 'Конура (Den)', def: 'Тесная спальная коробка. Собачья будка — одна комната, не план для людей.' },
  'Offset door': { term: 'Сдвинутая дверь (Offset door)', def: 'Проём не посередине — ветер и дождь минуют лежанку.' },
  'Body heat': { term: 'Тепло тела (Body heat)', def: 'Конура как раз по размеру греется. Слишком большая — собака не нагреет.' },
};

/** Tigrigna classroom gloss — English CAD term stays in ( ). */
export const VOCAB_TI: Record<string, VocabGloss> = {
  Sketch: { term: 'ስእሊ (Sketch)', def: 'ናይ ኢድ መስመር ብርዒ. መጀመርታ ስእሊ፣ ድሕሪኡ ቀጥታ መናድቕ.' },
  Trace: { term: 'ቀጥታ (Trace)', def: 'ስእሊ ናብ ቀጥታ መናድቕ ይቕይር. እቲ ብርዒ ኣብ ታሕቲ ይተርፍ.' },
  Wall: { term: 'መንደቕ (Wall)', def: 'ክፍሊ ዝገብር መስመር. ጠውቕ መጀመርታ፣ ድሕሪኡ እቲ ካልእ ጫፍ.' },
  Door: { term: 'ማዕጾ (Door)', def: 'እትኣትወላ ክፋት. ቀጥታ ኣብ መንደቕ ጠውቕ.' },
  Window: { term: 'መስኮት (Window)', def: 'ብርሃን ዘእቱ ክፋት. ኣብቲ ንማዕጾ ዝቃወም መንደቕ ጠውቕ.' },
  Scale: { term: 'መለክዒ (Scale)', def: 'ዓቐን ስእሊ ምስ ሓቀኛ ዓቐን. ኣብነት፦ 1 መርበብ = 1 እግሪ.' },
  North: { term: 'ሰሜን (North)', def: 'ላዕሊ ናይቲ ወረቐት. ትልምታት ሰሜን ኣብ ላዕሊ የቐምጡ ምእንቲ ኩሉ ከም ሓደ ክነብብ.' },
  'Title block': { term: 'ሳጹን ስም (Title block)', def: 'ስም፣ መለክዒን ዕለትን ኣብቲ ስእሊ. ነፍሲ ወከፍ ወረቐት ኣለዋ.' },
  Envelope: { term: 'መዓንጽ (Envelope)', def: 'እቶም ናይ ደገ መናድቕ ገዛ ካብ ኩነታት ኣየር ዝዕጽዉ.' },
  'Overall dimension': { term: 'ምሉእ ዓቐን (Overall dimension)', def: 'እቲ ዓቢ ናይ ደገ ዓቐን — ስፍሓትን ዕምቆትን ናይ መዓንጽ.' },
  Isometric: { term: 'ኢሶሜትሪክ (Isometric)', def: 'ትርኢት 3/4. ሰለስተ መስመር. ቁመት ሓቀኛ እዩ. ስእሊ ኣይኮነን.' },
  Oblique: { term: 'ኣንጻር (Oblique)', def: 'ቅድሚት ሓቀኛ ዓቐን እያ. ዕምቆት ብ 45° ትኸይድን ሓጺር ትስኣልን (cabinet).' },
  Elevation: { term: 'ምልቃሕ (Elevation)', def: 'ሓደ ገጽ ናይ ገዛ፣ ሓቀኛ ስፍሓትን ቁመትን. ቀጥታ ኣብ መንደቕ ምርኣይ.' },
  Orthographic: { term: 'ኦርቶግራፊክ (Orthographic)', def: 'ኣንግል የለን፣ ምጽቃጥ የለን. ምልቃሕ ቅድሚት/ጎኒ/ድሕሪትን ትርኢት ላዕሊን (ትልሚ).' },
  'Floor plan': { term: 'ትልሚ ወለል (Floor plan)', def: 'ነቶም ክፍልታት ካብ ላዕሊ ምርኣይ.' },
  Flooring: { term: 'ወለል (Flooring)', def: 'ናይ ወለል መወዳእታ — እንጨት፣ ታይል፣ ምንጻፍ ወይ ኮንክሪት.' },
  Hardwood: { term: 'እንጨት ወለል (Hardwood)', def: 'ሰሌዳ እንጨት. ኦክን መፕልን ጽኑዕ እንጨት እዮም.' },
  Tile: { term: 'ታይል (Tile)', def: 'ጽኑዕ ትርብዑ — ክሽነን ሽቃቅን ንጹህ ይጸንሑ.' },
  Carpet: { term: 'ምንጻፍ (Carpet)', def: 'ልስሉስ ጸጉሪ. ኣብ መደቀሲ ስቕታ.' },
  Room: { term: 'ክፍሊ (Room)', def: 'ዝተዓጽወ ቦታ ምስ ስም — ክሽነ፣ ሽቃቅ፣ መደቀሲ.' },
  'Interior wall': { term: 'ውሽጣዊ መንደቕ (Interior wall)', def: 'ዓቢ ቦታ ናብ ክፍልታት ዝመቕል መንደቕ.' },
  Dimension: { term: 'ዓቐን (Dimension)', def: 'ምልክት ዓቐን ኣብ መንደቕ ወይ ቦታ.' },
  'Door swing': { term: 'ምኽፋት ማዕጾ (Door swing)', def: 'ማዕጾ ናበይ ከም እትኽፈት ዘርኢ ቅስም.' },
  Opening: { term: 'ክፋት (Opening)', def: 'ኣብ መንደቕ ዝተቖረጸ ማዕጾ ወይ መስኮት.' },
  Circulation: { term: 'ምንቅስቓስ (Circulation)', def: 'ሰባት ከመይ ከም ዝኸዱ ኣብቲ ትልሚ. (ትራፊክ ድማ.)' },
  Grid: { term: 'መርበብ (Grid)', def: 'ማዕረ መስመራት ንምስኣል ብዓቐን ይሕግዙ.' },
  Snap: { term: 'ምልጣፍ (Snap)', def: 'እቲ መጠወቒ ናብ መርበብ ይዘልል ምእንቲ መስመራት ጽሩይ ክኾኑ.' },
  Gable: { term: 'ክልተ ስኒ (Gable)', def: 'ክልተ ውድቀታት ኣብ ጫፍ ይራኸቡ — ጫፋት ስሉስ ኩርናዕ.' },
  Hip: { term: 'ኣርባዕተ ስኒ (Hip)', def: 'ውድቀታት ካብ ኩሉ ጎኒ ናብ ላዕሊ ይራኸቡ.' },
  Gambrel: { term: 'ጋምብረል (Gambrel)', def: 'ጣራ ከም ጎተራ — ክልተ ውድቀት ኣብ ነፍሲ ወከፍ ጎኒ.' },
  Shed: { term: 'ሓደ ስኒ (Shed)', def: 'ሓደ ውድቀት፣ ከም ድንኳን.' },
  Flat: { term: 'ጸፊሕ (Flat)', def: 'ኣብ ላዕሊ ዳርጋ ጸፊሕ.' },
  Mansard: { term: 'ማንሳርድ (Mansard)', def: 'ቁልቁል ጎኒታት + ዝለዓለ ጸፊሕ ጫፍ.' },
  'Grass / sod': { term: 'ሳዕሪ (Grass)', def: 'ቀጠልያ ህያው ጣራ ምስ ተኽልታት. (ሆቢት.)' },
  Conical: { term: 'ኮን (Conical)', def: 'ጣራ ኮን ኣብ ክቢ ትልሚ. (ዩርት.)' },
  Ridge: { term: 'ጫፍ ጣራ (Ridge)', def: 'እቲ ልዑል መስመር ኣብቲ ውድቀታት ጣራ ዝራኸባ.' },
  'Kitchen triangle': { term: 'ስሉስ ኩርናዕ ክሽነ', def: 'መንገዲ ኣብ መንጎ ሕጻብ፣ ምድጃን ፍሪጅን. ሓጺር ይኹን.' },
  'Floor area': { term: 'ስፍሓት ወለል (Floor area)', def: 'እታ ገዛ ኣብ ውሽጢ ክንደይ ዓባይ፣ ብትርብዕ እግሪ.' },
  'Accessible route': { term: 'መእተዊ መንገዲ', def: '3 እግሪ ስፍሓት መንገዲ ንሽቃቅ — ካብ ማዕጾ ናብ ክፍልታት.' },
  'Clear width': { term: 'ጽሩይ ስፍሓት (Clear width)', def: 'እቲ ክፉት ቦታ ኣብ ማዕጾ. ADA 32 ኢንች ይሓትት.' },
  'Turning circle': { term: 'ክቢ ምዝዋር', def: '5 እግሪ ክቢ ሽቃቅ ክዘውር፣ መብዛሕትኡ ኣብ ሽቃቅ.' },
  Den: { term: 'መደቀሲ (Den)', def: 'ጽቡቕ ንእሽቶ ሳጹን ድቃስ. ገዛ ከልቢ ሓደ ክፍሊ እዩ፣ ናይ ሰብ ትልሚ ኣይኮነን.' },
  'Offset door': { term: 'ዝተንቀሳቐሰ ማዕጾ (Offset door)', def: 'ክፋት ኣብ ማእከል ኣይኮነን — ንፋስን ዝናብን ነቲ መደቀሲ ኣየንክፉን.' },
  'Body heat': { term: 'ውዑይ ኣካል (Body heat)', def: 'ልክዕ ዓቐን መደቀሲ ይውዕይ. ዝዓበየ — እቲ ከልቢ ኣየውዕዮን.' },
};

/** Farsi classroom gloss — English CAD term stays in ( ). */
export const VOCAB_FA: Record<string, VocabGloss> = {
  Sketch: { term: 'طرح (Sketch)', def: 'خط آزاد با مداد. اول طرح، بعد دیوارهای راست.' },
  Trace: { term: 'خط‌کشی (Trace)', def: 'طرح را به دیوار راست بدل می‌کند. خط مداد زیر می‌ماند.' },
  Wall: { term: 'دیوار (Wall)', def: 'خطی که اتاق می‌سازد. کلیک شروع، بعد سر دیگر.' },
  Door: { term: 'در (Door)', def: 'دهانه‌ای که از آن راه می‌روی. درست روی دیوار کلیک کن.' },
  Window: { term: 'پنجره (Window)', def: 'دهانه‌ای که نور می‌دهد. دیوار روبه‌روی در را کلیک کن.' },
  Scale: { term: 'مقیاس (Scale)', def: 'اندازهٔ نقاشی در برابر اندازهٔ واقعی. مثال: ۱ خانه = ۱ فوت.' },
  North: { term: 'شمال (North)', def: 'بالای برگه. پلان‌ها شمال را بالا می‌گذارند تا همه یک‌جور بخوانند.' },
  'Title block': { term: 'کادر عنوان (Title block)', def: 'نام، مقیاس و تاریخ روی نقشه. هر برگه یکی دارد.' },
  Envelope: { term: 'پوسته (Envelope)', def: 'دیوارهای بیرونی که خانه را از هوا می‌بندند.' },
  'Overall dimension': { term: 'اندازهٔ کلی (Overall dimension)', def: 'اندازهٔ بزرگ بیرونی — پهنا و عمق همهٔ پوسته.' },
  Isometric: { term: 'ایزومتریک (Isometric)', def: 'نمای سه‌چهارم. هر سه محور. ارتفاع درست می‌ماند. عکس نیست.' },
  Oblique: { term: 'مایل (Oblique)', def: 'روبرو اندازهٔ واقعی است. عمق با ۴۵ درجه پس می‌رود و کوتاه‌تر کشیده می‌شود (cabinet).' },
  Elevation: { term: 'نما (Elevation)', def: 'یک رخ خانه، پهنا و ارتفاع واقعی. نگاه مستقیم به دیوار.' },
  Orthographic: { term: 'متعامد (Orthographic)', def: 'بدون زاویه، بدون فشردن. نماهای روبرو/پهلو/پشت و نمای بالا (پلان).' },
  'Floor plan': { term: 'پلان کف (Floor plan)', def: 'نگاه از بالا به اتاق‌ها.' },
  Flooring: { term: 'کف (Flooring)', def: 'رویهٔ کف — چوب، کاشی، موکت یا بتن.' },
  Hardwood: { term: 'چوب سخت (Hardwood)', def: 'تخته‌های چوب. بلوط و افرا چوب سخت‌اند.' },
  Tile: { term: 'کاشی (Tile)', def: 'مربع‌های سخت — آشپزخانه و حمام خشک می‌مانند.' },
  Carpet: { term: 'موکت (Carpet)', def: 'پرز نرم. در خواب آرام است.' },
  Room: { term: 'اتاق (Room)', def: 'فضای بسته با نام — آشپزخانه، حمام، خواب.' },
  'Interior wall': { term: 'دیوار داخلی (Interior wall)', def: 'دیواری که یک فضای بزرگ را به اتاق‌ها می‌بُرد.' },
  Dimension: { term: 'اندازه (Dimension)', def: 'برچسب اندازه روی دیوار یا فضا.' },
  'Door swing': { term: 'قوس در (Door swing)', def: 'خمیدگی که نشان می‌دهد در به کدام سو باز می‌شود.' },
  Opening: { term: 'دهانه (Opening)', def: 'در یا پنجره‌ای که در دیوار بریده شده.' },
  Circulation: { term: 'گردش (Circulation)', def: 'چگونه مردم در پلان راه می‌روند. (همان ترافیک.)' },
  Grid: { term: 'شبکه (Grid)', def: 'خط‌های یکنواخت که کمک می‌کنند به اندازه بکشی.' },
  Snap: { term: 'چسبیدن (Snap)', def: 'نشانگر به شبکه می‌پرد تا خط‌ها تمیز بمانند.' },
  Gable: { term: 'دو شیب (Gable)', def: 'دو شیب در خط‌الراس به هم می‌رسند — دو سر سه‌گوش.' },
  Hip: { term: 'چهار شیب (Hip)', def: 'شیب‌ها از همهٔ سمت‌ها به بالا می‌رسند.' },
  Gambrel: { term: 'گامبرل (Gambrel)', def: 'سقف انبارمانند — دو شیب در هر سمت.' },
  Shed: { term: 'یک شیب (Shed)', def: 'یک شیب تنها، مثل سایه‌بان.' },
  Flat: { term: 'تخت (Flat)', def: 'تقریباً صاف از بالا.' },
  Mansard: { term: 'مانسارد (Mansard)', def: 'پهلوی تند + بالای صاف‌تر.' },
  'Grass / sod': { term: 'چمن / sod (Grass)', def: 'سقف زندهٔ سبز با گیاه. (هابیت.)' },
  Conical: { term: 'مخروطی (Conical)', def: 'سقف مخروط روی پلان گرد. (یورت.)' },
  Ridge: { term: 'خط‌الراس (Ridge)', def: 'خط بلند جایی که شیب‌های سقف به هم می‌رسند.' },
  'Kitchen triangle': { term: 'سه‌گوش آشپزخانه', def: 'راه بین ظرفشویی، اجاق و یخچال. کوتاه بماند.' },
  'Floor area': { term: 'مساحت کف (Floor area)', def: 'خانه از داخل چقدر بزرگ است، به فوت مربع.' },
  'Accessible route': { term: 'مسیر دسترس‌پذیر', def: 'راه ۳ فوتی که ویلچر بتواند بغلطد — از در تا اتاق‌ها.' },
  'Clear width': { term: 'پهنای آزاد (Clear width)', def: 'فضای باز از در. ADA ۳۲ اینچ می‌خواهد.' },
  'Turning circle': { term: 'دایرهٔ برگشت', def: 'دایرهٔ ۵ فوتی تا ویلچر بچرخد، معمولاً در حمام.' },
  Den: { term: 'لانه (Den)', def: 'جعبهٔ خواب تنگ. خانه سگ یک اتاق است، نه پلان آدم‌ها.' },
  'Offset door': { term: 'در کناررفته (Offset door)', def: 'دهانه وسط دیوار نیست — باد و باران به بستر نمی‌خورد.' },
  'Body heat': { term: 'گرمای بدن (Body heat)', def: 'لانهٔ درست‌اندازه گرم می‌ماند. خیلی بزرگ — سگ گرمش نمی‌کند.' },
};

export const VOCAB_PACKS: Record<Exclude<Locale, 'en'>, Record<string, VocabGloss>> = {
  es: VOCAB_ES,
  cu: VOCAB_CU,
  uk: VOCAB_UK,
  ru: VOCAB_RU,
  ti: VOCAB_TI,
  fa: VOCAB_FA,
};

export function vocabGloss(locale: Locale | null | undefined, entry: VocabGloss): VocabGloss {
  const loc = asLocale(locale);
  if (loc === 'en') return entry;
  return VOCAB_PACKS[loc]?.[entry.term] ?? entry;
}

export function vocabHomeWord(locale: Locale | null | undefined, entry: VocabGloss): string {
  const gloss = vocabGloss(locale, entry);
  return homePhrase(gloss.term, entry.term);
}

export type EllVocabCard = {
  en: string;
  home: string | null;
  defEn: string;
  defHome: string | null;
};

export function ellVocabCard(locale: Locale | null | undefined, entry: VocabGloss): EllVocabCard {
  const loc = asLocale(locale);
  const gloss = vocabGloss(loc, entry);
  const home = loc === 'en' ? null : vocabHomeWord(loc, entry);
  return {
    en: entry.term,
    home: home && home !== entry.term ? home : null,
    defEn: entry.def,
    defHome: loc === 'en' || gloss.def === entry.def ? null : gloss.def,
  };
}

/** High-frequency CAD words for grades 5–8 ELL retrieval practice. */
export const ELL_PRACTICE_TERMS = [
  'Sketch', 'Wall', 'Door', 'Window', 'Room', 'Scale', 'Grid', 'Dimension',
] as const;

export const ELL_PRACTICE_DOG = [
  'Sketch', 'Wall', 'Door', 'Den', 'Opening', 'Grid', 'Dimension', 'Offset door',
] as const;

export function ellPracticeEntries(dogHouse: boolean): VocabGloss[] {
  const names = dogHouse ? ELL_PRACTICE_DOG : ELL_PRACTICE_TERMS;
  return names
    .map((name) => VOCAB.find((v) => v.term === name))
    .filter((v): v is VocabGloss => !!v);
}

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

/** Named rooms students should tag (space-planning spine). */
export const ROOM_CHECKLIST: { id: string; kinds: string[]; label: string }[] = [
  { id: 'living', kinds: ['living', 'dining'], label: 'Living / dining' },
  { id: 'kitchen', kinds: ['kitchen'], label: 'Kitchen' },
  { id: 'bath', kinds: ['bath'], label: 'Bath' },
  { id: 'sleep', kinds: ['bedroom'], label: 'Bedroom / sleep' },
  { id: 'entry', kinds: ['entry'], label: 'Entry' },
];
