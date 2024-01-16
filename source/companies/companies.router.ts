import express from 'express'
import * as companiesController from './companies.controller'
import { isCompanyAdmin } from '../common/helpers/is-company-admin.helper'
import { updateCompanyValidator } from './companies.validator'
import { validateBody } from '../common/helpers/validate-body.helper'
import { router as questionnaireRouter } from './questionnaire/questionnaire.router'
import { router as objectsRouter } from './objects/objects.router'
import { router as inspectorsRouter } from './inspectors/inspectors.router'
import { router as employeesRouter } from './employees/employees.router'

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

// Objects
router.use('/:companyId', objectsRouter)

// Inspectors
router.use('/:companyId', inspectorsRouter)

// Employees
router.use('/:companyId', employeesRouter)
