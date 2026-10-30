import { useSeason } from '@usefaz/ui/components/seasonal/season-provider';
import { cn } from '@usefaz/ui/lib/utils';
import type { SeasonId } from '@usefaz/ui/lib/seasons';

type Accessory = {
  /** Drawn in a 120×80 box that sits on the avatar's top edge. */
  art: React.ReactNode;
  /** Position relative to the avatar box (percentages of its size). */
  style: React.CSSProperties;
};

const ACCESSORIES: Partial<Record<SeasonId, Accessory>> = {
  natal: {
    style: { left: '-12%', top: '-42%', width: '124%', rotate: '-12deg' },
    art: (
      <>
        <path d="M22 58C28 30 52 10 82 12c14 1 24 10 26 22-8-6-18-7-24-4 8 10 10 22 8 30Z" fill="#d62839" />
        <path d="M84 30c8 10 10 22 8 30H80c2-10 0-20-6-28Z" fill="#a4161a" opacity=".55" />
        <circle cx="108" cy="38" r="9" fill="#fff" />
        <circle cx="105" cy="35" r="3.5" fill="#e9ecef" />
        <rect x="12" y="52" width="88" height="20" rx="10" fill="#fff" />
        <path d="M18 66h76" stroke="#e9ecef" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  halloween: {
    style: { left: '-12%', top: '-44%', width: '124%', rotate: '-10deg' },
    art: (
      <>
        <path d="M60 2c6 12 12 28 24 46H36c10-14 16-26 16-36 0-6 4-10 8-10Z" fill="#3c1361" />
        <path d="M60 2c6 12 12 28 24 46H72C66 34 62 20 60 2Z" fill="#250b3d" />
        <path d="M38 44h44l2 8H36Z" fill="#f77f00" />
        <rect x="54" y="43" width="12" height="10" rx="2" fill="#fcbf49" />
        <rect x="57" y="46" width="6" height="4" rx="1" fill="#3c1361" />
        <ellipse cx="60" cy="56" rx="54" ry="10" fill="#3c1361" />
        <ellipse cx="60" cy="54" rx="40" ry="5" fill="#250b3d" />
      </>
    ),
  },
  pascoa: {
    style: { left: '-12%', top: '-48%', width: '124%' },
    art: (
      <>
        <path d="M36 62C22 40 22 6 36 4c12-2 14 32 12 58Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <path d="M38 56c-8-16-8-42-1-44 6 0 7 24 6 44Z" fill="#ffc2d1" />
        <path d="M72 62c-2-26 2-60 14-58 14 2 12 36-2 58Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <path d="M77 56c-1-20 2-44 8-44 6 2 5 28-3 44Z" fill="#ffc2d1" />
      </>
    ),
  },
  'festa-junina': {
    style: { left: '-12%', top: '-40%', width: '124%', rotate: '-8deg' },
    art: (
      <>
        <path d="M34 50c0-28 12-40 26-40s26 12 26 40Z" fill="#e9c46a" />
        <path d="M40 40h40M38 30h44M44 20h32" stroke="#c9a227" strokeWidth="2" />
        <path d="M34 44h52v8H34Z" fill="#e63946" />
        <circle cx="70" cy="48" r="3" fill="#fff" />
        <circle cx="48" cy="48" r="2" fill="#2a9d8f" />
        <rect x="66" y="22" width="9" height="9" fill="#2a9d8f" transform="rotate(12 70 26)" />
        <ellipse cx="60" cy="56" rx="56" ry="10" fill="#e9c46a" />
        <path d="M10 56q50 10 100 0" stroke="#c9a227" strokeWidth="2" fill="none" />
        <path d="m6 58-4 4m12 0-3 5m95-5 3 5m5-9 4 4" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  'dia-do-estudante': {
    style: { left: '-12%', top: '-38%', width: '124%', rotate: '-8deg' },
    art: (
      <>
        <path d="M38 34v18c0 6 44 6 44 0V34Z" fill="#1d2b53" />
        <path d="m60 14 52 18-52 18L8 32Z" fill="#14213d" />
        <path d="m60 14 52 18-52 18Z" fill="#1d2b53" opacity=".6" />
        <circle cx="60" cy="32" r="3" fill="#f77f00" />
        <path d="M60 32c20 2 36 6 38 14v16" stroke="#f77f00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M94 60h8l-1 12h-6Z" fill="#f77f00" />
      </>
    ),
  },
  'ano-novo': {
    style: { left: '6%', top: '-58%', width: '96%', rotate: '-18deg' },
    art: (
      <>
        <path d="m60 4 24 56H36Z" fill="#fcbf49" />
        <path d="M60 4 46 36h24ZM41 48h38l3 8H38Z" fill="#f77f00" opacity=".85" />
        <circle cx="60" cy="6" r="6" fill="#e63946" />
        <path d="M36 60h48" stroke="#0020a2" strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
};

type SeasonAvatarAccessoryProps = {
  className?: string;
};

/**
 * Seasonal accessory (Santa hat, witch hat…) drawn over an avatar. Place it inside the avatar's
 * positioned container; it overflows the top edge on purpose.
 */
export function SeasonAvatarAccessory({ className }: SeasonAvatarAccessoryProps) {
  const { season, enabled } = useSeason();
  const accessory = enabled && season ? ACCESSORIES[season.id] : undefined;
  if (!accessory) {
    return null;
  }

  return (
    <svg
      data-slot="season-avatar-accessory"
      data-season={season.id}
      aria-hidden
      viewBox="0 0 120 80"
      className={cn('pointer-events-none absolute overflow-visible drop-shadow-sm', className)}
      style={{ ...accessory.style, transformOrigin: '50% 100%' }}
    >
      {accessory.art}
    </svg>
  );
}
