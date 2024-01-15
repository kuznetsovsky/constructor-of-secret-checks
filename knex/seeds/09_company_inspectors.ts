import { type Knex } from 'knex'

export async function seed (knex: Knex): Promise<void> {
  await knex('company_inspectors')
    .del()
    .insert([
      {
        company_id: 2,
        account_id: 1,
        inspector_id: 1,
        city_id: 6,
        status: 'verification',
        email: 'www.jhon@mail.com',
        first_name: 'John',
        last_name: 'Fox',
        created_at: '2024-01-15T12:18:39.984Z',
        note: 'Замечаний нетю',
        phone_number_id: 1
      },
      {
        company_id: 1,
        account_id: 4,
        inspector_id: 2,
        city_id: 1,
        status: 'verification',
        email: 'www.tim@mail.com',
        first_name: 'Tim',
        last_name: 'Fox'
      },
      {
        company_id: 2,
        account_id: 7,
        inspector_id: 3,
        city_id: null,
        status: 'verification',
        email: 'www.lana@mail.com',
        first_name: 'Lana',
        last_name: 'Fox'
      },
      {
        company_id: 2,
        account_id: 8,
        inspector_id: 4,
        city_id: 3,
        status: 'approved',
        email: 'www.ketty@mail.com',
        first_name: 'Ketty',
        last_name: 'Johnson'
      },
      {
        company_id: 2,
        account_id: 9,
        inspector_id: 5,
        city_id: 7,
        status: 'approved',
        email: 'www.barbara@mail.com',
        first_name: 'Barbara',
        last_name: 'Ford'
      },
      {
        company_id: 1,
        account_id: 10,
        inspector_id: 6,
        city_id: 1,
        status: 'approved',
        email: 'www.britney@mail.com',
        first_name: 'Britney',
        last_name: 'Fox'
      },
      {
        company_id: 2,
        account_id: 11,
        inspector_id: 7,
        city_id: 4,
        status: 'verification',
        email: 'www.betty@mail.com',
        first_name: 'Betty',
        last_name: 'Fox'
      },
      {
        company_id: 2,
        account_id: 12,
        inspector_id: 8,
        city_id: 5,
        status: 'deviation',
        email: 'www.boris@mail.com',
        first_name: 'Boris',
        last_name: 'Lafox'
      },
      {
        company_id: 2,
        account_id: 13,
        inspector_id: 9,
        city_id: 1,
        status: 'approved',
        email: 'www.michael@mail.com',
        first_name: 'Michael',
        last_name: 'Deford'
      }
    ])
};
