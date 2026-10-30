import { graphql, useFragment } from 'react-relay';

import type { AvatarBackground_student$key } from './__generated__/AvatarBackground_student.graphql';
import Avatar from './Avatar/Avatar';

type AvatarBackgroundProps = {
  student: AvatarBackground_student$key;
};

export default function AvatarBackground({ student }: AvatarBackgroundProps) {
  const data = useFragment<AvatarBackground_student$key>(
    graphql`
      fragment AvatarBackground_student on Student {
        ...Avatar_student
      }
    `,
    student
  );

  return (
    <div className="flex justify-center min-[864px]:relative min-[864px]:block min-[864px]:h-[375px] min-[864px]:w-[320px] min-[864px]:shrink-0">
      <img
        className="absolute top-1/2 -left-4 max-w-none -translate-y-1/2 max-[863px]:hidden"
        src="/assets/images/home_icons.svg"
        alt=""
        width={354}
        height={369}
      />
      <Avatar student={data} />
    </div>
  );
}
