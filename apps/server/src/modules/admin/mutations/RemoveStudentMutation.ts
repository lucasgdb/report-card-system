import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';
import { IContext } from '~/interfaces';
import StudentType from '~/modules/student/StudentType';
import isAdminOrThrowError from '~/utils/isAdminOrThrowError';

type removeStudentProps = {
  studentId: string;
  clientMutationId?: string;
};

const removeStudent = async (
  { studentId: globalStudentId, clientMutationId }: removeStudentProps,
  context: IContext
) => {
  isAdminOrThrowError(context);

  const studentEntity = StudentModel(usefazConnector);

  const studentId = fromGlobalId(globalStudentId).id;
  const removedStudent = await studentEntity.removeStudent(studentId);

  return {
    student: removedStudent,
    clientMutationId,
  };
};

const RemoveStudentMutation = mutationWithClientMutationId({
  name: 'RemoveStudentMutation',
  inputFields: {
    studentId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    student: {
      type: StudentType,
    },
  },
  mutateAndGetPayload: removeStudent,
});

export default RemoveStudentMutation;
