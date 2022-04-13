import { errorConfig } from '@usefaz/shared';
import * as bcrypt from 'bcryptjs';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as jwt from 'jsonwebtoken';

import usefazConnector from '~/database/usefazConnector';
import { AdminModel, AuthModel } from '~/entities';
import type { IAdmin } from '~/interfaces';
import AdminType from '../AdminType';

const getAdminJwtToken = async (admin: IAdmin, password: string) => {
  if (!bcrypt.compareSync(password, admin.password!)) {
    return null;
  }

  const authEntity = AuthModel(usefazConnector);

  const loginId = await authEntity.login(admin.user_id!);

  const payload = {
    id: loginId,
    email: admin.email,
    active: true,
  };

  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '6h' });
  return jwtToken;
};

type studentLoginProps = {
  email: string;
  password: string;
  clientMutationId?: string;
};

const studentLogin = async ({ email, password, clientMutationId }: studentLoginProps) => {
  const adminEntity = AdminModel(usefazConnector);

  const admin = await adminEntity.getAdminByEmail(email);
  if (!admin) {
    throw new Error(errorConfig.student.notFound.code);
  }

  const jwtToken = await getAdminJwtToken(admin, password);
  if (!jwtToken) {
    throw new Error(errorConfig.student.notFound.code);
  }

  return { jwtToken, admin, clientMutationId };
};

const AdminLoginMutation = mutationWithClientMutationId({
  name: 'AdminLoginMutation',
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    jwtToken: { type: GraphQLString },
    admin: { type: AdminType },
  },
  mutateAndGetPayload: studentLogin,
});

export default AdminLoginMutation;
