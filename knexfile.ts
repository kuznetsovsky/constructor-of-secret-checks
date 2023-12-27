import type { Knex } from 'knex'
import * as cfg from './config'

const defaults = {
  client: 'pg',
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 10000
  },
  migrations: { directory: './knex/migrations' },
  seeds: { directory: './knex/seeds' }
}

export const knexConfig: Record<string, Knex.Config> = {
  test: {
    ...defaults,
    connection: cfg.DATABASE_CONNECTION_TEST
  },
  production: {
    ...defaults,
    connection: cfg.DATABASE_CONNECTION
  },
  development: {
    ...defaults,
    connection: cfg.DATABASE_CONNECTION
  }
}

export default knexConfig
