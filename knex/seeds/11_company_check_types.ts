import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('check_types')
    .del()
    .insert([
      { company_id: 1, name: 'Зал' },
      { company_id: 1, name: 'Кухня' },
      { company_id: 1, name: 'Доствака' },
      { company_id: 2, name: 'Доставка' }
    ])
}
