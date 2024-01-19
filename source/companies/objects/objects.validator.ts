import { ajv } from '../../common/libs/ajv.lib'
import { companyObjectSchema, objectsParamsSchema } from './objects.schema'

export const companyObjectValidator = ajv.compile(companyObjectSchema)
export const objectParamsValidator = ajv.compile(objectsParamsSchema)
