import { BaseRepository } from './base.repository'
import { type Tasks } from '../../companies/templates/templates.interface'
import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'
import { paginate } from '../helpers/paginate.helper'

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

export class CompanyTemplatesRepository extends BaseRepository<CompanyTemplates> {
  async findByPage (queries: BaseQueryString, companyId?: number): Promise<CompanyTemplateList[] | []> {
    const { limit, offset } = paginate(parseInt(queries.page), parseInt(queries.per_page))

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

    return templates
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
      .where('t.id', templateId)
      .andWhere('t.company_id', companyId)
      .select([
        't.id',
        't.task_name',
        't.instruction',
        't.tasks',
        'c.logo_link as logo_url'
      ])
      .first()

    return template
  }
}
