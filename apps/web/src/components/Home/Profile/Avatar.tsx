import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';
import { useState } from 'react';

import { Avatar_student$key } from './__generated__/Avatar_student.graphql';
import UploadPhotoButton from './UploadPhotoButton';

const fragment = graphql`
  fragment Avatar_student on Student {
    avatarURL
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

const AvatarPhoto = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

type AvatarProps = {
  student: Avatar_student$key;
};

export default function Avatar({ student }: AvatarProps) {
  const data = useFragment<Avatar_student$key>(fragment, student);

  const [newAvatarURL, setNewAvatarURL] = useState<string | null>(null);

  return (
    <OuterAvatar>
      <AvatarPhoto src={newAvatarURL ?? data.avatarURL} />
      <UploadPhotoButton setNewAvatarURL={setNewAvatarURL} />
    </OuterAvatar>
  );
}
