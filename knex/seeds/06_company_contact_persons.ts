import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('company_contact_persons')
    .del()
    .insert([
      {
        account_id: 2,
        company_id: 1,
        first_name: 'Jane',
        last_name: 'Fox'
      },
      {
        account_id: 5,
        company_id: 2,
        first_name: 'Alex',
        last_name: 'Fox'
      },
      {
        account_id: 6,
        company_id: 3,
        first_name: 'Alice',
        last_name: 'Fox'
      }
    ])
};
