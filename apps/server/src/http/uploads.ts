import { randomUUID } from 'node:crypto';

import { encodeGlobalID } from '@pothos/plugin-relay';
import { parse } from 'csv-parse/sync';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { z } from 'zod';

import { hashPassword } from '#/auth/password.ts';
import db from '#/database/db.ts';
import type { HonoEnv } from '#/http/viewer.ts';
import logger from '#/logger.ts';
import { listDisciplines, saveReportCardLine } from '#/repositories/schoolReports.ts';
import { findOrCreateStudent, listStudents, updateStudent } from '#/repositories/students.ts';
import storage, { removeQuietly } from '#/storage.ts';

const uploads = new Hono<HonoEnv>();

const MB = 1024 * 1024;

// Image types accepted for avatars, recognized by their first bytes (not by the name or the declared type).
const IMAGE_SIGNATURES = [
  {
    type: 'image/webp',
    extension: 'webp',
    matches: (b: Uint8Array) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP',
  },
  { type: 'image/png', extension: 'png', matches: (b: Uint8Array) => b[0] === 0x89 && ascii(b, 1, 4) === 'PNG' },
  { type: 'image/jpeg', extension: 'jpg', matches: (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
];

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.subarray(start, end));
}

const tooLarge = bodyLimit;

/** The signed-in student's new photo (the boletim crops it to WebP). */
uploads.post(
  '/avatar/upload',
  tooLarge({ maxSize: 2 * MB, onError: (c) => c.json({ message: 'A imagem pode ter no máximo 2 MB.' }, 413) }),
  async (c) => {
    const student = c.get('viewer')?.student;
    if (!student) {
      return c.json({ message: 'Sua sessão expirou. Entre novamente.' }, 401);
    }

    const { avatar } = await c.req.parseBody();
    if (!(avatar instanceof File)) {
      return c.json({ message: 'Envie uma imagem.' }, 400);
    }
    const bytes = new Uint8Array(await avatar.arrayBuffer());
    const image = IMAGE_SIGNATURES.find((signature) => signature.matches(bytes));
    if (!image) {
      return c.json({ message: 'Use uma imagem WebP, PNG ou JPEG.' }, 415);
    }

    const avatarURL = await storage.put(`avatars/${randomUUID()}.${image.extension}`, bytes, image.type);
    await updateStudent(student.id, { avatar_url: avatarURL });
    await removeQuietly(student.avatar_url);
    return c.json({ avatarURL });
  }
);

// Cells may be empty (grades not given yet). Decimals take a comma or a point ("8,5" or "8.5").
const blank = z.literal('').transform(() => null);
const decimal = (value: string) => value.replace(',', '.');
const grade = z.union([blank, z.string().transform(decimal).pipe(z.coerce.number<string>().min(0).max(10))]);
const recoveryGrade = z.union([z.literal('-').transform(() => null), grade]);
const absences = z.union([blank, z.coerce.number().int().min(0)]);

const BIMESTERS = [1, 2, 3, 4] as const;

/** One line of the grades spreadsheet (`|`-separated, Portuguese headers): a student, a discipline and its four bimesters. */
const CsvRow = z.object({
  ano: z.coerce.number().int().min(2000).max(2100),
  rm: z.string().trim().min(1),
  nome: z.string().trim().min(1),
  // Only used to create the student: may be empty for students who already exist.
  senha: z.union([z.literal(''), z.string().min(8)]),
  // Empty: the line only registers the student (start of the year, no report card yet).
  disciplina: z.union([blank, z.coerce.number().int().positive()]),
  ...Object.fromEntries(
    BIMESTERS.flatMap((bimester) => [
      [`nota_${bimester}bim`, grade],
      [`recuperacao_${bimester}bim`, recoveryGrade],
      [`faltas_${bimester}bim`, absences],
    ])
  ),
});

type CsvRow = {
  ano: number;
  rm: string;
  nome: string;
  senha: string;
  disciplina: number | null;
} & Record<`nota_${number}bim` | `recuperacao_${number}bim` | `faltas_${number}bim`, number | null>;

/** Says which line and column of the spreadsheet is wrong (line 1 is the header). */
function describeIssue(line: number, issue: z.core.$ZodIssue) {
  const column = String(issue.path[0] ?? '');
  if (column === 'senha') {
    return `Linha ${line}: a senha precisa ter pelo menos 8 caracteres.`;
  }
  if (column.startsWith('nota_') || column.startsWith('recuperacao_')) {
    return `Linha ${line}: "${column}" deve ser uma nota de 0 a 10 (ou ficar vazia).`;
  }
  if (column.startsWith('faltas_')) {
    return `Linha ${line}: "${column}" deve ser um número inteiro de faltas (ou ficar vazio).`;
  }
  return `Linha ${line}: valor inválido em "${column}".`;
}

/** A problem in the spreadsheet, shown to the admin as is. */
class SpreadsheetError extends Error {}

/** An admin uploads the grades spreadsheet: students are created as needed and report cards updated. */
uploads.post(
  '/admin/student/upload',
  tooLarge({ maxSize: 5 * MB, onError: (c) => c.json({ message: 'O arquivo pode ter no máximo 5 MB.' }, 413) }),
  async (c) => {
    if (!c.get('viewer')?.admin) {
      return c.json({ message: 'Sua sessão expirou. Entre novamente.' }, 401);
    }

    const { csv } = await c.req.parseBody();
    if (!(csv instanceof File)) {
      return c.json({ message: 'Envie um arquivo .csv.' }, 400);
    }

    let header: string[] = [];
    let records: Record<string, string>[];
    try {
      records = parse(await csv.text(), {
        columns: (columns: string[]) => {
          header = columns;
          return columns;
        },
        delimiter: '|',
        // A line with fewer cells (empty ones left off at the end) is read with those cells empty.
        relax_column_count: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (error) {
      logger.warn({ err: error }, 'unreadable grades spreadsheet');
      return c.json({ message: 'Não foi possível ler o arquivo. Confira se as colunas estão separadas por |.' }, 422);
    }

    const missing = Object.keys(CsvRow.shape).filter((column) => !header.includes(column));
    if (missing.length) {
      return c.json({ message: `O arquivo não segue o modelo. Faltam as colunas: ${missing.join(', ')}.` }, 422);
    }
    if (!records.length) {
      return c.json({ message: 'O arquivo não tem nenhuma linha de notas.' }, 422);
    }

    const rows: CsvRow[] = [];
    for (const [index, record] of records.entries()) {
      const parsed = CsvRow.safeParse({ ...Object.fromEntries(header.map((column) => [column, ''])), ...record });
      if (!parsed.success) {
        return c.json({ message: describeIssue(index + 2, parsed.error.issues[0]) }, 422);
      }
      rows.push(parsed.data as CsvRow);
    }

    const disciplineCodes = new Set((await listDisciplines()).map(({ id }) => id));
    const unknown = rows.findIndex((row) => row.disciplina !== null && !disciplineCodes.has(row.disciplina));
    if (unknown >= 0) {
      return c.json(
        { message: `Linha ${unknown + 2}: não existe disciplina com o código ${rows[unknown].disciplina}.` },
        422
      );
    }

    // A student who already exists keeps their name and password: only the grades on the spreadsheet change.
    try {
      await db.transaction().execute(async (trx) => {
        for (const [index, row] of rows.entries()) {
          const student = await findOrCreateStudent(trx, {
            rm: row.rm,
            fullname: row.nome,
            password_hash: () => {
              if (!row.senha) {
                throw new SpreadsheetError(
                  `Linha ${index + 2}: o RM ${row.rm} é de um aluno novo e precisa de uma senha.`
                );
              }
              return hashPassword(row.senha);
            },
          });
          if (row.disciplina === null) {
            continue;
          }
          await saveReportCardLine(trx, {
            studentId: student.id,
            year: row.ano,
            disciplineId: row.disciplina,
            bimesters: BIMESTERS.map((bimester) => ({
              grade: row[`nota_${bimester}bim`],
              recGrade: row[`recuperacao_${bimester}bim`],
              absences: row[`faltas_${bimester}bim`],
            })),
          });
        }
      });
    } catch (error) {
      if (error instanceof SpreadsheetError) {
        return c.json({ message: error.message }, 422);
      }
      throw error;
    }

    const students = await listStudents();
    return c.json({
      students: {
        edges: students.map((student) => ({
          node: { id: encodeGlobalID('Student', student.id), RM: student.rm, fullname: student.fullname },
        })),
      },
    });
  }
);

export default uploads;
