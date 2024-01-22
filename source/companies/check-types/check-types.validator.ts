import { ajv } from '../../common/libs/ajv.lib'
import { CompanyCheckTypeSchema } from './check-types.schema'

export const companyCheckTypeValidator = ajv.compile(CompanyCheckTypeSchema)
