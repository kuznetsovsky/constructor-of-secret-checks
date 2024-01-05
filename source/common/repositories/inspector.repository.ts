import { BaseRepository } from './base.repository'

export interface Inspector {
  id: number
  account_id: number
  city_id: number | null
  phone_number_id: number | null
  first_name: string | null
  last_name: string | null
  birthday: string | null
  vk_link: string | null
  address: string | null
}

export class InspectorRepository extends BaseRepository<Inspector> {}
