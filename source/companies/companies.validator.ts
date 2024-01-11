import { ajv } from '../common/libs/ajv.lib'
import { updateCompanySchema } from './companies.schema'

export const updateCompanyValidator = ajv.compile(updateCompanySchema)
