import { errorConfig } from '@usefaz/shared';
import * as bcrypt from 'bcryptjs';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import axios from 'axios';
import url from 'url';
import * as jwt from 'jsonwebtoken';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel, AuthModel } from '~/entities';
import type { IStudent } from '~/interfaces';
import StudentType from '~/modules/student/StudentType';

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

const getRecaptchaV3Response = async (token: string) => {
  if (process.env.NODE_ENV?.toUpperCase() === 'DEVELOPMENT') {
    return { success: true };
  }

  const params = new url.URLSearchParams({
    secret: process.env.RECAPTCHA_V3_SECRET_TOKEN!,
    response: token,
  });

  const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', params.toString(), {
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });

  return response?.data;
};

type studentLoginProps = {
  RM: string;
  password: string;
  token: string;
  clientMutationId?: string;
};

const studentLogin = async ({ RM, password, token, clientMutationId }: studentLoginProps) => {
  const recaptchaResponse = await getRecaptchaV3Response(token);

  if (!recaptchaResponse?.success) {
    throw new Error('LOGIN.ERROR');
  }

  const studentEntity = StudentModel(usefazConnector);

  const student = await studentEntity.getStudentByRM(RM);
  if (!student) {
    throw new Error(errorConfig.student.notFound.code);
  }

  const jwtToken = await getStudentJwtToken(student, password);
  if (!jwtToken) {
    throw new Error(errorConfig.student.notFound.code);
  }

  return { jwtToken, student, clientMutationId };
};

const StudentLoginMutation = mutationWithClientMutationId({
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
