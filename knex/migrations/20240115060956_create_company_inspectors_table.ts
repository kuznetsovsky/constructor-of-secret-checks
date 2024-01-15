import { type Knex } from 'knex'

const TABLE_NAME = 'company_inspectors'

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
      t.integer('inspector_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('inspectors')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      t.integer('city_id')
        .unsigned()
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
      t.enu(
        'status',
        [
          'verification',
          'approved',
          'deviation'
        ],
        {
          useNative: true,
          enumName: 'company_inspector_statuses'
        })
        .notNullable()
      t.string('email', 32).notNullable()
      t.string('first_name', 16).notNullable()
      t.string('last_name', 24).notNullable()
      t.date('birthday')
      t.string('vk_link', 60)
      t.string('address', 60)
      t.string('note', 90)
      t.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
  await knex.raw('DROP TYPE company_inspector_statuses')
}
