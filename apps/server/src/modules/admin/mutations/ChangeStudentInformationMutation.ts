import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';
import type { IContext } from '~/interfaces';
import StudentType from '~/modules/student/StudentType';
import createPassword from '~/utils/createPassword';
import isAdminOrThrowError from '~/utils/isAdminOrThrowError';
import createMutation from '~/utils/createMutation';
import UserError from '~/utils/UserError';

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

  if (!RM?.trim()) {
    throw new UserError('Informe o número de matrícula.', 'RM');
  }

  if (!fullname?.trim()) {
    throw new UserError('Informe o nome completo.', 'fullname');
  }

  const student = await studentEntity.getStudentBy({ id: studentId });
  if (!student) {
    throw new UserError('Este aluno não existe mais. Atualize a página.');
  }

  const studentWithRM = await studentEntity.getStudentByRM(RM.trim());
  if (studentWithRM && String(studentWithRM.id) !== String(student.id)) {
    throw new UserError('Já existe um aluno com esse número de matrícula.', 'RM');
  }

  const newPassword = password ? createPassword(password) : undefined;

  const updatedStudent = await studentEntity.update(studentId, {
    RM: RM.trim(),
    fullname: fullname.trim(),
    password: newPassword,
  });

  return {
    student: updatedStudent,
    clientMutationId,
  };
};

const ChangeStudentInformationMutation = createMutation({
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
