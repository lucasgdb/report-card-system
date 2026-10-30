import { graphql, useFragment } from 'react-relay';

import type { Navbar_admin$key } from './__generated__/Navbar_admin.graphql';
import AvatarMenu from './AvatarMenu/AvatarMenu';
import OpenMenuButton from './OpenMenuButton';
import NotificationIcon from './NotificationIcon/NotificationIcon';

type NavbarProps = {
  admin: Navbar_admin$key;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ admin, isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const data = useFragment<Navbar_admin$key>(
    graphql`
      fragment Navbar_admin on Admin
      @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, after: { type: "String" }) {
        ...AvatarMenu_admin
        ...NotificationIcon_admin @arguments(count: $count, after: $after)
      }
    `,
    admin
  );

  return (
    <header className="sticky top-0 z-12 flex h-14 items-center justify-between bg-[#0020a2] pr-4 shadow-[0_2px_2px_rgba(0,0,0,0.125),0_-1px_2px_rgba(0,0,0,0.1)] min-[1200px]:h-[78px] min-[1200px]:bg-white">
      <div className="flex h-full items-center gap-4">
        <OpenMenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        <div className="flex h-full items-center justify-center min-[1200px]:w-[72px] min-[1200px]:bg-[#ee7844]">
          <img className="size-10" src="/assets/icons/usefaz_mark.svg" alt="Usefaz" width={40} height={40} />
        </div>
      </div>

      <div className="flex h-full items-center gap-4">
        <NotificationIcon admin={data} />
        <AvatarMenu admin={data} />
      </div>
    </header>
  );
};

export default Navbar;
