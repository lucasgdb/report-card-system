import { errorConfig } from '@usefaz/shared';

import type { IContext } from '~/interfaces';

const getAdminOrThrowError = (context: IContext) => {
  if (!context.admin) {
    throw new Error(errorConfig.user.unauthenticated.code);
  }

  return context.admin;
};

const getStudentOrThrowError = (context: IContext) => {
  if (!context.student) {
    throw new Error(errorConfig.user.unauthenticated.code);
  }

  return context.student;
};

export { getAdminOrThrowError, getStudentOrThrowError };
