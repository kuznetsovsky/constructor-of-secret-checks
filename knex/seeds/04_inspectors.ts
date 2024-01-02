import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('inspectors')
    .del()
    .insert([
      {
        account_id: 1,
        first_name: 'Jhon',
        last_name: 'Fox'
      }
    ])
};
