import { Knex } from 'knex';

export const seed = async (knex: Knex) => {
  await knex('config').del();

  await knex('config').insert([{ name: 'maximum_number_of_valid_logins', value: '2', public: true }]);
};
