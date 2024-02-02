import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('company_logos')
    .del()
    .insert([
      {
        company_id: 1,
        src: '/public/uploads/logos/9-n9qwaZMY9b8vilp8PfM.png'
      }
    ])
}
