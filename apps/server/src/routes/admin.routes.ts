import Router from '@koa/router';

import { uploadStudents } from '~/controllers/adminController';
import auth from '~/middlewares/auth';

const router = new Router();

router.post('/admin/student/upload', auth.adminAuthenticator({ requireAuth: true }), uploadStudents);

export default router;
