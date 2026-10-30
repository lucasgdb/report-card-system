import Information from './Information';
import AvatarBackground from './AvatarBackground';

export default function Profile() {
  return (
    <div className="relative flex w-full flex-col gap-2 min-[864px]:gap-16 bg-(image:--hero-background) py-6 min-[864px]:h-[420px] min-[864px]:flex-row min-[864px]:items-center min-[864px]:py-0 min-[864px]:pl-12">
      <AvatarBackground />
      <Information />
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
