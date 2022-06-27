import type { Context } from 'koa';
import { readFile } from 'fs/promises';
import type { File } from 'formidable';
import { parse, CsvError } from 'csv-parse';

import { SchoolReportModel } from '~/entities';
import usefazConnector from '~/database/usefazConnector';

type RequestFiles = {
  csv: File;
};

function readCsvFile(content: Buffer) {
  return new Promise(function (resolve, reject) {
    parse(content, { columns: true, delimiter: '|', encoding: 'utf8' }, function (err, data) {
      if (err) {
        reject(new CsvError(err.code, err.message));
      }

      resolve(data);
    });
  });
}

export async function uploadStudents(ctx: Context) {
  try {
    const { csv } = <RequestFiles>ctx.request.files;

    const csvFileContent = await readFile(csv.filepath);

    const data = await readCsvFile(csvFileContent);

    const schoolReportEntity = SchoolReportModel(usefazConnector);

    // await usefazConnector.knexConnection.transaction(trx => {
    //   const schoolReport =
    // })

    ctx.body = { data };
    ctx.status = 200;
  } catch (err) {
    console.error(err);
    ctx.status = 503;
  }
}
