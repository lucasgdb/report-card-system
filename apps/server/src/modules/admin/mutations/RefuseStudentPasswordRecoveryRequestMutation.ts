import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentPasswordRecoveryRequestModel } from '~/entities';
import { IContext } from '~/interfaces';
import StudentPasswordRecoveryRequestType from '~/modules/student/StudentPasswordRecoveryRequestType';
import isAdminOrThrowError from '~/utils/isAdminOrThrowError';

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

const RefuseStudentPasswordRecoveryRequestMutation = mutationWithClientMutationId({
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
