import { type JSONSchemaType } from 'ajv'
import { type EmailVerify } from './email-verification.interface'

export const emailVerifySchema: JSONSchemaType<EmailVerify> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'verification_code'
  ],
  properties: {
    email: {
      type: 'string',
      maxLength: 128,
      transform: ['trim']
    },
    verification_code: {
      type: 'string',
      maxLength: 128,
      transform: ['trim']
    }
  }
}
