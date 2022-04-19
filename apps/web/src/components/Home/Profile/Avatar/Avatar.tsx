import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { Avatar_student$key } from './__generated__/Avatar_student.graphql';
import OpenUploadAvatarModalButton from './OpenUploadAvatarModalButton';

const fragment = graphql`
  fragment Avatar_student on Student {
    avatarURL
    ...OpenUploadAvatarModalButton_student
  }
`;

const OuterAvatar = styled.div`
  position: absolute;
  left: 133px;
  top: 113px;

  width: 150px;
  height: 150px;

  border-radius: 50%;
  border: 2px solid #ee7844;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

type AvatarProps = {
  student: Avatar_student$key;
};

export default function Avatar({ student }: AvatarProps) {
  const data = useFragment<Avatar_student$key>(fragment, student);

  return (
    <OuterAvatar>
      <AvatarImage src={data.avatarURL} />
      <OpenUploadAvatarModalButton student={data} />
    </OuterAvatar>
  );
}
