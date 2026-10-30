import * as bcrypt from 'bcryptjs';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import * as jwt from 'jsonwebtoken';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel, AuthModel } from '~/entities';
import type { IStudent } from '~/interfaces';
import StudentType from '~/modules/student/StudentType';
import validateRecaptchaToken from '~/utils/validateRecaptchaToken';
import createMutation from '~/utils/createMutation';
import UserError from '~/utils/UserError';

const getStudentJwtToken = async (student: IStudent, password: string) => {
  if (!bcrypt.compareSync(password, student.password!)) {
    return null;
  }

  const authEntity = AuthModel(usefazConnector);

  const loginId = await authEntity.login(student.user_id!);

  const payload = {
    id: loginId,
    RM: student.RM,
    active: true,
  };

  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '2h' });
  return jwtToken;
};

type studentLoginProps = {
  RM: string;
  password: string;
  token: string;
  clientMutationId?: string;
};

const studentLogin = async ({ RM, password, token, clientMutationId }: studentLoginProps) => {
  await validateRecaptchaToken(token);

  const studentEntity = StudentModel(usefazConnector);

  // Same message for an unknown RM and a wrong password, so the form doesn't reveal which RMs exist.
  const student = await studentEntity.getStudentByRM(RM);
  const jwtToken = student && (await getStudentJwtToken(student, password));
  if (!jwtToken) {
    throw new UserError('RM ou senha incorretos. Confira os dados e tente novamente.');
  }

  return { jwtToken, student, clientMutationId };
};

const StudentLoginMutation = createMutation({
  name: 'StudentLoginMutation',
  inputFields: {
    RM: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    jwtToken: { type: GraphQLString },
    student: { type: StudentType },
  },
  mutateAndGetPayload: studentLogin,
});

export default StudentLoginMutation;
