import RedisStore from 'connect-redis'
import session, { MemoryStore } from 'express-session'
import { type Application } from 'express'

import { redis } from './connection'

import {
  IS_TEST,
  SESSION_MAX_AGE,
  SESSION_SECRET
} from '../config'

const memoryStore = new MemoryStore()

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
