import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import dayjs from 'dayjs';

import usefazConnector from '~/database/usefazConnector';
import AdminPasswordRecoveryRequestModel from '~/entities/Admin/AdminPasswordRecoveryRequestModel';
import createPassword from '~/utils/createPassword';
import { AdminModel } from '~/entities';
import AdminPasswordRecoveryRequestType from '../AdminPasswordRecoveryRequestType';

const isTokenExpired = (expiresAt: string) => dayjs(expiresAt).isBefore(dayjs());

type recoverAdminPasswordProps = {
  adminPasswordRecoveryRequestId: string;
  passwordRecoveryToken: string;
  password: string;
  passwordConfirmation: string;
  clientMutationId?: string;
};

const recoverAdminPassword = async ({
  adminPasswordRecoveryRequestId: adminPasswordRecoveryRequestGlobalId,
  passwordRecoveryToken,
  password,
  passwordConfirmation,
  clientMutationId,
}: recoverAdminPasswordProps) => {
  if (password !== passwordConfirmation) {
    throw new Error('password must be equal');
  }

  const adminPasswordRecoveryRequestId = fromGlobalId(adminPasswordRecoveryRequestGlobalId).id;

  const adminPasswordRecoveryRequestEntity = AdminPasswordRecoveryRequestModel(usefazConnector);

  const adminPasswordRecoveryRequest = await adminPasswordRecoveryRequestEntity.getRequest(
    adminPasswordRecoveryRequestId
  );

  if (!adminPasswordRecoveryRequest) {
    throw new Error('invalid request id');
  }

  if (adminPasswordRecoveryRequest.token !== passwordRecoveryToken) {
    throw new Error('invalid request token');
  }

  if (isTokenExpired(adminPasswordRecoveryRequest.expires_at)) {
    throw new Error('request token expired');
  }

  const adminEntity = AdminModel(usefazConnector);

  const admin = await adminEntity.getAdminByEmail(adminPasswordRecoveryRequest.email);

  const newPassword = createPassword(password);
  if (newPassword === admin!.password) {
    throw new Error('password should not be the same');
  }

  await adminPasswordRecoveryRequestEntity.finalizeRequest(adminPasswordRecoveryRequest.id, {
    adminId: admin!.id,
    newPassword,
  });

  return { adminPasswordRecoveryRequest, clientMutationId };
};

const RecoverAdminPasswordMutation = mutationWithClientMutationId({
  name: 'RecoverAdminPasswordMutation',
  inputFields: {
    adminPasswordRecoveryRequestId: { type: new GraphQLNonNull(GraphQLID) },
    passwordRecoveryToken: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    passwordConfirmation: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    adminPasswordRecoveryRequest: {
      type: AdminPasswordRecoveryRequestType,
    },
  },
  mutateAndGetPayload: recoverAdminPassword,
});

export default RecoverAdminPasswordMutation;
