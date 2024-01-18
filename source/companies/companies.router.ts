import express from 'express'
import * as companiesController from './companies.controller'
import { isCompanyAdmin } from '../common/helpers/is-company-admin.helper'
import { updateCompanyValidator } from './companies.validator'
import { validateBody } from '../common/helpers/validate-body.helper'
import { router as questionnaireRouter } from './questionnaire/questionnaire.router'
import { router as objectsRouter } from './objects/objects.router'
import { router as inspectorsRouter } from './inspectors/inspectors.router'
import { router as employeesRouter } from './employees/employees.router'
import { validateQueries } from '../common/helpers/validate-queries/validate-queries.helper'

export const router = express.Router()

router.get('/', validateQueries(), companiesController.getCompanies)
router.get('/:company_id', companiesController.getCompanyByID)

router.put(
  '/:company_id',
  isCompanyAdmin,
  validateBody(updateCompanyValidator),
  companiesController.updateCompanyByID
)

// Questionnaire
router.use('/:company_id', questionnaireRouter)

// Objects
router.use('/:company_id', objectsRouter)

// Inspectors
router.use('/:company_id', inspectorsRouter)

// Employees
router.use('/:company_id', employeesRouter)
