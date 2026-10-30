import { cn } from '@usefaz/ui/lib/utils';

const getInitials = (firstname: string, lastname?: string) => firstname.charAt(0) + (lastname?.charAt(0) ?? '');

type AvatarInitialsProps = {
  firstname: string;
  lastname?: string;
  className?: string;
};

/** Round avatar with the person's initials (scales with the font size of its container). */
export function AvatarInitials({ firstname, lastname, className }: AvatarInitialsProps) {
  return (
    <div
      data-slot="avatar-initials"
      className={cn('flex size-full items-center justify-center rounded-full bg-[#777]', className)}
    >
      <span className="font-heading text-[1em] leading-[1em] font-bold text-[#fafafa] uppercase select-none">
        {getInitials(firstname, lastname)}
      </span>
    </div>
  );
}
