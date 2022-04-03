import { errorConfig } from '@usefaz/shared';
import * as bcrypt from 'bcryptjs';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as jwt from 'jwt-simple';

import UserType from '../UserType';
import usefazConnector from '~/database/usefazConnector';
import UserModel from '~/entities/User/UserModel';
import AuthModel from '~/entities/Auth/AuthModel';

const getUserJWToken = async (userId: string, userEmail: string) => {
  const authEntity = AuthModel(usefazConnector);

  const login = await authEntity.createLogin({
    user_id: userId,
    active: true,
  });

  const payload = {
    id: login.id,
    email: userEmail,
    active: true,
  };

  const jwtToken = jwt.encode(payload, process.env.JWT_SECRET!);
  return jwtToken;
};

type createUserProps = {
  name: string;
  lastname: string;
  email: string;
  password: string;
  clientMutationId?: string;
};

const createUser = async ({ name, lastname, email, password, clientMutationId }: createUserProps) => {
  const userEntity = UserModel(usefazConnector);

  const user = await userEntity.getUserByEmail(email);
  if (user) {
    throw new Error(errorConfig.user.duplicatedEmail.code);
  }

  const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

  const newUser = await userEntity.createUser({
    name,
    lastname,
    email,
    password: encryptedPassword,
  });

  const jwtToken = await getUserJWToken(newUser.id!, newUser.email!);

  return {
    jwtToken,
    user: newUser,
    clientMutationId,
  };
};

const CreateUserMutation = mutationWithClientMutationId({
  name: 'CreateUserMutation',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    lastname: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    jwtToken: { type: GraphQLString },
    user: { type: UserType },
  },
  mutateAndGetPayload: createUser,
});

export default CreateUserMutation;
