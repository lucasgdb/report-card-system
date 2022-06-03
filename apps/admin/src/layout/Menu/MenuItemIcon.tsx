import styled from 'styled-components';

const OuterMenuItemIcon = styled.div`
  width: 72px;
  height: 56px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuItemIcon = ({ children }) => {
  return <OuterMenuItemIcon>{children}</OuterMenuItemIcon>;
};

export default MenuItemIcon;
