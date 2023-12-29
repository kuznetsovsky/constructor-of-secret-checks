import { ajv } from '../../libs/ajv.lib'

import {
  createCompanyBodySchema,
  createInspectorBodySchema
} from './auth.schema'

export const createCompanyBodyValidator = ajv.compile(createCompanyBodySchema)
export const createInspectorBodyValidator = ajv.compile(createInspectorBodySchema)
