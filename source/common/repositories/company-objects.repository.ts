import { BaseRepository } from './base.repository'
import { paginate } from '../helpers/paginate.helper'
import { type EntryTypes } from '../../consts'
import { type City } from './city.repository'

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
    page: number | undefined,
    perPage: number | undefined,
    sort: 'asc' | 'desc' = 'asc'
  ): Promise<CompanyObjectsData[] | []> {
    const { limit, offset } = paginate(page, perPage)

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
      .orderBy('o.id', sort)

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
