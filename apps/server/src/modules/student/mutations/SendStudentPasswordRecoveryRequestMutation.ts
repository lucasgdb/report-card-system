import { errorConfig } from '@usefaz/shared';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { NotificationModel, StudentModel, StudentPasswordRecoveryRequestModel } from '~/entities';

type sendStudentPasswordRecoveryRequestProps = {
  RM: string;
  email: string;
  clientMutationId?: string;
};

const sendStudentPasswordRecoveryRequest = async ({
  RM,
  email,
  clientMutationId,
}: sendStudentPasswordRecoveryRequestProps) => {
  const studentEntity = StudentModel(usefazConnector);

  const student = await studentEntity.getStudentByRM(RM);
  if (!student) {
    throw new Error(errorConfig.student.notFound.code);
  }

  await usefazConnector.knexConnection.transaction(async (trx) => {
    const studentPasswordRecoveryRequestEntity = StudentPasswordRecoveryRequestModel(usefazConnector);
    const notificationEntity = NotificationModel(usefazConnector);

    await studentPasswordRecoveryRequestEntity.createRequest(
      {
        RM,
        email,
      },
      trx
    );

    await notificationEntity.createNotification(
      {
        title: 'Nova solicitação',
        message: `Nova solicitação de recuperação de senha de ${student.fullname}`,
      },
      trx
    );
  });

  return { clientMutationId };
};

const SendStudentPasswordRecoveryRequestMutation = mutationWithClientMutationId({
  name: 'SendStudentPasswordRecoveryRequestMutation',
  inputFields: {
    RM: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {},
  mutateAndGetPayload: sendStudentPasswordRecoveryRequest,
});

export default SendStudentPasswordRecoveryRequestMutation;
