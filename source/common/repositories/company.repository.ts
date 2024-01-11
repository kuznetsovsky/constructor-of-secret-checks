import { BaseRepository } from './base.repository'
import { paginate } from '../helpers/paginate.helper'

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

interface CompanyListProfile {
  id: number
  name: string
  description: string | null
  website_link: string | null
  vk_link: string | null
}

interface Administrator {
  id: number
  first_name: string | null
  last_name: string | null
  phone_number: string | null
}

interface CompanyProfile extends CompanyListProfile {
  administrator: Administrator
}

export class CompanyRepository extends BaseRepository<Company> {
  async findByPage (
    page: number | undefined,
    perPage: number | undefined,
    sort: 'asc' | 'desc' = 'asc'
  ): Promise<CompanyListProfile[] | []> {
    const { limit, offset } = paginate(page, perPage)

    const companies = await this.qb
      .select([
        'id',
        'name',
        'description',
        'website_link',
        'vk_link'
      ])
      .offset(offset)
      .limit(limit)
      .orderBy('id', sort)

    return companies
  }

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

  async findProfileByID (id: number): Promise<CompanyProfile | undefined> {
    const company = await this.knex('companies as c')
      .leftJoin('company_contact_persons as p', 'p.company_id', 'c.id')
      .leftJoin('phone_numbers as t', 't.id', 'p.phone_number_id')
      .where('c.id', id)
      .select([
        'c.id',
        'c.name',
        'c.description',
        'c.website_link',
        'c.vk_link',
        this.knex.raw("json_build_object('id', p.id, 'first_name', p.first_name, 'last_name', p.last_name, 'phone_number', t.phone_number) AS administrator")
      ])
      .first()

    return company as unknown as CompanyProfile | undefined
  }
}
