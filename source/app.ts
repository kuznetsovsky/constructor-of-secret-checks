import express from 'express'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { StatusCodes } from 'http-status-codes'
import type { NextFunction, Request, Response } from 'express'

import swaggerDocument from '../docs'
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

expressSession(app)

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
