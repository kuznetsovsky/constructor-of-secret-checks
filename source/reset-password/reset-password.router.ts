import express from 'express'

import * as resetPasswordController from './reset-password.controller'
import { validateBody } from '../common/helpers/validate-body.helper'
import { resetEmailValidator, resetPasswordValidator } from './reset-password.validator'

export const router = express.Router()

router.post(
  '/',
  validateBody(resetEmailValidator),
  resetPasswordController.email
)

router.put(
  '/',
  validateBody(resetPasswordValidator),
  resetPasswordController.password
)
