import { Knex } from 'knex';

export const seed = async (knex: Knex) => {
  await knex('login').del();
  await knex('student').del();
  await knex('admin').del();
  await knex('user').del();

  await knex('user').insert({});
};
