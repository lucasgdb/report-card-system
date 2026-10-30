import { cn } from '@usefaz/ui/lib/utils';

const formatGrade = (grade: number) =>
  grade.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

type GradeValueProps = {
  grade?: number | null;
  /** Recovery grade; when present it replaces the grade, which is shown struck through. */
  recovery?: number | null;
};

export function GradeValue({ grade, recovery }: GradeValueProps) {
  const hasGrade = grade !== null && grade !== undefined;
  const hasRecovery = recovery !== null && recovery !== undefined;

  if (!hasGrade && !hasRecovery) {
    return (
      <span data-slot="grade-value" data-state="empty" className="text-(--text-muted)">
        <span aria-hidden>—</span>
        <span className="sr-only">Sem nota</span>
      </span>
    );
  }

  return (
    <span
      data-slot="grade-value"
      data-state={hasRecovery ? 'recovered' : 'graded'}
      className="inline-flex flex-col items-center gap-1"
    >
      {hasGrade && (
        <span
          className={cn(
            'text-base font-semibold text-(--text-title)',
            hasRecovery && 'text-sm font-normal text-(--text-muted) line-through'
          )}
        >
          {hasRecovery && <span className="sr-only">Nota </span>}
          {formatGrade(grade)}
        </span>
      )}
      {hasRecovery && (
        <span className="rounded-md bg-primary/12 px-1.5 py-0.5 text-xs font-semibold text-primary-active dark:text-primary">
          Rec. {formatGrade(recovery)}
        </span>
      )}
    </span>
  );
}
