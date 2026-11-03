import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { lexicographicSortSchema, printSchema } from 'graphql';

import builder from '#/graphql/builder.ts';
import { ROOT_DIR } from '#/paths.ts';

// Types and mutations register themselves on the builder when imported.
import '#/graphql/types/query.ts';
import '#/graphql/mutations/auth.ts';
import '#/graphql/mutations/recovery.ts';
import '#/graphql/mutations/admin.ts';
import '#/graphql/mutations/student.ts';

const schema = builder.toSchema();

/** Writes `schema.graphql`, which the apps' relay-compiler reads. */
export const writeSchemaFile = () =>
  writeFile(path.join(ROOT_DIR, 'schema.graphql'), `${printSchema(lexicographicSortSchema(schema))}\n`);

export default schema;
