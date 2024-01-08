import { BaseRepository } from './base.repository'
import { type City } from './city.repository'

export interface Inspector {
  id: number
  account_id: number
  city_id: number | null
  phone_number_id: number | null
  first_name: string | null
  last_name: string | null
  birthday: string | null
  vk_link: string | null
  address: string | null
}

export interface InspectorProfile {
  id: number
  email: string
  role: 'inspector'
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  birthday: string | null
  vk_link: string | null
  address: string | null
  city: City | null
}

export interface UpdateInspectorProfile {
  first_name: string
  last_name: string
  phone_number: string
  birthday: string
  vk_link: string
  address: string
  city_id: number
}

export class InspectorRepository extends BaseRepository<Inspector> {
  async findProfileByID (id: number): Promise<InspectorProfile | undefined> {
    const profile = await this.knex('accounts as a')
      .leftJoin('inspectors as i', 'i.account_id', 'a.id')
      .leftJoin('cities as c', 'c.id', 'i.city_id')
      .leftJoin('phone_numbers as p', 'p.id', 'i.phone_number_id')
      .where('a.id', id)
      .select([
        'a.id as id',
        'a.role as role',
        'a.email as email',
        'i.first_name as first_name',
        'i.last_name as last_name',
        'i.birthday as birthday',
        'i.vk_link as vk_link',
        'i.address as address',
        this.knex.raw('to_json(c.*) as city'),
        'p.phone_number as phone_number'
      ])
      .first()

    return profile
  }

  async updateProfileByID (id: number, data: UpdateInspectorProfile): Promise<void> {
    await this.knex.transaction(async (trx) => {
      const inspector = await this.knex('inspectors')
        .where('account_id', id)
        .update({
          address: data.address,
          birthday: data.birthday,
          first_name: data.first_name,
          last_name: data.last_name,
          city_id: data.city_id,
          vk_link: data.vk_link
        })
        .returning('phone_number_id')
        .transacting(trx)

      if (inspector[0].phone_number_id == null) {
        const phone = await this.knex('phone_numbers')
          .insert({ phone_number: data.phone_number })
          .returning('id')
          .transacting(trx)

        await this.knex('inspectors')
          .update('phone_number_id', phone[0].id)
          .transacting(trx)
      } else {
        await this.knex('phone_numbers')
          .update('phone_number', data.phone_number)
          .where('id', inspector[0].phone_number_id)
          .transacting(trx)
      }
    })
  }

  async createInspector (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<number> {
    return await this.knex.transaction(async (trx) => {
      const account = await this.knex('accounts')
        .insert({
          role: 'inspector',
          email,
          password
        })
        .returning('id')
        .transacting(trx)

      await this.knex('inspectors')
        .insert({
          account_id: account[0].id,
          first_name: firstName,
          last_name: lastName
        })
        .transacting(trx)

      return account[0].id
    })
  }
}
