import styled, { css } from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Menu_student$key } from './__generated__/Menu_student.graphql';
import LogoutButton from './LogoutButton';
import DateInformation from './DateInformation';
import InstallButton from './InstallButton';
import SwitchThemeButton from './SwitchThemeButton';

type OuterMenuProps = {
  $hasMenuBehavior: boolean;
};

const OuterMenu = styled.div<OuterMenuProps>`
  padding: 16px 48px;

  display: flex;
  justify-content: space-between;

  background-color: ${(props) => props.theme.bg.main};
  transition: all 0.2s;

  position: sticky;
  top: 0;
  z-index: 1;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.125), 0px -1px 2px rgba(0, 0, 0, 0.1);
  padding: 16px 24px;

  @media (min-width: 400px) {
    padding: 16px 48px;
  }

  @media (min-width: 1076px) {
    padding: 36px 10%;

    box-shadow: unset;

    ${({ $hasMenuBehavior }) =>
      $hasMenuBehavior &&
      css`
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.125), 0px -1px 2px rgba(0, 0, 0, 0.1);
        padding: 16px 48px;
      `}
  }
`;

const LeftContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const UsefazLogo = styled.img`
  width: 137px;
`;

const Divider = styled.div`
  border: 1px solid #e6e8eb;
  transform: rotate(90deg);

  width: 24px;
  height: 1px;
`;

const LeftDivider = styled(Divider)`
  @media (max-width: 874px) {
    display: none;
  }
`;

const RightDivider = styled(Divider)`
  @media (max-width: 499px) {
    display: none;
  }
`;

const WelcomeInformationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 874px) {
    display: none;
  }
`;

const WelcomeInformation = styled.p`
  font: normal normal 600 16px/20px Lexend;
  color: ${(props) => props.theme.text.main};

  transition: color 0.2s;
  margin: 0;
`;

const RightContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

type MenuProps = {
  student: Menu_student$key;
};

export default function Menu({ student }: MenuProps) {
  const data = useFragment<Menu_student$key>(
    graphql`
      fragment Menu_student on Student {
        firstname
      }
    `,
    student
  );

  const isDesktop = useMediaQuery('(min-width: 1076px)');

  const [hasMenuBehavior, setHasMenuBehavior] = useState(false);

  useEffect(() => {
    const changeMenuWhenScrolled = (event: Event) => {
      const currentTarget = event.currentTarget as Window;

      if (!hasMenuBehavior && currentTarget.scrollY > 104) {
        setHasMenuBehavior(true);
        return;
      }

      if (hasMenuBehavior && currentTarget.scrollY > 64) {
        setHasMenuBehavior(true);
        return;
      }

      setHasMenuBehavior(false);
    };

    if (!isDesktop) {
      window.removeEventListener('scroll', changeMenuWhenScrolled);
      return;
    }

    window.addEventListener('scroll', changeMenuWhenScrolled);

    return () => window.removeEventListener('scroll', changeMenuWhenScrolled);
  }, [hasMenuBehavior, isDesktop]);

  return (
    <OuterMenu $hasMenuBehavior={hasMenuBehavior}>
      <LeftContentWrapper>
        <UsefazLogo src="/assets/images/usefaz_logo.svg" />

        <InstallButton />

        <LeftDivider />

        <WelcomeInformationWrapper>
          <img src="/assets/icons/clap.svg" alt="Olá!" />

          <WelcomeInformation>Seja bem-vindo, {data.firstname}!</WelcomeInformation>
        </WelcomeInformationWrapper>
      </LeftContentWrapper>

      <RightContentWrapper>
        <DateInformation />

        <RightDivider />

        <SwitchThemeButton />
        <LogoutButton />
      </RightContentWrapper>
    </OuterMenu>
  );
}
