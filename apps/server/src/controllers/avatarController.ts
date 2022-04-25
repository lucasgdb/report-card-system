import type { Context } from 'koa';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';

type FilesType = {
  avatar: File;
};

export const saveAvatarURL = async (ctx: Context) => {
  try {
    const studentEntity = StudentModel(usefazConnector);

    const student = await studentEntity.getStudentBy({ user_id: ctx.request.user!.id }).select('id');

    const { avatar } = <FilesType>(ctx.request.files as unknown);

    const avatarURL = `${process.env.BASE_URL}/public/${avatar.name}`;

    await studentEntity.insertAvatarURL(student!.id, avatarURL);

    ctx.body = { avatarURL };
    ctx.status = 200;
  } catch (err) {
    console.error(err);
    ctx.status = 503;
  }
};
