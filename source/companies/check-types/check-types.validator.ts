import { ajv } from '../../common/libs/ajv.lib'
import { CompanyCheckTypeSchema, checkTypesParamsSchema } from './check-types.schema'

export const companyCheckTypeValidator = ajv.compile(CompanyCheckTypeSchema)
export const checkTypesParamsValidator = ajv.compile(checkTypesParamsSchema)
