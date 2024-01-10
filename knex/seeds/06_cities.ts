import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('cities')
    .del()
    .insert([
      {
        id: 1,
        name: 'Moscow'
      },
      {
        id: 2,
        name: 'Saint Petersburg'
      },
      {
        id: 3,
        name: 'Novosibirsk'
      },
      {
        id: 4,
        name: 'Yekaterinburg'
      },
      {
        id: 5,
        name: 'Nizhny Novgorod'
      },
      {
        id: 6,
        name: 'Kazan'
      },
      {
        id: 7,
        name: 'Rostov-on-Don'
      },
      {
        id: 8,
        name: 'Sochi'
      }
    ])
};
