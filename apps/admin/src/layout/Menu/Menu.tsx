import { GraduationCapIcon, KeyRoundIcon } from 'lucide-react';

import MenuItem, { type Item } from './MenuItem';

const menuItens: Item[] = [
  {
    id: 1,
    name: 'Alunos',
    link: '/',
    Icon: <GraduationCapIcon />,
  },
  {
    id: 2,
    name: 'Solicitações de recuperação de senha',
    link: '/solicitacoes-de-recuperacao-de-senha',
    Icon: <KeyRoundIcon />,
  },
];

type MenuProps = {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Menu = ({ setIsMenuOpen }: MenuProps) => {
  return (
    <nav
      id="menu-principal"
      aria-label="Menu principal"
      className="menu z-11 h-full w-[320px] rounded-br-3xl bg-[#0020a2] px-6 py-12 shadow-[4px_0_8px_rgba(0,0,0,0.25)] transition-[width] duration-200 motion-reduce:transition-none min-[448px]:w-[390px] min-[1200px]:top-0 min-[1200px]:h-dvh min-[1200px]:w-[72px] min-[1200px]:overscroll-contain min-[1200px]:rounded-br-none min-[1200px]:px-0 min-[1200px]:pt-6 min-[1200px]:pb-10 min-[1200px]:focus-within:w-[300px] min-[1200px]:focus-within:overflow-y-auto min-[1200px]:hover:w-[300px] min-[1200px]:hover:overflow-y-auto"
    >
      <div className="menu-item-list flex h-[500px] max-h-[calc(90vh-56px-96px-24px)] flex-col items-end gap-2 overflow-x-hidden overflow-y-auto overscroll-contain min-[1200px]:max-h-none min-[1200px]:overflow-y-visible min-[1200px]:overscroll-auto">
        {menuItens.map((item) => {
          return <MenuItem key={item.id} item={item} setIsMenuOpen={setIsMenuOpen} />;
        })}
      </div>
    </nav>
  );
};

export default Menu;
