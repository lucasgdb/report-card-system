import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';

import { Avatar_student$key } from './__generated__/Avatar_student.graphql';
import OpenUploadAvatarModalButton from './OpenUploadAvatarModalButton';
import AvatarImage from './AvatarImage';

const fragment = graphql`
  fragment Avatar_student on Student {
    ...AvatarImage_student
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

  display: flex;
  justify-content: center;
  align-items: center;
`;

type AvatarProps = {
  student: Avatar_student$key;
};

export default function Avatar({ student }: AvatarProps) {
  const data = useFragment<Avatar_student$key>(fragment, student);

  return (
    <OuterAvatar>
      <AvatarImage student={data} />
      <OpenUploadAvatarModalButton student={data} />
    </OuterAvatar>
  );
}
