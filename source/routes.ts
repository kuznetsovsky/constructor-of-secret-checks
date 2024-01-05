import { type Application } from 'express'
import { VERSION } from '../config'
import { router as authRouter } from './auth/auth.router'
import { router as userRouter } from './user/user.router'
import { router as usersRouter } from './users/users.router'
import { isAuthorized } from './common/helpers/is-authorized.helper'

export function appRoutes (app: Application): void {
  app.use(`${VERSION}/auth`, authRouter)
  app.use(`${VERSION}/user`, isAuthorized, userRouter)
  app.use(`${VERSION}/users`, isAuthorized, usersRouter)
}