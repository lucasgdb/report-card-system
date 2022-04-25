import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { Profile_student$key } from './__generated__/Profile_student.graphql';
import Information from './Information';
import AvatarBackground from './AvatarBackground';

const fragment = graphql`
  fragment Profile_student on Student {
    ...Information_student
    ...AvatarBackground_student
  }
`;

const OuterProfile = styled.div`
  width: 100%;

  background: linear-gradient(92.84deg, #011461 -8.18%, #0020a2 47.5%, #00d4ff 106.78%);

  display: flex;
  flex-direction: column;
  gap: 8px;

  position: relative;

  padding: 16px 0;

  @media (min-width: 864px) {
    height: 375px;

    padding: 0 0 0 48px;

    flex-direction: row;
    align-items: center;
  }
`;

const ZLogoImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  width: 35%;

  @media (max-width: 863px) {
    display: none;
  }
`;

type ProfileProps = {
  student: Profile_student$key;
};

export default function Profile({ student }: ProfileProps) {
  const data = useFragment<Profile_student$key>(fragment, student);

  return (
    <OuterProfile>
      <AvatarBackground student={data} />
      <Information student={data} />
      <ZLogoImage src="/assets/images/z_logo.svg" />
    </OuterProfile>
  );
}
