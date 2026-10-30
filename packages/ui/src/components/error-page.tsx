import { Button } from '@usefaz/ui/components/ui/button';

const SOCIAL_MEDIAS = [
  { name: 'Facebook', url: 'https://www.facebook.com/usefazguara/', icon: '/assets/icons/facebook.svg' },
  { name: 'Instagram', url: 'https://www.instagram.com/usefaz.escola/', icon: '/assets/icons/instagram.svg' },
];

export type ErrorPageProps = {
  title: string;
  description: string;
  information: string;
  actionText: string;
  /** Makes the main action a link (e.g. "#/"), so it can be opened in a new tab. */
  actionHref?: string;
  optionalButtonLink?: string;
  optionalButtonText?: string;
  disableOptionalButton?: boolean;
  onActionClick?: () => void;
};

/** Full-page error with the Usefaz top bar, a message and up to two actions. */
export function ErrorPage({
  title,
  description,
  information,
  actionText,
  actionHref,
  optionalButtonLink,
  optionalButtonText,
  disableOptionalButton = false,
  onActionClick,
}: ErrorPageProps) {
  const showOptionalButton = !disableOptionalButton && Boolean(optionalButtonLink && optionalButtonText);

  return (
    <div data-slot="error-page" className="flex min-h-screen flex-col bg-(--surface-muted)">
      <header className="sticky top-0 z-[2] flex min-h-14 w-full items-center justify-between bg-secondary px-8 pt-[env(safe-area-inset-top)] md:px-28">
        <a
          href="/"
          className="flex items-center gap-2 rounded-md text-base text-white underline-offset-4 outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-white/60"
        >
          <img src="/assets/icons/usefaz_mark.svg" alt="" width={24} height={24} className="size-6" />
          <span translate="no">Usefaz</span>
        </a>

        <nav aria-label="Redes sociais" className="flex items-center gap-2">
          {SOCIAL_MEDIAS.map((socialMedia) => (
            <a
              key={socialMedia.name}
              href={socialMedia.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${socialMedia.name} (abre em nova aba)`}
              className="flex size-10 items-center justify-center rounded-full outline-none transition-colors hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-white/60"
            >
              <img src={socialMedia.icon} alt="" width={20} height={20} className="size-5" />
            </a>
          ))}
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center">
        <div className="flex w-full flex-[2] flex-col justify-between bg-background">
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
            <h1 className="text-[40px] leading-[47px] font-bold text-balance text-foreground md:text-[60px] md:leading-[71px] md:font-normal">
              {title}
            </h1>
            <p className="mt-2 text-xl text-pretty text-foreground/80 md:text-2xl">{description}</p>
            <p className="mt-2 max-w-[600px] text-sm font-light text-pretty text-muted-foreground md:text-xl">
              {information}
            </p>

            <div className="mt-14 flex flex-wrap justify-center gap-4">
              {showOptionalButton && (
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<a href={optionalButtonLink} target="_blank" rel="noreferrer" />}
                >
                  {optionalButtonText}
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={onActionClick}
                // biome-ignore lint/a11y/useAnchorContent: Button renders its children into the anchor.
                {...(actionHref ? { nativeButton: false, render: <a href={actionHref} /> } : {})}
              >
                {actionText}
              </Button>
            </div>
          </div>

          <div aria-hidden className="flex">
            <div className="h-20 w-1/2 rounded-tr-[100px] bg-(--surface-muted)" />
            <div className="h-20 w-1/2 rounded-tl-[100px] bg-(--surface-muted)" />
          </div>
        </div>

        <img
          src="/assets/images/error_page_man.svg"
          alt=""
          width={232}
          height={410}
          fetchPriority="high"
          className="z-[1] -mt-6 -ml-6 h-auto max-w-[232px] flex-1"
        />
      </main>
    </div>
  );
}
