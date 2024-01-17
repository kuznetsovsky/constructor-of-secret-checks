import { type Roles } from '../../consts'
import { BaseRepository } from './base.repository'

export interface Manager {
  id: number
  company_id: number
  account_id: number
  first_name: string
  last_name: string
  email: string
  city_id: number
  phone_number_id: number
}

interface Company {
  id: number
  name: string
}

export interface ManagerProfile {
  id: number
  email: string
  role: Roles.Manager
  first_name: string
  last_name: string
  phone_number: string
  company: Company
}

export class ManagerRepository extends BaseRepository<Manager> {
  async findProfileByID (id: number): Promise<ManagerProfile | undefined> {
    const profile = await this.knex('accounts as a')
      .leftJoin('company_employees as e', 'a.id', 'e.account_id')
      .leftJoin('phone_numbers as t', 'e.phone_number_id', 't.id')
      .leftJoin('companies as c', 'e.company_id', 'c.id')
      .where('a.id', id)
      .select([
        'a.id',
        'a.role',
        'a.email',
        'e.first_name',
        'e.last_name',
        this.knex.raw("json_build_object('id', c.id, 'name', c.name) AS company"),
        't.phone_number as phone_number'
      ])
      .first()

    return profile
  }
}
