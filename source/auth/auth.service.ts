import { knex } from '../../knex/connection'

export async function findCompanyByName (name: string): Promise<boolean> {
  const company = await knex('companies')
    .select('id')
    .where({ name })
    .first()

  return company !== undefined
}

export async function findAccountByEmail (email: string): Promise<boolean> {
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
