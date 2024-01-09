import { knex, redis } from './source/connection'

beforeEach(async () => {
  await knex.migrate.rollback()
  await knex.migrate.latest()
  await knex.seed.run()
  await redis.flushall()
})

afterAll(async () => {
  await knex.destroy()
  redis.disconnect()
})
