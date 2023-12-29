import express from 'express'
import * as authController from './auth.controller'
import { validateRequestBody } from '../helpers'
import { createCompanyBodyValidator, createInspectorBodyValidator } from './auth.validator'

export const router = express.Router()

router.post(
  '/sign-up/company',
  validateRequestBody(createCompanyBodyValidator),
  authController.createCompany
)

router.post(
  '/sign-up/inspector',
  validateRequestBody(createInspectorBodyValidator),
  authController.createInspector
)
