import Router from '@koa/router';
import koaBody from 'koa-body';
import path from 'path';

import { saveAvatarURL } from '~/controllers/avatarController';
import auth from '~/middlewares/auth';
import changeFilenameToRandomUUID from '~/utils/changeFilenameToRandomUUID';

const router = new Router();

const authMiddleware = auth();

const uploadAvatarMiddleware = koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.resolve(__dirname, '../../public'),
    keepExtensions: true,
    multiples: false,
    onFileBegin: function (_name, file) {
      const newFilename = changeFilenameToRandomUUID(file.newFilename);

      file.newFilename = newFilename;
      file.filepath = `${this.uploadDir}/${newFilename}`;
    },
  },
});

router.post(
  '/avatar/upload',
  authMiddleware.initialize,
  authMiddleware.authenticate({ requireAuth: true }),
  uploadAvatarMiddleware,
  saveAvatarURL
);

export default router;
