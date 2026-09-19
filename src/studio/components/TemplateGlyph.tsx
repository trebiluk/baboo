/**
 * Plain-line house glyphs for the template cards.
 *
 * Picture first: a student who cannot read the blurb can still tell a Ranch
 * from a Yurt. Line art only — no new image assets, no colour meaning, and
 * everything inherits currentColor so Stark and high contrast both work.
 */

type Props = { styleId: string };

const BODY = 'M10 36 L10 20 L54 20 L54 36 Z';

function Glyph({ styleId }: Props) {
  switch (styleId) {
    case 'blank':
      return <rect x={11} y={13} width={42} height={23} rx={2} strokeDasharray="4 4" />;
    case 'colonial':
      return (
        <>
          <path d={BODY} />
          <path d="M6 20 L32 7 L58 20" />
          <path d="M28 36 L28 27 L36 27 L36 36" />
        </>
      );
    case 'arts-crafts':
      return (
        <>
          <path d={BODY} />
          <path d="M6 20 L32 9 L58 20" />
          <path d="M10 27 L54 27" />
          <path d="M18 27 L18 36 M46 27 L46 36" />
        </>
      );
    case 'greek-revival':
      return (
        <>
          <path d={BODY} />
          <path d="M6 20 L32 11 L58 20" />
          <path d="M18 20 L18 36 M28 20 L28 36 M36 20 L36 36 M46 20 L46 36" />
        </>
      );
    case 'hobbit':
      return (
        <>
          <path d="M8 36 A24 20 0 0 1 56 36 Z" />
          <circle cx={32} cy={31} r={6} />
          <path d="M14 22 q6 -4 12 0 M38 22 q6 -4 12 0" />
        </>
      );
    case 'ranch':
      return (
        <>
          <path d="M6 36 L6 22 L58 22 L58 36 Z" />
          <path d="M3 22 L32 13 L61 22" />
          <path d="M24 36 L24 28 L32 28 L32 36" />
        </>
      );
    case 'victorian':
      return (
        <>
          <path d="M12 36 L12 21 L52 21 L52 36 Z" />
          <path d="M12 21 L18 11 L46 11 L52 21" />
          <path d="M18 11 L24 6 L40 6 L46 11" />
          <path d="M28 36 L28 28 L36 28 L36 36" />
        </>
      );
    case 'cape-cod':
      return (
        <>
          <path d={BODY} />
          <path d="M8 20 L32 6 L56 20" />
          <path d="M24 15 L24 11 L30 11 L30 18" />
        </>
      );
    case 'modern':
      return (
        <>
          <path d="M10 36 L10 16 L54 16 L54 36 Z" />
          <path d="M6 16 L58 16" />
          <path d="M34 36 L34 24 L48 24 L48 36" />
        </>
      );
    case 'tudor':
      return (
        <>
          <path d={BODY} />
          <path d="M8 20 L26 6 L44 20" />
          <path d="M40 20 L50 12 L58 20" />
          <path d="M22 36 L22 27 L30 27 L30 36" />
        </>
      );
    case 'yurt':
      return (
        <>
          <path d="M14 36 L14 24 L50 24 L50 36 Z" />
          <path d="M8 24 L32 8 L56 24" />
          <path d="M26 36 L26 29 A6 6 0 0 1 38 29 L38 36" />
        </>
      );
    case 'tiny-home':
      return (
        <>
          <path d="M16 30 L16 18 L48 18 L48 30 Z" />
          <path d="M12 18 L32 9 L52 18" />
          <path d="M16 30 L48 30" />
          <circle cx={23} cy={34} r={4} />
          <circle cx={41} cy={34} r={4} />
        </>
      );
    case 'dog-house':
      return (
        <>
          <path d="M16 36 L16 22 L48 22 L48 36 Z" />
          <path d="M12 22 L32 10 L52 22" />
          <path d="M26 36 L26 29 A6 6 0 0 1 38 29 L38 36" />
        </>
      );
    default:
      return (
        <>
          <path d={BODY} />
          <path d="M6 20 L32 8 L58 20" />
        </>
      );
  }
}

export function TemplateGlyph({ styleId }: Props) {
  return (
    <svg
      className="template-glyph"
      viewBox="0 0 64 40"
      width={64}
      height={40}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Glyph styleId={styleId} />
    </svg>
  );
}
