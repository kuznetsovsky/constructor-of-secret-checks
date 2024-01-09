import express from 'express'

import * as emailVerificationController from './email-verification.controller'
import { validateBody } from '../common/helpers/validate-body.helper'
import { emailVerifyValidator } from './email-verification.validator'

export const router = express.Router()

router.put(
  '/',
  validateBody(emailVerifyValidator),
  emailVerificationController.verify
)
