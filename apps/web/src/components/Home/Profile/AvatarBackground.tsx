import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { AvatarBackground_student$key } from './__generated__/AvatarBackground_student.graphql';
import Avatar from './Avatar/Avatar';

const fragment = graphql`
  fragment AvatarBackground_student on Student {
    ...Avatar_student
  }
`;

const OuterAvatarBackground = styled.div`
  display: flex;
  justify-content: center;

  @media (min-width: 864px) {
    width: 320px;
    height: 100%;

    position: relative;

    display: block;
  }
`;

const HomeIconsImage = styled.img`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);

  @media (max-width: 863px) {
    display: none;
  }
`;

type AvatarBackgroundProps = {
  student: AvatarBackground_student$key;
};

export default function AvatarBackground({ student }: AvatarBackgroundProps) {
  const data = useFragment<AvatarBackground_student$key>(fragment, student);

  return (
    <OuterAvatarBackground>
      <HomeIconsImage src="/assets/images/home_icons.svg" />
      <Avatar student={data} />
    </OuterAvatarBackground>
  );
}
