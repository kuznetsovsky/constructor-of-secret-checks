import { paginate } from '../helpers/paginate.helper'
import { BaseRepository } from './base.repository'

export interface City {
  id: number
  name: string
}

export class CityRepository extends BaseRepository<City> {
  async findByPage (
    page: number | undefined,
    perPage: number | undefined,
    sort: 'asc' | 'desc' = 'asc'
  ): Promise<City[] | []> {
    const { limit, offset } = paginate(page, perPage)

    const cities = await this.qb
      .select('*')
      .offset(offset)
      .limit(limit)
      .orderBy('id', sort)

    return cities
  }
}
