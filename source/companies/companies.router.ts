import express from 'express'
import * as companiesController from './companies.controller'
import { isCompanyAdmin } from '../common/helpers/is-company-admin.helper'
import { updateCompanyValidator } from './companies.validator'
import { validateBody } from '../common/helpers/validate-body.helper'
import { router as questionnaireRouter } from './questionnaire/questionnaire.router'

export const router = express.Router()

router.get('/', companiesController.getCompanies)
router.get('/:companyId', companiesController.getCompanyByID)

router.put(
  '/:companyId',
  isCompanyAdmin,
  validateBody(updateCompanyValidator),
  companiesController.updateCompanyByID
)

// Questionnaire
router.use('/:companyId', questionnaireRouter)
