import { useSeason } from '@usefaz/ui/components/seasonal/season-provider';
import type { SeasonId } from '@usefaz/ui/lib/seasons';

// Deterministic pseudo-random spread, so particles look natural but render the same every time.
const spread = (count: number, seed: number) =>
  Array.from({ length: count }, (_, i) => {
    const r = (n: number) => {
      const x = Math.sin((i + 1) * 9301 + seed * 49297 + n * 233) * 10000;
      return x - Math.floor(x);
    };
    return { i, x: r(1) * 100, delay: -r(2) * 16, duration: 9 + r(3) * 9, size: r(4), drift: (r(5) - 0.5) * 80 };
  });

type ParticleStyle = React.CSSProperties & Record<`--${string}`, string>;

const fallStyle = (p: ReturnType<typeof spread>[number], size: number): ParticleStyle => ({
  left: `${p.x}%`,
  width: size,
  height: size,
  animationDelay: `${p.delay}s`,
  animationDuration: `${p.duration}s`,
  '--drift': `${p.drift}px`,
  // Resting spot (percent from the top) when motion is reduced.
  '--rest': String(Math.round(p.size * 30)),
});

function Snow() {
  return (
    <>
      {spread(18, 1).map((p) => (
        <span
          key={p.i}
          className="season-fall absolute rounded-full bg-sky-100 shadow-[0_0_6px_rgba(56,116,203,0.35)] dark:bg-white"
          style={fallStyle(p, 5 + p.size * 7)}
        />
      ))}
    </>
  );
}

const CONFETTI_COLORS = ['#ee7844', '#0020a2', '#2a9d8f', '#e9c46a', '#e63946', '#9d4edd'];
const GOLD_COLORS = ['#e9c46a', '#fcbf49', '#adb5bd', '#f77f00'];

function Confetti({ colors, seed }: { colors: string[]; seed: number }) {
  return (
    <>
      {spread(16, seed).map((p) => (
        <span
          key={p.i}
          className="season-fall season-spin absolute rounded-[1px]"
          style={{ ...fallStyle(p, 6 + p.size * 4), height: 10 + p.size * 6, background: colors[p.i % colors.length] }}
        />
      ))}
    </>
  );
}

function GraduationCaps() {
  return (
    <>
      {spread(8, 3).map((p) => (
        <svg
          aria-hidden
          key={p.i}
          viewBox="0 0 40 30"
          className="season-fall absolute"
          style={fallStyle(p, 22 + p.size * 12)}
        >
          <path d="m20 4 18 7-18 7L2 11Z" fill="#14213d" />
          <path d="M11 14v7c0 3 18 3 18 0v-7l-9 4Z" fill="#1d2b53" />
          <path d="M20 11c8 1 12 3 12 6v7" stroke="#f77f00" strokeWidth="1.5" fill="none" />
        </svg>
      ))}
    </>
  );
}

/** A string of lights hanging along the top edge. */
function ChristmasLights() {
  const bulbs = Array.from({ length: 24 }, (_, i) => i);
  const colors = ['#e63946', '#fcbf49', '#2a9d8f', '#4361ee'];
  return (
    <svg aria-hidden className="absolute inset-x-0 top-0 h-7 w-full" viewBox="0 0 1200 28" preserveAspectRatio="none">
      <path
        d="M0 4Q25 16 50 4T100 4T150 4T200 4T250 4T300 4T350 4T400 4T450 4T500 4T550 4T600 4T650 4T700 4T750 4T800 4T850 4T900 4T950 4T1000 4T1050 4T1100 4T1150 4T1200 4"
        stroke="#2f3e46"
        strokeWidth="2"
        fill="none"
      />
      {bulbs.map((i) => (
        <g key={i} transform={`translate(${25 + i * 50} 11)`}>
          <rect x="-2.5" y="-2" width="5" height="4" fill="#2f3e46" />
          <ellipse
            className="season-blink"
            style={{ animationDelay: `${(i % 4) * 0.4}s` }}
            cx="0"
            cy="8"
            rx="5"
            ry="7"
            fill={colors[i % colors.length]}
          />
        </g>
      ))}
    </svg>
  );
}

/** Festa Junina / Independência bunting along the top edge. */
function Bunting({ colors }: { colors: string[] }) {
  const flags = Array.from({ length: 30 }, (_, i) => i);
  return (
    <svg
      aria-hidden
      className="season-sway absolute inset-x-0 top-0 h-8 w-full origin-top"
      viewBox="0 0 1200 32"
      preserveAspectRatio="none"
    >
      <path d="M0 3Q300 12 600 3T1200 3" stroke="#6c584c" strokeWidth="1.5" fill="none" />
      {flags.map((i) => {
        const x = i * 40 + 4;
        const y = 3 + Math.sin((x / 1200) * Math.PI * 2) * -4.5 + 4.5;
        return <path key={i} d={`M${x} ${y}h32l-16 24Z`} fill={colors[i % colors.length]} />;
      })}
    </svg>
  );
}

/** Spider web in the top-right corner, with a spider hanging from it. */
function SpiderWeb() {
  return (
    <div className="absolute top-0 right-0">
      <svg
        aria-hidden
        width="130"
        height="130"
        viewBox="0 0 130 130"
        fill="none"
        stroke="#adb5bd"
        strokeWidth="1.2"
        className="opacity-80"
      >
        <path d="M130 0 20 0M130 0 40 60M130 0 90 110M130 0 130 120M130 0 70 25" />
        <path d="M105 0q-4 10 2 18 6 6 15 4M80 0q-6 18 4 32 12 14 30 10 10 0 16 4M55 0q-8 28 8 48 18 22 46 18 12-2 21 6M30 0q-10 38 12 64 24 28 62 24 14-2 26 10" />
      </svg>
      <div className="season-dangle absolute top-0 right-[54px] flex flex-col items-center">
        <span className="h-10 w-px bg-[#adb5bd]" />
        <svg aria-hidden width="22" height="22" viewBox="0 0 22 22">
          <path
            d="M3 6 7 9M3 11h4M3 16l4-3M19 6l-4 3M19 11h-4M19 16l-4-3"
            stroke="#212529"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <ellipse cx="11" cy="12" rx="5" ry="6" fill="#212529" />
          <circle cx="11" cy="6" r="3.2" fill="#212529" />
        </svg>
      </div>
    </div>
  );
}

function Bats() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <svg
          aria-hidden
          key={i}
          viewBox="0 0 40 16"
          className="season-bat absolute w-9"
          style={{ top: `${8 + i * 7}%`, animationDelay: `${i * -7}s`, animationDuration: `${18 + i * 4}s` }}
        >
          <path
            d="M20 6c-2-3-4-3-5 0-3-3-8-4-15 0 5 0 7 3 8 6 2-2 4-2 6 0 1-2 3-3 6-3s5 1 6 3c2-2 4-2 6 0 1-3 3-6 8-6-7-4-12-3-15 0-1-3-3-3-5 0Z"
            fill="#212529"
          />
        </svg>
      ))}
    </>
  );
}

function EasterEggs() {
  const eggs = [
    { x: 8, fill: '#ffafcc', stripe: '#cdb4db', r: -12 },
    { x: 46, fill: '#bde0fe', stripe: '#a2d2ff', r: 8 },
    { x: 84, fill: '#fde68a', stripe: '#fca5a5', r: -4 },
  ];
  return (
    <svg aria-hidden className="season-wobble absolute bottom-0 left-2 w-32" viewBox="0 0 120 56">
      {eggs.map((egg) => (
        <g key={egg.x} transform={`rotate(${egg.r} ${egg.x + 14} 40)`}>
          <ellipse cx={egg.x + 14} cy="36" rx="14" ry="18" fill={egg.fill} />
          <path d={`M${egg.x + 1} 32q6-5 13 0t13 0`} stroke={egg.stripe} strokeWidth="3" fill="none" />
          <path d={`M${egg.x + 2} 42q6-5 12 0t12 0`} stroke="#fff" strokeWidth="2" fill="none" />
        </g>
      ))}
    </svg>
  );
}

const DECORATIONS: Record<SeasonId, () => React.ReactNode> = {
  'ano-novo': () => <Confetti colors={GOLD_COLORS} seed={7} />,
  carnaval: () => <Confetti colors={CONFETTI_COLORS} seed={11} />,
  pascoa: () => <EasterEggs />,
  'festa-junina': () => <Bunting colors={['#e63946', '#f4a261', '#2a9d8f', '#e9c46a', '#457b9d']} />,
  'dia-do-estudante': () => <GraduationCaps />,
  independencia: () => <Bunting colors={['#009c3b', '#ffdf00', '#002776']} />,
  halloween: () => (
    <>
      <SpiderWeb />
      <Bats />
    </>
  ),
  natal: () => (
    <>
      <ChristmasLights />
      <Snow />
    </>
  ),
};

/**
 * Decorative layer for commemorative dates. Purely visual: hidden from assistive technology, never
 * intercepts clicks, kept to the edges of the screen, and still when reduced motion is requested.
 */
export function SeasonDecorations() {
  const { season, enabled } = useSeason();
  if (!enabled || !season) {
    return null;
  }

  const Decoration = DECORATIONS[season.id];
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      data-slot="season-decorations"
      data-season={season.id}
    >
      <Decoration />
    </div>
  );
}
