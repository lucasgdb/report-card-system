import { useMediaQuery } from '@usefaz/ui/hooks/use-media-query';
import { useEffect } from 'react';

import Menu from './Menu';

type MenuLayoutProps = {
  isMenuOpen: boolean;
  children: React.ReactNode;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const menuWrapperClassName = 'fixed top-14 left-0 max-[1199px]:w-[390px] min-[1200px]:top-[78px]';

const MenuLayout = ({ isMenuOpen, setIsMenuOpen, children }: MenuLayoutProps) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const isMobileMenuOpen = isMenuOpen && !isDesktop;

  // Mobile menu: focus its first link on open, close on Escape, and give focus back to the toggle.
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    document.querySelector<HTMLElement>('#menu-principal a')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, setIsMenuOpen]);

  return (
    <div className="flex min-h-[calc(100dvh-56px)] min-[1200px]:min-h-[calc(100dvh-78px)]">
      <div className="z-10 flex h-full min-[1200px]:flex-[0_0_72px]">
        {isDesktop ? (
          <div className={menuWrapperClassName}>
            <Menu setIsMenuOpen={setIsMenuOpen} />
          </div>
        ) : (
          isMenuOpen && (
            <div
              className={`${menuWrapperClassName} animate-in duration-250 slide-in-from-left motion-reduce:animate-none`}
            >
              <Menu setIsMenuOpen={setIsMenuOpen} />
            </div>
          )
        )}
      </div>

      <div className="flex w-[calc(100%-72px)] flex-1">{children}</div>
    </div>
  );
};

export default MenuLayout;
