import type { Context } from 'koa';
import type { File } from 'formidable';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';

type RequestFiles = {
  avatar: File;
};

export async function saveAvatarURL(ctx: Context) {
  try {
    const studentEntity = StudentModel(usefazConnector);

    const student = await studentEntity.getStudentBy({ user_id: ctx.request.user!.id }).select('id');

    const { avatar } = <RequestFiles>ctx.request.files;

    const avatarURL = `${process.env.BASE_URL}/public/${avatar.newFilename}`;

    await studentEntity.insertAvatarURL(student!.id, avatarURL);

    ctx.body = { avatarURL };
    ctx.status = 200;
  } catch (err) {
    console.error(err);
    ctx.status = 503;
  }
}
