import { BaseRepository } from './base.repository'

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

export class CompanyRepository extends BaseRepository<Company> {}
