import { ajv } from '../../libs/ajv.lib'

import {
  authorizationBodySchema,
  createCompanyBodySchema,
  createInspectorBodySchema
} from './auth.schema'

export const createCompanyBodyValidator = ajv.compile(createCompanyBodySchema)
export const createInspectorBodyValidator = ajv.compile(createInspectorBodySchema)
export const authorizationBodyValidator = ajv.compile(authorizationBodySchema)
