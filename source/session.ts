import Redis from 'ioredis'
import RedisStore from 'connect-redis'
import session, { MemoryStore } from 'express-session'
import { type Application } from 'express'

import {
  IS_TEST,
  REDIS_URL,
  SESSION_MAX_AGE,
  SESSION_SECRET
} from '../config'

const memoryStore = new MemoryStore()

export const redis = new Redis(REDIS_URL)
const redisStore = new RedisStore({
  client: redis,
  prefix: 'session'
})

export function expressSession (app: Application): void {
  app.use(
    session({
      store: IS_TEST ? memoryStore : redisStore,
      secret: SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: SESSION_MAX_AGE
      }
    })
  )
}
