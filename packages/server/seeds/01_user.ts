import { Knex } from 'knex';
import * as bcrypt from 'bcryptjs';

export const seed = async (knex: Knex) => {
  await knex('login').del();
  await knex('user').del();

  const encryptedPassword = bcrypt.hashSync('123', bcrypt.genSaltSync());

  await knex('user').insert([
    {
      email: 'lucasgdbittencourt@gmail.com',
      password: encryptedPassword,
      name: 'Lucas',
      lastname: 'Bittencourt',
    },
  ]);
};
