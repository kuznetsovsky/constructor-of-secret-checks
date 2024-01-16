import express from 'express'

import * as employeesController from './employees.controller'
import { isCompanyAdminOrManager } from '../../common/helpers/is-company-admin-or-manager.helper'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { createCompanyEmployeeValidator, updateCompanyEmployeeValidator } from './employees.validator'

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
  employeesController.getCompanyEmployees
)

router.get(
  '/employees/:employeeId',
  isCompanyAdminOrManager,
  employeesController.getCompanyEmployee
)

router.put(
  '/employees/:employeeId',
  isCompanyAdminOrManager,
  validateBody(updateCompanyEmployeeValidator),
  employeesController.updateCompanyEmployee
)

router.delete(
  '/employees/:employeeId',
  isCompanyAdminOrManager,
  employeesController.deleteCompanyEmployee
)
