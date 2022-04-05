import * as bcrypt from 'bcryptjs';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import StudentModel from '~/entities/Student/StudentModel';

type createStudentProps = {
  RM: string;
  fullname: string;
  password: string;
  clientMutationId?: string;
};

const createStudent = async ({ RM, fullname, password, clientMutationId }: createStudentProps) => {
  const studentEntity = StudentModel(usefazConnector);

  const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

  const newStudent = await studentEntity.createStudent({
    RM,
    fullname,
    password: encryptedPassword,
  });

  return {
    student: newStudent,
    clientMutationId,
  };
};

const CreateStudentMutation = mutationWithClientMutationId({
  name: 'CreateStudentMutation',
  inputFields: {
    RM: { type: new GraphQLNonNull(GraphQLString) },
    fullname: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    jwtToken: { type: GraphQLString },
  },
  mutateAndGetPayload: createStudent,
});

export default CreateStudentMutation;
