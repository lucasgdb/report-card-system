import { errorConfig } from '@usefaz/shared';
import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';
import { IContext } from '~/interfaces';
import StudentType from '~/modules/student/StudentType';
import createPassword from '~/utils/createPassword';
import isAdminOrThrowError from '~/utils/isAdminOrThrowError';

type changeStudentInformationProps = {
  studentId: string;
  RM: string;
  fullname: string;
  password?: string;
  clientMutationId?: string;
};

const changeStudentInformation = async (
  { studentId: studentGlobalId, RM, fullname, password, clientMutationId }: changeStudentInformationProps,
  context: IContext
) => {
  isAdminOrThrowError(context);

  const studentId = fromGlobalId(studentGlobalId).id;

  const studentEntity = StudentModel(usefazConnector);

  const student = await studentEntity.getStudentBy({ id: studentId });
  if (!student) {
    throw Error(errorConfig.student.notFound.code);
  }

  const newPassword = password ? createPassword(password) : undefined;

  const updatedStudent = await studentEntity.update(studentId, { RM, fullname, password: newPassword });

  return {
    student: updatedStudent,
    clientMutationId,
  };
};

const ChangeStudentInformationMutation = mutationWithClientMutationId({
  name: 'ChangeStudentInformationMutation',
  inputFields: {
    studentId: { type: new GraphQLNonNull(GraphQLID) },
    fullname: { type: GraphQLString },
    RM: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  outputFields: {
    student: {
      type: StudentType,
    },
  },
  mutateAndGetPayload: changeStudentInformation,
});

export default ChangeStudentInformationMutation;
