import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('phone_numbers')
    .del()
    .insert([
      { phone_number: '+15555555521' },
      { phone_number: '+17775555521' },
      { phone_number: '+14445555521' },
      { phone_number: '+12225555521' },
      { phone_number: '+18885555521' },
      { phone_number: '+79005554321' }
    ])
};
