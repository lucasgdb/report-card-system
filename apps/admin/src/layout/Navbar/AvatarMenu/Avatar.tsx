import { AvatarInitials, ImageWithLoader } from '@usefaz/components';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { Avatar_admin$key } from './__generated__/Avatar_admin.graphql';

const OuterAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  font-size: 16px;

  @media (min-width: 1200px) {
    font-size: 19px;

    width: 48px;
    height: 48px;
  }
`;

const AvatarImage = styled(ImageWithLoader)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

type AvatarProps = {
  admin: Avatar_admin$key;
};

export default forwardRef(function Avatar({ admin }: AvatarProps, ref: React.ForwardedRef<HTMLDivElement>) {
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
    <OuterAvatar ref={ref}>
      {data.avatarURL ? (
        <AvatarImage src={data.avatarURL} />
      ) : (
        <AvatarInitials firstname={data.firstname} lastname={data.lastname} />
      )}
    </OuterAvatar>
  );
});
