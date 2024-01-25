import type { Knex } from 'knex'

const TABLE_NAME = 'company_questionnaires'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.string('link').notNullable()
      t.string('token').notNullable()
      t.string('description').notNullable()
      t.boolean('is_required_city').defaultTo(true)
      t.boolean('is_required_address').defaultTo(true)
      t.boolean('is_required_phone_number').defaultTo(true)
      t.boolean('is_required_vk_link').defaultTo(true)
      t.boolean('is_required_birthday').defaultTo(true)
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
