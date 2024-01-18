import { BaseRepository } from './base.repository'
import { paginate } from '../helpers/paginate.helper'
import { type EntryTypes } from '../../consts'
import { type City } from './city.repository'
import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'

export interface CompanyObjects {
  id: number
  entry_type: EntryTypes
  company_id: number
  city_id: number
  name: string
  street: string
  house_number: string
}

interface CompanyObjectsData {
  id: number
  entry_type: EntryTypes
  city: City
  name: string
  street: string
  house_number: string
}

export class CompanyObjectsRepository extends BaseRepository<CompanyObjects> {
  async findByPage (
    companyId: number,
    queries: BaseQueryString
  ): Promise<CompanyObjectsData[] | []> {
    const { limit, offset } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const objects = await this.knex('company_objects as o')
      .leftJoin('cities as c', 'c.id', 'o.city_id')
      .where('company_id', companyId)
      .select([
        'o.id',
        'o.entry_type',
        'o.name',
        'o.street',
        'o.house_number',
        this.knex.raw('to_json(c.*) as city')
      ])
      .offset(offset)
      .limit(limit)
      .orderBy(`o.${queries.sort}`, queries.direction)

    return objects
  }

  async findByID (companyId: number, objectId: number): Promise<CompanyObjectsData | undefined> {
    const object = await this.knex('company_objects as o')
      .leftJoin('cities as c', 'c.id', 'o.city_id')
      .where('o.company_id', companyId)
      .andWhere('o.id', objectId)
      .select([
        'o.id',
        'o.entry_type',
        'o.name',
        'o.street',
        'o.house_number',
        this.knex.raw('to_json(c.*) as city')
      ])
      .first()

    return object
  }
}
