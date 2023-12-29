import express from 'express'
import * as authController from './auth.controller'
import { validateRequestBody } from '../helpers'
import { createCompanyBodyValidator } from './auth.validator'

export const router = express.Router()

router.post(
  '/sign-up/company',
  validateRequestBody(createCompanyBodyValidator),
  authController.createCompany
)
