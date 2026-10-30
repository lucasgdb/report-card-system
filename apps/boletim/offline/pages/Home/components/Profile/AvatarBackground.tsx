import Avatar from './Avatar/Avatar';

export default function AvatarBackground() {
  return (
    <div className="flex justify-center min-[864px]:relative min-[864px]:block min-[864px]:h-full min-[864px]:w-[320px]">
      <img
        className="absolute top-1/2 -left-4 -translate-y-1/2 max-[863px]:hidden"
        src="/assets/images/home_icons.svg"
        alt=""
        width={354}
        height={369}
      />
      <Avatar />
    </div>
  );
}
