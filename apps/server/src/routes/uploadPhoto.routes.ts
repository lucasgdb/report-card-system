import Router from '@koa/router';
import koaBody from 'koa-body';
import path from 'path';

import { uploadPhoto } from '~/controllers/uploadPhotoController';
import authentication from '~/middlewares/authentication';
import changeFilenameToRandomUUID from '~/utils/changeFilenameToRandomUUID';

const router = new Router();

const authenticationMiddleware = authentication();

const koaBodyMiddleware = koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.resolve(__dirname, '../../public'),
    keepExtensions: true,
    multiples: false,
    onFileBegin: function (_name, file) {
      const newFilename = changeFilenameToRandomUUID(file.name);

      file.name = newFilename;
      file.path = `${this.uploadDir}/${newFilename}`;
    },
  },
});

router.post(
  '/upload-photo',
  authenticationMiddleware.initialize,
  authenticationMiddleware.authenticate({ protectedRoutes: true }),
  koaBodyMiddleware,
  uploadPhoto
);

export default router;
