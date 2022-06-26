import type { Knex } from 'knex';

import createPassword from '../src/utils/createPassword';

export const seed = async (knex: Knex) => {
  await knex('admin').del();

  const user = await knex('user').select('id').orderBy('id', 'desc').first();

  await knex('admin').insert([
    {
      fullname: 'Lucas Bittencourt',
      email: 'lucasgdbittencourt@gmail.com',
      password: createPassword('123'),
      user_id: user.id,
    },
  ]);
};
