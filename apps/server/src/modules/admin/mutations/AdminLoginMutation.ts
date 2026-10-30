import * as bcrypt from 'bcryptjs';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import * as jwt from 'jsonwebtoken';

import usefazConnector from '~/database/usefazConnector';
import { AdminModel, AuthModel } from '~/entities';
import type { IAdmin } from '~/interfaces';
import validateRecaptchaToken from '~/utils/validateRecaptchaToken';
import AdminType from '../AdminType';
import createMutation from '~/utils/createMutation';
import UserError from '~/utils/UserError';

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

type adminLoginProps = {
  email: string;
  password: string;
  token: string;
  clientMutationId?: string;
};

const adminLogin = async ({ email, password, token, clientMutationId }: adminLoginProps) => {
  await validateRecaptchaToken(token);

  const adminEntity = AdminModel(usefazConnector);

  // Same message for an unknown e-mail and a wrong password, so the form doesn't reveal which accounts exist.
  const admin = await adminEntity.getAdminByEmail(email);
  const jwtToken = admin && (await getAdminJwtToken(admin, password));
  if (!jwtToken) {
    throw new UserError('E-mail ou senha incorretos. Confira os dados e tente novamente.');
  }

  return { jwtToken, admin, clientMutationId };
};

const AdminLoginMutation = createMutation({
  name: 'AdminLoginMutation',
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    jwtToken: { type: GraphQLString },
    admin: { type: AdminType },
  },
  mutateAndGetPayload: adminLogin,
});

export default AdminLoginMutation;
