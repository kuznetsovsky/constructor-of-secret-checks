import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('company_employees')
    .del()
    .insert([
      { // 1
        account_id: 3,
        company_id: 2,
        first_name: 'Bob',
        last_name: 'Fox',
        phone_number_id: 2,
        city_id: 4
      },
      { // 2
        account_id: 14,
        company_id: 2,
        first_name: 'Joe',
        last_name: 'Miller',
        phone_number_id: 3,
        city_id: 2
      },
      { // 3
        account_id: 15,
        company_id: 2,
        first_name: 'Sergio',
        last_name: 'Morello',
        phone_number_id: 4,
        city_id: 7
      },
      { // 4
        account_id: 16,
        company_id: 1,
        first_name: 'Jacob',
        last_name: 'Thomson',
        phone_number_id: 5,
        city_id: 1
      },
      { // 5
        account_id: 17,
        company_id: 3,
        first_name: 'Alexis',
        last_name: 'Sanchez',
        phone_number_id: 6,
        city_id: 5
      }
    ])
}
