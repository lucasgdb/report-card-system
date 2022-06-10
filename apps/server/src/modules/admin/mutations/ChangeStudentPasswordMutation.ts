import { errorConfig } from '@usefaz/shared';
import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { createTransport } from 'nodemailer';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel, StudentPasswordRecoveryRequestModel } from '~/entities';
import { IContext } from '~/interfaces';
import StudentPasswordRecoveryRequestType from '~/modules/student/StudentPasswordRecoveryRequestType';
import isAdminOrThrowError from '~/utils/isAdminOrThrowError';

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

  const studentPasswordRecoveryRequestId = fromGlobalId(globalStudentPasswordRecoveryRequestId).id;

  const studentPasswordRecoveryRequestEntity = StudentPasswordRecoveryRequestModel(usefazConnector);
  const studentEntity = StudentModel(usefazConnector);

  const studentPasswordRecoveryRequest = await studentPasswordRecoveryRequestEntity.getRequest(
    studentPasswordRecoveryRequestId
  );

  if (!studentPasswordRecoveryRequest) {
    throw Error(errorConfig.studentPasswordRecoveryRequest.notFound.code);
  }

  const student = await studentEntity.getStudentByRM(studentPasswordRecoveryRequest.RM);
  if (!student) {
    throw Error(errorConfig.student.notFound.code);
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
    html: `<b>Sua senha foi alterada pelo administrador Usefaz. Sua nova senha: ${newPassword}</b>`,
  });

  return {
    studentPasswordRecoveryRequest: updatedRequest,
    clientMutationId,
  };
};

const ChangeStudentPasswordMutation = mutationWithClientMutationId({
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
