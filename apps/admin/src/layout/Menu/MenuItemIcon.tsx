type MenuItemIconProps = {
  children: React.ReactNode;
};

const MenuItemIcon = ({ children }: MenuItemIconProps) => {
  return <div className="flex h-14 min-w-[72px] items-center justify-center">{children}</div>;
};

export default MenuItemIcon;
