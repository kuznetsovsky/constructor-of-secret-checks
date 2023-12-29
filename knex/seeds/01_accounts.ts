import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('accounts')
    .del()
    .insert([
      {
        role: 'inspector',
        email: 'www.jhon@mail.com',
        password: 'qwerty_123'
      },
      {
        role: 'administrator',
        email: 'www.jane@mail.com',
        password: 'qwerty123'
      },
      {
        role: 'manager',
        email: 'www.bob@mail.com',
        password: '1233456qwerty'
      }
    ])
}
