import { BaseRepository } from './base.repository'
import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'
import { paginate } from '../helpers/paginate.helper'

export interface CompanyChecksTypes {
  id: number
  company_id: number
  name: string
  created_at: string
  updated_at: string
}

interface CompanyCheckType {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export class CheckTypeRepository extends BaseRepository<CompanyChecksTypes> {
  async findByPage (queries: BaseQueryString, companyId?: number): Promise<CompanyCheckType[] | []> {
    const { limit, offset } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const query = this.qb
      .select([
        'id',
        'name',
        'created_at',
        'updated_at'
      ])

    if (companyId != null) {
      void query.where('company_id', companyId)
    }

    const types = await query
      .offset(offset)
      .limit(limit)
      .orderBy(queries.sort, queries.direction)

    return types
  }
}
