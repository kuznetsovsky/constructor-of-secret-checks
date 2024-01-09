import { ajv } from '../common/libs/ajv.lib'
import { emailVerifySchema } from './email-verification.schema'

export const emailVerifyValidator = ajv.compile(emailVerifySchema)
