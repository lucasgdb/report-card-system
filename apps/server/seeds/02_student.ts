import type { Knex } from 'knex';

import createPassword from '../src/utils/createPassword';

export const seed = async (knex: Knex) => {
  await knex('bimester').del();
  await knex('school_report_discipline').del();
  await knex('school_report').del();
  await knex('discipline').del();

  await knex('student').del();

  const user = await knex('user').select('id').orderBy('id', 'asc').first();

  await knex('student').insert([
    {
      RM: '12345',
      fullname: 'Lucas Bittencourt',
      password: createPassword('123'),
      user_id: user.id,
    },
  ]);
};
