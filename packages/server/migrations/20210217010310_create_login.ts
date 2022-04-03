import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasLoginTable = await knex.schema.hasTable('login');
  if (hasLoginTable) {
    return;
  }

  await knex.schema.createTable('login', (t) => {
    t.increments('id').unsigned().primary();

    t.integer('user_id').unsigned();
    t.foreign('user_id').references('user.id');

    t.boolean('active').defaultTo(true);

    t.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('login');
};
