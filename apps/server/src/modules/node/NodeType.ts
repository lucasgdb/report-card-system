import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLInterfaceType } from 'graphql';
import { fromGlobalId, globalIdField, nodeDefinitions } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import type { IContext } from '~/interfaces';

type getterType = ({ id }: { id: string }, context: IContext) => Promise<object>;

const getters: {
  [key: string]: getterType | null;
} = {};

const registeredTypeNames: { [key: string]: any } = {};

const getNode = async (tableName: string, id: string, context: IContext) => {
  if (getters[tableName]) {
    const data = await getters[tableName]!({ id }, context);
    if (data) {
      return { ...data, tableName };
    }
  }

  const data = await usefazConnector.knexConnection(tableName).where('id', id).first();
  if (!data) {
    return { tableName };
  }

  return { ...data, tableName };
};

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions<IContext>(
  function (globalId, context) {
    const { type: tableName, id } = fromGlobalId(globalId);

    return getNode(tableName, id, context);
  },

  function (data) {
    return registeredTypeNames[data.tableName];
  }
);

export const registerGraphQLNodeObjectType = <T>(tableName: string, getter: getterType | null = null) => {
  return (config: GraphQLObjectTypeConfig<T, IContext>) => {
    const ObjectType = new GraphQLObjectType({
      ...config,

      fields() {
        return {
          id: globalIdField(tableName),
          ...(typeof config.fields === 'function' ? config.fields() : config.fields),
        };
      },

      interfaces() {
        const { interfaces } = config;
        return (interfaces as GraphQLInterfaceType[])?.concat(nodeInterface) ?? [nodeInterface];
      },
    });

    registeredTypeNames[tableName] = config.name;
    getters[tableName] = getter;

    return ObjectType;
  };
};
