import { graphql, useFragment } from 'react-relay';
import { AvatarInitials } from '@usefaz/ui/components/avatar-initials';
import { ImageWithLoader } from '@usefaz/ui/components/image-with-loader';

import type { AvatarImage_student$key } from './__generated__/AvatarImage_student.graphql';

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
    return (
      <ImageWithLoader className="size-full rounded-full object-cover" src={data.avatarURL} alt="Sua foto de perfil" />
    );
  }

  return (
    <div className="size-full text-[56px]">
      <AvatarInitials firstname={data.firstname} lastname={data.lastname} />
    </div>
  );
}
