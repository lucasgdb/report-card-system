import { GraphQLObjectType, GraphQLObjectTypeConfig } from 'graphql';
import { fromGlobalId, globalIdField, nodeDefinitions } from 'graphql-relay';

import exampleConnector from '~/database/exampleConnector';
import type IContext from '~/interfaces/IContext';

type getterType = ({ id }: { id: string }, context: IContext) => Promise<object>;

const getters: {
  [key: string]: getterType | null;
} = {};

const registeredTypes: { [key: string]: any } = {};

const getNode = async (table: string, id: string, context: IContext) => {
  if (getters[table]) {
    const data = await getters[table]!({ id }, context);
    if (data) {
      return { ...data, _type: table };
    }
  }

  const data = await exampleConnector.knexConnection(table).where('id', id).first();

  if (!data) {
    return { _type: table };
  }

  return { ...data, _type: table };
};

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions<IContext>(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    return getNode(type, id, context);
  },

  (data) => registeredTypes[data._type]
);

export const registerGraphQLNodeObjectType = <ObjectType>(table: string, getter: getterType | null = null) => {
  return (config: GraphQLObjectTypeConfig<ObjectType, IContext>) => {
    const ObjectType = new GraphQLObjectType({
      ...config,

      fields: () => ({
        id: globalIdField(table),

        ...(typeof config.fields === 'function' ? config.fields() : config.fields),
      }),

      interfaces: () =>
        config.interfaces
          ? // @ts-expect-error config.interfaces is an array
            [...config.interfaces, nodeInterface]
          : [nodeInterface],
    });

    registeredTypes[table] = ObjectType;
    getters[table] = getter;

    return ObjectType;
  };
};
