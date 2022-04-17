import { errorConfig } from '@usefaz/shared';
import type { Context } from 'koa';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';

type RequestType = {
  files: { avatar: File };
};

export const uploadPhoto = async (ctx: Context) => {
  const studentEntity = StudentModel(usefazConnector);

  const student = await studentEntity.getStudentBy({ user_id: ctx.request.user!.id }).select('id');

  const {
    files: { avatar },
  } = <RequestType>(ctx.request as unknown);

  const avatarURL = `${process.env.BASE_URL}/public/${avatar.name}`;

  await studentEntity.insertAvatarURL(student!.id, avatarURL);

  ctx.body = { avatarURL };
  ctx.status = 200;
};
