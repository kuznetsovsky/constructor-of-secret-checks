import { type JSONSchemaType } from 'ajv'
import type { AdminProfile, InspectorProfile } from './user.interface'

export const adminProfileSchema: JSONSchemaType<AdminProfile> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'first_name',
    'last_name',
    'phone_number'
  ],
  properties: {
    first_name: {
      type: 'string',
      transform: ['trim'],
      minLength: 3,
      maxLength: 16
    },
    last_name: {
      type: 'string',
      transform: ['trim'],
      minLength: 3,
      maxLength: 24
    },
    phone_number: {
      type: 'string',
      transform: ['trim'],
      maxLength: 16
    }
  }
}

export const inspectorProfileSchema: JSONSchemaType<InspectorProfile> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'first_name',
    'last_name',
    'phone_number',
    'birthday',
    'city_id',
    'vk_link',
    'address'
  ],
  properties: {
    first_name: {
      type: 'string',
      transform: ['trim'],
      minLength: 3,
      maxLength: 16
    },
    last_name: {
      type: 'string',
      transform: ['trim'],
      minLength: 3,
      maxLength: 24
    },
    phone_number: {
      type: 'string',
      transform: ['trim'],
      maxLength: 16
    },
    city_id: {
      type: 'number',
      minimum: 1
    },
    address: {
      type: 'string',
      transform: ['trim'],
      maxLength: 64
    },
    birthday: {
      type: 'string',
      transform: ['trim'],
      format: 'date',
      formatMinimum: '2000-01-01',
      formatExclusiveMaximum: '2024-01-01'
    },
    vk_link: {
      type: 'string',
      transform: ['trim'],
      maxLength: 48
    }
  }
}
