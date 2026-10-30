import { GradeValue } from '@usefaz/ui/components/grade-value';
import {
  ReportTable,
  ReportTableBody,
  ReportTableCell,
  ReportTableHead,
  ReportTableHeaderCell,
  ReportTablePinButton,
  ReportTableRow,
  ReportTableRowHeader,
} from '@usefaz/ui/components/report-table';
import { ScoreBadge, type ScoreTone } from '@usefaz/ui/components/score-badge';
import { ToneLegend } from '@usefaz/ui/components/tone-legend';

import { useState } from 'react';

import SubjectIcon from '~/components/SubjectIcon';
import type { ReportCardRow } from '~/utils/reportCard';
import { readStorage, writeStorage } from '~/utils/storage';

// The student's choice of pinning the subjects column on phones (pinned unless they turned it off).
const PIN_SUBJECTS_KEY = 'usefaz:fixar-disciplinas';

const BIMESTER_LABELS = ['1º bimestre', '2º bimestre', '3º bimestre', '4º bimestre'];

// The tone follows the value the student sees (rounded to one decimal), so 6,95 shown as "7,0" is green.
const roundAverage = (average: number) => Math.round(average * 10) / 10;

const averageStatus = (average: number): { tone: ScoreTone; label: string } => {
  if (average >= 7) {
    return { tone: 'success', label: 'aprovado' };
  }
  if (average >= 5) {
    return { tone: 'warning', label: 'em atenção' };
  }
  return { tone: 'destructive', label: 'abaixo da média' };
};

const absencesStatus = (absences: number): { tone: ScoreTone; label: string } => {
  if (absences >= 18) {
    return { tone: 'destructive', label: 'acima do limite' };
  }
  if (absences >= 11) {
    return { tone: 'warning', label: 'perto do limite' };
  }
  return { tone: 'success', label: 'dentro do limite' };
};

const formatAverage = (average: number) =>
  average.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

type ReportCardTableProps = {
  rows: ReportCardRow[];
  year?: number | null;
};

export default function ReportCardTable({ rows, year }: ReportCardTableProps) {
  const [subjectsPinned, setSubjectsPinned] = useState(() => readStorage(PIN_SUBJECTS_KEY) !== 'false');

  const handlePinnedChange = (pinned: boolean) => {
    setSubjectsPinned(pinned);
    writeStorage(PIN_SUBJECTS_KEY, pinned ? null : 'false');
  };

  return (
    <div className="flex flex-col gap-4">
      <ReportTable
        firstColumnPinned={subjectsPinned}
        label="Boletim escolar"
        caption={`Notas e faltas por disciplina${year ? ` em ${year}` : ''}, com média final e total de faltas.`}
      >
        <ReportTableHead>
          <ReportTableRow>
            <ReportTableHeaderCell rowSpan={2} align="left" sticky width={240}>
              <span className="flex items-center justify-between gap-1">
                Disciplina
                <ReportTablePinButton pinned={subjectsPinned} onPinnedChange={handlePinnedChange} />
              </span>
            </ReportTableHeaderCell>
            {BIMESTER_LABELS.map((label, index) => (
              <ReportTableHeaderCell key={label} colSpan={2} group divider={index > 0}>
                {label}
              </ReportTableHeaderCell>
            ))}
            <ReportTableHeaderCell rowSpan={2} divider width={104}>
              Média final
            </ReportTableHeaderCell>
            <ReportTableHeaderCell rowSpan={2} width={104}>
              Total de faltas
            </ReportTableHeaderCell>
          </ReportTableRow>
          <ReportTableRow>
            {BIMESTER_LABELS.map((label, index) => [
              <ReportTableHeaderCell key={`${label}-grade`} divider={index > 0} aria-label={`Nota do ${label}`}>
                Nota
              </ReportTableHeaderCell>,
              <ReportTableHeaderCell key={`${label}-absences`} aria-label={`Faltas do ${label}`}>
                Faltas
              </ReportTableHeaderCell>,
            ])}
          </ReportTableRow>
        </ReportTableHead>

        <ReportTableBody>
          {rows.map((row) => {
            const average = averageStatus(roundAverage(row.finalAverage));
            const absences = absencesStatus(row.totalAbsences);

            return (
              <ReportTableRow key={row.subject}>
                <ReportTableRowHeader>
                  <span className="flex min-w-0 items-center gap-3">
                    <SubjectIcon subject={row.subject} className="max-[599px]:hidden" />
                    <span
                      title={row.subject}
                      className="text-sm leading-tight font-semibold text-balance text-(--text-title) min-[600px]:truncate min-[600px]:text-[15px]"
                    >
                      {row.subject}
                    </span>
                  </span>
                </ReportTableRowHeader>

                {row.bimesters.map((bimester, index) => [
                  <ReportTableCell key={`${BIMESTER_LABELS[index]}-grade`} divider={index > 0}>
                    <GradeValue grade={bimester.grade} recovery={bimester.recovery} />
                  </ReportTableCell>,
                  <ReportTableCell key={`${BIMESTER_LABELS[index]}-absences`}>{bimester.absences}</ReportTableCell>,
                ])}

                <ReportTableCell divider>
                  <ScoreBadge tone={average.tone} srLabel={average.label}>
                    {formatAverage(row.finalAverage)}
                  </ScoreBadge>
                </ReportTableCell>
                <ReportTableCell>
                  <ScoreBadge tone={absences.tone} srLabel={absences.label}>
                    {row.totalAbsences}
                  </ScoreBadge>
                </ReportTableCell>
              </ReportTableRow>
            );
          })}
        </ReportTableBody>
      </ReportTable>

      <div className="flex flex-col gap-2">
        <ToneLegend
          items={[
            { tone: 'success', label: 'Média 7,0 ou mais' },
            { tone: 'warning', label: 'Média entre 5,0 e 6,9' },
            { tone: 'destructive', label: 'Média abaixo de 5,0' },
          ]}
        />
        <ToneLegend
          items={[
            { tone: 'success', label: 'Até 10 faltas' },
            { tone: 'warning', label: '11 a 17 faltas' },
            { tone: 'destructive', label: '18 faltas ou mais' },
          ]}
        />
      </div>
    </div>
  );
}
