import { type Knex } from 'knex'

const TABLE_NAME = 'phone_numbers'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.string('phone_number', 16)
        .unique()
        .notNullable()
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
