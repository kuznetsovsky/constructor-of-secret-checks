import { type Knex } from 'knex'

const TABLE_NAME = 'cities'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.string('name', 64)
        .unique()
        .notNullable()
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
