import { type Knex } from 'knex'

const TABLE_NAME = 'check_types'

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
      t.string('name', 32)
      t.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
