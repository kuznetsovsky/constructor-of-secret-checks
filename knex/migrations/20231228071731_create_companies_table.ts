import type { Knex } from 'knex'

const TABLE_NAME = 'companies'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.integer('questionnaire_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('company_questionnaires')
        .onDelete('CASCADE')
      t.string('name', 128).unique().notNullable()
      t.string('description', 255)
      t.string('logo_link', 255)
      t.string('website_link', 255)
      t.string('vk_link', 255)
      t.integer('number_of_checks').checkPositive()
      t.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
