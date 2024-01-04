import { type AccountInterface } from 'knex/types/tables'
import { knex } from '../../../knex/connection'

import type {
  AdminProfile,
  InspectorProfile
} from '../interfaces/profile.interface'

export async function findAccountByID (
  id: number,
  data: Array<keyof Partial<AccountInterface>>
): Promise<AccountInterface | undefined> {
  const account = await knex('accounts')
    .select(data)
    .where({ id })
    .first()

  return account as unknown as AccountInterface | undefined
}

export async function findInspectorProfileByID (id: number): Promise<InspectorProfile | undefined> {
  const profile = await knex('accounts as a')
    .leftJoin('inspectors as i', 'i.account_id', 'a.id')
    .leftJoin('cities as c', 'c.id', 'i.city_id')
    .leftJoin('phone_numbers as p', 'p.id', 'i.phone_number_id')
    .where('a.id', id)
    .select([
      'a.id as id',
      'a.role as role',
      'a.email as email',
      'i.first_name as first_name',
      'i.last_name as last_name',
      'i.birthday as birthday',
      'i.vk_link as vk_link',
      'i.address as address',
      knex.raw('to_json(c.*) as city'),
      'p.phone_number as phone_number'
    ])
    .first()

  return profile
}

export async function findAdministratorProfileByID (id: number): Promise<AdminProfile | undefined> {
  const profile = await knex('accounts as a')
    .leftJoin('company_contact_persons as p', 'p.account_id', 'a.id')
    .leftJoin('phone_numbers as t', 't.id', 'p.phone_number_id')
    .leftJoin('companies as c', 'c.id', 'p.company_id')
    .where('a.id', id)
    .select([
      'a.id as id',
      'a.role as role',
      'a.email as email',
      'p.first_name as first_name',
      'p.last_name as last_name',
      knex.raw("json_build_object('id', c.id, 'name', c.name) AS company"),
      't.phone_number as phone_number'
    ])
    .first()

  return profile
}
