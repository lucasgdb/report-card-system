import { handleMutationError } from '@usefaz/shared';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { GradeInput, parseMark } from '@usefaz/ui/components/grade-input';
import { PageLoader } from '@usefaz/ui/components/page-loader';
import { Button } from '@usefaz/ui/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@usefaz/ui/components/ui/sheet';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@usefaz/ui/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@usefaz/ui/components/ui/toggle-group';
import { toastErrors } from '@usefaz/ui/lib/toast-errors';
import { Suspense, useState } from 'react';
import { graphql, useFragment, useLazyLoadQuery, useMutation } from 'react-relay';

import SaveStudentGradesMutation from '~/modules/admin/SaveStudentGradesMutation';
import type { SaveStudentGradesMutation as SaveStudentGradesMutationType } from '~/modules/admin/__generated__/SaveStudentGradesMutation.graphql';
import type { GradesSheetQuery } from './__generated__/GradesSheetQuery.graphql';
import type { GradesSheet_student$key } from './__generated__/GradesSheet_student.graphql';

const BIMESTERS = ['first', 'second', 'third', 'fourth'] as const;
const FIELDS = ['grade', 'recGrade', 'absences'] as const;

type Field = (typeof FIELDS)[number];
/** What is typed in one bimester's fields, as text (empty = not given yet). */
type BimesterDraft = Record<Field, string>;
type Draft = Map<number, BimesterDraft[]>;

const toText = (value: number | null | undefined) =>
  value === null || value === undefined ? '' : value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

const fieldKey = (code: number, bimester: number, field: Field) => `${code}-${bimester}-${field}`;

function validateMark(field: Field, text: string) {
  const value = parseMark(text);
  if (value === null) {
    return null;
  }
  if (field === 'absences') {
    return Number.isInteger(value) && value >= 0 ? null : 'Faltas são um número inteiro, 0 ou mais.';
  }
  return Number.isFinite(value) && value >= 0 && value <= 10 ? null : 'As notas vão de 0 a 10.';
}

type GradesSheetProps = {
  open: boolean;
  onClose(): void;
  studentId: string;
  fullname: string;
};

/** Side panel where an admin types a student's grades and absences, one bimester at a time. */
export default function GradesSheet({ open, onClose, studentId, fullname }: GradesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:w-[640px] sm:max-w-[calc(100%-3rem)]">
        <SheetHeader>
          <SheetTitle>Notas de {fullname}</SheetTitle>
          <SheetDescription>Deixe em branco o que ainda não foi lançado.</SheetDescription>
        </SheetHeader>
        <Suspense fallback={<PageLoader className="flex-1" />}>
          <GradesForm studentId={studentId} onClose={onClose} />
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}

function GradesForm({ studentId, onClose }: { studentId: string; onClose(): void }) {
  const query = useLazyLoadQuery<GradesSheetQuery>(
    graphql`
      query GradesSheetQuery($studentId: ID!) {
        admin {
          disciplines {
            code
            name
          }
        }
        node(id: $studentId) {
          ...GradesSheet_student @alias(as: "student")
        }
      }
    `,
    { studentId },
    { fetchPolicy: 'store-and-network' }
  );

  const student = useFragment<GradesSheet_student$key>(
    graphql`
      fragment GradesSheet_student on Student {
        id
        RM
        schoolReport {
          year
          schoolReportRows {
            edges {
              node {
                disciplineCode
                firstBimesterGrade
                firstBimesterRecGrade
                firstBimesterAbsences
                secondBimesterGrade
                secondBimesterRecGrade
                secondBimesterAbsences
                thirdBimesterGrade
                thirdBimesterRecGrade
                thirdBimesterAbsences
                fourthBimesterGrade
                fourthBimesterRecGrade
                fourthBimesterAbsences
              }
            }
          }
        }
      }
    `,
    query.node?.student
  );

  const disciplines = query.admin?.disciplines ?? [];
  const lines = (student?.schoolReport?.schoolReportRows?.edges ?? []).map(({ node }) => node);
  const year = student?.schoolReport?.year ?? new Date().getFullYear();

  // Every discipline, filled with what the report card already has.
  const [draft, setDraft] = useState<Draft>(
    () =>
      new Map(
        disciplines.map(({ code }) => {
          const line = lines.find((row) => row.disciplineCode === code);
          return [
            code,
            BIMESTERS.map((name) => ({
              grade: toText(line?.[`${name}BimesterGrade`]),
              recGrade: toText(line?.[`${name}BimesterRecGrade`]),
              absences: toText(line?.[`${name}BimesterAbsences`]),
            })),
          ];
        })
      )
  );
  const [bimester, setBimester] = useState(0);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [saveStudentGrades, saving] = useMutation<SaveStudentGradesMutationType>(SaveStudentGradesMutation);

  const change = (code: number, field: Field, value: string) => {
    setDraft((current) => {
      const next = new Map(current);
      const bimesters = [...(next.get(code) ?? [])];
      bimesters[bimester] = { ...bimesters[bimester], [field]: value };
      next.set(code, bimesters);
      return next;
    });
    const key = fieldKey(code, bimester, field);
    if (errors.has(key)) {
      setErrors((current) => {
        const next = new Map(current);
        next.delete(key);
        return next;
      });
    }
  };

  const filledIn = (index: number) => disciplines.filter(({ code }) => draft.get(code)?.[index].grade.trim()).length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = new Map<string, string>();
    for (const [code, bimesters] of draft) {
      bimesters.forEach((values, index) => {
        for (const field of FIELDS) {
          const message = validateMark(field, values[field]);
          if (message) {
            found.set(fieldKey(code, index, field), message);
          }
        }
      });
    }
    setErrors(found);
    if (found.size) {
      // Shows the first bimester with a problem.
      setBimester(Number([...found.keys()][0].split('-')[1]));
      return;
    }

    // Disciplines already on the report card, plus the ones that got a value now.
    const saved = new Set(lines.map((line) => line.disciplineCode));
    const changed = [...draft].filter(
      ([code, bimesters]) => saved.has(code) || bimesters.some((values) => FIELDS.some((field) => values[field].trim()))
    );

    saveStudentGrades({
      variables: {
        input: {
          studentId,
          year,
          disciplines: changed.map(([code, bimesters]) => ({
            disciplineCode: code,
            bimesters: bimesters.map((values) => ({
              grade: parseMark(values.grade),
              recGrade: parseMark(values.recGrade),
              absences: parseMark(values.absences),
            })),
          })),
        },
      },
      onCompleted: ({ saveStudentGrades }) => {
        if (handleMutationError(toastErrors, saveStudentGrades?.error)) {
          return;
        }
        toast.success('Notas salvas.');
        onClose();
      },
      onError: (error) => handleMutationError(toastErrors, error),
    });
  };

  const errorsHere = [...errors.keys()].filter((key) => key.split('-')[1] === String(bimester));

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" noValidate>
      <SheetBody className="flex flex-col gap-4 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ToggleGroup
            aria-label="Bimestre"
            value={[String(bimester)]}
            onValueChange={(value) => value[0] && setBimester(Number(value[0]))}
            className="max-w-full flex-nowrap overflow-x-auto"
          >
            {BIMESTERS.map((name, index) => (
              <ToggleGroupItem key={name} value={String(index)}>
                {index + 1}º bim.
                <span className="text-xs tabular-nums opacity-70">
                  {filledIn(index)}/{disciplines.length}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <span className="text-sm text-muted-foreground">
            RM {student?.RM} · {year}
          </span>
        </div>

        {errors.size > 0 && (
          <FormAlert
            message={
              errorsHere.length
                ? `${errors.get(errorsHere[0])} Corrija os campos destacados.`
                : 'Há campos para corrigir em outro bimestre.'
            }
          />
        )}

        <Table aria-label={`Notas do ${bimester + 1}º bimestre`}>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-0">Disciplina</TableHead>
              <TableHead className="w-16 text-center sm:w-24">Nota</TableHead>
              <TableHead className="w-16 text-center sm:w-24">
                <abbr title="Recuperação" className="no-underline sm:hidden">
                  Rec.
                </abbr>
                <span className="max-sm:hidden">Recuperação</span>
              </TableHead>
              <TableHead className="w-16 text-center sm:w-24">Faltas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disciplines.map(({ code, name }) => {
              const values = draft.get(code)?.[bimester];
              return (
                <TableRow key={code}>
                  <TableCell className="pl-0 font-medium whitespace-normal">{name}</TableCell>
                  {FIELDS.map((field) => {
                    const key = fieldKey(code, bimester, field);
                    return (
                      <TableCell key={field} className="px-1 sm:px-2">
                        <GradeInput
                          inputMode={field === 'absences' ? 'numeric' : 'decimal'}
                          aria-label={`${field === 'grade' ? 'Nota' : field === 'recGrade' ? 'Recuperação' : 'Faltas'} de ${name}`}
                          aria-invalid={errors.has(key) || undefined}
                          value={values?.[field] ?? ''}
                          onChange={(event) => change(code, field, event.target.value)}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SheetBody>

      <SheetFooter>
        <SheetClose render={<Button variant="outline" />}>Cancelar</SheetClose>
        <Button type="submit" loading={saving}>
          Salvar notas
        </Button>
      </SheetFooter>
    </form>
  );
}
