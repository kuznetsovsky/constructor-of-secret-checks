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
      }
    ])
};
