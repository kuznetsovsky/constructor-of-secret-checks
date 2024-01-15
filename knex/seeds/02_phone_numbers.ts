import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('phone_numbers')
    .del()
    .insert([
      { phone_number: '+15555555521' }
    ])
};
