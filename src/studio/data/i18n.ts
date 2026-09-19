/** Classroom language packs. Academic CAD terms stay in English inside ( ). */
import type { Locale } from '../types';

export type { Locale };

export const LOCALES: Locale[] = ['en', 'es', 'cu', 'uk', 'ru', 'ti', 'fa'];

export const LOCALE_OPTIONS: {
  id: Locale;
  label: string;
  blurb: string;
  htmlLang: string;
  dir: 'ltr' | 'rtl';
}[] = [
  { id: 'en', label: 'English', blurb: 'Classroom English', htmlLang: 'en', dir: 'ltr' },
  { id: 'es', label: 'Español', blurb: 'Spanish · English words in ( )', htmlLang: 'es', dir: 'ltr' },
  { id: 'cu', label: 'Cubano', blurb: 'Cuban Spanish · English words in ( )', htmlLang: 'es-CU', dir: 'ltr' },
  { id: 'uk', label: 'Українська', blurb: 'Ukrainian · English words in ( )', htmlLang: 'uk', dir: 'ltr' },
  { id: 'ru', label: 'Русский', blurb: 'Russian · English words in ( )', htmlLang: 'ru', dir: 'ltr' },
  { id: 'ti', label: 'ትግርኛ', blurb: 'Tigrigna · English words in ( )', htmlLang: 'ti', dir: 'ltr' },
  { id: 'fa', label: 'فارسی', blurb: 'Farsi · English words in ( )', htmlLang: 'fa', dir: 'rtl' },
];

export const DEFAULT_LOCALE: Locale = 'en';

type Gloss = Record<Locale, string>;

function g(en: string, rest: Omit<Gloss, 'en'>): Gloss {
  return { en, ...rest };
}

export const STR: Record<string, Gloss> = {
  'lang.title': g('Language', {
    es: 'Idioma', cu: 'Idioma', uk: 'Мова', ru: 'Язык', ti: 'ቋንቋ', fa: 'زبان',
  }),
  'lang.english': g('English', {
    es: 'Inglés', cu: 'Inglés', uk: 'Англійська', ru: 'Английский', ti: 'እንግሊዝኛ', fa: 'انگلیسی',
  }),
  'lang.spanish': g('Español', {
    es: 'Español', cu: 'Español', uk: 'Іспанська', ru: 'Испанский', ti: 'ስጳንኛ', fa: 'اسپانیایی',
  }),
  'lang.lead': g('Same pictures. English CAD words come first so grades 5–8 can learn them. Home language sits under.', {
    es: 'Las mismas fotos. La palabra de dibujo en inglés va primero para que los grados 5–8 la aprendan. El idioma de casa va debajo.',
    cu: 'Las mismas fotos. La palabra de dibujo en inglés va primero para que los grados 5–8 la aprendan. El idioma de casa va debajo.',
    uk: 'Ті самі малюнки. Англійське слово креслення стоїть першим, щоб 5–8 класи його вчили. Мова дому — під ним.',
    ru: 'Те же картинки. Английское слово чертежа стоит первым, чтобы 5–8 классы его учили. Язык дома — под ним.',
    ti: 'ተመሳሳሊ ስእልታት. እንግሊዝኛ ቃል ቅድሚት ትመጽእ ምእንቲ ክፍሊ 5–8 ክመሃርዋ. ቋንቋ ገዛ ኣብ ታሕቲ እያ.',
    fa: 'همان تصویرها. واژهٔ انگلیسی نقشه اول می‌آید تا کلاس ۵ تا ۸ یاد بگیرند. زبان خانه زیر آن است.',
  }),

  'tool.select': g('Select', {
    es: 'Elegir (Select)', cu: 'Escoger (Select)', uk: 'Обрати (Select)', ru: 'Выбрать (Select)', ti: 'ምረጽ (Select)', fa: 'انتخاب (Select)',
  }),
  'tool.sketch': g('Sketch', {
    es: 'Boceto (Sketch)', cu: 'Boceto (Sketch)', uk: 'Ескіз (Sketch)', ru: 'Эскиз (Sketch)', ti: 'ስእሊ (Sketch)', fa: 'طرح (Sketch)',
  }),
  'tool.wall': g('Wall', {
    es: 'Muro (Wall)', cu: 'Pared (Wall)', uk: 'Стіна (Wall)', ru: 'Стена (Wall)', ti: 'መንደቕ (Wall)', fa: 'دیوار (Wall)',
  }),
  'tool.door': g('Door', {
    es: 'Puerta (Door)', cu: 'Puerta (Door)', uk: 'Двері (Door)', ru: 'Дверь (Door)', ti: 'ማዕጾ (Door)', fa: 'در (Door)',
  }),
  'tool.window': g('Window', {
    es: 'Ventana (Window)', cu: 'Ventana (Window)', uk: 'Вікно (Window)', ru: 'Окно (Window)', ti: 'መስኮት (Window)', fa: 'پنجره (Window)',
  }),
  'tool.furniture': g('Furn.', {
    es: 'Mueble', cu: 'Mueble', uk: 'Меблі', ru: 'Мебель', ti: 'ኣቓሑት', fa: 'مبلمان',
  }),
  'tool.room': g('Room', {
    es: 'Cuarto (Room)', cu: 'Cuarto (Room)', uk: 'Кімната (Room)', ru: 'Комната (Room)', ti: 'ክፍሊ (Room)', fa: 'اتاق (Room)',
  }),
  'tool.dim': g('Size', {
    es: 'Medida', cu: 'Medida', uk: 'Розмір', ru: 'Размер', ti: 'ዓቐን', fa: 'اندازه',
  }),
  'tool.note': g('Note', {
    es: 'Nota', cu: 'Nota', uk: 'Нотатка', ru: 'Заметка', ti: 'መዘኻኸሪ', fa: 'یادداشت',
  }),
  'tool.plant': g('Plant', {
    es: 'Planta', cu: 'Planta', uk: 'Рослина', ru: 'Растение', ti: 'ተኽል', fa: 'گیاه',
  }),
  'tool.pan': g('Pan', {
    es: 'Mover', cu: 'Mover', uk: 'Зсунути', ru: 'Сдвинуть', ti: 'ኣንቀሳቕስ', fa: 'جابه‌جا',
  }),
  'tool.trace': g('Trace', {
    es: 'Trazar', cu: 'Trazar', uk: 'Обвести', ru: 'Обвести', ti: 'ቀጥታ', fa: 'خط‌کشی',
  }),
  'tool.clip': g('Clip', {
    es: 'Recorte', cu: 'Recorte', uk: 'Зріз', ru: 'Срез', ti: 'ቑረጽ', fa: 'برش',
  }),
  'tool.more': g('More', {
    es: 'Más', cu: 'Más', uk: 'Ще', ru: 'Ещё', ti: 'ተወሳኺ', fa: 'بیشتر',
  }),
  'tool.min': g('Min', {
    es: 'Min', cu: 'Min', uk: 'Згорнути', ru: 'Свернуть', ti: 'ኣሕጽር', fa: 'جمع',
  }),
  'tool.list': g('List', {
    es: 'Lista', cu: 'Lista', uk: 'Список', ru: 'Список', ti: 'ዝርዝር', fa: 'فهرست',
  }),
  'tool.hide': g('Hide', {
    es: 'Ocultar', cu: 'Esconder', uk: 'Сховати', ru: 'Скрыть', ti: 'ሓብእ', fa: 'پنهان',
  }),
  'tool.copy': g('Copy', {
    es: 'Copiar', cu: 'Copiar', uk: 'Копія', ru: 'Копия', ti: 'ቅዳሕ', fa: 'کپی',
  }),
  'tool.rot': g('Rot', {
    es: 'Girar', cu: 'Girar', uk: 'Обернути', ru: 'Повернуть', ti: 'ዘርግሕ', fa: 'چرخش',
  }),

  'chrome.settings': g('Settings', {
    es: 'Ajustes', cu: 'Ajustes', uk: 'Налаштування', ru: 'Настройки', ti: 'ቅጥዕታት', fa: 'تنظیمات',
  }),
  'chrome.help': g('Help', {
    es: 'Ayuda', cu: 'Ayuda', uk: 'Допомога', ru: 'Помощь', ti: 'ሓገዝ', fa: 'راهنما',
  }),
  'chrome.teach': g('Teach', {
    es: 'Enseñar', cu: 'Enseñar', uk: 'Навчання', ru: 'Уроки', ti: 'ምምሃር', fa: 'آموزش',
  }),
  'chrome.contest': g('Contest', {
    es: 'Concurso', cu: 'Concurso', uk: 'Конкурс', ru: 'Конкурс', ti: 'ውድድር', fa: 'مسابقه',
  }),
  'chrome.close': g('Close', {
    es: 'Cerrar', cu: 'Cerrar', uk: 'Закрити', ru: 'Закрыть', ti: 'ዕጸው', fa: 'بستن',
  }),
  'chrome.new': g('New', {
    es: 'Nuevo', cu: 'Nuevo', uk: 'Новий', ru: 'Новый', ti: 'ሓድሽ', fa: 'جدید',
  }),
  'chrome.save': g('Save file', {
    es: 'Guardar', cu: 'Guardar', uk: 'Зберегти', ru: 'Сохранить', ti: 'ዓቅብ', fa: 'ذخیره',
  }),
  'chrome.plan': g('2D Plan', {
    es: 'Plano 2D', cu: 'Plano 2D', uk: 'План 2D', ru: 'План 2D', ti: 'ትልሚ 2D', fa: 'پلان ۲بعدی',
  }),
  'chrome.dollhouse': g('Dollhouse', {
    es: 'Casa de muñecas', cu: 'Casa de muñecas', uk: 'Ляльковий дім', ru: 'Кукольный дом', ti: 'ገዛ ዕሸል', fa: 'خانه عروسکی',
  }),
  'chrome.view3d': g('3D View', {
    es: 'Vista 3D', cu: 'Vista 3D', uk: 'Вигляд 3D', ru: 'Вид 3D', ti: 'ትርኢት 3D', fa: 'نمای سه‌بعدی',
  }),
  'chrome.undo': g('Undo', {
    es: 'Deshacer', cu: 'Deshacer', uk: 'Скасувати', ru: 'Отменить', ti: 'ተመለስ', fa: 'برگردان',
  }),
  'chrome.redo': g('Redo', {
    es: 'Rehacer', cu: 'Rehacer', uk: 'Повторити', ru: 'Повторить', ti: 'ደጊምካ', fa: 'دوباره',
  }),
  'chrome.fit': g('Fit', {
    es: 'Ajustar', cu: 'Ajustar', uk: 'Вписати', ru: 'Вписать', ti: 'ኣቃልብ', fa: 'جا بده',
  }),
  'chrome.access': g('Access', {
    es: 'Acceso', cu: 'Acceso', uk: 'Доступ', ru: 'Доступ', ti: 'መእተዊ', fa: 'دسترسی',
  }),

  'cta.wall.title': g('Let’s put a wall on the grid', {
    es: 'Pongamos un muro en la cuadrícula',
    cu: 'Pongamos una pared en la cuadrícula',
    uk: 'Поставмо стіну на сітку',
    ru: 'Поставим стену на сетку',
    ti: 'መንደቕ ኣብቲ መርበብ ንግበር',
    fa: 'بیا یک دیوار روی شبکه بگذاریم',
  }),
  'cta.wall.sub': g('Two clicks: start, then the other end. Then a door.', {
    es: 'Dos clics: el inicio, luego el otro extremo. Después una puerta.',
    cu: 'Dos toques: el inicio, luego el otro extremo. Después una puerta.',
    uk: 'Два кліки: початок, потім інший кінець. Потім двері.',
    ru: 'Два клика: начало, потом другой конец. Затем дверь.',
    ti: 'ክልተ ጠውቕታት፦ መጀመርታ፣ ድሕሪኡ እቲ ካልእ ጫፍ። ድሕሪኡ ማዕጾ።',
    fa: 'دو کلیک: شروع، بعد سر دیگر. بعد یک در.',
  }),
  'cta.dismiss': g('Dismiss tip', {
    es: 'Cerrar consejo', cu: 'Cerrar consejo', uk: 'Сховати підказку', ru: 'Скрыть подсказку', ti: 'ምኽሪ ዕጸው', fa: 'بستن راهنما',
  }),

  'hint.wall.start': g('Click a corner to start, then the other end', {
    es: 'Clic en una esquina, luego el otro extremo',
    cu: 'Toca una esquina, luego el otro extremo',
    uk: 'Клікни кут, потім інший кінець',
    ru: 'Кликни угол, потом другой конец',
    ti: 'ኣብ ኩርናዕ ጠውቕ፣ ድሕሪኡ እቲ ካልእ ጫፍ',
    fa: 'یک گوشه را کلیک کن، بعد سر دیگر',
  }),
  'hint.wall.start.short': g('Wall → click start → click end', {
    es: 'Muro → clic inicio → clic fin',
    cu: 'Pared → toca inicio → toca fin',
    uk: 'Стіна → клік початок → клік кінець',
    ru: 'Стена → клик начало → клик конец',
    ti: 'መንደቕ → ጠውቕ መጀመርታ → ጠውቕ መወዳእታ',
    fa: 'دیوار → کلیک شروع → کلیک پایان',
  }),
  'hint.wall.end': g('Nice — now click where it ends', {
    es: 'Bien — ahora clic donde termina',
    cu: 'Bien — ahora toca donde termina',
    uk: 'Гаразд — тепер клікни, де кінець',
    ru: 'Хорошо — теперь кликни, где конец',
    ti: 'ጽቡቕ — ሕጂ ኣብቲ ዝውዳእ ጠውቕ',
    fa: 'خوب — حالا جایی که تمام می‌شود را کلیک کن',
  }),
  'hint.wall.end.short': g('Click where the wall ends', {
    es: 'Clic donde termina el muro',
    cu: 'Toca donde termina la pared',
    uk: 'Клікни, де стіна кінчається',
    ru: 'Кликни, где стена кончается',
    ti: 'ኣብቲ መንደቕ ዝውዳእ ጠውቕ',
    fa: 'جایی که دیوار تمام می‌شود کلیک کن',
  }),
  'hint.clip': g('Clip → click a sharp corner', {
    es: 'Recorte → clic en una esquina aguda',
    cu: 'Recorte → toca una esquina aguda',
    uk: 'Зріз → клікни гострий кут',
    ru: 'Срез → кликни острый угол',
    ti: 'ቑረጽ → ኣብ ርሱን ኩርናዕ ጠውቕ',
    fa: 'برش → یک گوشهٔ تیز را کلیک کن',
  }),
  'hint.clip.hot': g('Click the corner to clip it at 45°', {
    es: 'Clic en la esquina para recortar a 45°',
    cu: 'Toca la esquina para recortar a 45°',
    uk: 'Клікни кут, щоб зрізати під 45°',
    ru: 'Кликни угол, чтобы срезать под 45°',
    ti: 'ነቲ ኩርናዕ ብ 45° ንምቑራጽ ጠውቕ',
    fa: 'گوشه را کلیک کن تا با ۴۵ درجه برش بخورد',
  }),
  'hint.sketch': g('Drag like a pencil. Then tap the sketch → Trace to make walls.', {
    es: 'Arrastra como lápiz. Luego toca el boceto → Trazar para hacer muros.',
    cu: 'Arrastra como lápiz. Luego toca el boceto → Trazar para hacer paredes.',
    uk: 'Тягни як олівцем. Потім торкнись ескізу → Обвести, щоб зробити стіни.',
    ru: 'Тяни как карандашом. Потом нажми эскиз → Обвести, чтобы сделать стены.',
    ti: 'ከም ብርዒ ስሓብ። ድሕሪኡ ነቲ ስእሊ ጠውቕ → ቀጥታ መናድቕ ንምግባር።',
    fa: 'مثل مداد بکش. بعد طرح را بزن → خط‌کشی تا دیوار شود.',
  }),
  'hint.sketch.short': g('Drag to sketch · tap a stroke → Trace to walls', {
    es: 'Arrastra para bocetar · toca → Trazar muros',
    cu: 'Arrastra para bocetar · toca → Trazar paredes',
    uk: 'Тягни ескіз · торкнись → Обвести в стіни',
    ru: 'Тяни эскиз · нажми → Обвести в стены',
    ti: 'ንምስኣል ስሓብ · ጠውቕ → ናብ መናድቕ ቀጥታ',
    fa: 'بکش تا طرح بزنی · بزن → خط‌کشی به دیوار',
  }),
  'hint.sketch.drag': g('Keep dragging — lift to finish the stroke', {
    es: 'Sigue arrastrando — suelta para terminar',
    cu: 'Sigue arrastrando — suelta para terminar',
    uk: 'Тягни далі — відпусти, щоб закінчити',
    ru: 'Тяни дальше — отпусти, чтобы закончить',
    ti: 'ቀጽል ስሓብ — ንምውዳእ ልቀቕ',
    fa: 'به کشیدن ادامه بده — برای تمام کردن رها کن',
  }),
  'hint.door': g('Click right on a wall. Then the little menu can change it.', {
    es: 'Clic justo en un muro. Luego el menú lo puede cambiar.',
    cu: 'Toca justo en una pared. Luego el menú la puede cambiar.',
    uk: 'Клікни саме на стіну. Потім меню може змінити її.',
    ru: 'Кликни прямо на стену. Потом меню может изменить её.',
    ti: 'ቀጥታ ኣብ መንደቕ ጠውቕ። ድሕሪኡ እቲ ቁሩብ ዝርዝር ክቕይሮ ይኽእል።',
    fa: 'درست روی دیوار کلیک کن. بعد منوی کوچک می‌تواند عوضش کند.',
  }),
  'hint.door.short': g('Click on a wall — or tap an existing door to edit', {
    es: 'Clic en un muro — o toca una puerta para editar',
    cu: 'Toca una pared — o toca una puerta para editar',
    uk: 'Клікни на стіну — або торкнись дверей, щоб змінити',
    ru: 'Кликни на стену — или нажми дверь, чтобы изменить',
    ti: 'ኣብ መንደቕ ጠውቕ — ወይ ነታ ዘላ ማዕጾ ንምእራም ጠውቕ',
    fa: 'روی دیوار کلیک کن — یا درِ موجود را برای ویرایش بزن',
  }),
  'hint.furn': g('Click to place · or drag from the side list', {
    es: 'Clic para colocar · o arrastra de la lista',
    cu: 'Toca para colocar · o arrastra de la lista',
    uk: 'Клікни, щоб поставити · або тягни зі списку',
    ru: 'Кликни, чтобы поставить · или тяни из списка',
    ti: 'ንምቕማጥ ጠውቕ · ወይ ካብቲ ጎኒ ዝርዝር ስሓብ',
    fa: 'کلیک کن تا بگذاری · یا از فهرست کنار بکش',
  }),
  'hint.room': g('Pick a type, then click inside walls that close', {
    es: 'Elige un tipo, luego clic dentro de muros cerrados',
    cu: 'Escoge un tipo, luego toca dentro de paredes cerradas',
    uk: 'Обери тип, потім клікни всередині замкнених стін',
    ru: 'Выбери тип, потом кликни внутри замкнутых стен',
    ti: 'ዓይነት ምረጽ፣ ድሕሪኡ ኣብ ውሽጢ ዝተዓጽዉ መናድቕ ጠውቕ',
    fa: 'یک نوع برگزین، بعد داخل دیوارهای بسته کلیک کن',
  }),
  'hint.dim': g('Size → click start, then the other end', {
    es: 'Medida → clic inicio, luego el otro extremo',
    cu: 'Medida → toca inicio, luego el otro extremo',
    uk: 'Розмір → клік початок, потім інший кінець',
    ru: 'Размер → клик начало, потом другой конец',
    ti: 'ዓቐን → ጠውቕ መጀመርታ፣ ድሕሪኡ እቲ ካልእ ጫፍ',
    fa: 'اندازه → کلیک شروع، بعد سر دیگر',
  }),
  'hint.dim.end': g('Click the other end of the size', {
    es: 'Clic el otro extremo de la medida',
    cu: 'Toca el otro extremo de la medida',
    uk: 'Клікни інший кінець розміру',
    ru: 'Кликни другой конец размера',
    ti: 'ኣብቲ ካልእ ጫፍ ናይቲ ዓቐን ጠውቕ',
    fa: 'سر دیگر اندازه را کلیک کن',
  }),
  'hint.note': g('Click the plan, then type in the note box', {
    es: 'Clic en el plano, luego escribe en la nota',
    cu: 'Toca el plano, luego escribe en la nota',
    uk: 'Клікни план, потім пиши в нотатці',
    ru: 'Кликни план, потом пиши в заметке',
    ti: 'ኣብቲ ትልሚ ጠውቕ፣ ድሕሪኡ ኣብ ሳጹን መዘኻኸሪ ጽሓፍ',
    fa: 'روی پلان کلیک کن، بعد در جعبهٔ یادداشت بنویس',
  }),
  'hint.plant': g('Tree, bed, or path — click to plant it', {
    es: 'Árbol, macizo o camino — clic para plantar',
    cu: 'Árbol, cantero o camino — toca para plantar',
    uk: 'Дерево, клумба чи стежка — клікни, щоб посадити',
    ru: 'Дерево, клумба или дорожка — кликни, чтобы посадить',
    ti: 'ገረብ፣ ዕንፀይቲ ወይ መንገዲ — ንምትካል ጠውቕ',
    fa: 'درخت، باغچه یا راه — کلیک کن تا بکاری',
  }),
  'hint.pan': g('Drag to look around · pinch to zoom', {
    es: 'Arrastra para mirar · pellizca para zoom',
    cu: 'Arrastra para mirar · pellizca para zoom',
    uk: 'Тягни, щоб дивитись · щипни для масштабу',
    ru: 'Тяни, чтобы смотреть · сведи пальцы для масштаба',
    ti: 'ንምርኣይ ስሓብ · ንምዕባይ ጽቕጽቕ',
    fa: 'بکش تا نگاه کنی · برای بزرگ‌نمایی نیشگون بگیر',
  }),
  'hint.select': g('Drag empty grid to look around. Tap a wall to move it.', {
    es: 'Arrastra la cuadrícula vacía. Toca un muro para moverlo.',
    cu: 'Arrastra la cuadrícula vacía. Toca una pared para moverla.',
    uk: 'Тягни порожню сітку, щоб дивитись. Торкнись стіни, щоб посунути.',
    ru: 'Тяни пустую сетку, чтобы смотреть. Нажми стену, чтобы сдвинуть.',
    ti: 'ነቲ ባዶ መስመር ስሓብ. ንመንደቕ ንምንቅስቓስ ንካእቶ።',
    fa: 'شبکه خالی را بکش. برای جابه‌جا کردن، دیوار را بزن.',
  }),
  'hint.select.wall': g('Squares on the ends stretch the wall. Drag the middle to slide it. Sizes are on the right.', {
    es: 'Los cuadros en los extremos estiran el muro. El centro lo desliza. Las medidas están a la derecha.',
    cu: 'Los cuadros en los extremos estiran la pared. El centro la desliza. Las medidas están a la derecha.',
    uk: 'Квадрати на кінцях тягнуть стіну. Середина зсуває. Розміри справа.',
    ru: 'Квадраты на концах тянут стену. Середина сдвигает. Размеры справа.',
    ti: 'ኣብ ጫፍ ዘለዉ ትርብዑ ንመንደቕ ይስሕቡ. ማእከል የንቀሳቕሶ። መጠን ኣብ የማን እዩ።',
    fa: 'مربع‌های دو سر دیوار را می‌کشند. وسط آن را جابه‌جا می‌کند. اندازه‌ها سمت راست است.',
  }),
  'hint.select.short': g('Drag the grid to look around · tap to select', {
    es: 'Arrastra la cuadrícula · toca para elegir',
    cu: 'Arrastra la cuadrícula · toca para escoger',
    uk: 'Тягни сітку · торкнись, щоб обрати',
    ru: 'Тяни сетку · нажми, чтобы выбрать',
    ti: 'ነቲ መርበብ ስሓብ · ንምምራጽ ጠውቕ',
    fa: 'شبکه را بکش · برای انتخاب بزن',
  }),
  'hint.doll.empty': g('Draw walls in 2D Plan, then come back — Dollhouse is for decorating', {
    es: 'Dibuja muros en Plano 2D, luego vuelve — la casa de muñecas es para decorar',
    cu: 'Dibuja paredes en Plano 2D, luego vuelve — la casa de muñecas es para decorar',
    uk: 'Намалюй стіни в Плані 2D, потім повернись — ляльковий дім для оздоблення',
    ru: 'Нарисуй стены в Плане 2D, потом вернись — кукольный дом для украшения',
    ti: 'ኣብ ትልሚ 2D መናድቕ ስኣል፣ ድሕሪኡ ተመለስ — ገዛ ዕሸል ንምስልት እዩ',
    fa: 'در پلان ۲بعدی دیوار بکش، بعد برگرد — خانه عروسکی برای تزئین است',
  }),
  'hint.doll.furn': g('Click the floor to place furniture', {
    es: 'Clic en el piso para poner muebles',
    cu: 'Toca el piso para poner muebles',
    uk: 'Клікни підлогу, щоб поставити меблі',
    ru: 'Кликни пол, чтобы поставить мебель',
    ti: 'ኣቓሑት ንምቕማጥ ኣብ ወለል ጠውቕ',
    fa: 'روی کف کلیک کن تا مبلمان بگذاری',
  }),
  'hint.doll.plant': g('Click the yard to plant a tree', {
    es: 'Clic en el patio para plantar un árbol',
    cu: 'Toca el patio para plantar un árbol',
    uk: 'Клікни двір, щоб посадити дерево',
    ru: 'Кликни двор, чтобы посадить дерево',
    ti: 'ገረብ ንምትካል ኣብቲ ካብ ገዛ ወጻኢ ጠውቕ',
    fa: 'روی حیاط کلیک کن تا درخت بکاری',
  }),
  'hint.doll.paper': g('Tap a wall to paper it · roof is off like a dollhouse', {
    es: 'Toca un muro para empapelarlo · el techo está quitado',
    cu: 'Toca una pared para empapelarla · el techo está quitado',
    uk: 'Торкнись стіни, щоб обклеїти · дах знято, як у ляльковому домі',
    ru: 'Нажми стену, чтобы оклеить · крыша снята, как у кукольного дома',
    ti: 'ንምሽፋን መንደቕ ጠውቕ · ጣራ ከም ገዛ ዕሸል ተኣልዩ',
    fa: 'دیوار را بزن تا کاغذدیواری شود · سقف مثل خانه عروسکی برداشته شده',
  }),
  'doll.proj': g('Drawing view', {
    es: 'Vista de dibujo', cu: 'Vista de dibujo', uk: 'Вид креслення', ru: 'Вид чертежа', ti: 'ትርኢት ስእሊ', fa: 'نمای رسم',
  }),
  'doll.proj.iso': g('Isometric', {
    es: 'Isométrica', cu: 'Isométrica', uk: 'Ізометрія', ru: 'Изометрия', ti: 'ኢሶሜትሪክ', fa: 'ایزومتریک',
  }),
  'doll.proj.oblique': g('Oblique', {
    es: 'Oblicua', cu: 'Oblicua', uk: 'Коса', ru: 'Косая', ti: 'ኣንጻር', fa: 'مایل',
  }),
  'doll.proj.elevation': g('Elevation', {
    es: 'Alzado', cu: 'Alzado', uk: 'Фасад', ru: 'Фасад', ti: 'ምልቃሕ', fa: 'نما',
  }),
  'doll.proj.ortho': g('Orthographic', {
    es: 'Ortográfica', cu: 'Ortográfica', uk: 'Ортогональна', ru: 'Ортогональная', ti: 'ኦርቶግራፊክ', fa: 'متعامد',
  }),
  'doll.face.front': g('Front', {
    es: 'Frente', cu: 'Frente', uk: 'Фасад', ru: 'Фасад', ti: 'ቅድሚት', fa: 'روبرو',
  }),
  'doll.face.right': g('Right', {
    es: 'Derecha', cu: 'Derecha', uk: 'Право', ru: 'Право', ti: 'የማን', fa: 'راست',
  }),
  'doll.face.rear': g('Rear', {
    es: 'Atrás', cu: 'Atrás', uk: 'Тил', ru: 'Тыл', ti: 'ድሕሪት', fa: 'پشت',
  }),
  'doll.face.left': g('Left', {
    es: 'Izquierda', cu: 'Izquierda', uk: 'Ліво', ru: 'Лево', ti: 'ጸጋም', fa: 'چپ',
  }),
  'doll.face.top': g('Top', {
    es: 'Arriba', cu: 'Arriba', uk: 'Зверху', ru: 'Сверху', ti: 'ላዕሊ', fa: 'بالا',
  }),
  'doll.turn.left': g('Turn left', {
    es: 'Girar a la izquierda', cu: 'Girar a la izquierda', uk: 'Повернути ліворуч', ru: 'Повернуть влево', ti: 'ናብ ጸጋም ኣዘውር', fa: 'بچرخان به چپ',
  }),
  'doll.turn.right': g('Turn right', {
    es: 'Girar a la derecha', cu: 'Girar a la derecha', uk: 'Повернути праворуч', ru: 'Повернуть вправо', ti: 'ናብ የማን ኣዘውር', fa: 'بچرخان به راست',
  }),
  'doll.lesson.iso': g('Isometric: all three axes. Turn the house — height stays true. Near walls open so beds stay in the room.', {
    es: 'Isométrica: tres ejes. Gira la casa — la altura queda verdadera. Es una vista 3/4, no una foto.',
    cu: 'Isométrica: tres ejes. Gira la casa — la altura queda verdadera. Es una vista 3/4, no una foto.',
    uk: 'Ізометрія: три осі. Поверни будинок — висота правдива. Це вид 3/4, не фото.',
    ru: 'Изометрия: три оси. Поверни дом — высота верная. Это вид 3/4, не фото.',
    ti: 'ኢሶሜትሪክ፦ ሰለስተ መስመር. ነቲ ገዛ ኣዘውር — ቁመት ሓቀኛ እዩ. እዚ ትርኢት 3/4 እዩ፣ ስእሊ ኣይኮነን.',
    fa: 'ایزومتریک: هر سه محور. خانه را بچرخان — ارتفاع درست می‌ماند. نمای سه‌چهارم است، نه عکس.',
  }),
  'doll.lesson.oblique': g('Oblique (cabinet): the front is true size. Depth recedes at 45° and is drawn half as long.', {
    es: 'Oblicua (cabinet): el frente es tamaño verdadero. La profundidad huye a 45° y se dibuja a la mitad.',
    cu: 'Oblicua (cabinet): el frente es tamaño verdadero. La profundidad huye a 45° y se dibuja a la mitad.',
    uk: 'Коса (cabinet): фасад правдивого розміру. Глибина тікає під 45° і малюється вдвічі коротшою.',
    ru: 'Косая (cabinet): фасад верного размера. Глубина уходит под 45° и рисуется вдвое короче.',
    ti: 'ኣንጻር (cabinet)፦ ቅድሚት ሓቀኛ ዓቐን እያ. ዕምቆት ብ 45° ትኸይድን ፍርቂ ትስኣልን.',
    fa: 'مایل (کابینت): روبرو اندازهٔ واقعی است. عمق با ۴۵ درجه پس می‌رود و نصف کشیده می‌شود.',
  }),
  'doll.lesson.elevation': g('Elevation: one face, true width and height. Like looking straight at the wall you are papering.', {
    es: 'Alzado: una cara, ancho y alto verdaderos. Como mirar de frente el muro que empapelas.',
    cu: 'Alzado: una cara, ancho y alto verdaderos. Como mirar de frente la pared que empapelas.',
    uk: 'Фасад: одна стіна, правдива ширина й висота. Ніби дивишся просто на стіну, яку обклеюєш.',
    ru: 'Фасад: одна стена, верная ширина и высота. Как смотреть прямо на стену, которую оклеиваешь.',
    ti: 'ምልቃሕ፦ ሓደ ገጽ፣ ሓቀኛ ስፍሓትን ቁመትን. ከምቲ ነቲ ዝሽፍኖ መንደቕ ቀጥታ ምርኣይ.',
    fa: 'نما: یک رخ، پهنا و ارتفاع واقعی. مثل نگاه مستقیم به دیواری که کاغذ می‌کنی.',
  }),
  'doll.lesson.ortho': g('Orthographic: no angle, no squeeze. A drafter’s elevation — turn for Front, Right, Rear, Left.', {
    es: 'Ortográfica: sin ángulo ni achique. Alzado de delineante — gira Frente, Derecha, Atrás, Izquierda.',
    cu: 'Ortográfica: sin ángulo ni achique. Alzado de delineante — gira Frente, Derecha, Atrás, Izquierda.',
    uk: 'Ортогональна: без кута й стиску. Фасад кресляра — повертай Фасад, Право, Тил, Ліво.',
    ru: 'Ортогональная: без угла и сжатия. Фасад чертёжника — верти Фасад, Право, Тыл, Лево.',
    ti: 'ኦርቶግራፊክ፦ ኣንግል የለን፣ ምጽቃጥ የለን. ናይ ስእሊ ምልቃሕ — ቅድሚት፣ የማን፣ ድሕሪት፣ ጸጋም ኣዘውር.',
    fa: 'متعامد: بدون زاویه، بدون فشردن. نمای نقشه‌کش — بچرخان روبرو، راست، پشت، چپ.',
  }),
  'doll.lesson.ortho.top': g('Orthographic top: looking straight down. That is a plan. Walls look like lines because you only see thickness.', {
    es: 'Ortográfica desde arriba: mirar hacia abajo. Eso es una planta. Los muros se ven como líneas — solo ves el groso.',
    cu: 'Ortográfica desde arriba: mirar hacia abajo. Eso es una planta. Las paredes se ven como líneas — solo ves el groso.',
    uk: 'Ортогональна зверху: дивитись просто вниз. Це план. Стіни як лінії — видно лише товщину.',
    ru: 'Ортогональная сверху: смотреть прямо вниз. Это план. Стены как линии — видна только толщина.',
    ti: 'ኦርቶግራፊክ ካብ ላዕሊ፦ ቀጥታ ንታሕቲ ምርኣይ. እዚ ትልሚ እዩ. መናድቕ ከም መስመር ይርኣዩ — ውፍሓት ጥራይ እዩ ትሪኢ.',
    fa: 'متعامد از بالا: نگاه راست به پایین. همان پلان است. دیوارها خط دیده می‌شوند — فقط ضخامت را می‌بینی.',
  }),

  'toast.missWall': g('Almost — click right on a wall', {
    es: 'Casi — clic justo en un muro',
    cu: 'Casi — toca justo en una pared',
    uk: 'Майже — клікни саме на стіну',
    ru: 'Почти — кликни прямо на стену',
    ti: 'ኣላሊኻ — ቀጥታ ኣብ መንደቕ ጠውቕ',
    fa: 'نزدیک بود — درست روی دیوار کلیک کن',
  }),
  'toast.doorIn': g('Door is in — change swing or size in the menu', {
    es: 'Puerta lista — cambia el giro o el tamaño en el menú',
    cu: 'Puerta lista — cambia el giro o el tamaño en el menú',
    uk: 'Двері на місці — зміни відчинення або розмір у меню',
    ru: 'Дверь на месте — измени открывание или размер в меню',
    ti: 'ማዕጾ ኣትያ — ኣብቲ ዝርዝር ምኽፋት ወይ ዓቐን ቀይር',
    fa: 'در گذاشته شد — بازشو یا اندازه را در منو عوض کن',
  }),
  'toast.doorDog': g('Door is in — tap it, pick 12" or 18", then slide it off-center', {
    es: 'Puerta lista — tócala, elige 12" o 18", luego muévela del centro',
    cu: 'Puerta lista — tócala, escoge 12" o 18", luego muévela del centro',
    uk: 'Двері на місці — торкнись, обери 12" або 18", потім зсунь від центру',
    ru: 'Дверь на месте — нажми, выбери 12" или 18", потом сдвинь от центра',
    ti: 'ማዕጾ ኣትያ — ጠውቕ፣ 12" ወይ 18" ምረጽ፣ ድሕሪኡ ካብ ማእከል ኣንቀሳቕስ',
    fa: 'در گذاشته شد — بزن، ۱۲" یا ۱۸" برگزین، بعد از وسط بکش',
  }),
  'toast.windowIn': g('Window is in — drag to slide it', {
    es: 'Ventana lista — arrástrala para deslizarla',
    cu: 'Ventana lista — arrástrala para deslizarla',
    uk: 'Вікно на місці — тягни, щоб зсунути',
    ru: 'Окно на месте — тяни, чтобы сдвинуть',
    ti: 'መስኮት ኣትዩ — ንምንቅስቓስ ስሓብ',
    fa: 'پنجره گذاشته شد — بکش تا بلغزد',
  }),
  'toast.furnMove': g('Click it to scoot it around', {
    es: 'Clic para moverlo',
    cu: 'Toca para moverlo',
    uk: 'Клікни, щоб посунути',
    ru: 'Кликни, чтобы сдвинуть',
    ti: 'ንምንቅስቓስ ጠውቕ',
    fa: 'کلیک کن تا جابه‌جایش کنی',
  }),
  'toast.sketchIn': g('Sketch is in. Keep drawing, or Trace to make walls.', {
    es: 'Boceto listo. Sigue dibujando, o Traza para hacer muros.',
    cu: 'Boceto listo. Sigue dibujando, o Traza para hacer paredes.',
    uk: 'Ескіз є. Малюй далі або Обведи, щоб зробити стіни.',
    ru: 'Эскиз есть. Рисуй дальше или Обведи, чтобы сделать стены.',
    ti: 'ስእሊ ኣቶ። ቀጽል ስኣል፣ ወይ መናድቕ ንምግባር ቀጥታ ግበር።',
    fa: 'طرح گذاشته شد. به کشیدن ادامه بده، یا خط‌کشی کن تا دیوار شود.',
  }),
  'toast.sketchFirst': g('Sketch first, then Trace', {
    es: 'Primero boceto, luego Trazar',
    cu: 'Primero boceto, luego Trazar',
    uk: 'Спочатку ескіз, потім Обвести',
    ru: 'Сначала эскиз, потом Обвести',
    ti: 'መጀመርታ ስእሊ፣ ድሕሪኡ ቀጥታ',
    fa: 'اول طرح، بعد خط‌کشی',
  }),
  'toast.traceNeed': g('Draw the outline a bit bigger, then Trace', {
    es: 'Dibuja el contorno un poco más grande, luego Traza',
    cu: 'Dibuja el contorno un poco más grande, luego Traza',
    uk: 'Намалюй контур трохи більшим, потім Обведи',
    ru: 'Нарисуй контур чуть больше, потом Обведи',
    ti: 'ነቲ ዝርዝር ቁሩብ ዓቢ ስኣል፣ ድሕሪኡ ቀጥታ ግበር',
    fa: 'دور خط را کمی بزرگ‌تر بکش، بعد خط‌کشی کن',
  }),
  'toast.traceOne': g('Traced 1 wall — sketch stays as an underlay', {
    es: 'Se trazó 1 muro — el boceto queda debajo',
    cu: 'Se trazó 1 pared — el boceto queda debajo',
    uk: 'Обведено 1 стіну — ескіз лишається підкладкою',
    ru: 'Обведена 1 стена — эскиз остаётся подложкой',
    ti: '1 መንደቕ ተቀጥታ — ስእሊ ኣብ ታሕቲ ይቕመጥ',
    fa: '۱ دیوار خط‌کشی شد — طرح زیر آن می‌ماند',
  }),
  'toast.traceMany': g('Traced {n} walls — sketch stays as an underlay', {
    es: 'Se trazaron {n} muros — el boceto queda debajo',
    cu: 'Se trazaron {n} paredes — el boceto queda debajo',
    uk: 'Обведено {n} стін — ескіз лишається підкладкою',
    ru: 'Обведено {n} стен — эскиз остаётся подложкой',
    ti: '{n} መናድቕ ተቀጥታ — ስእሊ ኣብ ታሕቲ ይቕመጥ',
    fa: '{n} دیوار خط‌کشی شد — طرح زیر آن می‌ماند',
  }),
  'toast.clipHint': g('Click a sharp corner where two walls meet', {
    es: 'Clic en una esquina aguda donde se juntan dos muros',
    cu: 'Toca una esquina aguda donde se juntan dos paredes',
    uk: 'Клікни гострий кут, де сходяться дві стіни',
    ru: 'Кликни острый угол, где сходятся две стены',
    ti: 'ኣብቲ ክልተ መናድቕ ዝራኸባ ርሱን ኩርናዕ ጠውቕ',
    fa: 'گوشهٔ تیزی که دو دیوار به هم می‌رسند را کلیک کن',
  }),
  'toast.locked': g('Unlocks at {level} — Settings to change help', {
    es: 'Se abre en {level} — Ajustes para cambiar la ayuda',
    cu: 'Se abre en {level} — Ajustes para cambiar la ayuda',
    uk: 'Відкриється на рівні {level} — Налаштування, щоб змінити допомогу',
    ru: 'Откроется на уровне {level} — Настройки, чтобы сменить помощь',
    ti: 'ኣብ {level} ይኽፈት — ሓገዝ ንምቕያር ቅጥዕታት',
    fa: 'در {level} باز می‌شود — تنظیمات برای عوض کردن کمک',
  }),
  'toast.helpAs': g('I’ll help as {level}', {
    es: 'Te ayudo como {level}',
    cu: 'Te ayudo como {level}',
    uk: 'Допомагатиму як {level}',
    ru: 'Буду помогать как {level}',
    ti: 'ከም {level} ክሕግዘካ እየ',
    fa: 'کمکت می‌کنم مثل {level}',
  }),

  'coach.showMe': g('Show me', {
    es: 'Muéstrame', cu: 'Muéstrame', uk: 'Покажи', ru: 'Покажи', ti: 'ኣርእየኒ', fa: 'نشان بده',
  }),
  'coach.notNow': g('Not now', {
    es: 'Ahora no', cu: 'Ahora no', uk: 'Не зараз', ru: 'Не сейчас', ti: 'ሕጂ ኣይኮነን', fa: 'الان نه',
  }),
  'coach.openTeach': g('Open Teach', {
    es: 'Abrir Enseñar', cu: 'Abrir Enseñar', uk: 'Відкрити Навчання', ru: 'Открыть Уроки', ti: 'ምምሃር ክፈት', fa: 'باز کردن آموزش',
  }),
  'coach.askBaboo': g('Ask Baboo', {
    es: 'Preguntar a Baboo', cu: 'Preguntarle a Baboo', uk: 'Запитати Baboo', ru: 'Спросить Baboo', ti: 'ን Baboo ሕተት', fa: 'از Baboo بپرس',
  }),
  'coach.kicker': g('Baboo', {
    es: 'Baboo', cu: 'Baboo', uk: 'Baboo', ru: 'Baboo', ti: 'Baboo', fa: 'Baboo',
  }),

  'coach.sketch.title': g('Sketch the house first', {
    es: 'Primero boceta la casa',
    cu: 'Primero boceta la casa',
    uk: 'Спочатку намалюй ескіз будинку',
    ru: 'Сначала нарисуй эскиз дома',
    ti: 'መጀመርታ ነታ ገዛ ስኣል',
    fa: 'اول خانه را طرح بزن',
  }),
  'coach.sketch.body': g('Open Tools, pick Sketch. Drag like a pencil. Architecture starts on paper.', {
    es: 'Abre Herramientas, elige Boceto. Arrastra como lápiz. La arquitectura empieza en papel.',
    cu: 'Abre Herramientas, escoge Boceto. Arrastra como lápiz. La arquitectura empieza en papel.',
    uk: 'Відкрий Інструменти, обери Ескіз. Тягни як олівцем. Архітектура починається на папері.',
    ru: 'Открой Инструменты, выбери Эскиз. Тяни как карандашом. Архитектура начинается на бумаге.',
    ti: 'መሳርሒታት ክፈት፣ ስእሊ ምረጽ። ከም ብርዒ ስሓብ። ስነ-ህንጻ ኣብ ወረቐት ይጅምር።',
    fa: 'ابزار را باز کن، طرح را برگزین. مثل مداد بکش. معماری از کاغذ شروع می‌شود.',
  }),
  'coach.trace.title': g('Now hard-line a wall', {
    es: 'Ahora traza un muro derecho',
    cu: 'Ahora traza una pared derecha',
    uk: 'Тепер обведи стіну прямою',
    ru: 'Теперь обведи стену прямой',
    ti: 'ሕጂ ቀጥታ መንደቕ ግበር',
    fa: 'حالا دیوار را خط‌کشی کن',
  }),
  'coach.trace.body': g('Tap the sketch → Trace, or pick Wall and click along it.', {
    es: 'Toca el boceto → Trazar, o elige Muro y haz clic por encima.',
    cu: 'Toca el boceto → Trazar, o escoge Pared y toca por encima.',
    uk: 'Торкнись ескізу → Обвести, або обери Стіна і клікай вздовж.',
    ru: 'Нажми эскиз → Обвести, или выбери Стена и кликай вдоль.',
    ti: 'ነቲ ስእሊ ጠውቕ → ቀጥታ፣ ወይ መንደቕ ምረጽ እሞ ኣብ ልዕሊኡ ጠውቕ.',
    fa: 'طرح را بزن → خط‌کشی، یا دیوار را برگزین و روی آن کلیک کن.',
  }),
  'coach.close.title': g('Close the box', {
    es: 'Cierra la caja',
    cu: 'Cierra la caja',
    uk: 'Замкни коробку',
    ru: 'Замкни коробку',
    ti: 'ነታ ሳጹን ዕጸው',
    fa: 'جعبه را ببند',
  }),
  'coach.close.body': g('Keep going until the walls meet. That’s when it becomes a room.', {
    es: 'Sigue hasta que los muros se junten. Ahí se vuelve un cuarto.',
    cu: 'Sigue hasta que las paredes se junten. Ahí se vuelve un cuarto.',
    uk: 'Продовжуй, доки стіни зійдуться. Тоді це стане кімнатою.',
    ru: 'Продолжай, пока стены не сойдутся. Тогда это станет комнатой.',
    ti: 'መናድቕ ክሳብ ዝራኸባ ቀጽል። ሽዑ ክፍሊ ይኸውን።',
    fa: 'ادامه بده تا دیوارها به هم برسند. همان‌جا اتاق می‌شود.',
  }),
  'coach.door.title': g('Add a door so we can walk in', {
    es: 'Pon una puerta para entrar',
    cu: 'Pon una puerta para entrar',
    uk: 'Додай двері, щоб можна було зайти',
    ru: 'Добавь дверь, чтобы можно было войти',
    ti: 'ክንኣቱ ማዕጾ ኣእትው',
    fa: 'یک در بگذار تا بتوانیم داخل شویم',
  }),
  'coach.door.body': g('Pick Door, then click right on a wall.', {
    es: 'Elige Puerta, luego clic justo en un muro.',
    cu: 'Escoge Puerta, luego toca justo en una pared.',
    uk: 'Обери Двері, потім клікни саме на стіну.',
    ru: 'Выбери Дверь, потом кликни прямо на стену.',
    ti: 'ማዕጾ ምረጽ፣ ድሕሪኡ ቀጥታ ኣብ መንደቕ ጠውቕ።',
    fa: 'در را برگزین، بعد درست روی دیوار کلیک کن.',
  }),
  'coach.window.title': g('Let some light in', {
    es: 'Deja entrar luz',
    cu: 'Deja entrar luz',
    uk: 'Пусти світло всередину',
    ru: 'Пусти свет внутрь',
    ti: 'ብርሃን ኣእትው',
    fa: 'کمی نور بده داخل',
  }),
  'coach.window.body': g('Pick Window, then click a wall across from the door.', {
    es: 'Elige Ventana, luego clic en un muro frente a la puerta.',
    cu: 'Escoge Ventana, luego toca una pared frente a la puerta.',
    uk: 'Обери Вікно, потім клікни стіну навпроти дверей.',
    ru: 'Выбери Окно, потом кликни стену напротив двери.',
    ti: 'መስኮት ምረጽ፣ ድሕሪኡ ኣብቲ ንማዕጾ ዝቃወም መንደቕ ጠውቕ።',
    fa: 'پنجره را برگزین، بعد دیوار روبه‌روی در را کلیک کن.',
  }),
  'coach.room.title': g('Give the room a name', {
    es: 'Ponle nombre al cuarto',
    cu: 'Ponle nombre al cuarto',
    uk: 'Дай кімнаті назву',
    ru: 'Дай комнате имя',
    ti: 'ንክፍሊ ስም ሃብ',
    fa: 'به اتاق اسم بده',
  }),
  'coach.room.body': g('Room tool → Living or Kitchen → click inside the walls.', {
    es: 'Herramienta Cuarto → Sala o Cocina → clic dentro de los muros.',
    cu: 'Herramienta Cuarto → Sala o Cocina → toca dentro de las paredes.',
    uk: 'Інструмент Кімната → Вітальня чи Кухня → клікни всередині стін.',
    ru: 'Инструмент Комната → Гостиная или Кухня → кликни внутри стен.',
    ti: 'መሳርሒ ክፍሊ → ሳሎን ወይ ክሽነ → ኣብ ውሽጢ መናድቕ ጠውቕ።',
    fa: 'ابزار اتاق → نشیمن یا آشپزخانه → داخل دیوارها کلیک کن.',
  }),
  'coach.done.title': g('You did it', {
    es: 'Lo lograste',
    cu: 'Lo lograste',
    uk: 'Ти зробив це',
    ru: 'У тебя получилось',
    ti: 'ፈጺምካዮ',
    fa: 'انجام دادی',
  }),
  'coach.done.body': g('A closed room with a door. Open Teach for a challenge, or raise your level in Settings.', {
    es: 'Un cuarto cerrado con puerta. Abre Enseñar para un reto, o sube el nivel en Ajustes.',
    cu: 'Un cuarto cerrado con puerta. Abre Enseñar para un reto, o sube el nivel en Ajustes.',
    uk: 'Замкнена кімната з дверима. Відкрий Навчання для завдання або підніми рівень у Налаштуваннях.',
    ru: 'Закрытая комната с дверью. Открой Уроки для задания или подними уровень в Настройках.',
    ti: 'ዝተዓጽወ ክፍሊ ምስ ማዕጾ። ንፈተነ ምምሃር ክፈት፣ ወይ ኣብ ቅጥዕታት ደረጃ ኣልዕል።',
    fa: 'اتاق بسته با در. آموزش را برای چالش باز کن، یا سطح را در تنظیمات بالا ببر.',
  }),
  'coach.novice-done.title': g('You have a plan', {
    es: 'Ya tienes un plano',
    cu: 'Ya tienes un plano',
    uk: 'У тебе є план',
    ru: 'У тебя есть план',
    ti: 'ትልሚ ኣሎካ',
    fa: 'یک پلان داری',
  }),
  'coach.novice-done.body': g('Walk the walls. Open Teach for the next step, or switch to Beginner in Settings for windows and names.', {
    es: 'Camina los muros. Abre Enseñar, o pasa a Principiante en Ajustes para ventanas y nombres.',
    cu: 'Camina las paredes. Abre Enseñar, o pasa a Principiante en Ajustes para ventanas y nombres.',
    uk: 'Пройди стіни. Відкрий Навчання або перейди на Початковий у Налаштуваннях для вікон і назв.',
    ru: 'Пройди стены. Открой Уроки или перейди на Начинающий в Настройках для окон и названий.',
    ti: 'ነቶም መናድቕ ተጓዓዝ። ምምሃር ክፈት፣ ወይ ኣብ ቅጥዕታት ናብ ጀማሪ ንመሳኹቲን ስማትን ምቅያር።',
    fa: 'دیوارها را قدم بزن. آموزش را باز کن، یا در تنظیمات به تازه‌کار برو برای پنجره و اسم.',
  }),
  'coach.wall.title': g('Let’s draw a wall', {
    es: 'Dibujemos un muro',
    cu: 'Dibujemos una pared',
    uk: 'Намалюймо стіну',
    ru: 'Нарисуем стену',
    ti: 'መንደቕ ንስኣል',
    fa: 'بیا یک دیوار بکشیم',
  }),
  'coach.wall.body': g('Tools → Wall. Two clicks: start corner, then the end.', {
    es: 'Herramientas → Muro. Dos clics: esquina de inicio, luego el fin.',
    cu: 'Herramientas → Pared. Dos toques: esquina de inicio, luego el fin.',
    uk: 'Інструменти → Стіна. Два кліки: кут початку, потім кінець.',
    ru: 'Инструменты → Стена. Два клика: угол начала, потом конец.',
    ti: 'መሳርሒታት → መንደቕ። ክልተ ጠውቕታት፦ ኩርናዕ መጀመርታ፣ ድሕሪኡ መወዳእታ።',
    fa: 'ابزار → دیوار. دو کلیک: گوشهٔ شروع، بعد پایان.',
  }),

  'coach.den.sketch.title': g('Sketch Baboo a den', {
    es: 'Boceta una perrera para Baboo',
    cu: 'Boceta una caseta para Baboo',
    uk: 'Намалюй Baboo лігво',
    ru: 'Нарисуй Baboo конуру',
    ti: 'ን Baboo መደቀሲ ስኣል',
    fa: 'برای Baboo یک لانه طرح بزن',
  }),
  'coach.den.sketch.body': g('Tools → Sketch. Drag a small box — a dog house is not a people bedroom.', {
    es: 'Herramientas → Boceto. Arrastra una caja chica — no es un dormitorio de personas.',
    cu: 'Herramientas → Boceto. Arrastra una caja chica — no es un cuarto de personas.',
    uk: 'Інструменти → Ескіз. Тягни малу коробку — будка це не спальня для людей.',
    ru: 'Инструменты → Эскиз. Тяни маленькую коробку — конура это не спальня для людей.',
    ti: 'መሳርሒታት → ስእሊ። ንእሽቶ ሳጹን ስሓብ — ገዛ ከልቢ ናይ ሰብ መደቀሲ ኣይኮነን።',
    fa: 'ابزار → طرح. یک جعبهٔ کوچک بکش — خانه سگ اتاق خواب آدم‌ها نیست.',
  }),
  'coach.den.trace.title': g('Hard-line the den', {
    es: 'Traza la perrera',
    cu: 'Traza la caseta',
    uk: 'Обведи лігво',
    ru: 'Обведи конуру',
    ti: 'ነቲ መደቀሲ ቀጥታ ግበር',
    fa: 'لانه را خط‌کشی کن',
  }),
  'coach.den.trace.body': g('Tap the sketch → Trace, or pick Wall and click along it.', {
    es: 'Toca el boceto → Trazar, o elige Muro y haz clic por encima.',
    cu: 'Toca el boceto → Trazar, o escoge Pared y toca por encima.',
    uk: 'Торкнись ескізу → Обвести, або обери Стіна і клікай вздовж.',
    ru: 'Нажми эскиз → Обвести, или выбери Стена и кликай вдоль.',
    ti: 'ነቲ ስእሊ ጠውቕ → ቀጥታ፣ ወይ መንደቕ ምረጽ እሞ ኣብ ልዕሊኡ ጠውቕ.',
    fa: 'طرح را بزن → خط‌کشی، یا دیوار را برگزین و روی آن کلیک کن.',
  }),
  'coach.den.close.title': g('Close the den', {
    es: 'Cierra la perrera',
    cu: 'Cierra la caseta',
    uk: 'Замкни лігво',
    ru: 'Замкни конуру',
    ti: 'ነቲ መደቀሲ ዕጸው',
    fa: 'لانه را ببند',
  }),
  'coach.den.close.body': g('Walls have to meet. Rain stays out only when it’s a box.', {
    es: 'Los muros tienen que juntarse. La lluvia no entra si es una caja.',
    cu: 'Las paredes tienen que juntarse. La lluvia no entra si es una caja.',
    uk: 'Стіни мають зійтися. Дощ не зайде, лише коли це коробка.',
    ru: 'Стены должны сойтись. Дождь не войдёт, только если это коробка.',
    ti: 'መናድቕ ክራኸቡ ኣለዎም። ሳጹን እንተኾይኑ ጥራይ ዝናብ ኣይኣቱን።',
    fa: 'دیوارها باید به هم برسند. باران فقط وقتی جعبه باشد داخل نمی‌آید.',
  }),
  'coach.den.door.title': g('A way in — dog-sized', {
    es: 'Una entrada — tamaño de perro',
    cu: 'Una entrada — tamaño de perro',
    uk: 'Вхід — розмір собаки',
    ru: 'Вход — размер собаки',
    ti: 'መእተዊ — ዓቐን ከልቢ',
    fa: 'راه ورود — اندازهٔ سگ',
  }),
  'coach.den.door.body': g('Pick Door, click a wall, then tap it and pick 12" or 18".', {
    es: 'Elige Puerta, clic en un muro, luego tócala y elige 12" o 18".',
    cu: 'Escoge Puerta, toca una pared, luego tócala y escoge 12" o 18".',
    uk: 'Обери Двері, клікни стіну, потім торкнись і обери 12" або 18".',
    ru: 'Выбери Дверь, кликни стену, потом нажми и выбери 12" или 18".',
    ti: 'ማዕጾ ምረጽ፣ መንደቕ ጠውቕ፣ ድሕሪኡ ጠውቕ እሞ 12" ወይ 18" ምረጽ.',
    fa: 'در را برگزین، دیوار را کلیک کن، بعد بزن و ۱۲" یا ۱۸" برگزین.',
  }),
  'coach.den.dog-door.title': g('Shrink that door', {
    es: 'Haz esa puerta más chica',
    cu: 'Haz esa puerta más chica',
    uk: 'Зменши ті двері',
    ru: 'Уменьши ту дверь',
    ti: 'ነታ ማዕጾ ኣሕጽር',
    fa: 'آن در را کوچک کن',
  }),
  'coach.den.dog-door.body': g('That’s a people door. Tap it → 12" or 18". Heat pours out of a 3-foot opening.', {
    es: 'Esa es puerta de personas. Tócala → 12" o 18". El calor se escapa por 3 pies.',
    cu: 'Esa es puerta de personas. Tócala → 12" o 18". El calor se escapa por 3 pies.',
    uk: 'Це двері для людей. Торкнись → 12" або 18". Тепло витікає з отвору 3 фути.',
    ru: 'Это дверь для людей. Нажми → 12" или 18". Тепло вытекает из проёма 3 фута.',
    ti: 'እታ ናይ ሰብ ማዕጾ እያ። ጠውቕ → 12" ወይ 18". ካብ 3 ኣእዳው ክፋት ውዑይ ይውጽእ.',
    fa: 'آن درِ آدم‌هاست. بزن → ۱۲" یا ۱۸". گرما از دهانهٔ ۳ فوتی می‌ریزد بیرون.',
  }),
  'coach.den.offset.title': g('Slide it off-center', {
    es: 'Muévela del centro',
    cu: 'Muévela del centro',
    uk: 'Зсунь від центру',
    ru: 'Сдвинь от центра',
    ti: 'ካብ ማእከል ኣንቀሳቕስ',
    fa: 'از وسط بکش کنار',
  }),
  'coach.den.offset.body': g('A door in the middle lets wind hit the bed. Drag it toward a corner.', {
    es: 'Una puerta en el medio deja que el viento dé en la cama. Arrástrala a una esquina.',
    cu: 'Una puerta en el medio deja que el viento dé en la cama. Arrástrala a una esquina.',
    uk: 'Двері посередині пускають вітер на ліжко. Потягни до кута.',
    ru: 'Дверь посередине пускает ветер на лежанку. Потяни к углу.',
    ti: 'ኣብ ማእከል ዘላ ማዕጾ ንናፋስ ኣብ መደቀሲ የእትዎ። ናብ ኩርናዕ ስሓብ.',
    fa: 'در وسط می‌گذارد باد به بستر بزند. به سمت گوشه بکش.',
  }),
  'coach.den.dim.title': g('Label the size', {
    es: 'Etiqueta el tamaño',
    cu: 'Etiqueta el tamaño',
    uk: 'Підпиши розмір',
    ru: 'Подпиши размер',
    ti: 'ነቲ ዓቐን ምልክት ግበር',
    fa: 'اندازه را برچسب بزن',
  }),
  'coach.den.dim.body': g('Size tool → two clicks on a wall. The book wants numbers you can read.', {
    es: 'Medida → dos clics en un muro. El libro quiere números que se puedan leer.',
    cu: 'Medida → dos toques en una pared. El libro quiere números que se puedan leer.',
    uk: 'Розмір → два кліки на стіні. Книжка хоче числа, які можна прочитати.',
    ru: 'Размер → два клика на стене. Книга хочет числа, которые можно прочитать.',
    ti: 'መሳርሒ ዓቐን → ኣብ መንደቕ ክልተ ጠውቕታት። እቲ መጽሓፍ ዝንበብ ቁጽሪ ይደሊ.',
    fa: 'ابزار اندازه → دو کلیک روی دیوار. کتاب عددهایی می‌خواهد که خوانده شوند.',
  }),
  'coach.den.shade.title': g('Shade for summer', {
    es: 'Sombra para el verano',
    cu: 'Sombra para el verano',
    uk: 'Тінь на літо',
    ru: 'Тень на лето',
    ti: 'ንሓጋይ ጽላሎት',
    fa: 'سایه برای تابستان',
  }),
  'coach.den.shade.body': g('Plant a tree beside the den. Textbook: shade in July.', {
    es: 'Planta un árbol junto a la perrera. El libro: sombra en julio.',
    cu: 'Planta un árbol junto a la caseta. El libro: sombra en julio.',
    uk: 'Посади дерево біля лігва. Підручник: тінь у липні.',
    ru: 'Посади дерево рядом с конурой. Учебник: тень в июле.',
    ti: 'ኣብ ጎኒ መደቀሲ ገረብ ተኽል። መጽሓፍ፦ ኣብ ሓምለ ጽላሎት.',
    fa: 'کنار لانه یک درخت بکار. کتاب: سایه در ژوئیه.',
  }),
  'coach.den.judge.title': g('Ask Baboo to judge', {
    es: 'Pide a Baboo que juzgue',
    cu: 'Pídele a Baboo que juzgue',
    uk: 'Попроси Baboo оцінити',
    ru: 'Попроси Baboo оценить',
    ti: 'ን Baboo ክፈርድ ሕተት',
    fa: 'از Baboo بخواه داوری کند',
  }),
  'coach.den.judge.body': g('Open Contest. She scores this den against the textbook list.', {
    es: 'Abre Concurso. Ella califica esta perrera con la lista del libro.',
    cu: 'Abre Concurso. Ella califica esta caseta con la lista del libro.',
    uk: 'Відкрий Конкурс. Вона оцінює лігво за списком підручника.',
    ru: 'Открой Конкурс. Она оценивает конуру по списку учебника.',
    ti: 'ውድድር ክፈት። ነዚ መደቀሲ ብዝርዝር መጽሓፍ ትነጽጎ።',
    fa: 'مسابقه را باز کن. او این لانه را با فهرست کتاب نمره می‌دهد.',
  }),

  'skill.legend': g('Skill level', {
    es: 'Nivel de ayuda', cu: 'Nivel de ayuda', uk: 'Рівень допомоги', ru: 'Уровень помощи', ti: 'ደረጃ ሓገዝ', fa: 'سطح کمک',
  }),
  'skill.lead': g('Lower levels get extra help. Higher levels unlock more tools. You can change this any time.', {
    es: 'Niveles bajos dan más ayuda. Niveles altos abren más herramientas. Se puede cambiar cuando quieras.',
    cu: 'Niveles bajos dan más ayuda. Niveles altos abren más herramientas. Se puede cambiar cuando quieras.',
    uk: 'Нижчі рівні дають більше допомоги. Вищі відкривають більше інструментів. Можна змінити будь-коли.',
    ru: 'Низкие уровни дают больше помощи. Высокие открывают больше инструментов. Можно сменить в любой момент.',
    ti: 'ትሑት ደረጃታት ተወሳኺ ሓገዝ ይህቡ። ልዕሊ ደረጃታት ተወሳኺ መሳርሒታት የኽፍቱ። ኩሉ ግዜ ክትቅይሮ ትኽእል።',
    fa: 'سطح پایین کمک بیشتر می‌گیرد. سطح بالا ابزار بیشتر باز می‌کند. هر وقت خواستی عوض کن.',
  }),
  'skill.novice': g('Novice', {
    es: 'Novato', cu: 'Novato', uk: 'Новачок', ru: 'Новичок', ti: 'ሓድሽ', fa: 'تازه‌کار',
  }),
  'skill.beginner': g('Beginner', {
    es: 'Principiante', cu: 'Principiante', uk: 'Початковий', ru: 'Начинающий', ti: 'ጀማሪ', fa: 'مبتدی',
  }),
  'skill.moderate': g('Moderate', {
    es: 'Intermedio', cu: 'Intermedio', uk: 'Середній', ru: 'Средний', ti: 'ማእከላይ', fa: 'متوسط',
  }),
  'skill.expert': g('Expert', {
    es: 'Experto', cu: 'Experto', uk: 'Експерт', ru: 'Эксперт', ti: 'ክኢላ', fa: 'حرفه‌ای',
  }),
  'skill.novice.blurb': g('First time — we go slow', {
    es: 'Primera vez — vamos despacio',
    cu: 'Primera vez — vamos despacio',
    uk: 'Перший раз — ідемо повільно',
    ru: 'Первый раз — идём медленно',
    ti: 'ቀዳማይ ግዜ — ቀስ ኢልና ንኸይድ',
    fa: 'بار اول — آرام می‌رویم',
  }),
  'skill.beginner.blurb': g('Learning — extra hints', {
    es: 'Aprendiendo — más pistas',
    cu: 'Aprendiendo — más pistas',
    uk: 'Вчимося — більше підказок',
    ru: 'Учимся — больше подсказок',
    ti: 'ንመሃር ኣለና — ተወሳኺ ምልክታት',
    fa: 'در حال یادگیری — راهنمایی بیشتر',
  }),
  'skill.moderate.blurb': g('Rolling — full toolkit', {
    es: 'En marcha — caja de herramientas',
    cu: 'En marcha — caja de herramientas',
    uk: 'У темпі — повний набір',
    ru: 'В темпе — полный набор',
    ti: 'ኣብ ጉዕዞ — ምሉእ መሳርሒታት',
    fa: 'راه افتادی — جعبه ابزار کامل',
  }),
  'skill.expert.blurb': g('Pro — quiet chrome', {
    es: 'Pro — chrome callado',
    cu: 'Pro — chrome callado',
    uk: 'Про — тихий інтерфейс',
    ru: 'Про — тихий интерфейс',
    ti: 'ክኢላ — ህዱእ መተሓላለፊ',
    fa: 'حرفه‌ای — نوار آرام',
  }),

  'new.title': g("Let's start a plan", {
    es: 'Empecemos un plano',
    cu: 'Empecemos un plano',
    uk: 'Почнімо план',
    ru: 'Начнём план',
    ti: 'ትልሚ ንጅምር',
    fa: 'بیا یک پلان شروع کنیم',
  }),
  'new.lead': g('Pick a house to start from, or a blank grid. You can always start over.', {
    es: 'Elige una casa para empezar, o una cuadrícula vacía. Siempre puedes empezar de nuevo.',
    cu: 'Escoge una casa para empezar, o una cuadrícula vacía. Siempre puedes empezar de nuevo.',
    uk: 'Обери будинок для старту або порожню сітку. Завжди можна почати знову.',
    ru: 'Выбери дом для старта или пустую сетку. Всегда можно начать снова.',
    ti: 'ገዛ ምረጽ ወይ ባዶ መርበብ. ኩሉ ግዜ ከም ብሓድሽ ክትጅምር ትኽእል.',
    fa: 'یک خانه برای شروع برگزین، یا شبکهٔ خالی. همیشه می‌توانی از نو شروع کنی.',
  }),
  'new.help': g('How should I help?', {
    es: '¿Cómo te ayudo?',
    cu: '¿Cómo te ayudo?',
    uk: 'Як мені допомагати?',
    ru: 'Как мне помогать?',
    ti: 'ከመይ ጌረ ክሕግዘካ?',
    fa: 'چطور کمکت کنم؟',
  }),
  'new.cancel': g('Cancel', {
    es: 'Cancelar', cu: 'Cancelar', uk: 'Скасувати', ru: 'Отмена', ti: 'ሰርዝ', fa: 'لغو',
  }),

  'teach.hello': g('One step at a time. Hide this whenever you want the whole grid.', {
    es: 'Un paso a la vez. Ocúltalo cuando quieras toda la cuadrícula.',
    cu: 'Un paso a la vez. Escóndelo cuando quieras toda la cuadrícula.',
    uk: 'По одному кроку. Сховай це, коли потрібна вся сітка.',
    ru: 'По одному шагу. Спрячь это, когда нужна вся сетка.',
    ti: 'ሓደ ስጉምቲ ኣብ ሓደ ግዜ. ምሉእ መርበብ ምስ ደሌኻ ሓብኦ.',
    fa: 'یک قدم در یک زمان. وقتی همهٔ شبکه را می‌خواهی این را پنهان کن.',
  }),
  'teach.title': g('Teach', {
    es: 'Enseñar', cu: 'Enseñar', uk: 'Навчання', ru: 'Уроки', ti: 'ምምሃር', fa: 'آموزش',
  }),
  'teach.read.title': g('Read this plan', {
    es: 'Lee este plano',
    cu: 'Lee este plano',
    uk: 'Прочитай цей план',
    ru: 'Прочитай этот план',
    ti: 'ነዚ ትልሚ ኣንብብ',
    fa: 'این پلان را بخوان',
  }),
  'teach.read.lead': g('An architect looks at envelope, entry, daylight, names, size, and the kitchen triangle. Classroom notes — not a stamp.', {
    es: 'Un arquitecto mira el recinto, la entrada, la luz, los nombres, el tamaño y el triángulo de cocina. Notas de clase — no un sello.',
    cu: 'Un arquitecto mira el recinto, la entrada, la luz, los nombres, el tamaño y el triángulo de cocina. Notas de clase — no un sello.',
    uk: 'Архітектор дивиться на оболонку, вхід, світло, назви, розмір і кухонний трикутник. Класні нотатки — не печатка.',
    ru: 'Архитектор смотрит на оболочку, вход, свет, имена, размер и кухонный треугольник. Классные заметки — не печать.',
    ti: 'ኣርኪተክት መዓንጽ፣ መእተዊ፣ ብርሃን፣ ስማት፣ ዓቐንን ስሉስ ክሽነን ይርኢ. ናይ ክፍሊ መዘኻኸሪ — ማሕተም ኣይኮነን.',
    fa: 'معمار به پوسته، ورودی، نور، نام‌ها، اندازه و مثلث آشپزخانه نگاه می‌کند. یادداشت کلاس — نه مهر.',
  }),
  'teach.read.pass': g('Looks good', {
    es: 'Bien', cu: 'Bien', uk: 'Добре', ru: 'Хорошо', ti: 'ጽቡቕ', fa: 'خوب است',
  }),
  'teach.read.warn': g('Take a look', {
    es: 'Mira esto', cu: 'Mira esto', uk: 'Глянь', ru: 'Глянь', ti: 'ርአ', fa: 'نگاه کن',
  }),
  'teach.read.fail': g('Needs a fix', {
    es: 'Hay que arreglar', cu: 'Hay que arreglar', uk: 'Треба виправити', ru: 'Надо поправить', ti: 'ምትዕርራይ የድሊ', fa: 'باید درست شود',
  }),
  'teach.read.skip': g('Not yet', {
    es: 'Aún no', cu: 'Aún no', uk: 'Ще ні', ru: 'Ещё нет', ti: 'ገና ኣይኮነን', fa: 'هنوز نه',
  }),
  'sheet.scale': g('SCALE', {
    es: 'ESCALA', cu: 'ESCALA', uk: 'МАСШТАБ', ru: 'МАСШТАБ', ti: 'መለክዒ', fa: 'مقیاس',
  }),
  'sheet.north': g('N', {
    es: 'N', cu: 'N', uk: 'Пн', ru: 'С', ti: 'ሰ', fa: 'ش',
  }),
  'sheet.grid': g('1 square = {n}', {
    es: '1 cuadro = {n}',
    cu: '1 cuadro = {n}',
    uk: '1 клітинка = {n}',
    ru: '1 клетка = {n}',
    ti: '1 መርበብ = {n}',
    fa: '۱ خانه = {n}',
  }),
  'teach.vocab': g('Vocab', {
    es: 'Vocabulario', cu: 'Vocabulario', uk: 'Словник', ru: 'Словарь', ti: 'ቃላት', fa: 'واژه‌ها',
  }),
  'teach.ell.title': g('Learn the English words', {
    es: 'Aprende las palabras en inglés',
    cu: 'Aprende las palabras en inglés',
    uk: 'Вчи англійські слова',
    ru: 'Учи английские слова',
    ti: 'እንግሊዝኛ ቃላት ተማሃር',
    fa: 'واژه‌های انگلیسی را یاد بگیر',
  }),
  'teach.ell.lead': g('Grades 5–8: say the English word. Your language is the hint. No timer.', {
    es: 'Grados 5–8: di la palabra en inglés. Tu idioma es la pista. Sin reloj.',
    cu: 'Grados 5–8: di la palabra en inglés. Tu idioma es la pista. Sin reloj.',
    uk: '5–8 класи: скажи англійське слово. Твоя мова — підказка. Без таймера.',
    ru: '5–8 классы: скажи английское слово. Твой язык — подсказка. Без таймера.',
    ti: 'ክፍሊ 5–8፦ ነታ እንግሊዝኛ ቃል በል. ቋንቋኻ ምልክት እያ. ሰዓት የለን.',
    fa: 'کلاس ۵ تا ۸: واژهٔ انگلیسی را بگو. زبان تو راهنماست. بدون زمان.',
  }),
  'teach.ell.say': g('Say', {
    es: 'Di', cu: 'Di', uk: 'Скажи', ru: 'Скажи', ti: 'በል', fa: 'بگو',
  }),
  'teach.ell.match': g('Tap an English word, then tap what it means.', {
    es: 'Toca una palabra en inglés, luego toca lo que significa.',
    cu: 'Toca una palabra en inglés, luego toca lo que significa.',
    uk: 'Торкнись англійського слова, потім торкнись значення.',
    ru: 'Нажми английское слово, потом нажми значение.',
    ti: 'እንግሊዝኛ ቃል ጠውቕ፣ ድሕሪኡ ትርጉማ ጠውቕ.',
    fa: 'یک واژهٔ انگلیسی بزن، بعد معنایش را بزن.',
  }),
  'teach.ell.done': g('You know these English words. Use them on the tools.', {
    es: 'Ya sabes estas palabras en inglés. Úsalas en las herramientas.',
    cu: 'Ya sabes estas palabras en inglés. Úsalas en las herramientas.',
    uk: 'Ти знаєш ці англійські слова. Використовуй їх на інструментах.',
    ru: 'Ты знаешь эти английские слова. Используй их на инструментах.',
    ti: 'ነዚኦም እንግሊዝኛ ቃላት ትፈልጥ. ኣብ መሳርሒታት ተጠቐመሎም.',
    fa: 'این واژه‌های انگلیسی را بلدی. روی ابزار از آن‌ها استفاده کن.',
  }),
  'teach.ell.again': g('Practice again', {
    es: 'Practicar otra vez',
    cu: 'Practicar otra vez',
    uk: 'Ще раз',
    ru: 'Ещё раз',
    ti: 'መሊስካ ልምምድ',
    fa: 'دوباره تمرین کن',
  }),
  'teach.ell.score': g('{n} of {total}', {
    es: '{n} de {total}',
    cu: '{n} de {total}',
    uk: '{n} з {total}',
    ru: '{n} из {total}',
    ti: '{n} ካብ {total}',
    fa: '{n} از {total}',
  }),
  'teach.ell.means': g('means', {
    es: 'quiere decir', cu: 'quiere decir', uk: 'означає', ru: 'значит', ti: 'ትርጉማ', fa: 'یعنی',
  }),

  'help.lead': g('Sketch first, then two clicks make a wall. Open Tools on the left if you get stuck.', {
    es: 'Primero boceto, luego dos clics hacen un muro. Abre Herramientas a la izquierda si te atoras.',
    cu: 'Primero boceto, luego dos toques hacen una pared. Abre Herramientas a la izquierda si te atoras.',
    uk: 'Спочатку ескіз, потім два кліки роблять стіну. Відкрий Інструменти ліворуч, якщо застряг.',
    ru: 'Сначала эскиз, потом два клика делают стену. Открой Инструменты слева, если застрял.',
    ti: 'መጀመርታ ስእሊ፣ ድሕሪኡ ክልተ ጠውቕታት መንደቕ ይገብሩ. እንተ ተሓንኪኻ ኣብ ጸጋም መሳርሒታት ክፈት.',
    fa: 'اول طرح، بعد دو کلیک دیوار می‌سازد. اگر گیر کردی ابزار سمت چپ را باز کن.',
  }),

  'udl.title': g('Help for everyone', {
    es: 'Ayuda para todos', cu: 'Ayuda para todos', uk: 'Допомога для всіх', ru: 'Помощь для всех', ti: 'ሓገዝ ንኹሉ', fa: 'کمک برای همه',
  }),
  'udl.lead': g('Same tools for the whole class. English drawing words first, fat taps, bigger type, slower tips.', {
    es: 'Las mismas herramientas para toda la clase. Palabras de dibujo en inglés primero, toques grandes, letra más grande, tips más lentos.',
    cu: 'Las mismas herramientas para toda la clase. Palabras de dibujo en inglés primero, toques grandes, letra más grande, consejos más lentos.',
    uk: 'Ті самі інструменти для всього класу. Англійські слова креслення перші, великі натиски, більший шрифт, повільніші підказки.',
    ru: 'Те же инструменты для всего класса. Английские слова чертежа первые, большие нажатия, крупнее шрифт, медленнее подсказки.',
    ti: 'ELL ክፍሊ 5–8 + ፍሉይ ትምህርቲ፦ ተመሳሳሊ መሳርሒታት፣ እንግሊዝኛ ቅድሚት፣ ዓበይቲ ጠውቕታት፣ ዓቢ ፊደል፣ ዝሓውስ ምኽሪ.',
    fa: 'همان ابزار برای همهٔ کلاس. واژهٔ انگلیسی نقشه اول، ضربهٔ درشت، نوشتهٔ بزرگ‌تر، راهنمای آهسته‌تر.',
  }),
  'udl.fat': g('Bigger buttons (52px taps)', {
    es: 'Botones más grandes (toques de 52px)',
    cu: 'Botones más grandes (toques de 52px)',
    uk: 'Більші кнопки (натиски 52px)',
    ru: 'Больше кнопки (нажатия 52px)',
    ti: 'ዓበይቲ መልጎማት (52px ጠውቕታት)',
    fa: 'دکمه‌های بزرگ‌تر (ضربهٔ ۵۲px)',
  }),
  'udl.type': g('Bigger type on tips and Teach', {
    es: 'Letra más grande en consejos y Enseñar',
    cu: 'Letra más grande en consejos y Enseñar',
    uk: 'Більший шрифт на підказках і в Навчанні',
    ru: 'Крупнее шрифт на подсказках и в Уроках',
    ti: 'ኣብ ምኽርን ምምሃርን ዓቢ ፊደል',
    fa: 'نوشتهٔ درشت‌تر در راهنما و آموزش',
  }),
  'udl.english': g('Teach English words (grades 5–8)', {
    es: 'Enseñar palabras en inglés (grados 5–8)',
    cu: 'Enseñar palabras en inglés (grados 5–8)',
    uk: 'Вчити англійські слова (5–8 класи)',
    ru: 'Учить английские слова (5–8 классы)',
    ti: 'እንግሊዝኛ ቃላት ኣምህር (ክፍሊ 5–8)',
    fa: 'آموزش واژه‌های انگلیسی (کلاس ۵ تا ۸)',
  }),
  'udl.english.lead': g('Wall, Door, Sketch stay in English on the tools. Your language sits under so kids can learn the drawing words.', {
    es: 'Wall, Door, Sketch se quedan en inglés en las herramientas. Tu idioma va debajo para que aprendan las palabras de dibujo.',
    cu: 'Wall, Door, Sketch se quedan en inglés en las herramientas. Tu idioma va debajo para que aprendan las palabras de dibujo.',
    uk: 'Wall, Door, Sketch лишаються англійською на інструментах. Твоя мова — під ними, щоб вчити слова креслення.',
    ru: 'Wall, Door, Sketch остаются по-английски на инструментах. Твой язык — под ними, чтобы учить слова чертежа.',
    ti: 'Wall, Door, Sketch ብእንግሊዝኛ ኣብ መሳርሒታት ይጸንሓ. ቋንቋኻ ኣብ ታሕቲ እያ ምእንቲ ቃላት ስእሊ ክመሃሩ.',
    fa: 'Wall، Door، Sketch روی ابزار انگلیسی می‌مانند. زبان تو زیر آن‌هاست تا واژه‌های نقشه را یاد بگیرند.',
  }),
  'udl.contrast': g('High contrast stays on Stark white + blue. Darker words, thicker lines.', {
    es: 'El alto contraste se queda en Stark blanco + azul. Letras más oscuras, líneas más gruesas.',
    cu: 'El alto contraste se queda en Stark blanco + azul. Letras más oscuras, líneas más gruesas.',
    uk: 'Високий контраст лишається на Stark білий + синій. Темніші слова, товстіші лінії.',
    ru: 'Высокий контраст остаётся на Stark белый + синий. Темнее слова, толще линии.',
    ti: 'High contrast — Stark.',
    fa: 'کنتراست بالا روی Stark سفید + آبی می‌ماند. واژه‌های تیره‌تر، خط‌های ضخیم‌تر.',
  }),
  'udl.contrastOn': g('High contrast', {
    es: 'Alto contraste', cu: 'Alto contraste', uk: 'Високий контраст', ru: 'Высокий контраст', ti: 'High contrast', fa: 'کنتراست بالا',
  }),
  'lang.tips': g('Tip language', {
    es: 'Idioma de consejos', cu: 'Idioma de consejos', uk: 'Мова підказок', ru: 'Язык подсказок', ti: 'Tip language', fa: 'زبان راهنما',
  }),
  'teach.spine': g('Class words stay in English. Tips are in {lang}.', {
    es: 'Las palabras de clase se quedan en inglés. Los consejos están en {lang}.',
    cu: 'Las palabras de clase se quedan en inglés. Los consejos están en {lang}.',
    uk: 'Класні слова лишаються англійською. Підказки — {lang}.',
    ru: 'Классные слова остаются по-английски. Подсказки — {lang}.',
    ti: 'Class words English. Tips: {lang}.',
    fa: 'واژه‌های کلاس انگلیسی می‌مانند. راهنما به {lang} است.',
  }),
  'toast.wallIn': g('Wall is in — add a Door on a wall next', {
    es: 'Muro listo — ahora pon una Puerta en un muro',
    cu: 'Pared lista — ahora pon una Puerta en una pared',
    uk: 'Стіна є — далі двері на стіні',
    ru: 'Стена есть — дальше дверь на стене',
    ti: 'Wall is in.',
    fa: 'دیوار گذاشته شد — بعد یک در روی دیوار بگذار',
  }),
  'toast.wallShort': g('Make the wall a bit longer', {
    es: 'Haz el muro un poco más largo',
    cu: 'Haz la pared un poco más larga',
    uk: 'Зроби стіну трохи довшою',
    ru: 'Сделай стену чуть длиннее',
    ti: 'Make the wall longer.',
    fa: 'دیوار را کمی بلندتر کن',
  }),
  'toast.plantIn': g('Plant is in — drag to move it', {
    es: 'Planta lista — arrástrala para moverla',
    cu: 'Planta lista — arrástrala para moverla',
    uk: 'Рослина на місці — тягни, щоб посунути',
    ru: 'Растение на месте — тяни, чтобы сдвинуть',
    ti: 'Plant is in.',
    fa: 'گیاه گذاشته شد — بکش تا جابه‌جا شود',
  }),
  'toast.capRooms': g('Room limit · 12 max', {
    es: 'Límite de cuartos · 12 máx',
    cu: 'Límite de cuartos · 12 máx',
    uk: 'Ліміт кімнат · макс. 12',
    ru: 'Лимит комнат · макс. 12',
    ti: 'Room limit · 12',
    fa: 'حد اتاق · حداکثر ۱۲',
  }),
  'toast.capWalls': g('Wall limit · 40 max', {
    es: 'Límite de muros · 40 máx',
    cu: 'Límite de paredes · 40 máx',
    uk: 'Ліміт стін · макс. 40',
    ru: 'Лимит стен · макс. 40',
    ti: 'Wall limit · 40',
    fa: 'حد دیوار · حداکثر ۴۰',
  }),
  'toast.capObjects': g('Object limit · 60 max', {
    es: 'Límite de objetos · 60 máx',
    cu: 'Límite de objetos · 60 máx',
    uk: 'Ліміт речей · макс. 60',
    ru: 'Лимит вещей · макс. 60',
    ti: 'Object limit · 60',
    fa: 'حد وسیله · حداکثر ۶۰',
  }),
  'toast.capBody': g('Delete some to add more.', {
    es: 'Borra algunos para añadir más.',
    cu: 'Borra algunos para añadir más.',
    uk: 'Видали дещо, щоб додати ще.',
    ru: 'Удали часть, чтобы добавить ещё.',
    ti: 'Delete some to add more.',
    fa: 'چند تا را پاک کن تا جای جدید باز شود.',
  }),
  'toast.mark.ok': g('Done', {
    es: 'Listo', cu: 'Listo', uk: 'Готово', ru: 'Готово', ti: 'Done', fa: 'انجام شد',
  }),
  'toast.mark.miss': g('Try again', {
    es: 'Otra vez', cu: 'Otra vez', uk: 'Ще раз', ru: 'Ещё раз', ti: 'Try again', fa: 'دوباره',
  }),
  'toast.mark.cap': g('Full', {
    es: 'Lleno', cu: 'Lleno', uk: 'Повно', ru: 'Полно', ti: 'Full', fa: 'پر',
  }),
  'toast.mark.info': g('Tip', {
    es: 'Consejo', cu: 'Consejo', uk: 'Підказка', ru: 'Подсказка', ti: 'Tip', fa: 'راهنما',
  }),

  'floor.title': g('Flooring', {
    es: 'Piso (Flooring)', cu: 'Piso (Flooring)', uk: 'Підлога (Flooring)', ru: 'Пол (Flooring)', ti: 'ወለል (Flooring)', fa: 'کف (Flooring)',
  }),
  'floor.lead': g('House default. Tap a named room to pick a different floor for that room.', {
    es: 'Piso de la casa. Toca un cuarto con nombre para otro piso en ese cuarto.',
    cu: 'Piso de la casa. Toca un cuarto con nombre para otro piso en ese cuarto.',
    uk: 'Підлога всього дому. Торкнись названої кімнати, щоб змінити її підлогу.',
    ru: 'Пол всего дома. Нажми названную комнату, чтобы сменить её пол.',
    ti: 'ናይ ገዛ ወለል. ንኻልእ ወለል ናይቲ ክፍሊ ስም ዘለዎ ክፍሊ ጠውቕ.',
    fa: 'کف پیش‌فرض خانه. روی اتاق نام‌دار بزن تا کف همان اتاق عوض شود.',
  }),
  'floor.oak': g('Oak', { es: 'Roble', cu: 'Roble', uk: 'Дуб', ru: 'Дуб', ti: 'ኦክ', fa: 'بلوط' }),
  'floor.walnut': g('Walnut', { es: 'Nogal', cu: 'Nogal', uk: 'Горіх', ru: 'Орех', ti: 'ዋልነት', fa: 'گردو' }),
  'floor.maple': g('Maple', { es: 'Arce', cu: 'Arce', uk: 'Клен', ru: 'Клён', ti: 'መፕል', fa: 'افرا' }),
  'floor.herringbone': g('Herringbone', { es: 'Espiga', cu: 'Espiga', uk: 'Ялинка', ru: 'Ёлочка', ti: 'ሽጉጥ', fa: 'جناغی' }),
  'floor.tile': g('Tile', { es: 'Loseta', cu: 'Loseta', uk: 'Кахель', ru: 'Кафель', ti: 'ታይል', fa: 'کاشی' }),
  'floor.hex': g('Hex tile', { es: 'Hexágono', cu: 'Hexágono', uk: 'Шестикутник', ru: 'Шестигранник', ti: 'ሽዱሽተ ኩርናዕ', fa: 'کاشی شش‌گوش' }),
  'floor.carpet': g('Carpet', { es: 'Alfombra', cu: 'Alfombra', uk: 'Килим', ru: 'Ковёр', ti: 'ምንጻፍ', fa: 'موکت' }),
  'floor.denim': g('Blue carpet', { es: 'Alfombra azul', cu: 'Alfombra azul', uk: 'Синій килим', ru: 'Синий ковёр', ti: 'ሰማያዊ ምንጻፍ', fa: 'موکت آبی' }),
  'floor.lino': g('Linoleum', { es: 'Linóleo', cu: 'Linóleo', uk: 'Лінолеум', ru: 'Линолеум', ti: 'ሊኖሌየም', fa: 'لینولئوم' }),
  'floor.concrete': g('Concrete', { es: 'Concreto', cu: 'Concreto', uk: 'Бетон', ru: 'Бетон', ti: 'ኮንክሪት', fa: 'بتن' }),
  'floor.checker': g('Checker', { es: 'Ajedrez', cu: 'Ajedrez', uk: 'Шахи', ru: 'Шашка', ti: 'ደረት', fa: 'شطرنجی' }),
  'floor.slate': g('Slate', { es: 'Pizarra', cu: 'Pizarra', uk: 'Сланець', ru: 'Сланец', ti: 'ስሌት', fa: 'سنگ لوح' }),
  'floor.terracotta': g('Terracotta', { es: 'Terracota', cu: 'Terracota', uk: 'Теракота', ru: 'Терракота', ti: 'ቴራኮታ', fa: 'سفال' }),
  'floor.brick': g('Brick paver', { es: 'Ladrillo', cu: 'Ladrillo', uk: 'Цегла', ru: 'Кирпич', ti: 'ሕጡብ', fa: 'آجر' }),
  'floor.cork': g('Cork', { es: 'Corcho', cu: 'Corcho', uk: 'Корок', ru: 'Пробка', ti: 'ኮርክ', fa: 'چوب‌پنبه' }),
  'floor.marble': g('Marble', { es: 'Mármol', cu: 'Mármol', uk: 'Мармур', ru: 'Мрамор', ti: 'ማርብል', fa: 'مرمر' }),
  'floor.grain': g('Plank direction', {
    es: 'Dirección de las tablas', cu: 'Dirección de las tablas', uk: 'Напрям дощок', ru: 'Направление досок', ti: 'ኣንፈት ሳንቃ', fa: 'جهت تخته',
  }),
  'floor.grain.across': g('Across', {
    es: 'A lo ancho', cu: 'A lo ancho', uk: 'Впоперек', ru: 'Поперёк', ti: 'ኣግድም', fa: 'عرضی',
  }),
  'floor.grain.along': g('Along', {
    es: 'A lo largo', cu: 'A lo largo', uk: 'Вздовж', ru: 'Вдоль', ti: 'ንነውሒ', fa: 'طولی',
  }),
  'floor.applyAll': g('Use this floor in every room', {
    es: 'Usar este piso en todos los cuartos',
    cu: 'Usar este piso en todos los cuartos',
    uk: 'Ця підлога в кожній кімнаті',
    ru: 'Этот пол в каждой комнате',
    ti: 'እዚ ወለል ኣብ ኩሉ ክፍሊ',
    fa: 'همین کف در همه اتاق‌ها',
  }),

  'scene.title': g('3D look', {
    es: 'Vista 3D', cu: 'Vista 3D', uk: 'Вигляд 3D', ru: 'Вид 3D', ti: 'ትርኢት 3D', fa: 'نمای سه‌بعدی',
  }),
  'scene.lead': g('Changes the Solid 3D preview · view only', {
    es: 'Cambia la vista 3D sólida · solo mirar',
    cu: 'Cambia la vista 3D sólida · solo mirar',
    uk: 'Змінює суцільний 3D перегляд · лише дивитись',
    ru: 'Меняет сплошной 3D просмотр · только смотреть',
    ti: 'ነቲ ጽኑዕ 3D ትርኢት ይቕይር · ምርኣይ ጥራይ',
    fa: 'پیش‌نمایش سه‌بعدی را عوض می‌کند · فقط نگاه',
  }),
  'scene.sky': g('Sky look', {
    es: 'Cielo', cu: 'Cielo', uk: 'Небо', ru: 'Небо', ti: 'ሰማይ', fa: 'آسمان',
  }),
  'scene.yard': g('Yard look', {
    es: 'Patio', cu: 'Patio', uk: 'Двір', ru: 'Двор', ti: 'ሓጺር', fa: 'حیاط',
  }),
  'scene.wall': g('Wall color', {
    es: 'Color de muro', cu: 'Color de pared', uk: 'Колір стіни', ru: 'Цвет стены', ti: 'ሕብሪ መንደቕ', fa: 'رنگ دیوار',
  }),
  'scene.furn': g('Show furniture in 3D', {
    es: 'Mostrar muebles en 3D',
    cu: 'Mostrar muebles en 3D',
    uk: 'Показати меблі в 3D',
    ru: 'Показать мебель в 3D',
    ti: 'ኣቓሑት ኣብ 3D ኣርኢ',
    fa: 'نمایش مبلمان در سه‌بعدی',
  }),

  '3d.viewonly': g('view-only', {
    es: 'solo mirar', cu: 'solo mirar', uk: 'лише дивитись', ru: 'только смотреть', ti: 'ምርኣይ ጥራይ', fa: 'فقط نگاه',
  }),
  '3d.banner': g('Edit walls, doors, and furniture in', {
    es: 'Edita muros, puertas y muebles en',
    cu: 'Edita paredes, puertas y muebles en',
    uk: 'Редагуй стіни, двері й меблі в',
    ru: 'Править стены, двери и мебель в',
    ti: 'መናድቕ፣ ማዕጾታትን ኣቓሑትን ኣብዚ ኣርም',
    fa: 'دیوار، در و مبلمان را ویرایش کن در',
  }),
  '3d.empty': g('Draw walls in 2D to see them in 3D', {
    es: 'Dibuja muros en 2D para verlos en 3D',
    cu: 'Dibuja paredes en 2D para verlas en 3D',
    uk: 'Намалюй стіни в 2D, щоб побачити їх у 3D',
    ru: 'Нарисуй стены в 2D, чтобы увидеть их в 3D',
    ti: 'ኣብ 2D መናድቕ ስኣል ምእንቲ ኣብ 3D ክትርእዮም',
    fa: 'در ۲بعدی دیوار بکش تا در سه‌بعدی ببینی',
  }),
  '3d.preview': g('3D preview', {
    es: 'Vista 3D', cu: 'Vista 3D', uk: 'Перегляд 3D', ru: 'Просмотр 3D', ti: 'ቅድመ ትርኢት 3D', fa: 'پیش‌نمایش سه‌بعدی',
  }),
  '3d.drag': g('Drag to orbit · Shift-drag pans · scroll zooms. View only — edit in 2D Plan.', {
    es: 'Arrastra para orbitar · Mayús-arrastrar mueve · rueda acerca. Solo mirar — edita en Plano 2D.',
    cu: 'Arrastra para orbitar · Mayús-arrastrar mueve · rueda acerca. Solo mirar — edita en Plano 2D.',
    uk: 'Тягни, щоб обертати · Shift тягне план · колесо зум. Лише дивитись — редагуй у Плані 2D.',
    ru: 'Тяни, чтобы вращать · Shift двигает · колесо зум. Только смотреть — правь в Плане 2D.',
    ti: 'ንምዝዋር ስሓብ · Shift ስሓብ የንቀሳቕስ · መንኰርኰር የቕርብ. ምርኣይ ጥራይ — ኣብ ትልሚ 2D ኣርም.',
    fa: 'بکش تا بچرخد · شیفت+کشیدن جابه‌جا می‌کند · اسکرول زوم. فقط نگاه — در پلان ۲بعدی ویرایش کن.',
  }),
  '3d.drag.walk': g('Drag to look · scroll or buttons walk. Still view only.', {
    es: 'Arrastra para mirar · rueda o botones caminan. Sigue solo mirar.',
    cu: 'Arrastra para mirar · rueda o botones caminan. Sigue solo mirar.',
    uk: 'Тягни, щоб дивитись · колесо або кнопки йдуть. Усе ще лише дивитись.',
    ru: 'Тяни, чтобы смотреть · колесо или кнопки идут. Всё ещё только смотреть.',
    ti: 'ንምርኣይ ስሓብ · መንኰርኰር ወይ መልጎማት የኸዱ. ገና ምርኣይ ጥራይ.',
    fa: 'بکش تا نگاه کنی · اسکرول یا دکمه راه می‌روند. هنوز فقط نگاه.',
  }),
  '3d.reset': g('Reset view', {
    es: 'Reiniciar vista', cu: 'Reiniciar vista', uk: 'Скинути вигляд', ru: 'Сбросить вид', ti: 'ትርኢት ዳግም', fa: 'بازنشانی نما',
  }),
  '3d.walk.title': g('Walkthrough', {
    es: 'Recorrido', cu: 'Recorrido', uk: 'Прохід', ru: 'Проход', ti: 'ምጉዓዝ', fa: 'گشت',
  }),
  '3d.walk.fwd': g('Walk in', {
    es: 'Entrar', cu: 'Entrar', uk: 'Крок уперед', ru: 'Шаг вперёд', ti: 'ኣቲ', fa: 'برو جلو',
  }),
  '3d.walk.back': g('Walk back', {
    es: 'Atrás', cu: 'Atrás', uk: 'Крок назад', ru: 'Шаг назад', ti: 'ተመለስ', fa: 'برو عقب',
  }),
  '3d.tier.plan': g('Plan (2D)', {
    es: 'Plano (2D)', cu: 'Plano (2D)', uk: 'План (2D)', ru: 'План (2D)', ti: 'ትልሚ (2D)', fa: 'پلان (۲بعدی)',
  }),
  '3d.tier.plan.blurb': g('Traditional drafting — edit here.', {
    es: 'Dibujo tradicional — edita aquí.',
    cu: 'Dibujo tradicional — edita aquí.',
    uk: 'Звичайне креслення — редагуй тут.',
    ru: 'Обычный чертёж — правь здесь.',
    ti: 'ልሙድ ስእሊ — ኣብዚ ኣርም.',
    fa: 'نقشهٔ سنتی — اینجا ویرایش کن.',
  }),
  '3d.tier.solid': g('Solid 3D', {
    es: 'Sólido 3D', cu: 'Sólido 3D', uk: 'Суцільний 3D', ru: 'Сплошной 3D', ti: 'ጽኑዕ 3D', fa: 'جامد سه‌بعدی',
  }),
  '3d.tier.solid.blurb': g('Orbit the house · view only.', {
    es: 'Orbita la casa · solo mirar.',
    cu: 'Orbita la casa · solo mirar.',
    uk: 'Обертай будинок · лише дивитись.',
    ru: 'Вращай дом · только смотреть.',
    ti: 'ነቲ ገዛ ኣዘውር · ምርኣይ ጥራይ.',
    fa: 'خانه را بچرخان · فقط نگاه.',
  }),
  '3d.tier.mat': g('Materials', {
    es: 'Materiales', cu: 'Materiales', uk: 'Матеріали', ru: 'Материалы', ti: 'ንዋት', fa: 'مصالح',
  }),
  '3d.tier.mat.blurb': g('Grass, shingles, wall tint.', {
    es: 'Césped, tejas, tinte de muro.',
    cu: 'Yerba, tejas, tinte de pared.',
    uk: 'Трава, черепиця, колір стін.',
    ru: 'Трава, черепица, цвет стен.',
    ti: 'ሳዕሪ፣ ሽንጣጤ ጣራ፣ ሕብሪ መንደቕ.',
    fa: 'چمن، پوشش سقف، رنگ دیوار.',
  }),
  '3d.tier.light': g('Lighting', {
    es: 'Luz', cu: 'Luz', uk: 'Світло', ru: 'Свет', ti: 'ብርሃን', fa: 'نور',
  }),
  '3d.tier.light.blurb': g('Sun, shade, dusk glow.', {
    es: 'Sol, sombra, brillo del atardecer.',
    cu: 'Sol, sombra, brillo del atardecer.',
    uk: 'Сонце, тінь, вечірнє світло.',
    ru: 'Солнце, тень, вечерний свет.',
    ti: 'ጸሓይ፣ ጽላሎት፣ ብርሃን ምሸት.',
    fa: 'خورشید، سایه، نور غروب.',
  }),
  '3d.tier.walk': g('Walkthrough', {
    es: 'Recorrido', cu: 'Recorrido', uk: 'Прохід', ru: 'Проход', ti: 'ምጉዓዝ', fa: 'گشت',
  }),
  '3d.tier.walk.blurb': g('Eye-height look inside.', {
    es: 'Mirar adentro a la altura de los ojos.',
    cu: 'Mirar adentro a la altura de los ojos.',
    uk: 'Погляд з висоти очей усередині.',
    ru: 'Взгляд с высоты глаз внутри.',
    ti: 'ካብ ቁመት ዓይኒ ውሽጢ ምርኣይ.',
    fa: 'نگاه از قد چشم به داخل.',
  }),

  'chrome.more': g('More', {
    es: 'Más', cu: 'Más', uk: 'Ще', ru: 'Ещё', ti: 'ተወሳኺ', fa: 'بیشتر',
  }),
  'chrome.viewonly': g('View only', {
    es: 'Solo mirar', cu: 'Solo mirar', uk: 'Лише дивитись', ru: 'Только смотреть', ti: 'ምርኣይ ጥራይ', fa: 'فقط نگاه',
  }),
  'chrome.hide': g('Hide', {
    es: 'Ocultar', cu: 'Esconder', uk: 'Сховати', ru: 'Скрыть', ti: 'ሓብእ', fa: 'پنهان',
  }),
  'chrome.teachClose': g('Close Teach', {
    es: 'Cerrar Enseñar', cu: 'Cerrar Enseñar', uk: 'Закрити Навчання', ru: 'Закрыть Уроки', ti: 'ምምሃር ዕጸው', fa: 'بستن آموزش',
  }),
  'chrome.contestBaboo': g('Baboo’s contest', {
    es: 'Concurso de Baboo', cu: 'Concurso de Baboo', uk: 'Конкурс Baboo', ru: 'Конкурс Baboo', ti: 'ውድድር Baboo', fa: 'مسابقهٔ Baboo',
  }),
  'chrome.accessCheck': g('Access check', {
    es: 'Chequeo de acceso', cu: 'Chequeo de acceso', uk: 'Перевірка доступу', ru: 'Проверка доступа', ti: 'ምርመራ መእተዊ', fa: 'بررسی دسترسی',
  }),
  'chrome.classCard': g('Class card', {
    es: 'Tarjeta de clase', cu: 'Tarjeta de clase', uk: 'Картка класу', ru: 'Карточка класса', ti: 'ካርድ ክፍሊ', fa: 'کارت کلاس',
  }),
  'chrome.classFolder': g('Class folder', {
    es: 'Carpeta de clase', cu: 'Carpeta de clase', uk: 'Папка класу', ru: 'Папка класса', ti: 'ፎልደር ክፍሊ', fa: 'پوشهٔ کلاس',
  }),
  'chrome.import': g('Import', {
    es: 'Importar', cu: 'Importar', uk: 'Імпорт', ru: 'Импорт', ti: 'ኣእትው', fa: 'وارد کردن',
  }),
  'chrome.drive': g('Drive', {
    es: 'Drive', cu: 'Drive', uk: 'Drive', ru: 'Drive', ti: 'Drive', fa: 'Drive',
  }),
  'chrome.teacher': g('Teacher', {
    es: 'Maestro', cu: 'Maestro', uk: 'Учитель', ru: 'Учитель', ti: 'መምህር', fa: 'معلم',
  }),
  'chrome.drawHouse': g('Draw a house for class', {
    es: 'Dibuja una casa para la clase',
    cu: 'Dibuja una casa para la clase',
    uk: 'Намалюй будинок для класу',
    ru: 'Нарисуй дом для класса',
    ti: 'ንክፍሊ ገዛ ስኣል',
    fa: 'برای کلاس یک خانه بکش',
  }),
  'chrome.projectName': g('Project name', {
    es: 'Nombre del plano', cu: 'Nombre del plano', uk: 'Назва плану', ru: 'Имя плана', ti: 'ስም ትልሚ', fa: 'نام پلان',
  }),
  'chrome.saved': g('Saved', {
    es: 'Guardado', cu: 'Guardado', uk: 'Збережено', ru: 'Сохранено', ti: 'ተዓቂቡ', fa: 'ذخیره شد',
  }),
  'chrome.saving': g('Saving…', {
    es: 'Guardando…', cu: 'Guardando…', uk: 'Збереження…', ru: 'Сохранение…', ti: 'ይዕቀብ ኣሎ…', fa: 'در حال ذخیره…',
  }),
  'chrome.unsaved': g('Unsaved', {
    es: 'Sin guardar', cu: 'Sin guardar', uk: 'Не збережено', ru: 'Не сохранено', ti: 'ኣይተዓቀበን', fa: 'ذخیره نشده',
  }),
  'chrome.saveError': g('Save error', {
    es: 'Error al guardar', cu: 'Error al guardar', uk: 'Помилка збереження', ru: 'Ошибка сохранения', ti: 'ጌጋ ምዕቃብ', fa: 'خطای ذخیره',
  }),
  'chrome.panels': g('Studio panels', {
    es: 'Paneles del estudio', cu: 'Paneles del estudio', uk: 'Панелі студії', ru: 'Панели студии', ti: 'ፓነላት ስቱድዮ', fa: 'پنل‌های استودیو',
  }),
  'chrome.showPanels': g('Show Teach, Contest, Access, Help, and Settings', {
    es: 'Mostrar Enseñar, Concurso, Acceso, Ayuda y Ajustes',
    cu: 'Mostrar Enseñar, Concurso, Acceso, Ayuda y Ajustes',
    uk: 'Показати Навчання, Конкурс, Доступ, Допомогу й Налаштування',
    ru: 'Показать Уроки, Конкурс, Доступ, Помощь и Настройки',
    ti: 'ምምሃር፣ ውድድር፣ መእተዊ፣ ሓገዝን ቅጥዕታትን ኣርኢ',
    fa: 'نمایش آموزش، مسابقه، دسترسی، راهنما و تنظیمات',
  }),
  'chrome.hidePanels': g('Hide panels (Esc)', {
    es: 'Ocultar paneles (Esc)', cu: 'Esconder paneles (Esc)', uk: 'Сховати панелі (Esc)', ru: 'Скрыть панели (Esc)', ti: 'ፓነላት ሓብእ (Esc)', fa: 'پنهان کردن پنل‌ها (Esc)',
  }),

  'hint.snapOn': g('Snap ON', {
    es: 'Imán ON', cu: 'Imán ON', uk: 'Прив’язка УВІМК', ru: 'Привязка ВКЛ', ti: 'ምልጣፍ ON', fa: 'چسبیدن روشن',
  }),
  'hint.snapOff': g('Snap OFF', {
    es: 'Imán OFF', cu: 'Imán OFF', uk: 'Прив’язка ВИМК', ru: 'Привязка ВЫКЛ', ti: 'ምልጣፍ OFF', fa: 'چسبیدن خاموش',
  }),

  'help.title': g('Help · About', {
    es: 'Ayuda · Acerca de', cu: 'Ayuda · Acerca de', uk: 'Допомога · Про застосунок', ru: 'Помощь · О программе', ti: 'ሓገዝ · ብዛዕባ', fa: 'راهنما · درباره',
  }),
  'help.sketch': g('Sketch — drag like a pencil. Architecture starts here. Tap a sketch → Trace to turn it into walls.', {
    es: 'Boceto (Sketch) — arrastra como lápiz. La arquitectura empieza aquí. Toca un boceto → Trazar para hacer muros.',
    cu: 'Boceto (Sketch) — arrastra como lápiz. La arquitectura empieza aquí. Toca un boceto → Trazar para hacer paredes.',
    uk: 'Ескіз (Sketch) — тягни як олівцем. Архітектура починається тут. Торкнись ескізу → Обвести, щоб зробити стіни.',
    ru: 'Эскиз (Sketch) — тяни как карандашом. Архитектура начинается здесь. Нажми эскиз → Обвести, чтобы сделать стены.',
    ti: 'ስእሊ (Sketch) — ከም ብርዒ ስሓብ. ስነ-ህንጻ ኣብዚ ይጅምር. ስእሊ ጠውቕ → መናድቕ ንምግባር ቀጥታ.',
    fa: 'طرح (Sketch) — مثل مداد بکش. معماری از اینجا شروع می‌شود. طرح را بزن → خط‌کشی تا دیوار شود.',
  }),
  'help.wall': g('Wall — click start, click end. Pull 45° for a slanted corner, or Wall → Clip and click a sharp corner.', {
    es: 'Muro (Wall) — clic inicio, clic fin. Tira a 45° para una esquina, o Muro → Recorte y clic en una esquina aguda.',
    cu: 'Pared (Wall) — toca inicio, toca fin. Tira a 45° para una esquina, o Pared → Recorte y toca una esquina aguda.',
    uk: 'Стіна (Wall) — клік початок, клік кінець. Тягни 45° для скошеного кута, або Стіна → Зріз і клікни гострий кут.',
    ru: 'Стена (Wall) — клик начало, клик конец. Тяни 45° для скошенного угла, или Стена → Срез и кликни острый угол.',
    ti: 'መንደቕ (Wall) — ጠውቕ መጀመርታ፣ ጠውቕ መወዳእታ. ንኩርናዕ 45° ስሓብ፣ ወይ መንደቕ → ቑረጽ እሞ ርሱን ኩርናዕ ጠውቕ.',
    fa: 'دیوار (Wall) — کلیک شروع، کلیک پایان. برای گوشهٔ کج ۴۵° بکش، یا دیوار → برش و گوشهٔ تیز را کلیک کن.',
  }),
  'help.door': g('Door / Window — click on a wall to place. Tap one: the edit panel docks on the side. Drag to slide.', {
    es: 'Puerta / Ventana — clic en un muro. Tócala: el panel se pega al lado. Arrástrala para deslizarla.',
    cu: 'Puerta / Ventana — toca una pared. Tócala: el panel se pega al lado. Arrástrala para deslizarla.',
    uk: 'Двері / Вікно — клікни на стіну, щоб поставити. Торкнись: панель редагування збоку. Тягни, щоб зсунути.',
    ru: 'Дверь / Окно — кликни на стену, чтобы поставить. Нажми: панель правки сбоку. Тяни, чтобы сдвинуть.',
    ti: 'ማዕጾ / መስኮት — ኣብ መንደቕ ጠውቕ. ሓንቲ ጠውቕ፦ ፓነል ኣርትዖት ኣብ ጎኒ ይተኣሳሰር. ንምንቅስቓስ ስሓብ.',
    fa: 'در / پنجره — روی دیوار کلیک کن تا بگذاری. یکی را بزن: پنل ویرایش به پهلو می‌چسبد. بکش تا بلغزد.',
  }),
  'help.furn': g('Furniture — open Tools → Furn. → List, click to place, or drag onto the plan; then move with Select.', {
    es: 'Mueble — abre Herramientas → Mueble → Lista, clic para colocar, o arrastra al plano; luego muévelo con Elegir.',
    cu: 'Mueble — abre Herramientas → Mueble → Lista, toca para colocar, o arrastra al plano; luego muévelo con Escoger.',
    uk: 'Меблі — відкрий Інструменти → Меблі → Список, клікни або тягни на план; потім рухай через Обрати.',
    ru: 'Мебель — открой Инструменты → Мебель → Список, кликни или тяни на план; потом двигай через Выбрать.',
    ti: 'ኣቓሑት — መሳርሒታት → ኣቓሑት → ዝርዝር ክፈት፣ ጠውቕ ወይ ናብ ትልሚ ስሓብ፣ ድሕሪኡ ብምረጽ ኣንቀሳቕስ.',
    fa: 'مبلمان — ابزار → مبلمان → فهرست را باز کن، کلیک کن یا روی پلان بکش؛ بعد با انتخاب جابه‌جا کن.',
  }),
  'help.room': g('Room — pick Kitchen, Bath, Living… then click inside walls that close.', {
    es: 'Cuarto (Room) — elige Cocina, Baño, Sala… luego clic dentro de muros cerrados.',
    cu: 'Cuarto (Room) — escoge Cocina, Baño, Sala… luego toca dentro de paredes cerradas.',
    uk: 'Кімната (Room) — обери Кухня, Ванна, Вітальня… потім клікни всередині замкнених стін.',
    ru: 'Комната (Room) — выбери Кухня, Ванна, Гостиная… потом кликни внутри замкнутых стен.',
    ti: 'ክፍሊ (Room) — ክሽነ፣ ሽቃቅ፣ ሳሎን ምረጽ… ድሕሪኡ ኣብ ውሽጢ ዝተዓጽዉ መናድቕ ጠውቕ.',
    fa: 'اتاق (Room) — آشپزخانه، حمام، نشیمن را برگزین… بعد داخل دیوارهای بسته کلیک کن.',
  }),
  'help.size': g('Size — click two points. A length label stays on the plan.', {
    es: 'Medida — clic en dos puntos. Una etiqueta de tamaño queda en el plano.',
    cu: 'Medida — toca dos puntos. Una etiqueta de tamaño queda en el plano.',
    uk: 'Розмір — клікни дві точки. Підпис довжини лишається на плані.',
    ru: 'Размер — кликни две точки. Подпись длины остаётся на плане.',
    ti: 'ዓቐን — ክልተ ነጥብታት ጠውቕ. ምልክት ንውሓት ኣብቲ ትልሚ ይተርፍ.',
    fa: 'اندازه — دو نقطه کلیک کن. برچسب درازا روی پلان می‌ماند.',
  }),
  'help.note': g('Note — click, then type (sun, electric, “front door”).', {
    es: 'Nota — clic, luego escribe (sol, luz, “puerta de frente”).',
    cu: 'Nota — toca, luego escribe (sol, luz, “puerta de frente”).',
    uk: 'Нотатка — клікни, потім пиши (сонце, світло, «вхідні двері»).',
    ru: 'Заметка — кликни, потом пиши (солнце, свет, «входная дверь»).',
    ti: 'መዘኻኸሪ — ጠውቕ፣ ድሕሪኡ ጽሓፍ (ጸሓይ፣ ብርሃን፣ “ናይ ቅድሚት ማዕጾ”).',
    fa: 'یادداشت — کلیک کن، بعد بنویس (آفتاب، برق، «در جلو»).',
  }),
  'help.plant': g('Plant — tree, plant bed, or path for the yard.', {
    es: 'Planta — árbol, macizo o camino para el patio.',
    cu: 'Planta — árbol, cantero o camino para el patio.',
    uk: 'Рослина — дерево, клумба чи стежка для двору.',
    ru: 'Растение — дерево, клумба или дорожка для двора.',
    ti: 'ተኽል — ገረብ፣ ዕንፀይቲ ወይ መንገዲ ንሓጺር.',
    fa: 'گیاه — درخت، باغچه یا راه برای حیاط.',
  }),
  'help.doll': g('Dollhouse — roof off. Switch Isometric, Oblique, Elevation, Orthographic. Turn Front / Right / Rear / Left. Ortho has Top (a plan). Tap a wall to paper it.', {
    es: 'Casa de muñecas — sin techo. Cambia Isométrica, Oblicua, Alzado, Ortográfica. Gira Frente / Derecha / Atrás / Izquierda. Ortográfica tiene Arriba (una planta). Toca un muro para empapelar.',
    cu: 'Casa de muñecas — sin techo. Cambia Isométrica, Oblicua, Alzado, Ortográfica. Gira Frente / Derecha / Atrás / Izquierda. Ortográfica tiene Arriba (una planta). Toca una pared para empapelar.',
    uk: 'Ляльковий дім — без даху. Ізометрія, коса, фасад, ортогональна. Повертай Фасад / Право / Тил / Ліво. Ортогональна має Зверху (план). Торкнись стіни, щоб обклеїти.',
    ru: 'Кукольный дом — без крыши. Изометрия, косая, фасад, ортогональная. Верти Фасад / Право / Тыл / Лево. Ортогональная имеет Сверху (план). Нажми стену, чтобы оклеить.',
    ti: 'ገዛ ዕሸል — ብዘይ ጣራ. ኢሶሜትሪክ፣ ኣንጻር፣ ምልቃሕ፣ ኦርቶግራፊክ ቀይር. ቅድሚት / የማን / ድሕሪት / ጸጋም ኣዘውር. ኦርቶግራፊክ ላዕሊ ኣለዋ (ትልሚ). መንደቕ ጠውቕ ንምሽፋን.',
    fa: 'خانه عروسکی — بی‌سقف. ایزومتریک، مایل، نما، متعامد را عوض کن. روبرو / راست / پشت / چپ بچرخان. متعامد بالا دارد (پلان). دیوار را بزن تا کاغذ شود.',
  }),
  'help.view3d': g('2D edits only — 3D View is look-only. Orbit, Materials, Lighting, and Walkthrough all read the same plan. Edit walls back in 2D Plan or Dollhouse.', {
    es: 'Solo se edita en 2D — la Vista 3D es solo para mirar. Órbita, Materiales, Luz y Recorrido leen el mismo plano. Edita muros en Plano 2D o Casa de muñecas.',
    cu: 'Solo se edita en 2D — la Vista 3D es solo para mirar. Órbita, Materiales, Luz y Recorrido leen el mismo plano. Edita paredes en Plano 2D o Casa de muñecas.',
    uk: 'Редагування лише в 2D — Вигляд 3D тільки для дивитись. Обертання, матеріали, світло й прохід читають той самий план. Правити стіни в Плані 2D або Ляльковому домі.',
    ru: 'Правка только в 2D — Вид 3D только для просмотра. Вращение, материалы, свет и проход читают тот же план. Править стены в Плане 2D или Кукольном доме.',
    ti: 'ኣርትዖት 2D ጥራይ — ትርኢት 3D ምርኣይ ጥራይ እዩ. ምዝዋር፣ ንዋት፣ ብርሃንን ምጉዓዝን ነቲ ሓደ ትልሚ የንብቡ. መናድቕ ኣብ ትልሚ 2D ወይ ገዛ ዕሸል ኣርም.',
    fa: 'ویرایش فقط ۲بعدی — نمای سه‌بعدی فقط نگاه است. چرخش، مصالح، نور و گشت همان پلان را می‌خوانند. دیوارها را در پلان ۲بعدی یا خانه عروسکی ویرایش کن.',
  }),
  'help.chrome': g('Tools sit on the left edge and tuck with Hide. Teach, Settings, Help sit on the right. The grid stays open.', {
    es: 'Las herramientas van al borde izquierdo y se recogen con Ocultar. Enseñar, Ajustes y Ayuda van a la derecha. La cuadrícula sigue abierta.',
    cu: 'Las herramientas van al borde izquierdo y se recogen con Ocultar. Enseñar, Ajustes y Ayuda van a la derecha. La cuadrícula sigue abierta.',
    uk: 'Інструменти на лівому краї — сховай їх. Навчати, Налаштування, Допомога справа. Сітка лишається відкритою.',
    ru: 'Инструменты на левом краю — спрячь их. Учить, Настройки, Справка справа. Сетка остаётся открытой.',
    ti: 'መሳርሒታት ኣብ ጸጋም ወሰን ይቕመጡ፣ ብሓብእ ይኽውሉ. ኣምህር፣ ቅጥዕታት፣ ሓገዝ ኣብ የማን. መርበብ ክፉት ይጸንሕ.',
    fa: 'ابزار روی لبهٔ چپ می‌نشیند و با پنهان جمع می‌شود. آموزش، تنظیمات، راهنما سمت راست. شبکه باز می‌ماند.',
  }),
  'help.skill': g('Skill level — New plan or Settings. Novice and Beginner get extra help. Grey tools unlock at the next skill.', {
    es: 'Nivel de ayuda — Plano nuevo o Ajustes. Novato y Principiante reciben más ayuda. Las herramientas grises se abren en el siguiente nivel.',
    cu: 'Nivel de ayuda — Plano nuevo o Ajustes. Novato y Principiante reciben más ayuda. Las herramientas grises se abren en el siguiente nivel.',
    uk: 'Рівень допомоги — Новий план або Налаштування. Новачок і Початковий отримують більше допомоги. Сірі інструменти відкриються на наступному рівні.',
    ru: 'Уровень помощи — Новый план или Настройки. Новичок и Начинающий получают больше помощи. Серые инструменты откроются на следующем уровне.',
    ti: 'ደረጃ ሓገዝ — ሓድሽ ትልሚ ወይ ቅጥዕታት. ሓድሽን ጀማርን ተወሳኺ ሓገዝ ይረኽቡ. ግራጭ መሳርሒታት ኣብ ዝቕጽል ደረጃ ይኽፈቱ.',
    fa: 'سطح کمک — پلان جدید یا تنظیمات. تازه‌کار و مبتدی کمک بیشتر می‌گیرند. ابزار خاکستری در سطح بعد باز می‌شود.',
  }),
  'help.lang': g('Language — Settings. Pick a home language. Teach English words stays on so grades 5–8 learn Wall, Door, Sketch.', {
    es: 'Idioma — Ajustes. Elige idioma de casa. Enseñar palabras en inglés queda encendido para que los grados 5–8 aprendan Wall, Door, Sketch.',
    cu: 'Idioma — Ajustes. Escoge idioma de casa. Enseñar palabras en inglés queda encendido para que los grados 5–8 aprendan Wall, Door, Sketch.',
    uk: 'Мова — Налаштування. Обери мову дому. Вчити англійські слова лишається ввімкненим, щоб 5–8 класи вчили Wall, Door, Sketch.',
    ru: 'Язык — Настройки. Выбери язык дома. Учить английские слова остаётся включённым, чтобы 5–8 классы учили Wall, Door, Sketch.',
    ti: 'ቋንቋ — ቅጥዕታት. ቋንቋ ገዛ ምረጽ. እንግሊዝኛ ቃላት ኣምህር ክፍሊ 5–8 Wall, Door, Sketch ክመሃሩ ትጸንሕ.',
    fa: 'زبان — تنظیمات. زبان خانه را برگزین. آموزش واژه‌های انگلیسی روشن می‌ماند تا کلاس ۵ تا ۸ واژهٔ Wall، Door، Sketch را یاد بگیرند.',
  }),
  'help.udl': g('Bigger type and high contrast sit at the top of this Help. Tip language is there too. Same Help for every student.', {
    es: 'Letra grande y alto contraste están arriba en esta Ayuda. El idioma de consejos también. La misma Ayuda para cada estudiante.',
    cu: 'Letra grande y alto contraste están arriba en esta Ayuda. El idioma de consejos también. La misma Ayuda para cada estudiante.',
    uk: 'Більший шрифт і високий контраст — зверху цієї Допомоги. Мова підказок теж тут. Така сама Допомога для кожного.',
    ru: 'Крупный шрифт и высокий контраст — вверху этой Помощи. Язык подсказок тоже здесь. Та же Помощь для каждого.',
    ti: 'ሓገዝ ንኹሉ — ቅጥዕታት → እንግሊዝኛ ቃላት ኣምህር፣ ዓበይቲ መልጎማት፣ ዓቢ ፊደል. ቴማ Projector ልዑል ንጽጽር እዩ.',
    fa: 'نوشتهٔ درشت و کنتراست بالا بالای همین راهنماست. زبان راهنما هم اینجاست. همان راهنما برای هر دانش‌آموز.',
  }),
  'help.read': g('Read this plan — Teach. Envelope, door, window, room names, overall size, kitchen triangle. North and scale sit on the sheet.', {
    es: 'Lee este plano — Enseñar. Recinto, puerta, ventana, nombres, tamaño total, triángulo de cocina. Norte y escala están en la hoja.',
    cu: 'Lee este plano — Enseñar. Recinto, puerta, ventana, nombres, tamaño total, triángulo de cocina. Norte y escala están en la hoja.',
    uk: 'Прочитай цей план — Навчання. Оболонка, двері, вікно, назви, загальний розмір, кухонний трикутник. Північ і масштаб на аркуші.',
    ru: 'Прочитай этот план — Уроки. Оболочка, дверь, окно, имена, общий размер, кухонный треугольник. Север и масштаб на листе.',
    ti: 'ነዚ ትልሚ ኣንብብ — ምምሃር. መዓንጽ፣ ማዕጾ፣ መስኮት፣ ስማት፣ ምሉእ ዓቐን፣ ስሉስ ክሽነ. ሰሜንን መለክዒን ኣብቲ ወረቐት እዮም.',
    fa: 'این پلان را بخوان — آموزش. پوسته، در، پنجره، نام‌ها، اندازهٔ کلی، مثلث آشپزخانه. شمال و مقیاس روی برگه است.',
  }),

  'scene.sky.day': g('Day', {
    es: 'Día', cu: 'Día', uk: 'День', ru: 'День', ti: 'መዓልቲ', fa: 'روز',
  }),
  'scene.sky.dusk': g('Soft dusk', {
    es: 'Atardecer', cu: 'Atardecer', uk: 'М’які сутінки', ru: 'Мягкие сумерки', ti: 'ምሸት', fa: 'غروب نرم',
  }),
  'scene.sky.overcast': g('Overcast', {
    es: 'Nublado', cu: 'Nublado', uk: 'Хмарно', ru: 'Пасмурно', ti: 'ደበና', fa: 'ابری',
  }),
  'scene.site.grass': g('Grass', {
    es: 'Césped (Grass)', cu: 'Yerba (Grass)', uk: 'Трава (Grass)', ru: 'Трава (Grass)', ti: 'ሳዕሪ (Grass)', fa: 'چمن (Grass)',
  }),
  'scene.site.gravel': g('Gravel', {
    es: 'Grava', cu: 'Grava', uk: 'Гравій', ru: 'Гравий', ti: 'ጸጥሪ', fa: 'شن',
  }),
  'scene.site.pad': g('Pad', {
    es: 'Losa', cu: 'Losa', uk: 'Плита', ru: 'Плита', ti: 'ዕንጨይቲ', fa: 'کف‌سازی',
  }),
  'scene.site.dirt': g('Dirt', {
    es: 'Tierra', cu: 'Tierra', uk: 'Ґрунт', ru: 'Земля', ti: 'ሓመድ', fa: 'خاک',
  }),
  'scene.site.sand': g('Sand', {
    es: 'Arena', cu: 'Arena', uk: 'Пісок', ru: 'Песок', ti: 'ሑጻ', fa: 'شن',
  }),
  'scene.site.deck': g('Deck', {
    es: 'Terraza', cu: 'Terraza', uk: 'Настил', ru: 'Настил', ti: 'ዳስ', fa: 'عرشه',
  }),
  'scene.site.mulch': g('Mulch', {
    es: 'Mantillo', cu: 'Mantillo', uk: 'Мульча', ru: 'Мульча', ti: 'ሓመድ ቆጽሊ', fa: 'مالچ',
  }),
  'scene.tint.sand': g('Sand', {
    es: 'Arena', cu: 'Arena', uk: 'Пісок', ru: 'Песок', ti: 'ሑጻ', fa: 'شن‌رنگ',
  }),
  'scene.tint.white': g('White', {
    es: 'Blanco', cu: 'Blanco', uk: 'Білий', ru: 'Белый', ti: 'ጻዕዳ', fa: 'سفید',
  }),
  'scene.tint.clay': g('Clay', {
    es: 'Barro (Clay)', cu: 'Barro (Clay)', uk: 'Глина (Clay)', ru: 'Глина (Clay)', ti: 'ጭቃ (Clay)', fa: 'گل (Clay)',
  }),
  'scene.tint.slate': g('Slate', {
    es: 'Pizarra', cu: 'Pizarra', uk: 'Шифер', ru: 'Сланец', ti: 'ስሌት', fa: 'سنگ‌لوح',
  }),
  'scene.tint.sage': g('Sage', {
    es: 'Salvia', cu: 'Salvia', uk: 'Шавлія', ru: 'Шалфей', ti: 'ሰይጅ', fa: 'مریم‌گلی',
  }),
  'scene.tint.sky': g('Sky', {
    es: 'Cielo', cu: 'Cielo', uk: 'Небо', ru: 'Небо', ti: 'ሰማይ', fa: 'آسمان',
  }),
  'scene.tint.cream': g('Cream', {
    es: 'Crema', cu: 'Crema', uk: 'Крем', ru: 'Крем', ti: 'ክሪም', fa: 'کرم',
  }),
  'scene.tint.blush': g('Blush', {
    es: 'Rubor', cu: 'Rubor', uk: 'Руж', ru: 'Румяна', ti: 'ሮዝ', fa: 'صورتی',
  }),
  'scene.tint.navy': g('Navy', {
    es: 'Marino', cu: 'Marino', uk: 'Морський', ru: 'Морской', ti: 'ባሕሪ', fa: 'سرمه‌ای',
  }),
  'scene.tint.charcoal': g('Charcoal', {
    es: 'Carbón', cu: 'Carbón', uk: 'Вугілля', ru: 'Уголь', ti: 'ከሰል', fa: 'ذغالی',
  }),
  'scene.tint.butter': g('Butter', {
    es: 'Mantequilla', cu: 'Mantequilla', uk: 'Масло', ru: 'Масло', ti: 'ቅቤ', fa: 'کره',
  }),
  'scene.tint.mint': g('Mint', {
    es: 'Menta', cu: 'Menta', uk: 'М’ята', ru: 'Мята', ti: 'ናና', fa: 'نعنا',
  }),
  'scene.tint.terra': g('Terra', {
    es: 'Terra', cu: 'Terra', uk: 'Тера', ru: 'Терра', ti: 'መሬት', fa: 'خاکی',
  }),

  'toast.ready': g('{title} is ready — go draw', {
    es: '{title} está listo — a dibujar',
    cu: '{title} está listo — a dibujar',
    uk: '{title} готовий — малюй',
    ru: '{title} готов — рисуй',
    ti: '{title} ድልው እዩ — ስኣል',
    fa: '{title} آماده است — بکش',
  }),
  'toast.contestStart': g('Baboo’s contest — sketch a snug den, then ask her to judge', {
    es: 'Concurso de Baboo — boceta una guarida justa, luego pídele que juzgue',
    cu: 'Concurso de Baboo — boceta una caseta justa, luego pídele que juzgue',
    uk: 'Конкурс Baboo — намалюй тісне лігво, потім попроси оцінити',
    ru: 'Конкурс Baboo — нарисуй тесную конуру, потом попроси оценить',
    ti: 'ውድድር Baboo — ጽቡቕ መደቀሲ ስኣል፣ ድሕሪኡ ክትፈርድ ሕተታ',
    fa: 'مسابقهٔ Baboo — لانهٔ جمع‌وجور طرح بزن، بعد از او بخواه داوری کند',
  }),
  'toast.saved': g('Saved for class', {
    es: 'Guardado para la clase', cu: 'Guardado para la clase', uk: 'Збережено для класу', ru: 'Сохранено для класса', ti: 'ንክፍሊ ተዓቂቡ', fa: 'برای کلاس ذخیره شد',
  }),
  'toast.card': g('Class card ready — no last name', {
    es: 'Tarjeta lista — sin apellido',
    cu: 'Tarjeta lista — sin apellido',
    uk: 'Картка класу готова — без прізвища',
    ru: 'Карточка класса готова — без фамилии',
    ti: 'ካርድ ክፍሊ ድልው — ቤተሰብ ስም የለን',
    fa: 'کارت کلاس آماده — بدون نام خانوادگی',
  }),
  'toast.imported': g('Project imported', {
    es: 'Plano importado', cu: 'Plano importado', uk: 'План імпортовано', ru: 'План импортирован', ti: 'ትልሚ ኣትዩ', fa: 'پلان وارد شد',
  }),
  'toast.importFail': g('Import failed', {
    es: 'No se pudo importar', cu: 'No se pudo importar', uk: 'Імпорт не вдався', ru: 'Импорт не удался', ti: 'ምእታው ኣይተኽኣለን', fa: 'وارد کردن نشد',
  }),
  'toast.dimIn': g('Size label stuck. Delete removes it.', {
    es: 'Etiqueta de medida lista. Borrar la quita.',
    cu: 'Etiqueta de medida lista. Borrar la quita.',
    uk: 'Підпис розміру на місці. Видалити прибирає його.',
    ru: 'Подпись размера на месте. Удалить убирает её.',
    ti: 'ምልክት ዓቐን ተላጢጡ. ሰርዝ የእልዮ.',
    fa: 'برچسب اندازه چسبید. حذف برمی‌داردش.',
  }),
  'toast.noteType': g('Type in the note box', {
    es: 'Escribe en la caja de nota',
    cu: 'Escribe en la caja de nota',
    uk: 'Пиши в полі нотатки',
    ru: 'Пиши в поле заметки',
    ti: 'ኣብ ሳጹን መዘኻኸሪ ጽሓፍ',
    fa: 'در جعبهٔ یادداشت بنویس',
  }),
  'toast.dupNeed': g('Select something first, then Duplicate', {
    es: 'Elige algo primero, luego Copiar',
    cu: 'Escoge algo primero, luego Copiar',
    uk: 'Спочатку обери щось, потім Копія',
    ru: 'Сначала выбери что-то, потом Копия',
    ti: 'መጀመርታ ሓደ ነገር ምረጽ፣ ድሕሪኡ ቅዳሕ',
    fa: 'اول چیزی انتخاب کن، بعد کپی',
  }),
  'toast.dup': g('Duplicated', {
    es: 'Copiado', cu: 'Copiado', uk: 'Скопійовано', ru: 'Скопировано', ti: 'ተቐዲሑ', fa: 'کپی شد',
  }),

  'teach.readout': g('Plan readout', {
    es: 'Lectura del plano', cu: 'Lectura del plano', uk: 'Зведення плану', ru: 'Сводка плана', ti: 'ንባብ ትልሚ', fa: 'خوانش پلان',
  }),
  'teach.done': g('Done looks like:', {
    es: 'Listo se ve así:', cu: 'Listo se ve así:', uk: 'Готово виглядає так:', ru: 'Готово выглядит так:', ti: 'ዝተወድአ ከምዚ ይመስል:', fa: 'تمام‌شده این‌طور است:',
  }),
  'teach.judge': g('Ask Baboo to judge', {
    es: 'Pide a Baboo que juzgue', cu: 'Pídele a Baboo que juzgue', uk: 'Попроси Baboo оцінити', ru: 'Попроси Baboo оценить', ti: 'ን Baboo ክፈርድ ሕተት', fa: 'از Baboo بخواه داوری کند',
  }),
  'teach.challenges': g('Challenges', {
    es: 'Retos', cu: 'Retos', uk: 'Завдання', ru: 'Задания', ti: 'ፈተነታት', fa: 'چالش‌ها',
  }),
  'teach.unit1.title': g('Unit 1 — Floor Plans & Scale', {
    es: 'Unidad 1 — Plantas y escala (Scale)',
    cu: 'Unidad 1 — Plantas y escala (Scale)',
    uk: 'Урок 1 — Плани поверхів і масштаб (Scale)',
    ru: 'Урок 1 — Планы этажей и масштаб (Scale)',
    ti: 'ክፍሊ 1 — ትልሚ ወለልን መለክዒን (Scale)',
    fa: 'واحد ۱ — پلان کف و مقیاس (Scale)',
  }),
  'teach.unit1.goal': g('Make one room that feels like a real size on the grid.', {
    es: 'Haz un cuarto que se sienta de tamaño real en la cuadrícula.',
    cu: 'Haz un cuarto que se sienta de tamaño real en la cuadrícula.',
    uk: 'Зроби одну кімнату, яка відчувається справжнім розміром на сітці.',
    ru: 'Сделай одну комнату, которая ощущается настоящим размером на сетке.',
    ti: 'ኣብቲ መርበብ ከም ሓቀኛ ዓቐን ዝስምዕ ሓደ ክፍሊ ግበር.',
    fa: 'یک اتاق بساز که روی شبکه اندازهٔ واقعی حس شود.',
  }),
  'teach.dog.title': g('Best Dog House Contest', {
    es: 'Concurso Mejor Perrera',
    cu: 'Concurso Mejor Caseta',
    uk: 'Конкурс найкращої будки',
    ru: 'Конкурс лучшей конуры',
    ti: 'ውድድር ዝበለጸ ገዛ ከልቢ',
    fa: 'مسابقهٔ بهترین خانه سگ',
  }),
  'teach.dog.goal': g('A snug outdoor den Baboo would pick — textbook size, not a people house.', {
    es: 'Una guarida justa que Baboo elegiría — tamaño de libro, no casa de personas.',
    cu: 'Una caseta justa que Baboo escogería — tamaño de libro, no casa de personas.',
    uk: 'Тісне зовнішнє лігво, яке обрала б Baboo — розмір підручника, не дім для людей.',
    ru: 'Тесная уличная конура, которую выбрала бы Baboo — размер учебника, не дом для людей.',
    ti: 'Baboo እትመርጾ ጽቡቕ ናይ ወጻኢ መደቀሲ — ዓቐን መጽሓፍ፣ ናይ ሰብ ገዛ ኣይኮነን.',
    fa: 'لانهٔ جمع‌وجور بیرونی که Baboo برمی‌گزیند — اندازهٔ کتاب، نه خانهٔ آدم‌ها.',
  }),

  'contest.title': g('Contest', {
    es: 'Concurso', cu: 'Concurso', uk: 'Конкурс', ru: 'Конкурс', ti: 'ውድድር', fa: 'مسابقه',
  }),
  'contest.aria': g('Best Dog House Contest', {
    es: 'Concurso Mejor Perrera',
    cu: 'Concurso Mejor Caseta',
    uk: 'Конкурс найкращої будки',
    ru: 'Конкурс лучшей конуры',
    ti: 'ውድድር ዝበለጸ ገዛ ከልቢ',
    fa: 'مسابقهٔ بهترین خانه سگ',
  }),
  'contest.dismiss': g('Dismiss contest', {
    es: 'Cerrar concurso', cu: 'Cerrar concurso', uk: 'Сховати конкурс', ru: 'Скрыть конкурс', ti: 'ውድድር ዕጸው', fa: 'بستن مسابقه',
  }),
  'contest.kicker': g('Baboo judges', {
    es: 'Baboo juzga', cu: 'Baboo juzga', uk: 'Baboo оцінює', ru: 'Baboo оценивает', ti: 'Baboo ትፈርድ', fa: 'Baboo داوری می‌کند',
  }),
  'contest.points': g('{score} / {max} textbook points', {
    es: '{score} / {max} puntos del libro',
    cu: '{score} / {max} puntos del libro',
    uk: '{score} / {max} балів підручника',
    ru: '{score} / {max} баллов учебника',
    ti: '{score} / {max} ነጥቢ መጽሓፍ',
    fa: '{score} / {max} امتیاز کتاب',
  }),
  'contest.hello': g('Best Dog House Contest — I pick the den that follows the book.', {
    es: 'Concurso Mejor Perrera — elijo la guarida que sigue el libro.',
    cu: 'Concurso Mejor Caseta — escojo la caseta que sigue el libro.',
    uk: 'Конкурс найкращої будки — обираю лігво, яке йде за книжкою.',
    ru: 'Конкурс лучшей конуры — выбираю конуру, которая следует книге.',
    ti: 'ውድድር ዝበለጸ ገዛ ከልቢ — ነቲ ንመጽሓፍ ዝኽተል መደቀሲ እመርጽ.',
    fa: 'مسابقهٔ بهترین خانه سگ — لانه‌ای را برمی‌گزینم که از کتاب پیروی کند.',
  }),
  'contest.helloAny': g('Any plan can be judged as a dog house. New → Dog House starts the assignment.', {
    es: 'Cualquier plano se puede juzgar como perrera. Nuevo → Perrera empieza la tarea.',
    cu: 'Cualquier plano se puede juzgar como caseta. Nuevo → Caseta empieza la tarea.',
    uk: 'Будь-який план можна оцінити як будку. Новий → Будка починає завдання.',
    ru: 'Любой план можно оценить как конуру. Новый → Конура начинает задание.',
    ti: 'ዝኾነ ትልሚ ከም ገዛ ከልቢ ክፍረድ ይኽእል. ሓድሽ → ገዛ ከልቢ ነቲ ዕማም ይጅምር.',
    fa: 'هر پلانی را می‌توان خانه سگ داوری کرد. جدید → خانه سگ تکلیف را شروع می‌کند.',
  }),
  'contest.save': g('Save file for the board', {
    es: 'Guardar archivo para el tablero',
    cu: 'Guardar archivo para el tablero',
    uk: 'Зберегти файл для дошки',
    ru: 'Сохранить файл для доски',
    ti: 'ንቦርድ ፋይል ዓቅብ',
    fa: 'ذخیرهٔ پرونده برای تابلو',
  }),
  'contest.legal': g('Baboo scores a snug closed den, dog-sized offset door, pitched roof, turning room, and summer shade. Classroom check from textbook shelter rules — not a kennel license.', {
    es: 'Baboo califica una guarida cerrada, puerta de perro descentrada, techo inclinado, espacio para girar y sombra de verano. Chequeo de clase con las reglas del libro — no es licencia de perrera.',
    cu: 'Baboo califica una caseta cerrada, puerta de perro descentrada, techo inclinado, espacio para girar y sombra de verano. Chequeo de clase con las reglas del libro — no es licencia de perrera.',
    uk: 'Baboo оцінює тісне замкнене лігво, двері розміру собаки зсунуті від центру, скатний дах, місце розвернутися й літню тінь. Класна перевірка за правилами підручника — не ліцензія на розплідник.',
    ru: 'Baboo оценивает тесную закрытую конуру, дверь размера собаки со сдвигом, скатную крышу, место развернуться и летнюю тень. Классная проверка по правилам учебника — не лицензия на питомник.',
    ti: 'Baboo ጽቡቕ ዝተዓጽወ መደቀሲ፣ ዓቐን ከልቢ ዝተንቀሳቐሰ ማዕጾ፣ ዝተዳኸለ ጣራ፣ ንምዝዋር ቦታን ናይ ሓጋይ ጽላሎትን ትነጽግ። ናይ ክፍሊ ምርመራ ብሕግታት መጽሓፍ — ፍቓድ ከልቢ ኣይኮነን.',
    fa: 'Baboo لانهٔ بستهٔ جمع‌وجور، در اندازهٔ سگ دور از وسط، سقف شیب‌دار، جای برگشتن و سایهٔ تابستان را نمره می‌دهد. بررسی کلاسی از قاعده‌های کتاب — مجوز نگهداری سگ نیست.',
  }),
  'contest.mark.pass': g('Baboo says yes', {
    es: 'Baboo dice sí', cu: 'Baboo dice sí', uk: 'Baboo каже так', ru: 'Baboo говорит да', ti: 'Baboo እወ ትብል', fa: 'Baboo می‌گوید بله',
  }),
  'contest.mark.warn': g('Almost', {
    es: 'Casi', cu: 'Casi', uk: 'Майже', ru: 'Почти', ti: 'ኣላሊኻ', fa: 'نزدیک بود',
  }),
  'contest.mark.fail': g('Not yet', {
    es: 'Aún no', cu: 'Todavía no', uk: 'Ще ні', ru: 'Ещё нет', ti: 'ገና ኣይኮነን', fa: 'هنوز نه',
  }),
  'contest.mark.skip': g('Start here', {
    es: 'Empieza aquí', cu: 'Empieza aquí', uk: 'Почни тут', ru: 'Начни здесь', ti: 'ኣብዚ ጀምር', fa: 'از اینجا شروع کن',
  }),
  'contest.ribbon.best': g('Best in show', {
    es: 'Mejor de la muestra', cu: 'Mejor de la muestra', uk: 'Найкращий на показі', ru: 'Лучший на показе', ti: 'ዝበለጸ ኣብ ምርኢት', fa: 'بهترین نمایش',
  }),
  'contest.ribbon.blue': g('Blue ribbon', {
    es: 'Listón azul', cu: 'Listón azul', uk: 'Блакитна стрічка', ru: 'Синяя лента', ti: 'ሰማያዊ ሪባን', fa: 'روبان آبی',
  }),
  'contest.ribbon.red': g('Red ribbon', {
    es: 'Listón rojo', cu: 'Listón rojo', uk: 'Червона стрічка', ru: 'Красная лента', ti: 'ቀይሕ ሪባን', fa: 'روبان سرخ',
  }),
  'contest.ribbon.honor': g('Honorable mention', {
    es: 'Mención honorífica', cu: 'Mención honorífica', uk: 'Похвальна згадка', ru: 'Почётный отзыв', ti: 'ክቡር ዝኽሪ', fa: 'ذکر شایسته',
  }),
  'contest.ribbon.keep': g('Keep drawing', {
    es: 'Sigue dibujando', cu: 'Sigue dibujando', uk: 'Малюй далі', ru: 'Рисуй дальше', ti: 'ቀጽል ስኣል', fa: 'به کشیدن ادامه بده',
  }),
  'contest.quote.best': g('I’d nap here. This den follows the book.', {
    es: 'Aquí sí dormiría. Esta guarida sigue el libro.',
    cu: 'Aquí sí dormiría. Esta caseta sigue el libro.',
    uk: 'Я б тут подрімала. Це лігво йде за книжкою.',
    ru: 'Я бы здесь вздремнула. Эта конура следует книге.',
    ti: 'ኣብዚ እደቅስ. እዚ መደቀሲ ንመጽሓፍ ይኽተል.',
    fa: 'اینجا چرت می‌زنم. این لانه از کتاب پیروی می‌کند.',
  }),
  'contest.quote.blue': g('Almost — a couple textbook fixes and I’d pick this.', {
    es: 'Casi — un par de arreglos del libro y la elijo.',
    cu: 'Casi — un par de arreglos del libro y la escojo.',
    uk: 'Майже — кілька виправлень за книжкою, і я б це обрала.',
    ru: 'Почти — пара правок по книге, и я бы это выбрала.',
    ti: 'ኣላሊኻ — ቁሩብ ምትዕርራይ መጽሓፍ እንተ ገበርካ እዚ እመርጽ.',
    fa: 'نزدیک بود — چند اصلاح کتاب و این را برمی‌گزینم.',
  }),
  'contest.quote.red': g('I see a shelter. Tighten size, door, or roof and I’ll look again.', {
    es: 'Veo un refugio. Ajusta tamaño, puerta o techo y miro otra vez.',
    cu: 'Veo un refugio. Ajusta tamaño, puerta o techo y miro otra vez.',
    uk: 'Бачу укриття. Підкрути розмір, двері чи дах — і я подивлюсь знову.',
    ru: 'Вижу укрытие. Подкрути размер, дверь или крышу — и я посмотрю снова.',
    ti: 'መዕቈቢ እርኢ. ዓቐን፣ ማዕጾ ወይ ጣራ ኣጽንዕ እሞ መሊሰ እርኢ.',
    fa: 'یک پناه می‌بینم. اندازه، در یا سقف را درست کن تا دوباره نگاه کنم.',
  }),
  'contest.quote.honor': g('Not yet a dog house the book would pick. Start with a snug closed den.', {
    es: 'Aún no es una perrera que el libro elija. Empieza con una guarida cerrada y justa.',
    cu: 'Todavía no es una caseta que el libro escoja. Empieza con una caseta cerrada y justa.',
    uk: 'Ще не будка, яку обрала б книжка. Почни з тісного замкненого лігва.',
    ru: 'Ещё не конура, которую выбрала бы книга. Начни с тесной закрытой конуры.',
    ti: 'ገና እቲ መጽሓፍ ዝመርጾ ገዛ ከልቢ ኣይኮነን. ብጽቡቕ ዝተዓጽወ መደቀሲ ጀምር.',
    fa: 'هنوز خانه سگی نیست که کتاب برگزیند. با لانهٔ بستهٔ جمع‌وجور شروع کن.',
  }),
  'contest.quote.keep': g('Sketch a den, close the walls, and ask me again.', {
    es: 'Boceta una guarida, cierra los muros, y pregúntame otra vez.',
    cu: 'Boceta una caseta, cierra las paredes, y pregúntame otra vez.',
    uk: 'Намалюй лігво, замкни стіни й запитай знову.',
    ru: 'Нарисуй конуру, замкни стены и спроси снова.',
    ti: 'መደቀሲ ስኣል፣ መናድቕ ዕጸው፣ መሊስካ ሕተተኒ.',
    fa: 'یک لانه طرح بزن، دیوارها را ببند، و دوباره از من بپرس.',
  }),
  'contest.check.shelter.title': g('A closed den', {
    es: 'Una guarida cerrada', cu: 'Una caseta cerrada', uk: 'Замкнене лігво', ru: 'Закрытая конура', ti: 'ዝተዓጽወ መደቀሲ', fa: 'لانهٔ بسته',
  }),
  'contest.check.scale.title': g('Just large enough', {
    es: 'Justo del tamaño', cu: 'Justo del tamaño', uk: 'Якраз досить', ru: 'Как раз достаточно', ti: 'ልክዕ ዓቐን', fa: 'درست به اندازه',
  }),
  'contest.check.door.title': g('A dog-sized door', {
    es: 'Una puerta de perro', cu: 'Una puerta de perro', uk: 'Двері розміру собаки', ru: 'Дверь размера собаки', ti: 'ናይ ከልቢ ዓቐን ማዕጾ', fa: 'در اندازهٔ سگ',
  }),
  'contest.check.offset.title': g('Offset from the wind', {
    es: 'Descentrada del viento', cu: 'Descentrada del viento', uk: 'Зсунуто від вітру', ru: 'Сдвинуто от ветра', ti: 'ካብ ንፋስ ተንቀሳቒሱ', fa: 'دور از باد',
  }),
  'contest.check.turn.title': g('Room to turn', {
    es: 'Espacio para girar', cu: 'Espacio para girar', uk: 'Місце розвернутися', ru: 'Место развернуться', ti: 'ንምዝዋር ቦታ', fa: 'جا برای برگشتن',
  }),
  'contest.check.roof.title': g('A pitched roof', {
    es: 'Un techo inclinado (pitched)',
    cu: 'Un techo inclinado (pitched)',
    uk: 'Скатний дах (pitched)',
    ru: 'Скатная крыша (pitched)',
    ti: 'ዝተዳኸለ ጣራ (pitched)',
    fa: 'سقف شیب‌دار (pitched)',
  }),
  'contest.check.program.title': g('A den, not a people house', {
    es: 'Una guarida, no casa de personas',
    cu: 'Una caseta, no casa de personas',
    uk: 'Лігво, не дім для людей',
    ru: 'Конура, не дом для людей',
    ti: 'መደቀሲ፣ ናይ ሰብ ገዛ ኣይኮነን',
    fa: 'لانه، نه خانهٔ آدم‌ها',
  }),
  'contest.check.dims.title': g('Size labels', {
    es: 'Etiquetas de tamaño', cu: 'Etiquetas de tamaño', uk: 'Підписи розміру', ru: 'Подписи размера', ti: 'ምልክታት ዓቐን', fa: 'برچسب اندازه',
  }),
  'contest.check.shade.title': g('Summer shade', {
    es: 'Sombra de verano', cu: 'Sombra de verano', uk: 'Літня тінь', ru: 'Летняя тень', ti: 'ናይ ሓጋይ ጽላሎት', fa: 'سایهٔ تابستان',
  }),
};

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as string[]).includes(v);
}

export function asLocale(v: unknown): Locale {
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

export function localeOption(locale: Locale | null | undefined) {
  const loc = asLocale(locale);
  return LOCALE_OPTIONS.find((o) => o.id === loc) ?? LOCALE_OPTIONS[0];
}

export function applyDocumentLocale(locale: Locale | null | undefined): void {
  const opt = localeOption(locale);
  const root = document.documentElement;
  root.lang = opt.htmlLang;
  root.setAttribute('data-locale', opt.id);
  root.setAttribute('data-dir', opt.dir);
  // Plan grid + tool rails stay LTR so drawings do not mirror.
  root.dir = 'ltr';
}

export function t(locale: Locale | null | undefined, key: string, vars?: Record<string, string>): string {
  const loc = asLocale(locale);
  const row = STR[key];
  let out = row ? row[loc] || row.en : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, v);
  }
  return out;
}

export function tt(
  locale: Locale | null | undefined,
  key: string,
  fallback: string,
  vars?: Record<string, string>,
): string {
  if (!STR[key]) return fallback;
  return t(locale, key, vars);
}

export function skillLabel(locale: Locale | null | undefined, id: string): string {
  return t(locale, `skill.${id}`, undefined);
}

/** Pull the home-language word out of "Стіна (Wall)" or "Muro (Wall)". */
export function homePhrase(gloss: string, english: string): string {
  const trimmed = gloss.trim();
  if (!trimmed) return english;
  const suffix = ` (${english})`;
  if (trimmed.endsWith(suffix)) return trimmed.slice(0, -suffix.length).trim() || english;
  const m = trimmed.match(/^(.*)\s+\([^)]+\)\s*$/);
  return (m ? m[1] : trimmed).trim() || english;
}

export function ellToolParts(
  locale: Locale | null | undefined,
  key: string,
): { en: string; home: string | null } {
  const en = t('en', key);
  const loc = asLocale(locale);
  if (loc === 'en') return { en, home: null };
  const home = homePhrase(t(loc, key), en);
  if (!home || home === en) return { en, home: null };
  return { en, home };
}

export function tipLoc(settings: { tipsLocale?: Locale | null; locale?: Locale | null } | null | undefined): Locale {
  return asLocale(settings?.tipsLocale ?? settings?.locale);
}

const LOCALE_PREF = 'baboo-locale';
const TIPS_LOCALE_PREF = 'baboo-tips-locale';
const UDL_FAT_PREF = 'baboo-udl-fat';
const UDL_TYPE_PREF = 'baboo-udl-type';
const UDL_CONTRAST_PREF = 'baboo-udl-contrast';
const ELL_EN_PREF = 'baboo-ell-english';

export function readLocalePref(): Locale {
  try {
    return asLocale(localStorage.getItem(LOCALE_PREF));
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeLocalePref(locale: Locale): void {
  try { localStorage.setItem(LOCALE_PREF, asLocale(locale)); } catch { /* ignore */ }
}

export function readTipsLocalePref(): Locale {
  try {
    return asLocale(localStorage.getItem(TIPS_LOCALE_PREF) ?? localStorage.getItem(LOCALE_PREF));
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeTipsLocalePref(locale: Locale): void {
  try { localStorage.setItem(TIPS_LOCALE_PREF, asLocale(locale)); } catch { /* ignore */ }
}

export function readUdlFatPref(): boolean {
  try { return localStorage.getItem(UDL_FAT_PREF) === '1'; } catch { return false; }
}

export function writeUdlFatPref(on: boolean): void {
  try { localStorage.setItem(UDL_FAT_PREF, on ? '1' : '0'); } catch { /* ignore */ }
}

export function readUdlTypePref(): boolean {
  try { return localStorage.getItem(UDL_TYPE_PREF) === '1'; } catch { return false; }
}

export function writeUdlTypePref(on: boolean): void {
  try { localStorage.setItem(UDL_TYPE_PREF, on ? '1' : '0'); } catch { /* ignore */ }
}

export function readUdlContrastPref(): boolean {
  try { return localStorage.getItem(UDL_CONTRAST_PREF) === '1'; } catch { return false; }
}

export function writeUdlContrastPref(on: boolean): void {
  try { localStorage.setItem(UDL_CONTRAST_PREF, on ? '1' : '0'); } catch { /* ignore */ }
}

/** Default on — grades 5–8 ELL should see English CAD words. */
export function readEllEnglishPref(): boolean {
  try {
    return localStorage.getItem(ELL_EN_PREF) !== '0';
  } catch {
    return true;
  }
}

export function writeEllEnglishPref(on: boolean): void {
  try { localStorage.setItem(ELL_EN_PREF, on ? '1' : '0'); } catch { /* ignore */ }
}
