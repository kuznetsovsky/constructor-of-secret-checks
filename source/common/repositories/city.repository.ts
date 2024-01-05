import { BaseRepository } from './base.repository'

export interface City {
  id: number
  name: string
}

export class CityRepository extends BaseRepository<City> {}
