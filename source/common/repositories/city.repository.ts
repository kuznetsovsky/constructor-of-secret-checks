import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'
import { paginate } from '../helpers/paginate.helper'
import { BaseRepository } from './base.repository'
import { createPaginationResult, type EntityPaginateInterface } from '../helpers/create-pagination-result.helper'

export interface City {
  id: number
  name: string
}

export interface CityByPage extends EntityPaginateInterface {
  cities: City[]
}

export class CityRepository extends BaseRepository<City> {
  async findByPage (queries: BaseQueryString): Promise<CityByPage | null> {
    const { limit, offset, page } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const cities = await this.qb
      .select('*')
      .offset(offset)
      .limit(limit)
      .orderBy(queries.sort, queries.direction)

    const { citiesCount } = await this.qb.count('id as citiesCount').first()
    const count = parseInt(citiesCount as string)
    const info = createPaginationResult(count, { limit, page })

    if (info == null) {
      return null
    } else {
      return Object.assign({}, { cities }, info)
    }
  }
}
