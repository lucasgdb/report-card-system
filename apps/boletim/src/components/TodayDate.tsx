import { cn } from '@usefaz/ui/lib/utils';

const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' });

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Today's date, e.g. "Qui., 30 de outubro" (computed on every render, so it never goes stale). */
export default function TodayDate({ className }: { className?: string }) {
  const today = new Date();
  const isoDate = today.toLocaleDateString('sv-SE');

  return (
    <time dateTime={isoDate} className={cn('text-base leading-[19px] font-normal text-(--text-main)', className)}>
      {capitalize(formatter.format(today))}
    </time>
  );
}
