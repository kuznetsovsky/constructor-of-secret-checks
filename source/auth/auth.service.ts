import { type AccountInterface } from 'knex/types/tables'
import { knex } from '../../knex/connection'
import { type Profile } from './auth.interface'

export async function checkExistenceOfCompanyByName (name: string): Promise<boolean> {
  const company = await knex('companies')
    .select('id')
    .where({ name })
    .first()

  return company !== undefined
}

export async function checkAccountExistenceByEmail (email: string): Promise<boolean> {
  const account = await knex('accounts')
    .select('id')
    .where({ email })
    .first()

  return account !== undefined
}

export async function createCompany (name: string, email: string, password: string): Promise<number> {
  return await knex.transaction(async trx => {
    const account = await knex('accounts')
      .insert({
        role: 'administrator',
        email,
        password
      })
      .returning('id')
      .transacting(trx)

    const questionnaire = await knex('company_questionnaires')
      .insert({
        description: '',
        // TODO: create link company questionnaires link generator
        link: '/TODO/'
      })
      .returning('id')
      .transacting(trx)

    const company = await knex('companies')
      .insert({
        questionnaire_id: questionnaire[0].id,
        name
      })
      .returning('id')
      .transacting(trx)

    await knex('company_contact_persons')
      .insert({
        account_id: account[0].id,
        company_id: company[0].id
      })
      .transacting(trx)

    return account[0].id
  })
}

export async function createInspector (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<number> {
  return await knex.transaction(async (trx) => {
    const account = await knex('accounts')
      .insert({
        role: 'inspector',
        email,
        password
      })
      .returning('id')
      .transacting(trx)

    await knex('inspectors')
      .insert({
        account_id: account[0].id,
        first_name: firstName,
        last_name: lastName
      })
      .transacting(trx)

    return account[0].id
  })
}

export async function findVerifiedAccountByEmail (email: string): Promise<AccountInterface | undefined> {
  const result = await knex('accounts')
    .select('*')
    .where({ email })
    .whereNot('email_verified', null)
    .first()

  return result
}

export async function findUnverifiedAccountByEmail (email: string): Promise<AccountInterface | undefined> {
  const result = await knex('accounts')
    .select('*')
    .where({ email })
    .andWhere('email_verified', null)
    .first()

  return result
}

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

// TODO: сделать, после того как будет сделан функционал слздания менеджеров
// export async function findManagerProfile (id: number): Promise<ProfileInterface | undefined> {
//   return undefined
// }
