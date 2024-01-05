import { BaseRepository } from './base.repository'

export interface Administrator {
  id: number
  account_id: number
  company_id: number
  phone_number_id: number | null
  first_name: string | null
  last_name: string | null
}

export class AdminsitratorRepository extends BaseRepository<Administrator> {}
