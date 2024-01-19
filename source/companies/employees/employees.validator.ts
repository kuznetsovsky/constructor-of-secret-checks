import { ajv } from '../../common/libs/ajv.lib'

import {
  createCompanyEmployeeSchema,
  employeeParamsSchema,
  updateCompanyEmployeeSchema
} from './employees.schema'

export const createCompanyEmployeeValidator = ajv.compile(createCompanyEmployeeSchema)
export const updateCompanyEmployeeValidator = ajv.compile(updateCompanyEmployeeSchema)
export const employeeParamsValidator = ajv.compile(employeeParamsSchema)
