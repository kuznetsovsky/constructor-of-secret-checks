import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import session from 'express-session'
import connectSessionKnex from 'connect-session-knex'

import { ENV, IS_DEV, SESSION_SECRET, SESSION_MAX_AGE } from '../config'
import swaggerDocument from '../docs'
import { appRoutes } from './routes'
import { type Roles } from './consts'
import { knex } from '../knex/connection'

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

const KnexSessionStore = connectSessionKnex(session)
const store = new KnexSessionStore({
  knex
})

app.use(
  session({
    store,
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: SESSION_MAX_AGE
    }
  })
)

if (ENV !== 'test') {
  app.use(morgan(IS_DEV ? 'dev' : 'combined'))
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req: Request, res: Response): void => {
  res.send({ message: 'API is working, change to version /api/v1' })
})

appRoutes(app)

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.status(StatusCodes.NOT_FOUND).end()
})

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err)
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
})
