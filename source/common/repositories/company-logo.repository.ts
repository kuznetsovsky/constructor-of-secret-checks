import { BaseRepository } from './base.repository'

export interface CompanyLogo {
  id: number
  company_id: number
  src: string
  created_at: string
  updated_at: string
}

export class CompanyLogoRepository extends BaseRepository<CompanyLogo> {}
