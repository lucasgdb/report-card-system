import ILogin from './ILogin';
import IUser from './IUser';

type IContext = {
  user: IUser | undefined;
  loginId: ILogin['id'];
};

export default IContext;
