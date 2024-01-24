import { ajv } from '../common/libs/ajv.lib'
import { resetEmailSchema, resetPasswordSchema } from './reset-password.schema'

export const resetEmailValidator = ajv.compile(resetEmailSchema)
export const resetPasswordValidator = ajv.compile(resetPasswordSchema)
