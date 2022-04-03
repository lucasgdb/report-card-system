import type ILogin from '~/models/ILogin';
import type IUser from '~/models/IUser';

type IContext = {
  user: IUser | undefined;
  loginId: ILogin['id'];
};

export default IContext;
