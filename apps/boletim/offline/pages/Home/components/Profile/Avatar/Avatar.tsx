import { SeasonAvatarAccessory } from '@usefaz/ui/components/seasonal/season-avatar-accessory';
import DefaultAvatar from './DefaultAvatar';

export default function Avatar() {
  return (
    <div className="relative flex size-[150px] items-center justify-center rounded-full border-4 border-[#ee7844] min-[864px]:absolute min-[864px]:top-[113px] min-[864px]:left-[133px]">
      <DefaultAvatar />
      <SeasonAvatarAccessory />
    </div>
  );
}
