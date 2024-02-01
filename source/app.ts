import express from 'express'
import morgan from 'morgan'

import { ENV, IS_DEV } from '../config'
import { appRoutes } from './routes'
import { expressSession } from './session'
import { type Roles } from './consts'

export interface UserSessionData {
  id: number
  role: Roles
  cid?: number
}

declare module 'express-session' {
  interface SessionData {
    user: UserSessionData
  }
}

export const app = express()
app.use(express.json())
app.use('/public', express.static('public'))

expressSession(app)

if (ENV !== 'test') {
  app.use(morgan(IS_DEV ? 'dev' : 'combined'))
}

appRoutes(app)
