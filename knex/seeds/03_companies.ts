import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('companies')
    .del()
    .insert([
      {
        questionnaire_id: 1,
        name: 'Модный кабачок',
        description: 'Сеть ресторанов'
      },
      {
        questionnaire_id: 2,
        name: 'Res-O-Run',
        description: 'Сеть ресторанов'
      },
      {
        questionnaire_id: 3,
        name: 'Bosco',
        description: 'Сеть ресторанов'
      }
    ])
};
