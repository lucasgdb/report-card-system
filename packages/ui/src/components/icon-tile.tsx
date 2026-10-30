import { cn } from '@usefaz/ui/lib/utils';

const toneClasses = {
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  teal: 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300',
  red: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
};

export type IconTileTone = keyof typeof toneClasses;

type IconTileProps = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: IconTileTone;
  className?: string;
};

/** Decorative icon on a soft tile of the same color. */
export function IconTile({ icon: Icon, tone, className }: IconTileProps) {
  return (
    <span
      data-slot="icon-tile"
      aria-hidden
      className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', toneClasses[tone], className)}
    >
      <Icon className="size-[18px]" strokeWidth={2.25} />
    </span>
  );
}
