import express from 'express'

import * as employeesController from './employees.controller'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../../common/helpers/validate-params.helper'

import {
  createCompanyEmployeeValidator,
  employeeParamsValidator,
  updateCompanyEmployeeValidator
} from './employees.validator'

export const router = express.Router()

router.post(
  '/',
  validateBody(createCompanyEmployeeValidator),
  employeesController.createCompanyEmployee
)

router.get(
  '/',
  validateQueries(),
  employeesController.getCompanyEmployees
)

router.get(
  '/:employee_id',
  validateParams(employeeParamsValidator),
  employeesController.getCompanyEmployee
)

router.put(
  '/:employee_id',
  validateParams(employeeParamsValidator),
  validateBody(updateCompanyEmployeeValidator),
  employeesController.updateCompanyEmployee
)

router.delete(
  '/:employee_id',
  validateParams(employeeParamsValidator),
  employeesController.deleteCompanyEmployee
)
