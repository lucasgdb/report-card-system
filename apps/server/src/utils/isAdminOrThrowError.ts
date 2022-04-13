import { errorConfig } from '@usefaz/shared';

import usefazConnector from '~/database/usefazConnector';
import { AdminModel } from '~/entities';
import type { IContext } from '~/interfaces';

const isAdminOrThrowError = async (context: IContext) => {
  if (!context.user?.id) {
    throw new Error(errorConfig.user.unauthenticated.code);
  }

  const adminEntity = AdminModel(usefazConnector);

  const adminUser = await adminEntity.getAdminBy({ user_id: context.user.id });
  if (!adminUser) {
    throw new Error(errorConfig.admin.code);
  }

  return adminUser;
};

export default isAdminOrThrowError;
