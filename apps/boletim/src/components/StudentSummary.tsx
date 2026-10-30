import { Badge } from '@usefaz/ui/components/ui/badge';

type StudentSummaryProps = {
  RM: string;
  fullname: string;
  year?: number | null;
  /** Shows the "Aprovado" status. */
  approved: boolean;
};

const titleClassName =
  'font-heading text-2xl leading-7 font-bold break-words text-[#fafafa] min-[864px]:text-[32px] min-[864px]:leading-10';

/** Student identification shown on the profile banner (online and offline pages). */
export default function StudentSummary({ RM, fullname, year, approved }: StudentSummaryProps) {
  return (
    <div className="flex min-w-0 flex-col justify-center gap-4 max-[863px]:mt-2 max-[863px]:px-6">
      <p className={titleClassName}>RM: {RM}</p>
      <p className={`${titleClassName} uppercase`}>NOME: {fullname}</p>

      {year && <p className="text-base leading-[19px] text-[#e6e8eb]">Ano: {year}</p>}

      {approved && (
        <Badge variant="success" size="lg" className="w-[250px]">
          Aprovado
        </Badge>
      )}
    </div>
  );
}
