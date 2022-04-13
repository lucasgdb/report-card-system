/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { GraphQLObjectType } from 'graphql';
import { sync } from 'glob';

const mutationPaths = sync(`${__dirname}/**/mutations/**/*.{js,ts}`, {
  realpath: true,
});

const normalizeMutationName = (mutationName: string) => {
  const newMutationName = mutationName.replace('Mutation', '');
  return `${newMutationName[0].toLowerCase()}${newMutationName.substring(1)}`;
};

const normalizeMutationLocation = (mutationLocation: string) => {
  const slashType = mutationLocation.includes('\\') ? '\\' : '/';

  const newMutationLocation = mutationLocation.slice(mutationLocation.lastIndexOf(slashType) + 1);

  return newMutationLocation.replace(/\.(js|ts)/, '');
};

const getMutationRelativePath = (path: string) => path.replace(__dirname, '.');

const mutationFieldsReducer = (fields: object, mutation: any) => {
  const [name, field] = mutation;

  return {
    ...fields,
    [normalizeMutationName(name)]: field.default,
  };
};

const mutationFieldsInfo = mutationPaths.map((mutationPath) => [
  normalizeMutationLocation(mutationPath),
  require(getMutationRelativePath(mutationPath)),
]);

const mutationFields = mutationFieldsInfo.reduce(mutationFieldsReducer, {});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: mutationFields,
});

export default MutationType;
