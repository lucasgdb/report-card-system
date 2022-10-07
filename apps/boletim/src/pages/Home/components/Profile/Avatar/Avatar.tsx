import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';

import { Avatar_student$key } from './__generated__/Avatar_student.graphql';
import OpenUploadAvatarModalButton from './OpenUploadAvatarModalButton';
import AvatarImage from './AvatarImage';

const OuterAvatar = styled.div`
  position: relative;

  width: 150px;
  height: 150px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  border: 4px solid #ee7844;

  @media (min-width: 864px) {
    position: absolute;
    left: 133px;
    top: 113px;
  }
`;

type AvatarProps = {
  student: Avatar_student$key;
};

export default function Avatar({ student }: AvatarProps) {
  const data = useFragment<Avatar_student$key>(
    graphql`
      fragment Avatar_student on Student {
        ...AvatarImage_student
        ...OpenUploadAvatarModalButton_student
      }
    `,
    student
  );

  return (
    <OuterAvatar>
      <AvatarImage student={data} />
      <OpenUploadAvatarModalButton student={data} />
    </OuterAvatar>
  );
}
