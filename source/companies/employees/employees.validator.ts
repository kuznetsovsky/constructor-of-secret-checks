import { ajv } from '../../common/libs/ajv.lib'
import { createCompanyEmployeeSchema, updateCompanyEmployeeSchema } from './employees.schema'

export const createCompanyEmployeeValidator = ajv.compile(createCompanyEmployeeSchema)
export const updateCompanyEmployeeValidator = ajv.compile(updateCompanyEmployeeSchema)
