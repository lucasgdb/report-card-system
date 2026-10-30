import { graphql, useFragment } from 'react-relay';

import type { Profile_student$key } from './__generated__/Profile_student.graphql';
import Information from './Information';
import AvatarBackground from './AvatarBackground';

type ProfileProps = {
  student: Profile_student$key;
};

export default function Profile({ student }: ProfileProps) {
  const data = useFragment<Profile_student$key>(
    graphql`
      fragment Profile_student on Student {
        ...Information_student
        ...AvatarBackground_student
      }
    `,
    student
  );

  return (
    <div className="relative flex w-full flex-col gap-2 min-[864px]:gap-16 overflow-hidden bg-(image:--hero-background) py-6 min-[864px]:h-[420px] min-[864px]:flex-row min-[864px]:items-center min-[864px]:py-0 min-[864px]:pl-12">
      <AvatarBackground student={data} />
      <Information student={data} />
      <img
        className="absolute top-0 right-0 w-[35%] opacity-(--hero-decoration-opacity) max-[863px]:hidden"
        src="/assets/images/z_logo.svg"
        alt=""
        width={587}
        height={572}
      />
    </div>
  );
}
