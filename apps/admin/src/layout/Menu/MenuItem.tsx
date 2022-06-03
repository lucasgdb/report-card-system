import { useLocation } from 'react-router';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import MenuItemIcon from './MenuItemIcon';

const MenuItemText = styled.div`
  font: normal normal 700 16px/16px Lexend;

  user-select: none;
`;

const selectedCSS = css`
  ${MenuItemText} {
    color: #ee7844;
  }

  background-color: #f5f5fb;

  svg,
  path {
    fill: #ee7844;
  }
`;

type OuterMenuItemProps = {
  $selected: boolean;
};

const OuterMenuItem = styled.div<OuterMenuItemProps>`
  display: flex;
  align-items: center;

  width: 100%;
  height: 56px;
  border-radius: 24px;

  ${MenuItemText} {
    color: #fff;
  }

  svg,
  path {
    fill: #fff;
  }

  ${({ $selected }) => $selected && selectedCSS}

  :hover {
    ${selectedCSS}
  }

  @media (min-width: 1200px) {
    width: 230px;
    border-radius: 0;
  }
`;

const StyledLink = styled(Link)`
  && {
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    width: 100%;
  }
`;

export type Item = {
  id: number;
  link: string;
  Icon: React.ReactNode;
  name: string;
};

type MenuItemProps = {
  item: Item;
};

const MenuItem = ({ item }: MenuItemProps) => {
  const { pathname } = useLocation();

  return (
    <StyledLink to={item.link}>
      <OuterMenuItem $selected={item.link === pathname}>
        <MenuItemIcon>{item.Icon}</MenuItemIcon>
        <MenuItemText>{item.name}</MenuItemText>
      </OuterMenuItem>
    </StyledLink>
  );
};

export default MenuItem;
