import { type CreateCompanyInspector } from '../../companies/inspectors/inspectors.interface'
import { Roles, InspectorStatus } from '../../consts'
import { paginate } from '../helpers/paginate.helper'
import { BaseRepository } from './base.repository'
import { type City } from './city.repository'

interface CompanyInspector {
  id: number
  company_id: number
  account_id: number
  inspector_id: number
  city_id: number
  phone_number_id: number
  status: InspectorStatus
  email: string
  first_name: string
  last_name: string
  birthday: string | null
  address: string | null
  note: string | null
  created_at: string
  updated_at: string
}

interface CompanyInspectorList {
  id: number
  company_id: number
  account_id: number
  inspector_id: number
  city: City
  phone_number: string | null
  status: InspectorStatus
  email: string
  first_name: string
  last_name: string
  // TODO:
  // Добавить дату последней проверки
}

interface CompanyInspectorProfile {
  id: number
  account_id: number
  inspector_id: number
  city: City
  phone_number: string
  status: InspectorStatus
  email: string
  first_name: string
  last_name: string
  birthday: string | null
  address: string | null
  note: string | null
  created_at: string
}

interface QueryData {
  city?: number | null
  surname?: string
}

export class CompanyInspectorRepository extends BaseRepository<CompanyInspector> {
  async findByPage (
    companyId: number,
    page: number | undefined,
    perPage: number | undefined,
    sort: 'asc' | 'desc' = 'asc',
    queryData: QueryData
  ): Promise<CompanyInspectorList[] | []> {
    const { limit, offset } = paginate(page, perPage)

    const query = this.knex('company_inspectors as i')
      .leftJoin('cities as c', 'i.city_id', 'c.id')
      .leftJoin('phone_numbers as t', 'i.phone_number_id', 't.id')
      .where('i.company_id', companyId)
      .select([
        'i.id',
        'i.account_id',
        'i.inspector_id',
        'i.status',
        'i.email',
        'i.first_name',
        'i.last_name',
        't.phone_number',
        this.knex.raw('to_json(c.*) as city')
      ])

    if (queryData.city != null) {
      void query.andWhere('city_id', queryData.city)
    }

    if (queryData.surname != null) {
      void query.andWhereILike('last_name', `%${queryData.surname}%`)
    }

    const inspectors = await query
      .offset(offset)
      .limit(limit)
      .orderBy('id', sort)

    return inspectors
  }

  async findCompanyInspectorByID (companyId: number, inspectorId: number): Promise<CompanyInspectorProfile | undefined> {
    const inspector = await this.knex('company_inspectors as i')
      .leftJoin('cities as c', 'i.city_id', 'c.id')
      .leftJoin('phone_numbers as t', 'i.phone_number_id', 't.id')
      .where('i.company_id', companyId)
      .andWhere('i.id', inspectorId)
      .select([
        'i.id',
        'i.account_id',
        'i.inspector_id',
        'i.status',
        'i.email',
        'i.first_name',
        'i.last_name',
        't.phone_number',
        'i.birthday',
        'i.vk_link',
        'i.note',
        'i.address',
        'i.created_at',
        this.knex.raw('to_json(c.*) as city')
      ])
      .first()

    return inspector
  }

  async createNewInspector (data: CreateCompanyInspector & { password: string, companyId: number }): Promise<number> {
    return await this.knex.transaction(async (trx) => {
      const account = await this.knex('accounts')
        .insert({
          role: Roles.Inspector,
          email: data.email,
          password: data.password,
          email_verified: this.knex.fn.now()
        })
        .returning('id')
        .transacting(trx)

      const phone = await this.knex('phone_numbers')
        .insert({
          phone_number: data.phone_number ?? ''
        })
        .returning('id')
        .transacting(trx)

      const inspector = await this.knex('inspectors')
        .insert({
          account_id: account[0].id,
          first_name: data.first_name,
          last_name: data.last_name,
          birthday: data.birthday,
          city_id: data.city_id,
          vk_link: data.vk_link,
          address: data.address,
          phone_number_id: phone[0].id
        })
        .returning('id')
        .transacting(trx)

      const companyInspector = await this.knex('company_inspectors')
        .insert({
          company_id: data.companyId,
          account_id: account[0].id,
          inspector_id: inspector[0].id,
          city_id: data.city_id,
          phone_number_id: phone[0].id,
          status: InspectorStatus.Verification,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          birthday: data.birthday ?? null,
          vk_link: data.vk_link ?? null,
          address: data.address ?? null
        })
        .returning('id')
        .transacting(trx)

      return companyInspector[0].id as number
    })
  }
}
