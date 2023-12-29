import { ajv } from '../../libs/ajv.lib'

import { createCompanyBodySchema } from './auth.schema'

export const createCompanyBodyValidator = ajv.compile(createCompanyBodySchema)
