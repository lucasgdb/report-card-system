import { errorConfig } from '@usefaz/shared';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';
import type { IContext } from '~/interfaces';
import StudentType from '../StudentType';
import createMutation from '~/utils/createMutation';

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

const RemoveAvatarMutation = createMutation({
  name: 'RemoveAvatarMutation',
  inputFields: {},
  outputFields: {
    student: {
      type: StudentType,
    },
  },
  mutateAndGetPayload: removeAvatar,
});

export default RemoveAvatarMutation;
