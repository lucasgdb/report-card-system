import { useMediaQuery } from '@usefaz/ui/hooks/use-media-query';
import { cn } from '@usefaz/ui/lib/utils';

/** A point and width on the 1440×810 desktop artboard. */
type ArtboardBox = { x: number; y: number; width: number };

type AuthLayoutProps = {
  /** Brand logo (usually a link to the login); desktop only. Its image fills the given width. */
  logo: React.ReactNode;
  /** Decorative illustration beside the blue panel; desktop only. */
  illustration: React.ReactNode;
  /** Where the illustration sits on the artboard. */
  illustrationBox: ArtboardBox;
  /** The page's content (title and form), on the blue panel. */
  children: React.ReactNode;
  className?: string;
};

const LOGO_BOX: ArtboardBox = { x: 160, y: 52, width: 264 };

const u = (n: number) => `calc(var(--u) * ${n})`;

const boxStyle = ({ x, y, width }: ArtboardBox): React.CSSProperties => ({
  position: 'absolute',
  left: u(x),
  top: u(y),
  width: u(width),
});

/**
 * Login/password pages. On phones the content sits centered on the blue page (the app paints the body
 * blue). From 1280px the desktop composition — blue blob, logo, illustration and content — is drawn on
 * a 1440×810 artboard anchored top-right and scaled to the viewport (`--u` is one artboard pixel), so it
 * keeps its proportions on any monitor instead of shrinking into a corner.
 */
export function AuthLayout({ logo, illustration, illustrationBox, children, className }: AuthLayoutProps) {
  // Rendered only on desktop: images in a hidden box are still downloaded, which would cost phones
  // the blob and the illustration they never show.
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  return (
    <div
      data-slot="auth-layout"
      className={cn(
        'relative grid min-h-dvh place-items-center px-4 pt-4',
        'min-[1280px]:block min-[1280px]:h-dvh min-[1280px]:min-h-[560px] min-[1280px]:overflow-hidden min-[1280px]:p-0',
        'min-[1280px]:[container-type:size] min-[1280px]:[--u:min(100cqw/1440,100cqh/810)]',
        className
      )}
    >
      {isDesktop && (
        <div
          data-slot="auth-layout-artboard"
          className="pointer-events-none absolute top-0 right-0 hidden min-[1280px]:block"
          style={{ width: u(1440), height: u(810) }}
        >
          <img
            className="absolute h-auto"
            style={{ left: u(335), top: 0, width: u(1105) }}
            src="/assets/images/background_blue.svg"
            alt=""
            width={1106}
            height={810}
            fetchPriority="high"
          />
          <div style={boxStyle(illustrationBox)}>{illustration}</div>
          <div className="pointer-events-auto [&_img]:h-auto [&_img]:w-full" style={boxStyle(LOGO_BOX)}>
            {logo}
          </div>
        </div>
      )}

      <img
        className="pointer-events-none absolute top-0 right-0 h-auto max-w-[80%] min-[1280px]:w-[calc(var(--u)*587)] min-[1280px]:max-w-none"
        src="/assets/images/z_logo.svg"
        alt=""
        width={587}
        height={572}
      />

      <div
        data-slot="auth-layout-content"
        className="relative w-full max-w-[358px] pb-4 min-[1280px]:absolute min-[1280px]:top-[calc(var(--u)*405)] min-[1280px]:left-[calc(100%-var(--u)*614)] min-[1280px]:w-[clamp(358px,calc(var(--u)*358),420px)] min-[1280px]:max-w-none min-[1280px]:-translate-y-1/2 min-[1280px]:pb-0"
      >
        {children}
      </div>
    </div>
  );
}
