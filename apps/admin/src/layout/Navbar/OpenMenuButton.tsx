import { Button } from '@usefaz/ui/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react';

type OpenMenuButtonProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenMenuButton = ({ isMenuOpen, setIsMenuOpen }: OpenMenuButtonProps) => {
  const handleClick = () => setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);

  return (
    <Button
      size="icon-lg"
      onClick={handleClick}
      aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
      id="menu-toggle"
      aria-expanded={isMenuOpen}
      aria-controls="menu-principal"
      className="size-14 rounded-none rounded-br-3xl min-[1200px]:hidden"
    >
      {isMenuOpen ? <XIcon /> : <MenuIcon />}
    </Button>
  );
};

export default OpenMenuButton;
