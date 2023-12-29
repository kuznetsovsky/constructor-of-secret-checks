import { type Application } from 'express'
import { VERSION } from '../config'
import { router as authRouter } from './auth/auth.router'

export function appRoutes (app: Application): void {
  app.use(`${VERSION}/auth`, authRouter)
}
