import type IAdmin from './IAdmin';
import type ILogin from './ILogin';
import type IStudent from './IStudent';
import type IUser from './IUser';

type IContext = {
  user: IUser | undefined;
  loginId: ILogin['id'];
  admin: IAdmin | undefined;
  student: IStudent | undefined;
};

export default IContext;
