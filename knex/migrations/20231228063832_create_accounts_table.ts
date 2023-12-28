import { type Knex } from 'knex'

const TABLE_NAME = 'accounts'

export async function up (knex: Knex): Promise<void> {
  await knex.schema
    .createTable(TABLE_NAME, (t) => {
      t.increments()
      t.enu(
        'role',
        [
          'inspector',
          'manager',
          'administrator',
          'sysadmin'
        ],
        {
          useNative: true,
          enumName: 'account_roles'
        })
        .notNullable()
      t.string('email', 255).unique().notNullable()
      t.string('password').notNullable()
      t.timestamp('email_verified').defaultTo(null)
      t.timestamp('created_at').defaultTo(knex.fn.now())
      t.timestamp('last_visit').defaultTo(knex.fn.now())
    })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
  await knex.raw('DROP TYPE account_roles')
}
