import Redis from 'ioredis'
import knexInstance from 'knex'

import * as cfg from '../config'
import knexConfig from '../knexfile'
import { REDIS_URL } from '../config'

export const knex = knexInstance(knexConfig[cfg.ENV])
export const redis = new Redis(REDIS_URL)
