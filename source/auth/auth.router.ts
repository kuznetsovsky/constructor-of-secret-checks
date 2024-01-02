import express from 'express'
import * as authController from './auth.controller'
import { validateBody } from '../helpers'

import {
  signInValidator,
  signUpAdministratorValidator,
  signUpInspectorValidator
} from './auth.validator'

export const router = express.Router()

router.post(
  '/sign-up/company',
  validateBody(signUpAdministratorValidator),
  authController.signUpCompany
)

router.post(
  '/sign-up/inspector',
  validateBody(signUpInspectorValidator),
  authController.signUpInspector
)

router.post(
  '/sign-in',
  validateBody(signInValidator),
  authController.signIn
)

router.delete(
  '/sign-out',
  authController.signOut
)
