import { type JSONSchemaType } from 'ajv'
import { type CreateAdministratorReqBodyInterface } from './auth.interface'

export const createCompanyBodySchema: JSONSchemaType<CreateAdministratorReqBodyInterface> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'password',
    'name'
  ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      transform: ['trim', 'toLowerCase']
    },
    password: {
      type: 'string',
      transform: ['trim'],
      minLength: 8,
      maxLength: 255
    },
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 128
    }
  }
}
