import Router from '@koa/router';
import { koaBody } from 'koa-body';
import path from 'node:path';

import { saveAvatarURL } from '~/controllers/avatarController';
import { PUBLIC_DIR } from '~/paths';
import auth from '~/middlewares/auth';
import changeFilenameToRandomUUID from '~/utils/changeFilenameToRandomUUID';

const router = new Router();

const uploadAvatarMiddleware = koaBody({
  multipart: true,
  formidable: {
    uploadDir: PUBLIC_DIR,
    keepExtensions: true,
    onFileBegin(_name, file) {
      const newFilename = changeFilenameToRandomUUID(file.newFilename);

      file.newFilename = newFilename;
      file.filepath = path.join(PUBLIC_DIR, newFilename);
    },
  },
});

router.post('/avatar/upload', auth.studentAuthenticator({ requireAuth: true }), uploadAvatarMiddleware, saveAvatarURL);

export default router;
