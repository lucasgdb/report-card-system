import { errorConfig } from '@usefaz/shared';
import dayjs from 'dayjs';
import crypto from 'crypto';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel, StudentPasswordRecoveryRequestModel } from '~/entities';

type sendStudentRecoveryEmailProps = {
  RM: string;
  email: string;
  clientMutationId?: string;
};

const sendStudentRecoveryEmail = async ({ RM, email, clientMutationId }: sendStudentRecoveryEmailProps) => {
  const studentEntity = StudentModel(usefazConnector);

  const student = await studentEntity.getStudentByRM(RM);
  if (!student) {
    throw new Error(errorConfig.student.notFound.code);
  }

  const studentPasswordRecoveryRequestEntity = StudentPasswordRecoveryRequestModel(usefazConnector);

  const token = crypto.randomUUID();
  const expiresAt = dayjs().add(3, 'day').format();

  await studentPasswordRecoveryRequestEntity.createRequest({
    RM,
    email,
    token,
    expires_at: expiresAt,
  });

  return { clientMutationId };
};

const SendStudentRecoveryEmailMutation = mutationWithClientMutationId({
  name: 'SendStudentRecoveryEmailMutation',
  inputFields: {
    RM: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {},
  mutateAndGetPayload: sendStudentRecoveryEmail,
});

export default SendStudentRecoveryEmailMutation;
