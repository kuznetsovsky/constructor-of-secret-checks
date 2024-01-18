import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'
import { paginate } from '../helpers/paginate.helper'
import { BaseRepository } from './base.repository'

export interface City {
  id: number
  name: string
}

export class CityRepository extends BaseRepository<City> {
  async findByPage (queries: BaseQueryString): Promise<City[] | []> {
    const { limit, offset } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const cities = await this.qb
      .select('*')
      .offset(offset)
      .limit(limit)
      .orderBy(queries.sort, queries.direction)

    return cities
  }
}
