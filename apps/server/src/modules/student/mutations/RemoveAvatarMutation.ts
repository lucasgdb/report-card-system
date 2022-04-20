import { errorConfig } from '@usefaz/shared';
import { GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';
import { IContext } from '~/interfaces';
import StudentType from '../StudentType';

type removeAvatarProps = {
  RM: string;
  password: string;
  token: string;
  clientMutationId?: string;
};

const removeAvatar = async ({ clientMutationId }: removeAvatarProps, context: IContext) => {
  if (!context.user) {
    throw new Error(errorConfig.user.unauthenticated.code);
  }

  const studentEntity = StudentModel(usefazConnector);

  const student = await studentEntity.getStudentBy({ user_id: context.user.id }).select('id');

  const [updatedStudent] = await studentEntity.removeAvatarURL(student!.id);

  return { student: updatedStudent, clientMutationId };
};

const RemoveAvatarMutation = mutationWithClientMutationId({
  name: 'RemoveAvatarMutation',
  inputFields: {},
  outputFields: {
    student: {
      type: new GraphQLNonNull(StudentType),
    },
  },
  mutateAndGetPayload: removeAvatar,
});

export default RemoveAvatarMutation;
