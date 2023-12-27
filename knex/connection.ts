import knexInstance from 'knex'
import knexConfig from '../knexfile'
import * as cfg from '../config'

// declare module 'knex/types/tables' {
//   interface Tables { }
// }

export const knex = knexInstance(knexConfig[cfg.ENV])

async function checkConnectionToPostgres (): Promise<void> {
  try {
    await knex.raw('SELECT now();')
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    throw new Error(error)
  }
}

void checkConnectionToPostgres()
