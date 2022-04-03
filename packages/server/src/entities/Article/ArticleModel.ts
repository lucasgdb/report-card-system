import type { DBConnector } from '~/database/dbConnector';
import type IArticle from '~/models/IArticle';

const ArticleModel = (dbConnector: DBConnector) => {
  return {
    getAll() {
      return dbConnector.knexConnection<IArticle>('article');
    },
  };
};

export default ArticleModel;
