import swaggerUi from 'swagger-ui-express'
import { StatusCodes } from 'http-status-codes'

import type {
  NextFunction,
  Request,
  Response,
  Application
} from 'express'

import { VERSION } from '../config'
import swaggerDocument from '../docs'
import { isAuthorized } from './common/helpers/is-authorized.helper'

import { router as authRouter } from './auth/auth.router'
import { router as userRouter } from './user/user.router'
import { router as usersRouter } from './users/users.router'
import { router as feedbackRouter } from './feedback/feedback.router'
import { router as emailVerificationRouter } from './email-verification/email-verification.router'
import { router as citiesRouter } from './cities/cities.router'

export function appRoutes (app: Application): void {
  // Before
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  app.get('/', (req: Request, res: Response): void => {
    res.send({ message: 'API is working, change to version /api/v1' })
  })

  // Routes
  app.use(`${VERSION}/auth`, authRouter)
  app.use(`${VERSION}/email-verification`, emailVerificationRouter)
  app.use(`${VERSION}/user`, isAuthorized, userRouter)
  app.use(`${VERSION}/users`, isAuthorized, usersRouter)
  app.use(`${VERSION}/feedback`, isAuthorized, feedbackRouter)
  app.use(`${VERSION}/cities`, isAuthorized, citiesRouter)

  // Affter
  app.use((req: Request, res: Response, next: NextFunction): void => {
    res.status(StatusCodes.NOT_FOUND).end()
  })

  app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    console.error(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
  })
}
