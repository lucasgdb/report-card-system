import type { Knex } from 'knex';

export const seed = async (knex: Knex) => {
  await knex('bimester').del();
  await knex('school_report_discipline').del();
  await knex('discipline').del();

  await knex('discipline').insert([
    { id: '1', name: 'Língua Portuguesa' },
    { id: '2', name: 'Inglês' },
    { id: '3', name: 'Espanhol' },
    { id: '4', name: 'Informática' },
    { id: '5', name: 'Artes' },
    { id: '6', name: 'Educação Física' },
    { id: '7', name: 'Ciências' },
    { id: '8', name: 'Matemática' },
    { id: '9', name: 'História' },
    { id: '10', name: 'Geografia' },
    { id: '11', name: 'Filosofia e Ética' },
  ]);
};
