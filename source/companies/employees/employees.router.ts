import express from 'express'

import * as employeesController from './employees.controller'
import * as permission from '../../common/helpers/permission.helper'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { createCompanyEmployeeValidator, employeeParamsValidator, updateCompanyEmployeeValidator } from './employees.validator'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../../common/helpers/validate-params.helper'

export const router = express.Router({ mergeParams: true })

router.post(
  '/employees',
  permission.onlyCompanyAdminOrManager,
  validateBody(createCompanyEmployeeValidator),
  employeesController.createCompanyEmployee
)

router.get(
  '/employees',
  permission.onlyCompanyAdminOrManager,
  validateQueries(),
  employeesController.getCompanyEmployees
)

router.get(
  '/employees/:employee_id',
  permission.onlyCompanyAdminOrManager,
  validateParams(employeeParamsValidator),
  employeesController.getCompanyEmployee
)

router.put(
  '/employees/:employee_id',
  permission.onlyCompanyAdminOrManager,
  validateParams(employeeParamsValidator),
  validateBody(updateCompanyEmployeeValidator),
  employeesController.updateCompanyEmployee
)

router.delete(
  '/employees/:employee_id',
  permission.onlyCompanyAdminOrManager,
  validateParams(employeeParamsValidator),
  employeesController.deleteCompanyEmployee
)
