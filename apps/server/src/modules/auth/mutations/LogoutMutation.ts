import { errorConfig } from '@usefaz/shared';

import usefazConnector from '~/database/usefazConnector';
import { AuthModel } from '~/entities';
import type { IContext } from '~/interfaces';
import createMutation from '~/utils/createMutation';

type logoutProps = {
  clientMutationId?: string;
};

const logout = async ({ clientMutationId }: logoutProps, context: IContext) => {
  if (!context.loginId) {
    throw new Error(errorConfig.user.unauthenticated.code);
  }

  const authEntity = AuthModel(usefazConnector);

  await authEntity.logout(context.loginId);

  return { clientMutationId };
};

const LogoutMutation = createMutation({
  name: 'LogoutMutation',
  description: 'The logOut mutation can be used to log out an existing user.',
  inputFields: {},
  outputFields: {},
  mutateAndGetPayload: logout,
});

export default LogoutMutation;
