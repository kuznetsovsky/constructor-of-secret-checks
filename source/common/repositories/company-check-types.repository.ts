import { paginate } from '../helpers/paginate.helper'
import { BaseRepository } from './base.repository'
import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'
import { createPaginationResult, type EntityPaginateInterface } from '../helpers/create-pagination-result.helper'

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

interface CheckTypesByPage extends EntityPaginateInterface {
  types: CompanyCheckType[]
}

export class CheckTypeRepository extends BaseRepository<CompanyChecksTypes> {
  async findByPage (queries: BaseQueryString, companyId?: number): Promise<CheckTypesByPage | null> {
    const { limit, offset, page } = paginate(parseInt(queries.page), parseInt(queries.per_page))

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

    const { typesCount } = await this.qb.count('id as typesCount').first()
    const count = parseInt(typesCount as string)
    const info = createPaginationResult(count, { limit, page })

    if (info == null) {
      return null
    } else {
      return Object.assign({}, { types }, info)
    }
  }
}
