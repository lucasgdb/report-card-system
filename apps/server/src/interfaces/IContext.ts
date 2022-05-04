import type IAdmin from './IAdmin';
import type ILogin from './ILogin';
import type IStudent from './IStudent';
import type IUser from './IUser';

type IContext = {
  user?: IUser | null;
  loginId?: ILogin['id'];
  admin?: IAdmin | null;
  student?: IStudent | null;
};

export default IContext;
