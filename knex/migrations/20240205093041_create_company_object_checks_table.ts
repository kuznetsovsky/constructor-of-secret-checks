import { type Knex } from 'knex'

const TABLE_NAME = 'object_checks'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.integer('template_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('company_templates')
        .onDelete('CASCADE')
      t.integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
      t.integer('object_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('company_objects')
        .onDelete('CASCADE')
      t.integer('check_type_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('check_types')
        .onDelete('CASCADE')
      t.integer('inspector_id')
        .unsigned()
        .references('id')
        .inTable('inspectors')
        .onDelete('CASCADE')
      t.enu(
        'status',
        [
          'appointed',
          'checking',
          'revision',
          'fulfilled',
          'refusal'
        ],
        {
          useNative: true,
          enumName: 'object_checks_status'
        })
        .defaultTo('appointed')
      t.text('link_url')
        .notNullable()
      t.timestamp('date_of_inspection')
        .defaultTo(knex.fn.now())
        // TODO: dont default
      t.string('comments', 128)
      t.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
  await knex.raw('DROP TYPE object_checks_status')
}
