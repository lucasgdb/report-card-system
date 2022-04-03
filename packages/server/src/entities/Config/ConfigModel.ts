import type { DBConnector } from '~/database/dbConnector';
import type IConfig from '~/models/IConfig';

const ConfigModel = (dbConnector: DBConnector) => {
  return {
    getConfigByName(name: string) {
      return dbConnector.knexConnection<IConfig>('config').where('name', name).first();
    },
  };
};

export default ConfigModel;
