import { getSavedStudent } from '../../../../utils/getSchoolReport';
import DateInformation from './DateInformation';
import OfflineBadge from './OfflineBadge';

export default function Menu() {
  const student = getSavedStudent();

  return (
    <header className="flex justify-between gap-2 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] min-[500px]:px-12 min-[1076px]:px-40 min-[1076px]:py-9">
      <div className="flex min-w-0 items-center gap-3 min-[500px]:gap-8">
        <img
          className="w-[130px] shrink-0 min-[400px]:w-[163px]"
          src="/assets/images/usefaz_logo.svg"
          alt="Usefaz"
          width={163}
          height={34}
        />

        <OfflineBadge />

        {student && (
          <>
            <div className="h-px w-6 rotate-90 border border-border max-[874px]:hidden" />

            <div className="flex min-w-0 items-center gap-2 max-[874px]:hidden">
              <img src="/assets/icons/clap.svg" alt="" width={24} height={25} />

              <p className="truncate font-heading text-base leading-5 font-semibold text-(--text-main)">
                Seja bem-vindo, {student.firstname}!
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <DateInformation />
      </div>
    </header>
  );
}
