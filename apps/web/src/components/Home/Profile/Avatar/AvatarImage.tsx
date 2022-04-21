import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';

import { AvatarImage_student$key } from './__generated__/AvatarImage_student.graphql';
import ImgWithLoader from '~/components/ImgWithLoader';
import DefaultAvatar from './DefaultAvatar';

const fragment = graphql`
  fragment AvatarImage_student on Student {
    avatarURL

    ...DefaultAvatar_student
  }
`;

const StyledImgWithLoader = styled(ImgWithLoader)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

type AvatarImageProps = {
  student: AvatarImage_student$key;
};

export default function AvatarImage({ student }: AvatarImageProps) {
  const data = useFragment<AvatarImage_student$key>(fragment, student);

  if (data.avatarURL) {
    return <StyledImgWithLoader src={data.avatarURL} />;
  }

  return <DefaultAvatar student={data} />;
}
