import type { Knex } from 'knex';

export const seed = async (knex: Knex) => {
  await knex('boletim_discipline').del();
  await knex('boletim').del();
  await knex('discipline').del();

  await knex('student').del();
  await knex('admin').del();
  await knex('login').del();
  await knex('user').del();

  await knex('user').insert({});
  await knex('user').insert({});
};
