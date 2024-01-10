import { ajv } from '../common/libs/ajv.lib'

import {
  adminProfileSchema,
  changePasswordSchema,
  inspectorProfileSchema
} from './user.schema'

export const adminProfileValidator = ajv.compile(adminProfileSchema)
export const inspectorProfileValidator = ajv.compile(inspectorProfileSchema)
export const changePasswordValidator = ajv.compile(changePasswordSchema)
