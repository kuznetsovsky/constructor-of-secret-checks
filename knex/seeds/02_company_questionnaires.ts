import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('company_questionnaires')
    .del()
    .insert([
      {
        link: '/companies-questionnaires/1',
        description: 'Описание акеты'
      }
    ])
};
