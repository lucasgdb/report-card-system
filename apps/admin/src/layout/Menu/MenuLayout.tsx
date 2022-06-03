import styled from 'styled-components';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';

import Menu from './Menu';

const OuterMenuLayout = styled.div`
  display: flex;

  min-height: calc(100vh - 56px);

  @media (min-width: 1200px) {
    min-height: 100vh;
  }
`;

const MenuContainer = styled.div`
  display: flex;

  height: 100%;
  z-index: 10;

  @media (min-width: 1200px) {
    flex: 0 0 72px;
  }
`;

const MenuWrapper = styled.div`
  position: fixed;
  top: 56px;
  left: 0;

  @media (max-width: 1199px) {
    width: 390px;
  }

  @media (min-width: 1200px) {
    top: 0;
    bottom: 0;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex: 1;

  width: calc(100% - 72px);
`;

const MenuLayout = ({ isMenuOpen, children }) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  return (
    <OuterMenuLayout>
      <MenuContainer>
        {isDesktop ? (
          <MenuWrapper>
            <Menu />
          </MenuWrapper>
        ) : (
          <Slide direction="right" in={isMenuOpen} mountOnEnter timeout={250}>
            <MenuWrapper>
              <Menu />
            </MenuWrapper>
          </Slide>
        )}
      </MenuContainer>

      <PageWrapper>{children}</PageWrapper>
    </OuterMenuLayout>
  );
};

export default MenuLayout;
