import { cn } from '@usefaz/ui/lib/utils';
import { Link, useLocation } from 'react-router';

import MenuItemIcon from './MenuItemIcon';

export type Item = {
  id: number;
  link: string;
  Icon: React.ReactNode;
  name: string;
};

type MenuItemProps = {
  item: Item;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuItem = ({ item, setIsMenuOpen }: MenuItemProps) => {
  const { pathname } = useLocation();

  const handleCloseMenu = () => setIsMenuOpen(false);

  const isSelected = item.link === pathname;

  return (
    <Link
      to={item.link}
      onClick={handleCloseMenu}
      aria-current={isSelected ? 'page' : undefined}
      className="group/menu-item w-full rounded-3xl no-underline outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-3 focus-visible:ring-white/70 min-[1200px]:rounded-none min-[1200px]:focus-visible:ring-inset"
    >
      <div
        className={cn(
          'flex h-14 w-full items-center rounded-3xl pr-4 text-white transition-colors group-hover/menu-item:bg-[#f5f5fb] group-hover/menu-item:text-[#ee7844] group-focus-visible/menu-item:bg-[#f5f5fb] group-focus-visible/menu-item:text-[#ee7844] min-[1200px]:rounded-none',
          isSelected && 'bg-[#f5f5fb] text-[#ee7844]'
        )}
      >
        <MenuItemIcon>{item.Icon}</MenuItemIcon>
        <div
          title={item.name}
          className="overflow-hidden text-base leading-[19px] font-bold text-ellipsis whitespace-nowrap select-none"
        >
          {item.name}
        </div>
      </div>
    </Link>
  );
};

export default MenuItem;
