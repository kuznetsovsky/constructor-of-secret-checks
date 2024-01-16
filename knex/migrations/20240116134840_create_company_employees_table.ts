import { type Knex } from 'knex'

const TABLE_NAME = 'company_employees'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      t.integer('account_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      t.integer('city_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cities')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      t.integer('phone_number_id')
        .unsigned()
        .references('id')
        .inTable('phone_numbers')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      t.string('first_name', 16).notNullable()
      t.string('last_name', 24).notNullable()
      t.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
