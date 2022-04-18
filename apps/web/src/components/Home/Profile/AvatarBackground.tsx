import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { AvatarBackground_student$key } from './__generated__/AvatarBackground_student.graphql';
import Avatar from './Avatar';

const fragment = graphql`
  fragment AvatarBackground_student on Student {
    ...Avatar_student
  }
`;

const OuterAvatarBackground = styled.div`
  width: 320px;
  height: 100%;

  position: relative;
`;

const HomeIconsImage = styled.img`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
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
