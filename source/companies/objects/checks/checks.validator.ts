import { ajv } from '../../../common/libs/ajv.lib'

import {
  checksParamsSchema,
  checksStatusSchema,
  createCompanyObjectCheckSchema,
  updateCompanyObjectCheckSchema
} from './checks.schema'

export const createCompanyObjectCheckValidator = ajv.compile(createCompanyObjectCheckSchema)
export const updateCompanyObjectCheckValidator = ajv.compile(updateCompanyObjectCheckSchema)
export const updateCompanyObjectCheckStatusValidator = ajv.compile(checksStatusSchema)
export const checkParamsValidator = ajv.compile(checksParamsSchema)
