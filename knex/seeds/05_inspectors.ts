import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('inspectors')
    .del()
    .insert([
      {
        account_id: 1,
        first_name: 'Jhon',
        last_name: 'Fox',
        phone_number_id: 1
      },
      {
        account_id: 4,
        first_name: 'Tim',
        last_name: 'Fox'
      },
      {
        account_id: 7,
        first_name: 'Lana',
        last_name: 'Fox'
      },
      {
        account_id: 8,
        first_name: 'Ketty',
        last_name: 'Johnson'
      },
      {
        account_id: 9,
        first_name: 'Barbara',
        last_name: 'Ford'
      },
      {
        account_id: 10,
        first_name: 'Britney',
        last_name: 'Fox'
      },
      {
        account_id: 11,
        first_name: 'Betty',
        last_name: 'Fox'
      },
      {
        account_id: 12,
        first_name: 'Boris',
        last_name: 'Lafox'
      },
      {
        account_id: 13,
        first_name: 'Michael',
        last_name: 'Deford'
      }
    ])
}
