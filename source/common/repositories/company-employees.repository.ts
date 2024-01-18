import { Roles } from '../../consts'
import { BaseRepository } from './base.repository'
import { paginate } from '../helpers/paginate.helper'
import { type BaseQueryString } from '../helpers/validate-queries/validate-queries.helper'

interface CompanyEmployee {
  id: number
  company_id: number
  account_id: number
  first_name: string
  last_name: string
  email: string
  city_id: number
  phone_number_id: number
}

interface CreateEmployee {
  first_name: string
  last_name: string
  email: string
  password: string
  city_id: number
  companyId: number
}

interface UpdateEmployee {
  first_name: string
  last_name: string
  city_id: number
  phone_number: string
}

interface EmployeeProfile {
  id: number
  role: Roles
  account_id: number
  first_name: string
  last_name: string
  email: string
  city: string
  phone_number: string | null
  created_at: string
  updated_at: string
}

export class CompanyEmployeesRepository extends BaseRepository<CompanyEmployee> {
  async findByPage (companyId: number, queries: BaseQueryString): Promise<EmployeeProfile[] | []> {
    const { limit, offset } = paginate(parseInt(queries.page), parseInt(queries.per_page))

    const employees = await this.knex('company_employees as e')
      .leftJoin('accounts as a', 'e.account_id', 'a.id')
      .leftJoin('cities as c', 'e.city_id', 'c.id')
      .leftJoin('phone_numbers as p', 'e.phone_number_id', 'p.id')
      .where('e.company_id', companyId)
      .select([
        'e.id',
        'e.account_id',
        'a.email',
        'a.role',
        'e.first_name',
        'e.last_name',
        'e.created_at',
        'e.updated_at',
        'c.name as city',
        'p.phone_number'
      ])
      .offset(offset)
      .limit(limit)
      .orderBy(`e.${queries.sort}`, queries.direction)

    return employees
  }

  async createEmployee (data: CreateEmployee): Promise<number> {
    return await this.knex.transaction(async (trx) => {
      const account = await this.knex('accounts')
        .insert({
          role: Roles.Manager,
          email: data.email,
          password: data.password,
          email_verified: this.knex.fn.now()
        })
        .returning('id')
        .transacting(trx)

      const phone = await this.knex('phone_numbers')
        .insert({ phone_number: '' })
        .returning('id')
        .transacting(trx)

      const employee = await this.knex('company_employees')
        .insert({
          account_id: account[0].id,
          company_id: data.companyId,
          phone_number_id: phone[0].id,
          first_name: data.first_name,
          last_name: data.last_name,
          city_id: data.city_id
        })
        .returning('id')
        .transacting(trx)

      return employee[0].id
    })
  }

  async findProfile (employeeId: number, companyId?: number): Promise<EmployeeProfile | undefined> {
    const query = this.knex('company_employees as e')
      .leftJoin('accounts as a', 'e.account_id', 'a.id')
      .leftJoin('cities as c', 'e.city_id', 'c.id')
      .leftJoin('phone_numbers as p', 'e.phone_number_id', 'p.id')
      .select([
        'e.id',
        'e.account_id',
        'a.email',
        'a.role',
        'e.first_name',
        'e.last_name',
        'e.created_at',
        'e.updated_at',
        'c.name as city',
        'p.phone_number'
      ])
      .where('e.id', employeeId)

    if (companyId != null) {
      void query.andWhere('e.company_id', companyId)
    }

    const employee = await query.first()
    return employee
  }

  async updateEmployee (employeeId: number, companyId: number, data: UpdateEmployee): Promise<void> {
    await this.knex.transaction(async (trx) => {
      const employee = await this.knex<CompanyEmployee>('company_employees')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          city_id: data.city_id
        })
        .where('id', employeeId)
        .andWhere('company_id', companyId)
        .returning('*')
        .transacting(trx)

      await this.knex('phone_numbers')
        .update({ phone_number: data.phone_number })
        .where('id', employee[0].phone_number_id)
        .transacting(trx)
    })
  }
}
