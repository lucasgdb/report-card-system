import dayjs from 'dayjs';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import type IArticle from '~/models/IArticle';
import { registerGraphQLNodeObjectType } from '../node/NodeType';

const ArticleType = registerGraphQLNodeObjectType<IArticle>('article')({
  name: 'Article',
  fields() {
    return {
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      text: {
        type: new GraphQLNonNull(GraphQLString),
      },
      created_at: {
        type: new GraphQLNonNull(GraphQLString),
        resolve(article) {
          return dayjs(article.created_at).format();
        },
      },
    };
  },
});

export const ArticleConnection = connectionDefinitions({
  name: 'Article',
  nodeType: ArticleType,
});

export default ArticleType;
