import { type ObjectCheckStatus } from '../../consts'
import { BaseRepository } from './base.repository'
import { paginate } from '../helpers/paginate.helper'
import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'

import {
  createPaginationResult,
  type EntityPaginateInterface
} from '../helpers/create-pagination-result.helper'

export interface CompanyObjectCheck {
  id: number
  template_id: number
  company_id: number
  object_id: number
  check_type_id: number
  inspector_id: number | null
  status: ObjectCheckStatus
  link_url: string
  date_of_inspection: string
  comments: string
  created_at: string
  updated_at: string
}

interface CheckList {
  id: number
  status: ObjectCheckStatus
  date_of_inspection: string
  task_name: string
  inspector_name: string
  type_name: string
  created_at: string
  updated_at: string
}

interface CheckByPage extends EntityPaginateInterface {
  checks: CheckList[]
}

interface ObjectInterface {
  id: number
  name: string
  street: string
  house_number: string
  city: string
}

interface Inspector {
  id: number
  first_name: string
  last_name: string
  vk_link: string
  email: string
  city: string
  phone_number: string
}

interface CheckByID {
  id: number
  link_url: string
  date_of_inspection: string
  type_name: string
  comments: string | null
  object: ObjectInterface
  inspector: Inspector
}

export class CompanyObjectCheckRepository extends BaseRepository<CompanyObjectCheck> {
  async findByPage (
    companyId: number,
    objectId: number,
    queries: BaseQueryString): Promise<CheckByPage | null> {
    const { limit, offset, page } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const checks = await this.knex('object_checks as c')
      .leftJoin('company_templates as t', 'c.template_id', 't.id')
      .leftJoin('check_types as ct', 'c.check_type_id', 'ct.id')
      .leftJoin('company_inspectors as i', 'c.inspector_id', 'i.id')
      .where('c.company_id', companyId)
      .andWhere('c.object_id', objectId)
      .select([
        'c.id',
        'c.status',
        't.task_name',
        'ct.name as type_name',
        'c.date_of_inspection',
        this.knex.raw("concat(i.first_name, ' ', i.last_name) as inspector_name"),
        'c.created_at',
        'c.updated_at'
      ])
      .offset(offset)
      .limit(limit)
      .orderBy(queries.sort, queries.direction)

    const { checksCount } = await this.qb.count('id as checksCount').first()
    const count = parseInt(checksCount as string)
    const info = createPaginationResult(count, { limit, page })

    if (info == null) {
      return null
    } else {
      return Object.assign({}, { checks }, info)
    }
  }

  async findByID (checkId: number, objectId: number, companyId: number): Promise<CheckByID | undefined> {
    const check = await this.knex('object_checks as c')
      .leftJoin('check_types as ct', 'c.check_type_id', 'ct.id')
      .leftJoin('company_objects as o', 'c.object_id', 'o.id')
      .leftJoin('cities as oc', 'o.city_id', 'oc.id')
      .leftJoin('company_inspectors as i', 'c.inspector_id', 'i.id')
      .leftJoin('cities as ic', 'i.city_id', 'ic.id')
      .leftJoin('phone_numbers as ip', 'i.phone_number_id', 'ip.id')
      .where('c.id', checkId)
      .andWhere('c.object_id', objectId)
      .andWhere('c.company_id', companyId)
      .select([
        'c.id',
        'c.link_url',
        'c.date_of_inspection',
        'c.comments',
        'ct.name as type_name',
        this.knex.raw(`
          json_build_object(
            'id', o.id,
            'name', o.name,
            'street', o.street,
            'house_number', o.house_number,
            'city', oc.name
          ) as object
        `),
        this.knex.raw(`
          json_build_object(
            'id', i.id,
            'first_name', i.first_name,
            'last_name', i.last_name,
            'vk_link', i.vk_link,
            'email', i.email,
            'city', ic.name,
            'phone_number', ip.phone_number
          ) AS inspector
        `)
      ])
      .first()

    return check
  }
}
