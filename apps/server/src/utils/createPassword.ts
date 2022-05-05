import { hashSync, genSaltSync } from 'bcryptjs';

const createPassword = (password: string) => {
  return hashSync(password, genSaltSync());
};

export default createPassword;
