import { SeasonAvatarAccessory } from '@usefaz/ui/components/seasonal/season-avatar-accessory';
import { cn } from '@usefaz/ui/lib/utils';

type SeasonIllustrationProps = Omit<React.ComponentProps<'img'>, 'width' | 'height'> & {
  width: number;
  height: number;
  /** The character's head as a square, in pixels of the image's intrinsic size; the accessory sits on it. */
  head: { x: number; y: number; size: number; rotate?: number };
};

/** Decorative illustration whose character wears the current season's accessory (Santa hat, witch hat…). */
export function SeasonIllustration({ width, height, head, className, alt = '', ...props }: SeasonIllustrationProps) {
  return (
    <div data-slot="season-illustration" className={cn('pointer-events-none w-full', className)}>
      <div className="relative">
        <img className="block h-auto w-full" width={width} height={height} alt={alt} {...props} />
        <div
          className="absolute aspect-square"
          style={{
            left: `${(head.x / width) * 100}%`,
            top: `${(head.y / height) * 100}%`,
            width: `${(head.size / width) * 100}%`,
            rotate: head.rotate ? `${head.rotate}deg` : undefined,
          }}
        >
          <SeasonAvatarAccessory />
        </div>
      </div>
    </div>
  );
}
