import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('company_objects')
    .del()
    .insert([
      {
        company_id: 2,
        entry_type: 'public',
        city_id: 1,
        name: 'Bosco Cafe',
        street: 'Red square',
        house_number: '3A'
      },
      {
        company_id: 1,
        entry_type: 'public',
        city_id: 1,
        name: 'Sahslik',
        street: 'Central Street',
        house_number: '23'
      },
      {
        company_id: 2,
        entry_type: 'manual',
        city_id: 1,
        name: 'Bosco Bar',
        street: 'Okhotny Ryad',
        house_number: '23'
      }
    ])
};
