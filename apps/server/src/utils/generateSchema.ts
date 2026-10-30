import { printSchema } from 'graphql/utilities';
import fs from 'node:fs';
import path from 'node:path';

import schema from '~/modules/schema';
import { ROOT_DIR } from '~/paths';

const generateSchema = () => {
  const graphQLFile = path.join(ROOT_DIR, 'schema.graphql');
  const schemaString = printSchema(schema);

  fs.writeFileSync(graphQLFile, schemaString);
};

export default generateSchema;
