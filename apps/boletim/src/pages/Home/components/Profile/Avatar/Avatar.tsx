import { SeasonAvatarAccessory } from '@usefaz/ui/components/seasonal/season-avatar-accessory';
import { graphql, useFragment } from 'react-relay';

import type { Avatar_student$key } from './__generated__/Avatar_student.graphql';
import OpenUploadAvatarModalButton from './OpenUploadAvatarModalButton';
import AvatarImage from './AvatarImage';

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
    <div className="relative flex size-[150px] items-center justify-center rounded-full border-4 border-[#ee7844] min-[864px]:absolute min-[864px]:top-[113px] min-[864px]:left-[133px]">
      <AvatarImage student={data} />
      <OpenUploadAvatarModalButton student={data} />
      <SeasonAvatarAccessory />
    </div>
  );
}
