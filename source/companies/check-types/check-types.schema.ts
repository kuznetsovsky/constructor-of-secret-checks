import { type JSONSchemaType } from 'ajv'
import type { UpdateCheckType } from './check-types.interface'

export const CompanyCheckTypeSchema: JSONSchemaType<UpdateCheckType> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'name'
  ],
  properties: {
    name: {
      type: 'string',
      transform: ['trim'],
      minLength: 2,
      maxLength: 32
    }
  }
}
