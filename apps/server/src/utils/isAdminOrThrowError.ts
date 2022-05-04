import { errorConfig } from '@usefaz/shared';

import type { IContext } from '~/interfaces';

const isAdminOrThrowError = (context: IContext) => {
  if (!context.admin) {
    throw new Error(errorConfig.user.unauthenticated.code);
  }
};

export default isAdminOrThrowError;
