import { ajv } from '../common/libs/ajv.lib'
import { companiesParamsSchema, updateCompanySchema } from './companies.schema'

export const updateCompanyValidator = ajv.compile(updateCompanySchema)
export const companiesParamsValidator = ajv.compile(companiesParamsSchema)
