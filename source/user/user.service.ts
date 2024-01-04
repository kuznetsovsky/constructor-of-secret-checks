import { knex } from '../../knex/connection'
import { type InspectorProfile, type AdminProfile } from './user.interface'

export async function updateAdminProfile (id: number, data: AdminProfile): Promise<void> {
  await knex.transaction(async (trx) => {
    const admin = await knex('company_contact_persons')
      .update({
        first_name: data.first_name,
        last_name: data.last_name
      })
      .where('account_id', id)
      .transacting(trx)
      .returning('phone_number_id')

    if (admin[0].phone_number_id == null) {
      const phone = await knex('phone_numbers')
        .insert({ phone_number: data.phone_number })
        .returning('id')
        .transacting(trx)

      await knex('company_contact_persons')
        .update('phone_number_id', phone[0].id)
        .transacting(trx)
    } else {
      await knex('phone_numbers')
        .update('phone_number', data.phone_number)
        .where('id', admin[0].phone_number_id)
        .transacting(trx)
    }
  })
}

interface City {
  id: number
  name: string
}

export async function findCityByID (id: number): Promise<City | undefined> {
  const city = await knex('cities')
    .select('*')
    .where({ id })
    .first()

  return city
}

export async function updateInspectorProfile (id: number, data: InspectorProfile): Promise<void> {
  await knex.transaction(async (trx) => {
    const inspector = await knex('inspectors')
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
      const phone = await knex('phone_numbers')
        .insert({ phone_number: data.phone_number })
        .returning('id')
        .transacting(trx)

      await knex('inspectors')
        .update('phone_number_id', phone[0].id)
        .transacting(trx)
    } else {
      await knex('phone_numbers')
        .update('phone_number', data.phone_number)
        .where('id', inspector[0].phone_number_id)
        .transacting(trx)
    }
  })
}
