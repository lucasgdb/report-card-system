import { GraphQLObjectType } from 'graphql';
import { connectionArgs, connectionFromPromisedArray } from 'graphql-relay';

import exampleConnector from '~/database/exampleConnector';
import ArticleModel from '~/entities/Article/ArticleModel';
import type IContext from '~/interfaces/IContext';
import { ArticleConnection } from '../article/ArticleType';

const SystemType = new GraphQLObjectType<unknown, IContext>({
  name: 'System',
  fields() {
    return {
      articles: {
        type: ArticleConnection.connectionType,
        args: connectionArgs,
        resolve: (_root, args) => {
          const articleEntity = ArticleModel(exampleConnector);
          const query = articleEntity.getAll();
          return connectionFromPromisedArray(query, args);
        },
      },
    };
  },
});

export const systemField = {
  type: SystemType,
  resolve() {
    return {};
  },
};

export default SystemType;
