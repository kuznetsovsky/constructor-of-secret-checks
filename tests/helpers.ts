import { knex, redis } from '../source/connection'

export async function databasesCleaning (): Promise<void> {
  await knex.migrate.rollback()
  await knex.migrate.latest()
  await knex.seed.run()
  await redis.flushall()
}

export async function databasesDisconnection (): Promise<void> {
  await knex.destroy()
  redis.disconnect()
}
