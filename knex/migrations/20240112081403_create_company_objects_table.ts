import { type Knex } from 'knex'

const TABLE_NAME = 'company_objects'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.enu(
        'entry_type',
        [
          'public',
          'manual'
        ],
        {
          useNative: true,
          enumName: 'object_entry_types'
        })
        .notNullable()

      t.integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')

      t.integer('city_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cities')
        .onDelete('SET NULL')

      t.string('name', 32).unique().notNullable()
      t.string('street', 60).notNullable()
      t.string('house_number', 8).notNullable()
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
  await knex.raw('DROP TYPE object_entry_types')
}
