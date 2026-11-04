/** Classroom language packs. Academic CAD terms stay in English inside ( ). */
import type { Locale } from '../types';
import { HUB_EXTRA } from './i18n-hub.ts';

export type { Locale };

export const LOCALES: Locale[] = ['en', 'simple', 'es', 'cu', 'uk', 'ru', 'ti', 'fa', 'fa-AF', 'ar', 'rw'];

export const LOCALE_OPTIONS: {
  id: Locale;
  label: string;
  blurb: string;
  htmlLang: string;
  dir: 'ltr' | 'rtl';
}[] = [
  { id: 'en', label: 'English', blurb: 'Classroom English', htmlLang: 'en', dir: 'ltr' },
  { id: 'simple', label: 'Simple', blurb: 'Short English', htmlLang: 'en', dir: 'ltr' },
  { id: 'es', label: 'Español', blurb: 'Spanish · English words in ( )', htmlLang: 'es', dir: 'ltr' },
  { id: 'cu', label: 'Cubano', blurb: 'Cuban Spanish · English words in ( )', htmlLang: 'es-CU', dir: 'ltr' },
  { id: 'uk', label: 'Українська', blurb: 'Ukrainian · English words in ( )', htmlLang: 'uk', dir: 'ltr' },
  { id: 'ru', label: 'Русский', blurb: 'Russian · English words in ( )', htmlLang: 'ru', dir: 'ltr' },
  { id: 'ar', label: 'العربية', blurb: 'Arabic · English words in ( )', htmlLang: 'ar', dir: 'rtl' },
  { id: 'fa-AF', label: 'دری', blurb: 'Dari · English words in ( )', htmlLang: 'fa-AF', dir: 'rtl' },
  { id: 'rw', label: 'Ikinyarwanda', blurb: 'Kinyarwanda · English words in ( )', htmlLang: 'rw', dir: 'ltr' },
  { id: 'ti', label: 'ትግርኛ', blurb: 'Tigrigna · English words in ( )', htmlLang: 'ti', dir: 'ltr' },
];

export const DEFAULT_LOCALE: Locale = 'en';

type Gloss = Record<Locale, string>;

function g(
  en: string,
  rest: { es: string; cu: string; uk: string; ru: string; ti: string; fa: string } & Partial<Pick<Gloss, 'simple' | 'fa-AF' | 'ar' | 'rw'>>,
): Gloss {
  return {
    en,
    simple: rest.simple || en,
    es: rest.es,
    cu: rest.cu,
    uk: rest.uk,
    ru: rest.ru,
    ti: rest.ti,
    fa: rest.fa,
    'fa-AF': rest['fa-AF'] || rest.fa,
    ar: rest.ar || en,
    rw: rest.rw || en,
  };
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
  'tool.box': g('Box', {
    es: 'Caja (Box)', cu: 'Caja (Box)', uk: 'Коробка (Box)', ru: 'Коробка (Box)', ti: 'ሳጹን (Box)', fa: 'جعبه (Box)',
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
  // 2.13.39: "Min" said nothing; it folds the tool list. ti, fa-AF and rw are UNCHECKED native copy.
  'tool.min': g('Fold', {
    es: 'Plegar', cu: 'Plegar', uk: 'Згорнути', ru: 'Свернуть', ti: 'ኣሕጽር', fa: 'جمع کن', 'fa-AF': 'جمع کن', ar: 'اطوِ', rw: 'Funga',
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
  'chrome.toolsPocket': g('Draw tools', {
    es: 'Herramientas', cu: 'Herramientas', uk: 'Інструменти', ru: 'Инструменты', ti: 'መሳርሒታት', fa: 'ابزار',
  }),
  'chrome.openTools': g('Show every draw tool', {
    es: 'Mostrar todas las herramientas',
    cu: 'Mostrar todas las herramientas',
    uk: 'Показати всі інструменти',
    ru: 'Показать все инструменты',
    ti: 'ኩሎም መሳርሒታት ኣርኢ',
    fa: 'نمایش همهٔ ابزارها',
  }),

  'chrome.settings': g('Settings', {
    es: 'Ajustes', cu: 'Ajustes', uk: 'Налаштування', ru: 'Настройки', ti: 'ቅጥዕታት', fa: 'تنظیمات',
  }),
  'chrome.menu': g('Menu', {
    es: 'Menú', cu: 'Menú', uk: 'Меню', ru: 'Меню', ti: 'ምናሌ', fa: 'منو',
    'fa-AF': 'منو', ar: 'القائمة', rw: 'Ibikubiyemo',
  }),
  'chrome.view': g('View', {
    es: 'Vista', cu: 'Vista', uk: 'Вигляд', ru: 'Вид', ti: 'ትርኢት', fa: 'نما',
    'fa-AF': 'نما', ar: 'عرض', rw: 'Reba',
  }),
  'news.line': g('Baboo follows your Hub language. Settings and the menu open on the left.', {
    es: 'Baboo sigue el idioma del Hub. Ajustes y el menú se abren a la izquierda.',
    cu: 'Baboo sigue el idioma del Hub. Ajustes y el menú se abren a la izquierda.',
    uk: 'Baboo бере мову Хаба. Налаштування й меню відкриваються зліва.',
    ru: 'Baboo берёт язык Хаба. Настройки и меню открываются слева.',
    ti: 'Baboo ናይ ሃብ ቋንቋ ይከተል። ቅጥዕታትን ምናሌን ኣብ ጸጋም ይኽፈቱ።',
    fa: 'Baboo زبان هاب را دنبال می‌کند. تنظیمات و منو از چپ باز می‌شوند.',
    'fa-AF': 'Baboo زبان هاب را می‌گیرد. تنظیم و منو از دست چپ باز می‌شوند.',
    ar: 'يتبع Baboo لغة المنصة. الإعدادات والقائمة تفتح على اليسار.',
    rw: 'Baboo ikurikira ururimi rwa Hub. Igenamiterere n\'ibikubiyemo bifunguka ibumoso.',
  }),
  'news.fit': g('Nothing is cut off at the bottom of the screen.', {
    es: 'Ya no se corta nada en la parte de abajo de la pantalla.',
    cu: 'Ya no se corta nada en la parte de abajo de la pantalla.',
    uk: 'Унизу екрана більше нічого не обрізано.',
    ru: 'Внизу экрана больше ничего не обрезано.',
    ti: 'ኣብ ታሕቲ ስክሪን ሕጂ ዝቑረጽ ነገር የለን።',
    fa: 'دیگر چیزی در پایین صفحه بریده نمی‌شود.',
    'fa-AF': 'دیگر هیچ چیزی در پایین صفحه بریده نمی‌شود.',
    ar: 'لم يعد شيء مقطوعًا في أسفل الشاشة.',
    rw: 'Nta kintu kigicibwa hasi kuri ecran.',
  }),
  'news.menu': g('One Menu button, at the top left. Nothing covers Select.', {
    es: 'Un solo botón de Menú, arriba a la izquierda. Nada tapa Elegir (Select).',
    cu: 'Un solo botón de Menú, arriba a la izquierda. Nada tapa Escoger (Select).',
    uk: 'Одна кнопка Меню, вгорі ліворуч. Ніщо не закриває Обрати (Select).',
    ru: 'Одна кнопка Меню, вверху слева. Ничто не закрывает Выбрать (Select).',
    ti: 'ሓደ ናይ ምናሌ መጠወቒ ኣብ ላዕሊ ጸጋም። ንምረጽ (Select) ዝሽፍኖ ነገር የለን።',
    fa: 'فقط یک دکمه منو، بالا سمت چپ. هیچ چیز روی انتخاب (Select) را نمی‌پوشاند.',
    'fa-AF': 'تنها یک دکمهٔ منو، بالا طرف چپ. هیچ چیزی روی انتخاب (Select) را نمی‌پوشاند.',
    ar: 'زر قائمة واحد، في أعلى اليسار. لا شيء يغطي تحديد (Select).',
    rw: "Buto imwe y'Ibikubiyemo, hejuru ibumoso. Nta kintu gipfuka Hitamo (Select).",
  }),
  'news.close': g('The Menu starts under the top bar, so Close is easy to tap.', {
    es: 'El Menú empieza debajo de la barra de arriba, así que Cerrar es fácil de tocar.',
    cu: 'El Menú empieza debajo de la barra de arriba, así que Cerrar es fácil de tocar.',
    uk: 'Меню починається під верхньою панеллю, тож «Закрити» легко натиснути.',
    ru: 'Меню начинается под верхней панелью, поэтому «Закрыть» легко нажать.',
    ti: 'ምናሌ ትሕቲ እቲ ላዕለዋይ መስመር ይጅምር፣ ስለዚ ዕጸው ብቐሊሉ ይጥወቕ።',
    fa: 'منو زیر نوار بالا شروع می‌شود، پس زدن بستن آسان است.',
    'fa-AF': 'منو زیر نوار بالا شروع می‌شود، پس زدن بستن آسان است.',
    ar: 'تبدأ القائمة تحت الشريط العلوي، لذا يسهل الضغط على إغلاق.',
    rw: "Ibikubiyemo bitangirira munsi y'umurongo wo hejuru, bityo Funga ikandika byoroshye.",
  }),
  'news.decoders': g('3D models no longer need outside sites, so they open on school wifi.', {
    es: 'Los modelos 3D ya no necesitan sitios de afuera, así que abren en el wifi de la escuela.',
    cu: 'Los modelos 3D ya no necesitan sitios de afuera, así que abren en el wifi de la escuela.',
    uk: '3D-моделям більше не потрібні сторонні сайти, тож вони відкриваються в шкільному Wi-Fi.',
    ru: '3D-моделям больше не нужны сторонние сайты, поэтому они открываются в школьном Wi-Fi.',
    ti: 'ናይ 3D ሞዴላት ደጊም ካልኦት መርበባት ኣየድልዮምን፣ ስለዚ ኣብ ዋይፋይ ቤት ትምህርቲ ይኽፈቱ።',
    fa: 'مدل‌های سه‌بعدی دیگر به سایت‌های بیرونی نیاز ندارند، پس با وای‌فای مدرسه باز می‌شوند.',
    'fa-AF': 'مدل‌های سه‌بعدی دیگر به سایت‌های بیرونی نیاز ندارند، پس با وای‌فای مکتب باز می‌شوند.',
    ar: 'لم تعد النماذج ثلاثية الأبعاد تحتاج إلى مواقع خارجية، لذا تفتح على شبكة المدرسة.',
    rw: "Moderi za 3D ntizigikeneye imbuga zo hanze, bityo zifunguka kuri wifi y'ishuri.",
  }),
  'news.konva': g('The plan drawing engine is updated. Drawing, moving and deleting walls work the same.', {
    es: 'El motor de dibujo del plano está actualizado. Dibujar, mover y borrar paredes funciona igual.',
    cu: 'El motor de dibujo del plano está actualizado. Dibujar, mover y borrar paredes funciona igual.',
    uk: 'Рушій креслення плану оновлено. Малювати, переміщати й видаляти стіни можна так само.',
    ru: 'Движок рисования плана обновлён. Рисовать, двигать и удалять стены можно так же.',
    ti: 'ሞተር ስእሊ ፕላን ተሓዲሱ። መናድቕ ምስኣል፣ ምንቃልን ምድምሳስን ከም ቀደም ይሰርሕ።',
    fa: 'موتور رسم نقشه به‌روز شد. کشیدن، جابه‌جا کردن و پاک کردن دیوارها مثل قبل کار می‌کند.',
    'fa-AF': 'موتور رسم نقشه به‌روز شد. کشیدن، جابه‌جا کردن و پاک کردن دیوارها مثل قبل کار می‌کند.',
    ar: 'تم تحديث محرك رسم المخطط. رسم الجدران ونقلها وحذفها يعمل كما كان.',
    rw: 'Moteri ishushanya igishushanyo yavuguruwe. Gushushanya, kwimura no gusiba inkuta bikora nka mbere.',
  }),
  'news.modelviewer': g('The 3D viewer is updated. 3D View and the 3D peek look the same.', {
    es: 'El visor 3D está actualizado. La Vista 3D y la vista previa 3D se ven igual.',
    cu: 'El visor 3D está actualizado. La Vista 3D y la vista previa 3D se ven igual.',
    uk: '3D-переглядач оновлено. 3D-вигляд і 3D-перегляд виглядають так само.',
    ru: '3D-просмотрщик обновлён. 3D-вид и 3D-просмотр выглядят так же.',
    ti: 'ናይ 3D ተዓዛቢ ተሓዲሱ። 3D ትርኢትን 3D ቅልጽምታን ከም ቀደም እዮም ዝረኣዩ።',
    fa: 'نمایشگر سه‌بعدی به‌روز شد. نمای سه‌بعدی و پیش‌نمایش سه‌بعدی مثل قبل دیده می‌شوند.',
    'fa-AF': 'نمایشگر سه‌بعدی به‌روز شد. نمای سه‌بعدی و پیش‌نمایش سه‌بعدی مثل قبل دیده می‌شوند.',
    ar: 'تم تحديث عارض ثلاثي الأبعاد. العرض ثلاثي الأبعاد والمعاينة ثلاثية الأبعاد تبدو كما كانت.',
    rw: "Imashini yerekana 3D yavuguruwe. Kureba muri 3D n'ishusho ya 3D bigaragara nka mbere.",
  }),
  'news.save': g('You can now see if your work is saved, next to Export.', {
    es: 'Ahora puedes ver si tu trabajo está guardado, junto a Exportar.',
    cu: 'Ahora puedes ver si tu trabajo está guardado, junto a Exportar.',
    uk: 'Тепер видно, чи збережено твою роботу, поруч з Експорт.',
    ru: 'Теперь видно, сохранена ли твоя работа, рядом с Экспорт.',
    ti: 'ሕጂ ስራሕካ ተዓቂቡ እንተኾነ ኣብ ጥቓ Export ክትርኢ ትኽእል።',
    fa: 'حالا می‌توانی ببینی کارت ذخیره شده، کنار خروجی.',
    'fa-AF': 'حالا می‌توانی ببینی کارت ذخیره شده، کنار خروجی.',
    ar: 'يمكنك الآن معرفة إن كان عملك محفوظًا، بجانب تصدير.',
    rw: 'Ubu ushobora kubona niba akazi kawe kabitswe, iruhande rwa Export.',
  }),
  // 2.13.23: ti, fa-AF and rw are UNCHECKED native copy.
  'news.frames': g('Room names stay whole, doorways get painted frames, and things you pick in 2D show from above in 3D.', {
    es: 'Los nombres de las habitaciones no se cortan, las puertas tienen marcos pintados y lo que eliges en 2D se ve desde arriba en 3D.',
    cu: 'Los nombres de los cuartos no se cortan, las puertas tienen marcos pintados y lo que eliges en 2D se ve desde arriba en 3D.',
    uk: 'Назви кімнат не розриваються, дверні прорізи мають фарбовані рамки, а те, що ти вибрав у 2D, видно згори в 3D.',
    ru: 'Названия комнат не разрываются, у дверных проёмов крашеные рамы, а то, что ты выбрал в 2D, видно сверху в 3D.',
    ti: 'ኣስማት ክፍልታት ኣይቋረጹን፣ ኣፍደገታት ዝተቐብአ መቓን ኣለዎም፣ ኣብ 2D ዝመረጽካዮ ድማ ኣብ 3D ካብ ላዕሊ ይርአ።',
    fa: 'نام اتاق‌ها نمی‌شکند، درگاه‌ها قاب رنگ‌شده دارند، و چیزی که در دوبعدی انتخاب کنی در سه‌بعدی از بالا دیده می‌شود.',
    'fa-AF': 'نام اتاق‌ها نمی‌شکند، دروازه‌ها چوکات رنگ‌شده دارند، و چیزی که در دوبعدی انتخاب کنی در سه‌بعدی از بالا دیده می‌شود.',
    ar: 'أسماء الغرف لا تنقطع، وللمداخل إطارات مدهونة، وما تختاره في الثنائي الأبعاد يظهر من الأعلى في الثلاثي الأبعاد.',
    rw: "Amazina y'ibyumba ntacika, imiryango ifite amakadire asize irangi, kandi icyo uhisemo muri 2D kigaragara uturutse hejuru muri 3D.",
  }),
  // 2.13.22: ti, fa-AF and rw are UNCHECKED native copy.
  'news.inside3d': g('Walk inside: painted walls, white trim, bright ceilings, glowing lamps and real furniture models.', {
    es: 'Entra a caminar: paredes pintadas, zócalos blancos, techos claros, lámparas que brillan y muebles de verdad.',
    cu: 'Entra a caminar: paredes pintadas, zócalos blancos, techos claros, lámparas que brillan y muebles de verdad.',
    uk: 'Заходь усередину: фарбовані стіни, білі плінтуси, світлі стелі, світні лампи й справжні моделі меблів.',
    ru: 'Заходи внутрь: крашеные стены, белые плинтусы, светлые потолки, светящиеся лампы и настоящие модели мебели.',
    ti: 'ናብ ውሽጢ ተመላለስ፦ ዝተቐብኡ መናድቕ፣ ጻዕዳ ጌጽ፣ ብሩህ ናሕሲ፣ ዝበርሃ መብራህቲን ሓቀኛ ኣቕሓ ገዛን።',
    fa: 'داخل خانه قدم بزن: دیوارهای رنگ‌شده، قرنیز سفید، سقف روشن، چراغ‌های درخشان و مدل‌های واقعی مبلمان.',
    'fa-AF': 'داخل خانه قدم بزن: دیوارهای رنگ‌شده، قرنیز سفید، سقف روشن، چراغ‌های درخشان و مدل‌های واقعی فرنیچر.',
    ar: 'تجوّل في الداخل: جدران مدهونة، وحواف بيضاء، وأسقف فاتحة، ومصابيح متوهجة، ونماذج أثاث حقيقية.',
    rw: "Injira imbere: inkuta zisize irangi, imirongo y'umweru, ibisenge byera, amatara yaka n'ibikoresho nyabyo.",
  }),
  'news.modes': g('3D remembers where you were, arrow keys walk and turn, Front and Top views, and each level shows what it gives you.', {
    es: 'El 3D recuerda dónde estabas, las flechas caminan y giran, hay vistas de Frente y Arriba, y cada nivel muestra lo que te da.',
    cu: 'El 3D recuerda dónde estabas, las flechas caminan y giran, hay vistas de Frente y Arriba, y cada nivel muestra lo que te da.',
    uk: '3D памʼятає, де ти був, стрілки ходять і повертають, є види Спереду та Згори, а кожен рівень показує, що він дає.',
    ru: '3D помнит, где ты был, стрелки ходят и поворачивают, есть виды Спереди и Сверху, а каждый уровень показывает, что он даёт.',
    ti: '3D ኣበይ ከም ዝነበርካ ይዝክር፣ ምልክታት ኣንፈት ይኸዱን ይጠውዩን፣ ቅድሚትን ላዕሊን ትርኢት ኣሎ፣ ነፍሲ ወከፍ ደረጃ ድማ እንታይ ከም ዝህብ የርኢ።',
    fa: 'سه‌بعدی یادش می‌ماند کجا بودی، کلیدهای جهت راه می‌روند و می‌چرخند، نمای پیش رو و بالا هست، و هر سطح نشان می‌دهد چه می‌دهد.',
    'fa-AF': 'سه‌بعدی یادش می‌ماند کجا بودی، کلیدهای جهت راه می‌روند و می‌چرخند، نمای پیش رو و بالا هست، و هر سطح نشان می‌دهد چه می‌دهد.',
    ar: 'العرض ثلاثي الأبعاد يتذكر أين كنت، وأسهم لوحة المفاتيح تمشي وتدور، وهناك منظر أمامي وعلوي، وكل مستوى يبين ما يعطيك.',
    rw: "3D yibuka aho wari uri, utwambi tugenda kandi tuzunguruka, hari kureba imbere n'hejuru, kandi buri rwego rwerekana icyo rukuha.",
  }),
  'news.mansion': g('The Mansion looks grand in 3D: an open porch with columns, dormer windows, chimneys, shutters and stone trim.', {
    es: 'La Mansión luce grandiosa en 3D: porche abierto con columnas, buhardillas, chimeneas, contraventanas y molduras de piedra.',
    cu: 'La Mansión luce grandiosa en 3D: portal abierto con columnas, buhardillas, chimeneas, persianas y molduras de piedra.',
    uk: 'Особняк у 3D виглядає велично: відкритий ґанок з колонами, мансардні вікна, димарі, віконниці й кам\'яне оздоблення.',
    ru: 'Особняк в 3D выглядит величественно: открытое крыльцо с колоннами, слуховые окна, трубы, ставни и каменная отделка.',
    ti: 'እቲ ዓቢ ገዛ ብ3D ግሩም ይመስል፦ ኣዕኑድ ዘለዎ ክፉት በረንዳ፣ መስኮታት ናሕሲ፣ ትኪ መውጽኢ፣ መዕጸዊ መስኮትን ናይ እምኒ ጌጽን።',
    fa: 'قصر در نمای سه‌بعدی باشکوه است: برندهٔ باز با ستون، پنجره‌های بام، دودکش، دریچه‌های پنجره و تزئین سنگی.',
    'fa-AF': 'قصر در نمای سه‌بعدی باشکوه است: برندهٔ باز با ستون، پنجره‌های بام، دودکش، دریچه‌های پنجره و تزئین سنگی.',
    ar: 'القصر يبدو فخمًا في العرض ثلاثي الأبعاد: شرفة مفتوحة بأعمدة، ونوافذ في السقف، ومداخن، ومصاريع، وزخارف حجرية.',
    rw: "Inzu nini isa neza muri 3D: ibaraza rifunguye rifite inkingi, amadirishya yo ku gisenge, chimine, inzugi z'amadirishya n'imitako y'amabuye.",
  }),
  'news.tools2d': g('Notes take your typing right away, tool panels are in your language, and room names move off furniture.', {
    es: 'Las notas reciben lo que escribes al instante, los paneles están en tu idioma y los nombres de cuartos se apartan de los muebles.',
    cu: 'Las notas reciben lo que escribes al instante, los paneles están en tu idioma y los nombres de cuartos se apartan de los muebles.',
    uk: 'Нотатки одразу приймають текст, панелі інструментів твоєю мовою, а назви кімнат не ховаються під меблями.',
    ru: 'Заметки сразу принимают текст, панели инструментов на твоём языке, а названия комнат не прячутся под мебелью.',
    ti: 'መዘኻኸሪ ብቐጥታ ጽሑፍ ይቕበል፣ ፓነላት መሳርሒ ብቋንቋኻ እዮም፣ ኣስማት ክፍሊ ድማ ካብ ኣቓሑት ይርሕቁ።',
    fa: 'یادداشت فوراً نوشتهٔ تو را می‌گیرد، پنل‌ها به زبان تو هستند و نام اتاق‌ها از روی مبلمان کنار می‌روند.',
    'fa-AF': 'یادداشت فوراً نوشتهٔ تو را می‌گیرد، پنل‌ها به زبان تو هستند و نام اتاق‌ها از روی مبلمان کنار می‌روند.',
    ar: 'الملاحظات تأخذ كتابتك فورًا، ولوحات الأدوات بلغتك، وأسماء الغرف تبتعد عن الأثاث.',
    rw: "Ibyitonderwa byakira ibyo wandika ako kanya, ibikoresho biri mu rurimi rwawe, kandi amazina y'ibyumba ntiyihisha munsi y'ibikoresho.",
  }),
  'news.look3d': g('3D View looks richer: a sunny sky, real floors, brick you can feel, and glowing lamps.', {
    es: 'La Vista 3D se ve mejor: cielo soleado, pisos de verdad, ladrillo con relieve y faroles que brillan.',
    cu: 'La Vista 3D se ve mejor: cielo soleado, pisos de verdad, ladrillo con relieve y faroles que brillan.',
    uk: '3D-вигляд став кращим: сонячне небо, справжня підлога, рельєфна цегла і ліхтарі, що світяться.',
    ru: '3D-вид стал лучше: солнечное небо, настоящий пол, рельефный кирпич и светящиеся фонари.',
    ti: '3D ትርኢት ዝሓሸ ኮይኑ፦ ጸሓያዊ ሰማይ፣ ሓቀኛ ባይታ፣ ዝድህሰስ ጡብን ዘብርሁ መብራህትን።',
    fa: 'نمای سه‌بعدی زیباتر شد: آسمان آفتابی، کف واقعی، خشت برجسته و چراغ‌های روشن.',
    'fa-AF': 'نمای سه‌بعدی زیباتر شد: آسمان آفتابی، کف واقعی، خشت برجسته و چراغ‌های روشن.',
    ar: 'العرض ثلاثي الأبعاد أجمل: سماء مشمسة، أرضيات حقيقية، طوب بارز، ومصابيح تلمع.',
    rw: "3D isa neza kurushaho: ikirere cy'izuba, hasi nyakuri, amatafari agaragara, n'amatara yaka.",
  }),
  'news.furn': g('Furniture names are in your language, and the desk, table, toilet and fireplace look right.', {
    es: 'Los nombres de los muebles están en tu idioma, y el escritorio, la mesa, el inodoro y la chimenea se ven bien.',
    cu: 'Los nombres de los muebles están en tu idioma, y el buró, la mesa, la taza y la chimenea se ven bien.',
    uk: 'Назви меблів твоєю мовою, а письмовий стіл, стіл, унітаз і камін виглядають правильно.',
    ru: 'Названия мебели на твоём языке, а письменный стол, стол, унитаз и камин выглядят правильно.',
    ti: 'ኣስማት ኣቓሑት ብቋንቋኻ እዮም፣ ጠረጴዛታት፣ ሽቃቅን መቐጸሊ ሓዊን ድማ ብግቡእ ይርኣዩ።',
    fa: 'نام مبلمان به زبان تو است، و میزها، تشناب و بخاری درست دیده می‌شوند.',
    'fa-AF': 'نام مبلمان به زبان تو است، و میزها، تشناب و بخاری درست دیده می‌شوند.',
    ar: 'أسماء الأثاث بلغتك الآن، والمكتب والطاولة والمرحاض والمدفأة تبدو صحيحة.',
    rw: "Amazina y'ibikoresho ari mu rurimi rwawe, kandi ameza, umusarani n'itanura bigaragara neza.",
  }),
  'news.view3d': g('Dollhouse and 3D View are fixed: whole roofs, paths on the grass, no extra floors.', {
    es: 'Casa de muñecas y Vista 3D arregladas: techos enteros, caminos sobre el césped, sin pisos de más.',
    cu: 'Casa de muñecas y Vista 3D arregladas: techos enteros, caminos sobre el césped, sin pisos de más.',
    uk: 'Ляльковий будинок і 3D-вигляд виправлено: цілі дахи, доріжки на траві, без зайвих підлог.',
    ru: 'Кукольный дом и 3D-вид исправлены: целые крыши, дорожки на траве, без лишних полов.',
    ti: 'ቤት ኣሻንጉሊትን 3D ትርኢትን ተዓሪዮም፦ ምሉእ ናሕሲ፣ መገዲ ኣብ ሳዕሪ፣ ተወሳኺ ባይታ የለን።',
    fa: 'خانهٔ عروسکی و نمای سه‌بعدی درست شد: بام کامل، راه روی چمن، بی کف اضافه.',
    'fa-AF': 'خانهٔ عروسکی و نمای سه‌بعدی درست شد: بام کامل، راه روی چمن، بی کف اضافه.',
    ar: 'تم إصلاح بيت الدمى والعرض ثلاثي الأبعاد: سقوف كاملة، ممرات على العشب، بلا أرضيات زائدة.',
    rw: "Inzu y'ibikinisho na 3D byakosowe: ibisenge byuzuye, inzira ku byatsi, nta hasi y'inyongera.",
  }),
  'news.words': g('More words are now in Arabic, Kinyarwanda and Tigrinya.', {
    es: 'Ahora hay más palabras en árabe, kinyarwanda y tigriña.',
    cu: 'Ahora hay más palabras en árabe, kinyarwanda y tigriña.',
    uk: 'Тепер більше слів арабською, кіньяруандою та тигринья.',
    ru: 'Теперь больше слов на арабском, киньяруанда и тигринья.',
    ti: 'ሕጂ ዝበዝሑ ቃላት ብዓረብ፣ ብኪንያርዋንዳን ብትግርኛን ኣለዉ።',
    fa: 'حالا واژه‌های بیشتری به عربی، کینیارواندا و تیگرینیا هست.',
    'fa-AF': 'حالا واژه‌های بیشتری به عربی، کینیارواندا و تیگرینیا هست.',
    ar: 'الآن كلمات أكثر بالعربية والكينيارواندية والتغرينية.',
    rw: "Ubu amagambo menshi ari mu Cyarabu, Ikinyarwanda n'Igitigirinya.",
  }),
  'news.lead': g("Baboo keeps the grid big. Here's what changed.", {
    es: 'Baboo deja la cuadrícula grande. Esto es lo que cambió.',
    cu: 'Baboo deja la cuadrícula grande. Esto es lo que cambió.',
    uk: 'Baboo тримає сітку великою. Ось що змінилося.',
    ru: 'Baboo держит сетку большой. Вот что изменилось.',
    ti: 'Baboo ነቲ መርበብ ዓቢ ይገብሮ። እዚ እዩ ዝተቐየረ።',
    fa: 'Baboo شبکه را بزرگ نگه می‌دارد. این‌ها تغییر کرده‌اند.',
    'fa-AF': 'Baboo شبکه را بزرگ نگه می‌دارد. این‌ها تغییر کرده‌اند.',
    ar: 'يُبقي Baboo الشبكة كبيرة. هذا ما تغيّر.',
    rw: 'Baboo igumisha urusobe runini. Dore ibyahindutse.',
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
  'chrome.save': g('Export', {
    es: 'Exportar', cu: 'Exportar', uk: 'Експорт', ru: 'Экспорт', ti: 'ኣውጽእ', fa: 'خروجی',
    'fa-AF': 'خروجی', ar: 'تصدير', rw: 'Kohereza',
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
  // 2.13.25: ti, fa-AF and rw are UNCHECKED native copy.
  'news.polish': g('Cleaner screens: even color grids, 3D buttons that keep their words, and nothing hiding under the tool list.', {
    es: 'Pantallas más limpias: cuadrículas de colores parejas, botones 3D que no cortan sus palabras y nada escondido bajo la lista de herramientas.',
    cu: 'Pantallas más limpias: cuadrículas de colores parejas, botones 3D que no cortan sus palabras y nada escondido bajo la lista de herramientas.',
    uk: 'Охайніші екрани: рівні сітки кольорів, кнопки 3D не розривають слів, і ніщо не ховається під списком інструментів.',
    ru: 'Аккуратнее экраны: ровные сетки цветов, кнопки 3D не разрывают слова, и ничего не прячется под списком инструментов.',
    ti: 'ጽሩይ መሳኹቲ፦ ማዕረ ሰሌዳ ሕብርታት፣ ቃላቶም ዘይቆርጹ መጠወቕታት 3D፣ ኣብ ትሕቲ ዝርዝር መሳርሒታት ዝሕባእ ድማ የለን።',
    fa: 'صفحه‌های تمیزتر: جدول‌های رنگ مرتب، دکمه‌های سه‌بعدی که کلمه‌هایشان نمی‌شکند، و چیزی زیر فهرست ابزارها پنهان نمی‌شود.',
    'fa-AF': 'صفحه‌های پاک‌تر: جدول‌های رنگ منظم، دکمه‌های سه‌بعدی که کلمه‌هایشان نمی‌شکند، و چیزی زیر فهرست ابزارها پنهان نمی‌شود.',
    ar: 'شاشات أنظف: شبكات ألوان متساوية، وأزرار ثلاثية الأبعاد لا تنقسم كلماتها، ولا شيء يختبئ تحت قائمة الأدوات.',
    rw: "Amashusho asukuye: imirongo y'amabara iringaniye, utubuto twa 3D tutaca amagambo, kandi nta kintu cyihisha munsi y'urutonde rw'ibikoresho.",
  }),
  // 2.13.24 finishes: ti, fa-AF and rw are UNCHECKED native copy.
  'face.outside': g('Outside face', { es: 'Cara de afuera', cu: 'Cara de afuera', uk: 'Зовнішній бік', ru: 'Наружная сторона', ti: 'ናይ ደገ ገጽ', fa: 'روی بیرونی', 'fa-AF': 'روی بیرونی', ar: 'الوجه الخارجي', rw: 'Uruhande rw\'inyuma' }),
  'face.room': g('{room} side', { es: 'Lado de {room}', cu: 'Lado de {room}', uk: 'Бік: {room}', ru: 'Сторона: {room}', ti: 'ገጽ {room}', fa: 'سمت {room}', 'fa-AF': 'سمت {room}', ar: 'جهة {room}', rw: 'Uruhande rwa {room}' }),
  'face.other': g('Other side', { es: 'El otro lado', cu: 'El otro lado', uk: 'Інший бік', ru: 'Другая сторона', ti: 'እቲ ካልእ ገጽ', fa: 'سمت دیگر', 'fa-AF': 'سمت دیگر', ar: 'الجهة الأخرى', rw: 'Urundi ruhande' }),
  'face.cover': g('Covering', { es: 'Revestimiento', cu: 'Revestimiento', uk: 'Облицювання', ru: 'Облицовка', ti: 'መሸፈኒ', fa: 'روکش', 'fa-AF': 'روکش', ar: 'الكسوة', rw: 'Igipfundikizo' }),
  'face.roomPaint': g('Room\'s paint', { es: 'Pintura del cuarto', cu: 'Pintura del cuarto', uk: 'Фарба кімнати', ru: 'Краска комнаты', ti: 'ሕብሪ ክፍሊ', fa: 'رنگ اتاق', 'fa-AF': 'رنگ اتاق', ar: 'دهان الغرفة', rw: 'Irangi ry\'icyumba' }),
  'skin.brick': g('Brick', { es: 'Ladrillo', cu: 'Ladrillo', uk: 'Цегла', ru: 'Кирпич', ti: 'ጡብ', fa: 'آجر', 'fa-AF': 'خشت پخته', ar: 'طوب', rw: 'Amatafari' }),
  'skin.siding': g('Siding', { es: 'Tablas', cu: 'Tablas', uk: 'Сайдинг', ru: 'Сайдинг', ti: 'ሰሌዳታት', fa: 'سایدینگ', 'fa-AF': 'تخته‌پوش', ar: 'ألواح', rw: 'Imbaho z\'inyuma' }),
  'skin.stone': g('Stone', { es: 'Piedra', cu: 'Piedra', uk: 'Камінь', ru: 'Камень', ti: 'እምኒ', fa: 'سنگ', 'fa-AF': 'سنگ', ar: 'حجر', rw: 'Amabuye' }),
  'skin.stucco': g('Stucco', { es: 'Estuco', cu: 'Repello', uk: 'Штукатурка', ru: 'Штукатурка', ti: 'ልሕሲ', fa: 'گچ‌کاری', 'fa-AF': 'پلستر', ar: 'جص', rw: 'Isima' }),
  'skin.wood': g('Wood boards', { es: 'Tablas de madera', cu: 'Tablas de madera', uk: 'Дерев’яні дошки', ru: 'Деревянные доски', ti: 'ሰሌዳ ዕንጨይቲ', fa: 'تخته چوبی', 'fa-AF': 'تخته چوبی', ar: 'ألواح خشب', rw: 'Imbaho z\'ibiti' }),
  'obj.wallPaint': g('Wall paint', { es: 'Pintura de paredes', cu: 'Pintura de paredes', uk: 'Фарба стін', ru: 'Краска стен', ti: 'ሕብሪ መናድቕ', fa: 'رنگ دیوار', 'fa-AF': 'رنگ دیوار', ar: 'دهان الجدران', rw: 'Irangi ry\'inkuta' }),
  'obj.sameWalls': g('Same walls in every {room}', { es: 'Mismas paredes en cada {room}', cu: 'Mismas paredes en cada {room}', uk: 'Ці стіни в усіх: {room}', ru: 'Эти стены во всех: {room}', ti: 'እዚ መናድቕ ኣብ ኩሉ {room}', fa: 'همین دیوار در هر {room}', 'fa-AF': 'همین دیوار در هر {room}', ar: 'نفس الجدران لكل: {room}', rw: 'Inkuta zimwe mu byumba byose: {room}' }),
  'obj.ground': g('Ground', { es: 'Suelo', cu: 'Suelo', uk: 'Покриття', ru: 'Покрытие', ti: 'መሬት', fa: 'زمین', 'fa-AF': 'زمین', ar: 'الأرض', rw: 'Hasi' }),
  'obj.grass': g('Grass', { es: 'Césped', cu: 'Césped', uk: 'Трава', ru: 'Трава', ti: 'ሳዕሪ', fa: 'چمن', 'fa-AF': 'سبزه', ar: 'عشب', rw: 'Ubwatsi' }),
  'news.finishes': g('Paint each room and each side of each wall: brick, siding, stone or wood outside, and a ground for the porch.', { es: 'Pinta cada cuarto y cada lado de cada pared: ladrillo, tablas, piedra o madera afuera, y un suelo para el porche.', cu: 'Pinta cada cuarto y cada lado de cada pared: ladrillo, tablas, piedra o madera afuera, y un suelo para el portal.', uk: 'Фарбуй кожну кімнату й кожен бік кожної стіни: цегла, сайдинг, камінь чи дерево ззовні, і покриття для ґанку.', ru: 'Крась каждую комнату и каждую сторону каждой стены: кирпич, сайдинг, камень или дерево снаружи, и покрытие для крыльца.', ti: 'ነፍሲ ወከፍ ክፍልን ነፍሲ ወከፍ ገጽ መንደቕን ሕበሮ፦ ብደገ ጡብ፣ ሰሌዳ፣ እምኒ ወይ ዕንጨይቲ፣ ንበረንዳ ድማ መሬት።', fa: 'هر اتاق و هر سمت هر دیوار را رنگ کن: بیرون آجر، سایدینگ، سنگ یا چوب، و یک کف برای ایوان.', 'fa-AF': 'هر اتاق و هر سمت هر دیوار را رنگ کن: بیرون خشت پخته، تخته‌پوش، سنگ یا چوب، و یک کف برای برنده.', ar: 'لوّن كل غرفة وكل جهة من كل جدار: طوب أو ألواح أو حجر أو خشب من الخارج، وأرضية للشرفة.', rw: 'Siga buri cyumba na buri ruhande rwa buri rukuta: amatafari, imbaho, amabuye cyangwa ibiti inyuma, n\'ubutaka bw\'urubaraza.' }),
  // 2.13.24: ti, fa-AF and rw are UNCHECKED native copy.
  'chrome.views': g('Views', {
    es: 'Vistas', cu: 'Vistas', uk: 'Вигляди', ru: 'Виды', ti: 'ትርኢታት', fa: 'نماها', 'fa-AF': 'نماها', ar: 'العروض', rw: 'Uko ureba',
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
  'wall.thickness': g('Thickness', {
    es: 'Grosor', cu: 'Grosor', uk: 'Товщина', ru: 'Толщина', ti: 'ውፍረት', fa: 'ضخامت',
  }),
  'wall.height': g('Height', {
    es: 'Altura', cu: 'Altura', uk: 'Висота', ru: 'Высота', ti: 'ቁመት', fa: 'ارتفاع',
  }),
  'wall.style': g('Style', {
    es: 'Estilo', cu: 'Estilo', uk: 'Стиль', ru: 'Стиль', ti: 'ቅዲ', fa: 'سبک',
  }),
  'wall.style.outline': g('Outline', {
    es: 'Contorno', cu: 'Contorno', uk: 'Контур', ru: 'Контур', ti: 'መስመር', fa: 'خط',
  }),
  'wall.style.brick': g('Brick', {
    es: 'Ladrillo', cu: 'Ladrillo', uk: 'Цегла', ru: 'Кирпич', ti: 'እምኒ', fa: 'آجر',
  }),
  'wall.style.cavity': g('Layers', {
    es: 'Capas', cu: 'Capas', uk: 'Шари', ru: 'Слои', ti: 'ደረጃታት', fa: 'لایه',
  }),
  'wall.tip': g('Click grid to start, drag to draw.', {
    es: 'Clic en la cuadrícula para empezar, arrastra para dibujar.',
    cu: 'Toca la cuadrícula para empezar, arrastra para dibujar.',
    uk: 'Клікни сітку, щоб почати, тягни щоб креслити.',
    ru: 'Кликни сетку, чтобы начать, тяни чтобы чертить.',
    ti: 'መርበብ ጠውቕ ንምጅማር፣ ስሕብ ንምስኣል.',
    fa: 'روی شبکه کلیک کن تا شروع شود، بکش تا رسم شود.',
  }),
  'chrome.access': g('Access', {
    es: 'Acceso', cu: 'Acceso', uk: 'Доступ', ru: 'Доступ', ti: 'መእተዊ', fa: 'دسترسی',
  }),

  // Tigrinya (ti) strings fixed in 2.13.15 are UNCHECKED native copy.
  'cta.wall.title': g('Wall → click start → click end', {
    es: 'Muro → clic inicio → clic final',
    cu: 'Pared → toca inicio → toca final',
    uk: 'Стіна → клік початок → клік кінець',
    ru: 'Стена → клик начало → клик конец',
    ti: 'መንደቕ → መጀመርታ ጠውቕ → መወዳእታ ጠውቕ',
    fa: 'دیوار → کلیک شروع → کلیک پایان',
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
    ti: 'መንደቕ → መጀመርታ ጠውቕ → መወዳእታ ጠውቕ',
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
  'hint.box': g('Drag from one corner to the other', {
    es: 'Arrastra de una esquina a la otra',
    cu: 'Arrastra de una esquina a la otra',
    uk: 'Тягни від одного кута до другого',
    ru: 'Тяни от одного угла до другого',
    ti: 'ካብ ሓደ ኩርናዕ ናብቲ ካልእ ጎተት',
    fa: 'از یک گوشه تا گوشهٔ دیگر بکش',
  }),
  'hint.box.end': g('Release to place the box, or click the opposite corner', {
    es: 'Suelta para poner la caja, o clic en la esquina de enfrente',
    cu: 'Suelta para poner la caja, o toca la esquina de enfrente',
    uk: 'Відпусти, щоб поставити коробку, або клікни протилежний кут',
    ru: 'Отпусти, чтобы поставить коробку, или кликни противоположный угол',
    ti: 'ንምቕማጥ ልቐቕ፡ ወይ ነቲ ዝመጣጠን ኩርናዕ ጠውቕ',
    fa: 'برای گذاشتن جعبه رها کن، یا گوشهٔ روبه‌رو را کلیک کن',
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
  'hint.doll.paper': g('Turn the house. Tap a wall to pick it.', {
    es: 'Gira la casa. Toca un muro para elegirlo.',
    cu: 'Gira la casa. Toca una pared para elegirla.',
    uk: 'Поверни будинок. Торкнись стіни, щоб вибрати.',
    ru: 'Поверни дом. Нажми стену, чтобы выбрать.',
    ti: 'ገዛ ምዝዋር። መንደቕ ንምምራጽ ጠውቕ።',
    fa: 'خانه را بچرخان. برای انتخاب، دیوار را بزن.',
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
  'coach.sketch.body': g('Tap Sketch on the left. Drag on the grid like a pencil.', {
    es: 'Toca Boceto a la izquierda. Arrastra en la cuadrícula como un lápiz.',
    cu: 'Toca Boceto a la izquierda. Arrastra en la cuadrícula como un lápiz.',
    uk: 'Торкнись Ескіз ліворуч. Тягни по сітці як олівцем.',
    ru: 'Нажми Эскиз слева. Тяни по сетке как карандашом.',
    ti: 'ኣብ ጸጋም ስእሊ ጠውቕ። ኣብቲ ፍርግድ ከም ብርዒ ስሓብ።',
    fa: 'طرح را سمت چپ بزن. روی شبکه مثل مداد بکش.',
  }),
  'coach.trace.title': g('Now hard-line a wall', {
    es: 'Ahora traza un muro derecho',
    cu: 'Ahora traza una pared derecha',
    uk: 'Тепер обведи стіну прямою',
    ru: 'Теперь обведи стену прямой',
    ti: 'ሕጂ ቀጥታ መንደቕ ግበር',
    fa: 'حالا دیوار را خط‌کشی کن',
  }),
  'coach.trace.body': g('Tap Trace on this card. Or pick Wall and click along the pencil.', {
    es: 'Toca Trazar en esta tarjeta. O elige Muro y haz clic sobre el lápiz.',
    cu: 'Toca Trazar en esta tarjeta. O escoge Pared y toca sobre el lápiz.',
    uk: 'Торкнись Обвести на цій картці. Або обери Стіна і клікай уздовж олівця.',
    ru: 'Нажми Обвести на этой карточке. Или выбери Стена и кликай вдоль карандаша.',
    ti: 'ኣብዚ ካርድ ቀጥታ ጠውቕ። ወይ መንደቕ ምረጽ እሞ ኣብ ልዕሊ እቲ እርሳስ ጠውቕ.',
    fa: 'روی این کارت خط‌کشی را بزن. یا دیوار را برگزین و روی مداد کلیک کن.',
  }),
  'coach.close.title': g('Close the box', {
    es: 'Cierra la caja',
    cu: 'Cierra la caja',
    uk: 'Замкни коробку',
    ru: 'Замкни коробку',
    ti: 'ነታ ሳጹን ዕጸው',
    fa: 'جعبه را ببند',
  }),
  'coach.close.body': g('Tap Box, then drag to the opposite corner. Release, and the walls are solid.', {
    es: 'Toca Caja (Box), luego arrastra a la esquina de enfrente. Suelta y las paredes quedan sólidas.',
    cu: 'Toca Caja (Box), luego arrastra a la esquina de enfrente. Suelta y las paredes quedan sólidas.',
    uk: 'Торкнись Коробка (Box), потім тягни до протилежного кута. Відпусти — стіни стануть суцільними.',
    ru: 'Нажми Коробка (Box), потом тяни к противоположному углу. Отпусти — стены станут сплошными.',
    ti: 'ሳጹን (Box) ጠውቕ፡ ናብቲ ዝመጣጠን ኩርናዕ ጎተት። ምስ ለቀቕካ መናድቕ ጽኑዕ ይኸውን።',
    fa: 'جعبه (Box) را بزن، بعد تا گوشهٔ روبه‌رو بکش. رها کن تا دیوارها توپر شوند.',
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
  'coach.den.trace.body': g('Tap Trace on this card. Or pick Wall and click along the pencil.', {
    es: 'Toca Trazar en esta tarjeta. O elige Muro y haz clic sobre el lápiz.',
    cu: 'Toca Trazar en esta tarjeta. O escoge Pared y toca sobre el lápiz.',
    uk: 'Торкнись Обвести на цій картці. Або обери Стіна і клікай уздовж олівця.',
    ru: 'Нажми Обвести на этой карточке. Или выбери Стена и кликай вдоль карандаша.',
    ti: 'ኣብዚ ካርድ ቀጥታ ጠውቕ። ወይ መንደቕ ምረጽ እሞ ኣብ ልዕሊ እቲ እርሳስ ጠውቕ.',
    fa: 'روی این کارت خط‌کشی را بزن. یا دیوار را برگزین و روی مداد کلیک کن.',
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
  'set.look': g('Look', {
    es: 'Aspecto', cu: 'Aspecto', uk: 'Вигляд', ru: 'Вид', ti: 'ገጽ', fa: 'ظاهر',
  }),
  'set.look.lead': g('Stark is the class default. A dark phone does not change this.', {
    es: 'Stark es el de la clase. Un teléfono oscuro no lo cambia.',
    cu: 'Stark es el de la clase. Un teléfono oscuro no lo cambia.',
    uk: 'Stark — вигляд класу. Темний телефон його не змінює.',
    ru: 'Stark — вид класса. Тёмный телефон его не меняет.',
    ti: 'Stark ናይ ክፍሊ እዩ. ጸሊም ተሌፎን ኣይቅይሮን።',
    fa: 'Stark پیش‌فرض کلاس است. گوشی تیره آن را عوض نمی‌کند.',
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
  'sheet.roof': g('Roof', {
    es: 'Techo', cu: 'Techo', uk: 'Дах', ru: 'Крыша', ti: 'ናሕሲ', fa: 'سقف',
  }),
  'sheet.roofNone': g('Roof · not named yet', {
    es: 'Techo · aún sin nombre',
    cu: 'Techo · todavía sin nombre',
    uk: 'Дах · ще без назви',
    ru: 'Крыша · ещё без имени',
    ti: 'ናሕሲ · ገና ስም የብሉን',
    fa: 'سقف · هنوز اسم ندارد',
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

  'help.lead': g('Tap Sketch on the left and drag. Two clicks make a wall.', {
    es: 'Toca Boceto a la izquierda y arrastra. Dos clics hacen un muro.',
    cu: 'Toca Boceto a la izquierda y arrastra. Dos toques hacen una pared.',
    uk: 'Торкнись Ескіз ліворуч і тягни. Два кліки роблять стіну.',
    ru: 'Нажми Эскиз слева и тяни. Два клика делают стену.',
    ti: 'ኣብ ጸጋም ስእሊ ጠውቕ እሞ ስሓብ። ክልተ ጠውቕታት መንደቕ ይገብሩ።',
    fa: 'طرح را سمت چپ بزن و بکش. دو کلیک دیوار می‌سازد.',
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
    ti: 'ልዑል ፍልልይ ኣብ Stark ጻዕዳ + ሰማያዊ ይጸንሕ። ዝጸልመቱ ቃላት፣ ዝረጎዱ መስመራት።',
    fa: 'کنتراست بالا روی Stark سفید + آبی می‌ماند. واژه‌های تیره‌تر، خط‌های ضخیم‌تر.',
  }),
  'udl.contrastOn': g('High contrast', {
    es: 'Alto contraste', cu: 'Alto contraste', uk: 'Високий контраст', ru: 'Высокий контраст', ti: 'ልዑል ፍልልይ', fa: 'کنتراست بالا',
  }),
  'lang.tips': g('Tip language', {
    es: 'Idioma de consejos', cu: 'Idioma de consejos', uk: 'Мова підказок', ru: 'Язык подсказок', ti: 'ቋንቋ ምኽሪ', fa: 'زبان راهنما',
  }),
  'teach.spine': g('Class words stay in English. Tips are in {lang}.', {
    es: 'Las palabras de clase se quedan en inglés. Los consejos están en {lang}.',
    cu: 'Las palabras de clase se quedan en inglés. Los consejos están en {lang}.',
    uk: 'Класні слова лишаються англійською. Підказки — {lang}.',
    ru: 'Классные слова остаются по-английски. Подсказки — {lang}.',
    ti: 'ቃላት ክፍሊ ብእንግሊዝኛ ይጸንሑ። ምኽሪታት ብ{lang} እዮም።',
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
  'toast.boxClosed': g('Closed · {w} by {d}. Add a door on a wall.', {
    es: 'Cerrado · {w} por {d}. Pon una puerta en un muro.',
    cu: 'Cerrado · {w} por {d}. Pon una puerta en una pared.',
    uk: 'Замкнуто · {w} на {d}. Додай двері на стіні.',
    ru: 'Замкнуто · {w} на {d}. Добавь дверь на стене.',
    ti: 'ተዓጽዩ · {w} ብ {d}. ኣብ መንደቕ ማዕጾ ወስኽ.',
    fa: 'بسته شد · {w} در {d}. یک در روی دیوار بگذار.',
  }),
  'toast.wallShort': g('Make the wall a bit longer', {
    es: 'Haz el muro un poco más largo',
    cu: 'Haz la pared un poco más larga',
    uk: 'Зроби стіну трохи довшою',
    ru: 'Сделай стену чуть длиннее',
    ti: 'መንደቕ ቁሩብ ኣናውሕ',
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
    ti: 'ደረት መናድቕ · ዝለዓለ 40',
    fa: 'حد دیوار · حداکثر ۴۰',
  }),
  'toast.capObjects': g('Object limit · 60 max', {
    es: 'Límite de objetos · 60 máx',
    cu: 'Límite de objetos · 60 máx',
    uk: 'Ліміт речей · макс. 60',
    ru: 'Лимит вещей · макс. 60',
    ti: 'ደረት ኣቑሑ · ዝለዓለ 60',
    fa: 'حد وسیله · حداکثر ۶۰',
  }),
  'toast.capBody': g('Delete some to add more.', {
    es: 'Borra algunos para añadir más.',
    cu: 'Borra algunos para añadir más.',
    uk: 'Видали дещо, щоб додати ще.',
    ru: 'Удали часть, чтобы добавить ещё.',
    ti: 'ተወሳኺ ንምውሳኽ ገለ ደምስስ።',
    fa: 'چند تا را پاک کن تا جای جدید باز شود.',
  }),
  'toast.mark.ok': g('Done', {
    es: 'Listo', cu: 'Listo', uk: 'Готово', ru: 'Готово', ti: 'ተወዲኡ', fa: 'انجام شد',
  }),
  'toast.mark.miss': g('Try again', {
    es: 'Otra vez', cu: 'Otra vez', uk: 'Ще раз', ru: 'Ещё раз', ti: 'ደጊምካ ፈትን', fa: 'دوباره',
  }),
  'toast.mark.cap': g('Full', {
    es: 'Lleno', cu: 'Lleno', uk: 'Повно', ru: 'Полно', ti: 'መሊኡ', fa: 'پر',
  }),
  'toast.mark.info': g('Tip', {
    es: 'Consejo', cu: 'Consejo', uk: 'Підказка', ru: 'Подсказка', ti: 'ምኽሪ', fa: 'راهنما',
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
  // 2.13.64: phone menu plan name. ti, fa-AF and rw are UNCHECKED native copy.
  'news.phoneName': g('On phones, the plan name box in the menu says “Untitled plan” in your language too.', { es: 'En el teléfono, la casilla del nombre del plano en el menú también dice “Plano sin nombre” en tu idioma.', cu: 'En el teléfono, la casilla del nombre del plano en el menú también dice “Plano sin nombre” en tu idioma.', uk: 'На телефоні поле назви плану в меню теж каже «План без назви» твоєю мовою.', ru: 'На телефоне поле названия плана в меню тоже говорит «План без названия» на твоём языке.', ti: 'ኣብ ተሌፎን፣ ሳጹን ስም ትልሚ ኣብ ዝርዝር እውን ብቋንቋኻ “ስም ዘይብሉ ትልሚ” ይብል።', fa: 'در گوشی، کادر نام نقشه در منو هم به زبان تو «نقشه بی‌نام» می‌گوید.', 'fa-AF': 'در موبایل، کادر نام نقشه در منو هم به زبان تو «نقشه بی‌نام» می‌گوید.', ar: 'على الهاتف، يقول صندوق اسم المخطط في القائمة «مخطط بلا اسم» بلغتك أيضاً.', rw: 'Kuri telefoni, agasanduku k\'izina ry\'igishushanyo mu rutonde nako kavuga “Igishushanyo kitagira izina” mu rurimi rwawe.' }),
  // 2.13.63: templates pass the Access check. ti, fa-AF and rw are UNCHECKED native copy.
  'news.templatesPass': g('Every house template now passes the Access check: the Tiny Home has a 3\'-0" front door, and nothing sits in a door swing.', { es: 'Todas las plantillas de casa pasan ahora la revisión de acceso: la casa diminuta tiene puerta principal de 3\'-0" y nada estorba el giro de las puertas.', cu: 'Todas las plantillas de casa pasan ahora la revisión de acceso: la casa diminuta tiene puerta principal de 3\'-0" y nada estorba el giro de las puertas.', uk: 'Кожен шаблон будинку тепер проходить перевірку доступності: у крихітному будинку вхідні двері 3\'-0", і ніщо не стоїть на шляху дверей.', ru: 'Каждый шаблон дома теперь проходит проверку доступности: у крошечного дома входная дверь 3\'-0", и ничто не стоит на пути дверей.', ti: 'ኩሉ ቅጥዒ ገዛ ሕጂ ምርመራ ተበጻሕነት ይሓልፍ፦ ንእሽቶ ገዛ ቀንዲ ማዕጾ 3\'-0" ኣለዎ፣ ኣብ መንገዲ ማዕጾ ዝኾነ ነገር የለን።', fa: 'همه قالب‌های خانه حالا بررسی دسترسی‌پذیری را رد می‌کنند: خانه کوچک در ورودی 3\'-0" دارد و چیزی سر راه باز شدن درها نیست.', 'fa-AF': 'همه قالب‌های خانه حالا بررسی دسترسی‌پذیری را رد می‌کنند: خانه کوچک دروازه ورودی 3\'-0" دارد و چیزی سر راه باز شدن دروازه‌ها نیست.', ar: 'كل قوالب البيوت تجتاز فحص سهولة الوصول الآن: للبيت الصغير باب أمامي 3\'-0"، ولا شيء في مسار فتح الأبواب.', rw: 'Buri cyitegererezo cy\'inzu ubu gitsinda isuzuma ry\'ikoreshwa: inzu nto ifite umuryango w\'imbere wa 3\'-0", kandi nta kintu kiri aho imiryango ifungukira.' }),
  // 2.13.62: template room nicknames. ti, fa-AF and rw are UNCHECKED native copy.
  'news.photoWalk': g('Photo mode works in the Walkthrough too, and template room names like Parlor and Porch show in your language.', { es: 'El modo foto también funciona en el Recorrido, y nombres de cuartos de las plantillas como Salón y Porche aparecen en tu idioma.', cu: 'El modo foto también funciona en el Recorrido, y nombres de cuartos de las plantillas como Sala de estar y Portal aparecen en tu idioma.', uk: 'Режим фото працює і в Прогулянці, а назви кімнат із шаблонів, як-от Вітальня і Ґанок, — твоєю мовою.', ru: 'Режим фото работает и в Прогулке, а названия комнат из шаблонов, такие как Гостиная и Крыльцо, — на твоём языке.', ti: 'ኣገባብ ስእሊ ኣብ ምዝዋር እውን ይሰርሕ፣ ኣስማት ክፍልታት ቅጥዒ ከም ሳሎንን ባራንዳን ብቋንቋኻ ይርአዩ።', fa: 'حالت عکس در گشت‌وگذار هم کار می‌کند و نام اتاق‌های قالب مثل پذیرایی و ایوان به زبان تو نشان داده می‌شوند.', 'fa-AF': 'حالت عکس در گشت‌وگذار هم کار می‌کند و نام اتاق‌های قالب مثل مهمان‌خانه و ایوان به زبان تو نشان داده می‌شوند.', ar: 'وضع الصورة يعمل في الجولة أيضاً، وأسماء غرف القوالب مثل الصالون والشرفة تظهر بلغتك.', rw: 'Uburyo bw\'ifoto bukora no mu Rugendo, kandi amazina y\'ibyumba y\'ibyitegererezo nka Uruganiriro n\'Urubaraza agaragara mu rurimi rwawe.' }),
  'room.nick.Parlor': g('Parlor', { es: 'Salón', cu: 'Sala de estar', uk: 'Вітальня', ru: 'Гостиная', ti: 'ሳሎን', fa: 'پذیرایی', 'fa-AF': 'مهمان‌خانه', ar: 'صالون', rw: 'Uruganiriro' }),
  'room.nick.Hall': g('Hall', { es: 'Vestíbulo', cu: 'Recibidor', uk: 'Хол', ru: 'Холл', ti: 'መተሓላለፊ', fa: 'هال', 'fa-AF': 'دهلیز', ar: 'ردهة', rw: 'Hall' }),
  'room.nick.Library': g('Library', { es: 'Biblioteca', cu: 'Biblioteca', uk: 'Бібліотека', ru: 'Библиотека', ti: 'ቤተ-መጻሕፍቲ', fa: 'کتابخانه', 'fa-AF': 'کتابخانه', ar: 'مكتبة', rw: 'Isomero' }),
  'room.nick.Porch': g('Porch', { es: 'Porche', cu: 'Portal', uk: 'Ґанок', ru: 'Крыльцо', ti: 'ባራንዳ', fa: 'ایوان', 'fa-AF': 'ایوان', ar: 'شرفة', rw: 'Urubaraza' }),
  'room.nick.Stair hall': g('Stair hall', { es: 'Hall de la escalera', cu: 'Hall de la escalera', uk: 'Сходовий хол', ru: 'Лестничный холл', ti: 'መተሓላለፊ መደያይቦ', fa: 'هال پله', 'fa-AF': 'دهلیز زینه', ar: 'ردهة الدرج', rw: 'Hall y\'ingazi' }),
  'room.nick.Dining room': g('Dining room', { es: 'Comedor', cu: 'Comedor', uk: 'Їдальня', ru: 'Столовая', ti: 'ክፍሊ መግቢ', fa: 'ناهارخوری', 'fa-AF': 'نان‌خوری', ar: 'غرفة الطعام', rw: 'Aho kuririra' }),
  'room.nick.Tiny home': g('Tiny home', { es: 'Casa diminuta', cu: 'Casa diminuta', uk: 'Крихітний дім', ru: 'Крошечный дом', ti: 'ንእሽቶ ገዛ', fa: 'خانه کوچک', 'fa-AF': 'خانه کوچک', ar: 'بيت صغير', rw: 'Inzu nto' }),
  // 2.13.61: Postcard. ti, fa-AF and rw are UNCHECKED native copy.
  'photo.card': g('🖼 Postcard', { es: '🖼 Postal', cu: '🖼 Postal', uk: '🖼 Листівка', ru: '🖼 Открытка', ti: '🖼 ፖስትካርድ', fa: '🖼 کارت‌پستال', 'fa-AF': '🖼 کارت‌پستال', ar: '🖼 بطاقة بريدية', rw: '🖼 Ikarita' }),
  'photo.cardSaved': g('Postcard saved to your downloads.', { es: 'Postal guardada en tus descargas.', cu: 'Postal guardada en tus descargas.', uk: 'Листівку збережено в завантаження.', ru: 'Открытка сохранена в загрузки.', ti: 'ፖስትካርድ ኣብ ዝወረዱ ተዓቂቡ።', fa: 'کارت‌پستال در دانلودها ذخیره شد.', 'fa-AF': 'کارت‌پستال در دانلودها ذخیره شد.', ar: 'حُفظت البطاقة البريدية في التنزيلات.', rw: 'Ikarita yabitswe mu byamanuwe.' }),
  'photo.madeWith': g('Made with Baboo', { es: 'Hecho con Baboo', cu: 'Hecho con Baboo', uk: 'Зроблено в Baboo', ru: 'Сделано в Baboo', ti: 'ብ Baboo ተሰሪሑ', fa: 'ساخته‌شده با Baboo', 'fa-AF': 'ساخته‌شده با Baboo', ar: 'صُنع بـ Baboo', rw: 'Byakozwe na Baboo' }),
  'news.postcard': g('Postcard: in 3D or the Dollhouse, tap Photo then Postcard for your house on a cream card with its name, the date, style and roof.', { es: 'Postal: en 3D o en la Casa de muñecas, toca Foto y luego Postal para tu casa en una tarjeta crema con su nombre, la fecha, el estilo y el techo.', cu: 'Postal: en 3D o en la Casa de muñecas, toca Foto y luego Postal para tu casa en una tarjeta crema con su nombre, la fecha, el estilo y el techo.', uk: 'Листівка: у 3D чи Ляльковому будинку натисни Фото, потім Листівка — твій будинок на кремовій картці з назвою, датою, стилем і дахом.', ru: 'Открытка: в 3D или Кукольном доме нажми Фото, потом Открытка — твой дом на кремовой карточке с названием, датой, стилем и крышей.', ti: 'ፖስትካርድ፦ ኣብ 3D ወይ ገዛ ኣሻንጉሊት ስእሊ ድሕሪኡ ፖስትካርድ ጠውቕ፣ ገዛኻ ኣብ ክሬም ካርድ ምስ ስሙ፣ ዕለት፣ ቅዲን ናሕስን።', fa: 'کارت‌پستال: در سه‌بعدی یا خانه عروسکی، عکس و بعد کارت‌پستال را بزن تا خانه‌ات روی کارت کرم‌رنگ با نام، تاریخ، سبک و سقف بیاید.', 'fa-AF': 'کارت‌پستال: در سه‌بعدی یا خانه گُدی، عکس و بعد کارت‌پستال را بزن تا خانه‌ات روی کارت کرم‌رنگ با نام، تاریخ، سبک و بام بیاید.', ar: 'بطاقة بريدية: في العرض الثلاثي أو بيت الدمى، اضغط صورة ثم بطاقة بريدية لبيتك على بطاقة كريمية مع اسمه والتاريخ والطراز والسقف.', rw: 'Ikarita: muri 3D cyangwa mu Nzu y\'ibikinisho, kanda Ifoto hanyuma Ikarita ubone inzu yawe ku ikarita y\'ibara ry\'amata n\'izina, itariki, imiterere n\'igisenge.' }),
  // 2.13.60: Photo mode. ti, fa-AF and rw are UNCHECKED native copy.
  'photo.btn': g('Photo', { es: 'Foto', cu: 'Foto', uk: 'Фото', ru: 'Фото', ti: 'ስእሊ', fa: 'عکس', 'fa-AF': 'عکس', ar: 'صورة', rw: 'Ifoto' }),
  'photo.mode': g('Photo mode', { es: 'Modo foto', cu: 'Modo foto', uk: 'Режим фото', ru: 'Режим фото', ti: 'ኣገባብ ስእሊ', fa: 'حالت عکس', 'fa-AF': 'حالت عکس', ar: 'وضع الصورة', rw: 'Uburyo bw\'ifoto' }),
  'photo.hint': g('Frame your shot, then Snap.', { es: 'Encuadra la toma y luego Captura.', cu: 'Encuadra la toma y luego Captura.', uk: 'Обери кадр, потім Зняти.', ru: 'Выбери кадр, потом Снять.', ti: 'ስእልኻ ኣቐምጥ፣ ድሕሪኡ ኣንሳእ።', fa: 'کادر را تنظیم کن، بعد بگیر.', 'fa-AF': 'کادر را تنظیم کن، بعد بگیر.', ar: 'أطّر لقطتك، ثم التقط.', rw: 'Tunganya ifoto yawe, hanyuma ufate.' }),
  'photo.snap': g('📷 Snap', { es: '📷 Capturar', cu: '📷 Capturar', uk: '📷 Зняти', ru: '📷 Снять', ti: '📷 ኣንስእ', fa: '📷 بگیر', 'fa-AF': '📷 بگیر', ar: '📷 التقط', rw: '📷 Fata' }),
  'photo.done': g('Done', { es: 'Listo', cu: 'Listo', uk: 'Готово', ru: 'Готово', ti: 'ተወዲኡ', fa: 'تمام', 'fa-AF': 'تمام', ar: 'تم', rw: 'Byarangiye' }),
  'photo.saved': g('Photo saved to your downloads.', { es: 'Foto guardada en tus descargas.', cu: 'Foto guardada en tus descargas.', uk: 'Фото збережено в завантаження.', ru: 'Фото сохранено в загрузки.', ti: 'ስእሊ ኣብ ዝወረዱ ተዓቂቡ።', fa: 'عکس در دانلودها ذخیره شد.', 'fa-AF': 'عکس در دانلودها ذخیره شد.', ar: 'حُفظت الصورة في التنزيلات.', rw: 'Ifoto yabitswe mu byamanuwe.' }),
  'photo.fail': g('Could not take the photo. Try again.', { es: 'No se pudo tomar la foto. Intenta de nuevo.', cu: 'No se pudo tomar la foto. Intenta otra vez.', uk: 'Не вдалося зробити фото. Спробуй ще раз.', ru: 'Не удалось сделать фото. Попробуй ещё раз.', ti: 'ስእሊ ክውሰድ ኣይከኣለን። እንደገና ፈትን።', fa: 'عکس گرفته نشد. دوباره امتحان کن.', 'fa-AF': 'عکس گرفته نشد. دوباره امتحان کن.', ar: 'تعذّر التقاط الصورة. حاول مرة أخرى.', rw: 'Ifoto ntiyafashwe. Ongera ugerageze.' }),
  'news.photo': g('Photo mode in 3D: tap Photo, frame the house, Snap — a sharp picture to share or save.', { es: 'Modo foto en 3D: toca Foto, encuadra la casa y Captura: una imagen nítida para compartir o guardar.', cu: 'Modo foto en 3D: toca Foto, encuadra la casa y Captura: una imagen nítida para compartir o guardar.', uk: 'Режим фото у 3D: натисни Фото, обери кадр, Зняти — чітке зображення, щоб поділитися чи зберегти.', ru: 'Режим фото в 3D: нажми Фото, выбери кадр, Снять — чёткая картинка, чтобы поделиться или сохранить.', ti: 'ኣገባብ ስእሊ ኣብ 3D፦ ስእሊ ጠውቕ፣ ገዛ ኣቐምጥ፣ ኣንስእ — ንጹር ስእሊ ንምክፋል ወይ ንምዕቃብ።', fa: 'حالت عکس در سه‌بعدی: عکس را بزن، خانه را در کادر بگذار، بگیر — تصویری واضح برای اشتراک یا ذخیره.', 'fa-AF': 'حالت عکس در سه‌بعدی: عکس را بزن، خانه را در کادر بگذار، بگیر — تصویری واضح برای اشتراک یا ذخیره.', ar: 'وضع الصورة في العرض الثلاثي: اضغط صورة، أطّر البيت، التقط — صورة واضحة للمشاركة أو الحفظ.', rw: 'Uburyo bw\'ifoto muri 3D: kanda Ifoto, tunganya inzu, Fata — ifoto isobanutse yo gusangiza cyangwa kubika.' }),
  // 2.13.59: checks follow the 2025 Residential Code of New York State. ti, fa-AF and rw are UNCHECKED native copy.
  'acc.ny.dwTitle': g('Front door (32" clear)', { es: 'Puerta principal (32" libres)', cu: 'Puerta principal (32" libres)', uk: 'Вхідні двері (32" вільно)', ru: 'Входная дверь (32" свободно)', ti: 'ቀንዲ ማዕጾ (32" ንጹር)', fa: 'در ورودی (32" آزاد)', 'fa-AF': 'دروازه ورودی (32" آزاد)', ar: 'الباب الأمامي (32" صافية)', rw: 'Umuryango w\'imbere (32" byisanzuye)' }),
  'acc.ny.dwTip': g('NY code: one door to the outside with 32" clear — a 3\'-0" door. Inside doors can be narrower.', { es: 'Código de NY: una puerta al exterior con 32" libres, o sea una puerta de 3\'-0". Las puertas interiores pueden ser más estrechas.', cu: 'Código de NY: una puerta al exterior con 32" libres, o sea una puerta de 3\'-0". Las puertas interiores pueden ser más estrechas.', uk: 'Норми NY: одні двері назовні з 32" вільного проходу — двері 3\'-0". Внутрішні двері можуть бути вужчими.', ru: 'Нормы NY: одна дверь наружу с 32" свободного прохода — дверь 3\'-0". Внутренние двери могут быть уже.', ti: 'ሕጊ NY፦ ናብ ደገ ሓደ ማዕጾ 32" ንጹር — ማዕጾ 3\'-0"። ውሽጣውያን ማዕጾታት ክጸቡ ይኽእሉ።', fa: 'قانون NY: یک در به بیرون با 32" فضای آزاد — یعنی در 3\'-0". درهای داخلی می‌توانند باریک‌تر باشند.', 'fa-AF': 'قانون NY: یک دروازه به بیرون با 32" فضای آزاد — یعنی دروازه 3\'-0". دروازه‌های داخلی می‌توانند باریک‌تر باشند.', ar: 'كود نيويورك: باب واحد إلى الخارج بعرض صافٍ 32" — أي باب 3\'-0". الأبواب الداخلية يمكن أن تكون أضيق.', rw: 'Itegeko rya NY: umuryango umwe ujya hanze ufite 32" byisanzuye — umuryango wa 3\'-0". Imiryango y\'imbere ishobora kuba mito.' }),
  'acc.ny.dwNoExt': g('Doors sit on inside walls only. NY code needs one exit door on an outside wall.', { es: 'Las puertas están solo en paredes interiores. El código de NY pide una puerta de salida en una pared exterior.', cu: 'Las puertas están solo en paredes interiores. El código de NY pide una puerta de salida en una pared exterior.', uk: 'Двері лише на внутрішніх стінах. Норми NY вимагають вихідних дверей на зовнішній стіні.', ru: 'Двери только на внутренних стенах. Нормы NY требуют выходную дверь на наружной стене.', ti: 'ማዕጾታት ኣብ ውሽጣዊ መናድቕ ጥራይ ኣለዉ። ሕጊ NY ኣብ ደገዊ መንደቕ ሓደ ማዕጾ መውጽኢ ይደሊ።', fa: 'درها فقط روی دیوارهای داخلی‌اند. قانون NY یک در خروج روی دیوار بیرونی می‌خواهد.', 'fa-AF': 'دروازه‌ها فقط روی دیوارهای داخلی‌اند. قانون NY یک دروازه خروج روی دیوار بیرونی می‌خواهد.', ar: 'الأبواب على جدران داخلية فقط. كود نيويورك يطلب باب خروج على جدار خارجي.', rw: 'Imiryango iri ku nkuta z\'imbere gusa. Itegeko rya NY rikenera umuryango wo gusohoka ku rukuta rwo hanze.' }),
  'acc.ny.dwFail': g('The widest outside door is only {w}. NY code wants 32" clear — use a 3\'-0" door.', { es: 'La puerta exterior más ancha mide solo {w}. El código de NY pide 32" libres: usa una puerta de 3\'-0".', cu: 'La puerta exterior más ancha mide solo {w}. El código de NY pide 32" libres: usa una puerta de 3\'-0".', uk: 'Найширші зовнішні двері лише {w}. Норми NY вимагають 32" вільно — став двері 3\'-0".', ru: 'Самая широкая наружная дверь всего {w}. Нормы NY требуют 32" свободно — ставь дверь 3\'-0".', ti: 'እቲ ዝሰፍሐ ደገዊ ማዕጾ {w} ጥራይ እዩ። ሕጊ NY 32" ንጹር ይደሊ — ማዕጾ 3\'-0" ተጠቐም።', fa: 'پهن‌ترین در بیرونی فقط {w} است. قانون NY ‏32" آزاد می‌خواهد — از در 3\'-0" استفاده کن.', 'fa-AF': 'پهن‌ترین دروازه بیرونی فقط {w} است. قانون NY ‏32" آزاد می‌خواهد — از دروازه 3\'-0" استفاده کن.', ar: 'أعرض باب خارجي {w} فقط. كود نيويورك يطلب 32" صافية — استخدم باباً 3\'-0".', rw: 'Umuryango wo hanze munini cyane ufite {w} gusa. Itegeko rya NY rishaka 32" byisanzuye — koresha umuryango wa 3\'-0".' }),
  'acc.ny.dwPass': g('Front door is {w} — that gives the 32" clear opening NY code asks for.', { es: 'La puerta principal mide {w}: da los 32" libres que pide el código de NY.', cu: 'La puerta principal mide {w}: da los 32" libres que pide el código de NY.', uk: 'Вхідні двері {w} — це дає 32" вільного проходу, як вимагають норми NY.', ru: 'Входная дверь {w} — это даёт 32" свободного прохода, как требуют нормы NY.', ti: 'ቀንዲ ማዕጾ {w} እዩ — እዚ ሕጊ NY ዝደልዮ 32" ንጹር መኽፈቲ ይህብ።', fa: 'در ورودی {w} است — همان 32" بازشوی آزادی که قانون NY می‌خواهد.', 'fa-AF': 'دروازه ورودی {w} است — همان 32" بازشوی آزادی که قانون NY می‌خواهد.', ar: 'الباب الأمامي {w} — يعطي الفتحة الصافية 32" التي يطلبها كود نيويورك.', rw: 'Umuryango w\'imbere ufite {w} — bitanga 32" byisanzuye itegeko rya NY risaba.' }),
  'acc.ny.adaNote': g('(Accessibility guideline for homes built for wheelchairs — not required in every NY house.)', { es: '(Guía de accesibilidad para casas hechas para sillas de ruedas; no se exige en toda casa de NY.)', cu: '(Guía de accesibilidad para casas hechas para sillas de ruedas; no se exige en toda casa de NY.)', uk: '(Порада щодо доступності для будинків під візок — не обов\'язково в кожному будинку NY.)', ru: '(Совет по доступности для домов под коляску — не обязательно в каждом доме NY.)', ti: '(መምርሒ ተበጻሕነት ንገዛውቲ ዓረብያ ስንኩላን — ኣብ ኩሉ ገዛ NY ግዴታ ኣይኮነን።)', fa: '(راهنمای دسترسی‌پذیری برای خانه‌های ویژه ویلچر — در هر خانه NY لازم نیست.)', 'fa-AF': '(رهنمای دسترسی‌پذیری برای خانه‌های ویژه چوکی چرخ‌دار — در هر خانه NY لازم نیست.)', ar: '(إرشاد لسهولة الوصول في البيوت المصممة للكراسي المتحركة — ليس مطلوباً في كل بيت في نيويورك.)', rw: '(Inama y\'ikoreshwa ku mazu yubakiwe amagare — ntibisabwa mu nzu zose za NY.)' }),
  'acc.ny.disclaimer': g('Classroom check based on the 2025 Residential Code of New York State — not a legal stamp.', { es: 'Revisión de clase basada en el Código Residencial del Estado de Nueva York 2025; no es un sello legal.', cu: 'Revisión de clase basada en el Código Residencial del Estado de Nueva York 2025; no es un sello legal.', uk: 'Шкільна перевірка за Житловим кодексом штату Нью-Йорк 2025 — не юридичний висновок.', ru: 'Школьная проверка по Жилищному кодексу штата Нью-Йорк 2025 — не юридическое заключение.', ti: 'ምርመራ ክፍሊ ብመሰረት ሕጊ መንበሪ ገዛ ግዝኣት ኒው ዮርክ 2025 — ሕጋዊ ማሕተም ኣይኮነን።', fa: 'بررسی کلاسی بر پایه قانون مسکونی ایالت نیویورک ۲۰۲۵ — مهر قانونی نیست.', 'fa-AF': 'بررسی صنفی بر پایه قانون مسکونی ایالت نیویارک ۲۰۲۵ — مهر قانونی نیست.', ar: 'فحص صفّي مبني على كود المساكن لولاية نيويورك 2025 — ليس ختماً قانونياً.', rw: 'Isuzuma ry\'ishuri rishingiye ku Itegeko ry\'Amazu rya Leta ya New York 2025 — si icyemezo cy\'amategeko.' }),
  'acc.ny.legal': g('Code items follow the 2025 Residential Code of New York State: one exit door with 32" clear, halls at least 3 ft wide. Bath turning circles (5\') and kitchen aisles (40") are accessibility guidelines for homes built for wheelchairs. New York City has its own code — ask your teacher.', { es: 'Los puntos de código siguen el Código Residencial del Estado de Nueva York 2025: una puerta de salida con 32" libres y pasillos de al menos 3 pies. El círculo de giro del baño (5\') y los pasillos de cocina (40") son guías de accesibilidad para casas hechas para sillas de ruedas. La ciudad de Nueva York tiene su propio código: pregunta a tu maestro.', cu: 'Los puntos de código siguen el Código Residencial del Estado de Nueva York 2025: una puerta de salida con 32" libres y pasillos de al menos 3 pies. El círculo de giro del baño (5\') y los pasillos de cocina (40") son guías de accesibilidad para casas hechas para sillas de ruedas. La ciudad de Nueva York tiene su propio código: pregunta a tu maestro.', uk: 'Пункти норм — за Житловим кодексом штату Нью-Йорк 2025: одні вихідні двері з 32" вільно, коридори щонайменше 3 фути. Коло розвороту у ванній (5\') і проходи на кухні (40") — поради з доступності для будинків під візок. Місто Нью-Йорк має власні норми — запитай учителя.', ru: 'Пункты норм — по Жилищному кодексу штата Нью-Йорк 2025: одна выходная дверь с 32" свободно, коридоры не уже 3 футов. Круг разворота в ванной (5\') и проходы на кухне (40") — советы по доступности для домов под коляску. У города Нью-Йорк свои нормы — спроси учителя.', ti: 'ነጥብታት ሕጊ ሕጊ መንበሪ ገዛ ግዝኣት ኒው ዮርክ 2025 ይስዕቡ፦ ሓደ ማዕጾ መውጽኢ 32" ንጹር፣ መተሓላለፊ ብውሑዱ 3 ጫማ። ክቢ ምዝዋር ኣብ ባኞ (5\')ን መተሓላለፊ ክሽነ (40")ን መምርሒታት ተበጻሕነት ንገዛውቲ ዓረብያ እዮም። ከተማ ኒው ዮርክ ናይ ገዛእ ርእሳ ሕጊ ኣለዋ — ንመምህርካ ሕተት።', fa: 'موارد قانونی از قانون مسکونی ایالت نیویورک ۲۰۲۵ پیروی می‌کنند: یک در خروج با 32" آزاد، راهروها دست‌کم ۳ فوت. دایره چرخش حمام (5\') و راهروی آشپزخانه (40") راهنمای دسترسی‌پذیری برای خانه‌های ویژه ویلچر هستند. شهر نیویورک قانون خودش را دارد — از معلمت بپرس.', 'fa-AF': 'موارد قانونی از قانون مسکونی ایالت نیویارک ۲۰۲۵ پیروی می‌کنند: یک دروازه خروج با 32" آزاد، دهلیزها دست‌کم ۳ فت. دایره چرخش تشناب (5\') و راهروی آشپزخانه (40") رهنمای دسترسی‌پذیری برای خانه‌های ویژه چوکی چرخ‌دار هستند. شهر نیویارک قانون خودش را دارد — از معلمت بپرس.', ar: 'بنود الكود تتبع كود المساكن لولاية نيويورك 2025: باب خروج واحد بعرض صافٍ 32"، وممرات لا تقل عن 3 أقدام. دائرة الدوران في الحمام (5\') وممرات المطبخ (40") إرشادات لسهولة الوصول في البيوت المصممة للكراسي المتحركة. لمدينة نيويورك كودها الخاص — اسأل معلمك.', rw: 'Ibisabwa n\'itegeko bikurikiza Itegeko ry\'Amazu rya Leta ya New York 2025: umuryango umwe wo gusohoka ufite 32" byisanzuye, inzira nibura ft 3. Uruziga rwo guhindukira mu bwiherero (5\') n\'inzira z\'igikoni (40") ni inama z\'ikoreshwa ku mazu yubakiwe amagare. Umujyi wa New York ufite itegeko ryawo — baza mwarimu wawe.' }),
  'arch.ny.small': g('{room} is {a} sq ft. NY code: a room you live in needs at least 70 sq ft.', { es: '{room} mide {a} pies². Código de NY: un cuarto para vivir necesita al menos 70 pies².', cu: '{room} mide {a} pies². Código de NY: un cuarto para vivir necesita al menos 70 pies².', uk: '{room} — {a} кв. футів. Норми NY: житлова кімната — щонайменше 70 кв. футів.', ru: '{room} — {a} кв. футов. Нормы NY: жилая комната — не меньше 70 кв. футов.', ti: '{room} {a} sq ft እዩ። ሕጊ NY፦ ዝንበረሉ ክፍሊ ብውሑዱ 70 sq ft ይደሊ።', fa: '{room} {a} فوت مربع است. قانون NY: اتاقی که در آن زندگی می‌کنی دست‌کم ۷۰ فوت مربع می‌خواهد.', 'fa-AF': '{room} {a} فت مربع است. قانون NY: اتاقی که در آن زندگی می‌کنی دست‌کم ۷۰ فت مربع می‌خواهد.', ar: '{room} مساحته {a} قدم مربع. كود نيويورك: الغرفة المعيشية تحتاج 70 قدماً مربعاً على الأقل.', rw: '{room} ifite {a} sq ft. Itegeko rya NY: icyumba kibamo abantu gikenera nibura 70 sq ft.' }),
  'arch.ny.narrow': g('{room} is only {w} across. NY code: rooms you live in are at least 7 ft each way.', { es: '{room} mide solo {w} de ancho. Código de NY: los cuartos para vivir miden al menos 7 pies en cada sentido.', cu: '{room} mide solo {w} de ancho. Código de NY: los cuartos para vivir miden al menos 7 pies en cada sentido.', uk: '{room} лише {w} завширшки. Норми NY: житлові кімнати — щонайменше 7 футів у кожен бік.', ru: '{room} всего {w} в ширину. Нормы NY: жилые комнаты — не меньше 7 футов в каждую сторону.', ti: '{room} {w} ጥራይ ስፍሓት ኣለዎ። ሕጊ NY፦ ዝንበረሎም ክፍልታት ብነፍሲ ወከፍ ኣንፈት ብውሑዱ 7 ጫማ።', fa: '{room} فقط {w} پهنا دارد. قانون NY: اتاق‌های زندگی از هر طرف دست‌کم ۷ فوت‌اند.', 'fa-AF': '{room} فقط {w} پهنا دارد. قانون NY: اتاق‌های زندگی از هر طرف دست‌کم ۷ فت‌اند.', ar: '{room} عرضه {w} فقط. كود نيويورك: الغرف المعيشية لا تقل عن 7 أقدام في كل اتجاه.', rw: '{room} ifite ubugari bwa {w} gusa. Itegeko rya NY: ibyumba bibamo abantu bigira nibura ft 7 impande zose.' }),
  'arch.ny.pass': g('Rooms you live in meet NY code: at least 70 sq ft and 7 ft each way.', { es: 'Los cuartos para vivir cumplen el código de NY: al menos 70 pies² y 7 pies en cada sentido.', cu: 'Los cuartos para vivir cumplen el código de NY: al menos 70 pies² y 7 pies en cada sentido.', uk: 'Житлові кімнати відповідають нормам NY: щонайменше 70 кв. футів і 7 футів у кожен бік.', ru: 'Жилые комнаты соответствуют нормам NY: не меньше 70 кв. футов и 7 футов в каждую сторону.', ti: 'ዝንበረሎም ክፍልታት ሕጊ NY የማልኡ፦ ብውሑዱ 70 sq ft ን 7 ጫማ ብነፍሲ ወከፍ ኣንፈትን።', fa: 'اتاق‌های زندگی با قانون NY جورند: دست‌کم ۷۰ فوت مربع و ۷ فوت از هر طرف.', 'fa-AF': 'اتاق‌های زندگی با قانون NY جورند: دست‌کم ۷۰ فت مربع و ۷ فت از هر طرف.', ar: 'الغرف المعيشية تطابق كود نيويورك: 70 قدماً مربعاً و7 أقدام في كل اتجاه على الأقل.', rw: 'Ibyumba bibamo abantu byujuje itegeko rya NY: nibura 70 sq ft na ft 7 impande zose.' }),
  'arch.ny.skipTip': g('NY code: bedrooms, living and dining rooms need at least 70 sq ft and 7 ft each way. Kitchens and baths don\'t count.', { es: 'Código de NY: dormitorios, salas y comedores necesitan al menos 70 pies² y 7 pies en cada sentido. Cocinas y baños no cuentan.', cu: 'Código de NY: dormitorios, salas y comedores necesitan al menos 70 pies² y 7 pies en cada sentido. Cocinas y baños no cuentan.', uk: 'Норми NY: спальні, вітальні та їдальні — щонайменше 70 кв. футів і 7 футів у кожен бік. Кухні й ванні не рахуються.', ru: 'Нормы NY: спальни, гостиные и столовые — не меньше 70 кв. футов и 7 футов в каждую сторону. Кухни и ванные не считаются.', ti: 'ሕጊ NY፦ መደቀሲ፣ መሕደሪን መመገቢን ብውሑዱ 70 sq ft ን 7 ጫማ ብነፍሲ ወከፍ ኣንፈትን ይደልዩ። ክሽነን ባኞን ኣይቁጸሩን።', fa: 'قانون NY: اتاق خواب، نشیمن و ناهارخوری دست‌کم ۷۰ فوت مربع و ۷ فوت از هر طرف می‌خواهند. آشپزخانه و حمام حساب نمی‌شوند.', 'fa-AF': 'قانون NY: اتاق خواب، نشیمن و نان‌خوری دست‌کم ۷۰ فت مربع و ۷ فت از هر طرف می‌خواهند. آشپزخانه و تشناب حساب نمی‌شوند.', ar: 'كود نيويورك: غرف النوم والمعيشة والطعام تحتاج 70 قدماً مربعاً و7 أقدام في كل اتجاه على الأقل. المطابخ والحمامات لا تُحسب.', rw: 'Itegeko rya NY: ibyumba byo kuraramo, uruganiriro n\'aho kuririra bikenera nibura 70 sq ft na ft 7 impande zose. Igikoni n\'ubwiherero ntibibarwa.' }),
  'news.nyCode': g('Baboo\'s checks follow the 2025 Residential Code of New York State: rooms you live in at least 70 sq ft and 7 ft across, and one 3\'-0" front door.', { es: 'Las revisiones de Baboo siguen el Código Residencial del Estado de Nueva York 2025: cuartos para vivir de al menos 70 pies² y 7 pies de ancho, y una puerta principal de 3\'-0".', cu: 'Las revisiones de Baboo siguen el Código Residencial del Estado de Nueva York 2025: cuartos para vivir de al menos 70 pies² y 7 pies de ancho, y una puerta principal de 3\'-0".', uk: 'Перевірки Baboo йдуть за Житловим кодексом штату Нью-Йорк 2025: житлові кімнати щонайменше 70 кв. футів і 7 футів завширшки, і одні вхідні двері 3\'-0".', ru: 'Проверки Baboo идут по Жилищному кодексу штата Нью-Йорк 2025: жилые комнаты не меньше 70 кв. футов и 7 футов в ширину, и одна входная дверь 3\'-0".', ti: 'ምርመራታት Baboo ሕጊ መንበሪ ገዛ ግዝኣት ኒው ዮርክ 2025 ይስዕቡ፦ ዝንበረሎም ክፍልታት ብውሑዱ 70 sq ft ን 7 ጫማ ስፍሓትን፣ ሓደ ቀንዲ ማዕጾ 3\'-0"።', fa: 'بررسی‌های Baboo از قانون مسکونی ایالت نیویورک ۲۰۲۵ پیروی می‌کنند: اتاق‌های زندگی دست‌کم ۷۰ فوت مربع و ۷ فوت پهنا، و یک در ورودی 3\'-0".', 'fa-AF': 'بررسی‌های Baboo از قانون مسکونی ایالت نیویارک ۲۰۲۵ پیروی می‌کنند: اتاق‌های زندگی دست‌کم ۷۰ فت مربع و ۷ فت پهنا، و یک دروازه ورودی 3\'-0".', ar: 'فحوصات Baboo تتبع كود المساكن لولاية نيويورك 2025: غرف معيشية لا تقل عن 70 قدماً مربعاً و7 أقدام عرضاً، وباب أمامي واحد 3\'-0".', rw: 'Isuzuma rya Baboo rikurikiza Itegeko ry\'Amazu rya Leta ya New York 2025: ibyumba bibamo abantu nibura 70 sq ft na ft 7 z\'ubugari, n\'umuryango umwe w\'imbere wa 3\'-0".' }),
  // 2.13.58: right-to-left sizes and dates. ti, fa-AF and rw are UNCHECKED native copy.
  'ver.holdTeacher': g('hold for Teacher', { es: 'mantén pulsado para Docente', cu: 'mantén apretado para Maestro', uk: 'утримуй для Вчителя', ru: 'удерживай для Учителя', ti: 'ንመምህር ጠውቕ ኣትሒዝካ', fa: 'برای معلم نگه دار', 'fa-AF': 'برای معلم نگه دار', ar: 'اضغط مطولاً للمعلم', rw: 'fata kugira ngo ubone Mwarimu' }),
  'news.rtlSizes': g('Sizes like 1\'-0" read the right way in Arabic and Dari, and the plan sheet date is in your language.', { es: 'Las medidas como 1\'-0" se leen bien en árabe y dari, y la fecha de la hoja está en tu idioma.', cu: 'Las medidas como 1\'-0" se leen bien en árabe y dari, y la fecha de la hoja está en tu idioma.', uk: 'Розміри на зразок 1\'-0" правильно читаються арабською й дарі, а дата на аркуші — твоєю мовою.', ru: 'Размеры вроде 1\'-0" правильно читаются на арабском и дари, а дата на листе — на твоём языке.', ti: 'ዓቐናት ከም 1\'-0" ብዓረብኛን ዳሪን ብቕኑዕ ይንበቡ፣ ዕለት ወረቐት ትልሚ ብቋንቋኻ እዩ።', fa: 'اندازه‌هایی مثل 1\'-0" در عربی و دری درست خوانده می‌شوند و تاریخ برگه نقشه به زبان توست.', 'fa-AF': 'اندازه‌هایی مثل 1\'-0" در عربی و دری درست خوانده می‌شوند و تاریخ ورق نقشه به زبان توست.', ar: 'المقاسات مثل 1\'-0" تُقرأ بشكل صحيح بالعربية والدارية، وتاريخ ورقة المخطط بلغتك.', rw: 'Ingano nka 1\'-0" zisomwa neza mu Cyarabu no mu Kidari, kandi itariki ku rupapuro ry\'igishushanyo iri mu rurimi rwawe.' }),
  // 2.13.57: fit into the free view. ti, fa-AF and rw are UNCHECKED native copy.
  'news.fitFree': g('Fit centers the plan in the space you can see, not under the job card or the tool rail.', { es: 'Ajustar centra el plano en el espacio que ves, no debajo de la tarjeta de tarea ni de las herramientas.', cu: 'Ajustar centra el plano en el espacio que ves, no debajo de la tarjeta de tarea ni de las herramientas.', uk: 'Вмістити ставить план у видиму частину, а не під картку завдання чи панель інструментів.', ru: 'Вписать ставит план в видимую часть, а не под карточку задания или панель инструментов.', ti: 'ምምጣን ነቲ ትልሚ ኣብቲ ትርእዮ ቦታ የማእክሎ፣ ኣብ ትሕቲ ካርድ ስራሕ ወይ መሳርሒታት ኣይኮነን።', fa: 'جا دادن نقشه را در فضایی که می‌بینی وسط می‌گذارد، نه زیر کارت کار یا نوار ابزار.', 'fa-AF': 'جا دادن نقشه را در فضایی که می‌بینی وسط می‌گذارد، نه زیر کارت کار یا نوار ابزار.', ar: 'الملاءمة تضع المخطط في وسط المساحة التي تراها، لا تحت بطاقة المهمة أو شريط الأدوات.', rw: 'Guhuza bishyira igishushanyo hagati y\'aho ubona, si munsi y\'ikarita y\'umukoro cyangwa ibikoresho.' }),
  // 2.13.56: dollhouse tags, phone landscape. ti, fa-AF and rw are UNCHECKED native copy.
  'news.tags': g('Dollhouse room names sit on a soft tag so they read over furniture, and the job card stays one line on a phone turned sideways.', { es: 'Los nombres de los cuartos en la Casa de muñecas tienen una etiqueta suave para leerse sobre los muebles, y la tarjeta de tarea ocupa una línea con el teléfono de lado.', cu: 'Los nombres de los cuartos en la Casa de muñecas tienen una etiqueta suave para leerse sobre los muebles, y la tarjeta de tarea ocupa una línea con el teléfono de lado.', uk: 'Назви кімнат у Ляльковому будинку мають м\'яку підкладку, щоб читатися над меблями, а картка завдання займає один рядок на телефоні боком.', ru: 'Названия комнат в Кукольном доме лежат на мягкой подложке, чтобы читаться поверх мебели, а карточка задания занимает одну строку на телефоне боком.', ti: 'ኣስማት ክፍልታት ኣብ ገዛ ኣሻንጉሊት ኣብ ልዕሊ ኣቑሑ ክንበቡ ልስሉስ ምልክት ኣለዎም፣ ካርድ ስራሕ ኣብ ብጎድኑ ዝተገልበጠ ተሌፎን ሓደ መስመር ይተርፍ።', fa: 'نام اتاق‌ها در خانه عروسکی روی یک برچسب نرم است تا روی وسایل خوانده شود، و کارت کار در گوشیِ افقی یک خط می‌ماند.', 'fa-AF': 'نام اتاق‌ها در خانه گُدی روی یک برچسپ نرم است تا روی سامان خوانده شود، و کارت کار در موبایل افقی یک خط می‌ماند.', ar: 'أسماء الغرف في بيت الدمى على شارة ناعمة لتُقرأ فوق الأثاث، وبطاقة المهمة تبقى سطراً واحداً على الهاتف الأفقي.', rw: 'Amazina y\'ibyumba mu Nzu y\'ibikinisho ari ku kirango cyoroshye kugira ngo asomeke hejuru y\'ibikoresho, kandi ikarita y\'umukoro iguma ku murongo umwe kuri telefoni iri ku ruhande.' }),
  // 2.13.55: unnamed plans and file names in every language. ti, fa-AF and rw are UNCHECKED native copy.
  'plan.untitled': g('Untitled plan', { es: 'Plano sin nombre', cu: 'Plano sin nombre', uk: 'План без назви', ru: 'План без названия', ti: 'ስም ዘይብሉ ትልሚ', fa: 'نقشه بی‌نام', 'fa-AF': 'نقشه بی‌نام', ar: 'مخطط بلا اسم', rw: 'Igishushanyo kitagira izina' }),
  'chrome.classShare': g('Class share', { es: 'Compartido en clase', cu: 'Compartido en clase', uk: 'Спільне для класу', ru: 'Общее для класса', ti: 'ናይ ክፍሊ ምክፋል', fa: 'اشتراک کلاسی', 'fa-AF': 'اشتراک صنفی', ar: 'مشاركة الصف', rw: 'Ibisangiwe n\'ishuri' }),
  'chrome.classShareTip': g('Opened from a class folder — no server', { es: 'Abierto desde una carpeta de clase, sin servidor', cu: 'Abierto desde una carpeta de clase, sin servidor', uk: 'Відкрито з папки класу — без сервера', ru: 'Открыто из папки класса — без сервера', ti: 'ካብ ፎልደር ክፍሊ ተኸፊቱ — ሰርቨር የለን', fa: 'از پوشه کلاس باز شد — بدون سرور', 'fa-AF': 'از پوشه صنف باز شد — بدون سرور', ar: 'فُتح من مجلد الصف — بلا خادم', rw: 'Byafunguwe mu bubiko bw\'ishuri — nta seriveri' }),
  'news.names': g('Unnamed plans say “Untitled plan” in your language, and saved files keep names written in any language.', { es: 'Los planos sin nombre dicen “Plano sin nombre” en tu idioma, y los archivos guardados conservan nombres en cualquier idioma.', cu: 'Los planos sin nombre dicen “Plano sin nombre” en tu idioma, y los archivos guardados conservan nombres en cualquier idioma.', uk: 'Плани без назви показують «План без назви» твоєю мовою, а збережені файли зберігають назви будь-якою мовою.', ru: 'Планы без названия показывают «План без названия» на твоём языке, а сохранённые файлы сохраняют названия на любом языке.', ti: 'ስም ዘይብሎም ትልምታት ብቋንቋኻ “ስም ዘይብሉ ትልሚ” ይብሉ፣ ዝተዓቀቡ ፋይላት ብዝኾነ ቋንቋ ዝተጻሕፉ ኣስማት ይሕዙ።', fa: 'نقشه‌های بی‌نام به زبان تو «نقشه بی‌نام» نوشته می‌شوند و فایل‌های ذخیره‌شده نام‌هایی به هر زبانی را نگه می‌دارند.', 'fa-AF': 'نقشه‌های بی‌نام به زبان تو «نقشه بی‌نام» نوشته می‌شوند و فایل‌های ذخیره‌شده نام‌هایی به هر زبانی را نگه می‌دارند.', ar: 'المخططات بلا اسم تظهر «مخطط بلا اسم» بلغتك، والملفات المحفوظة تحتفظ بأسماء بأي لغة.', rw: 'Ibishushanyo bitagira izina byandikwa “Igishushanyo kitagira izina” mu rurimi rwawe, kandi amadosiye abitswe agumana amazina yanditse mu rurimi urwo ari rwo rwose.' }),
  // 2.13.54: wall sizes in plan units. ti, fa-AF and rw are UNCHECKED native copy.
  'news.wallUnits': g('Wall sizes read in feet and inches on feet plans, room areas say sq ft in your language, and wall options fold on phones.', { es: 'Las medidas de pared se leen en pies y pulgadas en planos en pies, las áreas dicen pies² en tu idioma y las opciones de pared se pliegan en el teléfono.', cu: 'Las medidas de pared se leen en pies y pulgadas en planos en pies, las áreas dicen pies² en tu idioma y las opciones de pared se pliegan en el teléfono.', uk: 'Розміри стін на планах у футах читаються у футах і дюймах, площі — твоєю мовою, а параметри стіни згортаються на телефоні.', ru: 'Размеры стен на планах в футах читаются в футах и дюймах, площади — на твоём языке, а параметры стены сворачиваются на телефоне.', ti: 'ኣብ ትልሚ ብጫማ ዓቐን መናድቕ ብጫማን ኢንችን ይንበብ፣ ስፍሓት ክፍልታት ብቋንቋኻ፣ ኣማራጺታት መንደቕ ኣብ ተሌፎን ይዕጸፍ።', fa: 'اندازه دیوارها در نقشه‌های فوتی با فوت و اینچ خوانده می‌شود، مساحت‌ها به زبان تو هستند و گزینه‌های دیوار در گوشی جمع می‌شوند.', 'fa-AF': 'اندازه دیوارها در نقشه‌های فتی با فت و انچ خوانده می‌شود، مساحت‌ها به زبان تو هستند و گزینه‌های دیوار در موبایل جمع می‌شوند.', ar: 'مقاسات الجدران تُقرأ بالأقدام والبوصات في مخططات الأقدام، والمساحات بلغتك، وخيارات الجدار تُطوى على الهاتف.', rw: 'Ingano z\'inkuta zisomwa mu birenge n\'intambwe ku bishushanyo by\'ibirenge, ubuso buri mu rurimi rwawe, n\'amahitamo y\'urukuta arahinnye kuri telefoni.' }),
  // 2.13.53: Teach panel challenges. ti, fa-AF and rw are UNCHECKED native copy.
  'news.challengeWords': g('Teach panel challenges and their scoring lines are in your language.', { es: 'Los retos del panel Enseñar y sus puntos están en tu idioma.', cu: 'Los retos del panel Enseñar y sus puntos están en tu idioma.', uk: 'Виклики панелі Навчання та їхні бали — твоєю мовою.', ru: 'Задания панели Обучение и их баллы — на твоём языке.', ti: 'ብድሆታት መምሃሪ ፓነልን ነጥብታቶምን ብቋንቋኻ እዮም።', fa: 'چالش‌های پنل آموزش و امتیازهایشان به زبان تو هستند.', 'fa-AF': 'چالش‌های پنل آموزش و نمره‌هایشان به زبان تو هستند.', ar: 'تحديات لوحة التعليم ونقاطها بلغتك.', rw: 'Ibigeragezo by\'akanama ko Kwigisha n\'amanota yabyo biri mu rurimi rwawe.' }),
  'teach.pts': g('({n} pts)', { es: '({n} pts)', cu: '({n} pts)', uk: '({n} б.)', ru: '({n} б.)', ti: '({n} ነጥቢ)', fa: '({n} امتیاز)', 'fa-AF': '({n} نمره)', ar: '({n} نقاط)', rw: '(amanota {n})' }),
  'ch.ch-scale-room.title': g('Challenge A — Scale a Room', { es: 'Reto A — Un cuarto a escala', cu: 'Reto A — Un cuarto a escala', uk: 'Виклик A — Кімната в масштабі', ru: 'Задание A — Комната в масштабе', ti: 'ብድሆ A — ክፍሊ ብመጠን', fa: 'چالش الف — اتاق به مقیاس', 'fa-AF': 'چالش الف — اتاق به مقیاس', ar: 'التحدي أ — غرفة بمقياس', rw: 'Ikigeragezo A — Icyumba ku gipimo' }),
  'ch.ch-scale-room.prompt': g('1. Draw a room about 12 ft × 10 ft.\n2. Put size labels on the walls.\n3. Put one door on the long wall.', { es: '1. Dibuja un cuarto de unos 12 pies × 10 pies.\n2. Pon etiquetas de medida en las paredes.\n3. Pon una puerta en la pared larga.', cu: '1. Dibuja un cuarto de unos 12 pies × 10 pies.\n2. Pon etiquetas de medida en las paredes.\n3. Pon una puerta en la pared larga.', uk: '1. Намалюй кімнату приблизно 12 × 10 футів.\n2. Постав підписи розмірів на стінах.\n3. Постав одні двері на довгій стіні.', ru: '1. Нарисуй комнату примерно 12 × 10 футов.\n2. Поставь подписи размеров на стенах.\n3. Поставь одну дверь на длинной стене.', ti: '1. ኣስታት 12 ጫማ × 10 ጫማ ክፍሊ ስኣል።\n2. ኣብ መናድቕ ምልክታት ዓቐን ኣቐምጥ።\n3. ኣብቲ ነዊሕ መንደቕ ሓደ ማዕጾ ኣቐምጥ።', fa: '۱. یک اتاق حدود ۱۲ × ۱۰ فوت بکش.\n۲. روی دیوارها برچسب اندازه بگذار.\n۳. یک در روی دیوار بلند بگذار.', 'fa-AF': '۱. یک اتاق حدود ۱۲ × ۱۰ فت رسم کن.\n۲. روی دیوارها برچسپ اندازه بگذار.\n۳. یک دروازه روی دیوار دراز بگذار.', ar: '1. ارسم غرفة بنحو 12 × 10 أقدام.\n2. ضع تسميات المقاس على الجدران.\n3. ضع باباً واحداً على الجدار الطويل.', rw: '1. Shushanya icyumba cya hafi ft 12 × ft 10.\n2. Shyira ibirango by\'ingano ku nkuta.\n3. Shyira umuryango umwe ku rukuta rurerure.' }),
  'ch.ch-scale-room.r1': g('Room footprint is within 1 ft of 12×10', { es: 'El cuarto mide 12×10 con menos de 1 pie de diferencia', cu: 'El cuarto mide 12×10 con menos de 1 pie de diferencia', uk: 'Розмір кімнати — 12×10 із похибкою до 1 фута', ru: 'Размер комнаты — 12×10 с погрешностью до 1 фута', ti: 'ዓቐን ክፍሊ ኣብ ውሽጢ 1 ጫማ ካብ 12×10 እዩ', fa: 'اندازه اتاق حداکثر ۱ فوت با ۱۲×۱۰ فرق دارد', 'fa-AF': 'اندازه اتاق حداکثر ۱ فت با ۱۲×۱۰ فرق دارد', ar: 'مساحة الغرفة ضمن قدم واحد من 12×10', rw: 'Ingano y\'icyumba itandukanye na 12×10 munsi ya ft 1' }),
  'ch.ch-scale-room.r2': g('Door uses a swing-arc drafting symbol', { es: 'La puerta usa el símbolo de arco de giro', cu: 'La puerta usa el símbolo de arco de giro', uk: 'Двері позначені дугою відчинення', ru: 'Дверь обозначена дугой открывания', ti: 'ማዕጾ ምልክት ቀስቲ ምኽፋት ይጥቀም', fa: 'در با نماد کمان باز شدن کشیده شده', 'fa-AF': 'دروازه با نماد کمان باز شدن رسم شده', ar: 'الباب مرسوم برمز قوس الفتح', rw: 'Umuryango ukoresha ikimenyetso cy\'uruziga rwo gufungura' }),
  'ch.ch-scale-room.r3': g('Dimensions readable in feet', { es: 'Medidas legibles en pies', cu: 'Medidas legibles en pies', uk: 'Розміри видно у футах', ru: 'Размеры читаются в футах', ti: 'ዓቐናት ብጫማ ይንበቡ', fa: 'اندازه‌ها به فوت خوانا هستند', 'fa-AF': 'اندازه‌ها به فت خوانا هستند', ar: 'المقاسات مقروءة بالأقدام', rw: 'Ingano zisomeka mu birenge' }),
  'ch.ch-openings.title': g('Challenge B — Openings & Path', { es: 'Reto B — Aberturas y camino', cu: 'Reto B — Aberturas y camino', uk: 'Виклик B — Отвори й прохід', ru: 'Задание B — Проёмы и проход', ti: 'ብድሆ B — መኽፈቲታትን መንገድን', fa: 'چالش ب — بازشوها و مسیر', 'fa-AF': 'چالش ب — بازشوها و راه', ar: 'التحدي ب — الفتحات والممر', rw: 'Ikigeragezo B — Imyanya n\'inzira' }),
  'ch.ch-openings.prompt': g('1. Add a window across from the door.\n2. Place a sofa.\n3. Leave a clear walking path door → window.', { es: '1. Agrega una ventana frente a la puerta.\n2. Pon un sofá.\n3. Deja un camino libre puerta → ventana.', cu: '1. Agrega una ventana frente a la puerta.\n2. Pon un sofá.\n3. Deja un camino libre puerta → ventana.', uk: '1. Додай вікно навпроти дверей.\n2. Постав диван.\n3. Залиш вільний прохід двері → вікно.', ru: '1. Добавь окно напротив двери.\n2. Поставь диван.\n3. Оставь свободный проход дверь → окно.', ti: '1. ኣንጻር ማዕጾ መስኮት ወስኽ።\n2. ሶፋ ኣቐምጥ።\n3. ንጹር መንገዲ ማዕጾ → መስኮት ግደፍ።', fa: '۱. روبه‌روی در یک پنجره بگذار.\n۲. یک مبل بگذار.\n۳. یک مسیر باز در ← پنجره نگه دار.', 'fa-AF': '۱. روبه‌روی دروازه یک کلکین بگذار.\n۲. یک کوچ بگذار.\n۳. یک راه باز دروازه ← کلکین نگه دار.', ar: '1. أضف نافذة مقابل الباب.\n2. ضع أريكة.\n3. اترك ممراً خالياً باب ← نافذة.', rw: '1. Ongeraho idirishya riteganye n\'umuryango.\n2. Shyiramo intebe ndende.\n3. Siga inzira irimo ubusa umuryango → idirishya.' }),
  'ch.ch-openings.r1': g('Window shown as double-line wall break', { es: 'La ventana se ve como un corte de doble línea en la pared', cu: 'La ventana se ve como un corte de doble línea en la pared', uk: 'Вікно показано подвійною лінією в стіні', ru: 'Окно показано двойной линией в стене', ti: 'መስኮት ብድርብ መስመር ኣብ መንደቕ ይርአ', fa: 'پنجره با خط دوتایی در دیوار نشان داده شده', 'fa-AF': 'کلکین با خط دوتایی در دیوار نشان داده شده', ar: 'النافذة ظاهرة كقطع بخط مزدوج في الجدار', rw: 'Idirishya rigaragazwa n\'umurongo wikubye kabiri mu rukuta' }),
  'ch.ch-openings.r2': g('Furniture does not block the door swing', { es: 'Los muebles no tapan el giro de la puerta', cu: 'Los muebles no tapan el giro de la puerta', uk: 'Меблі не заважають дверям відчинятися', ru: 'Мебель не мешает двери открываться', ti: 'ኣቑሑ ምኽፋት ማዕጾ ኣይዓግቱን', fa: 'وسایل جلوی باز شدن در را نمی‌گیرند', 'fa-AF': 'سامان جلوی باز شدن دروازه را نمی‌گیرد', ar: 'الأثاث لا يعيق فتح الباب', rw: 'Ibikoresho ntibibuza umuryango gufunguka' }),
  'ch.ch-openings.r3': g('Clear straight-ish path door → window', { es: 'Camino libre y casi recto puerta → ventana', cu: 'Camino libre y casi recto puerta → ventana', uk: 'Вільний, майже прямий прохід двері → вікно', ru: 'Свободный, почти прямой проход дверь → окно', ti: 'ንጹርን ዳርጋ ቀጥታን መንገዲ ማዕጾ → መስኮት', fa: 'مسیر باز و تقریباً صاف در ← پنجره', 'fa-AF': 'راه باز و تقریباً مستقیم دروازه ← کلکین', ar: 'ممر خالٍ وشبه مستقيم باب ← نافذة', rw: 'Inzira irimo ubusa kandi igororotse umuryango → idirishya' }),
  'ch.C-ROOF-NAME.title': g('Name that roof', { es: 'Nombra ese techo', cu: 'Nombra ese techo', uk: 'Назви цей дах', ru: 'Назови эту крышу', ti: 'ነዚ ናሕሲ ሰምዮ', fa: 'این سقف را نام ببر', 'fa-AF': 'این بام را نام ببر', ar: 'سمِّ هذا السقف', rw: 'Vuga izina ry\'icyo gisenge' }),
  'ch.C-ROOF-NAME.prompt': g('1. Look at the roof the computer drew.\n2. Pick its real name: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(The computer drew it. You still name it.)', { es: '1. Mira el techo que dibujó la computadora.\n2. Elige su nombre real: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(La computadora lo dibujó. Tú lo nombras.)', cu: '1. Mira el techo que dibujó la computadora.\n2. Elige su nombre real: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(La computadora lo dibujó. Tú lo nombras.)', uk: '1. Подивись на дах, який намалював комп\'ютер.\n2. Вибери справжню назву: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(Комп\'ютер намалював. Назву даєш ти.)', ru: '1. Посмотри на крышу, которую нарисовал компьютер.\n2. Выбери настоящее название: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(Компьютер нарисовал. Название даёшь ты.)', ti: '1. ነቲ ኮምፒተር ዝሰኣሎ ናሕሲ ርአ።\n2. ሓቀኛ ስሙ ምረጽ፦ gable · hip · gambrel · shed · flat · mansard · grass · conical።\n(ኮምፒተር ሰኣሎ። ንስኻ ግን ትሰምዮ።)', fa: '۱. به سقفی که کامپیوتر کشیده نگاه کن.\n۲. نام واقعی‌اش را انتخاب کن: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(کامپیوتر کشیده. نامش را تو می‌گذاری.)', 'fa-AF': '۱. به بامی که کمپیوتر رسم کرده نگاه کن.\n۲. نام واقعی‌اش را انتخاب کن: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(کمپیوتر رسم کرده. نامش را تو می‌گذاری.)', ar: '1. انظر إلى السقف الذي رسمه الحاسوب.\n2. اختر اسمه الحقيقي: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(الحاسوب رسمه. أنت تسمّيه.)', rw: '1. Reba igisenge mudasobwa yashushanyije.\n2. Hitamo izina ryacyo nyaryo: gable · hip · gambrel · shed · flat · mansard · grass · conical.\n(Mudasobwa yagishushanyije. Ni wowe ukita izina.)' }),
  'ch.C-ROOF-NAME.r1': g('Correct roof id matches generated roof', { es: 'El nombre elegido coincide con el techo dibujado', cu: 'El nombre elegido coincide con el techo dibujado', uk: 'Вибрана назва збігається з намальованим дахом', ru: 'Выбранное название совпадает с нарисованной крышей', ti: 'ዝተመርጸ ስም ምስቲ ዝተሳእለ ናሕሲ ይሰማማዕ', fa: 'نام انتخاب‌شده با سقف کشیده‌شده جور است', 'fa-AF': 'نام انتخاب‌شده با بام رسم‌شده جور است', ar: 'الاسم المختار يطابق السقف المرسوم', rw: 'Izina wahisemo rihuye n\'igisenge cyashushanyijwe' }),
  'ch.C-ROOF-NAME.r2': g('Uses a real roof term (not “the pointy one”)', { es: 'Usa un término real de techo (no “el puntiagudo”)', cu: 'Usa un término real de techo (no “el puntiagudo”)', uk: 'Справжній термін даху (а не «гостренький»)', ru: 'Настоящий термин крыши (а не «остренькая»)', ti: 'ሓቀኛ ቃል ናሕሲ ይጥቀም (“እቲ ሹል” ኣይኮነን)', fa: 'از یک اصطلاح واقعی سقف استفاده می‌کند (نه «آن نوک‌تیز»)', 'fa-AF': 'از یک اصطلاح واقعی بام استفاده می‌کند (نه «آن نوک‌تیز»)', ar: 'يستخدم مصطلح سقف حقيقياً (لا «المدبّب»)', rw: 'Akoresha ijambo nyaryo ry\'igisenge (si “gisongoye”)' }),
  'ch.C-TINY-HOME-CONTEST.title': g('Tiny Home Contest', { es: 'Concurso de casa diminuta', cu: 'Concurso de casa diminuta', uk: 'Конкурс крихітного будинку', ru: 'Конкурс крошечного дома', ti: 'ውድድር ንእሽቶ ገዛ', fa: 'مسابقه خانه کوچک', 'fa-AF': 'مسابقه خانه کوچک', ar: 'مسابقة البيت الصغير', rw: 'Irushanwa ry\'inzu nto' }),
  'ch.C-TINY-HOME-CONTEST.prompt': g('1. Start from the Tiny Home template.\n2. Add a place to sleep.\n3. Add a place to cook.\n4. Add a bath.\n5. Add storage (closet).\n6. Add utility (washer or water heater).\n7. Keep walking paths (circulation) clear.\n8. Use Save file for the contest board.', { es: '1. Empieza con la plantilla Tiny Home.\n2. Agrega un lugar para dormir.\n3. Agrega un lugar para cocinar.\n4. Agrega un baño.\n5. Agrega almacén (clóset).\n6. Agrega servicio (lavadora o calentador).\n7. Deja libres los caminos (circulación).\n8. Usa Guardar archivo para el tablero del concurso.', cu: '1. Empieza con la plantilla Tiny Home.\n2. Agrega un lugar para dormir.\n3. Agrega un lugar para cocinar.\n4. Agrega un baño.\n5. Agrega almacén (clóset).\n6. Agrega servicio (lavadora o calentador).\n7. Deja libres los caminos (circulación).\n8. Usa Guardar archivo para el tablero del concurso.', uk: '1. Почни з шаблону Tiny Home.\n2. Додай місце для сну.\n3. Додай місце, щоб готувати.\n4. Додай ванну.\n5. Додай місце для речей (шафу).\n6. Додай господарське (пральну машину чи бойлер).\n7. Тримай проходи (циркуляцію) вільними.\n8. Збережи файл для конкурсної дошки.', ru: '1. Начни с шаблона Tiny Home.\n2. Добавь место для сна.\n3. Добавь место, чтобы готовить.\n4. Добавь ванную.\n5. Добавь место для вещей (шкаф).\n6. Добавь подсобку (стиральную машину или бойлер).\n7. Держи проходы (циркуляцию) свободными.\n8. Сохрани файл для конкурсной доски.', ti: '1. ካብ ቅጥዒ Tiny Home ጀምር።\n2. ቦታ ምድቃስ ወስኽ።\n3. ቦታ ምብሳል ወስኽ።\n4. ባኞ ወስኽ።\n5. መኽዘን (ቁም ሳጹን) ወስኽ።\n6. ኣገልግሎት (መሕጸቢ ክዳን ወይ መውዓዪ ማይ) ወስኽ።\n7. መንገድታት ምንቅስቓስ ንጹር ግበር።\n8. ንሰሌዳ ውድድር ፋይል ዕቅብ።', fa: '۱. با قالب Tiny Home شروع کن.\n۲. جایی برای خواب اضافه کن.\n۳. جایی برای آشپزی اضافه کن.\n۴. حمام اضافه کن.\n۵. انباری (کمد) اضافه کن.\n۶. خدمات (لباسشویی یا آبگرمکن) اضافه کن.\n۷. مسیرهای رفت‌وآمد را باز نگه دار.\n۸. برای تابلوی مسابقه فایل را ذخیره کن.', 'fa-AF': '۱. با قالب Tiny Home شروع کن.\n۲. جایی برای خواب اضافه کن.\n۳. جایی برای پخت‌وپز اضافه کن.\n۴. تشناب اضافه کن.\n۵. گدام (الماری) اضافه کن.\n۶. خدمات (کالاشویی یا آبگرمی) اضافه کن.\n۷. راه‌های رفت‌وآمد را باز نگه دار.\n۸. برای تخته مسابقه فایل را ذخیره کن.', ar: '1. ابدأ من قالب Tiny Home.\n2. أضف مكاناً للنوم.\n3. أضف مكاناً للطبخ.\n4. أضف حماماً.\n5. أضف تخزيناً (خزانة).\n6. أضف خدمات (غسالة أو سخان ماء).\n7. أبقِ ممرات الحركة خالية.\n8. احفظ الملف للوحة المسابقة.', rw: '1. Tangirira ku cyitegererezo cya Tiny Home.\n2. Ongeraho aho kuryama.\n3. Ongeraho aho guteka.\n4. Ongeraho ubwiherero.\n5. Ongeraho ububiko (akabati).\n6. Ongeraho aho kumesera (imashini imesa cyangwa icyuma gishyushya amazi).\n7. Siga inzira z\'urujya n\'uruza zirimo ubusa.\n8. Bika dosiye ku kibaho cy\'irushanwa.' }),
  'ch.C-TINY-HOME-CONTEST.r1': g('Sleep + kitchen + bath present', { es: 'Hay dormitorio + cocina + baño', cu: 'Hay dormitorio + cocina + baño', uk: 'Є місце для сну + кухня + ванна', ru: 'Есть место для сна + кухня + ванная', ti: 'መደቀሲ + ክሽነ + ባኞ ኣለዉ', fa: 'خواب + آشپزخانه + حمام هست', 'fa-AF': 'خواب + آشپزخانه + تشناب هست', ar: 'يوجد نوم + مطبخ + حمام', rw: 'Hari aho kuryama + igikoni + ubwiherero' }),
  'ch.C-TINY-HOME-CONTEST.r2': g('Storage or closet placed', { es: 'Hay almacén o clóset', cu: 'Hay almacén o clóset', uk: 'Є місце для речей або шафа', ru: 'Есть место для вещей или шкаф', ti: 'መኽዘን ወይ ቁም ሳጹን ተቐሚጡ', fa: 'انباری یا کمد گذاشته شده', 'fa-AF': 'گدام یا الماری گذاشته شده', ar: 'يوجد تخزين أو خزانة', rw: 'Ububiko cyangwa akabati byashyizweho' }),
  'ch.C-TINY-HOME-CONTEST.r3': g('Utility item (washer / water heater / mech) present', { es: 'Hay servicio (lavadora / calentador / máquinas)', cu: 'Hay servicio (lavadora / calentador / máquinas)', uk: 'Є господарське (пральна машина / бойлер / техшафа)', ru: 'Есть подсобное (стиральная машина / бойлер / техшкаф)', ti: 'ኣቕሓ ኣገልግሎት (መሕጸቢ / መውዓዪ ማይ / መካኒክ) ኣሎ', fa: 'وسیله خدماتی (لباسشویی / آبگرمکن / تأسیسات) هست', 'fa-AF': 'سامان خدماتی (کالاشویی / آبگرمی / تأسیسات) هست', ar: 'يوجد عنصر خدمات (غسالة / سخان / أجهزة)', rw: 'Hari igikoresho cyo kumesera (imashini / icyuma gishyushya amazi / imashini)' }),
  'ch.C-DOG-HOUSE-CONTEST.title': g('Best Dog House Contest', { es: 'Concurso de la mejor casita de perro', cu: 'Concurso de la mejor casita de perro', uk: 'Конкурс найкращої будки', ru: 'Конкурс лучшей будки', ti: 'ውድድር ዝበለጸ ገዛ ከልቢ', fa: 'مسابقه بهترین لانه سگ', 'fa-AF': 'مسابقه بهترین خانه سگ', ar: 'مسابقة أفضل بيت كلب', rw: 'Irushanwa ry\'inzu y\'imbwa nziza' }),
  'ch.C-DOG-HOUSE-CONTEST.prompt': g('1. New → Dog House.\n2. Sketch a snug den, then Trace or Wall until it closes.\n3. One door: tap it and pick 12" or 18" — not a people door.\n4. Slide the door off-center so wind misses the bed.\n5. Keep a gable or shed roof.\n6. Label two walls. Plant a tree for shade.\n7. Open Contest — Baboo judges from the textbook list.', { es: '1. Nuevo → Dog House.\n2. Dibuja una guarida cómoda y luego Traza o usa Pared hasta cerrarla.\n3. Una puerta: tócala y elige 12" o 18", no una puerta de personas.\n4. Mueve la puerta fuera del centro para que el viento no llegue a la cama.\n5. Usa un techo gable o shed.\n6. Mide dos paredes. Planta un árbol para dar sombra.\n7. Abre Concurso: Baboo juzga con la lista del libro.', cu: '1. Nuevo → Dog House.\n2. Dibuja una guarida cómoda y luego Traza o usa Pared hasta cerrarla.\n3. Una puerta: tócala y elige 12" o 18", no una puerta de personas.\n4. Mueve la puerta fuera del centro para que el viento no llegue a la cama.\n5. Usa un techo gable o shed.\n6. Mide dos paredes. Planta un árbol para dar sombra.\n7. Abre Concurso: Baboo juzga con la lista del libro.', uk: '1. Новий → Dog House.\n2. Намалюй затишне лігво, потім Обвести або Стіна, доки не замкнеться.\n3. Одні двері: торкнись і вибери 12" або 18" — не людські двері.\n4. Зсунь двері від центру, щоб вітер не діставав лежанку.\n5. Залиш дах gable або shed.\n6. Підпиши дві стіни. Посади дерево для тіні.\n7. Відкрий Конкурс — Baboo оцінює за списком із підручника.', ru: '1. Новый → Dog House.\n2. Нарисуй уютное логово, потом Обвести или Стена, пока не замкнётся.\n3. Одна дверь: нажми и выбери 12" или 18" — не дверь для людей.\n4. Сдвинь дверь от центра, чтобы ветер не доставал лежанку.\n5. Оставь крышу gable или shed.\n6. Подпиши две стены. Посади дерево для тени.\n7. Открой Конкурс — Baboo оценивает по списку из учебника.', ti: '1. ሓድሽ → Dog House።\n2. ምቹእ በዓቲ ስኣል፣ ድሕሪኡ ክሳዕ ዝዕጾ ስዓብ ወይ መንደቕ።\n3. ሓደ ማዕጾ፦ ጠውቖ እሞ 12" ወይ 18" ምረጽ — ማዕጾ ሰባት ኣይኮነን።\n4. ንፋስ ናብ መደቀሲ ከይበጽሕ ማዕጾ ካብ ማእከል ኣግልሶ።\n5. ናሕሲ gable ወይ shed ሓዝ።\n6. ክልተ መናድቕ ምልክት ግበር። ንጽላል ኦም ትኸል።\n7. ውድድር ክፈት — Baboo ብዝርዝር መጽሓፍ ትፈርድ።', fa: '۱. جدید ← Dog House.\n۲. یک لانه دنج طرح بزن، بعد دنبال کن یا دیوار بکش تا بسته شود.\n۳. یک در: آن را بزن و 12" یا 18" انتخاب کن — نه در آدم‌ها.\n۴. در را از وسط کنار بکش تا باد به جای خواب نرسد.\n۵. سقف gable یا shed نگه دار.\n۶. دو دیوار را برچسب بزن. برای سایه درخت بکار.\n۷. مسابقه را باز کن — Baboo از روی فهرست کتاب داوری می‌کند.', 'fa-AF': '۱. جدید ← Dog House.\n۲. یک لانه گرم طرح بزن، بعد دنبال کن یا دیوار رسم کن تا بسته شود.\n۳. یک دروازه: آن را بزن و 12" یا 18" انتخاب کن — نه دروازه مردم.\n۴. دروازه را از وسط کنار بکش تا باد به جای خواب نرسد.\n۵. بام gable یا shed نگه دار.\n۶. دو دیوار را برچسپ بزن. برای سایه درخت بنشان.\n۷. مسابقه را باز کن — Baboo از روی فهرست کتاب داوری می‌کند.', ar: '1. جديد ← Dog House.\n2. ارسم وكراً دافئاً، ثم شفّف أو استخدم الجدار حتى ينغلق.\n3. باب واحد: المسه واختر 12" أو 18" — ليس باب بشر.\n4. حرّك الباب عن المنتصف كي لا تصل الريح إلى الفراش.\n5. أبقِ سقف gable أو shed.\n6. سمِّ مقاس جدارين. ازرع شجرة للظل.\n7. افتح المسابقة — يحكم Baboo من قائمة الكتاب.', rw: '1. Gishya → Dog House.\n2. Shushanya icyari cyiza, hanyuma Kurikiza cyangwa Urukuta kugeza gifunze.\n3. Umuryango umwe: uwukande uhitemo 12" cyangwa 18" — si umuryango w\'abantu.\n4. Imura umuryango uve hagati kugira ngo umuyaga utagera ku buriri.\n5. Gumana igisenge cya gable cyangwa shed.\n6. Andika ingano ku nkuta ebyiri. Tera igiti cy\'igicucu.\n7. Fungura Irushanwa — Baboo isuzuma ikoresheje urutonde rw\'igitabo.' }),
  'ch.C-DOG-HOUSE-CONTEST.r1': g('Closed den about 8–18 sq ft (body heat, not a bedroom)', { es: 'Guarida cerrada de unos 8–18 pies² (calor del cuerpo, no un dormitorio)', cu: 'Guarida cerrada de unos 8–18 pies² (calor del cuerpo, no un dormitorio)', uk: 'Замкнене лігво близько 8–18 кв. футів (тепло тіла, не спальня)', ru: 'Замкнутое логово около 8–18 кв. футов (тепло тела, не спальня)', ti: 'ዝተዓጽወ በዓቲ ኣስታት 8–18 sq ft (ሙቐት ኣካል፣ መደቀሲ ኣይኮነን)', fa: 'لانه بسته حدود ۸ تا ۱۸ فوت مربع (گرمای بدن، نه اتاق خواب)', 'fa-AF': 'لانه بسته حدود ۸ تا ۱۸ فت مربع (گرمی بدن، نه اتاق خواب)', ar: 'وكر مغلق بنحو 8–18 قدماً مربعاً (حرارة الجسم، لا غرفة نوم)', rw: 'Icyari gifunze cya hafi 8–18 sq ft (ubushyuhe bw\'umubiri, si icyumba cyo kuraramo)' }),
  'ch.C-DOG-HOUSE-CONTEST.r2': g('One 12–18" door, offset from center', { es: 'Una puerta de 12–18", fuera del centro', cu: 'Una puerta de 12–18", fuera del centro', uk: 'Одні двері 12–18", збоку від центру', ru: 'Одна дверь 12–18", в стороне от центра', ti: 'ሓደ ማዕጾ 12–18"፣ ካብ ማእከል ርሒቑ', fa: 'یک در 12 تا 18 اینچ، کنار از وسط', 'fa-AF': 'یک دروازه 12 تا 18 اینچ، کنار از وسط', ar: 'باب واحد 12–18"، بعيد عن المنتصف', rw: 'Umuryango umwe wa 12–18", utari hagati' }),
  'ch.C-DOG-HOUSE-CONTEST.r3': g('Pitched roof + size labels + shade tree', { es: 'Techo inclinado + etiquetas de medida + árbol de sombra', cu: 'Techo inclinado + etiquetas de medida + árbol de sombra', uk: 'Похилий дах + підписи розмірів + дерево для тіні', ru: 'Скатная крыша + подписи размеров + дерево для тени', ti: 'ዝዘንበለ ናሕሲ + ምልክታት ዓቐን + ኦም ጽላል', fa: 'سقف شیب‌دار + برچسب اندازه + درخت سایه', 'fa-AF': 'بام شیب‌دار + برچسپ اندازه + درخت سایه', ar: 'سقف مائل + تسميات مقاس + شجرة ظل', rw: 'Igisenge gihengamye + ibirango by\'ingano + igiti cy\'igicucu' }),
  'ch.C-BRIEF.title': g('Challenge — Name the rooms', { es: 'Reto — Nombra los cuartos', cu: 'Reto — Nombra los cuartos', uk: 'Виклик — Назви кімнати', ru: 'Задание — Назови комнаты', ti: 'ብድሆ — ክፍልታት ሰምይ', fa: 'چالش — اتاق‌ها را نام‌گذاری کن', 'fa-AF': 'چالش — اتاق‌ها را نام‌گذاری کن', ar: 'تحدٍّ — سمِّ الغرف', rw: 'Ikigeragezo — Ita ibyumba amazina' }),
  'ch.C-BRIEF.prompt': g('1. Draw interior walls to split spaces.\n2. Room tool → pick Kitchen, Bath, Living…\n3. Click inside each closed space.\n4. Read the square-foot label. Does the size feel right?', { es: '1. Dibuja paredes interiores para dividir espacios.\n2. Herramienta Cuarto → elige Cocina, Baño, Sala…\n3. Haz clic dentro de cada espacio cerrado.\n4. Lee la etiqueta de pies². ¿El tamaño se siente bien?', cu: '1. Dibuja paredes interiores para dividir espacios.\n2. Herramienta Cuarto → elige Cocina, Baño, Sala…\n3. Haz clic dentro de cada espacio cerrado.\n4. Lee la etiqueta de pies². ¿El tamaño se siente bien?', uk: '1. Намалюй внутрішні стіни, щоб поділити простір.\n2. Інструмент Кімната → вибери Кухня, Ванна, Вітальня…\n3. Клацни всередині кожного замкненого простору.\n4. Прочитай підпис площі. Чи розмір здається правильним?', ru: '1. Нарисуй внутренние стены, чтобы разделить пространство.\n2. Инструмент Комната → выбери Кухня, Ванная, Гостиная…\n3. Щёлкни внутри каждого замкнутого пространства.\n4. Прочитай подпись площади. Размер кажется правильным?', ti: '1. ቦታታት ንምምቃል ውሽጣዊ መናድቕ ስኣል።\n2. መሳርሒ ክፍሊ → ክሽነ፣ ባኞ፣ መሕደሪ… ምረጽ።\n3. ኣብ ውሽጢ ነፍሲ ወከፍ ዝተዓጽወ ቦታ ጠውቕ።\n4. ምልክት ስፍሓት ኣንብብ። እቲ ዓቐን ቅኑዕ ይመስል ዶ?', fa: '۱. برای جدا کردن فضاها دیوار داخلی بکش.\n۲. ابزار اتاق ← آشپزخانه، حمام، نشیمن… را انتخاب کن.\n۳. داخل هر فضای بسته کلیک کن.\n۴. برچسب فوت مربع را بخوان. اندازه درست به نظر می‌رسد؟', 'fa-AF': '۱. برای جدا کردن فضاها دیوار داخلی رسم کن.\n۲. ابزار اتاق ← آشپزخانه، تشناب، نشیمن… را انتخاب کن.\n۳. داخل هر فضای بسته کلیک کن.\n۴. برچسپ فت مربع را بخوان. اندازه درست به نظر می‌رسد؟', ar: '1. ارسم جدراناً داخلية لتقسيم المساحات.\n2. أداة الغرفة ← اختر مطبخ، حمام، معيشة…\n3. انقر داخل كل مساحة مغلقة.\n4. اقرأ تسمية القدم المربع. هل يبدو الحجم صحيحاً؟', rw: '1. Shushanya inkuta z\'imbere ngo ugabanye ahantu.\n2. Igikoresho cy\'Icyumba → hitamo Igikoni, Ubwiherero, Uruganiriro…\n3. Kanda imbere muri buri hantu hafunze.\n4. Soma ikirango cy\'ubuso. Ingano isa neza?' }),
  'ch.C-BRIEF.r1': g('At least two named rooms', { es: 'Al menos dos cuartos con nombre', cu: 'Al menos dos cuartos con nombre', uk: 'Щонайменше дві названі кімнати', ru: 'Минимум две названные комнаты', ti: 'ብውሑዱ ክልተ ዝተሰምዩ ክፍልታት', fa: 'دست‌کم دو اتاق نام‌گذاری‌شده', 'fa-AF': 'دست‌کم دو اتاق نام‌گذاری‌شده', ar: 'غرفتان مسمّاتان على الأقل', rw: 'Nibura ibyumba bibiri bifite amazina' }),
  'ch.C-BRIEF.r2': g('Kitchen or living tagged', { es: 'Cocina o sala con nombre', cu: 'Cocina o sala con nombre', uk: 'Позначено кухню або вітальню', ru: 'Отмечена кухня или гостиная', ti: 'ክሽነ ወይ መሕደሪ ተሰምዩ', fa: 'آشپزخانه یا نشیمن نام‌گذاری شده', 'fa-AF': 'آشپزخانه یا نشیمن نام‌گذاری شده', ar: 'المطبخ أو المعيشة مسمّى', rw: 'Igikoni cyangwa uruganiriro bifite izina' }),
  'ch.C-BRIEF.r3': g('Each room shows a real area (sq ft)', { es: 'Cada cuarto muestra un área real (pies²)', cu: 'Cada cuarto muestra un área real (pies²)', uk: 'Кожна кімната показує справжню площу (кв. фути)', ru: 'Каждая комната показывает настоящую площадь (кв. футы)', ti: 'ነፍሲ ወከፍ ክፍሊ ሓቀኛ ስፍሓት የርኢ (sq ft)', fa: 'هر اتاق مساحت واقعی نشان می‌دهد (فوت مربع)', 'fa-AF': 'هر اتاق مساحت واقعی نشان می‌دهد (فت مربع)', ar: 'كل غرفة تُظهر مساحة حقيقية (قدم مربع)', rw: 'Buri cyumba kigaragaza ubuso nyabwo (sq ft)' }),
  // 2.13.52: Teach panel lesson steps and reflections. ti, fa-AF and rw are UNCHECKED native copy.
  'news.teachWords': g('The Teach panel’s plan reading, unit steps and reflections are in your language.', { es: 'La lectura del plano, los pasos de la unidad y las reflexiones del panel Enseñar están en tu idioma.', cu: 'La lectura del plano, los pasos de la unidad y las reflexiones del panel Enseñar están en tu idioma.', uk: 'Читання плану, кроки розділу й роздуми в панелі Навчання — твоєю мовою.', ru: 'Чтение плана, шаги раздела и размышления в панели Обучение — на твоём языке.', ti: 'ምንባብ ትልሚ፣ ስጉምትታት ክፋልን ሓሳባትን ኣብ መምሃሪ ፓነል ብቋንቋኻ እዮም።', fa: 'خواندن نقشه، گام‌های واحد و تأمل‌های پنل آموزش به زبان تو هستند.', 'fa-AF': 'خواندن نقشه، گام‌های واحد و تأمل‌های پنل آموزش به زبان تو هستند.', ar: 'قراءة المخطط وخطوات الوحدة والتأملات في لوحة التعليم بلغتك.', rw: 'Gusoma igishushanyo, intambwe z\'isomo n\'ibitekerezo mu kanama ko Kwigisha biri mu rurimi rwawe.' }),
  'teach.u1.s1': g('Tap Snap, Straight, and Wall snap on the plan. They stay on.', { es: 'Toca Ajustar, Recto y Ajuste a pared en el plano. Se quedan activos.', cu: 'Toca Ajustar, Recto y Ajuste a pared en el plano. Se quedan activos.', uk: 'Увімкни Прилипання, Прямо й Прилипання до стін на плані. Вони залишаться ввімкненими.', ru: 'Включи Привязку, Прямо и Привязку к стенам на плане. Они останутся включёнными.', ti: 'ኣብ ትልሚ ምልጋብ፣ ቀጥታን ምልጋብ መንደቕን ጠውቕ። ተወሊዖም ይጸንሑ።', fa: 'روی نقشه چسبیدن، صاف و چسبیدن به دیوار را بزن. روشن می‌مانند.', 'fa-AF': 'روی نقشه چسپیدن، مستقیم و چسپیدن به دیوار را بزن. روشن می‌مانند.', ar: 'اضغط الالتقاط والاستقامة والالتقاط بالجدار في المخطط. تبقى مفعّلة.', rw: 'Kanda Gufatira, Kugorora no Gufatira ku rukuta ku gishushanyo. Biguma bikora.' }),
  'teach.u1.s2': g('Sketch the rooms first — Tools → Sketch, then drag like a pencil.', { es: 'Primero dibuja los cuartos: Herramientas → Boceto, y arrastra como un lápiz.', cu: 'Primero dibuja los cuartos: Herramientas → Boceto, y arrastra como un lápiz.', uk: 'Спершу намалюй кімнати — Інструменти → Ескіз, і тягни, як олівцем.', ru: 'Сначала нарисуй комнаты — Инструменты → Эскиз, и тяни, как карандашом.', ti: 'ቅድም ክፍልታት ስኣል — መሳርሒታት → ንድፊ፣ ድሕሪኡ ከም ርሳስ ስሓብ።', fa: 'اول اتاق‌ها را طرح بزن — ابزارها ← طرح، بعد مثل مداد بکش.', 'fa-AF': 'اول اتاق‌ها را طرح بزن — ابزارها ← طرح، بعد مثل پنسل بکش.', ar: 'ارسم الغرف أولاً — الأدوات ← رسم حر، ثم اسحب مثل القلم.', rw: 'Banza ushushanye ibyumba — Ibikoresho → Igishushanyo, hanyuma ukurure nk\'ikaramu.' }),
  'teach.u1.s3': g('Tap the sketch → Trace, or draw the outside walls with two clicks.', { es: 'Toca el boceto → Trazar, o dibuja las paredes exteriores con dos clics.', cu: 'Toca el boceto → Trazar, o dibuja las paredes exteriores con dos clics.', uk: 'Торкнись ескізу → Обвести, або намалюй зовнішні стіни двома клацаннями.', ru: 'Нажми на эскиз → Обвести, или нарисуй наружные стены двумя щелчками.', ti: 'ንድፊ ጠውቕ → ስዓብ፣ ወይ ደገውቲ መናድቕ ብክልተ ጠውቕ ስኣል።', fa: 'طرح را بزن ← دنبال کن، یا دیوارهای بیرونی را با دو کلیک بکش.', 'fa-AF': 'طرح را بزن ← دنبال کن، یا دیوارهای بیرونی را با دو کلیک رسم کن.', ar: 'المس الرسم ← شفّف، أو ارسم الجدران الخارجية بنقرتين.', rw: 'Kanda ku gishushanyo → Kurikiza, cyangwa ushushanye inkuta zo hanze ukanze kabiri.' }),
  'teach.u1.s4': g('Place one door.', { es: 'Pon una puerta.', cu: 'Pon una puerta.', uk: 'Постав одні двері.', ru: 'Поставь одну дверь.', ti: 'ሓደ ማዕጾ ኣቐምጥ።', fa: 'یک در بگذار.', 'fa-AF': 'یک دروازه بگذار.', ar: 'ضع باباً واحداً.', rw: 'Shyiraho umuryango umwe.' }),
  'teach.u1.s5': g('Place one window.', { es: 'Pon una ventana.', cu: 'Pon una ventana.', uk: 'Постав одне вікно.', ru: 'Поставь одно окно.', ti: 'ሓደ መስኮት ኣቐምጥ።', fa: 'یک پنجره بگذار.', 'fa-AF': 'یک کلکین بگذار.', ar: 'ضع نافذة واحدة.', rw: 'Shyiraho idirishya rimwe.' }),
  'teach.u1.s6': g('Look at the size labels. Do they look right?', { es: 'Mira las etiquetas de medida. ¿Se ven bien?', cu: 'Mira las etiquetas de medida. ¿Se ven bien?', uk: 'Подивись на підписи розмірів. Чи вони правильні?', ru: 'Посмотри на подписи размеров. Они правильные?', ti: 'ምልክታት ዓቐን ርአ። ቅኑዓት ይመስሉ ዶ?', fa: 'به برچسب‌های اندازه نگاه کن. درست به نظر می‌رسند؟', 'fa-AF': 'به برچسپ‌های اندازه نگاه کن. درست به نظر می‌رسند؟', ar: 'انظر إلى تسميات المقاس. هل تبدو صحيحة؟', rw: 'Reba ibirango by\'ingano. Birasa neza?' }),
  'teach.u1.s7': g('Name your roof. Tap Roof on the plan and pick a real word: gable, hip, grass, or conical.', { es: 'Nombra tu techo. Toca Techo en el plano y elige una palabra real: gable, hip, grass o conical.', cu: 'Nombra tu techo. Toca Techo en el plano y elige una palabra real: gable, hip, grass o conical.', uk: 'Назви свій дах. Торкнись Дах на плані й вибери справжнє слово: gable, hip, grass чи conical.', ru: 'Назови свою крышу. Нажми Крыша на плане и выбери настоящее слово: gable, hip, grass или conical.', ti: 'ናሕስኻ ሰምዮ። ኣብ ትልሚ ናሕሲ ጠውቕ እሞ ሓቀኛ ቃል ምረጽ፦ gable፣ hip፣ grass ወይ conical።', fa: 'سقفت را نام‌گذاری کن. روی سقف در نقشه بزن و یک واژه واقعی انتخاب کن: gable، hip، grass یا conical.', 'fa-AF': 'بامت را نام‌گذاری کن. روی بام در نقشه بزن و یک واژه واقعی انتخاب کن: gable، hip، grass یا conical.', ar: 'سمِّ سقفك. اضغط السقف في المخطط واختر كلمة حقيقية: gable أو hip أو grass أو conical.', rw: 'Ita igisenge cyawe izina. Kanda Igisenge ku gishushanyo uhitemo ijambo nyaryo: gable, hip, grass cyangwa conical.' }),
  'teach.u1.s8': g('Name the room. Room tool → pick a type → click inside the walls.', { es: 'Nombra el cuarto. Herramienta Cuarto → elige un tipo → haz clic dentro de las paredes.', cu: 'Nombra el cuarto. Herramienta Cuarto → elige un tipo → haz clic dentro de las paredes.', uk: 'Назви кімнату. Інструмент Кімната → вибери тип → клацни всередині стін.', ru: 'Назови комнату. Инструмент Комната → выбери тип → щёлкни внутри стен.', ti: 'ክፍሊ ሰምዮ። መሳርሒ ክፍሊ → ዓይነት ምረጽ → ኣብ ውሽጢ መናድቕ ጠውቕ።', fa: 'اتاق را نام‌گذاری کن. ابزار اتاق ← نوع را انتخاب کن ← داخل دیوارها کلیک کن.', 'fa-AF': 'اتاق را نام‌گذاری کن. ابزار اتاق ← نوع را انتخاب کن ← داخل دیوارها کلیک کن.', ar: 'سمِّ الغرفة. أداة الغرفة ← اختر نوعاً ← انقر داخل الجدران.', rw: 'Ita icyumba izina. Igikoresho cy\'Icyumba → hitamo ubwoko → kanda imbere mu nkuta.' }),
  'teach.u1.done': g('Closed room · named · door · window · clear sizes · roof named.', { es: 'Cuarto cerrado · con nombre · puerta · ventana · medidas claras · techo con nombre.', cu: 'Cuarto cerrado · con nombre · puerta · ventana · medidas claras · techo con nombre.', uk: 'Замкнена кімната · названа · двері · вікно · чіткі розміри · дах названо.', ru: 'Замкнутая комната · названа · дверь · окно · чёткие размеры · крыша названа.', ti: 'ዝተዓጽወ ክፍሊ · ተሰምዩ · ማዕጾ · መስኮት · ንጹር ዓቐን · ናሕሲ ተሰምዩ።', fa: 'اتاق بسته · نام‌گذاری‌شده · در · پنجره · اندازه‌های روشن · سقف نام‌گذاری‌شده.', 'fa-AF': 'اتاق بسته · نام‌گذاری‌شده · دروازه · کلکین · اندازه‌های روشن · بام نام‌گذاری‌شده.', ar: 'غرفة مغلقة · مسمّاة · باب · نافذة · مقاسات واضحة · سقف مسمّى.', rw: 'Icyumba gifunze · gifite izina · umuryango · idirishya · ingano zigaragara · igisenge gifite izina.' }),
  'teach.nov.s1': g('Tap Sketch on the left. Drag on the grid like a pencil.', { es: 'Toca Boceto a la izquierda. Arrastra en la cuadrícula como un lápiz.', cu: 'Toca Boceto a la izquierda. Arrastra en la cuadrícula como un lápiz.', uk: 'Торкнись Ескіз ліворуч. Тягни по сітці, як олівцем.', ru: 'Нажми Эскиз слева. Тяни по сетке, как карандашом.', ti: 'ኣብ ጸጋም ንድፊ ጠውቕ። ኣብ መርበብ ከም ርሳስ ስሓብ።', fa: 'در سمت چپ طرح را بزن. روی شبکه مثل مداد بکش.', 'fa-AF': 'در سمت چپ طرح را بزن. روی شبکه مثل پنسل بکش.', ar: 'اضغط الرسم الحر على اليسار. اسحب على الشبكة مثل القلم.', rw: 'Kanda Igishushanyo ibumoso. Kurura ku rusobe nk\'ikaramu.' }),
  'teach.nov.s2': g('Tap Trace on the card. Or pick Wall and hard-line over the pencil.', { es: 'Toca Trazar en la tarjeta. O elige Pared y repasa el lápiz con línea firme.', cu: 'Toca Trazar en la tarjeta. O elige Pared y repasa el lápiz con línea firme.', uk: 'Торкнись Обвести на картці. Або вибери Стіна й обведи олівець твердою лінією.', ru: 'Нажми Обвести на карточке. Или выбери Стена и обведи карандаш твёрдой линией.', ti: 'ኣብ ካርድ ስዓብ ጠውቕ። ወይ መንደቕ ምረጽ እሞ ኣብ ልዕሊ ርሳስ ጽኑዕ መስመር ስኣል።', fa: 'روی کارت دنبال کن را بزن. یا دیوار را انتخاب کن و روی مداد خط محکم بکش.', 'fa-AF': 'روی کارت دنبال کن را بزن. یا دیوار را انتخاب کن و روی پنسل خط محکم بکش.', ar: 'اضغط شفّف على البطاقة. أو اختر الجدار وارسم خطاً ثابتاً فوق القلم.', rw: 'Kanda Kurikiza ku ikarita. Cyangwa uhitemo Urukuta ucishe umurongo ukomeye hejuru y\'ikaramu.' }),
  'teach.nov.s3': g('Pick Door. Click on one wall so we can walk in.', { es: 'Elige Puerta. Haz clic en una pared para poder entrar.', cu: 'Elige Puerta. Haz clic en una pared para poder entrar.', uk: 'Вибери Двері. Клацни по стіні, щоб можна було зайти.', ru: 'Выбери Дверь. Щёлкни по стене, чтобы можно было войти.', ti: 'ማዕጾ ምረጽ። ክንኣቱ ኣብ ሓደ መንደቕ ጠውቕ።', fa: 'در را انتخاب کن. روی یک دیوار کلیک کن تا بشود وارد شد.', 'fa-AF': 'دروازه را انتخاب کن. روی یک دیوار کلیک کن تا بشود داخل شد.', ar: 'اختر الباب. انقر على جدار لنتمكن من الدخول.', rw: 'Hitamo Umuryango. Kanda ku rukuta rumwe kugira ngo twinjire.' }),
  'teach.nov.s4': g('Read the size labels. Do they feel like a real room?', { es: 'Lee las etiquetas de medida. ¿Parece un cuarto real?', cu: 'Lee las etiquetas de medida. ¿Parece un cuarto real?', uk: 'Прочитай підписи розмірів. Чи схоже це на справжню кімнату?', ru: 'Прочитай подписи размеров. Похоже на настоящую комнату?', ti: 'ምልክታት ዓቐን ኣንብብ። ከም ሓቀኛ ክፍሊ ይስምዑ ዶ?', fa: 'برچسب‌های اندازه را بخوان. شبیه یک اتاق واقعی است؟', 'fa-AF': 'برچسپ‌های اندازه را بخوان. شبیه یک اتاق واقعی است؟', ar: 'اقرأ تسميات المقاس. هل تبدو كغرفة حقيقية؟', rw: 'Soma ibirango by\'ingano. Birasa n\'icyumba nyacyo?' }),
  'teach.dog.s1': g('Sketch the den first. Tools → Sketch, then drag.', { es: 'Primero dibuja la guarida. Herramientas → Boceto, y arrastra.', cu: 'Primero dibuja la guarida. Herramientas → Boceto, y arrastra.', uk: 'Спершу намалюй лігво. Інструменти → Ескіз, потім тягни.', ru: 'Сначала нарисуй логово. Инструменты → Эскиз, потом тяни.', ti: 'ቅድም በዓቲ ስኣል። መሳርሒታት → ንድፊ፣ ድሕሪኡ ስሓብ።', fa: 'اول لانه را طرح بزن. ابزارها ← طرح، بعد بکش.', 'fa-AF': 'اول لانه را طرح بزن. ابزارها ← طرح، بعد بکش.', ar: 'ارسم الوكر أولاً. الأدوات ← رسم حر، ثم اسحب.', rw: 'Banza ushushanye icyari. Ibikoresho → Igishushanyo, hanyuma ukurure.' }),
  'teach.dog.s2': g('Trace or hard-line walls. Close the box.', { es: 'Traza o dibuja paredes firmes. Cierra la caja.', cu: 'Traza o dibuja paredes firmes. Cierra la caja.', uk: 'Обведи або намалюй стіни твердою лінією. Замкни коробку.', ru: 'Обведи или нарисуй стены твёрдой линией. Замкни коробку.', ti: 'ስዓብ ወይ ጽኑዕ መናድቕ ስኣል። ነቲ ሳጹን ዕጸዎ።', fa: 'دنبال کن یا دیوارها را محکم بکش. جعبه را ببند.', 'fa-AF': 'دنبال کن یا دیوارها را محکم رسم کن. صندوق را ببند.', ar: 'شفّف أو ارسم جدراناً ثابتة. أغلق الصندوق.', rw: 'Kurikiza cyangwa ushushanye inkuta zikomeye. Funga agasanduku.' }),
  'teach.dog.s3': g('One door. Tap it and pick 12" or 18" — dogs are not 3 feet wide.', { es: 'Una puerta. Tócala y elige 12" o 18": los perros no miden 3 pies de ancho.', cu: 'Una puerta. Tócala y elige 12" o 18": los perros no miden 3 pies de ancho.', uk: 'Одні двері. Торкнись і вибери 12" або 18" — пси не завширшки 3 фути.', ru: 'Одна дверь. Нажми и выбери 12" или 18" — собаки не шириной 3 фута.', ti: 'ሓደ ማዕጾ። ጠውቖ እሞ 12" ወይ 18" ምረጽ — ኣኽላባት 3 ጫማ ስፍሓት የብሎምን።', fa: 'یک در. آن را بزن و 12" یا 18" را انتخاب کن — سگ‌ها ۳ فوت پهنا ندارند.', 'fa-AF': 'یک دروازه. آن را بزن و 12" یا 18" را انتخاب کن — سگ‌ها ۳ فت پهنا ندارند.', ar: 'باب واحد. المسه واختر 12" أو 18" — الكلاب ليست بعرض 3 أقدام.', rw: 'Umuryango umwe. Uwukande uhitemo 12" cyangwa 18" — imbwa ntizifite ubugari bwa ft 3.' }),
  'teach.dog.s4': g('Slide the door off-center so wind and rain miss the bed.', { es: 'Mueve la puerta fuera del centro para que el viento y la lluvia no lleguen a la cama.', cu: 'Mueve la puerta fuera del centro para que el viento y la lluvia no lleguen a la cama.', uk: 'Зсунь двері від центру, щоб вітер і дощ не діставали лежанку.', ru: 'Сдвинь дверь от центра, чтобы ветер и дождь не доставали лежанку.', ti: 'ንፋስን ዝናብን ናብ መደቀሲ ከይበጽሑ ማዕጾ ካብ ማእከል ኣግልሶ።', fa: 'در را از وسط کنار بکش تا باد و باران به جای خواب نرسد.', 'fa-AF': 'دروازه را از وسط کنار بکش تا باد و باران به جای خواب نرسد.', ar: 'حرّك الباب بعيداً عن المنتصف كي لا يصل الريح والمطر إلى الفراش.', rw: 'Imura umuryango uve hagati kugira ngo umuyaga n\'imvura bitagera ku buriri.' }),
  'teach.dog.s5': g('Keep a pitched roof (gable or shed). Flat roofs puddle.', { es: 'Usa un techo inclinado (gable o shed). Los techos planos hacen charcos.', cu: 'Usa un techo inclinado (gable o shed). Los techos planos hacen charcos.', uk: 'Залиш похилий дах (gable або shed). На пласких дахах калюжі.', ru: 'Оставь скатную крышу (gable или shed). На плоских крышах лужи.', ti: 'ዝዘንበለ ናሕሲ ሓዝ (gable ወይ shed)። ጸፊሕ ናሕሲ ማይ የዋህልል።', fa: 'سقف شیب‌دار نگه دار (gable یا shed). سقف صاف آب جمع می‌کند.', 'fa-AF': 'بام شیب‌دار نگه دار (gable یا shed). بام هموار آب جمع می‌کند.', ar: 'أبقِ سقفاً مائلاً (gable أو shed). الأسقف المسطحة تتجمع عليها البرك.', rw: 'Gumana igisenge gihengamye (gable cyangwa shed). Ibisenge biringaniye bireka ibidendezi.' }),
  'teach.dog.s6': g('Put size labels on two walls.', { es: 'Pon etiquetas de medida en dos paredes.', cu: 'Pon etiquetas de medida en dos paredes.', uk: 'Постав підписи розмірів на двох стінах.', ru: 'Поставь подписи размеров на двух стенах.', ti: 'ኣብ ክልተ መናድቕ ምልክታት ዓቐን ኣቐምጥ።', fa: 'روی دو دیوار برچسب اندازه بگذار.', 'fa-AF': 'روی دو دیوار برچسپ اندازه بگذار.', ar: 'ضع تسميات مقاس على جدارين.', rw: 'Shyira ibirango by\'ingano ku nkuta ebyiri.' }),
  'teach.dog.s7': g('Plant a tree for summer shade.', { es: 'Planta un árbol para dar sombra en verano.', cu: 'Planta un árbol para dar sombra en verano.', uk: 'Посади дерево для літньої тіні.', ru: 'Посади дерево для летней тени.', ti: 'ንጽላል ሓጋይ ኦም ትኸል።', fa: 'برای سایه تابستان یک درخت بکار.', 'fa-AF': 'برای سایه تابستان یک درخت بنشان.', ar: 'ازرع شجرة لظل الصيف.', rw: 'Tera igiti cy\'igicucu cy\'impeshyi.' }),
  'teach.dog.s8': g('Open Contest — Baboo judges from the textbook list.', { es: 'Abre Concurso: Baboo juzga con la lista del libro.', cu: 'Abre Concurso: Baboo juzga con la lista del libro.', uk: 'Відкрий Конкурс — Baboo оцінює за списком із підручника.', ru: 'Открой Конкурс — Baboo оценивает по списку из учебника.', ti: 'ውድድር ክፈት — Baboo ብዝርዝር መጽሓፍ ትፈርድ።', fa: 'مسابقه را باز کن — Baboo از روی فهرست کتاب داوری می‌کند.', 'fa-AF': 'مسابقه را باز کن — Baboo از روی فهرست کتاب داوری می‌کند.', ar: 'افتح المسابقة — يحكم Baboo من قائمة الكتاب.', rw: 'Fungura Irushanwa — Baboo isuzuma ikoresheje urutonde rw\'igitabo.' }),
  'teach.dog.done': g('Closed den · 8–18 sq ft · dog-sized offset door · pitched roof · shade tree · Baboo’s ribbon', { es: 'Guarida cerrada · 8–18 pies² · puerta de perro fuera del centro · techo inclinado · árbol de sombra · listón de Baboo', cu: 'Guarida cerrada · 8–18 pies² · puerta de perro fuera del centro · techo inclinado · árbol de sombra · listón de Baboo', uk: 'Замкнене лігво · 8–18 кв. футів · двері для пса збоку · похилий дах · дерево для тіні · стрічка Baboo', ru: 'Замкнутое логово · 8–18 кв. футов · дверь для собаки сбоку · скатная крыша · дерево для тени · лента Baboo', ti: 'ዝተዓጽወ በዓቲ · 8–18 sq ft · ብዓቐን ከልቢ ካብ ማእከል ዝረሓቐ ማዕጾ · ዝዘንበለ ናሕሲ · ኦም ጽላል · ሽልማት Baboo', fa: 'لانه بسته · ۸ تا ۱۸ فوت مربع · در سگی کنار از وسط · سقف شیب‌دار · درخت سایه · روبان Baboo', 'fa-AF': 'لانه بسته · ۸ تا ۱۸ فت مربع · دروازه سگی کنار از وسط · بام شیب‌دار · درخت سایه · فیته Baboo', ar: 'وكر مغلق · 8–18 قدماً مربعاً · باب بحجم الكلب بعيد عن المنتصف · سقف مائل · شجرة ظل · شريط Baboo', rw: 'Icyari gifunze · 8–18 sq ft · umuryango w\'imbwa utari hagati · igisenge gihengamye · igiti cy\'igicucu · igihembo cya Baboo' }),
  'teach.ref.traffic.title': g('Traffic patterns', { es: 'Rutas de paso', cu: 'Rutas de paso', uk: 'Шляхи руху', ru: 'Пути движения', ti: 'መንገድታት ምንቅስቓስ', fa: 'مسیرهای رفت‌وآمد', 'fa-AF': 'مسیرهای رفت‌وآمد', ar: 'مسارات الحركة', rw: 'Inzira z\'urujya n\'uruza' }),
  'teach.ref.traffic.prompt': g('1. Start at the front door.\n2. Trace the path to the kitchen.\n3. Trace the path to the bath.\n4. Trace the path to sleep.\n5. Does anyone bump or cross?', { es: '1. Empieza en la puerta principal.\n2. Sigue el camino a la cocina.\n3. Sigue el camino al baño.\n4. Sigue el camino al dormitorio.\n5. ¿Alguien choca o se cruza?', cu: '1. Empieza en la puerta principal.\n2. Sigue el camino a la cocina.\n3. Sigue el camino al baño.\n4. Sigue el camino al dormitorio.\n5. ¿Alguien choca o se cruza?', uk: '1. Почни від вхідних дверей.\n2. Простеж шлях до кухні.\n3. Простеж шлях до ванної.\n4. Простеж шлях до спальні.\n5. Чи хтось зіштовхується або перетинається?', ru: '1. Начни у входной двери.\n2. Проследи путь до кухни.\n3. Проследи путь до ванной.\n4. Проследи путь до спальни.\n5. Кто-то сталкивается или пересекается?', ti: '1. ካብ ቀንዲ ማዕጾ ጀምር።\n2. ናብ ክሽነ ዘሎ መንገዲ ስዓብ።\n3. ናብ ባኞ ዘሎ መንገዲ ስዓብ።\n4. ናብ መደቀሲ ዘሎ መንገዲ ስዓብ።\n5. ዝጋጨው ወይ ዝሰጋገር ኣሎ ዶ?', fa: '۱. از در ورودی شروع کن.\n۲. مسیر تا آشپزخانه را دنبال کن.\n۳. مسیر تا حمام را دنبال کن.\n۴. مسیر تا اتاق خواب را دنبال کن.\n۵. کسی به هم می‌خورد یا از هم رد می‌شود؟', 'fa-AF': '۱. از دروازه ورودی شروع کن.\n۲. راه تا آشپزخانه را دنبال کن.\n۳. راه تا تشناب را دنبال کن.\n۴. راه تا اتاق خواب را دنبال کن.\n۵. کسی به هم می‌خورد یا از هم رد می‌شود؟', ar: '1. ابدأ من الباب الأمامي.\n2. تتبّع الطريق إلى المطبخ.\n3. تتبّع الطريق إلى الحمام.\n4. تتبّع الطريق إلى غرفة النوم.\n5. هل يصطدم أحد أو تتقاطع الطرق؟', rw: '1. Tangirira ku muryango w\'imbere.\n2. Kurikira inzira igana mu gikoni.\n3. Kurikira inzira igana mu bwiherero.\n4. Kurikira inzira igana aho kuryama.\n5. Hari uhura n\'undi cyangwa inzira zihura?' }),
  'teach.ref.kitchen-triangle.title': g('Kitchen triangle', { es: 'Triángulo de la cocina', cu: 'Triángulo de la cocina', uk: 'Кухонний трикутник', ru: 'Кухонный треугольник', ti: 'ሰለስተ ኩርናዕ ክሽነ', fa: 'مثلث آشپزخانه', 'fa-AF': 'مثلث آشپزخانه', ar: 'مثلث المطبخ', rw: 'Mpandeshatu y\'igikoni' }),
  'teach.ref.kitchen-triangle.prompt': g('1. Find the sink.\n2. Find the stove.\n3. Find the fridge.\n4. Are they close? (This is the kitchen triangle — the work path between them.)', { es: '1. Encuentra el fregadero.\n2. Encuentra la estufa.\n3. Encuentra el refrigerador.\n4. ¿Están cerca? (Este es el triángulo de la cocina: el camino de trabajo entre ellos.)', cu: '1. Encuentra el fregadero.\n2. Encuentra la estufa.\n3. Encuentra el refrigerador.\n4. ¿Están cerca? (Este es el triángulo de la cocina: el camino de trabajo entre ellos.)', uk: '1. Знайди мийку.\n2. Знайди плиту.\n3. Знайди холодильник.\n4. Вони близько? (Це кухонний трикутник — робочий шлях між ними.)', ru: '1. Найди мойку.\n2. Найди плиту.\n3. Найди холодильник.\n4. Они близко? (Это кухонный треугольник — рабочий путь между ними.)', ti: '1. መሕጸቢ ርኸብ።\n2. ምድጃ ርኸብ።\n3. ፍሪጅ ርኸብ።\n4. ቀረባ ዶ እዮም? (እዚ ሰለስተ ኩርናዕ ክሽነ እዩ — መንገዲ ስራሕ ኣብ መንጎኦም።)', fa: '۱. سینک را پیدا کن.\n۲. اجاق را پیدا کن.\n۳. یخچال را پیدا کن.\n۴. نزدیک هم‌اند؟ (این مثلث آشپزخانه است — مسیر کار بین آن‌ها.)', 'fa-AF': '۱. دستشوی را پیدا کن.\n۲. داش را پیدا کن.\n۳. یخچال را پیدا کن.\n۴. نزدیک هم‌اند؟ (این مثلث آشپزخانه است — راه کار بین آن‌ها.)', ar: '1. جد الحوض.\n2. جد الموقد.\n3. جد الثلاجة.\n4. هل هي قريبة؟ (هذا مثلث المطبخ — طريق العمل بينها.)', rw: '1. Shaka iyozero.\n2. Shaka iziko.\n3. Shaka firigo.\n4. Biri hafi? (Iyi ni mpandeshatu y\'igikoni — inzira y\'akazi hagati yabyo.)' }),
  'teach.ref.utility-storage.title': g('Utility + storage', { es: 'Servicio y almacén', cu: 'Servicio y almacén', uk: 'Господарське й зберігання', ru: 'Подсобка и хранение', ti: 'ኣገልግሎትን መኽዘንን', fa: 'خدمات و انباری', 'fa-AF': 'خدمات و گدام', ar: 'الخدمات والتخزين', rw: 'Aho kumesera n\'ububiko' }),
  'teach.ref.utility-storage.prompt': g('1. Where is laundry?\n2. Where is the water heater?\n3. Where is a closet?\nEvery home needs these.', { es: '1. ¿Dónde está la lavandería?\n2. ¿Dónde está el calentador de agua?\n3. ¿Dónde hay un clóset?\nToda casa los necesita.', cu: '1. ¿Dónde está la lavandería?\n2. ¿Dónde está el calentador de agua?\n3. ¿Dónde hay un clóset?\nToda casa los necesita.', uk: '1. Де пральня?\n2. Де бойлер?\n3. Де шафа?\nКожному дому це потрібно.', ru: '1. Где прачечная?\n2. Где бойлер?\n3. Где шкаф?\nКаждому дому это нужно.', ti: '1. መሕጸቢ ክዳን ኣበይ ኣሎ?\n2. መውዓዪ ማይ ኣበይ ኣሎ?\n3. ቁም ሳጹን ኣበይ ኣሎ?\nነፍሲ ወከፍ ገዛ እዚኦም የድልዮ።', fa: '۱. رختشوی کجاست؟\n۲. آبگرمکن کجاست؟\n۳. کمد کجاست؟\nهر خانه این‌ها را لازم دارد.', 'fa-AF': '۱. کالاشویی کجاست؟\n۲. آبگرمی کجاست؟\n۳. الماری کجاست؟\nهر خانه این‌ها را لازم دارد.', ar: '1. أين الغسيل؟\n2. أين سخان الماء؟\n3. أين الخزانة؟\nكل بيت يحتاج هذه.', rw: '1. Aho kumesera ni he?\n2. Icyuma gishyushya amazi kiri he?\n3. Akabati kari he?\nBuri nzu irabikeneye.' }),
  // 2.13.52: the Teach panel's "Read this plan" checks in every language. ti, fa-AF and rw are UNCHECKED native copy.
  'arch.env.title': g('A closed envelope', { es: 'Un recinto cerrado', cu: 'Un recinto cerrado', uk: 'Замкнена оболонка', ru: 'Замкнутая оболочка', ti: 'ዝተዓጽወ ሽፋን', fa: 'پوسته بسته', 'fa-AF': 'پوسته بسته', ar: 'غلاف مغلق', rw: 'Igikonoshwa gifunze' }),
  'arch.env.none': g('No walls yet. An envelope is the outside that keeps weather out.', { es: 'Aún no hay paredes. El recinto es el exterior que deja fuera el clima.', cu: 'Aún no hay paredes. El recinto es el exterior que deja fuera el clima.', uk: 'Ще немає стін. Оболонка — це зовнішній бік, що захищає від погоди.', ru: 'Пока нет стен. Оболочка — это внешняя часть, которая защищает от погоды.', ti: 'ገና መናድቕ የለን። ሽፋን ነቲ ኣየር ደገ ዝከልክል ደገ እዩ።', fa: 'هنوز دیواری نیست. پوسته بیرونِ خانه است که هوا را بیرون نگه می‌دارد.', 'fa-AF': 'هنوز دیواری نیست. پوسته بیرون خانه است که هوا را بیرون نگه می‌دارد.', ar: 'لا جدران بعد. الغلاف هو الخارج الذي يمنع الطقس.', rw: 'Nta nkuta ziraho. Igikonoshwa ni inyuma ikumira ikirere.' }),
  'arch.env.noneTip': g('Sketch a box, then Trace — or Wall, two clicks at a time, until it meets.', { es: 'Dibuja una caja y luego Traza, o usa Pared de dos clics en dos clics hasta que se cierre.', cu: 'Dibuja una caja y luego Traza, o usa Pared de dos clics en dos clics hasta que se cierre.', uk: 'Намалюй коробку, потім Обвести — або Стіна, по два клацання, доки не зійдеться.', ru: 'Нарисуй коробку, потом Обвести — или Стена, по два щелчка, пока не сойдётся.', ti: 'ሳጹን ስኣል፣ ድሕሪኡ ስዓብ — ወይ መንደቕ፣ ክልተ ጠውቕ፣ ክሳዕ ዝራኸብ።', fa: 'یک جعبه طرح بزن، بعد دنبال کن — یا دیوار، دو کلیک در هر بار، تا به هم برسد.', 'fa-AF': 'یک صندوق طرح بزن، بعد دنبال کن — یا دیوار، دو کلیک در هر بار، تا به هم برسد.', ar: 'ارسم صندوقاً ثم شفّف — أو الجدار بنقرتين كل مرة حتى ينغلق.', rw: 'Shushanya agasanduku, hanyuma Kurikiza — cyangwa Urukuta, gukanda kabiri, kugeza bihuye.' }),
  'arch.env.open': g('Walls do not close a room yet. Rain would walk in at the gaps.', { es: 'Las paredes aún no cierran un cuarto. La lluvia entraría por los huecos.', cu: 'Las paredes aún no cierran un cuarto. La lluvia entraría por los huecos.', uk: 'Стіни ще не замикають кімнату. Дощ зайде крізь щілини.', ru: 'Стены ещё не замыкают комнату. Дождь зайдёт через щели.', ti: 'መናድቕ ገና ክፍሊ ኣይዓጸዉን። ዝናብ ብክፍተታት ምኣተወ።', fa: 'دیوارها هنوز اتاقی را نمی‌بندند. باران از شکاف‌ها وارد می‌شود.', 'fa-AF': 'دیوارها هنوز اتاقی را نمی‌بندند. باران از درزها داخل می‌شود.', ar: 'الجدران لا تغلق غرفة بعد. سيدخل المطر من الفجوات.', rw: 'Inkuta ntizirafunga icyumba. Imvura yakwinjirira mu myanya.' }),
  'arch.env.openTip': g('Meet every corner. The last click should land on the first.', { es: 'Junta todas las esquinas. El último clic debe caer en el primero.', cu: 'Junta todas las esquinas. El último clic debe caer en el primero.', uk: 'З\'єднай кожен кут. Останнє клацання — на першому.', ru: 'Соедини каждый угол. Последний щелчок — на первом.', ti: 'ነፍሲ ወከፍ ኩርናዕ ኣራኽብ። እቲ ናይ መወዳእታ ጠውቕ ኣብቲ ቀዳማይ ይውደቕ።', fa: 'همه گوشه‌ها را به هم برسان. آخرین کلیک باید روی اولی بیفتد.', 'fa-AF': 'همه کنج‌ها را به هم برسان. آخرین کلیک باید روی اولی بیفتد.', ar: 'اجمع كل الزوايا. يجب أن تقع النقرة الأخيرة على الأولى.', rw: 'Huza inguni zose. Ukanda bwa nyuma ugomba kugwa ku bwa mbere.' }),
  'arch.env.pass': g('Outside is about {w} × {h} · {a} sq ft inside.', { es: 'Afuera mide unos {w} × {h} · {a} pies² adentro.', cu: 'Afuera mide unos {w} × {h} · {a} pies² adentro.', uk: 'Зовні приблизно {w} × {h} · {a} кв. футів усередині.', ru: 'Снаружи примерно {w} × {h} · {a} кв. футов внутри.', ti: 'ደገ ኣስታት {w} × {h} · ውሽጢ {a} sq ft።', fa: 'بیرون حدود {w} × {h} است · {a} فوت مربع داخل.', 'fa-AF': 'بیرون حدود {w} × {h} است · {a} فت مربع داخل.', ar: 'الخارج نحو {w} × {h} · ‏{a} قدم مربع في الداخل.', rw: 'Inyuma ni hafi {w} × {h} · imbere {a} sq ft.' }),
  'arch.env.pass2': g('Closed. About {a} sq ft inside.', { es: 'Cerrado. Unos {a} pies² adentro.', cu: 'Cerrado. Unos {a} pies² adentro.', uk: 'Замкнено. Близько {a} кв. футів усередині.', ru: 'Замкнуто. Около {a} кв. футов внутри.', ti: 'ተዓጽዩ። ውሽጢ ኣስታት {a} sq ft።', fa: 'بسته است. حدود {a} فوت مربع داخل.', 'fa-AF': 'بسته است. حدود {a} فت مربع داخل.', ar: 'مغلق. نحو {a} قدم مربع في الداخل.', rw: 'Birafunze. Imbere hafi {a} sq ft.' }),
  'arch.env.passTip': g('That outside box is the envelope. Interior walls split it into rooms.', { es: 'Esa caja exterior es el recinto. Las paredes interiores la dividen en cuartos.', cu: 'Esa caja exterior es el recinto. Las paredes interiores la dividen en cuartos.', uk: 'Ця зовнішня коробка — оболонка. Внутрішні стіни ділять її на кімнати.', ru: 'Эта внешняя коробка — оболочка. Внутренние стены делят её на комнаты.', ti: 'እቲ ደገዊ ሳጹን ሽፋን እዩ። ውሽጣዊ መናድቕ ናብ ክፍልታት ይመቕልዎ።', fa: 'آن جعبه بیرونی پوسته است. دیوارهای داخلی آن را به اتاق‌ها تقسیم می‌کنند.', 'fa-AF': 'آن صندوق بیرونی پوسته است. دیوارهای داخلی آن را به اتاق‌ها تقسیم می‌کنند.', ar: 'ذلك الصندوق الخارجي هو الغلاف. الجدران الداخلية تقسمه إلى غرف.', rw: 'Ako gasanduku k\'inyuma ni igikonoshwa. Inkuta z\'imbere zikigabanyamo ibyumba.' }),
  'arch.entry.none': g('No door. A plan needs an entry from outside.', { es: 'No hay puerta. Un plano necesita una entrada desde afuera.', cu: 'No hay puerta. Un plano necesita una entrada desde afuera.', uk: 'Немає дверей. Плану потрібен вхід ззовні.', ru: 'Нет двери. Плану нужен вход снаружи.', ti: 'ማዕጾ የለን። ትልሚ ካብ ደገ መእተዊ የድልዮ።', fa: 'در نیست. نقشه به یک ورودی از بیرون نیاز دارد.', 'fa-AF': 'دروازه نیست. نقشه به یک ورودی از بیرون نیاز دارد.', ar: 'لا يوجد باب. المخطط يحتاج مدخلاً من الخارج.', rw: 'Nta muryango. Igishushanyo gikeneye aho kwinjirira uvuye hanze.' }),
  'arch.entry.noneTip': g('Door tool → click an outside wall. That is the front door until you say otherwise.', { es: 'Herramienta Puerta → haz clic en una pared exterior. Esa es la puerta principal hasta que digas otra cosa.', cu: 'Herramienta Puerta → haz clic en una pared exterior. Esa es la puerta principal hasta que digas otra cosa.', uk: 'Інструмент Двері → клацни по зовнішній стіні. Це вхідні двері, доки не вирішиш інакше.', ru: 'Инструмент Дверь → щёлкни по наружной стене. Это входная дверь, пока не решишь иначе.', ti: 'መሳርሒ ማዕጾ → ደገዊ መንደቕ ጠውቕ። ካልእ ክሳዕ ትብል ቀንዲ ማዕጾ እዩ።', fa: 'ابزار در ← روی یک دیوار بیرونی کلیک کن. تا نظرت را عوض نکنی، آن در ورودی است.', 'fa-AF': 'ابزار دروازه ← روی یک دیوار بیرونی کلیک کن. تا نظرت را عوض نکنی، آن دروازه ورودی است.', ar: 'أداة الباب ← انقر جداراً خارجياً. هذا هو الباب الأمامي ما لم تقل غير ذلك.', rw: 'Igikoresho cy\'Umuryango → kanda ku rukuta rwo hanze. Uwo ni umuryango w\'imbere kugeza uvuze ukundi.' }),
  'arch.entry.inside': g('Doors sit on interior walls only. Guests still need a door from outside.', { es: 'Las puertas están solo en paredes interiores. Las visitas aún necesitan una puerta desde afuera.', cu: 'Las puertas están solo en paredes interiores. Las visitas aún necesitan una puerta desde afuera.', uk: 'Двері лише на внутрішніх стінах. Гостям усе ще потрібні двері ззовні.', ru: 'Двери только на внутренних стенах. Гостям всё ещё нужна дверь снаружи.', ti: 'ማዕጾታት ኣብ ውሽጣዊ መናድቕ ጥራይ ኣለዉ። ጋሻ ገና ካብ ደገ ማዕጾ የድልዮም።', fa: 'درها فقط روی دیوارهای داخلی‌اند. مهمان‌ها هنوز به یک در از بیرون نیاز دارند.', 'fa-AF': 'دروازه‌ها فقط روی دیوارهای داخلی‌اند. مهمان‌ها هنوز به یک دروازه از بیرون نیاز دارند.', ar: 'الأبواب على جدران داخلية فقط. الضيوف ما زالوا يحتاجون باباً من الخارج.', rw: 'Imiryango iri ku nkuta z\'imbere gusa. Abashyitsi baracyakeneye umuryango uvuye hanze.' }),
  'arch.entry.insideTip': g('Put one door on an exterior wall. That is the entry.', { es: 'Pon una puerta en una pared exterior. Esa es la entrada.', cu: 'Pon una puerta en una pared exterior. Esa es la entrada.', uk: 'Постав одні двері на зовнішню стіну. Це вхід.', ru: 'Поставь одну дверь на наружную стену. Это вход.', ti: 'ሓደ ማዕጾ ኣብ ደገዊ መንደቕ ኣቐምጥ። እዚ መእተዊ እዩ።', fa: 'یک در روی دیوار بیرونی بگذار. آن ورودی است.', 'fa-AF': 'یک دروازه روی دیوار بیرونی بگذار. آن ورودی است.', ar: 'ضع باباً على جدار خارجي. هذا هو المدخل.', rw: 'Shyira umuryango umwe ku rukuta rwo hanze. Uwo ni wo kwinjiriraho.' }),
  'arch.entry.one': g('1 exterior door.', { es: '1 puerta exterior.', cu: '1 puerta exterior.', uk: '1 зовнішні двері.', ru: '1 наружная дверь.', ti: '1 ደገዊ ማዕጾ።', fa: '۱ در بیرونی.', 'fa-AF': '۱ دروازه بیرونی.', ar: 'باب خارجي واحد.', rw: 'Umuryango 1 wo hanze.' }),
  'arch.entry.many': g('{n} exterior doors.', { es: '{n} puertas exteriores.', cu: '{n} puertas exteriores.', uk: 'Зовнішніх дверей: {n}.', ru: 'Наружных дверей: {n}.', ti: '{n} ደገውቲ ማዕጾታት።', fa: '{n} در بیرونی.', 'fa-AF': '{n} دروازه بیرونی.', ar: '{n} أبواب خارجية.', rw: 'Imiryango {n} yo hanze.' }),
  'arch.entry.passTip': g('Keep a clear path from that door to the rooms people use first.', { es: 'Deja un camino libre de esa puerta a los cuartos que se usan primero.', cu: 'Deja un camino libre de esa puerta a los cuartos que se usan primero.', uk: 'Залиш вільний шлях від цих дверей до кімнат, якими користуються найперше.', ru: 'Оставь свободный путь от этой двери к комнатам, которыми пользуются в первую очередь.', ti: 'ካብቲ ማዕጾ ናብቶም ቀዳሞት ዝጥቀሙሎም ክፍልታት ንጹር መንገዲ ግደፍ።', fa: 'از آن در تا اتاق‌هایی که اول استفاده می‌شوند یک مسیر باز نگه دار.', 'fa-AF': 'از آن دروازه تا اتاق‌هایی که اول استفاده می‌شوند یک راه باز نگه دار.', ar: 'اترك طريقاً خالياً من ذلك الباب إلى الغرف التي تُستخدم أولاً.', rw: 'Siga inzira irimo ubusa kuva kuri uwo muryango ugera mu byumba bikoreshwa mbere.' }),
  'arch.day.title': g('Daylight', { es: 'Luz del día', cu: 'Luz del día', uk: 'Денне світло', ru: 'Дневной свет', ti: 'ብርሃን መዓልቲ', fa: 'نور روز', 'fa-AF': 'روشنی روز', ar: 'ضوء النهار', rw: 'Urumuri rw\'umunsi' }),
  'arch.day.dog': g('A den is a shelter, not a people house — skip the window check.', { es: 'Una guarida es un refugio, no una casa de personas: se omite la revisión de ventanas.', cu: 'Una guarida es un refugio, no una casa de personas: se omite la revisión de ventanas.', uk: 'Лігво — це укриття, а не будинок для людей: вікна не перевіряємо.', ru: 'Логово — это укрытие, а не дом для людей: окна не проверяем.', ti: 'በዓቲ መዕቆቢ እዩ፣ ገዛ ሰባት ኣይኮነን — ምርመራ መስኮት ሕለፎ።', fa: 'لانه پناهگاه است، نه خانه آدم‌ها — بررسی پنجره را رد کن.', 'fa-AF': 'لانه پناهگاه است، نه خانه مردم — بررسی کلکین را رد کن.', ar: 'الوكر مأوى لا بيت للناس — تخطَّ فحص النوافذ.', rw: 'Icyari ni ubuhungiro, si inzu y\'abantu — reka isuzuma ry\'amadirishya.' }),
  'arch.day.dogTip': g('Baboo judges this one in Contest.', { es: 'Baboo juzga esto en Concurso.', cu: 'Baboo juzga esto en Concurso.', uk: 'Це Baboo оцінює в Конкурсі.', ru: 'Это Baboo оценивает в Конкурсе.', ti: 'Baboo ነዚ ኣብ ውድድር ትፈርዶ።', fa: 'Baboo این را در مسابقه داوری می‌کند.', 'fa-AF': 'Baboo این را در مسابقه داوری می‌کند.', ar: 'يحكم Baboo على هذا في المسابقة.', rw: 'Baboo isuzuma ibi mu Irushanwa.' }),
  'arch.day.none': g('No windows. Rooms need a way for sun and air.', { es: 'No hay ventanas. Los cuartos necesitan entrada de sol y aire.', cu: 'No hay ventanas. Los cuartos necesitan entrada de sol y aire.', uk: 'Немає вікон. Кімнатам потрібні сонце й повітря.', ru: 'Нет окон. Комнатам нужны солнце и воздух.', ti: 'መሳኹቲ የለን። ክፍልታት ጸሓይን ኣየርን የድልዮም።', fa: 'پنجره نیست. اتاق‌ها راهی برای آفتاب و هوا لازم دارند.', 'fa-AF': 'کلکین نیست. اتاق‌ها راهی برای آفتاب و هوا لازم دارند.', ar: 'لا نوافذ. الغرف تحتاج منفذاً للشمس والهواء.', rw: 'Nta madirishya. Ibyumba bikeneye izuba n\'umwuka.' }),
  'arch.day.noneTip': g('Window tool → click a wall, usually across from the door.', { es: 'Herramienta Ventana → haz clic en una pared, normalmente frente a la puerta.', cu: 'Herramienta Ventana → haz clic en una pared, normalmente frente a la puerta.', uk: 'Інструмент Вікно → клацни по стіні, зазвичай навпроти дверей.', ru: 'Инструмент Окно → щёлкни по стене, обычно напротив двери.', ti: 'መሳርሒ መስኮት → መንደቕ ጠውቕ፣ መብዛሕትኡ ኣንጻር ማዕጾ።', fa: 'ابزار پنجره ← روی یک دیوار کلیک کن، معمولاً روبه‌روی در.', 'fa-AF': 'ابزار کلکین ← روی یک دیوار کلیک کن، معمولاً روبه‌روی دروازه.', ar: 'أداة النافذة ← انقر جداراً، عادةً مقابل الباب.', rw: 'Igikoresho cy\'Idirishya → kanda ku rukuta, ubusanzwe ahateganye n\'umuryango.' }),
  'arch.day.cross1': g('1 window, on a different wall than the door.', { es: '1 ventana, en otra pared que la puerta.', cu: '1 ventana, en otra pared que la puerta.', uk: '1 вікно, на іншій стіні, ніж двері.', ru: '1 окно, на другой стене, чем дверь.', ti: '1 መስኮት፣ ካብ ማዕጾ ኣብ ካልእ መንደቕ።', fa: '۱ پنجره، روی دیواری غیر از دیوار در.', 'fa-AF': '۱ کلکین، روی دیواری غیر از دیوار دروازه.', ar: 'نافذة واحدة، على جدار غير جدار الباب.', rw: 'Idirishya 1, ku rukuta rutari urw\'umuryango.' }),
  'arch.day.cross': g('{n} windows — at least one sits on a different wall than the door.', { es: '{n} ventanas: al menos una está en otra pared que la puerta.', cu: '{n} ventanas: al menos una está en otra pared que la puerta.', uk: 'Вікон: {n} — хоча б одне на іншій стіні, ніж двері.', ru: 'Окон: {n} — хотя бы одно на другой стене, чем дверь.', ti: '{n} መሳኹቲ — እንተወሓደ ሓደ ካብ ማዕጾ ኣብ ካልእ መንደቕ ኣሎ።', fa: '{n} پنجره — دست‌کم یکی روی دیواری غیر از دیوار در است.', 'fa-AF': '{n} کلکین — دست‌کم یکی روی دیواری غیر از دیوار دروازه است.', ar: '{n} نوافذ — واحدة على الأقل على جدار غير جدار الباب.', rw: 'Amadirishya {n} — nibura rimwe riri ku rukuta rutari urw\'umuryango.' }),
  'arch.day.same1': g('1 window, on the same wall as a door. Air wants a path through.', { es: '1 ventana, en la misma pared que una puerta. El aire quiere atravesar.', cu: '1 ventana, en la misma pared que una puerta. El aire quiere atravesar.', uk: '1 вікно на тій самій стіні, що й двері. Повітрю потрібен шлях наскрізь.', ru: '1 окно на той же стене, что и дверь. Воздуху нужен путь насквозь.', ti: '1 መስኮት፣ ምስ ማዕጾ ኣብ ሓደ መንደቕ። ኣየር መሕለፊ ይደሊ።', fa: '۱ پنجره، روی همان دیوار در. هوا به یک مسیر عبور نیاز دارد.', 'fa-AF': '۱ کلکین، روی همان دیوار دروازه. هوا به یک راه عبور نیاز دارد.', ar: 'نافذة واحدة على جدار الباب نفسه. يحتاج الهواء ممراً عبر البيت.', rw: 'Idirishya 1, ku rukuta rumwe n\'umuryango. Umwuka ukeneye inzira inyura hagati.' }),
  'arch.day.same': g('{n} windows, all on the same wall as a door. Air wants a path through.', { es: '{n} ventanas, todas en la misma pared que una puerta. El aire quiere atravesar.', cu: '{n} ventanas, todas en la misma pared que una puerta. El aire quiere atravesar.', uk: 'Вікон: {n}, усі на тій самій стіні, що й двері. Повітрю потрібен шлях наскрізь.', ru: 'Окон: {n}, все на той же стене, что и дверь. Воздуху нужен путь насквозь.', ti: '{n} መሳኹቲ፣ ኩሎም ምስ ማዕጾ ኣብ ሓደ መንደቕ። ኣየር መሕለፊ ይደሊ።', fa: '{n} پنجره، همه روی همان دیوار در. هوا به یک مسیر عبور نیاز دارد.', 'fa-AF': '{n} کلکین، همه روی همان دیوار دروازه. هوا به یک راه عبور نیاز دارد.', ar: '{n} نوافذ، كلها على جدار الباب نفسه. يحتاج الهواء ممراً عبر البيت.', rw: 'Amadirishya {n}, yose ku rukuta rumwe n\'umuryango. Umwuka ukeneye inzira inyura hagati.' }),
  'arch.day.tip': g('A window across from a door is the simple cross-breeze.', { es: 'Una ventana frente a una puerta es la corriente cruzada más simple.', cu: 'Una ventana frente a una puerta es la corriente cruzada más simple.', uk: 'Вікно навпроти дверей — найпростіший протяг.', ru: 'Окно напротив двери — самый простой сквозняк.', ti: 'ኣንጻር ማዕጾ ዘሎ መስኮት ቀሊል ናይ ንፋስ መሕለፊ እዩ።', fa: 'پنجره روبه‌روی در ساده‌ترین کوران هواست.', 'fa-AF': 'کلکین روبه‌روی دروازه ساده‌ترین جریان هواست.', ar: 'النافذة المقابلة للباب هي أبسط تيار هواء متقاطع.', rw: 'Idirishya riteganye n\'umuryango ni bwo buryo bworoshye bwo kwinjiza umwuka.' }),
  'arch.named.title': g('Named rooms', { es: 'Cuartos con nombre', cu: 'Cuartos con nombre', uk: 'Названі кімнати', ru: 'Названные комнаты', ti: 'ዝተሰምዩ ክፍልታት', fa: 'اتاق‌های نام‌گذاری‌شده', 'fa-AF': 'اتاق‌های نام‌گذاری‌شده', ar: 'غرف مسمّاة', rw: 'Ibyumba bifite amazina' }),
  'arch.named.dog': g('A dog house is one den. No kitchen, no bath.', { es: 'Una casita de perro es una sola guarida. Sin cocina ni baño.', cu: 'Una casita de perro es una sola guarida. Sin cocina ni baño.', uk: 'Будка — це одне лігво. Без кухні й ванної.', ru: 'Будка — это одно логово. Без кухни и ванной.', ti: 'ገዛ ከልቢ ሓደ በዓቲ እዩ። ክሽነ የለን፣ ባኞ የለን።', fa: 'لانه سگ یک لانه است. نه آشپزخانه، نه حمام.', 'fa-AF': 'خانه سگ یک لانه است. نه آشپزخانه، نه تشناب.', ar: 'بيت الكلب وكر واحد. لا مطبخ ولا حمام.', rw: 'Inzu y\'imbwa ni icyari kimwe. Nta gikoni, nta bwiherero.' }),
  'arch.named.dogTip': g('Keep it one room. Name is Den.', { es: 'Que sea un cuarto. Su nombre es Guarida.', cu: 'Que sea un cuarto. Su nombre es Guarida.', uk: 'Залиш одну кімнату. Назва — Лігво.', ru: 'Оставь одну комнату. Название — Логово.', ti: 'ሓደ ክፍሊ ይኹን። ስሙ በዓቲ እዩ።', fa: 'یک اتاق بماند. نامش لانه است.', 'fa-AF': 'یک اتاق بماند. نامش لانه است.', ar: 'اجعلها غرفة واحدة. اسمها الوكر.', rw: 'Bigume icyumba kimwe. Izina ni Icyari.' }),
  'arch.named.unnamed': g('Spaces are closed but not named. A plan without names is hard to read.', { es: 'Los espacios están cerrados pero sin nombre. Un plano sin nombres se lee mal.', cu: 'Los espacios están cerrados pero sin nombre. Un plano sin nombres se lee mal.', uk: 'Простори замкнені, але без назв. План без назв важко читати.', ru: 'Пространства замкнуты, но без названий. План без названий трудно читать.', ti: 'ቦታታት ተዓጽዮም ግን ኣይተሰምዩን። ስም ዘይብሉ ትልሚ ንምንባብ ይኸብድ።', fa: 'فضاها بسته‌اند ولی نام ندارند. نقشه بی‌نام سخت خوانده می‌شود.', 'fa-AF': 'فضاها بسته‌اند ولی نام ندارند. نقشه بی‌نام سخت خوانده می‌شود.', ar: 'المساحات مغلقة لكنها بلا أسماء. المخطط بلا أسماء صعب القراءة.', rw: 'Ahantu harafunze ariko nta mazina. Igishushanyo kitagira amazina kiragoye gusoma.' }),
  'arch.named.first': g('Close walls first, then name the rooms.', { es: 'Cierra primero las paredes y luego nombra los cuartos.', cu: 'Cierra primero las paredes y luego nombra los cuartos.', uk: 'Спершу замкни стіни, потім назви кімнати.', ru: 'Сначала замкни стены, потом назови комнаты.', ti: 'ቅድም መናድቕ ዕጸው፣ ድሕሪኡ ክፍልታት ሰምይ።', fa: 'اول دیوارها را ببند، بعد اتاق‌ها را نام‌گذاری کن.', 'fa-AF': 'اول دیوارها را ببند، بعد اتاق‌ها را نام‌گذاری کن.', ar: 'أغلق الجدران أولاً، ثم سمِّ الغرف.', rw: 'Banza ufunge inkuta, hanyuma wite ibyumba amazina.' }),
  'arch.named.howTip': g('Room tool → Kitchen, Bath, Living… → click inside.', { es: 'Herramienta Cuarto → Cocina, Baño, Sala… → haz clic adentro.', cu: 'Herramienta Cuarto → Cocina, Baño, Sala… → haz clic adentro.', uk: 'Інструмент Кімната → Кухня, Ванна, Вітальня… → клацни всередині.', ru: 'Инструмент Комната → Кухня, Ванная, Гостиная… → щёлкни внутри.', ti: 'መሳርሒ ክፍሊ → ክሽነ፣ ባኞ፣ መሕደሪ… → ኣብ ውሽጢ ጠውቕ።', fa: 'ابزار اتاق ← آشپزخانه، حمام، نشیمن… ← داخلش کلیک کن.', 'fa-AF': 'ابزار اتاق ← آشپزخانه، تشناب، نشیمن… ← داخلش کلیک کن.', ar: 'أداة الغرفة ← مطبخ، حمام، معيشة… ← انقر في الداخل.', rw: 'Igikoresho cy\'Icyumba → Igikoni, Ubwiherero, Uruganiriro… → kanda imbere.' }),
  'arch.named.one': g('1 named space.', { es: '1 espacio con nombre.', cu: '1 espacio con nombre.', uk: '1 названий простір.', ru: '1 названное пространство.', ti: '1 ዝተሰምየ ቦታ።', fa: '۱ فضای نام‌گذاری‌شده.', 'fa-AF': '۱ فضای نام‌گذاری‌شده.', ar: 'مساحة واحدة مسمّاة.', rw: 'Ahantu 1 hafite izina.' }),
  'arch.named.many': g('{n} named spaces.', { es: '{n} espacios con nombre.', cu: '{n} espacios con nombre.', uk: 'Названих просторів: {n}.', ru: 'Названных пространств: {n}.', ti: '{n} ዝተሰምዩ ቦታታት።', fa: '{n} فضای نام‌گذاری‌شده.', 'fa-AF': '{n} فضای نام‌گذاری‌شده.', ar: '{n} مساحات مسمّاة.', rw: 'Ahantu {n} hafite amazina.' }),
  'arch.named.passTip': g('Every closed space people use should have a name and an area.', { es: 'Cada espacio cerrado que se usa debe tener nombre y área.', cu: 'Cada espacio cerrado que se usa debe tener nombre y área.', uk: 'Кожен замкнений простір, яким користуються, має мати назву й площу.', ru: 'У каждого замкнутого пространства, которым пользуются, должны быть название и площадь.', ti: 'ነፍሲ ወከፍ ዝጥቀሙሉ ዝተዓጽወ ቦታ ስምን ስፍሓትን ክህልዎ ኣለዎ።', fa: 'هر فضای بسته‌ای که استفاده می‌شود باید نام و مساحت داشته باشد.', 'fa-AF': 'هر فضای بسته‌ای که استفاده می‌شود باید نام و مساحت داشته باشد.', ar: 'كل مساحة مغلقة يستخدمها الناس يجب أن يكون لها اسم ومساحة.', rw: 'Ahantu hose hafunze hakoreshwa hagomba kugira izina n\'ubuso.' }),
  'arch.scale.title': g('Room scale', { es: 'Escala de los cuartos', cu: 'Escala de los cuartos', uk: 'Розмір кімнат', ru: 'Размер комнат', ti: 'ዓቐን ክፍልታት', fa: 'مقیاس اتاق‌ها', 'fa-AF': 'مقیاس اتاق‌ها', ar: 'مقياس الغرف', rw: 'Ingano y\'ibyumba' }),
  'arch.scale.dog': g('Den size is a Contest check (about 8–18 sq ft), not a people bedroom.', { es: 'El tamaño de la guarida se revisa en Concurso (unos 8–18 pies²), no es un dormitorio.', cu: 'El tamaño de la guarida se revisa en Concurso (unos 8–18 pies²), no es un dormitorio.', uk: 'Розмір лігва перевіряє Конкурс (близько 8–18 кв. футів), це не спальня.', ru: 'Размер логова проверяет Конкурс (около 8–18 кв. футов), это не спальня.', ti: 'ዓቐን በዓቲ ኣብ ውድድር ይምርመር (ኣስታት 8–18 sq ft)፣ መደቀሲ ሰብ ኣይኮነን።', fa: 'اندازه لانه در مسابقه بررسی می‌شود (حدود ۸ تا ۱۸ فوت مربع)، نه اتاق خواب آدم.', 'fa-AF': 'اندازه لانه در مسابقه بررسی می‌شود (حدود ۸ تا ۱۸ فت مربع)، نه اتاق خواب.', ar: 'حجم الوكر يُفحص في المسابقة (نحو 8–18 قدماً مربعاً)، لا غرفة نوم بشر.', rw: 'Ingano y\'icyari isuzumwa mu Irushanwa (hafi 8–18 sq ft), si icyumba cyo kuraramo.' }),
  'arch.scale.dogTip': g('Open Contest — Baboo has the textbook list.', { es: 'Abre Concurso: Baboo tiene la lista del libro.', cu: 'Abre Concurso: Baboo tiene la lista del libro.', uk: 'Відкрий Конкурс — у Baboo є список із підручника.', ru: 'Открой Конкурс — у Baboo есть список из учебника.', ti: 'ውድድር ክፈት — Baboo ዝርዝር መጽሓፍ ኣለዋ።', fa: 'مسابقه را باز کن — Baboo فهرست کتاب را دارد.', 'fa-AF': 'مسابقه را باز کن — Baboo فهرست کتاب را دارد.', ar: 'افتح المسابقة — لدى Baboo قائمة الكتاب.', rw: 'Fungura Irushanwa — Baboo afite urutonde rw\'igitabo.' }),
  'arch.scale.skip': g('Name rooms and we’ll ask if they feel like real sizes.', { es: 'Nombra los cuartos y veremos si tienen tamaños reales.', cu: 'Nombra los cuartos y veremos si tienen tamaños reales.', uk: 'Назви кімнати — і ми перевіримо, чи вони справжнього розміру.', ru: 'Назови комнаты — и мы проверим, настоящего ли они размера.', ti: 'ክፍልታት ሰምይ፣ ሓቀኛ ዓቐን ምዃኖም ክንሓትት ኢና።', fa: 'اتاق‌ها را نام‌گذاری کن تا ببینیم اندازه واقعی دارند یا نه.', 'fa-AF': 'اتاق‌ها را نام‌گذاری کن تا ببینیم اندازه واقعی دارند یا نه.', ar: 'سمِّ الغرف وسنسأل إن كانت بأحجام حقيقية.', rw: 'Ita ibyumba amazina turebe niba bifite ingano nyayo.' }),
  'arch.scale.skipTip': g('A bedroom wants about 10×10. A bath can be 5×8.', { es: 'Un dormitorio pide unos 10×10. Un baño puede ser 5×8.', cu: 'Un dormitorio pide unos 10×10. Un baño puede ser 5×8.', uk: 'Спальні потрібно близько 10×10. Ванна може бути 5×8.', ru: 'Спальне нужно около 10×10. Ванная может быть 5×8.', ti: 'መደቀሲ ኣስታት 10×10 ይደሊ። ባኞ 5×8 ክኸውን ይኽእል።', fa: 'اتاق خواب حدود ۱۰×۱۰ می‌خواهد. حمام می‌تواند ۵×۸ باشد.', 'fa-AF': 'اتاق خواب حدود ۱۰×۱۰ می‌خواهد. تشناب می‌تواند ۵×۸ باشد.', ar: 'غرفة النوم تحتاج نحو 10×10. الحمام يمكن أن يكون 5×8.', rw: 'Icyumba cyo kuraramo gikenera hafi 10×10. Ubwiherero bushobora kuba 5×8.' }),
  'arch.scale.open': g('{room} is tagged but the walls are not a closed shape.', { es: '{room} tiene nombre, pero las paredes no forman una figura cerrada.', cu: '{room} tiene nombre, pero las paredes no forman una figura cerrada.', uk: '{room} позначена, але стіни не утворюють замкненої форми.', ru: '{room} отмечена, но стены не образуют замкнутую форму.', ti: '{room} ተሰምዩ ግን መናድቕ ዝተዓጽወ ቅርጺ ኣይኮኑን።', fa: '{room} نام دارد ولی دیوارها شکل بسته‌ای نیستند.', 'fa-AF': '{room} نام دارد ولی دیوارها شکل بسته‌ای نیستند.', ar: '{room} مسمّى لكن الجدران ليست شكلاً مغلقاً.', rw: '{room} ifite izina ariko inkuta ntizifunze.' }),
  'arch.scale.openTip': g('Finish the walls around it, then read the square-foot label.', { es: 'Termina las paredes a su alrededor y luego lee la etiqueta de pies².', cu: 'Termina las paredes a su alrededor y luego lee la etiqueta de pies².', uk: 'Доведи стіни навколо, потім прочитай підпис площі.', ru: 'Доведи стены вокруг, потом прочитай подпись площади.', ti: 'ዙርያኡ ዘሎ መናድቕ ወድእ፣ ድሕሪኡ ምልክት ስፍሓት ኣንብብ።', fa: 'دیوارهای دورش را کامل کن، بعد برچسب فوت مربع را بخوان.', 'fa-AF': 'دیوارهای دورش را کامل کن، بعد برچسپ فت مربع را بخوان.', ar: 'أكمل الجدران حوله، ثم اقرأ تسمية القدم المربع.', rw: 'Rangiza inkuta ziyikikije, hanyuma usome ikirango cy\'ubuso.' }),
  'arch.scale.fail': g('{room} is {a} sq ft. This kind of room wants about {min}+ sq ft ({nice} feels better).', { es: '{room} mide {a} pies². Este tipo de cuarto pide unos {min}+ pies² ({nice} se siente mejor).', cu: '{room} mide {a} pies². Este tipo de cuarto pide unos {min}+ pies² ({nice} se siente mejor).', uk: '{room} — {a} кв. футів. Такій кімнаті потрібно близько {min}+ кв. футів ({nice} — краще).', ru: '{room} — {a} кв. футов. Такой комнате нужно около {min}+ кв. футов ({nice} — лучше).', ti: '{room} {a} sq ft እዩ። እዚ ዓይነት ክፍሊ ኣስታት {min}+ sq ft ይደሊ ({nice} ይበልጽ)።', fa: '{room} {a} فوت مربع است. این نوع اتاق حدود {min}+ فوت مربع می‌خواهد ({nice} بهتر است).', 'fa-AF': '{room} {a} فت مربع است. این نوع اتاق حدود {min}+ فت مربع می‌خواهد ({nice} بهتر است).', ar: '{room} مساحته {a} قدم مربع. هذا النوع من الغرف يحتاج نحو {min}+ قدم مربع ({nice} أفضل).', rw: '{room} ifite {a} sq ft. Ubu bwoko bw\'icyumba bukenera hafi {min}+ sq ft ({nice} ni byiza kurushaho).' }),
  'arch.scale.failTip': g('Nudge a wall. Size should match how the room is used.', { es: 'Mueve una pared. El tamaño debe ir con el uso del cuarto.', cu: 'Mueve una pared. El tamaño debe ir con el uso del cuarto.', uk: 'Посунь стіну. Розмір має відповідати тому, як кімнатою користуються.', ru: 'Сдвинь стену. Размер должен подходить к тому, как используют комнату.', ti: 'መንደቕ ኣግልስ። ዓቐን ምስ ኣጠቓቕማ ክፍሊ ክሰማማዕ ኣለዎ።', fa: 'یک دیوار را جابه‌جا کن. اندازه باید با کاربرد اتاق جور باشد.', 'fa-AF': 'یک دیوار را جابه‌جا کن. اندازه باید با کاربرد اتاق جور باشد.', ar: 'حرّك جداراً. يجب أن يناسب الحجم استخدام الغرفة.', rw: 'Imura urukuta. Ingano igomba guhuza n\'icyo icyumba gikoreshwa.' }),
  'arch.scale.warn': g('{room} is {a} sq ft — tight. About {nice} sq ft feels more real for this room.', { es: '{room} mide {a} pies²: justo. Unos {nice} pies² se sienten más reales.', cu: '{room} mide {a} pies²: justo. Unos {nice} pies² se sienten más reales.', uk: '{room} — {a} кв. футів, тісно. Близько {nice} кв. футів буде реальніше.', ru: '{room} — {a} кв. футов, тесно. Около {nice} кв. футов будет реальнее.', ti: '{room} {a} sq ft እዩ — ጸቢብ። ኣስታት {nice} sq ft ዝያዳ ሓቀኛ ይመስል።', fa: '{room} {a} فوت مربع است — تنگ. حدود {nice} فوت مربع واقعی‌تر است.', 'fa-AF': '{room} {a} فت مربع است — تنگ. حدود {nice} فت مربع واقعی‌تر است.', ar: '{room} مساحته {a} قدم مربع — ضيق. نحو {nice} قدم مربع أقرب للواقع.', rw: '{room} ifite {a} sq ft — harafunganye. Hafi {nice} sq ft byaba nyabyo kurushaho.' }),
  'arch.scale.warnTip': g('A little extra room is easier to furnish.', { es: 'Un poco más de espacio es más fácil de amueblar.', cu: 'Un poco más de espacio es más fácil de amueblar.', uk: 'Трохи більше місця легше вмеблювати.', ru: 'Немного больше места проще обставить.', ti: 'ቁሩብ ተወሳኺ ቦታ ንምስራዕ ይቐልል።', fa: 'کمی جای بیشتر چیدن وسایل را آسان‌تر می‌کند.', 'fa-AF': 'کمی جای بیشتر چیدن سامان را آسان‌تر می‌کند.', ar: 'قليل من المساحة الإضافية أسهل للتأثيث.', rw: 'Umwanya muto w\'inyongera woroshya gushyiramo ibikoresho.' }),
  'arch.scale.pass': g('Named rooms are in a size people can live in.', { es: 'Los cuartos con nombre tienen un tamaño habitable.', cu: 'Los cuartos con nombre tienen un tamaño habitable.', uk: 'Названі кімнати мають розмір, у якому можна жити.', ru: 'Названные комнаты такого размера, что в них можно жить.', ti: 'ዝተሰምዩ ክፍልታት ሰባት ክነብሩሉ ዝኽእሉ ዓቐን ኣለዎም።', fa: 'اتاق‌های نام‌گذاری‌شده اندازه‌ای دارند که می‌شود در آن زندگی کرد.', 'fa-AF': 'اتاق‌های نام‌گذاری‌شده اندازه‌ای دارند که می‌شود در آن زندگی کرد.', ar: 'الغرف المسمّاة بحجم يمكن العيش فيه.', rw: 'Ibyumba bifite amazina bifite ingano abantu babamo.' }),
  'arch.scale.passTip': g('Read the square-foot label. Does it match the furniture you put in?', { es: 'Lee la etiqueta de pies². ¿Va con los muebles que pusiste?', cu: 'Lee la etiqueta de pies². ¿Va con los muebles que pusiste?', uk: 'Прочитай підпис площі. Чи пасує він до меблів, які ти поставив?', ru: 'Прочитай подпись площади. Подходит ли она к мебели, которую ты поставил?', ti: 'ምልክት ስፍሓት ኣንብብ። ምስቲ ዘቐመጥካዮ ኣቑሑ ይሰማማዕ ዶ?', fa: 'برچسب فوت مربع را بخوان. با وسایلی که گذاشتی جور است؟', 'fa-AF': 'برچسپ فت مربع را بخوان. با سامانی که گذاشتی جور است؟', ar: 'اقرأ تسمية القدم المربع. هل تناسب الأثاث الذي وضعته؟', rw: 'Soma ikirango cy\'ubuso. Bihuye n\'ibikoresho washyizemo?' }),
  'arch.overall.title': g('Overall size', { es: 'Tamaño total', cu: 'Tamaño total', uk: 'Загальний розмір', ru: 'Общий размер', ti: 'ሓፈሻዊ ዓቐን', fa: 'اندازه کلی', 'fa-AF': 'اندازه کلی', ar: 'الحجم الكلي', rw: 'Ingano yose' }),
  'arch.overall.skip': g('Need an outside box before we can label overall width and depth.', { es: 'Hace falta una caja exterior para poner el ancho y fondo totales.', cu: 'Hace falta una caja exterior para poner el ancho y fondo totales.', uk: 'Потрібна зовнішня коробка, щоб підписати загальну ширину й глибину.', ru: 'Нужна внешняя коробка, чтобы подписать общую ширину и глубину.', ti: 'ሓፈሻዊ ስፍሓትን ዕሙቕን ንምልክት ደገዊ ሳጹን የድሊ።', fa: 'اول یک جعبه بیرونی لازم است تا عرض و عمق کلی را برچسب بزنیم.', 'fa-AF': 'اول یک صندوق بیرونی لازم است تا عرض و عمق کلی را برچسپ بزنیم.', ar: 'نحتاج صندوقاً خارجياً قبل أن نسمّي العرض والعمق الكليين.', rw: 'Hakenewe agasanduku k\'inyuma mbere yo kwandika ubugari n\'uburebure byose.' }),
  'arch.overall.skipTip': g('Size tool → two clicks. The sheet also draws overall ticks once walls close.', { es: 'Herramienta Medida → dos clics. La hoja también dibuja las marcas totales al cerrar las paredes.', cu: 'Herramienta Medida → dos clics. La hoja también dibuja las marcas totales al cerrar las paredes.', uk: 'Інструмент Розмір → два клацання. Коли стіни замкнуться, аркуш сам намалює загальні мітки.', ru: 'Инструмент Размер → два щелчка. Когда стены замкнутся, лист сам нарисует общие метки.', ti: 'መሳርሒ ዓቐን → ክልተ ጠውቕ። መናድቕ ምስ ተዓጽዉ ወረቐት ሓፈሻዊ ምልክታት ትስእል።', fa: 'ابزار اندازه ← دو کلیک. وقتی دیوارها بسته شوند، برگه علامت‌های کلی را هم می‌کشد.', 'fa-AF': 'ابزار اندازه ← دو کلیک. وقتی دیوارها بسته شوند، ورق علامه‌های کلی را هم رسم می‌کند.', ar: 'أداة المقاس ← نقرتان. ترسم الورقة علامات الحجم الكلي عندما تنغلق الجدران.', rw: 'Igikoresho cy\'Ingano → gukanda kabiri. Urupapuro rushushanya ibimenyetso byose iyo inkuta zifunze.' }),
  'arch.overall.warn': g('Envelope is {w} × {h}. Put at least one size label so someone else can read it.', { es: 'El recinto mide {w} × {h}. Pon al menos una etiqueta de medida para que otros lo lean.', cu: 'El recinto mide {w} × {h}. Pon al menos una etiqueta de medida para que otros lo lean.', uk: 'Оболонка {w} × {h}. Постав хоча б один підпис розміру, щоб інші могли прочитати.', ru: 'Оболочка {w} × {h}. Поставь хотя бы одну подпись размера, чтобы другие могли прочитать.', ti: 'ሽፋን {w} × {h} እዩ። ካልኦት ክንበብዎ ብውሑዱ ሓደ ምልክት ዓቐን ኣቐምጥ።', fa: 'پوسته {w} × {h} است. دست‌کم یک برچسب اندازه بگذار تا دیگران بخوانند.', 'fa-AF': 'پوسته {w} × {h} است. دست‌کم یک برچسپ اندازه بگذار تا دیگران بخوانند.', ar: 'الغلاف {w} × {h}. ضع تسمية مقاس واحدة على الأقل ليقرأها غيرك.', rw: 'Igikonoshwa ni {w} × {h}. Shyiraho nibura ikirango kimwe cy\'ingano kugira ngo abandi bagisome.' }),
  'arch.overall.warnTip': g('Size tool → click two ends of a wall. Overall ticks on the sheet are the architect’s outside numbers.', { es: 'Herramienta Medida → haz clic en los dos extremos de una pared. Las marcas totales de la hoja son los números exteriores del arquitecto.', cu: 'Herramienta Medida → haz clic en los dos extremos de una pared. Las marcas totales de la hoja son los números exteriores del arquitecto.', uk: 'Інструмент Розмір → клацни обидва кінці стіни. Загальні мітки на аркуші — зовнішні числа архітектора.', ru: 'Инструмент Размер → щёлкни оба конца стены. Общие метки на листе — внешние числа архитектора.', ti: 'መሳርሒ ዓቐን → ክልተ ጫፍ መንደቕ ጠውቕ። ሓፈሻዊ ምልክታት ኣብ ወረቐት ደገዊ ቁጽርታት ኣርክቴክት እዮም።', fa: 'ابزار اندازه ← روی دو سر یک دیوار کلیک کن. علامت‌های کلی روی برگه عددهای بیرونی معمار است.', 'fa-AF': 'ابزار اندازه ← روی دو سر یک دیوار کلیک کن. علامه‌های کلی روی ورق عددهای بیرونی معمار است.', ar: 'أداة المقاس ← انقر طرفي جدار. علامات الحجم الكلي على الورقة هي أرقام المعماري الخارجية.', rw: 'Igikoresho cy\'Ingano → kanda ku mpera ebyiri z\'urukuta. Ibimenyetso byose ku rupapuro ni imibare y\'inyuma y\'umwubatsi.' }),
  'arch.overall.pass1': g('Envelope {w} × {h} · 1 size label on the sheet.', { es: 'Recinto {w} × {h} · 1 etiqueta de medida en la hoja.', cu: 'Recinto {w} × {h} · 1 etiqueta de medida en la hoja.', uk: 'Оболонка {w} × {h} · 1 підпис розміру на аркуші.', ru: 'Оболочка {w} × {h} · 1 подпись размера на листе.', ti: 'ሽፋን {w} × {h} · 1 ምልክት ዓቐን ኣብ ወረቐት።', fa: 'پوسته {w} × {h} · ۱ برچسب اندازه روی برگه.', 'fa-AF': 'پوسته {w} × {h} · ۱ برچسپ اندازه روی ورق.', ar: 'الغلاف {w} × {h} · تسمية مقاس واحدة على الورقة.', rw: 'Igikonoshwa {w} × {h} · ikirango 1 cy\'ingano ku rupapuro.' }),
  'arch.overall.pass': g('Envelope {w} × {h} · {n} size labels on the sheet.', { es: 'Recinto {w} × {h} · {n} etiquetas de medida en la hoja.', cu: 'Recinto {w} × {h} · {n} etiquetas de medida en la hoja.', uk: 'Оболонка {w} × {h} · підписів розміру на аркуші: {n}.', ru: 'Оболочка {w} × {h} · подписей размера на листе: {n}.', ti: 'ሽፋን {w} × {h} · {n} ምልክታት ዓቐን ኣብ ወረቐት።', fa: 'پوسته {w} × {h} · {n} برچسب اندازه روی برگه.', 'fa-AF': 'پوسته {w} × {h} · {n} برچسپ اندازه روی ورق.', ar: 'الغلاف {w} × {h} · {n} تسميات مقاس على الورقة.', rw: 'Igikonoshwa {w} × {h} · ibirango {n} by\'ingano ku rupapuro.' }),
  'arch.overall.passTip': g('Outside numbers are overall. Inside numbers are rooms.', { es: 'Los números de afuera son totales. Los de adentro son cuartos.', cu: 'Los números de afuera son totales. Los de adentro son cuartos.', uk: 'Зовнішні числа — загальні. Внутрішні — кімнати.', ru: 'Внешние числа — общие. Внутренние — комнаты.', ti: 'ደገውቲ ቁጽርታት ሓፈሻዊ እዮም። ውሽጣውያን ክፍልታት እዮም።', fa: 'عددهای بیرونی کلی‌اند. عددهای داخلی اتاق‌ها هستند.', 'fa-AF': 'عددهای بیرونی کلی‌اند. عددهای داخلی اتاق‌ها هستند.', ar: 'الأرقام الخارجية كلية. الأرقام الداخلية للغرف.', rw: 'Imibare y\'inyuma ni iy\'inzu yose. Iy\'imbere ni iy\'ibyumba.' }),
  'arch.tri.title': g('Kitchen work triangle', { es: 'Triángulo de trabajo de la cocina', cu: 'Triángulo de trabajo de la cocina', uk: 'Робочий трикутник кухні', ru: 'Рабочий треугольник кухни', ti: 'ሰለስተ ኩርናዕ ስራሕ ክሽነ', fa: 'مثلث کار آشپزخانه', 'fa-AF': 'مثلث کار آشپزخانه', ar: 'مثلث العمل في المطبخ', rw: 'Mpandeshatu y\'akazi k\'igikoni' }),
  'arch.tri.dog': g('No kitchen in a den.', { es: 'No hay cocina en una guarida.', cu: 'No hay cocina en una guarida.', uk: 'У лігві немає кухні.', ru: 'В логове нет кухни.', ti: 'ኣብ በዓቲ ክሽነ የለን።', fa: 'لانه آشپزخانه ندارد.', 'fa-AF': 'لانه آشپزخانه ندارد.', ar: 'لا مطبخ في الوكر.', rw: 'Nta gikoni mu cyari.' }),
  'arch.tri.dogTip': g('People houses: sink, stove, fridge — keep the three walks short.', { es: 'Casas de personas: fregadero, estufa, refrigerador; que los tres trayectos sean cortos.', cu: 'Casas de personas: fregadero, estufa, refrigerador; que los tres trayectos sean cortos.', uk: 'Будинки для людей: мийка, плита, холодильник — три переходи мають бути короткими.', ru: 'Дома для людей: мойка, плита, холодильник — три перехода должны быть короткими.', ti: 'ገዛ ሰባት፦ መሕጸቢ፣ ምድጃ፣ ፍሪጅ — እቶም ሰለስተ ጉዕዞታት ሓጸርቲ ይኹኑ።', fa: 'خانه آدم‌ها: سینک، اجاق، یخچال — سه مسیر را کوتاه نگه دار.', 'fa-AF': 'خانه مردم: دستشوی، داش، یخچال — سه راه را کوتاه نگه دار.', ar: 'بيوت الناس: الحوض والموقد والثلاجة — اجعل المسافات الثلاث قصيرة.', rw: 'Amazu y\'abantu: iyozero, iziko, firigo — inzira eshatu zigume ngufi.' }),
  'arch.tri.none': g('No sink, stove, or fridge yet.', { es: 'Aún no hay fregadero, estufa ni refrigerador.', cu: 'Aún no hay fregadero, estufa ni refrigerador.', uk: 'Ще немає мийки, плити чи холодильника.', ru: 'Пока нет мойки, плиты или холодильника.', ti: 'ገና መሕጸቢ፣ ምድጃ ወይ ፍሪጅ የለን።', fa: 'هنوز سینک، اجاق یا یخچالی نیست.', 'fa-AF': 'هنوز دستشوی، داش یا یخچالی نیست.', ar: 'لا حوض ولا موقد ولا ثلاجة بعد.', rw: 'Nta yozero, iziko cyangwa firigo biraho.' }),
  'arch.tri.noneTip': g('Furniture → kitchen pieces. The three walks between them are the work triangle.', { es: 'Muebles → piezas de cocina. Los tres trayectos entre ellas son el triángulo de trabajo.', cu: 'Muebles → piezas de cocina. Los tres trayectos entre ellas son el triángulo de trabajo.', uk: 'Меблі → кухонні речі. Три переходи між ними — робочий трикутник.', ru: 'Мебель → кухонные вещи. Три перехода между ними — рабочий треугольник.', ti: 'ኣቑሑ → ኣቑሑ ክሽነ። እቶም ሰለስተ ጉዕዞታት ኣብ መንጎኦም ሰለስተ ኩርናዕ ስራሕ እዮም።', fa: 'وسایل ← وسایل آشپزخانه. سه مسیر بین آن‌ها مثلث کار است.', 'fa-AF': 'سامان ← سامان آشپزخانه. سه راه بین آن‌ها مثلث کار است.', ar: 'الأثاث ← قطع المطبخ. المسافات الثلاث بينها هي مثلث العمل.', rw: 'Ibikoresho → ibikoresho by\'igikoni. Inzira eshatu hagati yabyo ni mpandeshatu y\'akazi.' }),
  'arch.tri.missing': g('Kitchen is missing {list}. Need all three to measure the triangle.', { es: 'A la cocina le falta: {list}. Hacen falta los tres para medir el triángulo.', cu: 'A la cocina le falta: {list}. Hacen falta los tres para medir el triángulo.', uk: 'На кухні бракує: {list}. Щоб виміряти трикутник, потрібні всі три.', ru: 'На кухне не хватает: {list}. Чтобы измерить треугольник, нужны все три.', ti: 'ክሽነ {list} ይጎድሎ። ሰለስተ ኩርናዕ ንምዕቃን ሰለስቲኦም የድልዩ።', fa: 'آشپزخانه {list} ندارد. برای اندازه‌گیری مثلث هر سه لازم است.', 'fa-AF': 'آشپزخانه {list} ندارد. برای اندازه‌گیری مثلث هر سه لازم است.', ar: 'ينقص المطبخ: {list}. نحتاج الثلاثة لقياس المثلث.', rw: 'Igikoni kibura {list}. Hakenewe byose uko ari bitatu ngo dupime mpandeshatu.' }),
  'arch.tri.missingTip': g('Sink, stove, fridge. Not in a line if you can help it.', { es: 'Fregadero, estufa, refrigerador. Mejor si no están en línea.', cu: 'Fregadero, estufa, refrigerador. Mejor si no están en línea.', uk: 'Мийка, плита, холодильник. Краще не в одну лінію.', ru: 'Мойка, плита, холодильник. Лучше не в одну линию.', ti: 'መሕጸቢ፣ ምድጃ፣ ፍሪጅ። እንተተኻኢሉ ኣብ ሓደ መስመር ኣይኹኑ።', fa: 'سینک، اجاق، یخچال. اگر بشود، نه در یک خط.', 'fa-AF': 'دستشوی، داش، یخچال. اگر بشود، نه در یک خط.', ar: 'حوض، موقد، ثلاجة. الأفضل ألا تكون في خط واحد.', rw: 'Iyozero, iziko, firigo. Niba bishoboka, ntibibe ku murongo umwe.' }),
  'arch.tri.ok': g('Walks {a}, {b}, {c} · total {s}.', { es: 'Trayectos {a}, {b}, {c} · total {s}.', cu: 'Trayectos {a}, {b}, {c} · total {s}.', uk: 'Переходи {a}, {b}, {c} · разом {s}.', ru: 'Переходы {a}, {b}, {c} · всего {s}.', ti: 'ጉዕዞታት {a}፣ {b}፣ {c} · ድምር {s}።', fa: 'مسیرها {a}، {b}، {c} · جمع {s}.', 'fa-AF': 'راه‌ها {a}، {b}، {c} · جمع {s}.', ar: 'المسافات {a}، {b}، {c} · المجموع {s}.', rw: 'Inzira {a}, {b}, {c} · zose hamwe {s}.' }),
  'arch.tri.bad': g('Walks {a}, {b}, {c} · total {s}. Want each 4–9 ft, total about 13–26 ft.', { es: 'Trayectos {a}, {b}, {c} · total {s}. Cada uno de 4–9 pies, total de unos 13–26 pies.', cu: 'Trayectos {a}, {b}, {c} · total {s}. Cada uno de 4–9 pies, total de unos 13–26 pies.', uk: 'Переходи {a}, {b}, {c} · разом {s}. Кожен 4–9 футів, разом близько 13–26 футів.', ru: 'Переходы {a}, {b}, {c} · всего {s}. Каждый 4–9 футов, всего около 13–26 футов.', ti: 'ጉዕዞታት {a}፣ {b}፣ {c} · ድምር {s}። ነፍሲ ወከፍ 4–9 ጫማ፣ ድምር ኣስታት 13–26 ጫማ።', fa: 'مسیرها {a}، {b}، {c} · جمع {s}. هر کدام ۴ تا ۹ فوت، جمع حدود ۱۳ تا ۲۶ فوت.', 'fa-AF': 'راه‌ها {a}، {b}، {c} · جمع {s}. هر کدام ۴ تا ۹ فت، جمع حدود ۱۳ تا ۲۶ فت.', ar: 'المسافات {a}، {b}، {c} · المجموع {s}. كل واحدة 4–9 أقدام، والمجموع نحو 13–26 قدماً.', rw: 'Inzira {a}, {b}, {c} · zose hamwe {s}. Buri imwe ft 4–9, zose hafi ft 13–26.' }),
  'arch.tri.tip': g('Keep the cook’s three steps short. A dining table in the middle stretches them.', { es: 'Que los tres pasos de quien cocina sean cortos. Una mesa en medio los alarga.', cu: 'Que los tres pasos de quien cocina sean cortos. Una mesa en medio los alarga.', uk: 'Три кроки кухаря мають бути короткими. Обідній стіл посередині їх подовжує.', ru: 'Три шага повара должны быть короткими. Обеденный стол посередине их удлиняет.', ti: 'እቶም ሰለስተ ስጉምትታት ኣብሳሊ ሓጸርቲ ይኹኑ። ኣብ ማእከል ዘሎ ጣውላ መመገቢ የናውሖም።', fa: 'سه قدم آشپز را کوتاه نگه دار. میز ناهار وسط آن‌ها را بلند می‌کند.', 'fa-AF': 'سه قدم آشپز را کوتاه نگه دار. میز نان وسط آن‌ها را دراز می‌کند.', ar: 'اجعل خطوات الطاهي الثلاث قصيرة. طاولة الطعام في الوسط تطيلها.', rw: 'Intambwe eshatu z\'utetse zigume ngufi. Ameza yo kuriraho hagati azongera.' }),
  // 2.13.51: the Dog House contest checks and Teaching labels in every language. ti, fa-AF and rw are UNCHECKED native copy.
  'news.dogWords': g('Baboo’s Dog House contest and the Teach panel labels are in your language.', { es: 'El concurso de la casita de perro de Baboo y las etiquetas del panel Enseñar están en tu idioma.', cu: 'El concurso de la casita de perro de Baboo y las etiquetas del panel Enseñar están en tu idioma.', uk: 'Конкурс будок Baboo і підписи панелі Навчання — твоєю мовою.', ru: 'Конкурс будок Baboo и подписи панели Обучение — на твоём языке.', ti: 'ውድድር ገዛ ከልቢ Baboo ን ምልክታት መምሃሪ ፓነልን ብቋንቋኻ እዮም።', fa: 'مسابقه لانه سگ Baboo و برچسب‌های پنل آموزش به زبان تو هستند.', 'fa-AF': 'مسابقه خانه سگ Baboo و برچسپ‌های پنل آموزش به زبان تو هستند.', ar: 'مسابقة بيت الكلب من Baboo وتسميات لوحة التعليم بلغتك.', rw: 'Irushanwa ry\'inzu y\'imbwa rya Baboo n\'ibirango by\'akanama ko Kwigisha biri mu rurimi rwawe.' }),
  'teach.areaLabel': g('Approx. floor area:', { es: 'Área aprox. del piso:', cu: 'Área aprox. del piso:', uk: 'Приблизна площа:', ru: 'Примерная площадь:', ti: 'ግምታዊ ስፍሓት ባይታ፦', fa: 'مساحت تقریبی کف:', 'fa-AF': 'مساحت تقریبی فرش:', ar: 'مساحة الأرضية التقريبية:', rw: 'Ubuso bwa hasi bugereranyije:' }),
  'teach.areaVal': g('{n} sq ft', { es: '{n} pies²', cu: '{n} pies²', uk: '{n} кв. футів', ru: '{n} кв. футов', ti: '{n} sq ft', fa: '{n} فوت مربع', 'fa-AF': '{n} فت مربع', ar: '{n} قدم مربع', rw: '{n} sq ft' }),
  'teach.areaNone': g('— (draw outside walls)', { es: '— (dibuja las paredes exteriores)', cu: '— (dibuja las paredes exteriores)', uk: '— (намалюй зовнішні стіни)', ru: '— (нарисуй наружные стены)', ti: '— (ደገዊ መናድቕ ስኣል)', fa: '— (دیوارهای بیرونی را بکش)', 'fa-AF': '— (دیوارهای بیرونی را رسم کن)', ar: '— (ارسم الجدران الخارجية)', rw: '— (shushanya inkuta zo hanze)' }),
  'teach.roofLabel': g('Roof on this plan:', { es: 'Techo de este plano:', cu: 'Techo de este plano:', uk: 'Дах на цьому плані:', ru: 'Крыша на этом плане:', ti: 'ናሕሲ ኣብዚ ትልሚ፦', fa: 'سقف این نقشه:', 'fa-AF': 'بام این نقشه:', ar: 'سقف هذا المخطط:', rw: 'Igisenge cy\'iki gishushanyo:' }),
  'teach.roofAsk': g('— can you name it without looking?', { es: '— ¿puedes nombrarlo sin mirar?', cu: '— ¿puedes nombrarlo sin mirar?', uk: '— чи назвеш його, не дивлячись?', ru: '— сможешь назвать её, не глядя?', ti: '— ከይረኣኻ ክትሰምዮ ትኽእል ዲኻ?', fa: '— می‌توانی بدون نگاه کردن نامش را بگویی؟', 'fa-AF': '— می‌توانی بدون دیدن نامش را بگویی؟', ar: '— هل تستطيع تسميته دون أن تنظر؟', rw: '— ushobora kukivuga utarebye?' }),
  'teach.roofPick': g('— pick one in Settings', { es: '— elige uno en Ajustes', cu: '— elige uno en Ajustes', uk: '— вибери в Налаштуваннях', ru: '— выбери в Настройках', ti: '— ኣብ ምድላዋት ምረጽ', fa: '— در تنظیمات یکی را انتخاب کن', 'fa-AF': '— در تنظیمات یکی را انتخاب کن', ar: '— اختر واحداً من الإعدادات', rw: '— hitamo kimwe mu Igenamiterere' }),
  'teach.styleTerm': g('Style term', { es: 'Término de estilo', cu: 'Término de estilo', uk: 'Назва стилю', ru: 'Название стиля', ti: 'ስም ቅዲ', fa: 'اصطلاح سبک', 'fa-AF': 'اصطلاح سبک', ar: 'مصطلح الطراز', rw: 'Izina ry\'imiterere' }),
  'teach.badge': g('{badge} assignment linked', { es: 'Tarea {badge} vinculada', cu: 'Tarea {badge} vinculada', uk: 'Завдання {badge} під\'єднано', ru: 'Задание {badge} подключено', ti: 'ዕማም {badge} ተኣሳሲሩ', fa: 'تکلیف {badge} وصل شد', 'fa-AF': 'کارخانگی {badge} وصل شد', ar: 'تم ربط مهمة {badge}', rw: 'Umukoro {badge} uhujwe' }),
  'teach.reflect': g('Build reflections', { es: 'Reflexiones de la obra', cu: 'Reflexiones de la obra', uk: 'Роздуми про будову', ru: 'Размышления о постройке', ti: 'ሓሳባት ህንጻ', fa: 'تأمل درباره ساخت', 'fa-AF': 'تأمل درباره ساخت', ar: 'تأملات البناء', rw: 'Ibitekerezo ku nyubako' }),
  'teach.rooms': g('Named rooms', { es: 'Cuartos con nombre', cu: 'Cuartos con nombre', uk: 'Названі кімнати', ru: 'Названные комнаты', ti: 'ዝተሰምዩ ክፍልታት', fa: 'اتاق‌های نام‌گذاری‌شده', 'fa-AF': 'اتاق‌های نام‌گذاری‌شده', ar: 'غرف مسمّاة', rw: 'Ibyumba bifite amazina' }),
  'teach.roomsHow': g('Room tool → pick a type → click inside closed walls.', { es: 'Herramienta Cuarto → elige un tipo → haz clic dentro de paredes cerradas.', cu: 'Herramienta Cuarto → elige un tipo → haz clic dentro de paredes cerradas.', uk: 'Інструмент Кімната → вибери тип → клацни всередині замкнених стін.', ru: 'Инструмент Комната → выбери тип → щёлкни внутри замкнутых стен.', ti: 'መሳርሒ ክፍሊ → ዓይነት ምረጽ → ኣብ ውሽጢ ዝተዓጽዉ መናድቕ ጠውቕ።', fa: 'ابزار اتاق ← نوع را انتخاب کن ← داخل دیوارهای بسته کلیک کن.', 'fa-AF': 'ابزار اتاق ← نوع را انتخاب کن ← داخل دیوارهای بسته کلیک کن.', ar: 'أداة الغرفة ← اختر نوعاً ← انقر داخل جدران مغلقة.', rw: 'Igikoresho cy\'Icyumba → hitamo ubwoko → kanda imbere mu nkuta zifunze.' }),
  'teach.addRoom': g('— add with Room', { es: '— agrégalo con Cuarto', cu: '— agrégalo con Cuarto', uk: '— додай інструментом Кімната', ru: '— добавь инструментом Комната', ti: '— ብመሳርሒ ክፍሊ ወስኽ', fa: '— با ابزار اتاق اضافه کن', 'fa-AF': '— با ابزار اتاق اضافه کن', ar: '— أضفه بأداة الغرفة', rw: '— ongeraho ukoresheje Icyumba' }),
  'teach.check.living': g('Living / dining', { es: 'Sala / comedor', cu: 'Sala / comedor', uk: 'Вітальня / їдальня', ru: 'Гостиная / столовая', ti: 'መሕደሪ / መመገቢ', fa: 'نشیمن / ناهارخوری', 'fa-AF': 'نشیمن / نان‌خوری', ar: 'معيشة / طعام', rw: 'Uruganiriro / aho kuririra' }),
  'teach.check.kitchen': g('Kitchen', { es: 'Cocina', cu: 'Cocina', uk: 'Кухня', ru: 'Кухня', ti: 'ክሽነ', fa: 'آشپزخانه', 'fa-AF': 'آشپزخانه', ar: 'مطبخ', rw: 'Igikoni' }),
  'teach.check.bath': g('Bath', { es: 'Baño', cu: 'Baño', uk: 'Ванна', ru: 'Ванная', ti: 'ባኞ', fa: 'حمام', 'fa-AF': 'تشناب', ar: 'حمام', rw: 'Ubwiherero' }),
  'teach.check.sleep': g('Bedroom / sleep', { es: 'Dormitorio', cu: 'Dormitorio', uk: 'Спальня', ru: 'Спальня', ti: 'መደቀሲ', fa: 'اتاق خواب', 'fa-AF': 'اتاق خواب', ar: 'غرفة نوم', rw: 'Icyumba cyo kuraramo' }),
  'teach.check.entry': g('Entry', { es: 'Entrada', cu: 'Entrada', uk: 'Вхід', ru: 'Вход', ti: 'መእተዊ', fa: 'ورودی', 'fa-AF': 'دهلیز ورودی', ar: 'مدخل', rw: 'Aho kwinjirira' }),
  'teach.util': g('Utility + storage checklist', { es: 'Lista de servicio y almacén', cu: 'Lista de servicio y almacén', uk: 'Перелік: господарське й зберігання', ru: 'Список: подсобка и хранение', ti: 'ዝርዝር ኣገልግሎትን መኽዘንን', fa: 'فهرست خدمات و انباری', 'fa-AF': 'فهرست خدمات و گدام', ar: 'قائمة الخدمات والتخزين', rw: 'Urutonde rw\'aho kumesera n\'ububiko' }),
  'teach.utilLead': g('Every student project needs common-sense spaces.', { es: 'Todo proyecto necesita espacios de sentido común.', cu: 'Todo proyecto necesita espacios de sentido común.', uk: 'Кожен проєкт потребує простих потрібних місць.', ru: 'Каждому проекту нужны простые нужные места.', ti: 'ነፍሲ ወከፍ ፕሮጀክት ተማሃራይ ኣድለይቲ ቦታታት የድልዮ።', fa: 'هر پروژه به فضاهای ساده و لازم نیاز دارد.', 'fa-AF': 'هر پروژه به فضاهای ساده و لازم نیاز دارد.', ar: 'كل مشروع يحتاج مساحات بديهية.', rw: 'Buri mushinga ukenera ahantu h\'ingenzi.' }),
  'teach.util.water-heater': g('Water heater (or mech closet)', { es: 'Calentador de agua (o cuarto de máquinas)', cu: 'Calentador de agua (o cuarto de máquinas)', uk: 'Бойлер (або технічна шафа)', ru: 'Бойлер (или техшкаф)', ti: 'መውዓዪ ማይ (ወይ ክፍሊ መካኒክ)', fa: 'آبگرمکن (یا کمد تأسیسات)', 'fa-AF': 'آبگرمی (یا الماری تأسیسات)', ar: 'سخان ماء (أو خزانة الأجهزة)', rw: 'Icyuma gishyushya amazi (cyangwa akabati k\'imashini)' }),
  'teach.util.washer': g('Washer (laundry)', { es: 'Lavadora (lavandería)', cu: 'Lavadora (lavandería)', uk: 'Пральна машина', ru: 'Стиральная машина', ti: 'መሕጸቢ ክዳን', fa: 'ماشین لباسشویی', 'fa-AF': 'ماشین کالاشویی', ar: 'غسالة (غسيل)', rw: 'Imashini imesa' }),
  'teach.util.closet': g('Closet / storage', { es: 'Clóset / almacén', cu: 'Clóset / almacén', uk: 'Шафа / комора', ru: 'Шкаф / кладовая', ti: 'ቁም ሳጹን / መኽዘን', fa: 'کمد / انباری', 'fa-AF': 'الماری / گدام', ar: 'خزانة / تخزين', rw: 'Akabati / ububiko' }),
  'teach.addFurn': g('— add from Furniture → {cat}', { es: '— agrégalo desde Muebles → {cat}', cu: '— agrégalo desde Muebles → {cat}', uk: '— додай із Меблі → {cat}', ru: '— добавь из Мебель → {cat}', ti: '— ካብ ኣቑሑ → {cat} ወስኽ', fa: '— از وسایل ← {cat} اضافه کن', 'fa-AF': '— از سامان ← {cat} اضافه کن', ar: '— أضف من الأثاث ← {cat}', rw: '— ongeraho uvuye mu Bikoresho → {cat}' }),
  'teach.catalog': g('Catalog:', { es: 'Catálogo:', cu: 'Catálogo:', uk: 'Каталог:', ru: 'Каталог:', ti: 'ካታሎግ፦', fa: 'فهرست:', 'fa-AF': 'فهرست:', ar: 'الكتالوج:', rw: 'Urutonde:' }),
  'dog.den.title': g('A closed den', { es: 'Una guarida cerrada', cu: 'Una guarida cerrada', uk: 'Закрите лігво', ru: 'Закрытое логово', ti: 'ዝተዓጽወ በዓቲ', fa: 'لانه بسته', 'fa-AF': 'لانه بسته', ar: 'وكر مغلق', rw: 'Icyari gifunze' }),
  'dog.den.fail': g('Walls don’t meet yet. A dog house is a closed box — rain stays out.', { es: 'Las paredes aún no se juntan. Una casita de perro es una caja cerrada: la lluvia queda fuera.', cu: 'Las paredes aún no se juntan. Una casita de perro es una caja cerrada: la lluvia queda fuera.', uk: 'Стіни ще не сходяться. Будка — це закрита коробка, дощ лишається надворі.', ru: 'Стены ещё не сходятся. Будка — это закрытая коробка, дождь остаётся снаружи.', ti: 'መናድቕ ገና ኣይተራኸቡን። ገዛ ከልቢ ዝተዓጽወ ሳጹን እዩ — ዝናብ ኣብ ደገ ይተርፍ።', fa: 'دیوارها هنوز به هم نرسیده‌اند. لانه سگ یک جعبه بسته است — باران بیرون می‌ماند.', 'fa-AF': 'دیوارها هنوز به هم نرسیده‌اند. خانه سگ یک صندوق بسته است — باران بیرون می‌ماند.', ar: 'الجدران لم تلتقِ بعد. بيت الكلب صندوق مغلق — يبقى المطر خارجاً.', rw: 'Inkuta ntiziragera ku zindi. Inzu y\'imbwa ni agasanduku gafunze — imvura iguma hanze.' }),
  'dog.den.failTip': g('Sketch, then Trace, or Wall until the corners meet.', { es: 'Dibuja y luego Traza, o usa Pared hasta que se junten las esquinas.', cu: 'Dibuja y luego Traza, o usa Pared hasta que se junten las esquinas.', uk: 'Намалюй, потім Обвести, або Стіна, доки кути не зійдуться.', ru: 'Нарисуй, потом Обвести, или Стена, пока углы не сойдутся.', ti: 'ስኣል፣ ድሕሪኡ ስዓብ፣ ወይ መንደቕ ክሳዕ ኩርናዓት ዝራኸቡ።', fa: 'طرح بزن، بعد دنبال کن، یا دیوار بکش تا گوشه‌ها به هم برسند.', 'fa-AF': 'طرح بزن، بعد دنبال کن، یا دیوار رسم کن تا کنج‌ها به هم برسند.', ar: 'ارسم ثم شفّف، أو استخدم الجدار حتى تلتقي الزوايا.', rw: 'Shushanya, hanyuma Kurikiza, cyangwa Urukuta kugeza inguni zihuye.' }),
  'dog.den.pass': g('The walls meet. That’s a shelter.', { es: 'Las paredes se juntan. Eso es un refugio.', cu: 'Las paredes se juntan. Eso es un refugio.', uk: 'Стіни сходяться. Це вже укриття.', ru: 'Стены сходятся. Это уже укрытие.', ti: 'መናድቕ ተራኺቦም። እዚ መዕቆቢ እዩ።', fa: 'دیوارها به هم رسیدند. این یک پناهگاه است.', 'fa-AF': 'دیوارها به هم رسیدند. این یک پناهگاه است.', ar: 'الجدران تلتقي. هذا مأوى.', rw: 'Inkuta zirahuye. Ubu ni ubuhungiro.' }),
  'dog.den.passTip': g('Keep it one room — a den, not a people plan.', { es: 'Que sea un solo cuarto: una guarida, no un plano para personas.', cu: 'Que sea un solo cuarto: una guarida, no un plano para personas.', uk: 'Залиш одну кімнату — лігво, а не план для людей.', ru: 'Оставь одну комнату — логово, а не план для людей.', ti: 'ሓደ ክፍሊ ይኹን — በዓቲ፣ ትልሚ ሰባት ኣይኮነን።', fa: 'یک اتاق بماند — لانه، نه نقشه برای آدم‌ها.', 'fa-AF': 'یک اتاق بماند — لانه، نه نقشه برای مردم.', ar: 'اجعله غرفة واحدة — وكراً لا مخطط بيت للناس.', rw: 'Bigume icyumba kimwe — icyari, si igishushanyo cy\'abantu.' }),
  'dog.scale.title': g('Just large enough', { es: 'Del tamaño justo', cu: 'Del tamaño justo', uk: 'Якраз достатньо', ru: 'Как раз достаточно', ti: 'ልክዕ ዝኣክል', fa: 'به اندازه کافی', 'fa-AF': 'به اندازه کافی', ar: 'كبير بما يكفي تماماً', rw: 'Bingana neza' }),
  'dog.scale.skip': g('Close the den before we talk size.', { es: 'Cierra la guarida antes de hablar de tamaño.', cu: 'Cierra la guarida antes de hablar de tamaño.', uk: 'Закрий лігво, перш ніж говорити про розмір.', ru: 'Закрой логово, прежде чем говорить о размере.', ti: 'ቅድሚ ብዛዕባ ዓቐን ምዝራብና በዓቲ ዕጸዎ።', fa: 'اول لانه را ببند، بعد درباره اندازه حرف می‌زنیم.', 'fa-AF': 'اول لانه را ببند، بعد درباره اندازه گپ می‌زنیم.', ar: 'أغلق الوكر قبل أن نتحدث عن الحجم.', rw: 'Banza ufunge icyari mbere yo kuvuga ingano.' }),
  'dog.scale.skipTip': g('Textbook: big enough to stand, turn, and lie down — small enough to warm with body heat.', { es: 'Libro: lo bastante grande para pararse, girar y echarse; lo bastante chica para calentarla con el cuerpo.', cu: 'Libro: lo bastante grande para pararse, girar y echarse; lo bastante chica para calentarla con el cuerpo.', uk: 'Підручник: досить велика, щоб стояти, повертатися й лежати, і досить мала, щоб зігріти теплом тіла.', ru: 'Учебник: достаточно большая, чтобы стоять, поворачиваться и лежать, и достаточно маленькая, чтобы согреть теплом тела.', ti: 'መጽሓፍ፦ ንምቁም፣ ንምዝዋርን ንምድቃስን ዝኣክል — ብሙቐት ኣካል ክሞቕ ዝኽእል ንእሽቶ።', fa: 'کتاب: آن‌قدر بزرگ که بایستد، بچرخد و دراز بکشد — آن‌قدر کوچک که با گرمای بدن گرم شود.', 'fa-AF': 'کتاب: آن‌قدر بزرگ که بایستد، بچرخد و دراز بکشد — آن‌قدر کوچک که با گرمی بدن گرم شود.', ar: 'الكتاب: كبير بما يكفي للوقوف والدوران والاستلقاء — وصغير بما يكفي ليُدفأ بحرارة الجسم.', rw: 'Igitabo: kinini bihagije ngo ihagarare, ihindukire kandi iryame — gito bihagije ngo gishyuhe n\'ubushyuhe bw\'umubiri.' }),
  'dog.scale.pass': g('{area} sq ft. I can warm this with my own heat.', { es: '{area} pies². Puedo calentarla con mi propio calor.', cu: '{area} pies². Puedo calentarla con mi propio calor.', uk: '{area} кв. футів. Я зігрію це своїм теплом.', ru: '{area} кв. футов. Я согрею это своим теплом.', ti: '{area} sq ft። ብናይ ገዛእ ርእሰይ ሙቐት ከሙቖ እኽእል።', fa: '{area} فوت مربع. می‌توانم با گرمای خودم گرمش کنم.', 'fa-AF': '{area} فت مربع. می‌توانم با گرمی خودم گرمش کنم.', ar: '{area} قدم مربع. أستطيع تدفئته بحرارتي.', rw: '{area} sq ft. Nshobora kugishyushya n\'ubushyuhe bwanjye.' }),
  'dog.scale.passTip': g('Textbook size for a medium dog: about 8–18 sq ft.', { es: 'Tamaño de libro para un perro mediano: unos 8–18 pies².', cu: 'Tamaño de libro para un perro mediano: unos 8–18 pies².', uk: 'Розмір за підручником для середнього пса: близько 8–18 кв. футів.', ru: 'Размер по учебнику для средней собаки: около 8–18 кв. футов.', ti: 'ዓቐን መጽሓፍ ንማእከላይ ከልቢ፦ ኣስታት 8–18 sq ft።', fa: 'اندازه کتابی برای سگ متوسط: حدود ۸ تا ۱۸ فوت مربع.', 'fa-AF': 'اندازه کتابی برای سگ متوسط: حدود ۸ تا ۱۸ فت مربع.', ar: 'الحجم في الكتاب لكلب متوسط: نحو 8–18 قدماً مربعاً.', rw: 'Ingano y\'igitabo ku mbwa iringaniye: hafi 8–18 sq ft.' }),
  'dog.scale.warnSnug': g('{area} sq ft — close, but snug for body heat.', { es: '{area} pies²: cerca, pero justa para el calor del cuerpo.', cu: '{area} pies²: cerca, pero justa para el calor del cuerpo.', uk: '{area} кв. футів — близько, але тіснувато.', ru: '{area} кв. футов — близко, но тесновато.', ti: '{area} sq ft — ቀሪቡ፣ ግን ጸቢብ እዩ።', fa: '{area} فوت مربع — نزدیک است، ولی کمی تنگ.', 'fa-AF': '{area} فت مربع — نزدیک است، ولی کمی تنگ.', ar: '{area} قدم مربع — قريب، لكنه ضيق قليلاً.', rw: '{area} sq ft — hafi, ariko harafunganye gato.' }),
  'dog.scale.warnRoomy': g('{area} sq ft — close, but a bit roomy for body heat.', { es: '{area} pies²: cerca, pero algo amplia para el calor del cuerpo.', cu: '{area} pies²: cerca, pero algo amplia para el calor del cuerpo.', uk: '{area} кв. футів — близько, але трохи завелике для тепла тіла.', ru: '{area} кв. футов — близко, но великовато для тепла тела.', ti: '{area} sq ft — ቀሪቡ፣ ግን ንሙቐት ኣካል ቁሩብ ሰፊሕ እዩ።', fa: '{area} فوت مربع — نزدیک است، ولی برای گرمای بدن کمی بزرگ است.', 'fa-AF': '{area} فت مربع — نزدیک است، ولی برای گرمی بدن کمی بزرگ است.', ar: '{area} قدم مربع — قريب، لكنه واسع قليلاً لحرارة الجسم.', rw: '{area} sq ft — hafi, ariko ni hanini gato ku bushyuhe bw\'umubiri.' }),
  'dog.scale.warnSnugTip': g('Nudge the walls out a foot. I still need to turn around.', { es: 'Abre las paredes un pie. Todavía necesito darme la vuelta.', cu: 'Abre las paredes un pie. Todavía necesito darme la vuelta.', uk: 'Розсунь стіни на фут. Мені ще треба розвернутися.', ru: 'Раздвинь стены на фут. Мне ещё нужно развернуться.', ti: 'መናድቕ ሓደ ጫማ ናብ ደገ ኣግልሶም። ክዝወር የድልየኒ።', fa: 'دیوارها را یک فوت بیرون ببر. هنوز باید بتوانم بچرخم.', 'fa-AF': 'دیوارها را یک فت بیرون ببر. هنوز باید بتوانم بچرخم.', ar: 'وسّع الجدران قدماً. ما زلت أحتاج أن أستدير.', rw: 'Sunika inkuta ikirenge kimwe. Ndacyakeneye guhindukira.' }),
  'dog.scale.warnRoomyTip': g('A bigger box loses heat. Pull the walls in toward 8–18 sq ft.', { es: 'Una caja más grande pierde calor. Acerca las paredes hacia 8–18 pies².', cu: 'Una caja más grande pierde calor. Acerca las paredes hacia 8–18 pies².', uk: 'Більша коробка втрачає тепло. Зсунь стіни до 8–18 кв. футів.', ru: 'Большая коробка теряет тепло. Сдвинь стены к 8–18 кв. футам.', ti: 'ዝዓበየ ሳጹን ሙቐት የጥፍእ። መናድቕ ናብ 8–18 sq ft ኣቐርቦም።', fa: 'جعبه بزرگ‌تر گرما را از دست می‌دهد. دیوارها را به سمت ۸ تا ۱۸ فوت مربع جمع کن.', 'fa-AF': 'صندوق بزرگ‌تر گرمی را از دست می‌دهد. دیوارها را به سمت ۸ تا ۱۸ فت مربع جمع کن.', ar: 'الصندوق الأكبر يفقد الحرارة. قرّب الجدران نحو 8–18 قدماً مربعاً.', rw: 'Agasanduku kanini gatakaza ubushyuhe. Egereza inkuta kugeza kuri 8–18 sq ft.' }),
  'dog.scale.failSmall': g('{area} sq ft. I can’t turn around.', { es: '{area} pies². No puedo darme la vuelta.', cu: '{area} pies². No puedo darme la vuelta.', uk: '{area} кв. футів. Я не можу розвернутися.', ru: '{area} кв. футов. Я не могу развернуться.', ti: '{area} sq ft። ክዝወር ኣይክእልን።', fa: '{area} فوت مربع. نمی‌توانم بچرخم.', 'fa-AF': '{area} فت مربع. نمی‌توانم بچرخم.', ar: '{area} قدم مربع. لا أستطيع الاستدارة.', rw: '{area} sq ft. Sinshobora guhindukira.' }),
  'dog.scale.failBig': g('{area} sq ft. That’s a people room — I can’t heat it.', { es: '{area} pies². Eso es un cuarto para personas: no puedo calentarlo.', cu: '{area} pies². Eso es un cuarto para personas: no puedo calentarlo.', uk: '{area} кв. футів. Це кімната для людей — я її не зігрію.', ru: '{area} кв. футов. Это комната для людей — я её не согрею.', ti: '{area} sq ft። እዚ ክፍሊ ሰባት እዩ — ከሙቖ ኣይክእልን።', fa: '{area} فوت مربع. این اتاق آدم‌هاست — نمی‌توانم گرمش کنم.', 'fa-AF': '{area} فت مربع. این اتاق مردم است — نمی‌توانم گرمش کنم.', ar: '{area} قدم مربع. هذه غرفة للناس — لا أستطيع تدفئتها.', rw: '{area} sq ft. Iki ni icyumba cy\'abantu — sinshobora kugishyushya.' }),
  'dog.scale.failTip': g('Textbook: 8–18 sq ft for a medium dog. Not 12×10 like a bedroom.', { es: 'Libro: 8–18 pies² para un perro mediano. No 12×10 como un dormitorio.', cu: 'Libro: 8–18 pies² para un perro mediano. No 12×10 como un dormitorio.', uk: 'Підручник: 8–18 кв. футів для середнього пса. Не 12×10, як спальня.', ru: 'Учебник: 8–18 кв. футов для средней собаки. Не 12×10, как спальня.', ti: 'መጽሓፍ፦ 8–18 sq ft ንማእከላይ ከልቢ። ከም መደቀሲ 12×10 ኣይኮነን።', fa: 'کتاب: ۸ تا ۱۸ فوت مربع برای سگ متوسط. نه ۱۲×۱۰ مثل اتاق خواب.', 'fa-AF': 'کتاب: ۸ تا ۱۸ فت مربع برای سگ متوسط. نه ۱۲×۱۰ مثل اتاق خواب.', ar: 'الكتاب: 8–18 قدماً مربعاً لكلب متوسط. ليس 12×10 مثل غرفة نوم.', rw: 'Igitabo: 8–18 sq ft ku mbwa iringaniye. Si 12×10 nk\'icyumba cyo kuraramo.' }),
  'dog.door.title': g('A dog-sized door', { es: 'Una puerta para perro', cu: 'Una puerta para perro', uk: 'Двері для пса', ru: 'Дверь для собаки', ti: 'ማዕጾ ብዓቐን ከልቢ', fa: 'دری به اندازه سگ', 'fa-AF': 'دروازه‌ای به اندازه سگ', ar: 'باب بحجم الكلب', rw: 'Umuryango ungana n\'imbwa' }),
  'dog.door.none': g('No door. I need a way in that isn’t a 3-foot people opening.', { es: 'No hay puerta. Necesito una entrada que no sea un hueco de 3 pies para personas.', cu: 'No hay puerta. Necesito una entrada que no sea un hueco de 3 pies para personas.', uk: 'Немає дверей. Мені потрібен вхід, а не 3-футовий прохід для людей.', ru: 'Нет двери. Мне нужен вход, а не 3-футовый проход для людей.', ti: 'ማዕጾ የለን። 3 ጫማ ናይ ሰባት መኽፈቲ ዘይኮነ መእተዊ የድልየኒ።', fa: 'در نیست. راه ورودی می‌خواهم که بازشوی ۳ فوتی آدم‌ها نباشد.', 'fa-AF': 'دروازه نیست. راه ورودی می‌خواهم که بازشوی ۳ فتی مردم نباشد.', ar: 'لا يوجد باب. أحتاج مدخلاً ليس فتحة بشرية بعرض 3 أقدام.', rw: 'Nta muryango. Nkeneye aho kwinjira hatari umwanya w\'abantu wa ft 3.' }),
  'dog.door.noneTip': g('Door tool → click a wall → tap it and pick 12" or 18".', { es: 'Herramienta Puerta → haz clic en una pared → tócala y elige 12" o 18".', cu: 'Herramienta Puerta → haz clic en una pared → tócala y elige 12" o 18".', uk: 'Інструмент Двері → клацни по стіні → торкнись і вибери 12" або 18".', ru: 'Инструмент Дверь → щёлкни по стене → нажми и выбери 12" или 18".', ti: 'መሳርሒ ማዕጾ → መንደቕ ጠውቕ → ጠውቕ እሞ 12" ወይ 18" ምረጽ።', fa: 'ابزار در ← روی دیوار کلیک کن ← آن را بزن و 12" یا 18" را انتخاب کن.', 'fa-AF': 'ابزار دروازه ← روی دیوار کلیک کن ← آن را بزن و 12" یا 18" را انتخاب کن.', ar: 'أداة الباب ← انقر على جدار ← المسه واختر 12" أو 18".', rw: 'Igikoresho cy\'Umuryango → kanda ku rukuta → kanda kuri wo uhitemo 12" cyangwa 18".' }),
  'dog.door.extra': g('{n} doors leak drafts.', { es: '{n} puertas dejan pasar corrientes.', cu: '{n} puertas dejan pasar corrientes.', uk: '{n} дверей пропускають протяг.', ru: '{n} дверей пропускают сквозняк.', ti: '{n} ማዕጾታት ንፋስ የእትዉ።', fa: '{n} در باد را راه می‌دهند.', 'fa-AF': '{n} دروازه باد را راه می‌دهند.', ar: '{n} أبواب تُدخل التيار.', rw: 'Imiryango {n} yinjiza umuyaga.' }),
  'dog.door.big': g('{w} is a people door. Heat pours out.', { es: '{w} es una puerta para personas. El calor se escapa.', cu: '{w} es una puerta para personas. El calor se escapa.', uk: '{w} — це двері для людей. Тепло витікає.', ru: '{w} — это дверь для людей. Тепло уходит.', ti: '{w} ማዕጾ ሰባት እዩ። ሙቐት ይወጽእ።', fa: '{w} در آدم‌هاست. گرما بیرون می‌ریزد.', 'fa-AF': '{w} دروازه مردم است. گرمی بیرون می‌ریزد.', ar: '{w} باب للناس. تتسرب الحرارة.', rw: '{w} ni umuryango w\'abantu. Ubushyuhe burasohoka.' }),
  'dog.door.tight': g('{w} is too tight.', { es: '{w} es demasiado estrecha.', cu: '{w} es demasiado estrecha.', uk: '{w} — надто вузько.', ru: '{w} — слишком узко.', ti: '{w} ኣዝዩ ጸቢብ እዩ።', fa: '{w} خیلی تنگ است.', 'fa-AF': '{w} خیلی تنگ است.', ar: '{w} ضيق جداً.', rw: '{w} irafunganye cyane.' }),
  'dog.door.warn': g('{w} works, but 12–18" is the textbook sweet spot.', { es: '{w} sirve, pero 12–18" es lo ideal según el libro.', cu: '{w} sirve, pero 12–18" es lo ideal según el libro.', uk: '{w} підходить, але 12–18" — ідеал за підручником.', ru: '{w} подходит, но 12–18" — идеал по учебнику.', ti: '{w} ይሰርሕ፣ ግን 12–18" ናይ መጽሓፍ ዝበለጸ እዩ።', fa: '{w} جواب می‌دهد، ولی ۱۲ تا ۱۸ اینچ بهترین اندازه کتابی است.', 'fa-AF': '{w} کار می‌دهد، ولی ۱۲ تا ۱۸ اینچ بهترین اندازه کتابی است.', ar: '{w} يصلح، لكن 12–18" هو الأفضل حسب الكتاب.', rw: '{w} birakora, ariko 12–18" ni byo byiza mu gitabo.' }),
  'dog.door.pass': g('{w} — just wide enough.', { es: '{w}: justo lo bastante ancha.', cu: '{w}: justo lo bastante ancha.', uk: '{w} — якраз досить широко.', ru: '{w} — как раз достаточно широко.', ti: '{w} — ልክዕ ዝኣክል ሰፊሕ።', fa: '{w} — به اندازه کافی پهن.', 'fa-AF': '{w} — به اندازه کافی پهن.', ar: '{w} — عريض بما يكفي تماماً.', rw: '{w} — ubugari buhagije neza.' }),
  'dog.door.tip': g('One opening, just wide enough to walk through.', { es: 'Una abertura, justo lo bastante ancha para pasar.', cu: 'Una abertura, justo lo bastante ancha para pasar.', uk: 'Один отвір, якраз щоб пройти.', ru: 'Одно отверстие, как раз чтобы пройти.', ti: 'ሓደ መኽፈቲ፣ ንምሕላፍ ዝኣክል።', fa: 'یک بازشو، به اندازه‌ای که بشود رد شد.', 'fa-AF': 'یک بازشو، به اندازه‌ای که بشود رد شد.', ar: 'فتحة واحدة، عريضة بما يكفي للمرور.', rw: 'Umwanya umwe, ungana neza no kunyuramo.' }),
  'dog.door.failTip': g('Tap the door → 12" or 18". One door only.', { es: 'Toca la puerta → 12" o 18". Solo una puerta.', cu: 'Toca la puerta → 12" o 18". Solo una puerta.', uk: 'Торкнись дверей → 12" або 18". Лише одні двері.', ru: 'Нажми на дверь → 12" или 18". Только одна дверь.', ti: 'ማዕጾ ጠውቕ → 12" ወይ 18"። ሓደ ማዕጾ ጥራይ።', fa: 'در را بزن ← 12" یا 18". فقط یک در.', 'fa-AF': 'دروازه را بزن ← 12" یا 18". فقط یک دروازه.', ar: 'المس الباب ← 12" أو 18". باب واحد فقط.', rw: 'Kanda ku muryango → 12" cyangwa 18". Umuryango umwe gusa.' }),
  'dog.offset.title': g('Offset from the wind', { es: 'Lejos del viento', cu: 'Lejos del viento', uk: 'Убік від вітру', ru: 'В стороне от ветра', ti: 'ካብ ንፋስ ርሒቑ', fa: 'دور از باد', 'fa-AF': 'دور از باد', ar: 'بعيداً عن الريح', rw: 'Kure y\'umuyaga' }),
  'dog.offset.skip': g('Place a door first, then slide it off-center.', { es: 'Pon primero una puerta y luego muévela fuera del centro.', cu: 'Pon primero una puerta y luego muévela fuera del centro.', uk: 'Спершу постав двері, потім зсунь їх від центру.', ru: 'Сначала поставь дверь, потом сдвинь её от центра.', ti: 'ቅድም ማዕጾ ኣቐምጥ፣ ድሕሪኡ ካብ ማእከል ኣግልሶ።', fa: 'اول یک در بگذار، بعد آن را از وسط کنار بکش.', 'fa-AF': 'اول یک دروازه بگذار، بعد آن را از وسط کنار بکش.', ar: 'ضع باباً أولاً، ثم حرّكه بعيداً عن المنتصف.', rw: 'Banza ushyireho umuryango, hanyuma uwuvane hagati.' }),
  'dog.offset.skipTip': g('Textbook: don’t put the opening in the middle — rain and wind miss the bed.', { es: 'Libro: no pongas la abertura en el medio; así la lluvia y el viento no llegan a la cama.', cu: 'Libro: no pongas la abertura en el medio; así la lluvia y el viento no llegan a la cama.', uk: 'Підручник: не став отвір посередині — дощ і вітер не дістануть до лежанки.', ru: 'Учебник: не ставь отверстие посередине — дождь и ветер не достанут до лежанки.', ti: 'መጽሓፍ፦ መኽፈቲ ኣብ ማእከል ኣይተቐምጥ — ዝናብን ንፋስን ናብ መደቀሲ ኣይበጽሑን።', fa: 'کتاب: بازشو را وسط نگذار — باران و باد به جای خواب نمی‌رسد.', 'fa-AF': 'کتاب: بازشو را وسط نگذار — باران و باد به جای خواب نمی‌رسد.', ar: 'الكتاب: لا تضع الفتحة في المنتصف — فلا يصل المطر والريح إلى الفراش.', rw: 'Igitabo: ntushyire umwanya hagati — imvura n\'umuyaga ntibigera ku buriri.' }),
  'dog.offset.pass': g('Door sits off-center. Wind and rain don’t blow straight onto the bed.', { es: 'La puerta está fuera del centro. El viento y la lluvia no llegan directo a la cama.', cu: 'La puerta está fuera del centro. El viento y la lluvia no llegan directo a la cama.', uk: 'Двері не посередині. Вітер і дощ не дують просто на лежанку.', ru: 'Дверь не посередине. Ветер и дождь не дуют прямо на лежанку.', ti: 'ማዕጾ ካብ ማእከል ርሒቑ ኣሎ። ንፋስን ዝናብን ብቐጥታ ናብ መደቀሲ ኣይመጹን።', fa: 'در وسط نیست. باد و باران مستقیم به جای خواب نمی‌خورد.', 'fa-AF': 'دروازه وسط نیست. باد و باران مستقیم به جای خواب نمی‌خورد.', ar: 'الباب ليس في المنتصف. لا تهب الريح والمطر مباشرة على الفراش.', rw: 'Umuryango ntabwo uri hagati. Umuyaga n\'imvura ntibigera ku buriri neza neza.' }),
  'dog.offset.passTip': g('Keep the sleeping pad on the far side of the opening.', { es: 'Pon la cama del lado lejano de la abertura.', cu: 'Pon la cama del lado lejano de la abertura.', uk: 'Тримай лежанку з дальнього боку від отвору.', ru: 'Держи лежанку с дальней стороны от отверстия.', ti: 'መደቀሲ ኣብቲ ርሑቕ ጎድኒ መኽፈቲ ግበሮ።', fa: 'جای خواب را در سمت دور از بازشو بگذار.', 'fa-AF': 'جای خواب را در سمت دور از بازشو بگذار.', ar: 'ضع الفراش في الجهة البعيدة عن الفتحة.', rw: 'Shyira uburiri ku ruhande rwa kure rw\'umwanya.' }),
  'dog.offset.fail': g('Door is in the middle of the wall. A gust goes right in.', { es: 'La puerta está en el medio de la pared. Una ráfaga entra directo.', cu: 'La puerta está en el medio de la pared. Una ráfaga entra directo.', uk: 'Двері посередині стіни. Порив вітру влітає просто всередину.', ru: 'Дверь посередине стены. Порыв ветра влетает прямо внутрь.', ti: 'ማዕጾ ኣብ ማእከል መንደቕ ኣሎ። ህቦብላ ብቐጥታ ይኣቱ።', fa: 'در وسط دیوار است. یک تندباد مستقیم وارد می‌شود.', 'fa-AF': 'دروازه وسط دیوار است. یک تندباد مستقیم وارد می‌شود.', ar: 'الباب في منتصف الجدار. تدخل الهبّة مباشرة.', rw: 'Umuryango uri hagati y\'urukuta. Umuyaga mwinshi winjira neza neza.' }),
  'dog.offset.failTip': g('Select the door and slide it toward a corner.', { es: 'Selecciona la puerta y muévela hacia una esquina.', cu: 'Selecciona la puerta y muévela hacia una esquina.', uk: 'Вибери двері й зсунь їх до кута.', ru: 'Выбери дверь и сдвинь её к углу.', ti: 'ማዕጾ ምረጽ እሞ ናብ ኩርናዕ ኣግልሶ።', fa: 'در را انتخاب کن و به سمت یک گوشه بکش.', 'fa-AF': 'دروازه را انتخاب کن و به سمت یک کنج بکش.', ar: 'اختر الباب وحرّكه نحو زاوية.', rw: 'Hitamo umuryango uwerekeze ku nguni.' }),
  'dog.turn.title': g('Room to turn', { es: 'Espacio para girar', cu: 'Espacio para girar', uk: 'Місце, щоб розвернутися', ru: 'Место, чтобы развернуться', ti: 'ቦታ ንምዝዋር', fa: 'جا برای چرخیدن', 'fa-AF': 'جا برای چرخیدن', ar: 'مساحة للدوران', rw: 'Umwanya wo guhindukira' }),
  'dog.turn.skip': g('Close the den first.', { es: 'Cierra primero la guarida.', cu: 'Cierra primero la guarida.', uk: 'Спершу закрий лігво.', ru: 'Сначала закрой логово.', ti: 'ቅድም በዓቲ ዕጸዎ።', fa: 'اول لانه را ببند.', 'fa-AF': 'اول لانه را ببند.', ar: 'أغلق الوكر أولاً.', rw: 'Banza ufunge icyari.' }),
  'dog.turn.skipTip': g('I need about a 2-foot circle inside.', { es: 'Necesito un círculo de unos 2 pies adentro.', cu: 'Necesito un círculo de unos 2 pies adentro.', uk: 'Мені потрібне коло близько 2 футів усередині.', ru: 'Мне нужен круг около 2 футов внутри.', ti: 'ኣብ ውሽጢ ኣስታት 2 ጫማ ክቢ የድልየኒ።', fa: 'داخلش یک دایره حدود ۲ فوتی لازم دارم.', 'fa-AF': 'داخلش یک دایره حدود ۲ فتی لازم دارم.', ar: 'أحتاج دائرة بنحو قدمين في الداخل.', rw: 'Nkeneye uruziga rwa hafi ft 2 imbere.' }),
  'dog.turn.pass': g('A 2-foot circle fits. I can spin and lie down.', { es: 'Cabe un círculo de 2 pies. Puedo girar y echarme.', cu: 'Cabe un círculo de 2 pies. Puedo girar y echarme.', uk: 'Коло 2 фути вміщається. Я можу крутитися й лягати.', ru: 'Круг 2 фута помещается. Я могу крутиться и ложиться.', ti: 'ክቢ 2 ጫማ ይኣቱ። ክዝወርን ክድቅስን እኽእል።', fa: 'دایره ۲ فوتی جا می‌شود. می‌توانم بچرخم و دراز بکشم.', 'fa-AF': 'دایره ۲ فتی جا می‌شود. می‌توانم بچرخم و دراز بکشم.', ar: 'تتسع دائرة بقدمين. أستطيع أن أدور وأستلقي.', rw: 'Uruziga rwa ft 2 rurakwirwa. Nshobora kuzenguruka no kuryama.' }),
  'dog.turn.passTip': g('Don’t fill the floor with people furniture.', { es: 'No llenes el piso con muebles de personas.', cu: 'No llenes el piso con muebles de personas.', uk: 'Не заставляй підлогу людськими меблями.', ru: 'Не заставляй пол мебелью для людей.', ti: 'ባይታ ብኣቑሑ ሰባት ኣይትምልኦ።', fa: 'کف را با وسایل آدم‌ها پر نکن.', 'fa-AF': 'فرش را با سامان مردم پر نکن.', ar: 'لا تملأ الأرض بأثاث الناس.', rw: 'Ntuzuze hasi ibikoresho by\'abantu.' }),
  'dog.turn.fail': g('Too tight to turn around. Stretch the short wall.', { es: 'Muy estrecho para girar. Alarga la pared corta.', cu: 'Muy estrecho para girar. Alarga la pared corta.', uk: 'Надто тісно, щоб розвернутися. Подовж коротку стіну.', ru: 'Слишком тесно, чтобы развернуться. Удлини короткую стену.', ti: 'ንምዝዋር ኣዝዩ ጸቢብ። ነቲ ሓጺር መንደቕ ኣናውሖ።', fa: 'برای چرخیدن خیلی تنگ است. دیوار کوتاه را بلندتر کن.', 'fa-AF': 'برای چرخیدن خیلی تنگ است. دیوار کوتاه را درازتر کن.', ar: 'ضيق جداً للدوران. أطِل الجدار القصير.', rw: 'Harafunganye cyane ngo uhindukire. Rambura urukuta rugufi.' }),
  'dog.turn.failTip': g('Textbook: stand, turn, lie stretched — all three.', { es: 'Libro: pararse, girar y echarse estirado: las tres cosas.', cu: 'Libro: pararse, girar y echarse estirado: las tres cosas.', uk: 'Підручник: стояти, повертатися, лежати витягнувшись — усе три.', ru: 'Учебник: стоять, поворачиваться, лежать вытянувшись — все три.', ti: 'መጽሓፍ፦ ምቁም፣ ምዝዋር፣ ተዘርጊሕካ ምድቃስ — ሰለስቲኦም።', fa: 'کتاب: ایستادن، چرخیدن، دراز کشیدن — هر سه.', 'fa-AF': 'کتاب: ایستادن، چرخیدن، دراز کشیدن — هر سه.', ar: 'الكتاب: الوقوف والدوران والاستلقاء ممدداً — الثلاثة.', rw: 'Igitabo: guhagarara, guhindukira, kuryama urambuye — byose uko ari bitatu.' }),
  'dog.roof.title': g('A pitched roof', { es: 'Un techo inclinado', cu: 'Un techo inclinado', uk: 'Похилий дах', ru: 'Скатная крыша', ti: 'ዝዘንበለ ናሕሲ', fa: 'سقف شیب‌دار', 'fa-AF': 'بام شیب‌دار', ar: 'سقف مائل', rw: 'Igisenge gihengamye' }),
  'dog.roof.none': g('No roof named yet. Rain has to shed.', { es: 'Aún no hay techo. La lluvia tiene que escurrir.', cu: 'Aún no hay techo. La lluvia tiene que escurrir.', uk: 'Ще немає даху. Дощ має стікати.', ru: 'Пока нет крыши. Дождь должен стекать.', ti: 'ገና ናሕሲ ኣይተሰምየን። ዝናብ ክፈስስ ኣለዎ።', fa: 'هنوز سقفی انتخاب نشده. باران باید سُر بخورد.', 'fa-AF': 'هنوز بامی انتخاب نشده. باران باید بلغزد.', ar: 'لم يُسمَّ سقف بعد. يجب أن ينساب المطر.', rw: 'Nta gisenge kiritwa. Imvura igomba gutemba.' }),
  'dog.roof.noneTip': g('Settings → Roof → Gable or Shed.', { es: 'Ajustes → Techo → Gable o Shed.', cu: 'Ajustes → Techo → Gable o Shed.', uk: 'Налаштування → Дах → Gable або Shed.', ru: 'Настройки → Крыша → Gable или Shed.', ti: 'ምድላዋት → ናሕሲ → Gable ወይ Shed።', fa: 'تنظیمات ← سقف ← Gable یا Shed.', 'fa-AF': 'تنظیمات ← بام ← Gable یا Shed.', ar: 'الإعدادات ← السقف ← Gable أو Shed.', rw: 'Igenamiterere → Igisenge → Gable cyangwa Shed.' }),
  'dog.roof.pass': g('{roof} — water runs off.', { es: '{roof}: el agua escurre.', cu: '{roof}: el agua escurre.', uk: '{roof} — вода стікає.', ru: '{roof} — вода стекает.', ti: '{roof} — ማይ ይፈስስ።', fa: '{roof} — آب سُر می‌خورد.', 'fa-AF': '{roof} — آب می‌لغزد.', ar: '{roof} — ينساب الماء.', rw: '{roof} — amazi aratemba.' }),
  'dog.roof.passTip': g('Name it with a real word. You already did.', { es: 'Ponle un nombre real. Ya lo hiciste.', cu: 'Ponle un nombre real. Ya lo hiciste.', uk: 'Назви його справжнім словом. Ти вже це зробив.', ru: 'Назови её настоящим словом. Ты уже это сделал.', ti: 'ብሓቀኛ ቃል ሰምዮ። ድሮ ገይርካዮ።', fa: 'با یک واژه واقعی نامش را بگذار. این کار را کرده‌ای.', 'fa-AF': 'با یک واژه واقعی نامش را بگذار. این کار را کرده‌ای.', ar: 'سمِّه بكلمة حقيقية. لقد فعلت ذلك.', rw: 'Kita izina nyaryo. Warabikoze.' }),
  'dog.roof.people': g('That roof is for a people house or a story. A kennel wants gable or shed.', { es: 'Ese techo es para una casa de personas o un cuento. Una caseta pide gable o shed.', cu: 'Ese techo es para una casa de personas o un cuento. Una caseta pide gable o shed.', uk: 'Такий дах — для людського будинку чи казки. Будці потрібен gable або shed.', ru: 'Такая крыша — для дома людей или сказки. Будке нужна gable или shed.', ti: 'እዚ ናሕሲ ንገዛ ሰባት ወይ ንዛንታ እዩ። ገዛ ከልቢ gable ወይ shed ይደሊ።', fa: 'این سقف برای خانه آدم‌ها یا قصه است. لانه سگ gable یا shed می‌خواهد.', 'fa-AF': 'این بام برای خانه مردم یا قصه است. خانه سگ gable یا shed می‌خواهد.', ar: 'هذا السقف لبيت ناس أو لحكاية. بيت الكلب يريد gable أو shed.', rw: 'Icyo gisenge ni icy\'inzu y\'abantu cyangwa inkuru. Inzu y\'imbwa ikenera gable cyangwa shed.' }),
  'dog.roof.peopleTip': g('Settings → Gable or Shed. Simple pitch, rain sheds.', { es: 'Ajustes → Gable o Shed. Inclinación simple, la lluvia escurre.', cu: 'Ajustes → Gable o Shed. Inclinación simple, la lluvia escurre.', uk: 'Налаштування → Gable або Shed. Простий схил — дощ стікає.', ru: 'Настройки → Gable или Shed. Простой скат — дождь стекает.', ti: 'ምድላዋት → Gable ወይ Shed። ቀሊል ዝንባለ፣ ዝናብ ይፈስስ።', fa: 'تنظیمات ← Gable یا Shed. شیب ساده، باران سُر می‌خورد.', 'fa-AF': 'تنظیمات ← Gable یا Shed. شیب ساده، باران می‌لغزد.', ar: 'الإعدادات ← Gable أو Shed. ميل بسيط، ينساب المطر.', rw: 'Igenamiterere → Gable cyangwa Shed. Ihengama ryoroshye, imvura iratemba.' }),
  'dog.roof.flat': g('A flat roof puddles. Dogs don’t need a modern box.', { es: 'Un techo plano hace charcos. Los perros no necesitan una caja moderna.', cu: 'Un techo plano hace charcos. Los perros no necesitan una caja moderna.', uk: 'На пласкому даху стоять калюжі. Псам не потрібна модерна коробка.', ru: 'На плоской крыше стоят лужи. Собакам не нужна модерновая коробка.', ti: 'ጸፊሕ ናሕሲ ማይ የዋህልል። ኣኽላባት ዘመናዊ ሳጹን ኣየድልዮምን።', fa: 'سقف صاف آب جمع می‌کند. سگ‌ها جعبه مدرن لازم ندارند.', 'fa-AF': 'بام هموار آب جمع می‌کند. سگ‌ها صندوق مدرن لازم ندارند.', ar: 'السقف المسطّح تتجمع عليه البرك. الكلاب لا تحتاج صندوقاً حديثاً.', rw: 'Igisenge kiringaniye kireka ibidendezi. Imbwa ntizikeneye agasanduku ka kijyambere.' }),
  'dog.roof.flatTip': g('Settings → Gable or Shed.', { es: 'Ajustes → Gable o Shed.', cu: 'Ajustes → Gable o Shed.', uk: 'Налаштування → Gable або Shed.', ru: 'Настройки → Gable или Shed.', ti: 'ምድላዋት → Gable ወይ Shed።', fa: 'تنظیمات ← Gable یا Shed.', 'fa-AF': 'تنظیمات ← Gable یا Shed.', ar: 'الإعدادات ← Gable أو Shed.', rw: 'Igenamiterere → Gable cyangwa Shed.' }),
  'dog.program.title': g('A den, not a people house', { es: 'Una guarida, no una casa de personas', cu: 'Una guarida, no una casa de personas', uk: 'Лігво, а не будинок для людей', ru: 'Логово, а не дом для людей', ti: 'በዓቲ፣ ገዛ ሰባት ኣይኮነን', fa: 'لانه، نه خانه آدم‌ها', 'fa-AF': 'لانه، نه خانه مردم', ar: 'وكر، لا بيت للناس', rw: 'Icyari, si inzu y\'abantu' }),
  'dog.program.stuff': g('people stuff', { es: 'cosas de personas', cu: 'cosas de personas', uk: 'людські речі', ru: 'вещи для людей', ti: 'ናይ ሰባት ነገራት', fa: 'وسایل آدم‌ها', 'fa-AF': 'سامان مردم', ar: 'أغراض الناس', rw: 'ibintu by\'abantu' }),
  'dog.program.fail': g('{who} belongs in a house for humans. I need a sleeping box.', { es: '{who} va en una casa para humanos. Yo necesito una caja para dormir.', cu: '{who} va en una casa para humanos. Yo necesito una caja para dormir.', uk: '{who} — для людського дому. Мені потрібна коробка для сну.', ru: '{who} — для дома людей. Мне нужна коробка для сна.', ti: '{who} ኣብ ገዛ ደቂ ሰብ እዩ ዝግባእ። ናይ ምድቃስ ሳጹን የድልየኒ።', fa: '{who} مال خانه آدم‌هاست. من یک جعبه خواب لازم دارم.', 'fa-AF': '{who} مال خانه مردم است. من یک صندوق خواب لازم دارم.', ar: '{who} مكانه بيت للبشر. أحتاج صندوقاً للنوم.', rw: '{who} ni iby\'inzu y\'abantu. Nkeneye agasanduku ko kuryamamo.' }),
  'dog.program.failTip': g('Delete the kitchen and bath. One named den is enough.', { es: 'Borra la cocina y el baño. Basta con una guarida.', cu: 'Borra la cocina y el baño. Basta con una guarida.', uk: 'Видали кухню й ванну. Досить одного лігва.', ru: 'Удали кухню и ванную. Достаточно одного логова.', ti: 'ክሽነን ባኞን ደምስስ። ሓደ ዝተሰምየ በዓቲ ይኣክል።', fa: 'آشپزخانه و حمام را پاک کن. یک لانه بس است.', 'fa-AF': 'آشپزخانه و تشناب را پاک کن. یک لانه بس است.', ar: 'احذف المطبخ والحمام. يكفي وكر واحد.', rw: 'Siba igikoni n\'ubwiherero. Icyari kimwe kirahagije.' }),
  'dog.program.window': g('A people-sized window leaks heat. Kennels stay mostly solid.', { es: 'Una ventana de tamaño persona pierde calor. Las casetas son casi cerradas.', cu: 'Una ventana de tamaño persona pierde calor. Las casetas son casi cerradas.', uk: 'Вікно людського розміру випускає тепло. Будки майже суцільні.', ru: 'Окно человеческого размера выпускает тепло. Будки почти сплошные.', ti: 'ብዓቐን ሰብ ዘሎ መስኮት ሙቐት የውጽእ። ገዛ ከልቢ መብዛሕትኡ ዕጹው እዩ።', fa: 'پنجره به اندازه آدم گرما را بیرون می‌دهد. لانه سگ بیشتر بسته است.', 'fa-AF': 'کلکین به اندازه آدم گرمی را بیرون می‌دهد. خانه سگ بیشتر بسته است.', ar: 'نافذة بحجم البشر تُسرّب الحرارة. بيوت الكلاب مصمتة غالباً.', rw: 'Idirishya rinini nk\'iry\'abantu risohora ubushyuhe. Amazu y\'imbwa ahanini arafunze.' }),
  'dog.program.windowTip': g('Delete extra windows, or skip them.', { es: 'Borra las ventanas de más o no las pongas.', cu: 'Borra las ventanas de más o no las pongas.', uk: 'Видали зайві вікна або не став їх.', ru: 'Удали лишние окна или не ставь их.', ti: 'ዝተረፈ መሳኹቲ ደምስስ፣ ወይ ኣይተቐምጦም።', fa: 'پنجره‌های اضافه را پاک کن یا نگذار.', 'fa-AF': 'کلکین‌های اضافه را پاک کن یا نگذار.', ar: 'احذف النوافذ الزائدة أو لا تضعها.', rw: 'Siba amadirishya y\'inyongera, cyangwa ntuyashyireho.' }),
  'dog.program.pass': g('No kitchen, no bath, no sofa. This reads as a den.', { es: 'Sin cocina, sin baño, sin sofá. Esto parece una guarida.', cu: 'Sin cocina, sin baño, sin sofá. Esto parece una guarida.', uk: 'Ні кухні, ні ванної, ні дивана. Це схоже на лігво.', ru: 'Ни кухни, ни ванной, ни дивана. Это похоже на логово.', ti: 'ክሽነ የለን፣ ባኞ የለን፣ ሶፋ የለን። እዚ በዓቲ ይመስል።', fa: 'نه آشپزخانه، نه حمام، نه مبل. این شبیه لانه است.', 'fa-AF': 'نه آشپزخانه، نه تشناب، نه کوچ. این شبیه لانه است.', ar: 'لا مطبخ ولا حمام ولا أريكة. هذا يبدو وكراً.', rw: 'Nta gikoni, nta bwiherero, nta ntebe. Iki gisa n\'icyari.' }),
  'dog.program.passTip': g('One room. Sleeping only.', { es: 'Un cuarto. Solo para dormir.', cu: 'Un cuarto. Solo para dormir.', uk: 'Одна кімната. Лише для сну.', ru: 'Одна комната. Только для сна.', ti: 'ሓደ ክፍሊ። ንምድቃስ ጥራይ።', fa: 'یک اتاق. فقط برای خواب.', 'fa-AF': 'یک اتاق. فقط برای خواب.', ar: 'غرفة واحدة. للنوم فقط.', rw: 'Icyumba kimwe. Cyo kuryamamo gusa.' }),
  'dog.dims.title': g('Size labels', { es: 'Etiquetas de medida', cu: 'Etiquetas de medida', uk: 'Підписи розмірів', ru: 'Подписи размеров', ti: 'ምልክታት ዓቐን', fa: 'برچسب‌های اندازه', 'fa-AF': 'برچسپ‌های اندازه', ar: 'تسميات المقاس', rw: 'Ibirango by\'ingano' }),
  'dog.dims.none': g('No size labels on the plan. The book wants numbers you can read.', { es: 'No hay etiquetas de medida en el plano. El libro pide números que se lean.', cu: 'No hay etiquetas de medida en el plano. El libro pide números que se lean.', uk: 'На плані немає підписів розмірів. Підручник хоче чисел, які видно.', ru: 'На плане нет подписей размеров. Учебник хочет чисел, которые видно.', ti: 'ኣብ ትልሚ ምልክታት ዓቐን የለዉን። መጽሓፍ ዝንበቡ ቁጽርታት ይደሊ።', fa: 'روی نقشه برچسب اندازه نیست. کتاب عددهایی می‌خواهد که بشود خواند.', 'fa-AF': 'روی نقشه برچسپ اندازه نیست. کتاب عددهایی می‌خواهد که بشود خواند.', ar: 'لا توجد تسميات مقاس في المخطط. الكتاب يريد أرقاماً تُقرأ.', rw: 'Nta birango by\'ingano biri ku gishushanyo. Igitabo gishaka imibare isomeka.' }),
  'dog.dims.noneTip': g('Size tool → click two corners of a wall.', { es: 'Herramienta Medida → haz clic en dos esquinas de una pared.', cu: 'Herramienta Medida → haz clic en dos esquinas de una pared.', uk: 'Інструмент Розмір → клацни два кути стіни.', ru: 'Инструмент Размер → щёлкни два угла стены.', ti: 'መሳርሒ ዓቐን → ክልተ ኩርናዓት መንደቕ ጠውቕ።', fa: 'ابزار اندازه ← روی دو گوشه یک دیوار کلیک کن.', 'fa-AF': 'ابزار اندازه ← روی دو کنج یک دیوار کلیک کن.', ar: 'أداة المقاس ← انقر زاويتي جدار.', rw: 'Igikoresho cy\'Ingano → kanda ku nguni ebyiri z\'urukuta.' }),
  'dog.dims.one': g('1 size label on the plan.', { es: '1 etiqueta de medida en el plano.', cu: '1 etiqueta de medida en el plano.', uk: '1 підпис розміру на плані.', ru: '1 подпись размера на плане.', ti: '1 ምልክት ዓቐን ኣብ ትልሚ።', fa: '۱ برچسب اندازه روی نقشه.', 'fa-AF': '۱ برچسپ اندازه روی نقشه.', ar: 'تسمية مقاس واحدة في المخطط.', rw: 'Ikirango 1 cy\'ingano ku gishushanyo.' }),
  'dog.dims.many': g('{n} size labels on the plan.', { es: '{n} etiquetas de medida en el plano.', cu: '{n} etiquetas de medida en el plano.', uk: 'Підписів розмірів на плані: {n}.', ru: 'Подписей размеров на плане: {n}.', ti: '{n} ምልክታት ዓቐን ኣብ ትልሚ።', fa: '{n} برچسب اندازه روی نقشه.', 'fa-AF': '{n} برچسپ اندازه روی نقشه.', ar: '{n} تسميات مقاس في المخطط.', rw: 'Ibirango {n} by\'ingano ku gishushanyo.' }),
  'dog.dims.passTip': g('Keep them in feet so the class can check scale.', { es: 'Déjalas en pies para que la clase revise la escala.', cu: 'Déjalas en pies para que la clase revise la escala.', uk: 'Залиш їх у футах, щоб клас перевірив масштаб.', ru: 'Оставь их в футах, чтобы класс проверил масштаб.', ti: 'ክፍሊ ዓቐን ክምርምር ብጫማ ግደፎም።', fa: 'به فوت نگهشان دار تا کلاس مقیاس را بررسی کند.', 'fa-AF': 'به فت نگهشان دار تا صنف مقیاس را بررسی کند.', ar: 'أبقِها بالأقدام ليتحقق الصف من المقياس.', rw: 'Bigumishe mu birenge kugira ngo ishuri risuzume igipimo.' }),
  'dog.shade.title': g('Summer shade', { es: 'Sombra de verano', cu: 'Sombra de verano', uk: 'Літня тінь', ru: 'Летняя тень', ti: 'ጽላል ሓጋይ', fa: 'سایه تابستان', 'fa-AF': 'سایه تابستان', ar: 'ظل الصيف', rw: 'Igicucu cy\'impeshyi' }),
  'dog.shade.none': g('No tree on the site. Textbook: shade in summer, sun in winter if you can.', { es: 'No hay árbol en el terreno. Libro: sombra en verano y sol en invierno si se puede.', cu: 'No hay árbol en el terreno. Libro: sombra en verano y sol en invierno si se puede.', uk: 'На ділянці немає дерева. Підручник: тінь улітку, сонце взимку, якщо можна.', ru: 'На участке нет дерева. Учебник: тень летом, солнце зимой, если можно.', ti: 'ኣብቲ ቦታ ኦም የለን። መጽሓፍ፦ ኣብ ሓጋይ ጽላል፣ ኣብ ክረምቲ ጸሓይ እንተተኻኢሉ።', fa: 'در زمین درختی نیست. کتاب: سایه در تابستان، آفتاب در زمستان اگر بشود.', 'fa-AF': 'در زمین درختی نیست. کتاب: سایه در تابستان، آفتاب در زمستان اگر بشود.', ar: 'لا توجد شجرة في الموقع. الكتاب: ظل في الصيف وشمس في الشتاء إن أمكن.', rw: 'Nta giti kiri ku kibanza. Igitabo: igicucu mu mpeshyi, izuba mu gihe cy\'imbeho niba bishoboka.' }),
  'dog.shade.noneTip': g('Plant tool → Tree. Put it on the south or west side.', { es: 'Herramienta Planta → Árbol. Ponlo al sur o al oeste.', cu: 'Herramienta Planta → Árbol. Ponlo al sur o al oeste.', uk: 'Інструмент Рослина → Дерево. Постав його з півдня чи заходу.', ru: 'Инструмент Растение → Дерево. Поставь его с юга или запада.', ti: 'መሳርሒ ተኽሊ → ኦም። ኣብ ደቡብ ወይ ምዕራብ ኣቐምጦ።', fa: 'ابزار گیاه ← درخت. آن را در سمت جنوب یا غرب بگذار.', 'fa-AF': 'ابزار نبات ← درخت. آن را در سمت جنوب یا غرب بگذار.', ar: 'أداة النبات ← شجرة. ضعها في الجهة الجنوبية أو الغربية.', rw: 'Igikoresho cy\'Igihingwa → Igiti. Gishyire mu majyepfo cyangwa iburengerazuba.' }),
  'dog.shade.pass': g('A tree on the plan. I’ll thank you in July.', { es: 'Hay un árbol en el plano. Te lo agradeceré en julio.', cu: 'Hay un árbol en el plano. Te lo agradeceré en julio.', uk: 'На плані є дерево. Подякую тобі в липні.', ru: 'На плане есть дерево. Спасибо скажу в июле.', ti: 'ኦም ኣብ ትልሚ ኣሎ። ኣብ ሓምለ ከመስግነካ እየ።', fa: 'یک درخت روی نقشه هست. تیرماه از تو تشکر می‌کنم.', 'fa-AF': 'یک درخت روی نقشه هست. در سرطان از تو تشکر می‌کنم.', ar: 'شجرة في المخطط. سأشكرك في يوليو.', rw: 'Hari igiti ku gishushanyo. Nzagushimira muri Nyakanga.' }),
  'dog.shade.passTip': g('Keep the door out of the prevailing wind if you know it.', { es: 'Aleja la puerta del viento dominante si lo conoces.', cu: 'Aleja la puerta del viento dominante si lo conoces.', uk: 'Тримай двері подалі від переважного вітру, якщо знаєш його.', ru: 'Держи дверь подальше от преобладающего ветра, если знаешь его.', ti: 'ዝበዝሕ ንፋስ እንተፈሊጥካ ማዕጾ ካብኡ ኣርሕቖ።', fa: 'اگر باد غالب را می‌دانی، در را از آن دور نگه دار.', 'fa-AF': 'اگر باد غالب را می‌دانی، دروازه را از آن دور نگه دار.', ar: 'أبعد الباب عن الريح السائدة إن كنت تعرفها.', rw: 'Niba uzi umuyaga ukunze guhuha, shyira umuryango kure yawo.' }),
  // 2.13.50: the Access check in every language. ti, fa-AF and rw are UNCHECKED native copy.
  'news.accessWords': g('The Access check is in your language, with room and furniture names translated too.', { es: 'La revisión de acceso está en tu idioma, con los nombres de cuartos y muebles traducidos.', cu: 'La revisión de acceso está en tu idioma, con los nombres de cuartos y muebles traducidos.', uk: 'Перевірка доступності — твоєю мовою, разом із назвами кімнат і меблів.', ru: 'Проверка доступности — на твоём языке, вместе с названиями комнат и мебели.', ti: 'ምርመራ ተበጻሕነት ብቋንቋኻ እዩ፣ ኣስማት ክፍልታትን ኣቑሑን እውን ተተርጒሞም።', fa: 'بررسی دسترسی‌پذیری به زبان توست و نام اتاق‌ها و وسایل هم ترجمه شده‌اند.', 'fa-AF': 'بررسی دسترسی‌پذیری به زبان توست و نام اتاق‌ها و سامان هم ترجمه شده‌اند.', ar: 'فحص سهولة الوصول بلغتك، مع ترجمة أسماء الغرف والأثاث أيضاً.', rw: 'Isuzuma ry\'ikoreshwa riri mu rurimi rwawe, n\'amazina y\'ibyumba n\'ibikoresho yahinduwe.' }),
  'acc.disclaimer': g('Classroom check — not a legal stamp.', { es: 'Revisión de clase — no es un sello legal.', cu: 'Revisión de clase — no es un sello legal.', uk: 'Шкільна перевірка — не юридичний висновок.', ru: 'Школьная проверка — не юридическое заключение.', ti: 'ምርመራ ክፍሊ — ሕጋዊ ማሕተም ኣይኮነን።', fa: 'بررسی کلاسی — مهر قانونی نیست.', 'fa-AF': 'بررسی صنفی — مهر قانونی نیست.', ar: 'فحص صفّي — ليس ختماً قانونياً.', rw: 'Isuzuma ry\'ishuri — si icyemezo cy\'amategeko.' }),
  'acc.legal': g('Baboo checks door width (32"), halls (36"), bath turning circles (5\'), kitchen aisles (40"), and whether furniture sits in a door swing. Real ADA is bigger than this list — talk with your teacher.', { es: 'Baboo revisa el ancho de puertas (32"), pasillos (36"), el círculo de giro del baño (5\'), los pasillos de cocina (40") y si hay muebles en el giro de una puerta. La ADA real es más grande que esta lista: habla con tu maestro.', cu: 'Baboo revisa el ancho de puertas (32"), pasillos (36"), el círculo de giro del baño (5\'), los pasillos de cocina (40") y si hay muebles en el giro de una puerta. La ADA real es más grande que esta lista: habla con tu maestro.', uk: 'Baboo перевіряє ширину дверей (32"), коридори (36"), коло розвороту у ванній (5\'), проходи на кухні (40") і чи стоять меблі на шляху дверей. Справжній ADA більший за цей список — поговори з учителем.', ru: 'Baboo проверяет ширину дверей (32"), коридоры (36"), круг разворота в ванной (5\'), проходы на кухне (40") и не стоит ли мебель на пути двери. Настоящий ADA больше этого списка — поговори с учителем.', ti: 'Baboo ስፍሓት ማዕጾ (32")፣ መተሓላለፊ (36")፣ ክቢ ምዝዋር ኣብ ባኞ (5\')፣ መተሓላለፊ ክሽነ (40")ን ኣቑሑ ኣብ መንገዲ ማዕጾ ከም ዘለዉን ይምርምር። ናይ ሓቂ ADA ካብዚ ዝርዝር ይዓቢ — ምስ መምህርካ ተዘራረብ።', fa: 'Baboo عرض در (32")، راهرو (36")، دایره چرخش در حمام (5\')، راهروی آشپزخانه (40") و اینکه آیا وسیله‌ای سر راه باز شدن در است را بررسی می‌کند. ADA واقعی بزرگ‌تر از این فهرست است — با معلمت صحبت کن.', 'fa-AF': 'Baboo عرض دروازه (32")، دهلیز (36")، دایره چرخش در تشناب (5\')، راهروی آشپزخانه (40") و اینکه آیا سامان سر راه باز شدن دروازه است را بررسی می‌کند. ADA واقعی بزرگ‌تر از این فهرست است — با معلمت گپ بزن.', ar: 'يفحص Baboo عرض الباب (32")، والممرات (36")، ودائرة الدوران في الحمام (5\')، وممرات المطبخ (40")، وهل يوجد أثاث في مسار فتح الباب. معايير ADA الحقيقية أكبر من هذه القائمة — تحدّث مع معلمك.', rw: 'Baboo isuzuma ubugari bw\'umuryango (32"), inzira (36"), uruziga rwo guhindukira mu bwiherero (5\'), inzira z\'igikoni (40"), n\'ibikoresho biri aho umuryango ufungukira. ADA nyayo iruta uru rutonde — vugana na mwarimu wawe.' }),
  'acc.head.fail1': g('1 thing to fix', { es: '1 cosa por arreglar', cu: '1 cosa por arreglar', uk: '1 річ виправити', ru: '1 вещь исправить', ti: '1 ዝዕረ ነገር', fa: '۱ چیز برای درست کردن', 'fa-AF': '۱ چیز برای درست کردن', ar: 'شيء واحد يحتاج إصلاحاً', rw: 'Ikintu 1 cyo gukosora' }),
  'acc.head.fail': g('{n} things to fix', { es: '{n} cosas por arreglar', cu: '{n} cosas por arreglar', uk: 'Виправити: {n}', ru: 'Исправить: {n}', ti: '{n} ዝዕረዩ ነገራት', fa: '{n} چیز برای درست کردن', 'fa-AF': '{n} چیز برای درست کردن', ar: '{n} أشياء تحتاج إصلاحاً', rw: 'Ibintu {n} byo gukosora' }),
  'acc.head.warn1': g('1 thing to look at', { es: '1 cosa por mirar', cu: '1 cosa por mirar', uk: '1 річ переглянути', ru: '1 вещь проверить', ti: '1 ዝረአ ነገር', fa: '۱ چیز برای نگاه کردن', 'fa-AF': '۱ چیز برای نگاه کردن', ar: 'شيء واحد يستحق النظر', rw: 'Ikintu 1 cyo kureba' }),
  'acc.head.warn': g('{n} things to look at', { es: '{n} cosas por mirar', cu: '{n} cosas por mirar', uk: 'Переглянути: {n}', ru: 'Проверить: {n}', ti: '{n} ዝረኣዩ ነገራት', fa: '{n} چیز برای نگاه کردن', 'fa-AF': '{n} چیز برای نگاه کردن', ar: '{n} أشياء تستحق النظر', rw: 'Ibintu {n} byo kureba' }),
  'acc.head.good': g('This plan is being kind to more people', { es: 'Este plano es amable con más personas', cu: 'Este plano es amable con más personas', uk: 'Цей план зручний для більшої кількості людей', ru: 'Этот план удобен для большего числа людей', ti: 'እዚ ትልሚ ንብዙሓት ሰባት ምቹእ እዩ', fa: 'این نقشه برای آدم‌های بیشتری مناسب است', 'fa-AF': 'این نقشه برای مردم بیشتری مناسب است', ar: 'هذا المخطط لطيف مع عدد أكبر من الناس', rw: 'Iki gishushanyo kiraborohereza abantu benshi' }),
  'acc.head.more': g('Draw a little more and we\'ll check again', { es: 'Dibuja un poco más y volvemos a revisar', cu: 'Dibuja un poco más y volvemos a revisar', uk: 'Намалюй ще трохи — і ми перевіримо знову', ru: 'Нарисуй ещё немного — и мы проверим снова', ti: 'ቁሩብ ወሲኽካ ስኣል፣ እንደገና ክንምርምር ኢና', fa: 'کمی بیشتر بکش و دوباره بررسی می‌کنیم', 'fa-AF': 'کمی بیشتر رسم کن و دوباره بررسی می‌کنیم', ar: 'ارسم قليلاً بعد وسنفحص مرة أخرى', rw: 'Shushanya gato kandi tuzongera dusuzume' }),
  'acc.entry.title': g('A way in', { es: 'Una entrada', cu: 'Una entrada', uk: 'Вхід', ru: 'Вход', ti: 'መእተዊ', fa: 'راه ورود', 'fa-AF': 'راه ورود', ar: 'مدخل', rw: 'Inzira yo kwinjira' }),
  'acc.entry.none': g('No door yet. A wheelchair (and everyone else) needs a way in.', { es: 'Aún no hay puerta. Una silla de ruedas (y todos) necesitan entrar.', cu: 'Aún no hay puerta. Una silla de ruedas (y todos) necesitan entrar.', uk: 'Ще немає дверей. Візку (і всім іншим) потрібен вхід.', ru: 'Пока нет двери. Коляске (и всем остальным) нужен вход.', ti: 'ገና ማዕጾ የለን። ዓረብያ ስንኩላን (ኩሉ ሰብን) መእተዊ የድልዮ።', fa: 'هنوز دری نیست. ویلچر (و همه) به راه ورود نیاز دارند.', 'fa-AF': 'هنوز دروازه نیست. چوکی چرخ‌دار (و همه) به راه ورود نیاز دارند.', ar: 'لا يوجد باب بعد. الكرسي المتحرك (والجميع) يحتاج مدخلاً.', rw: 'Nta muryango urahari. Igare ry\'abafite ubumuga (n\'abandi bose) rikeneye aho kwinjira.' }),
  'acc.entry.noneTip': g('Door tool → click a wall.', { es: 'Herramienta Puerta → haz clic en una pared.', cu: 'Herramienta Puerta → haz clic en una pared.', uk: 'Інструмент Двері → клацни по стіні.', ru: 'Инструмент Дверь → щёлкни по стене.', ti: 'መሳርሒ ማዕጾ → መንደቕ ጠውቕ።', fa: 'ابزار در ← روی یک دیوار کلیک کن.', 'fa-AF': 'ابزار دروازه ← روی یک دیوار کلیک کن.', ar: 'أداة الباب ← انقر على جدار.', rw: 'Igikoresho cy\'Umuryango → kanda ku rukuta.' }),
  'acc.entry.one': g('1 door on the plan.', { es: '1 puerta en el plano.', cu: '1 puerta en el plano.', uk: '1 двері на плані.', ru: '1 дверь на плане.', ti: '1 ማዕጾ ኣብ ትልሚ።', fa: '۱ در روی نقشه.', 'fa-AF': '۱ دروازه روی نقشه.', ar: 'باب واحد في المخطط.', rw: 'Umuryango 1 ku gishushanyo.' }),
  'acc.entry.many': g('{n} doors on the plan.', { es: '{n} puertas en el plano.', cu: '{n} puertas en el plano.', uk: 'Дверей на плані: {n}.', ru: 'Дверей на плане: {n}.', ti: '{n} ማዕጾታት ኣብ ትልሚ።', fa: '{n} در روی نقشه.', 'fa-AF': '{n} دروازه روی نقشه.', ar: '{n} أبواب في المخطط.', rw: 'Imiryango {n} ku gishushanyo.' }),
  'acc.entry.tip': g('Keep a clear path from the door to kitchen, bath, and sleep.', { es: 'Deja un camino libre de la puerta a la cocina, el baño y el dormitorio.', cu: 'Deja un camino libre de la puerta a la cocina, el baño y el dormitorio.', uk: 'Залиш вільний шлях від дверей до кухні, ванної та спальні.', ru: 'Оставь свободный путь от двери к кухне, ванной и спальне.', ti: 'ካብ ማዕጾ ናብ ክሽነ፣ ባኞን መደቀሲን ንጹር መንገዲ ግደፍ።', fa: 'از در تا آشپزخانه، حمام و اتاق خواب یک مسیر باز نگه دار.', 'fa-AF': 'از دروازه تا آشپزخانه، تشناب و اتاق خواب یک راه باز نگه دار.', ar: 'اترك طريقاً خالياً من الباب إلى المطبخ والحمام وغرفة النوم.', rw: 'Siga inzira irimo ubusa kuva ku muryango ugera mu gikoni, mu bwiherero no mu cyumba cyo kuraramo.' }),
  'acc.dw.title': g('Door clear width (32")', { es: 'Ancho libre de puerta (32")', cu: 'Ancho libre de puerta (32")', uk: 'Вільна ширина дверей (32")', ru: 'Свободная ширина двери (32")', ti: 'ንጹር ስፍሓት ማዕጾ (32")', fa: 'عرض آزاد در (32")', 'fa-AF': 'عرض آزاد دروازه (32")', ar: 'العرض الصافي للباب (32")', rw: 'Ubugari bwisanzuye bw\'umuryango (32")' }),
  'acc.dw.skip': g('Place a door and we\'ll measure it.', { es: 'Pon una puerta y la medimos.', cu: 'Pon una puerta y la medimos.', uk: 'Постав двері — і ми їх виміряємо.', ru: 'Поставь дверь — и мы её измерим.', ti: 'ማዕጾ ኣቐምጥ፣ ክንዕቅኖ ኢና።', fa: 'یک در بگذار تا اندازه‌اش را بگیریم.', 'fa-AF': 'یک دروازه بگذار تا اندازه‌اش را بگیریم.', ar: 'ضع باباً وسنقيسه.', rw: 'Shyiraho umuryango tuwupime.' }),
  'acc.dw.skipTip': g('ADA wants 32" of clear opening. A 3\'-0" door usually gets you there.', { es: 'La ADA pide 32" de paso libre. Una puerta de 3\'-0" suele bastar.', cu: 'La ADA pide 32" de paso libre. Una puerta de 3\'-0" suele bastar.', uk: 'ADA вимагає 32" вільного проходу. Двері 3\'-0" зазвичай підходять.', ru: 'ADA требует 32" свободного прохода. Дверь 3\'-0" обычно подходит.', ti: 'ADA 32" ንጹር መኽፈቲ ይደሊ። ማዕጾ 3\'-0" መብዛሕትኡ ግዜ የብቅዕ።', fa: 'ADA ۳۲ اینچ بازشوی آزاد می‌خواهد. یک در 3\'-0" معمولاً کافی است.', 'fa-AF': 'ADA ۳۲ اینچ بازشوی آزاد می‌خواهد. یک دروازه 3\'-0" معمولاً کافی است.', ar: 'تطلب ADA فتحة صافية 32". باب 3\'-0" يكفي عادةً.', rw: 'ADA isaba 32" by\'umwanya wisanzuye. Umuryango wa 3\'-0" ubusanzwe urahagije.' }),
  'acc.dw.fail': g('A door is only {w} wide. ADA asks for 32" clear ({c}).', { es: 'Una puerta mide solo {w}. La ADA pide 32" libres ({c}).', cu: 'Una puerta mide solo {w}. La ADA pide 32" libres ({c}).', uk: 'Двері лише {w} завширшки. ADA просить 32" вільно ({c}).', ru: 'Дверь всего {w} шириной. ADA просит 32" свободно ({c}).', ti: 'ሓደ ማዕጾ {w} ጥራይ እዩ። ADA 32" ንጹር ({c}) ይሓትት።', fa: 'یک در فقط {w} عرض دارد. ADA ۳۲ اینچ آزاد ({c}) می‌خواهد.', 'fa-AF': 'یک دروازه فقط {w} عرض دارد. ADA ۳۲ اینچ آزاد ({c}) می‌خواهد.', ar: 'عرض أحد الأبواب {w} فقط. تطلب ADA ‏32" صافية ({c}).', rw: 'Umuryango umwe ufite {w} gusa. ADA isaba 32" byisanzuye ({c}).' }),
  'acc.dw.failTip': g('Use a 3\'-0" door. Baboo\'s Door tool places that size.', { es: 'Usa una puerta de 3\'-0". La herramienta Puerta de Baboo pone ese tamaño.', cu: 'Usa una puerta de 3\'-0". La herramienta Puerta de Baboo pone ese tamaño.', uk: 'Став двері 3\'-0". Інструмент Двері в Baboo ставить саме такі.', ru: 'Ставь дверь 3\'-0". Инструмент Дверь в Baboo ставит именно такую.', ti: 'ማዕጾ 3\'-0" ተጠቐም። መሳርሒ ማዕጾ Baboo ነዚ ዓቐን የቐምጥ።', fa: 'از در 3\'-0" استفاده کن. ابزار در Baboo همین اندازه را می‌گذارد.', 'fa-AF': 'از دروازه 3\'-0" استفاده کن. ابزار دروازه Baboo همین اندازه را می‌گذارد.', ar: 'استخدم باباً بعرض 3\'-0". أداة الباب في Baboo تضع هذا المقاس.', rw: 'Koresha umuryango wa 3\'-0". Igikoresho cy\'Umuryango cya Baboo gishyiraho ubwo bunini.' }),
  'acc.dw.pass': g('Doors are {w} — wider than the 32" clear opening.', { es: 'Las puertas miden {w}, más que los 32" de paso libre.', cu: 'Las puertas miden {w}, más que los 32" de paso libre.', uk: 'Двері {w} — ширші за 32" вільного проходу.', ru: 'Двери {w} — шире 32" свободного прохода.', ti: 'ማዕጾታት {w} እዮም — ካብ 32" ንጹር መኽፈቲ ይሰፍሑ።', fa: 'درها {w} هستند — پهن‌تر از ۳۲ اینچ بازشوی آزاد.', 'fa-AF': 'دروازه‌ها {w} هستند — پهن‌تر از ۳۲ اینچ بازشوی آزاد.', ar: 'الأبواب بعرض {w} — أعرض من الفتحة الصافية 32".', rw: 'Imiryango ifite {w} — irenze 32" by\'umwanya wisanzuye.' }),
  'acc.dw.passTip': g('Nice. Leave the swing side empty so the leaf can open.', { es: 'Bien. Deja libre el lado del giro para que la hoja abra.', cu: 'Bien. Deja libre el lado del giro para que la hoja abra.', uk: 'Чудово. Залиш бік відкривання порожнім, щоб стулка відчинялася.', ru: 'Отлично. Оставь сторону открывания пустой, чтобы створка открывалась.', ti: 'ጽቡቕ። እቲ ማዕጾ ክኽፈት ጎድኒ ምኽፋቱ ባዶ ግደፎ።', fa: 'خوب است. سمت باز شدن در را خالی بگذار تا لنگه باز شود.', 'fa-AF': 'خوب است. سمت باز شدن دروازه را خالی بگذار تا لنگه باز شود.', ar: 'رائع. اترك جهة الفتح فارغة ليتمكن الباب من الانفتاح.', rw: 'Ni byiza. Siga uruhande umuryango ufungukiraho rurimo ubusa.' }),
  'acc.dw.warn': g('A door is {w}. It meets 32" but a 3\'-0" leaf is easier to use.', { es: 'Una puerta mide {w}. Cumple los 32", pero una hoja de 3\'-0" es más cómoda.', cu: 'Una puerta mide {w}. Cumple los 32", pero una hoja de 3\'-0" es más cómoda.', uk: 'Двері {w}. Це відповідає 32", але стулка 3\'-0" зручніша.', ru: 'Дверь {w}. Это отвечает 32", но створка 3\'-0" удобнее.', ti: 'ሓደ ማዕጾ {w} እዩ። 32" የማልእ እዩ ግን 3\'-0" ይቐልል።', fa: 'یک در {w} است. به ۳۲ اینچ می‌رسد ولی لنگه 3\'-0" راحت‌تر است.', 'fa-AF': 'یک دروازه {w} است. به ۳۲ اینچ می‌رسد ولی لنگه 3\'-0" راحت‌تر است.', ar: 'أحد الأبواب {w}. يحقق 32" لكن باب 3\'-0" أسهل استخداماً.', rw: 'Umuryango umwe ufite {w}. Wujuje 32" ariko uwa 3\'-0" woroshye gukoresha.' }),
  'acc.dw.warnTip': g('When in doubt, draw doors at 3 feet.', { es: 'Si dudas, dibuja puertas de 3 pies.', cu: 'Si dudas, dibuja puertas de 3 pies.', uk: 'Якщо сумніваєшся, малюй двері на 3 фути.', ru: 'Если сомневаешься, рисуй двери в 3 фута.', ti: 'እንተተጠራጢርካ፣ ማዕጾታት ብ3 ጫማ ስኣል።', fa: 'اگر مطمئن نیستی، درها را ۳ فوت بکش.', 'fa-AF': 'اگر مطمئن نیستی، دروازه‌ها را ۳ فت رسم کن.', ar: 'عند الشك، ارسم الأبواب بعرض 3 أقدام.', rw: 'Niba ushidikanya, shushanya imiryango ya metero 3 z\'ibirenge (3 ft).' }),
  'acc.sw.title': g('Door swing is clear', { es: 'El giro de la puerta está libre', cu: 'El giro de la puerta está libre', uk: 'Шлях дверей вільний', ru: 'Путь двери свободен', ti: 'መንገዲ ምኽፋት ማዕጾ ንጹር እዩ', fa: 'مسیر باز شدن در آزاد است', 'fa-AF': 'مسیر باز شدن دروازه آزاد است', ar: 'مسار فتح الباب خالٍ', rw: 'Aho umuryango ufungukira harimo ubusa' }),
  'acc.sw.skip': g('No door to check yet.', { es: 'Aún no hay puerta que revisar.', cu: 'Aún no hay puerta que revisar.', uk: 'Ще немає дверей для перевірки.', ru: 'Пока нет двери для проверки.', ti: 'ገና ዝምርመር ማዕጾ የለን።', fa: 'هنوز دری برای بررسی نیست.', 'fa-AF': 'هنوز دروازه‌ای برای بررسی نیست.', ar: 'لا يوجد باب لفحصه بعد.', rw: 'Nta muryango wo gusuzuma urahari.' }),
  'acc.sw.skipTip': g('Keep sofas and beds out of the quarter-circle.', { es: 'Deja sofás y camas fuera del cuarto de círculo.', cu: 'Deja sofás y camas fuera del cuarto de círculo.', uk: 'Тримай дивани й ліжка поза чвертю кола.', ru: 'Держи диваны и кровати вне четверти круга.', ti: 'ሶፋታትን ዓራታትን ካብቲ ርብዒ ክቢ ኣርሕቕ።', fa: 'مبل و تخت را بیرون از ربع دایره نگه دار.', 'fa-AF': 'کوچ و چپرکت را بیرون از ربع دایره نگه دار.', ar: 'أبقِ الأرائك والأسرّة خارج ربع الدائرة.', rw: 'Ntushyire intebe n\'ibitanda mu gice cya kane cy\'uruziga.' }),
  'acc.sw.fail': g('{item} sits in a door swing.', { es: '{item} está en el giro de una puerta.', cu: '{item} está en el giro de una puerta.', uk: '{item} стоїть на шляху дверей.', ru: '{item} стоит на пути двери.', ti: '{item} ኣብ መንገዲ ምኽፋት ማዕጾ ኣሎ።', fa: '{item} سر راه باز شدن یک در است.', 'fa-AF': '{item} سر راه باز شدن یک دروازه است.', ar: '{item} في مسار فتح باب.', rw: '{item} kiri aho umuryango ufungukira.' }),
  'acc.sw.failTip': g('Move the piece, or swing the door the other way, so someone can open it.', { es: 'Mueve la pieza o abre la puerta hacia el otro lado para que se pueda abrir.', cu: 'Mueve la pieza o abre la puerta hacia el otro lado para que se pueda abrir.', uk: 'Посунь річ або відчини двері в інший бік, щоб їх можна було відкрити.', ru: 'Сдвинь вещь или открой дверь в другую сторону, чтобы её можно было открыть.', ti: 'ነቲ ኣቕሓ ኣግልሶ፣ ወይ ነቲ ማዕጾ ናብ ካልእ ጎድኒ ኣኽፍቶ።', fa: 'وسیله را جابه‌جا کن یا در را به سمت دیگر باز کن تا بشود بازش کرد.', 'fa-AF': 'سامان را جابه‌جا کن یا دروازه را به سمت دیگر باز کن تا بشود بازش کرد.', ar: 'حرّك القطعة أو اجعل الباب يفتح للجهة الأخرى ليتمكن أحد من فتحه.', rw: 'Imura icyo gikoresho, cyangwa uhindure uruhande umuryango ufungukiraho.' }),
  'acc.sw.pass': g('Nothing is sitting in a door swing.', { es: 'No hay nada en el giro de las puertas.', cu: 'No hay nada en el giro de las puertas.', uk: 'Ніщо не стоїть на шляху дверей.', ru: 'Ничто не стоит на пути двери.', ti: 'ኣብ መንገዲ ምኽፋት ማዕጾ ዝኾነ ነገር የለን።', fa: 'هیچ چیزی سر راه باز شدن درها نیست.', 'fa-AF': 'هیچ چیزی سر راه باز شدن دروازه‌ها نیست.', ar: 'لا شيء في مسار فتح الأبواب.', rw: 'Nta kintu kiri aho imiryango ifungukira.' }),
  'acc.sw.passTip': g('The quarter-circle on the plan is the swing. Keep it empty.', { es: 'El cuarto de círculo del plano es el giro. Déjalo libre.', cu: 'El cuarto de círculo del plano es el giro. Déjalo libre.', uk: 'Чверть кола на плані — це шлях дверей. Тримай його порожнім.', ru: 'Четверть круга на плане — это путь двери. Держи его пустым.', ti: 'እቲ ኣብ ትልሚ ዘሎ ርብዒ ክቢ መንገዲ ምኽፋት እዩ። ባዶ ግደፎ።', fa: 'ربع دایره روی نقشه مسیر باز شدن است. خالی نگهش دار.', 'fa-AF': 'ربع دایره روی نقشه مسیر باز شدن است. خالی نگهش دار.', ar: 'ربع الدائرة في المخطط هو مسار الفتح. أبقِه فارغاً.', rw: 'Igice cya kane cy\'uruziga ku gishushanyo ni aho umuryango ufungukira. Hasige harimo ubusa.' }),
  'acc.hall.title': g('Hall / route width (36")', { es: 'Ancho de pasillo / ruta (36")', cu: 'Ancho de pasillo / ruta (36")', uk: 'Ширина коридору / проходу (36")', ru: 'Ширина коридора / прохода (36")', ti: 'ስፍሓት መተሓላለፊ (36")', fa: 'عرض راهرو / مسیر (36")', 'fa-AF': 'عرض دهلیز / مسیر (36")', ar: 'عرض الممر / المسار (36")', rw: 'Ubugari bw\'inzira (36")' }),
  'acc.hall.skip': g('No skinny parallel walls to measure yet.', { es: 'Aún no hay paredes paralelas estrechas que medir.', cu: 'Aún no hay paredes paralelas estrechas que medir.', uk: 'Ще немає вузьких паралельних стін для вимірювання.', ru: 'Пока нет узких параллельных стен для измерения.', ti: 'ገና ዝዕቀኑ ጸባባት ጎኒ-ንጎኒ መናድቕ የለዉን።', fa: 'هنوز دیوار موازی باریکی برای اندازه‌گیری نیست.', 'fa-AF': 'هنوز دیوار موازی باریکی برای اندازه‌گیری نیست.', ar: 'لا توجد جدران متوازية ضيقة لقياسها بعد.', rw: 'Nta nkuta zibangikanye zifunganye zo gupima zirahari.' }),
  'acc.hall.skipTip': g('Interior walls make halls. Leave 3 feet so a wheelchair can roll.', { es: 'Las paredes interiores forman pasillos. Deja 3 pies para que pase una silla de ruedas.', cu: 'Las paredes interiores forman pasillos. Deja 3 pies para que pase una silla de ruedas.', uk: 'Внутрішні стіни утворюють коридори. Залиш 3 фути, щоб проїхав візок.', ru: 'Внутренние стены образуют коридоры. Оставь 3 фута, чтобы проехала коляска.', ti: 'ውሽጣዊ መናድቕ መተሓላለፊ ይገብሩ። ዓረብያ ክሓልፍ 3 ጫማ ግደፍ።', fa: 'دیوارهای داخلی راهرو می‌سازند. ۳ فوت جا بگذار تا ویلچر رد شود.', 'fa-AF': 'دیوارهای داخلی دهلیز می‌سازند. ۳ فت جا بگذار تا چوکی چرخ‌دار رد شود.', ar: 'الجدران الداخلية تصنع الممرات. اترك 3 أقدام ليمرّ الكرسي المتحرك.', rw: 'Inkuta z\'imbere zikora inzira. Siga ibirenge 3 kugira ngo igare rinyureho.' }),
  'acc.hall.fail': g('Tightest gap between walls is {w}. Accessible routes want 3\'-0".', { es: 'El hueco más estrecho entre paredes es {w}. Las rutas accesibles piden 3\'-0".', cu: 'El hueco más estrecho entre paredes es {w}. Las rutas accesibles piden 3\'-0".', uk: 'Найвужчий прохід між стінами — {w}. Доступні шляхи потребують 3\'-0".', ru: 'Самый узкий проход между стенами — {w}. Доступным путям нужно 3\'-0".', ti: 'እቲ ዝጸበበ ክፍተት ኣብ መንጎ መናድቕ {w} እዩ። ተበጻሒ መንገዲ 3\'-0" ይደሊ።', fa: 'تنگ‌ترین فاصله بین دیوارها {w} است. مسیرهای دسترس‌پذیر 3\'-0" می‌خواهند.', 'fa-AF': 'تنگ‌ترین فاصله بین دیوارها {w} است. مسیرهای دسترس‌پذیر 3\'-0" می‌خواهند.', ar: 'أضيق فجوة بين الجدران {w}. المسارات الميسّرة تحتاج 3\'-0".', rw: 'Umwanya muto cyane hagati y\'inkuta ni {w}. Inzira zigerwaho zikeneye 3\'-0".' }),
  'acc.hall.failTip': g('Nudge a wall. Halls feel better at 3\'-6" or 4\'.', { es: 'Mueve un poco una pared. Los pasillos se sienten mejor a 3\'-6" o 4\'.', cu: 'Mueve un poco una pared. Los pasillos se sienten mejor a 3\'-6" o 4\'.', uk: 'Посунь стіну. Коридори зручніші на 3\'-6" або 4\'.', ru: 'Сдвинь стену. Коридоры удобнее при 3\'-6" или 4\'.', ti: 'መንደቕ ቁሩብ ኣግልስ። መተሓላለፊ ብ3\'-6" ወይ 4\' ይምችእ።', fa: 'یک دیوار را کمی جابه‌جا کن. راهرو با 3\'-6" یا 4\' بهتر است.', 'fa-AF': 'یک دیوار را کمی جابه‌جا کن. دهلیز با 3\'-6" یا 4\' بهتر است.', ar: 'حرّك جداراً قليلاً. الممرات أفضل بعرض 3\'-6" أو 4\'.', rw: 'Imura urukuta gato. Inzira ziba nziza kuri 3\'-6" cyangwa 4\'.' }),
  'acc.hall.pass': g('Tightest wall gap is {w} — at least 36" to roll through.', { es: 'El hueco más estrecho es {w}: al menos 36" para pasar rodando.', cu: 'El hueco más estrecho es {w}: al menos 36" para pasar rodando.', uk: 'Найвужчий прохід — {w}: щонайменше 36", щоб проїхати.', ru: 'Самый узкий проход — {w}: не меньше 36", чтобы проехать.', ti: 'እቲ ዝጸበበ ክፍተት {w} እዩ — ንምሕላፍ ብውሑዱ 36"።', fa: 'تنگ‌ترین فاصله {w} است — دست‌کم ۳۶ اینچ برای رد شدن.', 'fa-AF': 'تنگ‌ترین فاصله {w} است — دست‌کم ۳۶ اینچ برای رد شدن.', ar: 'أضيق فجوة {w} — 36" على الأقل للمرور.', rw: 'Umwanya muto cyane ni {w} — nibura 36" byo kunyuramo.' }),
  'acc.hall.passTip': g('Keep that path free of furniture too.', { es: 'Deja ese camino libre de muebles también.', cu: 'Deja ese camino libre de muebles también.', uk: 'Тримай цей шлях вільним і від меблів.', ru: 'Держи этот путь свободным и от мебели.', ti: 'ነቲ መንገዲ ካብ ኣቑሑ እውን ንጹር ግበሮ።', fa: 'آن مسیر را از وسایل هم خالی نگه دار.', 'fa-AF': 'آن مسیر را از سامان هم خالی نگه دار.', ar: 'أبقِ هذا المسار خالياً من الأثاث أيضاً.', rw: 'Iyo nzira nayo yisige nta bikoresho birimo.' }),
  'acc.turn.title': g('5-foot turn in the bath', { es: 'Giro de 5 pies en el baño', cu: 'Giro de 5 pies en el baño', uk: 'Розворот 5 футів у ванній', ru: 'Разворот 5 футов в ванной', ti: 'ምዝዋር 5 ጫማ ኣብ ባኞ', fa: 'چرخش ۵ فوتی در حمام', 'fa-AF': 'چرخش ۵ فتی در تشناب', ar: 'دوران 5 أقدام في الحمام', rw: 'Guhindukira kwa ft 5 mu bwiherero' }),
  'acc.turn.skip': g('Name a bath and we\'ll check for a 60" turning circle.', { es: 'Nombra un baño y revisamos el círculo de giro de 60".', cu: 'Nombra un baño y revisamos el círculo de giro de 60".', uk: 'Познач ванну — і ми перевіримо коло розвороту 60".', ru: 'Отметь ванную — и мы проверим круг разворота 60".', ti: 'ባኞ ሰምዮ፣ ክቢ ምዝዋር 60" ክንምርምር ኢና።', fa: 'یک حمام نام‌گذاری کن تا دایره چرخش ۶۰ اینچی را بررسی کنیم.', 'fa-AF': 'یک تشناب نام‌گذاری کن تا دایره چرخش ۶۰ اینچی را بررسی کنیم.', ar: 'سمِّ حماماً وسنفحص دائرة الدوران 60".', rw: 'Vuga ubwiherero tuzasuzume uruziga rwo guhindukira rwa 60".' }),
  'acc.turn.skipTip': g('Room tool → Bath → click inside the walls.', { es: 'Herramienta Cuarto → Baño → haz clic dentro de las paredes.', cu: 'Herramienta Cuarto → Baño → haz clic dentro de las paredes.', uk: 'Інструмент Кімната → Ванна → клацни всередині стін.', ru: 'Инструмент Комната → Ванная → щёлкни внутри стен.', ti: 'መሳርሒ ክፍሊ → ባኞ → ኣብ ውሽጢ መናድቕ ጠውቕ።', fa: 'ابزار اتاق ← حمام ← داخل دیوارها کلیک کن.', 'fa-AF': 'ابزار اتاق ← تشناب ← داخل دیوارها کلیک کن.', ar: 'أداة الغرفة ← حمام ← انقر داخل الجدران.', rw: 'Igikoresho cy\'Icyumba → Ubwiherero → kanda imbere mu nkuta.' }),
  'acc.turn.open': g('{room} isn\'t a closed shape yet — finish the walls.', { es: '{room} aún no está cerrado: termina las paredes.', cu: '{room} aún no está cerrado: termina las paredes.', uk: '{room} ще не замкнена форма — доведи стіни.', ru: '{room} ещё не замкнутая форма — доведи стены.', ti: '{room} ገና ዝተዓጽወ ቅርጺ ኣይኮነን — መናድቕ ወድእ።', fa: '{room} هنوز شکل بسته‌ای نیست — دیوارها را کامل کن.', 'fa-AF': '{room} هنوز شکل بسته‌ای نیست — دیوارها را کامل کن.', ar: '{room} ليس شكلاً مغلقاً بعد — أكمل الجدران.', rw: '{room} ntirafunga — rangiza inkuta.' }),
  'acc.turn.pass': g('{room} can fit a 5\'-0" turn ({w} short side · {a} sq ft).', { es: 'En {room} cabe un giro de 5\'-0" ({w} lado corto · {a} pies²).', cu: 'En {room} cabe un giro de 5\'-0" ({w} lado corto · {a} pies²).', uk: 'У {room} вміщається розворот 5\'-0" ({w} коротка сторона · {a} кв. футів).', ru: 'В {room} помещается разворот 5\'-0" ({w} короткая сторона · {a} кв. футов).', ti: 'ኣብ {room} ምዝዋር 5\'-0" ይኣቱ ({w} ሓጺር ጎድኒ · {a} sq ft)።', fa: 'در {room} چرخش 5\'-0" جا می‌شود ({w} ضلع کوتاه · {a} فوت مربع).', 'fa-AF': 'در {room} چرخش 5\'-0" جا می‌شود ({w} ضلع کوتاه · {a} فت مربع).', ar: 'يتسع {room} لدوران 5\'-0" ({w} الضلع القصير · {a} قدم مربع).', rw: '{room} yakwakira guhindukira kwa 5\'-0" ({w} uruhande rugufi · {a} sq ft).' }),
  'acc.turn.warn': g('{room} is tight (short side {w}). A 5\'-0" circle is the usual turn.', { es: '{room} es estrecho (lado corto {w}). Lo normal es un círculo de 5\'-0".', cu: '{room} es estrecho (lado corto {w}). Lo normal es un círculo de 5\'-0".', uk: '{room} тісна (коротка сторона {w}). Звичний розворот — коло 5\'-0".', ru: '{room} тесная (короткая сторона {w}). Обычный разворот — круг 5\'-0".', ti: '{room} ጸቢብ እዩ (ሓጺር ጎድኒ {w})። ልሙድ ምዝዋር ክቢ 5\'-0" እዩ።', fa: '{room} تنگ است (ضلع کوتاه {w}). چرخش معمول یک دایره 5\'-0" است.', 'fa-AF': '{room} تنگ است (ضلع کوتاه {w}). چرخش معمول یک دایره 5\'-0" است.', ar: '{room} ضيق (الضلع القصير {w}). الدوران المعتاد دائرة 5\'-0".', rw: '{room} irafunganye (uruhande rugufi {w}). Guhindukira gusanzwe ni uruziga rwa 5\'-0".' }),
  'acc.turn.fail': g('{room} is only {w} on the short side. Wheelchairs need a 5\'-0" turn.', { es: '{room} mide solo {w} en el lado corto. Las sillas de ruedas necesitan 5\'-0" para girar.', cu: '{room} mide solo {w} en el lado corto. Las sillas de ruedas necesitan 5\'-0" para girar.', uk: '{room} лише {w} з короткого боку. Візкам потрібен розворот 5\'-0".', ru: '{room} всего {w} с короткой стороны. Коляскам нужен разворот 5\'-0".', ti: '{room} ኣብ ሓጺር ጎድኒ {w} ጥራይ እዩ። ዓረብያ ስንኩላን ምዝዋር 5\'-0" የድልዮም።', fa: '{room} در ضلع کوتاه فقط {w} است. ویلچر به چرخش 5\'-0" نیاز دارد.', 'fa-AF': '{room} در ضلع کوتاه فقط {w} است. چوکی چرخ‌دار به چرخش 5\'-0" نیاز دارد.', ar: '{room} بعرض {w} فقط في الضلع القصير. الكراسي المتحركة تحتاج دوران 5\'-0".', rw: '{room} ifite {w} gusa ku ruhande rugufi. Amagare akenera guhindukira kwa 5\'-0".' }),
  'acc.turn.tip': g('Grow the bath, or keep the middle empty for the circle.', { es: 'Agranda el baño o deja libre el centro para el círculo.', cu: 'Agranda el baño o deja libre el centro para el círculo.', uk: 'Збільш ванну або залиш середину порожньою для кола.', ru: 'Увеличь ванную или оставь середину пустой для круга.', ti: 'ነቲ ባኞ ኣዕብዮ፣ ወይ ማእከሉ ንክቢ ባዶ ግደፎ።', fa: 'حمام را بزرگ‌تر کن یا وسطش را برای دایره خالی بگذار.', 'fa-AF': 'تشناب را بزرگ‌تر کن یا وسطش را برای دایره خالی بگذار.', ar: 'كبّر الحمام أو اترك منتصفه فارغاً للدائرة.', rw: 'Kuza ubwiherero, cyangwa usige hagati harimo ubusa ku ruziga.' }),
  'acc.k.title': g('Kitchen aisle (40")', { es: 'Pasillo de cocina (40")', cu: 'Pasillo de cocina (40")', uk: 'Прохід на кухні (40")', ru: 'Проход на кухне (40")', ti: 'መተሓላለፊ ክሽነ (40")', fa: 'راهروی آشپزخانه (40")', 'fa-AF': 'راهروی آشپزخانه (40")', ar: 'ممر المطبخ (40")', rw: 'Inzira y\'igikoni (40")' }),
  'acc.k.skip': g('Place sink, stove, or fridge and we\'ll check the work aisle.', { es: 'Pon fregadero, estufa o refrigerador y revisamos el pasillo de trabajo.', cu: 'Pon fregadero, estufa o refrigerador y revisamos el pasillo de trabajo.', uk: 'Постав мийку, плиту чи холодильник — і ми перевіримо робочий прохід.', ru: 'Поставь мойку, плиту или холодильник — и мы проверим рабочий проход.', ti: 'መሕጸቢ፣ ምድጃ ወይ ፍሪጅ ኣቐምጥ፣ መተሓላለፊ ስራሕ ክንምርምር ኢና።', fa: 'سینک، اجاق یا یخچال بگذار تا راهروی کار را بررسی کنیم.', 'fa-AF': 'دستشوی، داش یا یخچال بگذار تا راهروی کار را بررسی کنیم.', ar: 'ضع حوضاً أو موقداً أو ثلاجة وسنفحص ممر العمل.', rw: 'Shyiraho iyozero, iziko cyangwa firigo tuzasuzume inzira yo gukoreramo.' }),
  'acc.k.skipTip': g('Leave about 3\'-4" between counters so someone can turn.', { es: 'Deja unos 3\'-4" entre mesadas para poder girar.', cu: 'Deja unos 3\'-4" entre mesadas para poder girar.', uk: 'Залиш близько 3\'-4" між стільницями, щоб можна було повернутися.', ru: 'Оставь около 3\'-4" между столешницами, чтобы можно было повернуться.', ti: 'ኣብ መንጎ መሰሓሓቢ 3\'-4" ኣቢሉ ግደፍ።', fa: 'حدود 3\'-4" بین کابینت‌ها جا بگذار تا بشود چرخید.', 'fa-AF': 'حدود 3\'-4" بین الماری‌ها جا بگذار تا بشود چرخید.', ar: 'اترك نحو 3\'-4" بين الأسطح ليتمكن أحد من الدوران.', rw: 'Siga hafi 3\'-4" hagati y\'ameza kugira ngo umuntu ashobore guhindukira.' }),
  'acc.k.fail': g('{a} and {b} are about {w} apart. Work aisles like 40".', { es: '{a} y {b} están a unos {w}. Los pasillos de trabajo piden 40".', cu: '{a} y {b} están a unos {w}. Los pasillos de trabajo piden 40".', uk: '{a} і {b} приблизно за {w} одне від одного. Робочому проходу треба 40".', ru: '{a} и {b} примерно в {w} друг от друга. Рабочему проходу нужно 40".', ti: '{a}ን {b}ን ኣስታት {w} ይራሓሓቑ። መተሓላለፊ ስራሕ 40" ይደሊ።', fa: '{a} و {b} حدود {w} از هم فاصله دارند. راهروی کار ۴۰ اینچ می‌خواهد.', 'fa-AF': '{a} و {b} حدود {w} از هم فاصله دارند. راهروی کار ۴۰ اینچ می‌خواهد.', ar: 'المسافة بين {a} و{b} نحو {w}. ممرات العمل تحتاج 40".', rw: '{a} na {b} bitandukanywa na {w} hafi. Inzira yo gukoreramo ikenera 40".' }),
  'acc.k.failTip': g('Spread the kitchen triangle. Sink · stove · fridge need room to work.', { es: 'Abre el triángulo de cocina. Fregadero · estufa · refrigerador necesitan espacio.', cu: 'Abre el triángulo de cocina. Fregadero · estufa · refrigerador necesitan espacio.', uk: 'Розсунь кухонний трикутник. Мийці · плиті · холодильнику потрібне місце.', ru: 'Раздвинь кухонный треугольник. Мойке · плите · холодильнику нужно место.', ti: 'ሰለስተ ኩርናዕ ክሽነ ኣስፍሖ። መሕጸቢ · ምድጃ · ፍሪጅ ቦታ የድልዮም።', fa: 'مثلث آشپزخانه را بازتر کن. سینک · اجاق · یخچال جا برای کار می‌خواهند.', 'fa-AF': 'مثلث آشپزخانه را بازتر کن. دستشوی · داش · یخچال جا برای کار می‌خواهند.', ar: 'وسّع مثلث المطبخ. الحوض · الموقد · الثلاجة تحتاج مساحة للعمل.', rw: 'Agura mpandeshatu y\'igikoni. Iyozero · iziko · firigo bikenera umwanya.' }),
  'acc.k.row': g('Kitchen pieces sit in a row, with open floor in front.', { es: 'Las piezas de cocina están en fila, con piso libre delante.', cu: 'Las piezas de cocina están en fila, con piso libre delante.', uk: 'Кухонні речі стоять в ряд, а попереду вільна підлога.', ru: 'Кухонные вещи стоят в ряд, а впереди свободный пол.', ti: 'ኣቑሑ ክሽነ ብመስመር ኣለዉ፣ ቅድሚኦም ክፉት ባይታ ኣሎ።', fa: 'وسایل آشپزخانه در یک ردیف‌اند و جلویشان کف باز است.', 'fa-AF': 'سامان آشپزخانه در یک قطار است و پیش رویشان فرش باز است.', ar: 'قطع المطبخ في صف واحد، وأمامها أرض مفتوحة.', rw: 'Ibikoresho by\'igikoni biri ku murongo, imbere yabyo hari umwanya.' }),
  'acc.k.pass': g('Kitchen pieces have about {w} between them.', { es: 'Las piezas de cocina tienen unos {w} entre sí.', cu: 'Las piezas de cocina tienen unos {w} entre sí.', uk: 'Між кухонними речами приблизно {w}.', ru: 'Между кухонными вещами примерно {w}.', ti: 'ኣብ መንጎ ኣቑሑ ክሽነ ኣስታት {w} ኣሎ።', fa: 'بین وسایل آشپزخانه حدود {w} فاصله است.', 'fa-AF': 'بین سامان آشپزخانه حدود {w} فاصله است.', ar: 'بين قطع المطبخ نحو {w}.', rw: 'Hagati y\'ibikoresho by\'igikoni hari hafi {w}.' }),
  'acc.k.passTip': g('That\'s the work aisle. Keep it a path, not storage.', { es: 'Ese es el pasillo de trabajo. Que sea camino, no almacén.', cu: 'Ese es el pasillo de trabajo. Que sea camino, no almacén.', uk: 'Це робочий прохід. Хай буде шляхом, а не складом.', ru: 'Это рабочий проход. Пусть будет путём, а не складом.', ti: 'እዚ መተሓላለፊ ስራሕ እዩ። መንገዲ ይኹን፣ መዕቈሪ ኣይኹን።', fa: 'این راهروی کار است. مسیر بماند، نه انباری.', 'fa-AF': 'این راهروی کار است. راه بماند، نه گدام.', ar: 'هذا ممر العمل. اجعله طريقاً لا مخزناً.', rw: 'Iyo ni inzira yo gukoreramo. Ibe inzira, si ububiko.' }),
  // 2.13.49: safe opening of damaged plan files. ti, fa-AF and rw are UNCHECKED native copy.
  '3d.fail.title': g('3D can\'t start on this computer right now', { es: 'El 3D no puede arrancar en este equipo ahora', cu: 'El 3D no puede arrancar en esta computadora ahora', uk: '3D зараз не може запуститися на цьому комп\'ютері', ru: '3D сейчас не может запуститься на этом компьютере', ti: '3D ኣብዚ ኮምፒተር ሕጂ ክጅምር ኣይክእልን', fa: 'سه‌بعدی الان روی این کامپیوتر اجرا نمی‌شود', 'fa-AF': 'سه‌بعدی حالا روی این کمپیوتر اجرا نمی‌شود', ar: 'لا يمكن تشغيل العرض الثلاثي على هذا الحاسوب الآن', rw: '3D ntishobora gutangira kuri iyi mudasobwa ubu' }),
  '3d.fail.body': g('Your plan is safe. The Dollhouse shows it in 3D too. If this keeps happening, tell your teacher.', { es: 'Tu plano está a salvo. La Casa de muñecas también lo muestra en 3D. Si sigue pasando, avisa a tu maestro.', cu: 'Tu plano está a salvo. La Casa de muñecas también lo muestra en 3D. Si sigue pasando, avísale a tu maestro.', uk: 'Твій план у безпеці. Ляльковий будинок теж показує його в 3D. Якщо це повторюється, скажи вчителю.', ru: 'Твой план в безопасности. Кукольный дом тоже показывает его в 3D. Если это повторяется, скажи учителю.', ti: 'ትልሚኻ ውሑስ እዩ። ገዛ ኣሻንጉሊት እውን ብ3D የርእዮ። እንተቐጺሉ ንመምህርካ ንገሮ።', fa: 'نقشه‌ات امن است. خانه عروسکی هم آن را سه‌بعدی نشان می‌دهد. اگر باز هم شد، به معلمت بگو.', 'fa-AF': 'نقشه‌ات امن است. خانه گُدی هم آن را سه‌بعدی نشان می‌دهد. اگر باز هم شد، به معلمت بگو.', ar: 'مخططك بأمان. بيت الدمى يعرضه بشكل ثلاثي أيضاً. إذا تكرر ذلك، أخبر معلمك.', rw: 'Igishushanyo cyawe kirarinzwe. Inzu y\'ibikinisho nayo icyerekana muri 3D. Nibikomeza, bwira mwarimu wawe.' }),
  '3d.fail.retry': g('Try 3D again', { es: 'Probar 3D otra vez', cu: 'Probar 3D otra vez', uk: 'Спробувати 3D ще раз', ru: 'Попробовать 3D ещё раз', ti: '3D እንደገና ፈትን', fa: 'دوباره سه‌بعدی را امتحان کن', 'fa-AF': 'دوباره سه‌بعدی را امتحان کن', ar: 'جرّب العرض الثلاثي مجدداً', rw: 'Ongera ugerageze 3D' }),
  'toast.importFixed1': g('Plan opened. 1 broken piece was left out.', { es: 'Plano abierto. Se dejó fuera 1 pieza rota.', cu: 'Plano abierto. Se quedó fuera 1 pieza rota.', uk: 'План відкрито. 1 зламану частину пропущено.', ru: 'План открыт. 1 сломанная часть пропущена.', ti: 'ትልሚ ተኸፊቱ። 1 ዝተሰብረ ክፋል ተሪፉ።', fa: 'نقشه باز شد. ۱ قطعه خراب کنار گذاشته شد.', 'fa-AF': 'نقشه باز شد. ۱ قطعه خراب کنار گذاشته شد.', ar: 'فُتح المخطط. تُركت قطعة تالفة واحدة.', rw: 'Igishushanyo cyafunguwe. Igice 1 cyangiritse cyasizwe.' }),
  'toast.notPlan': g('That file isn\'t a Baboo plan. Your plan did not change.', { es: 'Ese archivo no es un plano de Baboo. Tu plano no cambió.', cu: 'Ese archivo no es un plano de Baboo. Tu plano no cambió.', uk: 'Цей файл — не план Baboo. Твій план не змінився.', ru: 'Этот файл — не план Baboo. Твой план не изменился.', ti: 'እዚ ፋይል ትልሚ Baboo ኣይኮነን። ትልሚኻ ኣይተቐየረን።', fa: 'این فایل نقشه Baboo نیست. نقشه‌ات تغییری نکرد.', 'fa-AF': 'این فایل نقشه Baboo نیست. نقشه‌ات تغییر نکرد.', ar: 'هذا الملف ليس مخطط Baboo. لم يتغير مخططك.', rw: 'Iyo dosiye si igishushanyo cya Baboo. Igishushanyo cyawe nticyahindutse.' }),
  'toast.importFixed': g('Plan opened. {n} broken pieces were left out.', { es: 'Plano abierto. Se dejaron fuera {n} piezas rotas.', cu: 'Plano abierto. Se quedaron fuera {n} piezas rotas.', uk: 'План відкрито. {n} зламаних частин пропущено.', ru: 'План открыт. {n} сломанных частей пропущено.', ti: 'ትልሚ ተኸፊቱ። {n} ዝተሰብሩ ክፋላት ተሪፎም።', fa: 'نقشه باز شد. {n} قطعه خراب کنار گذاشته شد.', 'fa-AF': 'نقشه باز شد. {n} قطعه خراب کنار گذاشته شد.', ar: 'فُتح المخطط. تُركت {n} قطع تالفة.', rw: 'Igishushanyo cyafunguwe. Ibice {n} byangiritse byasizwe.' }),
  'news.robust': g('Plan files with broken pieces now open safely: Baboo leaves out the broken parts and tells you how many.', { es: 'Los archivos de plano con piezas rotas ahora se abren bien: Baboo deja fuera lo roto y te dice cuántas.', cu: 'Los archivos de plano con piezas rotas ahora abren bien: Baboo deja fuera lo roto y te dice cuántas.', uk: 'Файли планів зі зламаними частинами тепер відкриваються безпечно: Baboo пропускає зламане й каже скільки.', ru: 'Файлы планов со сломанными частями теперь открываются безопасно: Baboo пропускает сломанное и говорит сколько.', ti: 'ፋይላት ትልሚ ምስ ዝተሰብሩ ክፋላት ሕጂ ብሰላም ይኽፈቱ፦ Baboo ነቲ ዝተሰብረ ገዲፉ ክንደይ ምዃኑ ይነግረካ።', fa: 'فایل‌های نقشه با قطعه‌های خراب حالا بی‌خطر باز می‌شوند: Baboo قسمت‌های خراب را کنار می‌گذارد و تعدادشان را می‌گوید.', 'fa-AF': 'فایل‌های نقشه با قطعه‌های خراب حالا بی‌خطر باز می‌شوند: Baboo قسمت‌های خراب را کنار می‌گذارد و تعدادشان را می‌گوید.', ar: 'ملفات المخططات ذات القطع التالفة تُفتح الآن بأمان: يترك Baboo الأجزاء التالفة ويخبرك بعددها.', rw: 'Amadosiye y\'ibishushanyo afite ibice byangiritse ubu afunguka neza: Baboo isiga ibyangiritse ikakubwira umubare wabyo.' }),
  // 2.13.48: hover tips, screen-reader labels, save messages. ti, fa-AF and rw are UNCHECKED native copy.
  'news.tipsWords': g('Hover tips on the tools, save messages, and screen-reader labels are in your language.', { es: 'Las ayudas de las herramientas, los mensajes de guardar y las etiquetas para lectores de pantalla están en tu idioma.', cu: 'Las ayudas de las herramientas, los mensajes de guardar y las etiquetas para lectores de pantalla están en tu idioma.', uk: 'Підказки інструментів, повідомлення про збереження й мітки для читачів екрана — твоєю мовою.', ru: 'Подсказки инструментов, сообщения о сохранении и метки для чтецов экрана — на твоём языке.', ti: 'ምኽሪ መሳርሒታት፣ መልእኽቲ ምዕቃብን ምልክታት ኣንበብቲ ስክሪንን ብቋንቋኻ እዮም።', fa: 'راهنمای ابزارها، پیام‌های ذخیره و برچسب‌های صفحه‌خوان به زبان تو هستند.', 'fa-AF': 'رهنمای ابزارها، پیام‌های ذخیره و برچسب‌های صفحه‌خوان به زبان تو هستند.', ar: 'تلميحات الأدوات ورسائل الحفظ وتسميات قارئ الشاشة بلغتك.', rw: 'Inama z\'ibikoresho, ubutumwa bwo kubika n\'ibirango by\'abasoma ecran biri mu rurimi rwawe.' }),
  'a11y.access': g('Access check', { es: 'Revisión de acceso', cu: 'Revisión de acceso', uk: 'Перевірка доступності', ru: 'Проверка доступности', ti: 'ምርመራ ተበጻሕነት', fa: 'بررسی دسترسی‌پذیری', 'fa-AF': 'بررسی دسترسی‌پذیری', ar: 'فحص سهولة الوصول', rw: 'Isuzuma ry\'ikoreshwa' }),
  'tip.trace': g('Turn the latest sketch into straight walls', { es: 'Convierte el último boceto en paredes rectas', cu: 'Convierte el último boceto en paredes rectas', uk: 'Перетвори останній ескіз на рівні стіни', ru: 'Преврати последний набросок в ровные стены', ti: 'ነቲ ናይ መወዳእታ ንድፊ ናብ ቀጥታ መናድቕ ቀይሮ', fa: 'آخرین طرح را به دیوارهای صاف تبدیل کن', 'fa-AF': 'آخرین طرح را به دیوارهای مستقیم تبدیل کن', ar: 'حوّل آخر رسم إلى جدران مستقيمة', rw: 'Hindura igishushanyo cya nyuma inkuta zigororotse' }),
  'tip.clip': g('Clip a sharp corner — rooms keep the slant', { es: 'Corta una esquina — los cuartos siguen la diagonal', cu: 'Corta una esquina — los cuartos siguen la diagonal', uk: 'Зріж гострий кут — кімнати зберігають скіс', ru: 'Срежь острый угол — комнаты сохранят скос', ti: 'በሊሕ ኩርናዕ ቁረጽ — ክፍልታት ነቲ ስንጭሮ ይሕዙ', fa: 'یک گوشه تیز را ببر — اتاق‌ها شیب را نگه می‌دارند', 'fa-AF': 'یک گوشه تیز را ببر — اتاق‌ها شیب را نگه می‌دارند', ar: 'اقطع زاوية حادة — الغرف تحتفظ بالميل', rw: 'Kata inguni ityaye — ibyumba bigumana uruhande ruhengamye' }),
  'tip.inside': g('Inside walls are thinner and skip the roof outline', { es: 'Las paredes interiores son más finas y no cuentan para el techo', cu: 'Las paredes interiores son más finas y no cuentan para el techo', uk: 'Внутрішні стіни тонші й не входять у контур даху', ru: 'Внутренние стены тоньше и не входят в контур крыши', ti: 'ውሽጣዊ መናድቕ ቀጠንቲ እዮም፣ ኣብ ቅርጺ ናሕሲ ኣይኣትዉን', fa: 'دیوارهای داخلی نازک‌ترند و در طرح سقف نمی‌آیند', 'fa-AF': 'دیوارهای داخلی نازک‌ترند و در طرح بام نمی‌آیند', ar: 'الجدران الداخلية أرفع ولا تدخل في حدود السقف', rw: 'Inkuta z\'imbere ziroroshye kandi ntizibarwa mu gisenge' }),
  'tip.copy': g('Duplicate (Ctrl+D)', { es: 'Duplicar (Ctrl+D)', cu: 'Duplicar (Ctrl+D)', uk: 'Дублювати (Ctrl+D)', ru: 'Дублировать (Ctrl+D)', ti: 'ቅዳሕ (Ctrl+D)', fa: 'تکثیر (Ctrl+D)', 'fa-AF': 'کاپی (Ctrl+D)', ar: 'تكرار (Ctrl+D)', rw: 'Kopa (Ctrl+D)' }),
  'tip.rotate': g('Turn 90° (])', { es: 'Girar 90° (])', cu: 'Girar 90° (])', uk: 'Повернути на 90° (])', ru: 'Повернуть на 90° (])', ti: '90° ጠውዮ (])', fa: 'چرخش ۹۰° (])', 'fa-AF': 'چرخش ۹۰° (])', ar: 'تدوير 90° (])', rw: 'Hindukiza 90° (])' }),
  'tip.fold': g('Fold the tools away — the grid stays full (Esc)', { es: 'Pliega las herramientas — la cuadrícula queda completa (Esc)', cu: 'Pliega las herramientas — la cuadrícula queda completa (Esc)', uk: 'Згорни інструменти — сітка лишається повною (Esc)', ru: 'Сверни инструменты — сетка остаётся полной (Esc)', ti: 'መሳርሒታት ዕጸፍ — መርበብ ምሉእ ይተርፍ (Esc)', fa: 'ابزارها را جمع کن — شبکه کامل می‌ماند (Esc)', 'fa-AF': 'ابزارها را جمع کن — شبکه کامل می‌ماند (Esc)', ar: 'اطوِ الأدوات — تبقى الشبكة كاملة (Esc)', rw: 'Funga ibikoresho — urusobe ruguma rwuzuye (Esc)' }),
  'a11y.job': g('Job', { es: 'Tarea', cu: 'Tarea', uk: 'Завдання', ru: 'Задание', ti: 'ስራሕ', fa: 'کار', 'fa-AF': 'کار', ar: 'المهمة', rw: 'Umukoro' }),
  'a11y.next': g('Next step', { es: 'Siguiente paso', cu: 'Siguiente paso', uk: 'Наступний крок', ru: 'Следующий шаг', ti: 'ዝቕጽል ስጉምቲ', fa: 'گام بعدی', 'fa-AF': 'گام بعدی', ar: 'الخطوة التالية', rw: 'Intambwe ikurikira' }),
  'a11y.planTaps': g('Plan zoom and roof', { es: 'Zoom del plano y techo', cu: 'Zoom del plano y techo', uk: 'Масштаб плану й дах', ru: 'Масштаб плана и крыша', ti: 'ምቕራብ ፕላንን ናሕስን', fa: 'بزرگ‌نمایی نقشه و سقف', 'fa-AF': 'کلان‌نمایی نقشه و بام', ar: 'تكبير المخطط والسقف', rw: 'Kwegereza igishushanyo n\'igisenge' }),
  'save.ok': g('Saved on this Chromebook. Name: {title}. A copy also downloaded.', { es: 'Guardado en este Chromebook. Nombre: {title}. También se descargó una copia.', cu: 'Guardado en este Chromebook. Nombre: {title}. También se bajó una copia.', uk: 'Збережено на цьому Chromebook. Назва: {title}. Копію також завантажено.', ru: 'Сохранено на этом Chromebook. Название: {title}. Копия тоже скачана.', ti: 'ኣብዚ Chromebook ተዓቂቡ። ስም፦ {title}። ቅዳሕ እውን ወሪዱ።', fa: 'روی همین کروم‌بوک ذخیره شد. نام: {title}. یک نسخه هم دانلود شد.', 'fa-AF': 'روی همین کروم‌بوک ذخیره شد. نام: {title}. یک کاپی هم دانلود شد.', ar: 'حُفظ على هذا الـChromebook. الاسم: {title}. ونُزّلت نسخة أيضاً.', rw: 'Byabitswe kuri iyi Chromebook. Izina: {title}. Kopi nayo yamanuwe.' }),
  'save.fail': g('Could not save on this Chromebook. Tap Save again.', { es: 'No se pudo guardar en este Chromebook. Pulsa Guardar otra vez.', cu: 'No se pudo guardar en este Chromebook. Toca Guardar otra vez.', uk: 'Не вдалося зберегти на цьому Chromebook. Натисни Зберегти ще раз.', ru: 'Не удалось сохранить на этом Chromebook. Нажми Сохранить ещё раз.', ti: 'ኣብዚ Chromebook ክዕቀብ ኣይከኣለን። እንደገና ዕቅብ ጠውቕ።', fa: 'روی این کروم‌بوک ذخیره نشد. دوباره ذخیره را بزن.', 'fa-AF': 'روی این کروم‌بوک ذخیره نشد. دوباره ذخیره را فشار بده.', ar: 'تعذّر الحفظ على هذا الـChromebook. اضغط حفظ مرة أخرى.', rw: 'Ntibyabitswe kuri iyi Chromebook. Ongera ukande Bika.' }),
  'toast.mansionReady': g('The Mansion is ready. Open the Dollhouse, then 3D.', { es: 'La Mansión está lista. Abre la Casa de muñecas y luego 3D.', cu: 'La Mansión está lista. Abre la Casa de muñecas y luego 3D.', uk: 'Особняк готовий. Відкрий Ляльковий будинок, потім 3D.', ru: 'Особняк готов. Открой Кукольный дом, потом 3D.', ti: 'እቲ ዓቢ ገዛ ድሉው እዩ። ገዛ ኣሻንጉሊት ክፈት፣ ድሕሪኡ 3D።', fa: 'عمارت آماده است. خانه عروسکی را باز کن، بعد سه‌بعدی.', 'fa-AF': 'قصر آماده است. خانه گُدی را باز کن، بعد سه‌بعدی.', ar: 'القصر جاهز. افتح بيت الدمى، ثم العرض الثلاثي.', rw: 'Inzu nini iriteguye. Fungura Inzu y\'ibikinisho, hanyuma 3D.' }),
  // 2.13.47: the last English-only Settings words and messages. ti, fa-AF and rw are UNCHECKED native copy.
  'news.settingsWords': g('Settings is fully in your language: layers, roof, wallpaper, the look themes, and the corner-clip and wallpaper messages.', {
    es: 'Ajustes está completo en tu idioma: capas, techo, papel tapiz, los temas de aspecto y los mensajes de cortar esquinas y papel tapiz.',
    cu: 'Ajustes está completo en tu idioma: capas, techo, papel tapiz, los temas de aspecto y los mensajes de cortar esquinas y papel tapiz.',
    uk: 'Налаштування повністю твоєю мовою: шари, дах, шпалери, теми вигляду та повідомлення про зрізання кутів і шпалери.',
    ru: 'Настройки полностью на твоём языке: слои, крыша, обои, темы оформления и сообщения о срезании углов и обоях.',
    ti: 'ቅጥዒታት ምሉእ ብቋንቋኻ እዩ፦ ደርብታት፣ ናሕሲ፣ ወረቐት መንደቕ፣ ቅርጽታት ትርኢትን መልእኽቲ ምቑራጽ ኩርናዕን ወረቐት መንደቕን።',
    fa: 'تنظیمات کامل به زبان توست: لایه‌ها، سقف، کاغذ دیواری، تم‌های ظاهر، و پیام‌های بریدن گوشه و کاغذ دیواری.',
    'fa-AF': 'تنظیمات کامل به زبان توست: لایه‌ها، بام، کاغذ دیواری، تم‌های ظاهر، و پیام‌های بریدن گوشه و کاغذ دیواری.',
    ar: 'الإعدادات كلها بلغتك: الطبقات والسقف وورق الجدران وأنماط المظهر ورسائل قص الزوايا وورق الجدران.',
    rw: "Igenamiterere ryose riri mu rurimi rwawe: ibice, igisenge, impapuro z'urukuta, isura, n'ubutumwa bwo gukata inguni n'impapuro z'urukuta.",
  }),
  'theme.stark': g('Default — white and black · periwinkle flash', { es: 'Predeterminado — blanco y negro · toque lavanda', cu: 'Predeterminado — blanco y negro · toque lavanda', uk: 'Звичайний — біле й чорне · бузковий акцент', ru: 'Обычный — белое и чёрное · сиреневый акцент', ti: 'መበገሲ — ጻዕዳን ጸሊምን · ሊላ ሕብሪ', fa: 'پیش‌فرض — سفید و سیاه · رنگ بنفش روشن', 'fa-AF': 'پیش‌فرض — سفید و سیاه · رنگ بنفش روشن', ar: 'الافتراضي — أبيض وأسود · لمسة بنفسجية', rw: 'Bisanzwe — umweru n\'umukara · ibara rya move' }),
  'theme.ink': g('Velvet dark · electric blue', { es: 'Oscuro aterciopelado · azul eléctrico', cu: 'Oscuro aterciopelado · azul eléctrico', uk: 'Оксамитово-темний · електрично-синій', ru: 'Бархатно-тёмный · электрический синий', ti: 'ጸልማት ልሙጥ · ብሩህ ሰማያዊ', fa: 'تیره مخملی · آبی برقی', 'fa-AF': 'تاریک مخملی · آبی برقی', ar: 'داكن مخملي · أزرق كهربائي', rw: 'Umwijima woroshye · ubururu bwaka' }),
  'theme.projector': g('Stage-bright · strong contrast', { es: 'Brillante como escenario · contraste fuerte', cu: 'Brillante como escenario · contraste fuerte', uk: 'Яскравий як сцена · сильний контраст', ru: 'Яркий как сцена · сильный контраст', ti: 'ብሩህ ከም መድረኽ · ብርቱዕ ፍልልይ', fa: 'روشن مثل صحنه · تضاد زیاد', 'fa-AF': 'روشن مثل ستیج · تضاد زیاد', ar: 'مشرق كالمسرح · تباين قوي', rw: 'Byaka nk\'urubyiniro · itandukaniro rikomeye' }),
  'theme.blocky': g('Chunky cubes · grass and dirt — Minecraft-inspired', { es: 'Cubos grandes · pasto y tierra — estilo Minecraft', cu: 'Cubos grandes · hierba y tierra — estilo Minecraft', uk: 'Великі кубики · трава й земля — як у Minecraft', ru: 'Крупные кубики · трава и земля — как в Minecraft', ti: 'ዓበይቲ ኩብታት · ሳዕርን ሓመድን — ከም Minecraft', fa: 'مکعب‌های درشت · چمن و خاک — شبیه Minecraft', 'fa-AF': 'مکعب‌های کلان · سبزه و خاک — شبیه Minecraft', ar: 'مكعبات كبيرة · عشب وتراب — مثل Minecraft', rw: 'Ibisanduku binini · ubwatsi n\'ubutaka — nka Minecraft' }),
  'set2.current': g('Now: {name}', { es: 'Ahora: {name}', cu: 'Ahora: {name}', uk: 'Зараз: {name}', ru: 'Сейчас: {name}', ti: 'ሕጂ፦ {name}', fa: 'اکنون: {name}', 'fa-AF': 'حالا: {name}', ar: 'الآن: {name}', rw: 'Ubu: {name}' }),
  'set2.feet': g('Feet', { es: 'Pies', cu: 'Pies', uk: 'Фути', ru: 'Футы', ti: 'ፊት', fa: 'فوت', 'fa-AF': 'فوت', ar: 'أقدام', rw: 'Ibirenge (ft)' }),
  'set2.meters': g('Meters', { es: 'Metros', cu: 'Metros', uk: 'Метри', ru: 'Метры', ti: 'ሜትሮ', fa: 'متر', 'fa-AF': 'متر', ar: 'أمتار', rw: 'Metero' }),
  'set2.layers': g('Layers', { es: 'Capas', cu: 'Capas', uk: 'Шари', ru: 'Слои', ti: 'ደርብታት', fa: 'لایه‌ها', 'fa-AF': 'لایه‌ها', ar: 'الطبقات', rw: 'Ibice' }),
  'set2.layersLead': g('Hide plan overlays while you draft.', { es: 'Oculta capas del plano mientras dibujas.', cu: 'Oculta capas del plano mientras dibujas.', uk: 'Ховай шари плану, поки креслиш.', ru: 'Скрывай слои плана, пока чертишь.', ti: 'ክትስእል ከለኻ ደርብታት ፕላን ሕባእ።', fa: 'هنگام کشیدن، لایه‌های نقشه را پنهان کن.', 'fa-AF': 'هنگام کشیدن، لایه‌های نقشه را پنهان کن.', ar: 'أخفِ طبقات المخطط أثناء الرسم.', rw: 'Hisha ibice by\'igishushanyo uko ushushanya.' }),
  'set2.layer.structure': g('Walls', { es: 'Paredes', cu: 'Paredes', uk: 'Стіни', ru: 'Стены', ti: 'መናድቕ', fa: 'دیوارها', 'fa-AF': 'دیوارها', ar: 'الجدران', rw: 'Inkuta' }),
  'set2.layer.openings': g('Doors & windows', { es: 'Puertas y ventanas', cu: 'Puertas y ventanas', uk: 'Двері й вікна', ru: 'Двери и окна', ti: 'ማዕጾታትን መሳኹትን', fa: 'درها و پنجره‌ها', 'fa-AF': 'دروازه‌ها و کلکین‌ها', ar: 'الأبواب والنوافذ', rw: 'Inzugi n\'amadirishya' }),
  'set2.layer.furniture': g('Furniture', { es: 'Muebles', cu: 'Muebles', uk: 'Меблі', ru: 'Мебель', ti: 'ኣቕሓ ገዛ', fa: 'مبلمان', 'fa-AF': 'فرنیچر', ar: 'الأثاث', rw: 'Ibikoresho' }),
  'set2.layer.rooms': g('Room names', { es: 'Nombres de cuartos', cu: 'Nombres de cuartos', uk: 'Назви кімнат', ru: 'Названия комнат', ti: 'ኣስማት ክፍልታት', fa: 'نام اتاق‌ها', 'fa-AF': 'نام اتاق‌ها', ar: 'أسماء الغرف', rw: 'Amazina y\'ibyumba' }),
  'set2.layer.dims': g('Size labels', { es: 'Medidas', cu: 'Medidas', uk: 'Розміри', ru: 'Размеры', ti: 'ዓቐናት', fa: 'اندازه‌ها', 'fa-AF': 'اندازه‌ها', ar: 'المقاسات', rw: 'Ingano' }),
  'set2.layer.landscape': g('Plants', { es: 'Plantas', cu: 'Plantas', uk: 'Рослини', ru: 'Растения', ti: 'ተኽልታት', fa: 'گیاهان', 'fa-AF': 'نباتات', ar: 'النباتات', rw: 'Ibimera' }),
  'set2.layer.sketch': g('Sketches', { es: 'Bocetos', cu: 'Bocetos', uk: 'Ескізи', ru: 'Наброски', ti: 'ንድፍታት', fa: 'طرح‌ها', 'fa-AF': 'طرح‌ها', ar: 'الرسومات', rw: 'Ibishushanyo' }),
  'set2.layer.roof': g('Roof lines', { es: 'Líneas del techo', cu: 'Líneas del techo', uk: 'Лінії даху', ru: 'Линии крыши', ti: 'መስመራት ናሕሲ', fa: 'خطوط سقف', 'fa-AF': 'خطوط بام', ar: 'خطوط السقف', rw: 'Imirongo y\'igisenge' }),
  'set2.roofStyle': g('Roof style (learn the names)', { es: 'Estilo de techo (aprende los nombres)', cu: 'Estilo de techo (aprende los nombres)', uk: 'Тип даху (вивчи назви)', ru: 'Тип крыши (выучи названия)', ti: 'ዓይነት ናሕሲ (ኣስማት ተማሃር)', fa: 'سبک سقف (نام‌ها را یاد بگیر)', 'fa-AF': 'نوع بام (نام‌ها را یاد بگیر)', ar: 'نوع السقف (تعلّم الأسماء)', rw: 'Ubwoko bw\'igisenge (iga amazina)' }),
  'set2.roofNone': g('None (no auto roof)', { es: 'Ninguno (sin techo automático)', cu: 'Ninguno (sin techo automático)', uk: 'Немає (без авто-даху)', ru: 'Нет (без авто-крыши)', ti: 'የለን (ናሕሲ ብባዕሉ የለን)', fa: 'هیچ (بدون سقف خودکار)', 'fa-AF': 'هیچ (بدون بام خودکار)', ar: 'لا شيء (بلا سقف تلقائي)', rw: 'Nta na kimwe (nta gisenge cyikora)' }),
  'set2.roofShow': g('Show roof lines on the plan', { es: 'Mostrar líneas del techo en el plano', cu: 'Mostrar líneas del techo en el plano', uk: 'Показувати лінії даху на плані', ru: 'Показывать линии крыши на плане', ti: 'መስመራት ናሕሲ ኣብ ፕላን ኣርኢ', fa: 'خطوط سقف را روی نقشه نشان بده', 'fa-AF': 'خطوط بام را روی نقشه نشان بده', ar: 'أظهر خطوط السقف على المخطط', rw: 'Erekana imirongo y\'igisenge ku gishushanyo' }),
  'set2.roofName': g('Roof name (your words)', { es: 'Nombre del techo (tus palabras)', cu: 'Nombre del techo (tus palabras)', uk: 'Назва даху (твоїми словами)', ru: 'Название крыши (твоими словами)', ti: 'ስም ናሕሲ (ብቃላትካ)', fa: 'نام سقف (با کلمه‌های خودت)', 'fa-AF': 'نام بام (با کلمه‌های خودت)', ar: 'اسم السقف (بكلماتك)', rw: 'Izina ry\'igisenge (mu magambo yawe)' }),
  'set2.roofNote': g('Changing the style redraws the roof lines and the 3D roof. Blank plans start with no roof until you pick one.', { es: 'Cambiar el estilo vuelve a dibujar las líneas y el techo 3D. Los planos en blanco empiezan sin techo hasta que elijas uno.', cu: 'Cambiar el estilo vuelve a dibujar las líneas y el techo 3D. Los planos en blanco empiezan sin techo hasta que escojas uno.', uk: 'Зміна типу перемальовує лінії даху і 3D-дах. Порожні плани починаються без даху, поки не вибереш.', ru: 'Смена типа перерисовывает линии крыши и 3D-крышу. Пустые планы начинаются без крыши, пока не выберешь.', ti: 'ዓይነት ምቕያር መስመራት ናሕስን 3D ናሕስን ዳግማይ ይስእል። ባዶ ፕላናት ክሳብ ትመርጽ ብዘይ ናሕሲ ይጅምሩ።', fa: 'تغییر سبک، خطوط سقف و سقف سه‌بعدی را دوباره می‌کشد. نقشه‌های خالی تا انتخاب نکنی بدون سقف شروع می‌شوند.', 'fa-AF': 'تغییر نوع، خطوط بام و بام سه‌بعدی را دوباره می‌کشد. نقشه‌های خالی تا انتخاب نکنی بدون بام شروع می‌شوند.', ar: 'تغيير النوع يعيد رسم خطوط السقف والسقف الثلاثي. المخططات الفارغة تبدأ بلا سقف حتى تختار واحداً.', rw: 'Guhindura ubwoko bishushanya bundi bushya imirongo n\'igisenge cya 3D. Ibishushanyo bishya bitangira nta gisenge kugeza uhisemo.' }),
  'set2.tinyTitle': g('Tiny Home · shell & parts', { es: 'Casa pequeña · tipo y partes', cu: 'Casa pequeña · tipo y partes', uk: 'Маленький дім · тип і частини', ru: 'Маленький дом · тип и части', ti: 'ንእሽቶ ገዛ · ዓይነትን ክፋላትን', fa: 'خانه کوچک · نوع و قطعه‌ها', 'fa-AF': 'خانه کوچک · نوع و پرزه‌ها', ar: 'بيت صغير · النوع والأجزاء', rw: 'Inzu nto · ubwoko n\'ibice' }),
  'set2.tinyLead': g('Pick a trailer or a shipping container. The contest is separate.', { es: 'Elige remolque o contenedor. El concurso es aparte.', cu: 'Escoge remolque o contenedor. El concurso es aparte.', uk: 'Вибери причіп або контейнер. Конкурс — окремо.', ru: 'Выбери прицеп или контейнер. Конкурс — отдельно.', ti: 'ተጎታቲ ወይ ኮንተይነር ምረጽ። ውድድር በይኑ እዩ።', fa: 'تریلی یا کانتینر را انتخاب کن. مسابقه جداست.', 'fa-AF': 'تریلر یا کانتینر را انتخاب کن. مسابقه جداست.', ar: 'اختر مقطورة أو حاوية. المسابقة منفصلة.', rw: 'Hitamo ikururwa cyangwa kontineri. Irushanwa ni ukwaryo.' }),
  'set2.trailer': g('Trailer', { es: 'Remolque', cu: 'Remolque', uk: 'Причіп', ru: 'Прицеп', ti: 'ተጎታቲ', fa: 'تریلی', 'fa-AF': 'تریلر', ar: 'مقطورة', rw: 'Ikururwa' }),
  'set2.container': g('Container', { es: 'Contenedor', cu: 'Contenedor', uk: 'Контейнер', ru: 'Контейнер', ti: 'ኮንተይነር', fa: 'کانتینر', 'fa-AF': 'کانتینر', ar: 'حاوية', rw: 'Kontineri' }),
  'set2.required': g('required', { es: 'obligatorio', cu: 'obligatorio', uk: 'обов’язково', ru: 'обязательно', ti: 'ግድን', fa: 'لازم', 'fa-AF': 'ضروری', ar: 'مطلوب', rw: 'birakenewe' }),
  'set2.missing': g('missing', { es: 'falta', cu: 'falta', uk: 'бракує', ru: 'не хватает', ti: 'ጎዲሉ', fa: 'کم است', 'fa-AF': 'کم است', ar: 'ناقص', rw: 'kirabura' }),
  'set2.optional': g('optional', { es: 'opcional', cu: 'opcional', uk: 'за бажанням', ru: 'по желанию', ti: 'ብድሌት', fa: 'اختیاری', 'fa-AF': 'اختیاری', ar: 'اختياري', rw: 'si ngombwa' }),
  'set2.materials': g('Materials · wallpaper', { es: 'Materiales · papel tapiz', cu: 'Materiales · papel tapiz', uk: 'Матеріали · шпалери', ru: 'Материалы · обои', ti: 'ኣቕሑ · ወረቐት መንደቕ', fa: 'مصالح · کاغذ دیواری', 'fa-AF': 'مواد · کاغذ دیواری', ar: 'المواد · ورق الجدران', rw: 'Ibikoresho · impapuro z\'urukuta' }),
  'set2.materialsLead': g('Fun patterns for plan walls. School-safe pictures only; imports stay on this device.', { es: 'Diseños divertidos para las paredes. Solo imágenes aptas para la escuela; las importadas quedan en este equipo.', cu: 'Diseños divertidos para las paredes. Solo imágenes aptas para la escuela; las importadas quedan en este equipo.', uk: 'Веселі візерунки для стін. Лише шкільні картинки; імпорт лишається на цьому пристрої.', ru: 'Весёлые узоры для стен. Только школьные картинки; импорт остаётся на этом устройстве.', ti: 'ሕጉስ ስእልታት ንመናድቕ። ንቤት ትምህርቲ ዝበቕዑ ስእልታት ጥራይ፤ ዝኣተዉ ኣብዚ መሳርሒ ይተርፉ።', fa: 'طرح‌های بامزه برای دیوارها. فقط عکس‌های مناسب مدرسه؛ واردشده‌ها روی همین دستگاه می‌مانند.', 'fa-AF': 'طرح‌های جالب برای دیوارها. فقط عکس‌های مناسب مکتب؛ واردشده‌ها روی همین دستگاه می‌مانند.', ar: 'أنماط مرحة لجدران المخطط. صور مناسبة للمدرسة فقط؛ المستورد يبقى على هذا الجهاز.', rw: 'Imitako ishimishije ku nkuta. Amafoto akwiye ishuri gusa; ayinjijwe aguma kuri iki gikoresho.' }),
  'set2.importImage': g('Import image…', { es: 'Importar imagen…', cu: 'Importar imagen…', uk: 'Імпортувати зображення…', ru: 'Импортировать изображение…', ti: 'ስእሊ ኣእቱ…', fa: 'وارد کردن تصویر…', 'fa-AF': 'وارد کردن تصویر…', ar: 'استيراد صورة…', rw: 'Injiza ifoto…' }),
  'set2.importing': g('Importing…', { es: 'Importando…', cu: 'Importando…', uk: 'Імпорт…', ru: 'Импорт…', ti: 'ይኣቱ ኣሎ…', fa: 'در حال وارد کردن…', 'fa-AF': 'در حال وارد کردن…', ar: 'جارٍ الاستيراد…', rw: 'Birinjizwa…' }),
  'set2.clearTex': g('Clear texture', { es: 'Quitar textura', cu: 'Quitar textura', uk: 'Прибрати текстуру', ru: 'Убрать текстуру', ti: 'ስእሊ ኣልግስ', fa: 'پاک کردن بافت', 'fa-AF': 'پاک کردن بافت', ar: 'إزالة النقش', rw: 'Kuraho umutako' }),
  'set2.clearTexTip': g('Back to plain paint in one tap', { es: 'Volver a pintura lisa con un toque', cu: 'Volver a pintura lisa con un toque', uk: 'Назад до звичайної фарби одним дотиком', ru: 'Назад к обычной краске одним касанием', ti: 'ብሓደ ጠውቕ ናብ ቀሊል ሕብሪ ተመለስ', fa: 'با یک ضربه برگرد به رنگ ساده', 'fa-AF': 'با یک ضربه برگرد به رنگ ساده', ar: 'عودة إلى الدهان العادي بلمسة', rw: 'Subira ku irangi risanzwe ukanze rimwe' }),
  'set2.accent': g('Accent color', { es: 'Color de acento', cu: 'Color de acento', uk: 'Колір акценту', ru: 'Цвет акцента', ti: 'ሕብሪ ምልክት', fa: 'رنگ تأکید', 'fa-AF': 'رنگ تأکید', ar: 'لون التمييز', rw: 'Ibara ry\'ingenzi' }),
  'set2.footer': g('Few settings on purpose. The grid stays visible, and snap is easy to turn off.', { es: 'Pocos ajustes a propósito. La cuadrícula queda visible y el ajuste se quita fácil.', cu: 'Pocos ajustes a propósito. La cuadrícula queda visible y el ajuste se quita fácil.', uk: 'Мало налаштувань навмисно. Сітка видна, а прилипання легко вимкнути.', ru: 'Мало настроек нарочно. Сетка видна, а привязку легко выключить.', ti: 'ብፍላጥ ውሑዳት ቅጥዒታት። መርበብ ይርአ፣ ምልጋብ ድማ ብቐሊሉ ይጥፋእ።', fa: 'تنظیمات کم، از روی قصد. شبکه دیده می‌شود و چسبیدن را راحت خاموش می‌کنی.', 'fa-AF': 'تنظیمات کم، از روی قصد. شبکه دیده می‌شود و چسپیدن را آسان خاموش می‌کنی.', ar: 'إعدادات قليلة عن قصد. الشبكة تبقى ظاهرة، والالتقاط سهل الإيقاف.', rw: 'Igenamiterere rike ku bushake. Urusobe ruraboneka, kandi gufatana biroroshye kuzimya.' }),
  'toast.clipTight': g('That corner is too tight to clip', { es: 'Esa esquina es muy cerrada para cortarla', cu: 'Esa esquina es muy cerrada para cortarla', uk: 'Цей кут занадто тісний, щоб зрізати', ru: 'Этот угол слишком тесный, чтобы срезать', ti: 'እቲ ኩርናዕ ንምቑራጽ ኣዝዩ ጸቢብ እዩ', fa: 'آن گوشه برای بریدن خیلی تنگ است', 'fa-AF': 'آن گوشه برای بریدن خیلی تنگ است', ar: 'تلك الزاوية ضيقة جداً للقص', rw: 'Iyo nguni ni nto cyane ngo ikatwe' }),
  'toast.clipped': g('Corner clipped — rooms follow the slant', { es: 'Esquina cortada — los cuartos siguen la diagonal', cu: 'Esquina cortada — los cuartos siguen la diagonal', uk: 'Кут зрізано — кімнати йдуть за скосом', ru: 'Угол срезан — комнаты следуют скосу', ti: 'ኩርናዕ ተቖሪጹ — ክፍልታት ነቲ ስንጭሮ ይስዕቡ', fa: 'گوشه بریده شد — اتاق‌ها شیب را دنبال می‌کنند', 'fa-AF': 'گوشه بریده شد — اتاق‌ها شیب را دنبال می‌کنند', ar: 'قُصّت الزاوية — الغرف تتبع الميل', rw: 'Inguni yakaswe — ibyumba bikurikira umuhanda uhengamye' }),
  'toast.wallpaperFail': g('Could not save the picture here — try again.', { es: 'No se pudo guardar la imagen aquí — inténtalo otra vez.', cu: 'No se pudo guardar la imagen aquí — inténtalo otra vez.', uk: 'Не вдалося зберегти зображення — спробуй ще раз.', ru: 'Не удалось сохранить изображение — попробуй ещё раз.', ti: 'እቲ ስእሊ ኣብዚ ክዕቀብ ኣይከኣለን — እንደገና ፈትን።', fa: 'تصویر اینجا ذخیره نشد — دوباره امتحان کن.', 'fa-AF': 'تصویر اینجا ذخیره نشد — دوباره کوشش کن.', ar: 'تعذّر حفظ الصورة هنا — حاول مجدداً.', rw: 'Ifoto ntiyabitswe hano — ongera ugerageze.' }),
  'toast.wallpaper': g('Wallpaper: {name}', { es: 'Papel tapiz: {name}', cu: 'Papel tapiz: {name}', uk: 'Шпалери: {name}', ru: 'Обои: {name}', ti: 'ወረቐት መንደቕ፦ {name}', fa: 'کاغذ دیواری: {name}', 'fa-AF': 'کاغذ دیواری: {name}', ar: 'ورق جدران: {name}', rw: 'Urupapuro rw\'urukuta: {name}' }),
  // 2.13.46: tool tips and room messages. ti, fa-AF and rw are UNCHECKED native copy.
  'news.oneRoom': g('One name per room: using the Room tool inside a named room changes its type, and tool tips are in your language.', {
    es: 'Un nombre por cuarto: usar Cuarto dentro de un cuarto con nombre cambia su tipo, y las ayudas de herramientas están en tu idioma.',
    cu: 'Un nombre por cuarto: usar Cuarto dentro de un cuarto con nombre cambia su tipo, y las ayudas de herramientas están en tu idioma.',
    uk: 'Одна назва на кімнату: інструмент «Кімната» всередині названої кімнати змінює її тип, а підказки інструментів — твоєю мовою.',
    ru: 'Одно название на комнату: инструмент «Комната» внутри названной комнаты меняет её тип, а подсказки инструментов — на твоём языке.',
    ti: 'ሓደ ስም ንሓደ ክፍሊ፦ ኣብ ውሽጢ ስም ዘለዎ ክፍሊ መሳርሒ ክፍሊ ምጥቃም ዓይነቱ ይቕይር፣ ምኽርታት መሳርሒ ድማ ብቋንቋኻ እዮም።',
    fa: 'یک نام برای هر اتاق: ابزار اتاق داخل اتاق نام‌دار نوعش را عوض می‌کند، و راهنمای ابزارها به زبان توست.',
    'fa-AF': 'یک نام برای هر اتاق: ابزار اتاق داخل اتاق نام‌دار نوعش را تبدیل می‌کند، و رهنمای ابزارها به زبان توست.',
    ar: 'اسم واحد لكل غرفة: أداة الغرفة داخل غرفة مسمّاة تغيّر نوعها، وتلميحات الأدوات بلغتك.',
    rw: "Izina rimwe kuri buri cyumba: gukoresha igikoresho cy'Icyumba mu cyumba gifite izina bihindura ubwoko bwacyo, kandi inama z'ibikoresho ziri mu rurimi rwawe.",
  }),
  'tooltip.select': g('Click something to move it (V)', { es: 'Haz clic en algo para moverlo (V)', cu: 'Toca algo para moverlo (V)', uk: 'Клікни щось, щоб перемістити (V)', ru: 'Кликни что-нибудь, чтобы передвинуть (V)', ti: 'ንምንቅስቓስ ገለ ነገር ጠውቕ (V)', fa: 'روی چیزی کلیک کن تا جابه‌جایش کنی (V)', 'fa-AF': 'روی چیزی کلیک کن تا جابه‌جایش کنی (V)', ar: 'انقر شيئاً لتحريكه (V)', rw: 'Kanda ku kintu ugiterure (V)' }),
  'tooltip.sketch': g('Drag like a pencil, then Trace into walls (S)', { es: 'Arrastra como un lápiz y luego convierte en paredes (S)', cu: 'Arrastra como un lápiz y luego conviértelo en paredes (S)', uk: 'Веди як олівцем, потім перетвори на стіни (S)', ru: 'Веди как карандашом, потом преврати в стены (S)', ti: 'ከም ርሳስ ስሓብ፣ ድሕሪኡ ናብ መናድቕ ቀይሮ (S)', fa: 'مثل مداد بکش، بعد به دیوار تبدیل کن (S)', 'fa-AF': 'مثل پنسل بکش، بعد به دیوار تبدیل کن (S)', ar: 'اسحب كقلم رصاص، ثم حوّله إلى جدران (S)', rw: 'Kurura nk\'ikaramu, hanyuma ubihindure inkuta (S)' }),
  'tooltip.wall': g('Click each corner; click the first corner to close the room (W)', { es: 'Haz clic en cada esquina; clic en la primera para cerrar el cuarto (W)', cu: 'Toca cada esquina; toca la primera para cerrar el cuarto (W)', uk: 'Клікай кожен кут; клікни перший, щоб замкнути кімнату (W)', ru: 'Кликай каждый угол; кликни первый, чтобы замкнуть комнату (W)', ti: 'ነፍሲ ወከፍ ኩርናዕ ጠውቕ፤ ክፍሊ ንምዕጻው ነቲ ቀዳማይ ጠውቕ (W)', fa: 'روی هر گوشه کلیک کن؛ برای بستن اتاق روی گوشه اول کلیک کن (W)', 'fa-AF': 'روی هر گوشه کلیک کن؛ برای بستن اتاق روی گوشه اول کلیک کن (W)', ar: 'انقر كل زاوية؛ انقر الزاوية الأولى لإغلاق الغرفة (W)', rw: 'Kanda buri nguni; kanda iya mbere ufunge icyumba (W)' }),
  'tooltip.box': g('Drag from one corner to the other (B)', { es: 'Arrastra de una esquina a la otra (B)', cu: 'Arrastra de una esquina a la otra (B)', uk: 'Тягни від одного кута до іншого (B)', ru: 'Тяни от одного угла к другому (B)', ti: 'ካብ ሓደ ኩርናዕ ናብ እቲ ካልእ ስሓብ (B)', fa: 'از یک گوشه تا گوشه دیگر بکش (B)', 'fa-AF': 'از یک گوشه تا گوشه دیگر بکش (B)', ar: 'اسحب من زاوية إلى الأخرى (B)', rw: 'Kurura uva ku nguni imwe ujya ku yindi (B)' }),
  'tooltip.door': g('Click on a wall (D)', { es: 'Haz clic en una pared (D)', cu: 'Toca una pared (D)', uk: 'Клікни на стіну (D)', ru: 'Кликни на стену (D)', ti: 'ኣብ መንደቕ ጠውቕ (D)', fa: 'روی یک دیوار کلیک کن (D)', 'fa-AF': 'روی یک دیوار کلیک کن (D)', ar: 'انقر على جدار (D)', rw: 'Kanda ku rukuta (D)' }),
  'tooltip.window': g('Click on a wall (N)', { es: 'Haz clic en una pared (N)', cu: 'Toca una pared (N)', uk: 'Клікни на стіну (N)', ru: 'Кликни на стену (N)', ti: 'ኣብ መንደቕ ጠውቕ (N)', fa: 'روی یک دیوار کلیک کن (N)', 'fa-AF': 'روی یک دیوار کلیک کن (N)', ar: 'انقر على جدار (N)', rw: 'Kanda ku rukuta (N)' }),
  'tooltip.furniture': g('Pick an item, then click the plan (F)', { es: 'Elige un mueble y haz clic en el plano (F)', cu: 'Elige un mueble y toca el plano (F)', uk: 'Вибери предмет, потім клікни на план (F)', ru: 'Выбери предмет, потом кликни на план (F)', ti: 'ኣቕሓ ምረጽ፣ ድሕሪኡ ኣብ ፕላን ጠውቕ (F)', fa: 'یک وسیله انتخاب کن، بعد روی نقشه کلیک کن (F)', 'fa-AF': 'یک وسیله انتخاب کن، بعد روی نقشه کلیک کن (F)', ar: 'اختر قطعة، ثم انقر على المخطط (F)', rw: 'Hitamo ikintu, hanyuma ukande ku gishushanyo (F)' }),
  'tooltip.room': g('Pick a type, then click inside closed walls (R)', { es: 'Elige un tipo y haz clic dentro de paredes cerradas (R)', cu: 'Elige un tipo y toca dentro de paredes cerradas (R)', uk: 'Вибери тип, потім клікни всередині замкнених стін (R)', ru: 'Выбери тип, потом кликни внутри замкнутых стен (R)', ti: 'ዓይነት ምረጽ፣ ድሕሪኡ ኣብ ውሽጢ ዝተዓጽወ መናድቕ ጠውቕ (R)', fa: 'یک نوع انتخاب کن، بعد داخل دیوارهای بسته کلیک کن (R)', 'fa-AF': 'یک نوع انتخاب کن، بعد داخل دیوارهای بسته کلیک کن (R)', ar: 'اختر نوعاً، ثم انقر داخل جدران مغلقة (R)', rw: 'Hitamo ubwoko, hanyuma ukande imbere y\'inkuta zifunze (R)' }),
  'tooltip.dim': g('Click two points for a size label (M)', { es: 'Haz clic en dos puntos para una medida (M)', cu: 'Toca dos puntos para una medida (M)', uk: 'Клікни дві точки, щоб показати розмір (M)', ru: 'Кликни две точки, чтобы показать размер (M)', ti: 'ንዓቐን ክልተ ነጥብታት ጠውቕ (M)', fa: 'روی دو نقطه کلیک کن تا اندازه را نشان دهد (M)', 'fa-AF': 'روی دو نقطه کلیک کن تا اندازه را نشان دهد (M)', ar: 'انقر نقطتين لعلامة مقاس (M)', rw: 'Kanda ku ngingo ebyiri ubone ingano (M)' }),
  'tooltip.note': g('Click the plan, then type (T)', { es: 'Haz clic en el plano y escribe (T)', cu: 'Toca el plano y escribe (T)', uk: 'Клікни на план, потім пиши (T)', ru: 'Кликни на план, потом пиши (T)', ti: 'ኣብ ፕላን ጠውቕ፣ ድሕሪኡ ጽሓፍ (T)', fa: 'روی نقشه کلیک کن، بعد بنویس (T)', 'fa-AF': 'روی نقشه کلیک کن، بعد بنویس (T)', ar: 'انقر على المخطط، ثم اكتب (T)', rw: 'Kanda ku gishushanyo, hanyuma wandike (T)' }),
  'tooltip.plant': g('Tree, bed, or path (L)', { es: 'Árbol, cantero o camino (L)', cu: 'Árbol, cantero o camino (L)', uk: 'Дерево, клумба чи доріжка (L)', ru: 'Дерево, клумба или дорожка (L)', ti: 'ኦም፣ መትከሊ ወይ መገዲ (L)', fa: 'درخت، باغچه یا راه (L)', 'fa-AF': 'درخت، باغچه یا راه (L)', ar: 'شجرة أو حوض زهور أو ممر (L)', rw: 'Igiti, indabo cyangwa inzira (L)' }),
  'tooltip.pan': g('Drag to move the view (H)', { es: 'Arrastra para mover la vista (H)', cu: 'Arrastra para mover la vista (H)', uk: 'Тягни, щоб зсунути вигляд (H)', ru: 'Тяни, чтобы сдвинуть вид (H)', ti: 'ትርኢት ንምንቅስቓስ ስሓብ (H)', fa: 'بکش تا نما جابه‌جا شود (H)', 'fa-AF': 'بکش تا نما جابه‌جا شود (H)', ar: 'اسحب لتحريك العرض (H)', rw: 'Kurura wimure ibyo ureba (H)' }),
  'toast.roomOutside': g('Click inside a closed room. Walls have to meet first.', { es: 'Haz clic dentro de un cuarto cerrado. Primero las paredes deben unirse.', cu: 'Toca dentro de un cuarto cerrado. Primero las paredes deben unirse.', uk: 'Клікни всередині замкненої кімнати. Спершу стіни мають зійтися.', ru: 'Кликни внутри замкнутой комнаты. Сначала стены должны сойтись.', ti: 'ኣብ ውሽጢ ዝተዓጽወ ክፍሊ ጠውቕ። ቅድም መናድቕ ክራኸቡ ኣለዎም።', fa: 'داخل یک اتاق بسته کلیک کن. اول دیوارها باید به هم برسند.', 'fa-AF': 'داخل یک اتاق بسته کلیک کن. اول دیوارها باید به هم برسند.', ar: 'انقر داخل غرفة مغلقة. يجب أن تلتقي الجدران أولاً.', rw: 'Kanda imbere y\'icyumba gifunze. Inkuta zigomba kubanza guhura.' }),
  'toast.roomSame': g('This is already a {room}', { es: 'Esto ya es: {room}', cu: 'Esto ya es: {room}', uk: 'Це вже: {room}', ru: 'Это уже: {room}', ti: 'እዚ ድሮ {room} እዩ', fa: 'این از قبل {room} است', 'fa-AF': 'این از قبل {room} است', ar: 'هذه بالفعل: {room}', rw: 'Iki gisanzwe ari {room}' }),
  'toast.roomNamed': g('{room} · {area}', { es: '{room} · {area}', cu: '{room} · {area}', uk: '{room} · {area}', ru: '{room} · {area}', ti: '{room} · {area}', fa: '{room} · {area}', 'fa-AF': '{room} · {area}', ar: '{room} · {area}', rw: '{room} · {area}' }),
  // 2.13.45: New plan card text. ti, fa-AF and rw are UNCHECKED native copy.
  'news.newPlan': g('On phones the New plan screen shows the houses first, house descriptions are in your language, and Settings has bigger tick boxes.', {
    es: 'En el teléfono, la pantalla Plano nuevo muestra primero las casas, las descripciones están en tu idioma y Ajustes tiene casillas más grandes.',
    cu: 'En el teléfono, la pantalla Plano nuevo muestra primero las casas, las descripciones están en tu idioma y Ajustes tiene casillas más grandes.',
    uk: 'На телефоні екран «Новий план» спершу показує будинки, описи будинків твоєю мовою, а в Налаштуваннях більші прапорці.',
    ru: 'На телефоне экран «Новый план» сначала показывает дома, описания домов на твоём языке, а в Настройках флажки крупнее.',
    ti: 'ብተሌፎን መስኮት ሓድሽ ፕላን ቅድም ኣባይቲ የርኢ፣ መግለጺታት ኣባይቲ ብቋንቋኻ እዮም፣ ኣብ ቅጥዒታት ድማ ዝዓበዩ ሳጹናት ምልክት ኣለዉ።',
    fa: 'در گوشی، صفحه نقشه جدید اول خانه‌ها را نشان می‌دهد، توضیح خانه‌ها به زبان توست، و تنظیمات جعبه‌های تیک بزرگ‌تری دارد.',
    'fa-AF': 'در موبایل، صفحه نقشه جدید اول خانه‌ها را نشان می‌دهد، توضیح خانه‌ها به زبان توست، و تنظیمات خانه‌های تیک کلان‌تر دارد.',
    ar: 'على الهاتف تُظهر شاشة المخطط الجديد البيوت أولاً، ووصف البيوت بلغتك، ومربعات الاختيار في الإعدادات أكبر.',
    rw: "Kuri telefoni, ecran y'igishushanyo gishya yerekana inzu mbere, ibisobanuro by'inzu biri mu rurimi rwawe, kandi Igenamiterere rifite udusanduku tunini.",
  }),
  'tpl.blank': g('Start empty · draw your own walls.', { es: 'Empieza vacío · dibuja tus propias paredes.', cu: 'Empieza vacío · dibuja tus propias paredes.', uk: 'Почни з нуля · намалюй свої стіни.', ru: 'Начни с нуля · нарисуй свои стены.', ti: 'ባዶ ጀምር · ናትካ መናድቕ ስኣል።', fa: 'خالی شروع کن · دیوارهای خودت را بکش.', 'fa-AF': 'خالی شروع کن · دیوارهای خودت را بکش.', ar: 'ابدأ فارغاً · ارسم جدرانك بنفسك.', rw: 'Tangira ubusa · shushanya inkuta zawe.' }),
  'tpl.colonial': g('Balanced house · doors in the middle · rooms left and right.', { es: 'Casa equilibrada · puertas en el medio · cuartos a izquierda y derecha.', cu: 'Casa equilibrada · puertas en el medio · cuartos a izquierda y derecha.', uk: 'Врівноважений будинок · двері посередині · кімнати ліворуч і праворуч.', ru: 'Сбалансированный дом · двери посередине · комнаты слева и справа.', ti: 'ሚዛናዊ ገዛ · ማዕጾታት ኣብ ማእከል · ክፍልታት ጸጋምን የማንን።', fa: 'خانه متوازن · درها در وسط · اتاق‌ها چپ و راست.', 'fa-AF': 'خانه متوازن · دروازه‌ها در وسط · اتاق‌ها چپ و راست.', ar: 'بيت متوازن · الأبواب في الوسط · الغرف يميناً ويساراً.', rw: 'Inzu iringaniye · inzugi hagati · ibyumba ibumoso n\'iburyo.' }),
  'tpl.arts-crafts': g('Cozy porch house · rooms inside · a walk and trees outside.', { es: 'Casa acogedora con porche · cuartos dentro · camino y árboles fuera.', cu: 'Casa acogedora con portal · cuartos dentro · camino y árboles fuera.', uk: 'Затишний будинок з ґанком · кімнати всередині · доріжка й дерева надворі.', ru: 'Уютный дом с крыльцом · комнаты внутри · дорожка и деревья снаружи.', ti: 'ምቹእ ገዛ ምስ በረንዳ · ክፍልታት ኣብ ውሽጢ · ኣብ ደገ መገድን ኦምን።', fa: 'خانه دنج با ایوان · اتاق‌ها داخل · راه و درخت بیرون.', 'fa-AF': 'خانه دنج با برنده · اتاق‌ها داخل · راه و درخت بیرون.', ar: 'بيت دافئ بشرفة · غرف في الداخل · ممر وأشجار في الخارج.', rw: 'Inzu nziza ifite urubaraza · ibyumba imbere · inzira n\'ibiti hanze.' }),
  'tpl.greek-revival': g('Fancy front · tall entry · balanced sides.', { es: 'Fachada elegante · entrada alta · lados equilibrados.', cu: 'Fachada elegante · entrada alta · lados equilibrados.', uk: 'Пишний фасад · високий вхід · рівні боки.', ru: 'Нарядный фасад · высокий вход · ровные стороны.', ti: 'ጽቡቕ ቅድሚት · ነዊሕ መእተዊ · ሚዛናዊ ጎንታት።', fa: 'نمای شیک · ورودی بلند · دو طرف متوازن.', 'fa-AF': 'نمای شیک · دروازه بلند · دو طرف متوازن.', ar: 'واجهة أنيقة · مدخل عالٍ · جانبان متوازنان.', rw: 'Imbere heza · umuryango muremure · impande ziringaniye.' }),
  'tpl.hobbit': g('Storybook cottage · round door · green living roof.', { es: 'Casita de cuento · puerta redonda · techo verde vivo.', cu: 'Casita de cuento · puerta redonda · techo verde vivo.', uk: 'Казкова хатинка · кругла двері · зелений живий дах.', ru: 'Сказочный домик · круглая дверь · зелёная живая крыша.', ti: 'ናይ ዛንታ ንእሽቶ ገዛ · ክቢ ማዕጾ · ቀጠልያ ናሕሲ።', fa: 'کلبه قصه‌ای · در گرد · سقف سبز زنده.', 'fa-AF': 'کلبه قصه‌ای · دروازه گرد · بام سبز زنده.', ar: 'كوخ من القصص · باب دائري · سقف أخضر حي.', rw: 'Akazu k\'umugani · urugi ruzengurutse · igisenge kibisi.' }),
  'tpl.ranch': g('Long one-story · rooms in a line · yard all around.', { es: 'Larga de un piso · cuartos en fila · patio alrededor.', cu: 'Larga de un piso · cuartos en fila · patio alrededor.', uk: 'Довгий одноповерховий · кімнати в ряд · подвір’я довкола.', ru: 'Длинный одноэтажный · комнаты в ряд · двор вокруг.', ti: 'ነዊሕ ሓደ ደርቢ · ክፍልታት ብመስመር · ዙርያ ቀጽሪ።', fa: 'یک طبقه و دراز · اتاق‌ها در یک ردیف · حیاط دورتادور.', 'fa-AF': 'یک منزله و دراز · اتاق‌ها در یک قطار · حویلی دورادور.', ar: 'طابق واحد طويل · غرف في صف · فناء حوله.', rw: 'Igorofa imwe ndende · ibyumba ku murongo · urugo impande zose.' }),
  'tpl.victorian': g('Tall fancy house · steep fancy roof (mansard).', { es: 'Casa alta y elegante · techo empinado (mansarda).', cu: 'Casa alta y elegante · techo empinado (mansarda).', uk: 'Висока пишна хата · крутий дах (мансарда).', ru: 'Высокий нарядный дом · крутая крыша (мансарда).', ti: 'ነዊሕ ጽቡቕ ገዛ · ዝቖመ ናሕሲ (mansard)።', fa: 'خانه بلند و شیک · سقف شیب‌دار (مانسارد).', 'fa-AF': 'خانه بلند و شیک · بام شیب‌دار (مانسارد).', ar: 'بيت عالٍ أنيق · سقف شديد الانحدار (منسارد).', rw: 'Inzu ndende nziza · igisenge gihanamye (mansard).' }),
  'tpl.mansion': g('Victorian mansion · brick, bay window, columns, and grounds.', { es: 'Mansión victoriana · ladrillo, ventanal, columnas y jardines.', cu: 'Mansión victoriana · ladrillo, ventanal, columnas y jardines.', uk: 'Вікторіанський особняк · цегла, еркер, колони й сад.', ru: 'Викторианский особняк · кирпич, эркер, колонны и сад.', ti: 'ቪክቶርያዊ ዓቢ ገዛ · ጡብ፣ ወጻኢ መስኮት፣ ኣዕኑድን ግራትን።', fa: 'عمارت ویکتوریایی · آجر، پنجره بیرون‌زده، ستون‌ها و باغ.', 'fa-AF': 'قصر ویکتوریایی · خشت پخته، کلکین بیرون‌زده، ستون‌ها و باغ.', ar: 'قصر فيكتوري · طوب ونافذة بارزة وأعمدة وحديقة.', rw: 'Inzu nini ya Victoria · amatafari, idirishya risohoka, inkingi n\'ubusitani.' }),
  'tpl.cape-cod': g('Compact rectangle — steep gable feel, simple rooms.', { es: 'Rectángulo compacto — techo a dos aguas empinado, cuartos sencillos.', cu: 'Rectángulo compacto — techo a dos aguas empinado, cuartos sencillos.', uk: 'Компактний прямокутник — крутий двосхилий дах, прості кімнати.', ru: 'Компактный прямоугольник — крутая двускатная крыша, простые комнаты.', ti: 'ንእሽቶ ርብዒ ኩርናዕ — ዝቖመ ናሕሲ፣ ቀለልቲ ክፍልታት።', fa: 'مستطیل جمع‌وجور — سقف شیروانی تند، اتاق‌های ساده.', 'fa-AF': 'مستطیل کوچک — بام شیب‌دار، اتاق‌های ساده.', ar: 'مستطيل صغير — سقف جملوني حاد، غرف بسيطة.', rw: 'Urukiramende ruto — igisenge gihanamye, ibyumba byoroshye.' }),
  'tpl.modern': g('Clean rectangle — open plan, flat roof default.', { es: 'Rectángulo limpio — planta abierta, techo plano.', cu: 'Rectángulo limpio — planta abierta, techo plano.', uk: 'Чистий прямокутник — відкрите планування, плаский дах.', ru: 'Чистый прямоугольник — открытая планировка, плоская крыша.', ti: 'ጽሩይ ርብዒ ኩርናዕ — ክፉት ፕላን፣ ጸፍጣፍ ናሕሲ።', fa: 'مستطیل ساده — پلان باز، سقف صاف.', 'fa-AF': 'مستطیل ساده — نقشه باز، بام هموار.', ar: 'مستطيل نظيف — مخطط مفتوح، سقف مسطح.', rw: 'Urukiramende rworoshye — imbere hafunguye, igisenge kiringaniye.' }),
  'tpl.tudor': g('Compact L-ish starter — steep gable vocabulary.', { es: 'Inicio compacto en L — techos a dos aguas empinados.', cu: 'Inicio compacto en L — techos a dos aguas empinados.', uk: 'Компактний будинок-літера L — круті двосхилі дахи.', ru: 'Компактный дом буквой L — крутые двускатные крыши.', ti: 'ንእሽቶ ቅርጺ L — ዝቖሙ ናሕስታት።', fa: 'شروع جمع‌وجور L شکل — سقف‌های شیروانی تند.', 'fa-AF': 'شروع کوچک L شکل — بام‌های شیب‌دار.', ar: 'بداية صغيرة على شكل L — أسقف جملونية حادة.', rw: 'Inzu nto imeze nka L — ibisenge bihanamye.' }),
  'tpl.yurt': g('Round tent-house · cone roof · open middle.', { es: 'Casa-tienda redonda · techo de cono · centro abierto.', cu: 'Casa-tienda redonda · techo de cono · centro abierto.', uk: 'Кругла юрта · конусний дах · відкрита середина.', ru: 'Круглая юрта · конусная крыша · открытая середина.', ti: 'ክቢ ገዛ-ድንኳን · ናሕሲ ከም ኮን · ክፉት ማእከል።', fa: 'خانه چادری گرد · سقف مخروطی · وسط باز.', 'fa-AF': 'خانه خیمه‌ای گرد · بام مخروطی · وسط باز.', ar: 'بيت خيمة دائري · سقف مخروطي · وسط مفتوح.', rw: 'Inzu y\'ihema izengurutse · igisenge gisongoye · hagati hafunguye.' }),
  'tpl.tiny-home': g('Small contest house · trailer or container type · checklist of parts.', { es: 'Casa pequeña de concurso · tipo remolque o contenedor · lista de partes.', cu: 'Casa pequeña de concurso · tipo remolque o contenedor · lista de partes.', uk: 'Маленький конкурсний будинок · на причепі чи в контейнері · список частин.', ru: 'Маленький конкурсный дом · на прицепе или в контейнере · список частей.', ti: 'ንእሽቶ ናይ ውድድር ገዛ · ተጎታቲ ወይ ኮንተይነር · ዝርዝር ክፋላት።', fa: 'خانه کوچک مسابقه · نوع تریلی یا کانتینر · فهرست قطعه‌ها.', 'fa-AF': 'خانه کوچک مسابقه · نوع تریلر یا کانتینر · فهرست پرزه‌ها.', ar: 'بيت صغير للمسابقة · مقطورة أو حاوية · قائمة بالأجزاء.', rw: 'Inzu nto y\'irushanwa · ikururwa cyangwa kontineri · urutonde rw\'ibice.' }),
  'tpl.dog-house': g('Baboo’s contest · a snug outdoor den · she judges from the book.', { es: 'El concurso de Baboo · una casita afuera · ella juzga con el libro.', cu: 'El concurso de Baboo · una casita afuera · ella juzga con el libro.', uk: 'Конкурс Baboo · затишна будка надворі · вона судить за книжкою.', ru: 'Конкурс Baboo · уютная будка снаружи · она судит по книжке.', ti: 'ውድድር Baboo · ምቹእ ናይ ደገ ቤት · ብመጽሓፍ ትፈርድ።', fa: 'مسابقه Baboo · لانه‌ای دنج در بیرون · او از روی کتاب داوری می‌کند.', 'fa-AF': 'مسابقه Baboo · لانه گرم در بیرون · او از روی کتاب داوری می‌کند.', ar: 'مسابقة Baboo · بيت صغير دافئ في الخارج · هي تحكم من الكتاب.', rw: 'Irushanwa rya Baboo · akazu keza hanze · arasuzuma akoresheje igitabo.' }),
  // 2.13.44: ti, fa-AF and rw are UNCHECKED native copy.
  'news.chain': g('Walls join up as you draw: keep clicking corners and the room closes when you click the first corner again.', {
    es: 'Las paredes se unen mientras dibujas: sigue haciendo clic en las esquinas y el cuarto se cierra al volver a la primera.',
    cu: 'Las paredes se unen mientras dibujas: sigue tocando las esquinas y el cuarto se cierra al volver a la primera.',
    uk: 'Стіни з’єднуються, поки малюєш: клікай кути далі, і кімната замкнеться, коли клікнеш перший кут.',
    ru: 'Стены соединяются, пока рисуешь: кликай углы дальше, и комната замкнётся, когда кликнешь первый угол.',
    ti: 'ክትስእል ከለኻ መናድቕ ይራኸቡ፦ ኣብ ኩርናዓት ምጥዋቕ ቀጽል፣ ነቲ ቀዳማይ ኩርናዕ ክትጠውቕ ከለኻ ክፍሊ ይዕጾ።',
    fa: 'دیوارها هنگام کشیدن به هم وصل می‌شوند: روی گوشه‌ها کلیک کن و با کلیک دوباره روی گوشه اول، اتاق بسته می‌شود.',
    'fa-AF': 'دیوارها هنگام کشیدن به هم وصل می‌شوند: روی گوشه‌ها کلیک کن و با کلیک دوباره روی گوشه اول، اتاق بسته می‌شود.',
    ar: 'الجدران تتصل وأنت ترسم: تابع النقر على الزوايا وستُغلق الغرفة عندما تنقر الزاوية الأولى مجدداً.',
    rw: "Inkuta zihuzwa uko ushushanya: komeza ukande ku nguni, icyumba gifunge iyo wongeye gukanda ku nguni ya mbere.",
  }),
  'hint.wall.next': g('Keep clicking corners. Click the first corner to close the room, or press Esc to stop.', { es: 'Sigue haciendo clic en las esquinas. Haz clic en la primera para cerrar el cuarto, o pulsa Esc para parar.', cu: 'Sigue tocando las esquinas. Toca la primera para cerrar el cuarto, o pulsa Esc para parar.', uk: 'Клікай далі по кутах. Клікни перший кут, щоб замкнути кімнату, або натисни Esc, щоб зупинитись.', ru: 'Кликай дальше по углам. Кликни первый угол, чтобы замкнуть комнату, или нажми Esc, чтобы остановиться.', ti: 'ኣብ ኩርናዓት ምጥዋቕ ቀጽል። ክፍሊ ንምዕጻው ነቲ ቀዳማይ ኩርናዕ ጠውቕ፣ ንምቁራጽ ድማ Esc ጠውቕ።', fa: 'روی گوشه‌ها کلیک کن. برای بستن اتاق روی گوشه اول کلیک کن، یا برای توقف Esc را بزن.', 'fa-AF': 'روی گوشه‌ها کلیک کن. برای بستن اتاق روی گوشه اول کلیک کن، یا برای توقف Esc را فشار بده.', ar: 'تابع النقر على الزوايا. انقر الزاوية الأولى لإغلاق الغرفة، أو اضغط Esc للتوقف.', rw: 'Komeza ukande ku nguni. Kanda ku nguni ya mbere ufunge icyumba, cyangwa ukande Esc uhagarike.' }),
  // 2.13.43: ti, fa-AF and rw are UNCHECKED native copy.
  'news.rooms2': g('Arts & Crafts, Victorian and Tudor now have real rooms too: bedrooms, kitchens, a parlor with a fireplace, and windows on every side.', {
    es: 'Arts & Crafts, Victorian y Tudor también tienen cuartos de verdad: dormitorios, cocinas, una sala con chimenea y ventanas por todos lados.',
    cu: 'Arts & Crafts, Victorian y Tudor también tienen cuartos de verdad: cuartos de dormir, cocinas, una sala con chimenea y ventanas por todos lados.',
    uk: 'Arts & Crafts, Victorian і Tudor тепер теж мають справжні кімнати: спальні, кухні, вітальню з каміном і вікна з усіх боків.',
    ru: 'У Arts & Crafts, Victorian и Tudor теперь тоже настоящие комнаты: спальни, кухни, гостиная с камином и окна со всех сторон.',
    ti: 'Arts & Crafts፣ Victorian ከምኡ’ውን Tudor ሕጂ ሓቀኛ ክፍልታት ኣለዎም፦ መደቀሲ፣ ክሽነ፣ ምስ መንደድ ዘለዎ ክፍሊ ኣጋይሽን ኣብ ኩሉ ወገን መሳኹትን።',
    fa: 'Arts & Crafts، Victorian و Tudor هم حالا اتاق‌های واقعی دارند: اتاق خواب، آشپزخانه، پذیرایی با شومینه، و پنجره در هر طرف.',
    'fa-AF': 'Arts & Crafts، Victorian و Tudor هم حالا اتاق‌های واقعی دارند: اتاق خواب، آشپزخانه، مهمان‌خانه با بخاری، و کلکین در هر طرف.',
    ar: 'Arts & Crafts وVictorian وTudor صار فيها غرف حقيقية أيضاً: غرف نوم ومطابخ وغرفة جلوس بمدفأة ونوافذ من كل جهة.',
    rw: "Arts & Crafts, Victorian na Tudor nazo ubu zifite ibyumba nyabyo: ibyumba byo kuraramo, ibikoni, uruganiriro rufite iziko, n'amadirishya impande zose.",
  }),
  // 2.13.42: ti, fa-AF and rw are UNCHECKED native copy.
  'news.rooms': g('Starter houses have real rooms: the Ranch gets a kitchen, bath and bedroom, every room shows its own size, and more windows.', {
    es: 'Las casas iniciales tienen cuartos de verdad: el Ranch tiene cocina, baño y dormitorio, cada cuarto muestra su tamaño, y hay más ventanas.',
    cu: 'Las casas iniciales tienen cuartos de verdad: el Ranch tiene cocina, baño y cuarto, cada cuarto muestra su tamaño, y hay más ventanas.',
    uk: 'Будинки-заготовки мають справжні кімнати: у Ranch є кухня, ванна й спальня, кожна кімната показує свій розмір, і вікон більше.',
    ru: 'У стартовых домов настоящие комнаты: в Ranch есть кухня, ванная и спальня, каждая комната показывает свой размер, и окон больше.',
    ti: 'መጀመሪ ኣባይቲ ሓቀኛ ክፍልታት ኣለዎም፦ Ranch ክሽነ፣ መሕጸብን መደቀስን ረኺቡ፣ ነፍሲ ወከፍ ክፍሊ ዓቐኑ የርኢ፣ ተወሳኺ መሳኹቲ ድማ ኣሎ።',
    fa: 'خانه‌های آماده اتاق‌های واقعی دارند: Ranch آشپزخانه، حمام و اتاق خواب دارد، هر اتاق اندازه خودش را نشان می‌دهد، و پنجره‌ها بیشترند.',
    'fa-AF': 'خانه‌های آماده اتاق‌های واقعی دارند: Ranch آشپزخانه، تشناب و اتاق خواب دارد، هر اتاق اندازه خودش را نشان می‌دهد، و کلکین‌ها بیشترند.',
    ar: 'البيوت الجاهزة فيها غرف حقيقية: Ranch فيه مطبخ وحمام وغرفة نوم، وكل غرفة تُظهر مساحتها، ونوافذ أكثر.',
    rw: "Inzu zitangira zifite ibyumba nyabyo: Ranch ifite igikoni, ubwogero n'icyumba cyo kuraramo, buri cyumba cyerekana ingano yacyo, n'amadirishya menshi.",
  }),
  // 2.13.41: ti, fa-AF and rw are UNCHECKED native copy.
  'news.styles': g('Every starter house has its own outside: brick Colonial, sage Arts & Crafts, white Greek Revival, stone Hobbit, and more.', {
    es: 'Cada casa inicial tiene su propio exterior: Colonial de ladrillo, Arts & Crafts verde salvia, Greek Revival blanca, Hobbit de piedra y más.',
    cu: 'Cada casa inicial tiene su propio exterior: Colonial de ladrillo, Arts & Crafts verde salvia, Greek Revival blanca, Hobbit de piedra y más.',
    uk: 'Кожен будинок-заготовка має свій вигляд ззовні: цегляний Colonial, шавлієвий Arts & Crafts, білий Greek Revival, кам’яний Hobbit та інші.',
    ru: 'У каждого стартового дома свой вид снаружи: кирпичный Colonial, шалфейный Arts & Crafts, белый Greek Revival, каменный Hobbit и другие.',
    ti: 'ነፍሲ ወከፍ መጀመሪ ገዛ ናቱ ደገ ኣለዎ፦ ብጡብ Colonial፣ ቀጠልያ Arts & Crafts፣ ጻዕዳ Greek Revival፣ ብእምኒ Hobbit፣ ካልኦትን።',
    fa: 'هر خانهٔ آماده ظاهر بیرونی خودش را دارد: Colonial آجری، Arts & Crafts سبز مریمی، Greek Revival سفید، Hobbit سنگی و بیشتر.',
    'fa-AF': 'هر خانهٔ آماده ظاهر بیرونی خودش را دارد: Colonial خشتی، Arts & Crafts سبز، Greek Revival سفید، Hobbit سنگی و دیگر.',
    ar: 'لكل بيت جاهز مظهر خارجي خاص: Colonial من الطوب، Arts & Crafts بلون المريمية، Greek Revival أبيض، Hobbit من الحجر، وغيرها.',
    rw: "Buri nzu itangira ifite inyuma yayo: Colonial y'amatafari, Arts & Crafts y'icyatsi, Greek Revival y'umweru, Hobbit y'amabuye, n'izindi.",
  }),
  // 2.13.40: ti, fa-AF and rw are UNCHECKED native copy.
  'news.a11y': g('Screen readers can hear the plan: each room and its size, plus how many walls, doors and windows there are.', {
    es: 'Los lectores de pantalla pueden oír el plano: cada cuarto y su tamaño, y cuántas paredes, puertas y ventanas hay.',
    cu: 'Los lectores de pantalla pueden oír el plano: cada cuarto y su tamaño, y cuántas paredes, puertas y ventanas hay.',
    uk: 'Програми читання з екрана озвучують план: кожну кімнату та її розмір, а також скільки стін, дверей і вікон.',
    ru: 'Программы чтения с экрана озвучивают план: каждую комнату и её размер, а также сколько стен, дверей и окон.',
    ti: 'ኣንበብቲ ስክሪን ነቲ ፕላን ክሰምዕዎ ይኽእሉ፦ ነፍሲ ወከፍ ክፍልን ዓቐኑን፣ ክንደይ መናድቕ፣ ማዕጾታትን መሳኹትን ከም ዘለዉ።',
    fa: 'صفحه‌خوان‌ها نقشه را می‌خوانند: هر اتاق و اندازه‌اش، و چند دیوار، در و پنجره هست.',
    'fa-AF': 'صفحه‌خوان‌ها نقشه را می‌خوانند: هر اتاق و اندازه‌اش، و چند دیوار، دروازه و کلکین است.',
    ar: 'قارئات الشاشة تقرأ المخطط: كل غرفة ومساحتها، وكم جداراً وباباً ونافذة.',
    rw: "Porogaramu zisoma ecran zishobora kumva igishushanyo: buri cyumba n'ingano yacyo, n'umubare w'inkuta, inzugi n'amadirishya.",
  }),
  'plan.label': g('Floor plan', { es: 'Plano de planta', cu: 'Plano de planta', uk: 'План поверху', ru: 'План этажа', ti: 'ፕላን ደርቢ', fa: 'نقشه طبقه', 'fa-AF': 'نقشه منزل', ar: 'مخطط الطابق', rw: 'Igishushanyo cy\'inzu' }),
  'plan.summary': g('{w} walls, {d} doors, {n} windows, {f} pieces.', { es: '{w} paredes, {d} puertas, {n} ventanas, {f} muebles.', cu: '{w} paredes, {d} puertas, {n} ventanas, {f} muebles.', uk: 'Стін: {w}, дверей: {d}, вікон: {n}, предметів: {f}.', ru: 'Стен: {w}, дверей: {d}, окон: {n}, предметов: {f}.', ti: '{w} መናድቕ፣ {d} ማዕጾታት፣ {n} መሳኹቲ፣ {f} ኣቕሑ።', fa: '{w} دیوار، {d} در، {n} پنجره، {f} وسیله.', 'fa-AF': '{w} دیوار، {d} دروازه، {n} کلکین، {f} وسیله.', ar: 'جدران: {w}، أبواب: {d}، نوافذ: {n}، قطع: {f}.', rw: 'Inkuta {w}, inzugi {d}, amadirishya {n}, ibikoresho {f}.' }),
  'plan.rooms': g('Rooms', { es: 'Cuartos', cu: 'Cuartos', uk: 'Кімнати', ru: 'Комнаты', ti: 'ክፍልታት', fa: 'اتاق‌ها', 'fa-AF': 'اتاق‌ها', ar: 'الغرف', rw: 'Ibyumba' }),
  // 2.13.39: ti, fa-AF and rw are UNCHECKED native copy.
  'news.fold': g('One clean font across the top bar, and the tool list button that hides the names now says Fold.', {
    es: 'Una sola letra limpia en la barra de arriba, y el botón que oculta los nombres de las herramientas ahora dice Plegar.',
    cu: 'Una sola letra limpia en la barra de arriba, y el botón que oculta los nombres de las herramientas ahora dice Plegar.',
    uk: 'Один охайний шрифт у верхній панелі, а кнопка, що ховає назви інструментів, тепер називається «Згорнути».',
    ru: 'Один аккуратный шрифт в верхней панели, а кнопка, которая прячет названия инструментов, теперь называется «Свернуть».',
    ti: 'ኣብ ላዕለዋይ መስመር ሓደ ጽሩይ ፊደል፣ ኣስማት መሳርሒታት ዝሓብእ መጠወቕ ድማ ሕጂ "ኣሕጽር" ይብል።',
    fa: 'یک قلم یکدست در نوار بالا، و دکمه‌ای که نام ابزارها را پنهان می‌کند حالا «جمع کن» است.',
    'fa-AF': 'یک قلم یکدست در نوار بالا، و دکمه‌ای که نام ابزارها را پنهان می‌کند حالا «جمع کن» است.',
    ar: 'خط واحد نظيف في الشريط العلوي، والزر الذي يخفي أسماء الأدوات صار اسمه «اطوِ».',
    rw: "Inyuguti imwe isukuye mu murongo wo hejuru, kandi akabuto gahisha amazina y'ibikoresho ubu kanditseho Funga.",
  }),
  // 2.13.38: ti, fa-AF and rw are UNCHECKED native copy.
  'news.sizesClear': g('Wall sizes slide along the wall to a clear spot, so they never sit on a door or a room name.', {
    es: 'Las medidas de las paredes se deslizan a un lugar libre, así nunca quedan sobre una puerta o el nombre de un cuarto.',
    cu: 'Las medidas de las paredes se deslizan a un lugar libre, así nunca quedan sobre una puerta o el nombre de un cuarto.',
    uk: 'Розміри стін зсуваються вздовж стіни на вільне місце, тож ніколи не стоять на дверях чи назві кімнати.',
    ru: 'Размеры стен сдвигаются вдоль стены на свободное место и никогда не стоят на двери или названии комнаты.',
    ti: 'ዓቐን መናድቕ ናብ ጽሩይ ቦታ ይሕንበብ፣ ስለዚ ኣብ ልዕሊ ማዕጾ ወይ ስም ክፍሊ ኣይቕመጥን።',
    fa: 'اندازه دیوارها در طول دیوار به جای خالی می‌لغزد، تا هرگز روی در یا نام اتاق نیفتد.',
    'fa-AF': 'اندازه دیوارها در طول دیوار به جای خالی می‌لغزد، تا هرگز روی دروازه یا نام اتاق نیفتد.',
    ar: 'تنزلق مقاسات الجدران على طول الجدار إلى مكان خالٍ، فلا تقع أبداً على باب أو اسم غرفة.',
    rw: "Ingano z'inkuta zinyerera ku rukuta zijya ahantu hatarimo ikintu, ntizijya ku rugi cyangwa ku izina ry'icyumba.",
  }),
  // 2.13.37: ti, fa-AF and rw are UNCHECKED native copy.
  'news.sizesOnTop': g('Wall sizes on the plan stay on top of flower beds and paths, with a soft halo so they are easy to read.', {
    es: 'Las medidas de las paredes en el plano quedan encima de canteros y caminos, con un halo suave para leerlas fácil.',
    cu: 'Las medidas de las paredes en el plano quedan encima de canteros y caminos, con un halo suave para leerlas fácil.',
    uk: 'Розміри стін на плані лишаються поверх клумб і доріжок, з м’яким ореолом, щоб їх легко читати.',
    ru: 'Размеры стен на плане остаются поверх клумб и дорожек, с мягким ореолом, чтобы их легко читать.',
    ti: 'ዓቐን መናድቕ ኣብ ፕላን ኣብ ልዕሊ መትከሊ ዕምባባን መገድን ይተርፍ፣ ብቐሊሉ ንምንባብ ልሙጥ ብርሃን ኣለዎ።',
    fa: 'اندازه دیوارها روی نقشه بالای باغچه‌ها و راه‌ها می‌ماند، با هاله‌ای نرم تا راحت خوانده شود.',
    'fa-AF': 'اندازه دیوارها روی نقشه بالای باغچه‌ها و راه‌ها می‌ماند، با هاله نرم تا آسان خوانده شود.',
    ar: 'مقاسات الجدران على المخطط تبقى فوق أحواض الزهور والممرات، مع هالة ناعمة لتسهل قراءتها.',
    rw: "Ingano z'inkuta ku gishushanyo ziguma hejuru y'indabo n'inzira, zifite urumuri rworoheje kugira ngo zisomeke neza.",
  }),
  // 2.13.36: ti, fa-AF and rw are UNCHECKED native copy.
  'news.walkFast': g('Walking through the house is lighter work for the computer: faraway rooms’ furniture waits until you get close.', {
    es: 'Recorrer la casa cuesta menos a la computadora: los muebles de los cuartos lejanos esperan hasta que te acercas.',
    cu: 'Recorrer la casa cuesta menos a la computadora: los muebles de los cuartos lejanos esperan hasta que te acercas.',
    uk: 'Прогулянка будинком легша для комп’ютера: меблі далеких кімнат з’являються, коли ти підходиш ближче.',
    ru: 'Прогулка по дому легче для компьютера: мебель дальних комнат появляется, когда ты подходишь ближе.',
    ti: 'ኣብ ገዛ ምዝዋር ንኮምፒተር ቀሊል እዩ፦ ኣቕሓ ናይ ርሑቓት ክፍልታት ክሳብ ትቐርብ ይጽበ።',
    fa: 'گشتن در خانه برای رایانه سبک‌تر است: مبلمان اتاق‌های دور تا وقتی نزدیک شوی منتظر می‌ماند.',
    'fa-AF': 'گشتن در خانه برای کمپیوتر سبک‌تر است: فرنیچر اتاق‌های دور تا وقتی نزدیک شوی منتظر می‌ماند.',
    ar: 'التجول في البيت أخف على الحاسوب: أثاث الغرف البعيدة ينتظر حتى تقترب.',
    rw: "Gutembera mu nzu byoroheye mudasobwa: ibikoresho by'ibyumba bya kure bitegereza kugeza wegereye.",
  }),
  // 2.13.35: ti, fa-AF and rw are UNCHECKED native copy.
  'news.fps': g('Teachers can see how fast 3D runs: hold the version chip for Teacher, then open 3D to see frames a second.', {
    es: 'Los maestros pueden ver qué tan rápido va el 3D: mantén pulsado el chip de versión para Maestro y abre 3D para ver los cuadros por segundo.',
    cu: 'Los maestros pueden ver qué tan rápido va el 3D: mantén pulsado el chip de versión para Maestro y abre 3D para ver los cuadros por segundo.',
    uk: 'Учителі можуть бачити, як швидко працює 3D: утримуйте значок версії для режиму вчителя, потім відкрийте 3D, щоб побачити кадри за секунду.',
    ru: 'Учителя могут видеть, как быстро работает 3D: удерживайте значок версии для режима учителя, затем откройте 3D, чтобы увидеть кадры в секунду.',
    ti: 'መምህራን 3D ክንደይ ቀልጢፉ ከም ዝሰርሕ ክርእዩ ይኽእሉ፦ ንመምህር ምልክት ስሪት ጠውቕ ሓዝ፣ ድሕሪኡ 3D ክፈት።',
    fa: 'معلم‌ها می‌توانند سرعت سه‌بعدی را ببینند: نشان نسخه را برای حالت معلم نگه دارید، بعد سه‌بعدی را باز کنید تا فریم در ثانیه را ببینید.',
    'fa-AF': 'معلمان می‌توانند سرعت سه‌بعدی را ببینند: نشان نسخه را برای حالت معلم نگه دارید، بعد سه‌بعدی را باز کنید.',
    ar: 'يمكن للمعلمين رؤية سرعة العرض الثلاثي: اضغط مطولاً على شارة الإصدار لوضع المعلم، ثم افتح العرض الثلاثي لترى الإطارات في الثانية.',
    rw: "Abarimu bashobora kureba umuvuduko wa 3D: kanda igihe kirekire ku kirango cy'inyandiko ubone uburyo bw'umwarimu, hanyuma ufungure 3D.",
  }),
  '3d.fps': g('{n} frames a second', { es: '{n} cuadros por segundo', cu: '{n} cuadros por segundo', uk: '{n} кадрів за секунду', ru: '{n} кадров в секунду', ti: '{n} ስእልታት ኣብ ካልኢት', fa: '{n} فریم در ثانیه', 'fa-AF': '{n} فریم در ثانیه', ar: '{n} إطار في الثانية', rw: 'Amashusho {n} ku isegonda' }),
  '3d.look.rich': g('full look', { es: 'vista completa', cu: 'vista completa', uk: 'повний вигляд', ru: 'полный вид', ti: 'ምሉእ ትርኢት', fa: 'نمای کامل', 'fa-AF': 'نمای کامل', ar: 'المظهر الكامل', rw: 'isura yuzuye' }),
  '3d.look.plain': g('light look', { es: 'vista ligera', cu: 'vista ligera', uk: 'легкий вигляд', ru: 'облегчённый вид', ti: 'ፎኲስ ትርኢት', fa: 'نمای سبک', 'fa-AF': 'نمای سبک', ar: 'المظهر الخفيف', rw: 'isura yoroheje' }),
  // 2.13.34: ti, fa-AF and rw are UNCHECKED native copy.
  'news.furniture3d': g("Nicer 3D furniture (tufted sofa, real beds, a pedestal dining table), and the Mansion's chairs face the table.", {
    es: 'Muebles 3D más bonitos (sofá capitoné, camas de verdad, una mesa de comedor con pie), y las sillas de la Mansión miran a la mesa.',
    cu: 'Muebles 3D más bonitos (sofá capitoné, camas de verdad, una mesa de comedor con pie), y las sillas de la Mansión miran a la mesa.',
    uk: 'Гарніші 3D-меблі (стьобаний диван, справжні ліжка, обідній стіл на ніжці), а стільці в Особняку повернуті до столу.',
    ru: 'Красивее 3D-мебель (стёганый диван, настоящие кровати, обеденный стол на ножке), а стулья в Особняке повёрнуты к столу.',
    ti: 'ዝሓሸ 3D ኣቕሓ ገዛ (ዝተሰፍየ ሶፋ፣ ሓቀኛ ዓራታት፣ ብእግሪ ዝቐውም ጠረጴዛ መግቢ)፣ ኣኮፋት ናይቲ ዓቢ ገዛ ድማ ናብ ጠረጴዛ ይጥምቱ።',
    fa: 'مبلمان سه‌بعدی زیباتر (مبل دکمه‌دار، تخت‌های واقعی، میز ناهارخوری پایه‌دار)، و صندلی‌های عمارت رو به میزند.',
    'fa-AF': 'فرنیچر سه‌بعدی زیباتر (کوچ دکمه‌دار، چپرکت‌های واقعی، میز نان‌خوری پایه‌دار)، و چوکی‌های قصر رو به میز هستند.',
    ar: 'أثاث ثلاثي الأبعاد أجمل (أريكة منجدة، أسرّة حقيقية، طاولة طعام بقاعدة)، وكراسي القصر تواجه الطاولة.',
    rw: "Ibikoresho bya 3D byiza kurushaho (intebe ndende yoroshye, ibitanda nyabyo, ameza yo kuriraho afite ikirenge), kandi intebe z'Inzu nini zireba ameza.",
  }),
  // 2.13.33: ti, fa-AF and rw are UNCHECKED native copy.
  'news.shade': g('On phones and Chromebooks, rooms get soft shade where walls meet the floor and ceiling, so they look deep, not flat.', {
    es: 'En teléfonos y Chromebooks, los cuartos tienen una sombra suave donde las paredes tocan el piso y el techo, y se ven profundos, no planos.',
    cu: 'En teléfonos y Chromebooks, los cuartos tienen una sombra suave donde las paredes tocan el piso y el techo, y se ven profundos, no planos.',
    uk: 'На телефонах і Chromebook у кімнатах з’явилася м’яка тінь там, де стіни сходяться з підлогою та стелею, тож вони виглядають глибокими, а не пласкими.',
    ru: 'На телефонах и Chromebook в комнатах появилась мягкая тень там, где стены сходятся с полом и потолком, и они выглядят глубокими, а не плоскими.',
    ti: 'ኣብ ተሌፎናትን ክሮምቡክን፣ መናድቕ ምስ ወለልን ናሕስን ኣብ ዝራኸብሉ ልሙጥ ጽላል ስለ ዘሎ ክፍልታት ዓሚቝ ይመስሉ።',
    fa: 'در گوشی‌ها و کروم‌بوک‌ها، اتاق‌ها جایی که دیوار به کف و سقف می‌رسد سایه نرم می‌گیرند و عمیق به نظر می‌رسند، نه صاف.',
    'fa-AF': 'در موبایل‌ها و کروم‌بوک‌ها، اتاق‌ها جایی که دیوار به فرش و سقف می‌رسد سایه نرم می‌گیرند و عمیق معلوم می‌شوند، نه هموار.',
    ar: 'على الهواتف وأجهزة Chromebook، تحصل الغرف على ظل ناعم حيث تلتقي الجدران بالأرض والسقف، فتبدو عميقة لا مسطحة.',
    rw: "Kuri telefoni na Chromebook, ibyumba bibona igicucu cyoroheje aho inkuta zihurira n'hasi n'igisenge, bikagaragara bifite ubujyakuzimu.",
  }),
  // 2.13.32: ti, fa-AF and rw are UNCHECKED native copy.
  'news.glass': g('Windows look like glass in 3D: a soft sky in the panes and light streaks, even up in the roof windows.', {
    es: 'Las ventanas parecen de vidrio en 3D: un cielo suave en los cristales y reflejos de luz, hasta en las ventanas del techo.',
    cu: 'Las ventanas parecen de vidrio en 3D: un cielo suave en los cristales y reflejos de luz, hasta en las ventanas del techo.',
    uk: 'Вікна в 3D схожі на скло: м’яке небо в шибках і світлові відблиски, навіть у вікнах на даху.',
    ru: 'Окна в 3D похожи на стекло: мягкое небо в стёклах и световые блики, даже в окнах на крыше.',
    ti: 'መሳኹቲ ብ3D ከም ብርጭቆ ይመስሉ፦ ልሙጥ ሰማይ ኣብ መሳኹቲን ጨረራታት ብርሃንን፣ ኣብ መሳኹቲ ናሕሲ እውን።',
    fa: 'پنجره‌ها در سه‌بعدی شیشه‌ای به نظر می‌رسند: آسمانی نرم در شیشه‌ها و رگه‌های نور، حتی در پنجره‌های سقف.',
    'fa-AF': 'کلکین‌ها در سه‌بعدی شیشه‌ای معلوم می‌شوند: آسمان نرم در شیشه‌ها و رگه‌های روشنی، حتی در کلکین‌های بام.',
    ar: 'النوافذ تبدو زجاجية في العرض الثلاثي: سماء ناعمة في الألواح وخطوط ضوء، حتى في نوافذ السقف.',
    rw: "Amadirishya asa n'ibirahure muri 3D: ijuru ryoroheje mu birahure n'imirasire y'urumuri, ndetse no mu madirishya yo ku gisenge.",
  }),
  // 2.13.31: ti, fa-AF and rw are UNCHECKED native copy.
  'news.crown': g("Rooms get crown molding at the ceiling, and the Mansion's lampposts stand outside instead of in the parlor.", {
    es: 'Los cuartos tienen moldura en el techo, y los faroles de la Mansión están afuera en vez de en la sala.',
    cu: 'Los cuartos tienen moldura en el techo, y los faroles de la Mansión están afuera en vez de en la sala.',
    uk: 'У кімнатах з’явився карниз під стелею, а ліхтарі Особняка стоять надворі, а не у вітальні.',
    ru: 'В комнатах появился карниз под потолком, а фонари Особняка стоят снаружи, а не в гостиной.',
    ti: 'ክፍልታት ኣብ ጥቓ ናሕሲ ጌጽ ረኺቦም፣ መብራህቲ ጐደና ናይቲ ዓቢ ገዛ ድማ ኣብ ክፍሊ ኣጋይሽ ዘይኮነስ ኣብ ደገ ደው ኢሎም።',
    fa: 'اتاق‌ها زیر سقف قرنیز گرفتند، و چراغ‌پایه‌های عمارت به جای پذیرایی بیرون ایستاده‌اند.',
    'fa-AF': 'اتاق‌ها زیر سقف قرنیز گرفتند، و چراغ‌پایه‌های قصر به جای مهمان‌خانه بیرون ایستاده‌اند.',
    ar: 'صار للغرف كورنيش عند السقف، ومصابيح الشارع في القصر تقف في الخارج بدل غرفة الجلوس.',
    rw: "Ibyumba byabonye umutako ku gisenge, kandi amatara yo hanze y'Inzu nini ahagaze hanze aho kuba mu ruganiriro.",
  }),
  // 2.13.30: ti, fa-AF and rw are UNCHECKED native copy.
  'news.lamps': g('Wall lamps and floor lamps look real in 3D: brass arms, little shades and a warm glow.', {
    es: 'Las lámparas de pared y de pie se ven reales en 3D: brazos de latón, pantallas pequeñas y un brillo cálido.',
    cu: 'Las lámparas de pared y de pie se ven reales en 3D: brazos de latón, pantallas pequeñas y un brillo cálido.',
    uk: 'Настінні й підлогові лампи в 3D виглядають справжніми: латунні ріжки, маленькі абажури й тепле світло.',
    ru: 'Настенные и напольные лампы в 3D выглядят настоящими: латунные рожки, маленькие абажуры и тёплый свет.',
    ti: 'ናይ መንደቕን ናይ ምድርን መብራህቲ ብ3D ሓቀኛ ይመስሉ፦ ናይ ነሓስ ቅልጽም፣ ንኣሽቱ መሸፈኒታትን ውዑይ ብርሃንን።',
    fa: 'چراغ‌های دیواری و ایستاده در سه‌بعدی واقعی به نظر می‌رسند: بازوهای برنجی، آباژورهای کوچک و نوری گرم.',
    'fa-AF': 'چراغ‌های دیواری و ایستاده در سه‌بعدی واقعی معلوم می‌شوند: بازوهای برنجی، سرپوش‌های کوچک و روشنی گرم.',
    ar: 'مصابيح الجدار والمصابيح الأرضية تبدو حقيقية في العرض الثلاثي: أذرع نحاسية وأغطية صغيرة وتوهج دافئ.',
    rw: "Amatara yo ku rukuta n'ayo hasi asa n'ay'ukuri muri 3D: amaboko y'umuringa, ibipfukisho bito n'urumuri rushyushye.",
  }),
  // 2.13.29: ti, fa-AF and rw are UNCHECKED native copy.
  'news.fixtures': g('Inside the 3D house: a real brass chandelier with shades, and panelled doors with knobs that open back out of the way.', {
    es: 'Dentro de la casa 3D: una lámpara de araña de latón con pantallas, y puertas con paneles y pomos que se abren sin estorbar.',
    cu: 'Dentro de la casa 3D: una lámpara de araña de latón con pantallas, y puertas con paneles y pomos que se abren sin estorbar.',
    uk: 'У 3D-будинку: справжня латунна люстра з абажурами та філенчасті двері з ручками, що відчиняються й не заважають.',
    ru: 'В 3D-доме: настоящая латунная люстра с абажурами и филёнчатые двери с ручками, которые открываются и не мешают.',
    ti: 'ኣብ ውሽጢ 3D ገዛ፦ ሓቀኛ ናይ ነሓስ ቻንደልየር ምስ መሸፈኒ፣ ከምኡ’ውን ብፓነል ዝተሰርሑ ማዕጾታት ምስ መትሓዚ፣ ዘይዕንቅፉ ዝኽፈቱ።',
    fa: 'درون خانه سه‌بعدی: یک لوستر برنجی واقعی با آباژور، و درهای قاب‌دار با دستگیره که کنار باز می‌شوند.',
    'fa-AF': 'درون خانه سه‌بعدی: یک چراغ‌دان برنجی واقعی با سرپوش، و دروازه‌های قاب‌دار با دستگیره که کنار باز می‌شوند.',
    ar: 'داخل البيت الثلاثي: ثريا نحاسية حقيقية بأغطية، وأبواب بألواح ومقابض تنفتح بعيداً عن الطريق.',
    rw: "Imbere mu nzu ya 3D: itara rinini ry'umuringa rifite ibipfukisho, n'inzugi zifite imbaho n'imikoresho yo kuzifungura zifunguka zitabangamira.",
  }),
  // 2.13.28: ti, fa-AF and rw are UNCHECKED native copy.
  'news.roofTag': g('The plan is less crowded: the roof is named on the plan card, not on top of the flower beds.', {
    es: 'El plano está menos lleno: el techo se nombra en la tarjeta del plano, no encima de los canteros.',
    cu: 'El plano está menos lleno: el techo se nombra en la tarjeta del plano, no encima de los canteros.',
    uk: 'План менш захаращений: дах названо на картці плану, а не поверх клумб.',
    ru: 'План менее загромождён: крыша названа на карточке плана, а не поверх клумб.',
    ti: 'እቲ ፕላን ዝሓሸ ጽሩይ እዩ፦ ናሕሲ ኣብ ካርድ ፕላን ይስመ፣ ኣብ ልዕሊ መትከሊ ዕምባባ ኣይኮነን።',
    fa: 'نقشه شلوغی کمتری دارد: نام سقف روی کارت نقشه است، نه روی باغچه‌ها.',
    'fa-AF': 'نقشه کمتر شلوغ است: نام بام روی کارت نقشه است، نه روی باغچه‌ها.',
    ar: 'المخطط أقل ازدحاماً: اسم السقف على بطاقة المخطط، لا فوق أحواض الزهور.',
    rw: "Igishushanyo nticyuzuye cyane: igisenge cyanditswe ku ikarita y'igishushanyo, si hejuru y'indabo.",
  }),
  // 2.13.27: ti, fa-AF and rw are UNCHECKED native copy.
  'news.tidy': g('Wall sizes sit neatly outside the house, room paint can be undone, and the item panel folds away in 3D.', {
    es: 'Las medidas de las paredes quedan ordenadas fuera de la casa, la pintura de los cuartos se puede deshacer y el panel se pliega en 3D.',
    cu: 'Las medidas de las paredes quedan ordenadas fuera de la casa, la pintura de los cuartos se puede deshacer y el panel se pliega en 3D.',
    uk: 'Розміри стін охайно стоять зовні будинку, фарбу кімнат можна скасувати, а панель предмета згортається в 3D.',
    ru: 'Размеры стен аккуратно стоят снаружи дома, краску комнат можно отменить, а панель предмета сворачивается в 3D.',
    ti: 'ዓቐን መናድቕ ብጽቡቕ ኣብ ደገ ገዛ ይቕመጥ፣ ሕብሪ ክፍሊ ክምለስ ይኽእል፣ ሰሌዳ ኣቕሓ ድማ ኣብ 3D ይዕጸፍ።',
    fa: 'اندازه دیوارها مرتب بیرون خانه می‌نشیند، رنگ اتاق‌ها برگشت‌پذیر است، و پنل در سه‌بعدی جمع می‌شود.',
    'fa-AF': 'اندازه دیوارها منظم بیرون خانه می‌نشیند، رنگ اتاق‌ها دوباره برگشت‌پذیر است، و پنل در سه‌بعدی جمع می‌شود.',
    ar: 'مقاسات الجدران مرتبة خارج البيت، ويمكن التراجع عن دهان الغرف، ولوحة العنصر تنطوي في العرض الثلاثي.',
    rw: "Ingano z'inkuta ziri neza inyuma y'inzu, irangi ry'ibyumba rirasubizwa, kandi akanama k'ikintu kirizinga muri 3D.",
  }),
  // 2.13.26: ti, fa-AF and rw are UNCHECKED native copy.
  'news.touch3d': g('On phones, 3D shows the whole house, pinch zooms and spreading two fingers walks you in; the buttons take less room.', {
    es: 'En el teléfono, el 3D muestra toda la casa, pellizcar acerca y abrir dos dedos te hace caminar; los botones ocupan menos.',
    cu: 'En el teléfono, el 3D muestra toda la casa, pellizcar acerca y abrir dos dedos te hace caminar; los botones ocupan menos.',
    uk: 'На телефоні 3D показує весь будинок, зведення пальців наближає, а розведення двох пальців веде вперед; кнопки займають менше місця.',
    ru: 'На телефоне 3D показывает весь дом, щипок приближает, а разведение двух пальцев ведёт вперёд; кнопки занимают меньше места.',
    ti: 'ብተሌፎን 3D ምሉእ ገዛ የርኢ፣ ኣጻብዕ ምጽቃጥ የቕርብ፣ ክልተ ኣጻብዕ ምዝርጋሕ ድማ የኸይደካ፤ መጠወቕታት ውሑድ ቦታ ይሕዙ።',
    fa: 'در گوشی، سه‌بعدی کل خانه را نشان می‌دهد، با دو انگشت بزرگ‌نمایی می‌شود و باز کردن دو انگشت تو را جلو می‌برد؛ دکمه‌ها جای کمتری می‌گیرند.',
    'fa-AF': 'در موبایل، سه‌بعدی تمام خانه را نشان می‌دهد، با دو انگشت کلان‌نمایی می‌شود و باز کردن دو انگشت تو را پیش می‌برد؛ دکمه‌ها جای کمتر می‌گیرند.',
    ar: 'على الهاتف يُظهر العرض الثلاثي البيت كله، والقرص يقرّب، وتباعد إصبعين يمشي بك؛ والأزرار تأخذ مساحة أقل.',
    rw: "Kuri telefoni, 3D yerekana inzu yose, gufunga intoki byegereza, gutandukanya intoki ebyiri bikugendesha; utubuto dufata umwanya muto.",
  }),
  '3d.drag.touch': g('Drag to turn · pinch to zoom', { es: 'Arrastra para girar · pellizca para acercar', cu: 'Arrastra para girar · pellizca para acercar', uk: 'Тягни, щоб крутити · зведи пальці, щоб наблизити', ru: 'Тяни, чтобы вращать · сведи пальцы, чтобы приблизить', ti: 'ንምዝዋር ስሓብ · ንምቕራብ ኣጻብዕ ጸቕጥ', fa: 'بکش تا بچرخد · با دو انگشت بزرگ‌نمایی کن', 'fa-AF': 'بکش تا بچرخد · با دو انگشت کلان‌نمایی کن', ar: 'اسحب للتدوير · اقرص للتقريب', rw: 'Kurura uzunguruke · funga intoki wegereze' }),
  '3d.drag.walk.touch': g('Drag to look · spread two fingers to walk', { es: 'Arrastra para mirar · abre dos dedos para caminar', cu: 'Arrastra para mirar · abre dos dedos para caminar', uk: 'Тягни, щоб дивитись · розведи два пальці, щоб іти', ru: 'Тяни, чтобы смотреть · разведи два пальца, чтобы идти', ti: 'ንምርኣይ ስሓብ · ንምኻድ ክልተ ኣጻብዕ ዘርግሕ', fa: 'بکش تا نگاه کنی · دو انگشت را باز کن تا راه بروی', 'fa-AF': 'بکش تا نگاه کنی · دو انگشت را باز کن تا راه بروی', ar: 'اسحب للنظر · باعد إصبعين للمشي', rw: 'Kurura urebe · tandukanya intoki ebyiri ugende' }),
  '3d.walk.exit': g('Step outside', { es: 'Salir afuera', cu: 'Salir afuera', uk: 'Вийти надвір', ru: 'Выйти наружу', ti: 'ናብ ደገ ውጻእ', fa: 'برو بیرون', 'fa-AF': 'برو بیرون', ar: 'اخرج للخارج', rw: 'Sohoka hanze' }),
  '3d.preview': g('3D preview', {
    es: 'Vista 3D', cu: 'Vista 3D', uk: 'Перегляд 3D', ru: 'Просмотр 3D', ti: 'ቅድመ ትርኢት 3D', fa: 'پیش‌نمایش سه‌بعدی',
  }),
  '3d.drag': g('Drag to look around', {
    es: 'Arrastra para mirar', cu: 'Arrastra para mirar', uk: 'Тягни, щоб озирнутись', ru: 'Тяни, чтобы осмотреться', ti: 'ንምርኣይ ስሓብ', fa: 'بکش تا نگاه کنی',
  }),
  '3d.drag.walk': g('Drag to look · scroll to walk', {
    es: 'Arrastra para mirar · rueda para caminar',
    cu: 'Arrastra para mirar · rueda para caminar',
    uk: 'Тягни, щоб дивитись · колесо йде',
    ru: 'Тяни, чтобы смотреть · колесо идёт',
    ti: 'ንምርኣይ ስሓብ · መንኰርኰር የኸይድ',
    fa: 'بکش تا نگاه کنی · اسکرول راه می‌رود',
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
  'chrome.mansion': g('The Mansion', {
    es: 'La mansión', cu: 'La mansión', uk: 'Особняк', ru: 'Особняк', ti: 'ዓቢ ገዛ', fa: 'عمارت',
    'fa-AF': 'عمارت', ar: 'القصر', rw: 'Inzu nini',
  }),
  'chrome.full': g('Full screen', {
    es: 'Pantalla completa', cu: 'Pantalla completa', uk: 'На весь екран', ru: 'На весь экран', ti: 'ምሉእ ስክሪን', fa: 'تمام‌صفحه',
  }),
  'chrome.exitFull': g('Exit full screen', {
    es: 'Salir de pantalla completa', cu: 'Salir de pantalla completa', uk: 'Вийти з повного екрана', ru: 'Выйти из полного экрана', ti: 'ካብ ምሉእ ስክሪን ውጻእ', fa: 'خروج از تمام‌صفحه',
  }),
  'chrome.showBar': g('Show the bar', {
    es: 'Mostrar la barra', cu: 'Mostrar la barra', uk: 'Показати смугу', ru: 'Показать полосу', ti: 'ነቲ መስመር ኣርእዩ', fa: 'نوار را نشان بده',
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
  'save.saved': g('Saved', {
    es: 'Guardado', cu: 'Guardado', uk: 'Збережено', ru: 'Сохранено', ti: 'ተዓቂቡ', fa: 'ذخیره شد',
    'fa-AF': 'ذخیره شد', ar: 'تم الحفظ', rw: 'Byabitswe',
  }),
  'save.savedAt': g('Saved {time}', {
    es: 'Guardado {time}', cu: 'Guardado {time}', uk: 'Збережено {time}', ru: 'Сохранено {time}', ti: 'ተዓቂቡ {time}', fa: 'ذخیره شد {time}',
    'fa-AF': 'ذخیره شد {time}', ar: 'تم الحفظ {time}', rw: 'Byabitswe {time}',
  }),
  'save.saving': g('Saving...', {
    es: 'Guardando...', cu: 'Guardando...', uk: 'Збереження...', ru: 'Сохранение...', ti: 'ይዕቀብ ኣሎ...', fa: 'در حال ذخیره...',
    'fa-AF': 'در حال ذخیره...', ar: 'يحفظ...', rw: 'Birimo kubikwa...',
  }),
  'save.offline': g('Saved on this Chromebook', {
    es: 'Guardado en esta Chromebook', cu: 'Guardado en esta Chromebook', uk: 'Збережено на цьому Chromebook', ru: 'Сохранено на этом Chromebook', ti: 'ኣብዚ Chromebook ተዓቂቡ', fa: 'روی همین کروم‌بوک ذخیره شد',
    'fa-AF': 'روی همین کروم‌بوک ذخیره شد', ar: 'محفوظ على هذا Chromebook', rw: 'Byabitswe kuri iyi Chromebook',
  }),
  'save.error': g('Not saved. Tap Export to keep a copy.', {
    es: 'No se guardó. Toca Exportar para guardar una copia.',
    cu: 'No se guardó. Toca Exportar para guardar una copia.',
    uk: 'Не збережено. Торкніться Експорт, щоб лишити копію.',
    ru: 'Не сохранено. Нажмите Экспорт, чтобы оставить копию.',
    ti: 'ኣይተዓቀበን። ኮፒ ንምዕቃብ Export ጠውቕ።',
    fa: 'ذخیره نشد. برای نگه داشتن یک نسخه، خروجی را بزن.',
    'fa-AF': 'ذخیره نشد. برای نگه داشتن یک نسخه، خروجی را بزن.',
    ar: 'لم يُحفظ. اضغط تصدير لتحفظ نسخة.',
    rw: 'Ntabwo byabitswe. Kanda Export kugira ngo ubike kopi.',
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
  'hint.osnapOn': g('Wall snap', {
    es: 'Imán a muros', cu: 'Imán a paredes', uk: 'Прилипання до стін', ru: 'Привязка к стенам',
    ti: 'ናብ መንደቕ ምልጣፍ', fa: 'چسبیدن به دیوار',
  }),
  'chip.straight': g('Straight', {
    es: 'Recto', cu: 'Recto', uk: 'Прямо', ru: 'Прямо', ti: 'ቀጥታ', fa: 'صاف',
  }),
  'chip.free': g('Free', {
    es: 'Libre', cu: 'Libre', uk: 'Вільно', ru: 'Свободно', ti: 'ናጻ', fa: 'آزاد',
  }),
  'chip.wallsOff': g('Walls off', {
    es: 'Muros no', cu: 'Paredes no', uk: 'Стіни вимк', ru: 'Стены выкл', ti: 'መንደቕ ጠፊኡ', fa: 'دیوار خاموش',
  }),
  'chip.zoomIn': g('Zoom in', {
    es: 'Acercar', cu: 'Acercar', uk: 'Ближче', ru: 'Ближе', ti: 'ቀረብ', fa: 'نزدیک',
  }),
  'chip.zoomOut': g('Zoom out', {
    es: 'Alejar', cu: 'Alejar', uk: 'Далі', ru: 'Дальше', ti: 'ርሐቕ', fa: 'دور',
  }),
  'chip.roof': g('Roof', {
    es: 'Techo', cu: 'Techo', uk: 'Дах', ru: 'Крыша', ti: 'ናሕሲ', fa: 'سقف',
  }),
  'chip.roofNone': g('No roof', {
    es: 'Sin techo', cu: 'Sin techo', uk: 'Без даху', ru: 'Без крыши', ti: 'ናሕሲ የለን', fa: 'بدون سقف', 'fa-AF': 'بدون بام', ar: 'بلا سقف', rw: 'Nta gisenge',
  }),
  'osnap.endpoint': g('Corner', {
    es: 'Esquina', cu: 'Esquina', uk: 'Кут', ru: 'Угол', ti: 'ኩርናዕ', fa: 'گوشه',
  }),
  'osnap.midpoint': g('Middle', {
    es: 'Centro', cu: 'Centro', uk: 'Середина', ru: 'Середина', ti: 'ማእከል', fa: 'وسط',
  }),
  'osnap.cross': g('Crossing', {
    es: 'Cruce', cu: 'Cruce', uk: 'Перетин', ru: 'Пересечение', ti: 'መስቀላዊ', fa: 'تقاطع',
  }),
  'osnap.perp': g('Square', {
    es: 'Escuadra', cu: 'Escuadra', uk: 'Прямий кут', ru: 'Прямой угол', ti: 'ቀጥ ዝበለ', fa: 'قائمه',
  }),
  'osnap.onwall': g('On wall', {
    es: 'En el muro', cu: 'En la pared', uk: 'На стіні', ru: 'На стене', ti: 'ኣብ መንደቕ', fa: 'روی دیوار',
  }),
  'dyn.len': g('Length', {
    es: 'Largo', cu: 'Largo', uk: 'Довжина', ru: 'Длина', ti: 'ንውሓት', fa: 'طول',
  }),
  'dyn.ang': g('Angle', {
    es: 'Ángulo', cu: 'Ángulo', uk: 'Кут', ru: 'Угол', ti: 'መኣዝን', fa: 'زاویه',
  }),
  'dyn.go': g('Set', {
    es: 'Fijar', cu: 'Fijar', uk: 'Задати', ru: 'Задать', ti: 'ኣቐምጥ', fa: 'ثبت',
  }),
  'set.osnap': g('Snap to walls (corner, middle, crossing)', {
    es: 'Imán a muros (esquina, centro, cruce)',
    cu: 'Imán a paredes (esquina, centro, cruce)',
    uk: 'Прилипання до стін (кут, середина, перетин)',
    ru: 'Привязка к стенам (угол, середина, пересечение)',
    ti: 'ናብ መንደቕ ምልጣፍ (ኩርናዕ፣ ማእከል፣ መስቀላዊ)',
    fa: 'چسبیدن به دیوار (گوشه، وسط، تقاطع)',
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
  'help.chrome': g('Tools sit in a left Edge Pocket (Select, Sketch, Wall, Door). Wall opens a flyout for thickness, height, and style. Save, Teach, and Help sit on one thin top row. The plan card moves aside when the pocket is open so Furn and Plant stay tappable. Menus overlay — the grid fills the rest.', {
    es: 'Las herramientas van en un bolsillo izquierdo (Elegir, Boceto, Muro, Puerta). Muro abre grosor, altura y estilo. Guardar, Enseñar y Ayuda van en una sola fila de arriba. La tarjeta del plano se aparta cuando el bolsillo está abierto. Los menús se superponen — la cuadrícula llena el resto.',
    cu: 'Las herramientas van en un bolsillo izquierdo (Escoger, Boceto, Pared, Puerta). Pared abre grosor, altura y estilo. Guardar, Enseñar y Ayuda van en una sola fila de arriba. La tarjeta del plano se aparta cuando el bolsillo está abierto. Los menús se superponen — la cuadrícula llena el resto.',
    uk: 'Інструменти в лівій кишені (Обрати, Ескіз, Стіна, Двері). Стіна відкриває товщину, висоту й стиль. Зберегти, Навчання й Допомога в одному тонкому верхньому рядку. Картка плану відступає, коли кишеня відкрита. Меню накладаються — сітка заповнює решту.',
    ru: 'Инструменты в левом кармане (Выбрать, Эскиз, Стена, Дверь). Стена открывает толщину, высоту и стиль. Сохранить, Уроки и Помощь в одной тонкой верхней строке. Карточка плана отодвигается, когда карман открыт. Меню поверх — сетка заполняет остальное.',
    ti: 'መሳርሒታት ኣብ ጸጋም ኪስ እየን (ምረጽ፣ ስእሊ፣ መንደቕ፣ ማዕጾ). መንደቕ ውፍረት፣ ቁመትን ቅድን ይኸፍት. ኣቐምጥ፣ ምምሃርን ሓገዝን ኣብ ሓደ ቀጢን ላዕሊ መስርዕ. እቲ ትልሚ ካርድ ኪስ ምስ ክፈተ ይግዕዝ. ምናው ኣብ ልዕሊ እዩ — መርበብ ነቲ ዝተረፈ ይመልኦ.',
    fa: 'ابزار در جیب چپ است (انتخاب، طرح، دیوار، در). دیوار ضخامت، ارتفاع و سبک را باز می‌کند. ذخیره، آموزش و راهنما در یک ردیف نازک بالا هستند. کارت پلان کنار می‌رود وقتی جیب باز است. منوها روی پلان می‌آیند — شبکه بقیه را پر می‌کند.',
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
  // 2.13.17 — furniture menu, object panel, paint names. ti, fa-AF and rw are UNCHECKED native copy.
  'furn.item.bed-twin': g('Twin Bed', { es: 'Cama individual', cu: 'Cama personal', uk: 'Ліжко на одного', ru: 'Односпальная кровать', ti: 'ዓራት ሓደ ሰብ', fa: 'چپرکت یک‌نفره', 'fa-AF': 'چپرکت یک‌نفره', ar: 'سرير فردي', rw: 'Igitanda cy\'umuntu umwe' }),
  'furn.item.bed-queen': g('Queen Bed', { es: 'Cama matrimonial', cu: 'Cama camera', uk: 'Двоспальне ліжко', ru: 'Двуспальная кровать', ti: 'ዓራት ክልተ ሰብ', fa: 'چپرکت دونفره', 'fa-AF': 'چپرکت دونفره', ar: 'سرير مزدوج', rw: 'Igitanda kinini' }),
  'furn.item.nightstand': g('Nightstand', { es: 'Mesita de noche', cu: 'Mesita de noche', uk: 'Тумбочка', ru: 'Тумбочка', ti: 'ጣውላ ጎኒ ዓራት', fa: 'میز کنار چپرکت', 'fa-AF': 'میز کنار چپرکت', ar: 'طاولة السرير', rw: 'Akameza ko ku buriri' }),
  'furn.item.dresser': g('Dresser', { es: 'Cómoda', cu: 'Cómoda', uk: 'Комод', ru: 'Комод', ti: 'መቐመጢ ክዳውንቲ', fa: 'الماری کشودار', 'fa-AF': 'الماری کشودار', ar: 'خزانة أدراج', rw: 'Akabati gato k\'imyenda' }),
  'furn.item.closet': g('Closet', { es: 'Clóset', cu: 'Escaparate', uk: 'Шафа', ru: 'Шкаф', ti: 'ኣርማድዮ', fa: 'الماری', 'fa-AF': 'الماری', ar: 'خزانة ملابس', rw: 'Akabati k\'imyenda' }),
  'furn.item.storage-shelf': g('Storage Shelf', { es: 'Estante', cu: 'Estante', uk: 'Полиця', ru: 'Полка', ti: 'መደርደሪ', fa: 'قفسه', 'fa-AF': 'قفسه', ar: 'رف', rw: 'Etajeri' }),
  'furn.item.sofa': g('Sofa', { es: 'Sofá', cu: 'Sofá', uk: 'Диван', ru: 'Диван', ti: 'ሶፋ', fa: 'کوچ', 'fa-AF': 'کوچ', ar: 'أريكة', rw: 'Intebe ndende' }),
  'furn.item.chair': g('Armchair', { es: 'Sillón', cu: 'Butaca', uk: 'Крісло', ru: 'Кресло', ti: 'ፖልትሮና', fa: 'چوکی دسته‌دار', 'fa-AF': 'چوکی دسته‌دار', ar: 'كرسي بذراعين', rw: 'Fotoye' }),
  'furn.item.coffee-table': g('Coffee Table', { es: 'Mesa de centro', cu: 'Mesa de centro', uk: 'Журнальний столик', ru: 'Журнальный столик', ti: 'ጣውላ ሳሎን', fa: 'میز چای', 'fa-AF': 'میز چای', ar: 'طاولة قهوة', rw: 'Akameza ko mu ruganiriro' }),
  'furn.item.dining-table': g('Dining Table', { es: 'Mesa de comedor', cu: 'Mesa de comedor', uk: 'Обідній стіл', ru: 'Обеденный стол', ti: 'ጣውላ መግቢ', fa: 'میز نان', 'fa-AF': 'میز نان', ar: 'طاولة طعام', rw: 'Ameza yo kuriraho' }),
  'furn.item.dining-chair': g('Dining Chair', { es: 'Silla de comedor', cu: 'Silla de comedor', uk: 'Стілець', ru: 'Стул', ti: 'መንበር መግቢ', fa: 'چوکی میز نان', 'fa-AF': 'چوکی میز نان', ar: 'كرسي طعام', rw: 'Intebe yo kuriraho' }),
  'furn.item.fridge': g('Refrigerator', { es: 'Nevera', cu: 'Refrigerador', uk: 'Холодильник', ru: 'Холодильник', ti: 'ፍሪጅ', fa: 'یخچال', 'fa-AF': 'یخچال', ar: 'ثلاجة', rw: 'Firigo' }),
  'furn.item.stove': g('Stove', { es: 'Estufa', cu: 'Fogón', uk: 'Плита', ru: 'Плита', ti: 'ፎርኖ', fa: 'داش', 'fa-AF': 'داش', ar: 'موقد', rw: 'Amashyiga' }),
  'furn.item.sink': g('Kitchen Sink', { es: 'Fregadero', cu: 'Fregadero', uk: 'Мийка', ru: 'Мойка', ti: 'መሕጸቢ ኩሽና', fa: 'ظرفشویی', 'fa-AF': 'ظرفشویی', ar: 'حوض المطبخ', rw: 'Igikarabiro cyo mu gikoni' }),
  'furn.item.toilet': g('Toilet', { es: 'Inodoro', cu: 'Taza', uk: 'Унітаз', ru: 'Унитаз', ti: 'ሽቃቅ', fa: 'تشناب', 'fa-AF': 'تشناب', ar: 'مرحاض', rw: 'Umusarani' }),
  'furn.item.bathtub': g('Bathtub', { es: 'Bañera', cu: 'Bañadera', uk: 'Ванна', ru: 'Ванна', ti: 'ቫስካ', fa: 'وان حمام', 'fa-AF': 'وان حمام', ar: 'حوض استحمام', rw: 'Ibase yo kogeramo' }),
  'furn.item.desk': g('Desk', { es: 'Escritorio', cu: 'Buró', uk: 'Письмовий стіл', ru: 'Письменный стол', ti: 'ጣውላ ጽሕፈት', fa: 'میز درس', 'fa-AF': 'میز درس', ar: 'طاولة مكتب', rw: 'Ameza yo kwandikiraho' }),
  'furn.item.water-heater': g('Water Heater', { es: 'Calentador de agua', cu: 'Calentador', uk: 'Бойлер', ru: 'Бойлер', ti: 'መውዒ ማይ', fa: 'گرم‌کن آب', 'fa-AF': 'گرم‌کن آب', ar: 'سخان ماء', rw: 'Icyuma gishyushya amazi' }),
  'furn.item.mech-closet': g('Mech Closet', { es: 'Cuarto de máquinas', cu: 'Cuarto de máquinas', uk: 'Технічна шафа', ru: 'Технический шкаф', ti: 'ክፍሊ መሳርሒ', fa: 'اتاقک تأسیسات', 'fa-AF': 'اتاقک تأسیسات', ar: 'غرفة الأجهزة', rw: 'Akabati k\'imashini' }),
  'furn.item.washer': g('Washer', { es: 'Lavadora', cu: 'Lavadora', uk: 'Пральна машина', ru: 'Стиральная машина', ti: 'መሕጸቢ ክዳን', fa: 'ماشین کالاشویی', 'fa-AF': 'ماشین کالاشویی', ar: 'غسالة', rw: 'Imashini imesa' }),
  'furn.item.dryer': g('Dryer', { es: 'Secadora', cu: 'Secadora', uk: 'Сушильна машина', ru: 'Сушильная машина', ti: 'መንቀጺ ክዳን', fa: 'ماشین کالاخشک‌کن', 'fa-AF': 'ماشین کالاخشک‌کن', ar: 'مجففة', rw: 'Imashini yumisha' }),
  'furn.item.fireplace': g('Fireplace', { es: 'Chimenea', cu: 'Chimenea', uk: 'Камін', ru: 'Камин', ti: 'መቐጸሊ ሓዊ', fa: 'بخاری دیواری', 'fa-AF': 'بخاری دیواری', ar: 'مدفأة', rw: 'Iziko' }),
  'furn.item.rug': g('Rug', { es: 'Alfombra', cu: 'Alfombra', uk: 'Килим', ru: 'Ковёр', ti: 'ምንጻፍ', fa: 'قالین', 'fa-AF': 'قالین', ar: 'سجادة', rw: 'Itapi' }),
  'furn.item.stairs': g('Stairs', { es: 'Escalera', cu: 'Escalera', uk: 'Сходи', ru: 'Лестница', ti: 'መደያይቦ', fa: 'زینه', 'fa-AF': 'زینه', ar: 'درج', rw: 'Amadarajya' }),
  'furn.item.banister': g('Banister', { es: 'Barandal', cu: 'Baranda', uk: 'Поручень', ru: 'Перила', ti: 'መትሓዚ መደያይቦ', fa: 'کتارهٔ زینه', 'fa-AF': 'کتارهٔ زینه', ar: 'درابزين', rw: 'Ibifatwa by\'amadarajya' }),
  'furn.item.floor-lamp': g('Floor lamp', { es: 'Lámpara de pie', cu: 'Lámpara de pie', uk: 'Торшер', ru: 'Торшер', ti: 'ደው ዝበለ መብራህቲ', fa: 'چراغ ایستاده', 'fa-AF': 'چراغ ایستاده', ar: 'مصباح أرضي', rw: 'Itara rihagaze' }),
  'furn.item.sconce': g('Sconce', { es: 'Lámpara de pared', cu: 'Lámpara de pared', uk: 'Бра', ru: 'Бра', ti: 'መብራህቲ መንደቕ', fa: 'چراغ دیواری', 'fa-AF': 'چراغ دیواری', ar: 'مصباح حائط', rw: 'Itara ryo ku rukuta' }),
  'furn.item.chandelier': g('Chandelier', { es: 'Candelabro', cu: 'Lámpara de techo', uk: 'Люстра', ru: 'Люстра', ti: 'ዝተሰቕለ መብራህቲ', fa: 'چلچراغ', 'fa-AF': 'چلچراغ', ar: 'ثريا', rw: 'Itara rimanitse' }),
  'furn.item.wainscot': g('Wall paneling', { es: 'Panel de pared', cu: 'Panel de pared', uk: 'Стінові панелі', ru: 'Стеновые панели', ti: 'ሽፋን መንደቕ', fa: 'تخته‌پوش دیوار', 'fa-AF': 'تخته‌پوش دیوار', ar: 'ألواح الجدار', rw: 'Imbaho zo ku rukuta' }),
  'furn.item.column': g('Porch column', { es: 'Columna del porche', cu: 'Columna del portal', uk: 'Колона ганку', ru: 'Колонна крыльца', ti: 'ዓንዲ በሪ', fa: 'ستون برنده', 'fa-AF': 'ستون برنده', ar: 'عمود الشرفة', rw: 'Inkingi y\'ibaraza' }),
  'furn.item.window-seat': g('Window seat', { es: 'Banco de ventana', cu: 'Banco de ventana', uk: 'Лавка біля вікна', ru: 'Скамья у окна', ti: 'መንበር መስኮት', fa: 'چوکی کنار پنجره', 'fa-AF': 'چوکی کنار پنجره', ar: 'مقعد النافذة', rw: 'Intebe yo ku idirishya' }),
  'furn.item.painting': g('Painting', { es: 'Cuadro', cu: 'Cuadro', uk: 'Картина', ru: 'Картина', ti: 'ስእሊ', fa: 'نقاشی', 'fa-AF': 'نقاشی', ar: 'لوحة', rw: 'Ishusho' }),
  'furn.cat.bath': g('Bath', { es: 'Baño', cu: 'Baño', uk: 'Ванна кімната', ru: 'Ванная', ti: 'ባኞ', fa: 'حمام', 'fa-AF': 'حمام', ar: 'حمام', rw: 'Ubwogero' }),
  'furn.cat.bedroom': g('Bedroom', { es: 'Dormitorio', cu: 'Dormitorio', uk: 'Спальня', ru: 'Спальня', ti: 'መደቀሲ', fa: 'اتاق خواب', 'fa-AF': 'اتاق خواب', ar: 'غرفة النوم', rw: 'Icyumba cyo kuraramo' }),
  'furn.cat.dining': g('Dining', { es: 'Comedor', cu: 'Comedor', uk: 'Їдальня', ru: 'Столовая', ti: 'መመገቢ', fa: 'اتاق نان', 'fa-AF': 'اتاق نان', ar: 'غرفة الطعام', rw: 'Aho kurira' }),
  'furn.cat.entry': g('Entry', { es: 'Entrada', cu: 'Entrada', uk: 'Передпокій', ru: 'Прихожая', ti: 'መእተዊ', fa: 'دهلیز', 'fa-AF': 'دهلیز', ar: 'المدخل', rw: 'Ubwinjiriro' }),
  'furn.cat.kitchen': g('Kitchen', { es: 'Cocina', cu: 'Cocina', uk: 'Кухня', ru: 'Кухня', ti: 'ክሽነ', fa: 'آشپزخانه', 'fa-AF': 'آشپزخانه', ar: 'مطبخ', rw: 'Igikoni' }),
  'furn.cat.living': g('Living', { es: 'Sala', cu: 'Sala', uk: 'Вітальня', ru: 'Гостиная', ti: 'ሳሎን', fa: 'نشیمن', 'fa-AF': 'نشیمن', ar: 'غرفة الجلوس', rw: 'Uruganiriro' }),
  'furn.cat.office': g('Office', { es: 'Oficina', cu: 'Oficina', uk: 'Кабінет', ru: 'Кабинет', ti: 'ቤት ጽሕፈት', fa: 'دفتر', 'fa-AF': 'دفتر', ar: 'مكتب', rw: 'Biro' }),
  'furn.cat.storage': g('Storage', { es: 'Almacén', cu: 'Almacén', uk: 'Комора', ru: 'Кладовая', ti: 'መኽዘን', fa: 'گدام', 'fa-AF': 'گدام', ar: 'تخزين', rw: 'Ububiko' }),
  'furn.cat.utility': g('Utility', { es: 'Lavandería', cu: 'Lavandería', uk: 'Господарська', ru: 'Подсобка', ti: 'ክፍሊ ኣገልግሎት', fa: 'اتاق خدمات', 'fa-AF': 'اتاق خدمات', ar: 'غرفة الخدمات', rw: 'Aho kumesera' }),
  'furn.title': g('Furniture', { es: 'Muebles', cu: 'Muebles', uk: 'Меблі', ru: 'Мебель', ti: 'ኣቓሑት', fa: 'مبلمان', 'fa-AF': 'مبلمان', ar: 'أثاث', rw: 'Ibikoresho' }),
  'furn.aria': g('Furniture catalog', { es: 'Catálogo de muebles', cu: 'Catálogo de muebles', uk: 'Каталог меблів', ru: 'Каталог мебели', ti: 'ዝርዝር ኣቓሑት', fa: 'فهرست مبلمان', 'fa-AF': 'فهرست مبلمان', ar: 'قائمة الأثاث', rw: 'Urutonde rw\'ibikoresho' }),
  'furn.hint.place': g('Click an item, then click the plan — or drag onto the canvas.', { es: 'Clic en un objeto, luego clic en el plano — o arrástralo al lienzo.', cu: 'Toca un objeto, luego toca el plano — o arrástralo al lienzo.', uk: 'Клікни предмет, потім клікни план — або перетягни на полотно.', ru: 'Кликни предмет, потом кликни план — или перетащи на холст.', ti: 'ሓደ ኣቕሓ ጠውቕ፣ ድሕሪኡ ኣብ ትልሚ ጠውቕ — ወይ ናብ ገጽ ስሓብ.', fa: 'یک چیز را کلیک کن، بعد روی پلان کلیک کن — یا آن را روی صفحه بکش.', 'fa-AF': 'یک چیز را کلیک کن، بعد روی پلان کلیک کن — یا آن را روی صفحه بکش.', ar: 'اضغط على قطعة، ثم اضغط على المخطط — أو اسحبها إلى اللوحة.', rw: 'Kanda ku kintu, hanyuma ukande ku gishushanyo — cyangwa ugikurure ku rupapuro.' }),
  'furn.hint.pick': g('Pick an item to switch to Furniture.', { es: 'Elige un objeto para cambiar a Muebles.', cu: 'Escoge un objeto para cambiar a Muebles.', uk: 'Обери предмет, щоб перейти до Меблів.', ru: 'Выбери предмет, чтобы перейти к Мебели.', ti: 'ናብ ኣቓሑት ንምቕያር ሓደ ኣቕሓ ምረጽ.', fa: 'یک چیز را برگزین تا به مبلمان بروی.', 'fa-AF': 'یک چیز را برگزین تا به مبلمان بروی.', ar: 'اختر قطعة للانتقال إلى الأثاث.', rw: 'Hitamo ikintu ujye mu Bikoresho.' }),
  'furn.hideTitle': g('Hide catalog — grid stays full', { es: 'Oculta el catálogo — la cuadrícula queda completa', cu: 'Esconde el catálogo — la cuadrícula queda completa', uk: 'Сховай каталог — сітка лишається повною', ru: 'Спрячь каталог — сетка остаётся полной', ti: 'ዝርዝር ሓብኦ — መርበብ ምሉእ ይጸንሕ', fa: 'فهرست را پنهان کن — شبکه کامل می‌ماند', 'fa-AF': 'فهرست را پنهان کن — شبکه کامل می‌ماند', ar: 'أخفِ القائمة — تبقى الشبكة كاملة', rw: 'Hisha urutonde — urusobe rugumaho rwose' }),
  'obj.width': g('Width', { es: 'Ancho', cu: 'Ancho', uk: 'Ширина', ru: 'Ширина', ti: 'ስፍሓት', fa: 'پهنا', 'fa-AF': 'پهنا', ar: 'العرض', rw: 'Ubugari' }),
  'obj.depth': g('Depth', { es: 'Fondo', cu: 'Fondo', uk: 'Глибина', ru: 'Глубина', ti: 'ዕምቆት', fa: 'عمق', 'fa-AF': 'عمق', ar: 'العمق', rw: 'Ubujyakuzimu' }),
  'obj.angle': g('Angle °', { es: 'Ángulo °', cu: 'Ángulo °', uk: 'Кут °', ru: 'Угол °', ti: 'ኩርናዕ °', fa: 'زاویه °', 'fa-AF': 'زاویه °', ar: 'الزاوية °', rw: 'Inguni °' }),
  'obj.rotate': g('Rotate', { es: 'Girar', cu: 'Girar', uk: 'Оберни', ru: 'Поверни', ti: 'ኣዙር', fa: 'چرخ بده', 'fa-AF': 'چرخ بده', ar: 'دوّر', rw: 'Zunguruka' }),
  'obj.paint': g('Paint', { es: 'Pintar', cu: 'Pintar', uk: 'Фарба', ru: 'Краска', ti: 'ሕብሪ', fa: 'رنگ', 'fa-AF': 'رنگ', ar: 'لوّن', rw: 'Irangi' }),
  'obj.dragMove': g('Drag to move', { es: 'Arrastra para mover', cu: 'Arrastra para mover', uk: 'Тягни, щоб посунути', ru: 'Тяни, чтобы сдвинуть', ti: 'ንምንቅስቓስ ስሓብ', fa: 'بکش تا جابه‌جا شود', 'fa-AF': 'بکش تا جابه‌جا شود', ar: 'اسحب لتحرّك', rw: 'Kurura ukimure' }),
  'obj.delete': g('Delete', { es: 'Borrar', cu: 'Borrar', uk: 'Видали', ru: 'Удали', ti: 'ደምስስ', fa: 'پاک کن', 'fa-AF': 'پاک کن', ar: 'احذف', rw: 'Siba' }),
  'paint.natural': g('Natural', { es: 'Natural', cu: 'Natural', uk: 'Природний', ru: 'Натуральный', ti: 'ናይ ዕንጨይቲ', fa: 'چوبی', 'fa-AF': 'چوبی', ar: 'طبيعي', rw: 'Kamere' }),
  'paint.white': g('White', { es: 'Blanco', cu: 'Blanco', uk: 'Білий', ru: 'Белый', ti: 'ጻዕዳ', fa: 'سفید', 'fa-AF': 'سفید', ar: 'أبيض', rw: 'Umweru' }),
  'paint.cream': g('Cream', { es: 'Crema', cu: 'Crema', uk: 'Кремовий', ru: 'Кремовый', ti: 'ክሬም', fa: 'کریمی', 'fa-AF': 'کریمی', ar: 'كريمي', rw: 'Kirimu' }),
  'paint.navy': g('Navy', { es: 'Azul marino', cu: 'Azul oscuro', uk: 'Темно-синій', ru: 'Тёмно-синий', ti: 'ጸሊም ሰማያዊ', fa: 'سرمه‌ای', 'fa-AF': 'سرمه‌ای', ar: 'كحلي', rw: 'Ubururu bwijimye' }),
  'paint.forest': g('Forest', { es: 'Verde bosque', cu: 'Verde oscuro', uk: 'Темно-зелений', ru: 'Тёмно-зелёный', ti: 'ጸሊም ቀጠልያ', fa: 'سبز تیره', 'fa-AF': 'سبز تیره', ar: 'أخضر غامق', rw: 'Icyatsi kibisi cyijimye' }),
  'paint.blush': g('Blush', { es: 'Rosa', cu: 'Rosado', uk: 'Рожевий', ru: 'Розовый', ti: 'ሮዛ', fa: 'گلابی', 'fa-AF': 'گلابی', ar: 'وردي', rw: 'Iroza' }),
  'paint.sun': g('Sun', { es: 'Amarillo', cu: 'Amarillo', uk: 'Жовтий', ru: 'Жёлтый', ti: 'ብጫ', fa: 'زرد', 'fa-AF': 'زرد', ar: 'أصفر', rw: 'Umuhondo' }),
  'paint.sky': g('Sky', { es: 'Celeste', cu: 'Azul claro', uk: 'Блакитний', ru: 'Голубой', ti: 'ሰማያዊ', fa: 'آبی آسمانی', 'fa-AF': 'آبی آسمانی', ar: 'أزرق فاتح', rw: 'Ubururu bw\'ijuru' }),
  'paint.charcoal': g('Charcoal', { es: 'Gris oscuro', cu: 'Gris oscuro', uk: 'Графітовий', ru: 'Графитовый', ti: 'ሓሙኽሽቲ', fa: 'خاکستری تیره', 'fa-AF': 'خاکستری تیره', ar: 'رمادي غامق', rw: 'Ikijuju cyijimye' }),
  'paint.terra': g('Clay', { es: 'Terracota', cu: 'Terracota', uk: 'Теракотовий', ru: 'Терракотовый', ti: 'ሕብሪ ጭቃ', fa: 'خشتی', 'fa-AF': 'خشتی', ar: 'طيني', rw: 'Ibara ry\'ibumba' }),
  'paint.mint': g('Mint', { es: 'Menta', cu: 'Verde menta', uk: 'М\'ятний', ru: 'Мятный', ti: 'ሕብሪ ናዕናዕ', fa: 'نعناعی', 'fa-AF': 'نعناعی', ar: 'نعناعي', rw: 'Icyatsi cyerurutse' }),
  'paint.plum': g('Plum', { es: 'Ciruela', cu: 'Morado', uk: 'Сливовий', ru: 'Сливовый', ti: 'ሊላ', fa: 'بنفش', 'fa-AF': 'بنفش', ar: 'برقوقي', rw: 'Isine' }),
  // 2.13.19 — 2D tool panels, Rooms list, room types, wallpapers. ti, fa-AF and rw are UNCHECKED native copy.
  'obj.edit': g('Edit', { es: 'Editar', cu: 'Editar', uk: 'Змінити', ru: 'Изменить', ti: 'ኣርም', fa: 'ویرایش', 'fa-AF': 'ویرایش', ar: 'تعديل', rw: 'Hindura' }),
  'obj.editSel': g('Edit selection', { es: 'Editar selección', cu: 'Editar selección', uk: 'Змінити вибране', ru: 'Изменить выбранное', ti: 'ዝተመረጸ ኣርም', fa: 'ویرایش انتخاب‌شده', 'fa-AF': 'ویرایش انتخاب‌شده', ar: 'عدّل المحدَّد', rw: 'Hindura ibyatoranyijwe' }),
  'obj.openPanel': g('Open edit panel', { es: 'Abrir panel de edición', cu: 'Abrir panel de edición', uk: 'Відкрити панель змін', ru: 'Открыть панель правки', ti: 'ሰሌዳ ምርማም ክፈት', fa: 'صفحه ویرایش را باز کن', 'fa-AF': 'صفحه ویرایش را باز کن', ar: 'افتح لوحة التعديل', rw: 'Fungura igice cyo guhindura' }),
  'obj.collapse': g('Collapse', { es: 'Contraer', cu: 'Contraer', uk: 'Згорнути', ru: 'Свернуть', ti: 'ኣሕጽር', fa: 'جمع کن', 'fa-AF': 'جمع کن', ar: 'صغّر', rw: 'Gabanya' }),
  'obj.collapseAria': g('Collapse edit panel', { es: 'Contraer panel de edición', cu: 'Contraer panel de edición', uk: 'Згорнути панель змін', ru: 'Свернуть панель правки', ti: 'ሰሌዳ ምርማም ኣሕጽር', fa: 'صفحه ویرایش را جمع کن', 'fa-AF': 'صفحه ویرایش را جمع کن', ar: 'صغّر لوحة التعديل', rw: 'Gabanya igice cyo guhindura' }),
  'obj.close': g('Close', { es: 'Cerrar', cu: 'Cerrar', uk: 'Закрити', ru: 'Закрыть', ti: 'ዕጸው', fa: 'بستن', 'fa-AF': 'بستن', ar: 'إغلاق', rw: 'Funga' }),
  'obj.dogDoor': g('Baboo wants 12" or 18", then slide it off-center.', { es: 'Baboo quiere 12" o 18", luego muévela del centro.', cu: 'Baboo quiere 12" o 18", luego muévela del centro.', uk: 'Baboo хоче 12" або 18", потім зсунь від центру.', ru: 'Baboo хочет 12" или 18", потом сдвинь от центра.', ti: 'Baboo 12" ወይ 18" ይደሊ፣ ድሕሪኡ ካብ ማእከል ኣንቀሳቕስ።', fa: 'Baboo یک در 12" یا 18" می‌خواهد، بعد آن را از وسط کنار بکش.', 'fa-AF': 'Baboo یک در 12" یا 18" می‌خواهد، بعد آن را از وسط کنار بکش.', ar: 'Baboo يريد 12" أو 18"، ثم أبعده عن الوسط.', rw: 'Baboo ashaka 12" cyangwa 18", hanyuma urwimurire ku ruhande.' }),
  'obj.swingL': g('Swing L', { es: 'Izquierda', cu: 'Izquierda', uk: 'Ліві', ru: 'Левая', ti: 'ጸጋም', fa: 'چپ', 'fa-AF': 'چپ', ar: 'يسار', rw: 'Ibumoso' }),
  'obj.swingR': g('Swing R', { es: 'Derecha', cu: 'Derecha', uk: 'Праві', ru: 'Правая', ti: 'የማን', fa: 'راست', 'fa-AF': 'راست', ar: 'يمين', rw: 'Iburyo' }),
  'obj.slide': g('Slide', { es: 'Corrediza', cu: 'Corrediza', uk: 'Розсувні', ru: 'Раздвижная', ti: 'ተሳሓቢ', fa: 'کشویی', 'fa-AF': 'کشویی', ar: 'منزلق', rw: 'Runyerera' }),
  'obj.slideAlong': g('Slide along wall', { es: 'Mover por el muro', cu: 'Mover por la pared', uk: 'Посунути вздовж стіни', ru: 'Сдвинуть вдоль стены', ti: 'ኣብ መንደቕ ኣንቀሳቕስ', fa: 'در امتداد دیوار بکش', 'fa-AF': 'در امتداد دیوار بکش', ar: 'حرّكه على الجدار', rw: 'Imura ku rukuta' }),
  'obj.slideBack': g('Slide the other way', { es: 'Mover al otro lado', cu: 'Mover al otro lado', uk: 'Посунути в інший бік', ru: 'Сдвинуть в другую сторону', ti: 'ናብ ካልእ ወገን ኣንቀሳቕስ', fa: 'به طرف دیگر بکش', 'fa-AF': 'به طرف دیگر بکش', ar: 'حرّكه للجهة الأخرى', rw: 'Imura ku rundi ruhande' }),
  'obj.wide': g('{w} wide', { es: '{w} de ancho', cu: '{w} de ancho', uk: 'ширина {w}', ru: 'ширина {w}', ti: 'ስፍሓት {w}', fa: 'پهنا {w}', 'fa-AF': 'پهنا {w}', ar: 'العرض {w}', rw: 'ubugari {w}' }),
  'obj.outside': g('Outside', { es: 'Exterior', cu: 'Exterior', uk: 'Зовнішня', ru: 'Наружная', ti: 'ናይ ደገ', fa: 'بیرونی', 'fa-AF': 'بیرونی', ar: 'خارجي', rw: 'Inyuma' }),
  'obj.inside': g('Inside', { es: 'Interior', cu: 'Interior', uk: 'Внутрішня', ru: 'Внутренняя', ti: 'ናይ ውሽጢ', fa: 'داخلی', 'fa-AF': 'داخلی', ar: 'داخلي', rw: 'Imbere' }),
  'obj.length': g('Length', { es: 'Largo', cu: 'Largo', uk: 'Довжина', ru: 'Длина', ti: 'ንውሓት', fa: 'طول', 'fa-AF': 'طول', ar: 'الطول', rw: 'Uburebure' }),
  'obj.thick': g('Thick', { es: 'Grosor', cu: 'Grosor', uk: 'Товщина', ru: 'Толщина', ti: 'ውፍረት', fa: 'ضخامت', 'fa-AF': 'ضخامت', ar: 'السُّمك', rw: 'Ubunini' }),
  'obj.stretch': g('Drag the squares on the ends to stretch', { es: 'Arrastra los cuadros de los extremos para estirar', cu: 'Arrastra los cuadros de los extremos para estirar', uk: 'Тягни квадрати на кінцях, щоб розтягнути', ru: 'Тяни квадраты на концах, чтобы растянуть', ti: 'ንምንዋሕ ነቶም ኣብ ጫፍ ዘለዉ ትርብዑ ስሓብ', fa: 'مربع‌های دو سر را بکش تا دراز شود', 'fa-AF': 'مربع‌های دو سر را بکش تا دراز شود', ar: 'اسحب المربعات على الطرفين لتمدّ', rw: 'Kurura udukaro two ku mpera urambure' }),
  'obj.wallpaper': g('Wallpaper', { es: 'Papel tapiz', cu: 'Papel de pared', uk: 'Шпалери', ru: 'Обои', ti: 'ወረቐት መንደቕ', fa: 'کاغذ دیواری', 'fa-AF': 'کاغذ دیواری', ar: 'ورق الجدران', rw: 'Impapuro zo ku rukuta' }),
  'obj.name': g('Name', { es: 'Nombre', cu: 'Nombre', uk: 'Назва', ru: 'Название', ti: 'ስም', fa: 'نام', 'fa-AF': 'نام', ar: 'الاسم', rw: 'Izina' }),
  'obj.type': g('Type', { es: 'Tipo', cu: 'Tipo', uk: 'Тип', ru: 'Тип', ti: 'ዓይነት', fa: 'نوع', 'fa-AF': 'نوع', ar: 'النوع', rw: 'Ubwoko' }),
  'obj.roomName': g('Room name', { es: 'Nombre del cuarto', cu: 'Nombre del cuarto', uk: 'Назва кімнати', ru: 'Название комнаты', ti: 'ስም ክፍሊ', fa: 'نام اتاق', 'fa-AF': 'نام اتاق', ar: 'اسم الغرفة', rw: 'Izina ry\'icyumba' }),
  'obj.openArea': g('Open — close walls to measure', { es: 'Abierto — cierra los muros para medir', cu: 'Abierto — cierra las paredes para medir', uk: 'Відкрито — замкни стіни, щоб виміряти', ru: 'Открыто — замкни стены, чтобы измерить', ti: 'ክፉት — ንምዕቃን መናድቕ ዕጸው', fa: 'باز — دیوارها را ببند تا اندازه شود', 'fa-AF': 'باز — دیوارها را ببند تا اندازه شود', ar: 'مفتوح — أغلق الجدران لتقيس', rw: 'Birafunguye — funga inkuta ubone gupima' }),
  'obj.house': g('House', { es: 'Casa', cu: 'Casa', uk: 'Будинок', ru: 'Дом', ti: 'ገዛ', fa: 'خانه', 'fa-AF': 'خانه', ar: 'البيت', rw: 'Inzu' }),
  'obj.sameFloor': g('Same floor in every {room}', { es: 'Mismo piso en cada {room}', cu: 'Mismo piso en cada {room}', uk: 'Ця підлога в усіх: {room}', ru: 'Этот пол во всех: {room}', ti: 'እዚ ወለል ኣብ ኩሉ {room}', fa: 'همین کف در هر {room}', 'fa-AF': 'همین کف در هر {room}', ar: 'نفس الأرضية لكل: {room}', rw: 'Hasura imwe mu byumba byose: {room}' }),
  'obj.roomCounts': g('{w} walls · {e} outside · {d} doors · {n} windows · {f} inside', { es: '{w} muros · {e} exteriores · {d} puertas · {n} ventanas · {f} muebles', cu: '{w} paredes · {e} exteriores · {d} puertas · {n} ventanas · {f} muebles', uk: 'Стін: {w} · зовнішніх: {e} · дверей: {d} · вікон: {n} · меблів: {f}', ru: 'Стен: {w} · наружных: {e} · дверей: {d} · окон: {n} · мебели: {f}', ti: '{w} መናድቕ · {e} ናይ ደገ · {d} ማዕጾታት · {n} መሳኹቲ · {f} ኣቓሑት', fa: '{w} دیوار · {e} بیرونی · {d} در · {n} پنجره · {f} مبلمان', 'fa-AF': '{w} دیوار · {e} بیرونی · {d} در · {n} پنجره · {f} مبلمان', ar: 'جدران: {w} · خارجية: {e} · أبواب: {d} · شبابيك: {n} · أثاث: {f}', rw: 'Inkuta: {w} · iz\'inyuma: {e} · inzugi: {d} · amadirishya: {n} · ibikoresho: {f}' }),
  'obj.extWalls': g('Outside walls', { es: 'Muros exteriores', cu: 'Paredes exteriores', uk: 'Зовнішні стіни', ru: 'Наружные стены', ti: 'መናድቕ ደገ', fa: 'دیوارهای بیرونی', 'fa-AF': 'دیوارهای بیرونی', ar: 'جدران خارجية', rw: 'Inkuta z\'inyuma' }),
  'obj.intWalls': g('Inside walls', { es: 'Muros interiores', cu: 'Paredes interiores', uk: 'Внутрішні стіни', ru: 'Внутренние стены', ti: 'መናድቕ ውሽጢ', fa: 'دیوارهای داخلی', 'fa-AF': 'دیوارهای داخلی', ar: 'جدران داخلية', rw: 'Inkuta z\'imbere' }),
  'obj.text': g('Text', { es: 'Texto', cu: 'Texto', uk: 'Текст', ru: 'Текст', ti: 'ጽሑፍ', fa: 'متن', 'fa-AF': 'متن', ar: 'النص', rw: 'Inyandiko' }),
  'obj.noteText': g('Note text', { es: 'Texto de la nota', cu: 'Texto de la nota', uk: 'Текст нотатки', ru: 'Текст заметки', ti: 'ጽሑፍ መዘኻኸሪ', fa: 'متن یادداشت', 'fa-AF': 'متن یادداشت', ar: 'نص الملاحظة', rw: 'Inyandiko y\'icyitonderwa' }),
  'obj.sizeLead': g('{len} · drag to move the label', { es: '{len} · arrastra para mover la etiqueta', cu: '{len} · arrastra para mover la etiqueta', uk: '{len} · тягни, щоб посунути напис', ru: '{len} · тяни, чтобы сдвинуть надпись', ti: '{len} · ነቲ ምልክት ንምንቅስቓስ ስሓብ', fa: '{len} · بکش تا برچسب جابه‌جا شود', 'fa-AF': '{len} · بکش تا برچسب جابه‌جا شود', ar: '{len} · اسحب لتحرّك العلامة', rw: '{len} · kurura wimure ikimenyetso' }),
  'obj.sketchLead': g('Pencil underlay · drag to move', { es: 'Boceto de lápiz debajo · arrastra para mover', cu: 'Boceto de lápiz debajo · arrastra para mover', uk: 'Підкладка олівцем · тягни, щоб посунути', ru: 'Подложка карандашом · тяни, чтобы сдвинуть', ti: 'ስእሊ ብርዒ ኣብ ታሕቲ · ንምንቅስቓስ ስሓብ', fa: 'طرح مدادی زیرین · بکش تا جابه‌جا شود', 'fa-AF': 'طرح مدادی زیرین · بکش تا جابه‌جا شود', ar: 'رسم بالقلم في الخلفية · اسحب لتحرّك', rw: 'Igishushanyo cy\'ikaramu munsi · kurura ukimure' }),
  'obj.trace': g('Trace to walls', { es: 'Trazar muros', cu: 'Trazar paredes', uk: 'Обвести в стіни', ru: 'Обвести в стены', ti: 'ናብ መናድቕ ቀጥታ', fa: 'خط‌کشی به دیوار', 'fa-AF': 'خط‌کشی به دیوار', ar: 'تتبّع إلى جدران', rw: 'Kurikira ukore inkuta' }),
  'rooms.title': g('Rooms', { es: 'Cuartos', cu: 'Cuartos', uk: 'Кімнати', ru: 'Комнаты', ti: 'ክፍልታት', fa: 'اتاق‌ها', 'fa-AF': 'اتاق‌ها', ar: 'الغرف', rw: 'Ibyumba' }),
  'rooms.aria': g('Room types', { es: 'Tipos de cuarto', cu: 'Tipos de cuarto', uk: 'Типи кімнат', ru: 'Типы комнат', ti: 'ዓይነታት ክፍሊ', fa: 'نوع‌های اتاق', 'fa-AF': 'نوع‌های اتاق', ar: 'أنواع الغرف', rw: 'Ubwoko bw\'ibyumba' }),
  'rooms.hideTitle': g('Hide list — grid stays full', { es: 'Ocultar lista — la cuadrícula queda completa', cu: 'Esconder lista — la cuadrícula queda completa', uk: 'Сховати список — сітка лишається повною', ru: 'Скрыть список — сетка остаётся полной', ti: 'ዝርዝር ሓብእ — እቲ መርበብ ምሉእ ይተርፍ', fa: 'فهرست را پنهان کن — شبکه کامل می‌ماند', 'fa-AF': 'فهرست را پنهان کن — شبکه کامل می‌ماند', ar: 'أخفِ القائمة — تبقى الشبكة كاملة', rw: 'Hisha urutonde — urusobe rugume rwose' }),
  'rooms.lead': g('Pick a type, then click inside walls that close. Draw an interior wall to split rooms.', { es: 'Elige un tipo, luego clic dentro de muros cerrados. Dibuja un muro interior para dividir cuartos.', cu: 'Escoge un tipo, luego toca dentro de paredes cerradas. Dibuja una pared interior para dividir cuartos.', uk: 'Обери тип, потім клікни всередині замкнених стін. Намалюй внутрішню стіну, щоб поділити кімнати.', ru: 'Выбери тип, потом кликни внутри замкнутых стен. Нарисуй внутреннюю стену, чтобы разделить комнаты.', ti: 'ዓይነት ምረጽ፣ ድሕሪኡ ኣብ ውሽጢ ዝተዓጽዉ መናድቕ ጠውቕ። ክፍልታት ንምምቃል መንደቕ ውሽጢ ስኣል።', fa: 'یک نوع برگزین، بعد داخل دیوارهای بسته کلیک کن. برای جدا کردن اتاق‌ها یک دیوار داخلی بکش.', 'fa-AF': 'یک نوع برگزین، بعد داخل دیوارهای بسته کلیک کن. برای جدا کردن اتاق‌ها یک دیوار داخلی بکش.', ar: 'اختر نوعاً، ثم اضغط داخل جدران مغلقة. ارسم جداراً داخلياً لتقسم الغرف.', rw: 'Hitamo ubwoko, hanyuma ukande imbere y\'inkuta zifunze. Shushanya urukuta rw\'imbere ugabanye ibyumba.' }),
  'rooms.nameThis': g('Name this room', { es: 'Ponle nombre al cuarto', cu: 'Ponle nombre al cuarto', uk: 'Назви цю кімнату', ru: 'Назови эту комнату', ti: 'ነዚ ክፍሊ ስም ሃቦ', fa: 'به این اتاق نام بده', 'fa-AF': 'به این اتاق نام بده', ar: 'سمِّ هذه الغرفة', rw: 'Ita iki cyumba izina' }),
  'rooms.openSpace': g('Open space — close the walls to measure', { es: 'Espacio abierto — cierra los muros para medir', cu: 'Espacio abierto — cierra las paredes para medir', uk: 'Відкритий простір — замкни стіни, щоб виміряти', ru: 'Открытое место — замкни стены, чтобы измерить', ti: 'ክፉት ቦታ — ንምዕቃን መናድቕ ዕጸው', fa: 'جای باز — دیوارها را ببند تا اندازه شود', 'fa-AF': 'جای باز — دیوارها را ببند تا اندازه شود', ar: 'مكان مفتوح — أغلق الجدران لتقيس', rw: 'Ahantu hafunguye — funga inkuta ubone gupima' }),
  'room.kind.entry': g('Entry', { es: 'Entrada', cu: 'Entrada', uk: 'Передпокій', ru: 'Прихожая', ti: 'መእተዊ', fa: 'دهلیز', 'fa-AF': 'دهلیز', ar: 'المدخل', rw: 'Ubwinjiriro' }),
  'room.blurb.entry': g('Front door · first step in', { es: 'Puerta principal · primer paso adentro', cu: 'Puerta principal · primer paso adentro', uk: 'Вхідні двері · перший крок', ru: 'Входная дверь · первый шаг', ti: 'ቀንዲ ማዕጾ · ቀዳማይ ስጉምቲ ናብ ውሽጢ', fa: 'در ورودی · قدم اول به داخل', 'fa-AF': 'در ورودی · قدم اول به داخل', ar: 'الباب الأمامي · أول خطوة للداخل', rw: 'Urugi rw\'imbere · intambwe ya mbere' }),
  'room.kind.living': g('Living', { es: 'Sala', cu: 'Sala', uk: 'Вітальня', ru: 'Гостиная', ti: 'ሳሎን', fa: 'نشیمن', 'fa-AF': 'نشیمن', ar: 'غرفة الجلوس', rw: 'Uruganiriro' }),
  'room.blurb.living': g('Sit · gather · everyday', { es: 'Sentarse · reunirse · cada día', cu: 'Sentarse · reunirse · cada día', uk: 'Сидіти · збиратися · щодня', ru: 'Сидеть · собираться · каждый день', ti: 'ምቕማጥ · ምእካብ · መዓልታዊ', fa: 'نشستن · دور هم · هر روز', 'fa-AF': 'نشستن · دور هم · هر روز', ar: 'جلوس · تجمّع · كل يوم', rw: 'Kwicara · guhura · buri munsi' }),
  'room.kind.kitchen': g('Kitchen', { es: 'Cocina', cu: 'Cocina', uk: 'Кухня', ru: 'Кухня', ti: 'ክሽነ', fa: 'آشپزخانه', 'fa-AF': 'آشپزخانه', ar: 'مطبخ', rw: 'Igikoni' }),
  'room.blurb.kitchen': g('Sink · stove · fridge', { es: 'Fregadero · estufa · nevera', cu: 'Fregadero · fogón · refrigerador', uk: 'Мийка · плита · холодильник', ru: 'Мойка · плита · холодильник', ti: 'መሕጸቢ · ፎርኖ · ፍሪጅ', fa: 'ظرفشویی · داش · یخچال', 'fa-AF': 'ظرفشویی · داش · یخچال', ar: 'حوض · موقد · ثلاجة', rw: 'Igikarabiro · amashyiga · firigo' }),
  'room.kind.dining': g('Dining', { es: 'Comedor', cu: 'Comedor', uk: 'Їдальня', ru: 'Столовая', ti: 'መመገቢ', fa: 'اتاق نان', 'fa-AF': 'اتاق نان', ar: 'غرفة الطعام', rw: 'Aho kurira' }),
  'room.blurb.dining': g('Table · eat together', { es: 'Mesa · comer juntos', cu: 'Mesa · comer juntos', uk: 'Стіл · їсти разом', ru: 'Стол · есть вместе', ti: 'ጣውላ · ብሓባር ምብላዕ', fa: 'میز · با هم نان خوردن', 'fa-AF': 'میز · با هم نان خوردن', ar: 'طاولة · نأكل معاً', rw: 'Ameza · gusangira' }),
  'room.kind.bedroom': g('Bedroom', { es: 'Dormitorio', cu: 'Dormitorio', uk: 'Спальня', ru: 'Спальня', ti: 'መደቀሲ', fa: 'اتاق خواب', 'fa-AF': 'اتاق خواب', ar: 'غرفة النوم', rw: 'Icyumba cyo kuraramo' }),
  'room.blurb.bedroom': g('Sleep · quiet', { es: 'Dormir · silencio', cu: 'Dormir · silencio', uk: 'Сон · тиша', ru: 'Сон · тишина', ti: 'ድቃስ · ህድኣት', fa: 'خواب · آرام', 'fa-AF': 'خواب · آرام', ar: 'نوم · هدوء', rw: 'Kuryama · ituze' }),
  'room.kind.bath': g('Bath', { es: 'Baño', cu: 'Baño', uk: 'Ванна кімната', ru: 'Ванная', ti: 'ባኞ', fa: 'حمام', 'fa-AF': 'حمام', ar: 'حمام', rw: 'Ubwogero' }),
  'room.blurb.bath': g('Toilet · tub or shower', { es: 'Inodoro · bañera o ducha', cu: 'Taza · bañadera o ducha', uk: 'Унітаз · ванна або душ', ru: 'Унитаз · ванна или душ', ti: 'ሽቃቅ · ቫስካ ወይ ዱሽ', fa: 'تشناب · وان یا دوش', 'fa-AF': 'تشناب · وان یا دوش', ar: 'مرحاض · حوض أو دش', rw: 'Umusarani · ibase cyangwa dushe' }),
  'room.kind.office': g('Office', { es: 'Oficina', cu: 'Oficina', uk: 'Кабінет', ru: 'Кабинет', ti: 'ቤት ጽሕፈት', fa: 'دفتر', 'fa-AF': 'دفتر', ar: 'مكتب', rw: 'Biro' }),
  'room.blurb.office': g('Desk · homework', { es: 'Escritorio · tarea', cu: 'Buró · tarea', uk: 'Стіл · уроки', ru: 'Стол · уроки', ti: 'ጣውላ ጽሕፈት · ዕዮ ገዛ', fa: 'میز درس · کارخانگی', 'fa-AF': 'میز درس · کارخانگی', ar: 'مكتب · واجبات', rw: 'Ameza · imikoro yo mu rugo' }),
  'room.kind.utility': g('Utility', { es: 'Lavandería', cu: 'Lavandería', uk: 'Господарська', ru: 'Подсобка', ti: 'ክፍሊ ኣገልግሎት', fa: 'اتاق خدمات', 'fa-AF': 'اتاق خدمات', ar: 'غرفة الخدمات', rw: 'Aho kumesera' }),
  'room.blurb.utility': g('Washer · water heater', { es: 'Lavadora · calentador de agua', cu: 'Lavadora · calentador', uk: 'Пральна машина · бойлер', ru: 'Стиральная машина · бойлер', ti: 'መሕጸቢ ክዳን · መውዒ ማይ', fa: 'ماشین کالاشویی · گرم‌کن آب', 'fa-AF': 'ماشین کالاشویی · گرم‌کن آب', ar: 'غسالة · سخان ماء', rw: 'Imashini imesa · icyuma gishyushya amazi' }),
  'room.kind.storage': g('Storage', { es: 'Almacén', cu: 'Almacén', uk: 'Комора', ru: 'Кладовая', ti: 'መኽዘን', fa: 'گدام', 'fa-AF': 'گدام', ar: 'تخزين', rw: 'Ububiko' }),
  'room.blurb.storage': g('Closet · shelves', { es: 'Clóset · estantes', cu: 'Escaparate · estantes', uk: 'Шафа · полиці', ru: 'Шкаф · полки', ti: 'ኣርማድዮ · መደርደሪ', fa: 'الماری · رف‌ها', 'fa-AF': 'الماری · رف‌ها', ar: 'خزانة · رفوف', rw: 'Akabati · utubati' }),
  'room.kind.outdoor': g('Outdoor', { es: 'Afuera', cu: 'Afuera', uk: 'Двір', ru: 'Двор', ti: 'ደገ', fa: 'بیرون', 'fa-AF': 'بیرون', ar: 'في الخارج', rw: 'Hanze' }),
  'room.blurb.outdoor': g('Porch · yard', { es: 'Porche · patio', cu: 'Portal · patio', uk: 'Ґанок · двір', ru: 'Крыльцо · двор', ti: 'በረንዳ · ቀጽሪ', fa: 'برنده · حویلی', 'fa-AF': 'برنده · حویلی', ar: 'شرفة · فناء', rw: 'Ibaraza · igikari' }),
  'room.kind.other': g('Other', { es: 'Otro', cu: 'Otro', uk: 'Інше', ru: 'Другое', ti: 'ካልእ', fa: 'دیگر', 'fa-AF': 'دیگر', ar: 'أخرى', rw: 'Ikindi' }),
  'room.blurb.other': g('Name it yourself', { es: 'Ponle tú el nombre', cu: 'Ponle tú el nombre', uk: 'Назви сам', ru: 'Назови сам', ti: 'ባዕልኻ ስም ሃቦ', fa: 'خودت نام بگذار', 'fa-AF': 'خودت نام بگذار', ar: 'سمِّها بنفسك', rw: 'Yite izina ubwawe' }),
  'tex.pack.plain': g('Plain paint', { es: 'Pintura lisa', cu: 'Pintura lisa', uk: 'Проста фарба', ru: 'Простая краска', ti: 'ጥራሕ ሕብሪ', fa: 'رنگ ساده', 'fa-AF': 'رنگ ساده', ar: 'دهان عادي', rw: 'Irangi risanzwe' }),
  'tex.pack.christmas': g('Christmas', { es: 'Navidad', cu: 'Navidad', uk: 'Різдво', ru: 'Рождество', ti: 'ልደት', fa: 'کریسمس', 'fa-AF': 'کریسمس', ar: 'عيد الميلاد', rw: 'Noheli' }),
  'tex.pack.confetti': g('Confetti', { es: 'Confeti', cu: 'Confeti', uk: 'Конфеті', ru: 'Конфетти', ti: 'ኮንፈቲ', fa: 'کاغذریزه رنگه', 'fa-AF': 'کاغذریزه رنگه', ar: 'قصاصات ملونة', rw: 'Udupapuro tw\'amabara' }),
  'tex.pack.brick-joke': g('Brick joke', { es: 'Ladrillo chistoso', cu: 'Ladrillo chistoso', uk: 'Весела цегла', ru: 'Весёлый кирпич', ti: 'ዘስሕቕ እምኒ', fa: 'آجر خنده‌دار', 'fa-AF': 'آجر خنده‌دار', ar: 'طوب مضحك', rw: 'Amatafari asekeje' }),
  'tex.pack.starry': g('Starry', { es: 'Estrellado', cu: 'Estrellado', uk: 'Зорі', ru: 'Звёзды', ti: 'ከዋኽብቲ', fa: 'ستاره‌ها', 'fa-AF': 'ستاره‌ها', ar: 'نجوم', rw: 'Inyenyeri' }),
  'tex.pack.paw': g('Paw print', { es: 'Huellas de patas', cu: 'Huellitas', uk: 'Лапки', ru: 'Лапки', ti: 'ኣሰር እግሪ ከልቢ', fa: 'رد پنجه', 'fa-AF': 'رد پنجه', ar: 'آثار أقدام', rw: 'Ibirenge by\'imbwa' }),
  'tex.pack.linen': g('Linen', { es: 'Lino', cu: 'Lino', uk: 'Льон', ru: 'Лён', ti: 'ጨርቂ', fa: 'کتان', 'fa-AF': 'کتان', ar: 'كتان', rw: 'Igitambaro' }),
  'tex.pack.wainscot': g('Wainscot', { es: 'Zócalo', cu: 'Zócalo', uk: 'Нижні панелі', ru: 'Нижние панели', ti: 'ታሕተዋይ ሽፋን', fa: 'تخته‌پوش پایین', 'fa-AF': 'تخته‌پوش پایین', ar: 'ألواح سفلية', rw: 'Imbaho zo hasi' }),
  'tex.pack.subway': g('Subway tile', { es: 'Azulejo de metro', cu: 'Azulejo', uk: 'Плитка «кабанчик»', ru: 'Плитка «кабанчик»', ti: 'ታይል', fa: 'کاشی دیواری', 'fa-AF': 'کاشی دیواری', ar: 'بلاط مستطيل', rw: 'Amakaro' }),
  'tex.pack.plaster': g('Plaster', { es: 'Yeso', cu: 'Repello', uk: 'Штукатурка', ru: 'Штукатурка', ti: 'ልሽን', fa: 'گچ', 'fa-AF': 'گچ', ar: 'جص', rw: 'Isima' }),
  'tex.pack.wood-panel': g('Wood panel', { es: 'Panel de madera', cu: 'Panel de madera', uk: 'Дерев\'яні панелі', ru: 'Деревянные панели', ti: 'ሽፋን ዕንጨይቲ', fa: 'تخته چوبی', 'fa-AF': 'تخته چوبی', ar: 'ألواح خشب', rw: 'Imbaho' }),
  'tex.pack.grasscloth': g('Grasscloth', { es: 'Fibra natural', cu: 'Fibra natural', uk: 'Трав\'яні шпалери', ru: 'Травяные обои', ti: 'ሳዕሪ', fa: 'بافت علفی', 'fa-AF': 'بافت علفی', ar: 'نسيج عشبي', rw: 'Ibyatsi' }),
  'tex.pack.stripe': g('Stripe', { es: 'Rayas', cu: 'Rayas', uk: 'Смужки', ru: 'Полоски', ti: 'መስመራት', fa: 'راه‌راه', 'fa-AF': 'راه‌راه', ar: 'خطوط', rw: 'Imirongo' }),
  'tex.pack.dots': g('Dots', { es: 'Lunares', cu: 'Lunares', uk: 'Горошок', ru: 'Горошек', ti: 'ነጠብጣብ', fa: 'خال‌خال', 'fa-AF': 'خال‌خال', ar: 'نقاط', rw: 'Utudomo' }),
  'peek.lead': g('3D peek — the plan stays the drawing', { es: 'Vista 3D — el plano sigue siendo el dibujo', cu: 'Vista 3D — el plano sigue siendo el dibujo', uk: '3D-погляд — креслення лишається на плані', ru: '3D-просмотр — чертёж остаётся на плане', ti: '3D ምርኣይ — እቲ ስእሊ ኣብ ፕላን ይጸንሕ', fa: 'نگاه سه‌بعدی — نقشه همان نقاشی می‌ماند', 'fa-AF': 'نگاه سه‌بعدی — نقشه همان نقاشی می‌ماند', ar: 'لمحة ثلاثية الأبعاد — يبقى الرسم على المخطط', rw: 'Kureba muri 3D — igishushanyo kigumaho' }),
  'peek.aria': g('3D peek model', { es: 'Modelo para la vista 3D', cu: 'Modelo para la vista 3D', uk: 'Модель для 3D-погляду', ru: 'Модель для 3D-просмотра', ti: 'ሞዴል ንምርኣይ 3D', fa: 'مدل نگاه سه‌بعدی', 'fa-AF': 'مدل نگاه سه‌بعدی', ar: 'نموذج اللمحة ثلاثية الأبعاد', rw: 'Icyitegererezo cya 3D' }),
  'peek.miss': g('Peek did not load.', { es: 'La vista no cargó.', cu: 'La vista no cargó.', uk: 'Не вдалося завантажити.', ru: 'Не удалось загрузить.', ti: 'ኣይተጻዕነን።', fa: 'بارگذاری نشد.', 'fa-AF': 'بارگذاری نشد.', ar: 'لم يتم التحميل.', rw: 'Ntibyafunguye.' }),
  'peek.loading': g('Loading peek…', { es: 'Cargando vista…', cu: 'Cargando vista…', uk: 'Завантаження…', ru: 'Загрузка…', ti: 'ይጽዕን ኣሎ…', fa: 'در حال بارگذاری…', 'fa-AF': 'در حال بارگذاری…', ar: 'جارٍ التحميل…', rw: 'Birimo gufunguka…' }),
  // 2.13.21 — 3D camera and skill picker. ti, fa-AF and rw are UNCHECKED native copy.
  '3d.top': g('Top', { es: 'Arriba', cu: 'Arriba', uk: 'Згори', ru: 'Сверху', ti: 'ካብ ላዕሊ', fa: 'از بالا', 'fa-AF': 'از بالا', ar: 'من الأعلى', rw: 'Hejuru' }),
  '3d.front': g('Front', { es: 'Frente', cu: 'Frente', uk: 'Спереду', ru: 'Спереди', ti: 'ካብ ቅድሚት', fa: 'از پیش رو', 'fa-AF': 'از پیش رو', ar: 'من الأمام', rw: 'Imbere y\'inzu' }),
  '3d.turnL': g('Turn left', { es: 'Gira a la izquierda', cu: 'Gira a la izquierda', uk: 'Поверни ліворуч', ru: 'Поверни налево', ti: 'ናብ ጸጋም ተጠወ', fa: 'به چپ بچرخ', 'fa-AF': 'به چپ بچرخ', ar: 'استدر لليسار', rw: 'Hindukira ibumoso' }),
  '3d.turnR': g('Turn right', { es: 'Gira a la derecha', cu: 'Gira a la derecha', uk: 'Поверни праворуч', ru: 'Поверни направо', ti: 'ናብ የማን ተጠወ', fa: 'به راست بچرخ', 'fa-AF': 'به راست بچرخ', ar: 'استدر لليمين', rw: 'Hindukira iburyo' }),
  '3d.keys.walk': g('Arrow keys or W A S D: walk and turn', { es: 'Flechas o W A S D: caminar y girar', cu: 'Flechas o W A S D: caminar y girar', uk: 'Стрілки або W A S D: іти й повертати', ru: 'Стрелки или W A S D: идти и поворачивать', ti: 'ምልክታት ኣንፈት ወይ W A S D: ተጓዓዝን ተጠወን', fa: 'کلیدهای جهت یا W A S D: راه برو و بچرخ', 'fa-AF': 'کلیدهای جهت یا W A S D: راه برو و بچرخ', ar: 'الأسهم أو W A S D: امشِ واستدر', rw: 'Utwambi cyangwa W A S D: genda kandi uhindukire' }),
  '3d.keys.orbit': g('Arrow keys: turn · + and −: zoom', { es: 'Flechas: girar · + y −: zoom', cu: 'Flechas: girar · + y −: zoom', uk: 'Стрілки: повертати · + і −: масштаб', ru: 'Стрелки: поворачивать · + и −: масштаб', ti: 'ምልክታት ኣንፈት: ተጠወ · + ን −ን: ኣዕብን ኣንእስን', fa: 'کلیدهای جهت: بچرخ · + و −: بزرگ و کوچک', 'fa-AF': 'کلیدهای جهت: بچرخ · + و −: بزرگ و کوچک', ar: 'الأسهم: استدر · + و −: كبّر وصغّر', rw: 'Utwambi: hindukira · + na −: kuza no kugabanya' }),
  '3d.focus': g('Looking at what you picked', { es: 'Mirando lo que elegiste', cu: 'Mirando lo que escogiste', uk: 'Дивимось на те, що ти обрав', ru: 'Смотрим на то, что ты выбрал', ti: 'ነቲ ዝመረጽካዮ ንርኢ ኣለና', fa: 'به چیزی که انتخاب کردی نگاه می‌کنیم', 'fa-AF': 'به چیزی که انتخاب کردی نگاه می‌کنیم', ar: 'ننظر إلى ما اخترته', rw: 'Turareba ibyo wahisemo' }),
  'skill.uses': g('You can use', { es: 'Puedes usar', cu: 'Puedes usar', uk: 'Можна використати', ru: 'Можно использовать', ti: 'ክትጥቀመሉ ትኽእል', fa: 'می‌توانی استفاده کنی از', 'fa-AF': 'می‌توانی استفاده کنی از', ar: 'يمكنك استخدام', rw: 'Ushobora gukoresha' }),
  'skill.next': g('Next level adds', { es: 'El próximo nivel agrega', cu: 'El próximo nivel agrega', uk: 'Наступний рівень додає', ru: 'Следующий уровень добавляет', ti: 'ዝቕጽል ደረጃ ዝውስኾ', fa: 'سطح بعدی اضافه می‌کند', 'fa-AF': 'سطح بعدی اضافه می‌کند', ar: 'المستوى التالي يضيف', rw: 'Urwego rukurikira rwongeraho' }),
  'skill.all': g('You have every tool.', { es: 'Tienes todas las herramientas.', cu: 'Tienes todas las herramientas.', uk: 'У тебе є всі інструменти.', ru: 'У тебя есть все инструменты.', ti: 'ኩሎም መሳርሒታት ኣለዉኻ።', fa: 'همهٔ ابزارها را داری.', 'fa-AF': 'همهٔ ابزارها را داری.', ar: 'لديك كل الأدوات.', rw: 'Ufite ibikoresho byose.' }),
  'skill.help.novice': g('Extra tips. Sketch, walls, doors, and pan.', { es: 'Más consejos. Boceto, muros, puertas y mover.', cu: 'Más consejos. Boceto, paredes, puertas y mover.', uk: 'Більше підказок. Ескіз, стіни, двері й зсув.', ru: 'Больше подсказок. Эскиз, стены, двери и сдвиг.', ti: 'ተወሳኺ ምኽሪ። ስእሊ፣ መናድቕ፣ ማዕጾታትን ምንቅስቓስን።', fa: 'راهنمایی بیشتر. طرح، دیوار، در و جابه‌جا.', 'fa-AF': 'راهنمایی بیشتر. طرح، دیوار، در و جابه‌جا.', ar: 'نصائح إضافية. رسم، جدران، أبواب، وتحريك.', rw: 'Inama zindi. Gushushanya, inkuta, inzugi, no kwimura.' }),
  'skill.help.beginner': g('Adds windows, room names, and size labels, with a next-step coach.', { es: 'Agrega ventanas, nombres de cuartos y medidas, con un guía para el próximo paso.', cu: 'Agrega ventanas, nombres de cuartos y medidas, con un guía para el próximo paso.', uk: 'Додає вікна, назви кімнат і розміри, а ще помічника з наступним кроком.', ru: 'Добавляет окна, названия комнат и размеры, а ещё помощника со следующим шагом.', ti: 'መስኮታት፣ ኣስማት ክፍልታትን ዓቐናትን ይውስኽ፣ ምስ ሓጋዚ ንዝቕጽል ስጉምቲ።', fa: 'پنجره، نام اتاق و اندازه را اضافه می‌کند، با یک راهنما برای قدم بعدی.', 'fa-AF': 'پنجره، نام اتاق و اندازه را اضافه می‌کند، با یک راهنما برای قدم بعدی.', ar: 'يضيف النوافذ وأسماء الغرف والقياسات، مع مساعد للخطوة التالية.', rw: 'Yongeraho amadirishya, amazina y\'ibyumba n\'ibipimo, hamwe n\'umufasha w\'intambwe ikurikira.' }),
  'skill.help.moderate': g('Furniture and plants plus the usual tools. Tips stay quiet.', { es: 'Muebles y plantas, más las herramientas de siempre. Los consejos se callan.', cu: 'Muebles y plantas, más las herramientas de siempre. Los consejos se callan.', uk: 'Меблі й рослини та звичайні інструменти. Підказки мовчать.', ru: 'Мебель и растения плюс обычные инструменты. Подсказки молчат.', ti: 'ኣቓሑትን ተኽልታትን ምስ ልሙዳት መሳርሒታት። ምኽሪ ስቕ ይብል።', fa: 'مبلمان و گیاه، با ابزارهای همیشگی. راهنمایی‌ها خاموش می‌مانند.', 'fa-AF': 'مبلمان و گیاه، با ابزارهای همیشگی. راهنمایی‌ها خاموش می‌مانند.', ar: 'أثاث ونباتات مع الأدوات المعتادة. النصائح تبقى هادئة.', rw: 'Ibikoresho byo mu nzu n\'ibimera, hamwe n\'ibikoresho bisanzwe. Inama ziraceceka.' }),
  'skill.help.expert': g('Interior walls, duplicate, rotate, layers. Chrome stays out of the way.', { es: 'Muros interiores, copiar, girar, capas. Los botones y paneles no estorban.', cu: 'Paredes interiores, copiar, girar, capas. Los botones y paneles no molestan.', uk: 'Внутрішні стіни, копія, поворот, шари. Кнопки й панелі не заважають.', ru: 'Внутренние стены, копия, поворот, слои. Кнопки и панели не мешают.', ti: 'መናድቕ ውሽጢ፣ ቅዳሕ፣ ምዝዋር፣ ደርቢታት። መጠወቒታትን መቓናትን ኣይዕንቅፉን።', fa: 'دیوارهای داخلی، کپی، چرخش، لایه‌ها. دکمه‌ها و پنل‌ها مزاحم نمی‌شوند.', 'fa-AF': 'دیوارهای داخلی، کپی، چرخش، لایه‌ها. دکمه‌ها و پنل‌ها مزاحم نمی‌شوند.', ar: 'جدران داخلية، نسخ، تدوير، طبقات. الأزرار واللوحات لا تزعجك.', rw: 'Inkuta z\'imbere, gukoporora, kuzunguruka, ibice. Utubuto n\'imbaho ntibikubangamira.' }),
};

for (const [key, extra] of Object.entries(HUB_EXTRA)) {
  if (!STR[key]) {
    const en = extra.en || key;
    STR[key] = g(en, {
      es: extra.es || en,
      cu: extra.cu || extra.es || en,
      uk: extra.uk || en,
      ru: extra.ru || en,
      ti: extra.ti || en,
      fa: extra.fa || en,
      simple: extra.simple,
      ar: extra.ar,
      rw: extra.rw,
      'fa-AF': extra['fa-AF'],
    });
  } else {
    Object.assign(STR[key], extra);
  }
}

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as string[]).includes(v);
}

export function asLocale(v: unknown): Locale {
  if (v === 'fa') return 'fa-AF';
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

const RTL_LOCALES = new Set<string>(LOCALE_OPTIONS.filter((o) => o.dir === 'rtl').map((o) => o.id));

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
  root.dir = opt.dir;
}

export function classicTheme(): boolean {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('theme') === 'classic' || q.get('hub') === 'classic') return true;
    if (localStorage.getItem('tech-room-hub') === 'classic') return true;
  } catch { /* ignore */ }
  return false;
}

/** Hub language on this door: ?lang= or the 7th field of #kp=. Null means keep the saved language. */
export function readHubLocale(): Locale | null {
  if (classicTheme()) return 'en';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q) return asLocale(q === 'fa' ? 'fa-AF' : q);
  } catch { /* ignore */ }
  try {
    const m = (location.hash || '').match(/(?:^#|&)kp=([^&]+)/);
    if (m) {
      const parts = decodeURIComponent(m[1]).split('.');
      if (parts.length >= 7 && parts[6]) return asLocale(parts[6]);
    }
  } catch { /* ignore */ }
  return null;
}

/** The default name every new plan gets; shown as "Untitled plan" in the student's language (2.13.55). */
export const DEFAULT_PLAN_TITLE = 'Untitled Plan';
export function isUnnamedPlan(title: string | null | undefined): boolean {
  return !title || !title.trim() || title === DEFAULT_PLAN_TITLE;
}
export function planTitle(title: string | null | undefined, locale: Locale | null | undefined): string {
  return isUnnamedPlan(title) ? t(locale, 'plan.untitled') : (title as string);
}

export function t(locale: Locale | null | undefined, key: string, vars?: Record<string, string>): string {
  const loc = asLocale(locale);
  const row = STR[key];
  let out = (row ? row[loc] || row.en : '') || key;
  if (!out) out = key;
  if (vars) {
    // 2.13.58: in right-to-left languages a filled-in value (a size like 1'-0", a number, a name) is set in a
    // Unicode first-strong isolate, so its characters keep their own order. Without it, Arabic and Dari
    // showed 1'-0" as "0-'1 with the inch mark flung to the far end of the line.
    const rtl = RTL_LOCALES.has(loc);
    if (rtl) out = isolateSizes(out);
    for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, rtl && v ? `\u2068${v}\u2069` : v);
    return out;
  }
  return RTL_LOCALES.has(loc) ? isolateSizes(out) : out;
}

/** Sizes written into right-to-left text (32", 3'-0", 12–18", 5') keep their own order (2.13.58). */
export function isolateSizes(s: string): string {
  return s.replace(/\d+'-\d+"|\d+(?:[–-]\d+)?"|\d+'(?!-)/g, (m) => `\u2068${m}\u2069`);
}

/** Plain text without the direction marks t() adds in right-to-left languages (for file names and tests). */
export function stripIsolates(s: string): string {
  return s.replace(/[\u2066-\u2069]/g, '');
}

const HUB_LANGS = new Set(['en', 'uk', 'ru', 'es', 'ar', 'fa-AF', 'rw', 'ti']);

/** Tell the Hub this language. Cubano and Simple stay inside Baboo. */
export function publishHubLocale(locale: Locale | null | undefined): void {
  const loc = asLocale(locale);
  if (!HUB_LANGS.has(loc)) return;
  const dir = loc === 'ar' || loc === 'fa-AF' ? 'rtl' : 'ltr';
  const prefs = (window as unknown as {
    KulibertPrefs?: { lang?: string; set?: (p: { lang: string }) => void; acceptLang?: (lang: string) => void };
  }).KulibertPrefs;
  try {
    if (prefs && typeof prefs.acceptLang === 'function') prefs.acceptLang(loc);
    else if (prefs && typeof prefs.set === 'function' && prefs.lang !== loc) prefs.set({ lang: loc });
  } catch { /* ignore */ }
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'kulibert-lang', lang: loc, dir }, '*');
    }
  } catch { /* ignore */ }
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
  if (loc === 'en' || loc === 'simple') return { en, home: null };
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
