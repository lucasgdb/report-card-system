import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { fromGlobalId } from 'graphql-relay';
import dayjs from 'dayjs';

import usefazConnector from '~/database/usefazConnector';
import { AdminModel, AdminPasswordRecoveryRequestModel } from '~/entities';
import createPassword from '~/utils/createPassword';
import AdminPasswordRecoveryRequestType from '../AdminPasswordRecoveryRequestType';
import createMutation from '~/utils/createMutation';
import UserError from '~/utils/UserError';

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
  if (!password) {
    throw new UserError('Informe a nova senha.', 'password');
  }

  if (password !== passwordConfirmation) {
    throw new UserError('As senhas não são iguais. Digite a mesma senha nos dois campos.', 'passwordConfirmation');
  }

  const invalidLink = new UserError('Este link é inválido ou expirou. Solicite um novo link de recuperação.');

  const adminPasswordRecoveryRequestId = fromGlobalId(adminPasswordRecoveryRequestGlobalId).id;

  const adminPasswordRecoveryRequestEntity = AdminPasswordRecoveryRequestModel(usefazConnector);

  const adminPasswordRecoveryRequest =
    await adminPasswordRecoveryRequestEntity.getRequest(adminPasswordRecoveryRequestId);

  if (
    !adminPasswordRecoveryRequest ||
    adminPasswordRecoveryRequest.token !== passwordRecoveryToken ||
    isTokenExpired(adminPasswordRecoveryRequest.expires_at)
  ) {
    throw invalidLink;
  }

  const adminEntity = AdminModel(usefazConnector);

  const admin = await adminEntity.getAdminByEmail(adminPasswordRecoveryRequest.email);

  const newPassword = createPassword(password);
  if (newPassword === admin!.password) {
    throw new UserError('A nova senha precisa ser diferente da atual.', 'password');
  }

  await adminPasswordRecoveryRequestEntity.finalizeRequest(adminPasswordRecoveryRequest.id, {
    adminId: admin!.id,
    newPassword,
  });

  return { adminPasswordRecoveryRequest, clientMutationId };
};

const RecoverAdminPasswordMutation = createMutation({
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
