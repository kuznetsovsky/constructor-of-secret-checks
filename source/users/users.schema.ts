import { type JSONSchemaType } from 'ajv'
import { type UsersParams } from './users.interface'

export const usersParamsSchema: JSONSchemaType<UsersParams> = {
  type: 'object',
  additionalProperties: false,
  required: ['user_id'],
  properties: {
    user_id: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$'
    }
  }
}
