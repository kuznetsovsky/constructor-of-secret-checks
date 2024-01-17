import { BaseRepository } from './base.repository'
import { type Company } from './company.repository'

export interface Administrator {
  id: number
  account_id: number
  company_id: number
  phone_number_id: number | null
  first_name: string | null
  last_name: string | null
}

export interface AdministratorProfile {
  id: number
  email: string
  role: 'administrator'
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  company: Company | null
}

export interface UpdateAdministratorProfile {
  first_name: string
  last_name: string
  phone_number: string
}

export class AdminsitratorRepository extends BaseRepository<Administrator> {
  async findProfileByID (id: number): Promise<AdministratorProfile | undefined> {
    const profile = await this.knex('accounts as a')
      .leftJoin('company_contact_persons as p', 'p.account_id', 'a.id')
      .leftJoin('phone_numbers as t', 't.id', 'p.phone_number_id')
      .leftJoin('companies as c', 'c.id', 'p.company_id')
      .where('a.id', id)
      .select([
        'a.id as id',
        'a.role as role',
        'a.email as email',
        'p.first_name as first_name',
        'p.last_name as last_name',
        this.knex.raw("json_build_object('id', c.id, 'name', c.name) AS company"),
        't.phone_number as phone_number'
      ])
      .first()

    return profile
  }

  async updateProfileByID (id: number, data: UpdateAdministratorProfile): Promise<void> {
    await this.knex.transaction(async (trx) => {
      const admin = await this.knex<Administrator>('company_contact_persons')
        .update({
          first_name: data.first_name,
          last_name: data.last_name
        })
        .where('account_id', id)
        .transacting(trx)
        .returning('phone_number_id')

      if (admin[0].phone_number_id == null) {
        const phone = await this.knex('phone_numbers')
          .insert({ phone_number: data.phone_number })
          .returning('id')
          .transacting(trx)

        await this.knex('company_contact_persons')
          .update('phone_number_id', phone[0].id)
          .transacting(trx)
      } else {
        await this.knex('phone_numbers')
          .update('phone_number', data.phone_number)
          .where('id', admin[0].phone_number_id)
          .transacting(trx)
      }
    })
  }
}
