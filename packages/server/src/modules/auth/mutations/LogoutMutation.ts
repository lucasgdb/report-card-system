import { errorConfig } from '@example/shared';
import { mutationWithClientMutationId } from 'graphql-relay';

import exampleConnector from '~/database/exampleConnector';
import AuthModel from '~/entities/Auth/AuthModel';
import type IContext from '~/interfaces/IContext';

type logoutProps = {
  clientMutationId?: string;
};

const logout = async ({ clientMutationId }: logoutProps, context: IContext) => {
  if (!context.loginId) {
    throw new Error(errorConfig.user.unauthenticated.code);
  }

  const authEntity = AuthModel(exampleConnector);

  await authEntity.logout(context.loginId);

  return { clientMutationId };
};

const LogoutMutation = mutationWithClientMutationId({
  name: 'LogoutMutation',
  description: 'The logOut mutation can be used to log out an existing user.',
  inputFields: {},
  outputFields: {},
  mutateAndGetPayload: logout,
});

export default LogoutMutation;
