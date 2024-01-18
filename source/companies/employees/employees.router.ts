import express from 'express'

import * as employeesController from './employees.controller'
import { isCompanyAdminOrManager } from '../../common/helpers/is-company-admin-or-manager.helper'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { createCompanyEmployeeValidator, updateCompanyEmployeeValidator } from './employees.validator'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'

export const router = express.Router({ mergeParams: true })

router.post(
  '/employees',
  isCompanyAdminOrManager,
  validateBody(createCompanyEmployeeValidator),
  employeesController.createCompanyEmployee
)

router.get(
  '/employees',
  isCompanyAdminOrManager,
  validateQueries(),
  employeesController.getCompanyEmployees
)

router.get(
  '/employees/:employee_id',
  isCompanyAdminOrManager,
  employeesController.getCompanyEmployee
)

router.put(
  '/employees/:employee_id',
  isCompanyAdminOrManager,
  validateBody(updateCompanyEmployeeValidator),
  employeesController.updateCompanyEmployee
)

router.delete(
  '/employees/:employee_id',
  isCompanyAdminOrManager,
  employeesController.deleteCompanyEmployee
)
