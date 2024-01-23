import { type Knex } from 'knex'

const TABLE_NAME = 'company_templates'

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
      t.integer('check_type_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('check_types')
        .onDelete('CASCADE')
      t.string('task_name', 64)
        .notNullable()
      t.text('instruction')
        .notNullable()
      t.json('tasks')
        .notNullable()
      t.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
