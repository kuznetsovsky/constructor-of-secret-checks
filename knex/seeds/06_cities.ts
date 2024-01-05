import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('cities')
    .del()
    .insert([
      {
        id: 1,
        name: 'Moscow'
      }
    ])
};
