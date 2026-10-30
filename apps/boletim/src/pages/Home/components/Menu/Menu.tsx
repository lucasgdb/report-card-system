import { AppHeader } from '@usefaz/ui/components/app-header';
import { SeasonToggle } from '@usefaz/ui/components/seasonal/season-toggle';
import { useMediaQuery } from '@usefaz/ui/hooks/use-media-query';
import { cn } from '@usefaz/ui/lib/utils';
import { graphql, useFragment } from 'react-relay';
import { useEffect, useState } from 'react';

import type { Menu_student$key } from './__generated__/Menu_student.graphql';
import LogoutButton from './LogoutButton';
import DateInformation from './DateInformation';
import InstallButton from './InstallButton';

const dividerClassName = 'h-px w-6 rotate-90 border border-border';

type MenuProps = {
  student: Menu_student$key;
};

export default function Menu({ student }: MenuProps) {
  const data = useFragment<Menu_student$key>(
    graphql`
      fragment Menu_student on Student {
        firstname
      }
    `,
    student
  );

  const isDesktop = useMediaQuery('(min-width: 1076px)');

  const [hasMenuBehavior, setHasMenuBehavior] = useState(false);

  useEffect(() => {
    const changeMenuWhenScrolled = (event: Event) => {
      const currentTarget = event.currentTarget as Window;

      if (!hasMenuBehavior && currentTarget.scrollY > 104) {
        setHasMenuBehavior(true);
        return;
      }

      if (hasMenuBehavior && currentTarget.scrollY > 64) {
        setHasMenuBehavior(true);
        return;
      }

      setHasMenuBehavior(false);
    };

    if (!isDesktop) {
      window.removeEventListener('scroll', changeMenuWhenScrolled);
      return;
    }

    window.addEventListener('scroll', changeMenuWhenScrolled);

    return () => window.removeEventListener('scroll', changeMenuWhenScrolled);
  }, [hasMenuBehavior, isDesktop]);

  return (
    <AppHeader condensed={hasMenuBehavior}>
      <div className="flex min-w-0 items-center gap-3 min-[500px]:gap-8">
        <img
          className="w-[130px] shrink-0 min-[400px]:w-[163px]"
          src="/assets/images/usefaz_logo.svg"
          alt="Usefaz"
          width={163}
          height={34}
        />

        <InstallButton />

        <div className={cn(dividerClassName, 'max-[874px]:hidden')} />

        <div className="flex min-w-0 items-center gap-2 max-[874px]:hidden">
          <img src="/assets/icons/clap.svg" alt="" width={24} height={25} />

          <p className="m-0 truncate font-heading text-base leading-5 font-semibold text-(--text-main)">
            Seja bem-vindo, {data.firstname}!
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-1 min-[500px]:gap-4">
        <DateInformation />

        <div className={cn(dividerClassName, 'shrink-0 max-[767px]:hidden')} />

        <SeasonToggle className="shrink-0 text-(--text-main)" />
        <LogoutButton />
      </div>
    </AppHeader>
  );
}
