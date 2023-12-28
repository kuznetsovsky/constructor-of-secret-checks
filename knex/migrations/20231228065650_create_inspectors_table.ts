import { type Knex } from 'knex'

const TABLE_NAME = 'inspectors'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.integer('account_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')
      t.integer('city_id')
        .unsigned()
        .references('id')
        .inTable('cities')
        .onDelete('SET NULL')
      t.integer('phone_number_id')
        .unsigned()
        .references('id')
        .inTable('phone_numbers')
        .onDelete('SET NULL')
      t.string('first_name', 16)
      t.string('last_name', 24)
      t.date('birthday')
      t.string('vk_link')
      t.string('address')
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
