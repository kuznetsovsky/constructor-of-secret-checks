import { knex } from '../connection'
import { type Profile } from './auth.interface'

export async function findInspectorProfile (id: number): Promise<Profile | undefined> {
  const result = await knex('accounts as a')
    .select([
      'a.id as id',
      'a.role as role',
      'a.email as email',
      'i.first_name as first_name',
      'i.last_name as last_name'
    ])
    .where('a.id', id)
    .join('inspectors as i', 'i.account_id', 'a.id')
    .first()

  return result
}

export async function findAdministratorProfile (id: number): Promise<Profile | undefined> {
  const result = await knex('accounts as a')
    .where('a.id', id)
    .join('company_contact_persons as p', 'p.account_id', 'a.id')
    .join('companies as c', 'c.id', 'p.company_id')
    .select([
      'a.id as id',
      'a.role as role',
      'a.email as email',
      'p.first_name as first_name',
      'p.last_name as last_name',
      knex.raw("json_build_object('id', c.id, 'name', c.name) AS company")
    ])
    .first()

  return result as unknown as Profile
}

export async function findManagerProfile (id: number): Promise<Profile | undefined> {
  const result = await knex('accounts as a')
    .where('a.id', id)
    .join('company_employees as e', 'a.id', 'e.account_id')
    .join('companies as c', 'e.company_id', 'c.id')
    .select([
      'a.id',
      'a.role',
      'a.email',
      'e.first_name',
      'e.last_name',
      knex.raw("json_build_object('id', c.id, 'name', c.name) AS company")
    ])
    .first()

  return result as unknown as Profile
}
