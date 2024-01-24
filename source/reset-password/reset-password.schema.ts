import { type JSONSchemaType } from 'ajv'
import { type ResetPassword, type ResetEmail } from './reset-password.interface'

export const resetEmailSchema: JSONSchemaType<ResetEmail> = {
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      transform: ['trim', 'toLowerCase']
    }
  }
}

export const resetPasswordSchema: JSONSchemaType<ResetPassword> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'password',
    'token'
  ],
  properties: {
    password: {
      type: 'string',
      transform: ['trim'],
      minLength: 8,
      maxLength: 255
    },
    token: {
      type: 'string',
      transform: ['trim']
    }
  }
}
