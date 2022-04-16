import { printSchema } from 'graphql/utilities';
import fs from 'fs';
import path from 'path';

import schema from '~/modules/schema';

const generateSchema = () => {
  const graphQLFile = path.resolve(__dirname, '../../schema.graphql');
  const schemaString = printSchema(schema);

  fs.writeFileSync(graphQLFile, schemaString);
};

export default generateSchema;
