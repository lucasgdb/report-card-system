import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { ChevronsUpDownIcon, MenuIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@usefaz/ui/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@usefaz/ui/components/ui/sheet';
import { useMediaQuery } from '@usefaz/ui/hooks/use-media-query';
import { cn } from '@usefaz/ui/lib/utils';

type AppShellProps = {
  /** Logo and product name, at the top of the sidebar (and of the phone header). */
  brand: React.ReactNode;
  /** Global actions next to the brand, e.g. notifications. */
  actions?: React.ReactNode;
  /** The navigation (`SidebarNav` with `SidebarNavItem`s). */
  nav: React.ReactNode;
  /** The bottom of the sidebar, e.g. the account menu. */
  footer?: React.ReactNode;
  /** Changes on every navigation (e.g. the pathname): the phone menu closes when it does. */
  closeKey?: string;
  children: React.ReactNode;
};

/**
 * Signed-in layout: a fixed brand-blue sidebar on desktop; on phones a top bar whose menu button opens
 * the same sidebar in a sheet, closed again on navigation.
 */
export function AppShell({ brand, actions, nav, footer, closeKey, children }: AppShellProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Navigating (a link in the menu, or back/forward) closes the phone menu.
  const [lastCloseKey, setLastCloseKey] = React.useState(closeKey);
  if (closeKey !== lastCloseKey) {
    setLastCloseKey(closeKey);
    setIsMenuOpen(false);
  }

  const sidebarBody = (
    <>
      <nav aria-label="Menu principal" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        {nav}
      </nav>
      {footer && <div className="border-t border-white/10 p-3">{footer}</div>}
    </>
  );

  return (
    <div data-slot="app-shell" className="min-h-dvh bg-background">
      {/* HashRouter owns the URL fragment, so the skip link moves focus instead of following an anchor. */}
      <button
        type="button"
        onClick={() => document.getElementById('conteudo')?.focus()}
        className="sr-only z-50 rounded-md bg-background text-sm font-medium text-foreground shadow-md outline-none focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Pular para o conteúdo
      </button>

      {isDesktop ? (
        <aside
          data-slot="app-shell-sidebar"
          className="fixed inset-y-0 left-0 z-30 flex w-68 flex-col bg-secondary text-secondary-foreground"
        >
          <div className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
            {brand}
            {actions}
          </div>
          {sidebarBody}
        </aside>
      ) : (
        <header
          data-slot="app-shell-header"
          className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-secondary px-2 pt-[env(safe-area-inset-top)] text-secondary-foreground"
        >
          <Button variant="ghost-inverse" size="icon" aria-label="Abrir menu" onClick={() => setIsMenuOpen(true)}>
            <MenuIcon />
          </Button>
          <div className="flex min-w-0 flex-1 items-center">{brand}</div>
          {actions}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetContent
              side="left"
              className="border-none bg-secondary text-secondary-foreground [&>[data-slot=sheet-close]]:text-white [&>[data-slot=sheet-close]]:hover:bg-white/10"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-14 shrink-0 items-center px-4">{brand}</div>
              {sidebarBody}
            </SheetContent>
          </Sheet>
        </header>
      )}

      <main id="conteudo" tabIndex={-1} className="outline-none lg:pl-68">
        {children}
      </main>
    </div>
  );
}

/** The product's mark and name on the blue sidebar. */
export function AppShellBrand({ logo, name, badge }: { logo: React.ReactNode; name: string; badge?: string }) {
  return (
    <div data-slot="app-shell-brand" className="flex min-w-0 items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center [&_img]:size-8">{logo}</span>
      <span className="truncate font-heading text-lg font-bold tracking-tight text-white">{name}</span>
      {badge && (
        <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-white uppercase">
          {badge}
        </span>
      )}
    </div>
  );
}

/** Groups navigation items, with an optional heading. */
export function SidebarNav({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div data-slot="sidebar-nav" className="flex flex-col gap-1">
      {label && <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-white/60 uppercase">{label}</p>}
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
}

type SidebarNavItemProps = useRender.ComponentProps<'a'> & {
  active?: boolean;
  icon: React.ReactNode;
  /** A count shown at the end, e.g. pending requests. */
  badge?: React.ReactNode;
};

/** A navigation link; pass the router's link through `render` (e.g. `render={<Link to="/" />}`). */
export function SidebarNavItem({
  active = false,
  icon,
  badge,
  children,
  className,
  render,
  ...props
}: SidebarNavItemProps) {
  const element = useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        'aria-current': active ? 'page' : undefined,
        className: cn(
          'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/85 no-underline outline-none transition-colors',
          'hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-white/60 [&_svg]:size-5 [&_svg]:shrink-0',
          active && 'bg-white text-primary hover:bg-white hover:text-primary',
          className
        ),
        children: (
          <>
            {icon}
            <span className="min-w-0 flex-1 truncate">{children}</span>
            {badge !== undefined && badge !== null && (
              <span className="min-w-5 rounded-full bg-primary px-1.5 text-center text-xs leading-5 font-semibold text-primary-foreground tabular-nums">
                {badge}
              </span>
            )}
          </>
        ),
      },
      props
    ),
  });
  return <li data-slot="sidebar-nav-item">{element}</li>;
}

type SidebarAccountButtonProps = React.ComponentProps<'button'> & {
  avatar: React.ReactNode;
  name: string;
  detail?: string;
};

/** The signed-in user at the bottom of the sidebar: use it as the trigger of an account menu. */
export function SidebarAccountButton({ avatar, name, detail, className, ...props }: SidebarAccountButtonProps) {
  return (
    <button
      type="button"
      data-slot="sidebar-account-button"
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/60 data-popup-open:bg-white/10',
        className
      )}
      {...props}
    >
      <span className="size-9 shrink-0 text-sm">{avatar}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-white">{name}</span>
        {detail && <span className="truncate text-xs text-white/70">{detail}</span>}
      </span>
      <ChevronsUpDownIcon className="size-4 shrink-0 text-white/70" aria-hidden />
    </button>
  );
}
