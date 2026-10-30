import { useSeason } from '@usefaz/ui/components/seasonal/season-provider';
import { Button } from '@usefaz/ui/components/ui/button';
import { Sparkles } from 'lucide-react';

/** Turns the seasonal decorations on and off. Renders nothing outside commemorative dates. */
export function SeasonToggle({ className }: { className?: string }) {
  const { season, enabled, setEnabled } = useSeason();
  if (!season) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      // Fixed name + aria-pressed: "Decorações de Natal, pressionado" means they're on.
      aria-label={`Decorações de ${season.name}`}
      aria-pressed={enabled}
      onClick={() => setEnabled(!enabled)}
    >
      <Sparkles className={enabled ? 'text-primary' : 'opacity-60'} />
    </Button>
  );
}
