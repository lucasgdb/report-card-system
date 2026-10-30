import { AvatarInitials } from '@usefaz/ui/components/avatar-initials';
import { ImageWithLoader } from '@usefaz/ui/components/image-with-loader';
import { graphql, useFragment } from 'react-relay';

import type { Avatar_admin$key } from './__generated__/Avatar_admin.graphql';

type AvatarProps = {
  admin: Avatar_admin$key;
};

export default function Avatar({ admin }: AvatarProps) {
  const data = useFragment<Avatar_admin$key>(
    graphql`
      fragment Avatar_admin on Admin {
        firstname
        lastname
        avatarURL
      }
    `,
    admin
  );

  return (
    <div className="size-10 rounded-full text-base min-[1200px]:size-12 min-[1200px]:text-[19px]">
      {data.avatarURL ? (
        <ImageWithLoader className="size-full rounded-full object-cover" src={data.avatarURL} alt="" />
      ) : (
        <AvatarInitials firstname={data.firstname} lastname={data.lastname} />
      )}
    </div>
  );
}
