import { graphql, useFragment } from 'relay-hooks';
import { ImageWithLoader, AvatarInitials } from '@usefaz/components';
import styled from 'styled-components';

import { AvatarImage_student$key } from './__generated__/AvatarImage_student.graphql';

const OuterAvatarImage = styled.div`
  font-size: 56px;
  width: 100%;
  height: 100%;
`;

const StyledImgWithLoader = styled(ImageWithLoader)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

type AvatarImageProps = {
  student: AvatarImage_student$key;
};

export default function AvatarImage({ student }: AvatarImageProps) {
  const data = useFragment<AvatarImage_student$key>(
    graphql`
      fragment AvatarImage_student on Student {
        avatarURL
        firstname
        lastname
      }
    `,
    student
  );

  if (data.avatarURL) {
    return <StyledImgWithLoader src={data.avatarURL} />;
  }

  return (
    <OuterAvatarImage>
      <AvatarInitials firstname={data.firstname} lastname={data.lastname} />
    </OuterAvatarImage>
  );
}
