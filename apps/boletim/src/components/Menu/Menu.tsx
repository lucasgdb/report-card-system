import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { Menu_student$key } from './__generated__/Menu_student.graphql';
import LogoutButton from './LogoutButton';
import DateInformation from './DateInformation';

const fragment = graphql`
  fragment Menu_student on Student {
    firstname
  }
`;

const OuterMenu = styled.div`
  padding: 16px 48px;

  display: flex;
  justify-content: space-between;

  @media (min-width: 1076px) {
    padding: 36px 160px;
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
  color: #808080;

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
  const data = useFragment<Menu_student$key>(fragment, student);

  return (
    <OuterMenu>
      <LeftContentWrapper>
        <UsefazLogo src="/assets/images/usefaz_logo.svg" />

        <LeftDivider />

        <WelcomeInformationWrapper>
          <img src="/assets/icons/clap.svg" alt="Olá!" />

          <WelcomeInformation>Seja bem-vindo, {data.firstname}!</WelcomeInformation>
        </WelcomeInformationWrapper>
      </LeftContentWrapper>

      <RightContentWrapper>
        <DateInformation />

        <RightDivider />

        <LogoutButton />
      </RightContentWrapper>
    </OuterMenu>
  );
}
