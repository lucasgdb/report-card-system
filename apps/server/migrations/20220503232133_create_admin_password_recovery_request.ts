import type { Knex } from 'knex';

const statusEnum = ['PENDING', 'CHANGED'];

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('admin_password_recovery_request');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('admin_password_recovery_request', (table) => {
    table.increments('id').unsigned().primary();

    table.string('email').notNullable();
    table.string('token').unique().notNullable();
    table.enum('status', statusEnum, { useNative: true, enumName: 'status' }).defaultTo('PENDING');
    table.timestamp('expires_at').notNullable();

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('admin_password_recovery_request');
  await knex.schema.raw('DROP TYPE status');
};
