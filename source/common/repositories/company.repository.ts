import { BaseRepository } from './base.repository'

export interface Company {
  id: number
  questionnaire_id: number
  name: string
  description: string | null
  website_link: string | null
  vk_link: string | null
  logo: string | null
  number_of_checks: number | null
  created_at: string
  updated_at: string
}

export class CompanyRepository extends BaseRepository<Company> {
  async createAdministrator (name: string, email: string, password: string): Promise<number> {
    return await this.knex.transaction(async (trx) => {
      const account = await this.knex('accounts')
        .insert({
          role: 'administrator',
          email,
          password
        })
        .returning('id')
        .transacting(trx)

      const questionnaire = await this.knex('company_questionnaires')
        .insert({
          description: '',
          // TODO: create link company questionnaires link generator
          link: '/TODO/'
        })
        .returning('id')
        .transacting(trx)

      const company = await this.knex('companies')
        .insert({
          questionnaire_id: questionnaire[0].id,
          name
        })
        .returning('id')
        .transacting(trx)

      await this.knex('company_contact_persons')
        .insert({
          account_id: account[0].id,
          company_id: company[0].id
        })
        .transacting(trx)

      return account[0].id
    })
  }
}
