import { BaseRepository } from './base.repository'
import { type Tasks } from '../../companies/templates/templates.interface'
import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'
import { paginate } from '../helpers/paginate.helper'
import { type EntityPaginateInterface, createPaginationResult } from '../helpers/create-pagination-result.helper'

export interface CompanyTemplates {
  id: number
  company_id: number
  check_type_id: number
  task_name: string
  instruction: string
  tasks: Tasks[]
  created_at: string
  updated_at: string
}

interface CompanyTemplateList {
  id: number
  check_type: string
  task_name: string
}

interface CompanyTemplate {
  id: number
  instrction: string
  tasks: Tasks[]
}

export interface TemplatesByPage extends EntityPaginateInterface {
  templates: CompanyTemplateList[]
}

export class CompanyTemplatesRepository extends BaseRepository<CompanyTemplates> {
  async findByPage (queries: BaseQueryString, companyId?: number): Promise<TemplatesByPage | null> {
    const { limit, offset, page } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const query = this.knex('company_templates as t')
      .leftJoin('check_types as c', 't.check_type_id', 'c.id')
      .select([
        't.id',
        'c.name as check_type',
        't.task_name'
      ])

    if (companyId != null) {
      void query.where('t.company_id', companyId)
    }

    const templates = await query
      .offset(offset)
      .limit(limit)
      .orderBy(queries.sort, queries.direction)

    const { templatesCount } = await this.qb.count('id as templatesCount').first()
    const count = parseInt(templatesCount as string)
    const info = createPaginationResult(count, { limit, page })

    if (info == null) {
      return null
    } else {
      return Object.assign({}, { templates }, info)
    }
  }

  async findByID (templateId: number, companyId?: number): Promise<CompanyTemplate | undefined> {
    const query = this.knex('company_templates as t')
      .where('t.id', templateId)
      .select([
        't.id',
        't.task_name',
        't.instruction',
        't.tasks'
      ])

    if (companyId != null) {
      void query.andWhere('t.company_id', companyId)
    }

    const template = await query.first()

    return template
  }

  async findPreviewByID (templateId: number, companyId: number): Promise<CompanyTemplate | undefined> {
    const template = await this.knex('company_templates as t')
      .leftJoin('companies as c', 't.company_id', 'c.id')
      .leftJoin('company_logos as l', 'c.id', 'l.id')
      .where('t.id', templateId)
      .andWhere('t.company_id', companyId)
      .select([
        't.id',
        't.task_name',
        't.instruction',
        't.tasks',
        'l.src as logo_url'
      ])
      .first()

    return template
  }
}
