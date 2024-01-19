import { type JSONSchemaType } from 'ajv'
import { type ObjectsParams, type CompanyObject } from './objects.interface'
import { EntryTypes } from '../../consts'

export const companyObjectSchema: JSONSchemaType<CompanyObject> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'entry_type',
    'name',
    'street',
    'house_number',
    'city_id'
  ],
  properties: {
    entry_type: {
      type: 'string',
      enum: [
        EntryTypes.Manual,
        EntryTypes.Public
      ]
    },
    name: {
      type: 'string',
      transform: ['trim'],
      minLength: 5,
      maxLength: 32
    },
    street: {
      type: 'string',
      transform: ['trim'],
      maxLength: 60
    },
    house_number: {
      type: 'string',
      transform: ['trim'],
      maxLength: 8
    },
    city_id: {
      type: 'number',
      minimum: 1
    }
  }
}

export const objectsParamsSchema: JSONSchemaType<ObjectsParams> = {
  type: 'object',
  additionalProperties: true,
  required: ['object_id'],
  properties: {
    object_id: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$'
    }
  }
}
