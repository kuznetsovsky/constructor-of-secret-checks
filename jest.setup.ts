import { knex } from './knex/connection'
import { redis } from './source/session'

beforeEach(async () => {
  await knex.migrate.rollback()
  await knex.migrate.latest()
  await knex.seed.run()
})

afterAll(async () => {
  await knex.destroy()
  redis.disconnect()
})
