import type { Knex } from 'knex'

const TABLE_NAME = 'company_contact_persons'

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
      t.integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
      t.integer('phone_number_id')
        .unsigned()
        .references('id')
        .inTable('phone_numbers')
        .onDelete('SET NULL')
      t.string('first_name', 16)
      t.string('last_name', 24)
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
