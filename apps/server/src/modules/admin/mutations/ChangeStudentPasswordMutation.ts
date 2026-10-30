import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { fromGlobalId } from 'graphql-relay';
import { createTransport } from 'nodemailer';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel, StudentPasswordRecoveryRequestModel } from '~/entities';
import type { IContext } from '~/interfaces';
import StudentPasswordRecoveryRequestType from '~/modules/student/StudentPasswordRecoveryRequestType';
import isAdminOrThrowError from '~/utils/isAdminOrThrowError';
import createMutation from '~/utils/createMutation';
import UserError from '~/utils/UserError';

type changeStudentPasswordProps = {
  studentPasswordRecoveryRequestId: string;
  newPassword: string;
  clientMutationId?: string;
};

const changeStudentPassword = async (
  {
    studentPasswordRecoveryRequestId: globalStudentPasswordRecoveryRequestId,
    newPassword,
    clientMutationId,
  }: changeStudentPasswordProps,
  context: IContext
) => {
  isAdminOrThrowError(context);

  if (!newPassword) {
    throw new UserError('Digite a nova senha do aluno.', 'newPassword');
  }

  const studentPasswordRecoveryRequestId = fromGlobalId(globalStudentPasswordRecoveryRequestId).id;

  const studentPasswordRecoveryRequestEntity = StudentPasswordRecoveryRequestModel(usefazConnector);
  const studentEntity = StudentModel(usefazConnector);

  const studentPasswordRecoveryRequest = await studentPasswordRecoveryRequestEntity.getRequest(
    studentPasswordRecoveryRequestId
  );

  if (!studentPasswordRecoveryRequest) {
    throw new UserError('Esta solicitação não existe mais. Atualize a página.');
  }

  const student = await studentEntity.getStudentByRM(studentPasswordRecoveryRequest.RM);
  if (!student) {
    throw new UserError('Não encontramos o aluno desta solicitação. Ele pode ter sido removido.');
  }

  const updatedRequest = await studentPasswordRecoveryRequestEntity.finalizeRequest(studentPasswordRecoveryRequestId, {
    studentId: student.id,
    newPassword,
  });

  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.USEFAZ_EMAIL,
      pass: process.env.USEFAZ_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Recuperação de senha" <${process.env.USEFAZ_EMAIL}>`,
    to: studentPasswordRecoveryRequest.email,
    subject: 'Recuperação de senha',
    html: `Sua senha foi alterada por um Administrador Usefaz. <br />RM: ${student.RM}<br />Sua nova senha é <b>${newPassword}</b>`,
  });

  return {
    studentPasswordRecoveryRequest: updatedRequest,
    clientMutationId,
  };
};

const ChangeStudentPasswordMutation = createMutation({
  name: 'ChangeStudentPasswordMutation',
  inputFields: {
    studentPasswordRecoveryRequestId: { type: new GraphQLNonNull(GraphQLID) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    studentPasswordRecoveryRequest: {
      type: StudentPasswordRecoveryRequestType,
    },
  },
  mutateAndGetPayload: changeStudentPassword,
});

export default ChangeStudentPasswordMutation;
