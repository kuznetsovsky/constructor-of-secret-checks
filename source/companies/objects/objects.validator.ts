import { ajv } from '../../common/libs/ajv.lib'
import { companyObjectSchema } from './objects.schema'

export const companyObjectValidator = ajv.compile(companyObjectSchema)
