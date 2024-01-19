import { type JSONSchemaType } from 'ajv'
import { type CitiesParams } from './cities.interface'

export const cityParamsSchema: JSONSchemaType<CitiesParams> = {
  type: 'object',
  additionalProperties: false,
  required: ['city_id'],
  properties: {
    city_id: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$'
    }
  }
}
