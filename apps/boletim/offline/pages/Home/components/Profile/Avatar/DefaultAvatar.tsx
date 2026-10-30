import { AvatarInitials } from '@usefaz/ui/components/avatar-initials';

import { getSavedStudent } from '../../../../../utils/getSchoolReport';

export default function DefaultAvatar() {
  const student = getSavedStudent();
  return (
    <div className="size-full text-[56px]">
      <AvatarInitials firstname={student?.firstname ?? '?'} lastname={student?.lastname ?? ''} />
    </div>
  );
}
