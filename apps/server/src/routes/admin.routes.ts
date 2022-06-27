import Router from '@koa/router';

import { uploadStudents } from '~/controllers/adminController';
import auth from '~/middlewares/auth';

const router = new Router();

const authMiddleware = auth();

router.post(
  '/admin/student/upload',
  authMiddleware.initialize,
  authMiddleware.adminAuthenticator({ requireAuth: true }),
  uploadStudents
);

export default router;
