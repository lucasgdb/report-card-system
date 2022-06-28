import type { Context } from 'koa';
import { readFile } from 'fs/promises';
import type { File } from 'formidable';
import { parse, CsvError } from 'csv-parse';

import { SchoolReportModel, StudentModel } from '~/entities';
import usefazConnector from '~/database/usefazConnector';
import createPassword from '~/utils/createPassword';
import { toGlobalId } from 'graphql-relay';

type RequestFiles = {
  csv: File;
};

function readCsvFile<T>(content: Buffer): Promise<T> {
  return new Promise(function (resolve, reject) {
    parse(content, { columns: true, delimiter: '|', encoding: 'utf8' }, function (err, data) {
      if (err) {
        reject(new CsvError(err.code, err.message));
      }

      resolve(data);
    });
  });
}

async function saveSchoolReports(schoolReports: SchoolReportCsvRow[]) {
  const studentEntity = StudentModel(usefazConnector);

  await usefazConnector.knexConnection.transaction(async (trx) => {
    const schoolReportEntity = SchoolReportModel(usefazConnector);

    for (const schoolReportCsvRow of schoolReports) {
      const {
        year,
        RM,
        fullname,
        password,
        discipline_id,
        firstBimesterGrade,
        secondBimesterGrade,
        thirdBimesterGrade,
        fourthBimesterGrade,
        firstBimesterRecGrade,
        secondBimesterRecGrade,
        thirdBimesterRecGrade,
        fourthBimesterRecGrade,
        firstBimesterAbsences,
        secondBimesterAbsences,
        thirdBimesterAbsences,
        fourthBimesterAbsences,
      } = schoolReportCsvRow;

      if (
        !year ||
        !RM ||
        !fullname ||
        !discipline_id ||
        !firstBimesterGrade ||
        !secondBimesterGrade ||
        !thirdBimesterGrade ||
        !fourthBimesterGrade ||
        !firstBimesterRecGrade ||
        !secondBimesterRecGrade ||
        !thirdBimesterRecGrade ||
        !fourthBimesterRecGrade ||
        !firstBimesterAbsences ||
        !secondBimesterAbsences ||
        !thirdBimesterAbsences ||
        !fourthBimesterAbsences
      ) {
        throw new Error('INVALID CSV DATA');
      }

      const student = await studentEntity.getStudentByRMOrInsertOne(
        { RM, fullname, password: createPassword(password) },
        trx
      );

      const schoolReport = await schoolReportEntity.getOrInsertSchoolReport({ year, studentId: student.id }, trx);

      const studentSchoolReportDiscipline = await schoolReportEntity.upsertStudentSchoolReportDiscipline(
        { school_report_id: schoolReport.id, discipline_id },
        trx
      );

      const bimesters = [
        {
          school_report_discipline_id: studentSchoolReportDiscipline.id,
          identifier: 1,
          grade: firstBimesterGrade as unknown as number,
          rec_grade: getNullBimesterValue(firstBimesterRecGrade),
          absences: firstBimesterAbsences as unknown as number,
        },
        {
          school_report_discipline_id: studentSchoolReportDiscipline.id,
          identifier: 2,
          grade: secondBimesterGrade as unknown as number,
          rec_grade: getNullBimesterValue(secondBimesterRecGrade),
          absences: secondBimesterAbsences as unknown as number,
        },
        {
          school_report_discipline_id: studentSchoolReportDiscipline.id,
          identifier: 3,
          grade: thirdBimesterGrade as unknown as number,
          rec_grade: getNullBimesterValue(thirdBimesterRecGrade),
          absences: thirdBimesterAbsences as unknown as number,
        },
        {
          school_report_discipline_id: studentSchoolReportDiscipline.id,
          identifier: 4,
          grade: fourthBimesterGrade as unknown as number,
          rec_grade: getNullBimesterValue(fourthBimesterRecGrade),
          absences: fourthBimesterAbsences as unknown as number,
        },
      ];

      await schoolReportEntity.upsertStudentSchoolReportDisciplineBimester(bimesters, trx);
    }
  });
}

function getNullBimesterValue(value: string): number | null {
  return value === '-' ? null : (value as unknown as number);
}

type SchoolReportCsvRow = {
  year: number;
  RM: string;
  password: string;
  fullname: string;
  discipline_id: string;
  firstBimesterGrade: string;
  firstBimesterRecGrade: string;
  firstBimesterAbsences: string;
  secondBimesterGrade: string;
  secondBimesterRecGrade: string;
  secondBimesterAbsences: string;
  thirdBimesterGrade: string;
  thirdBimesterRecGrade: string;
  thirdBimesterAbsences: string;
  fourthBimesterGrade: string;
  fourthBimesterRecGrade: string;
  fourthBimesterAbsences: string;
};

export async function uploadStudents(ctx: Context) {
  try {
    const { csv } = <RequestFiles>ctx.request.files;

    const csvFileContent = await readFile(csv.filepath);

    const schoolReports = await readCsvFile<SchoolReportCsvRow[]>(csvFileContent);

    await saveSchoolReports(schoolReports);

    const studentEntity = StudentModel(usefazConnector);
    const students = await studentEntity.getAll();

    ctx.body = {
      students: {
        edges: students.map((student) => ({ node: { ...student, id: toGlobalId('student', student.id) } })),
      },
    };
    ctx.status = 200;
  } catch (err) {
    console.error(err);
    ctx.body = { err };
    ctx.status = 503;
  }
}
