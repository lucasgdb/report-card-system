import type { Knex } from 'knex';

const statusEnum = ['PENDING', 'RESUFED', 'CHANGED'];

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('student_password_recovery_request');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('student_password_recovery_request', (table) => {
    table.increments('id').unsigned().primary();

    table.string('RM').notNullable();
    table.string('email').notNullable();
    table.string('token').unique().notNullable();
    table.timestamp('expires_at').notNullable();

    table
      .enum('status', statusEnum, { useNative: true, enumName: 'student_password_recovery_request_status' })
      .defaultTo('PENDING');

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('student_password_recovery_request');
  await knex.schema.raw('DROP TYPE student_password_recovery_request_status');
};
