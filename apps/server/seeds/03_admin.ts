import * as bcrypt from 'bcryptjs';
import type { Knex } from 'knex';

export const seed = async (knex: Knex) => {
  await knex('admin').del();

  const user = await knex('user').select('id').orderBy('id', 'desc').first();

  await knex('admin').insert([
    { email: 'lucasgdbittencourt@gmail.com', password: bcrypt.hashSync('123', bcrypt.genSaltSync()), user_id: user.id },
  ]);
};
