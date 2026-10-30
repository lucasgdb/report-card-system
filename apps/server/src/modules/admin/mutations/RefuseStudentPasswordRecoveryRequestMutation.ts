import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentPasswordRecoveryRequestModel } from '~/entities';
import type { IContext } from '~/interfaces';
import StudentPasswordRecoveryRequestType from '~/modules/student/StudentPasswordRecoveryRequestType';
import isAdminOrThrowError from '~/utils/isAdminOrThrowError';
import createMutation from '~/utils/createMutation';

type refuseStudentPasswordRecoveryRequestProps = {
  studentPasswordRecoveryRequestId: string;
  clientMutationId?: string;
};

const refuseStudentPasswordRecoveryRequest = async (
  {
    studentPasswordRecoveryRequestId: globalStudentPasswordRecoveryRequestId,
    clientMutationId,
  }: refuseStudentPasswordRecoveryRequestProps,
  context: IContext
) => {
  isAdminOrThrowError(context);

  const studentPasswordRecoveryRequestId = fromGlobalId(globalStudentPasswordRecoveryRequestId).id;

  const studentPasswordRecoveryRequestEntity = StudentPasswordRecoveryRequestModel(usefazConnector);

  const canceledRequest = await studentPasswordRecoveryRequestEntity.cancelRequest(studentPasswordRecoveryRequestId);

  return {
    studentPasswordRecoveryRequest: canceledRequest,
    clientMutationId,
  };
};

const RefuseStudentPasswordRecoveryRequestMutation = createMutation({
  name: 'RefuseStudentPasswordRecoveryRequestMutation',
  inputFields: {
    studentPasswordRecoveryRequestId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    studentPasswordRecoveryRequest: {
      type: StudentPasswordRecoveryRequestType,
    },
  },
  mutateAndGetPayload: refuseStudentPasswordRecoveryRequest,
});

export default RefuseStudentPasswordRecoveryRequestMutation;
