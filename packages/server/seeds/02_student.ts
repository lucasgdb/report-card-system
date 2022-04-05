import * as bcrypt from 'bcryptjs';
import type { Knex } from 'knex';

export const seed = async (knex: Knex) => {
  await knex('boletim_discipline').del();
  await knex('boletim').del();
  await knex('discipline').del();

  await knex('student').del();

  const user = await knex('user').select('id').orderBy('id', 'asc').first();

  await knex('student').insert([
    {
      RM: '12345',
      fullname: 'Lucas Bittencourt',
      password: bcrypt.hashSync('123', bcrypt.genSaltSync()),
      user_id: user.id,
    },
  ]);
};
