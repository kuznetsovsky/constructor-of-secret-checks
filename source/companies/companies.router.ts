import express from 'express'

import * as companiesController from './companies.controller'
import * as permission from '../common/helpers/permission.helper'
import { companiesParamsValidator, updateCompanyValidator } from './companies.validator'
import { validateBody } from '../common/helpers/validate-body.helper'
import { router as questionnaireRouter } from './questionnaire/questionnaire.router'
import { router as objectsRouter } from './objects/objects.router'
import { router as inspectorsRouter } from './inspectors/inspectors.router'
import { router as employeesRouter } from './employees/employees.router'
import { router as checkTypesRouter } from './check-types/check-types.router'
import { validateQueries } from '../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../common/helpers/validate-params.helper'

export const router = express.Router()

// Check Types
router.use(
  '/check-types',
  permission.onlyUsersWithAdminOrManagerRole,
  checkTypesRouter
)

// Questionnaire
router.use(
  '/questionnaire',
  permission.onlyUsersWithAdminOrManagerRole,
  questionnaireRouter
)

// Objects
router.use(
  '/objects',
  permission.onlyUsersWithAdminOrManagerRole,
  objectsRouter
)

// Inspectors
router.use(
  '/inspectors',
  permission.onlyUsersWithAdminOrManagerRole,
  inspectorsRouter
)

// Employees
router.use(
  '/employees',
  permission.onlyUsersWithAdminOrManagerRole,
  employeesRouter
)

// Companies:

router.get(
  '/',
  validateQueries(),
  companiesController.getCompanies
)

router.get(
  '/:company_id',
  validateParams(companiesParamsValidator),
  companiesController.getCompanyByID
)

router.put(
  '/:company_id',
  permission.onlyUsersWithAdminRole,
  validateParams(companiesParamsValidator),
  validateBody(updateCompanyValidator),
  companiesController.updateCompanyByID
)
