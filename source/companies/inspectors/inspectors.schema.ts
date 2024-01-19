import { type JSONSchemaType } from 'ajv'

import { InspectorStatus } from '../../consts'

import type {
  ChangeCompanyInspectorStatus,
  UpdateCompanyInspector,
  CreateCompanyInspector,
  InspectorsParams
} from './inspectors.interface'

export const createCompanyInspectorSchema: JSONSchemaType<CreateCompanyInspector> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'first_name',
    'last_name',
    'city_id',
    'phone_number'
  ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      transform: ['trim', 'toLowerCase'],
      maxLength: 32
    },
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
      maxLength: 60
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
      format: 'uri',
      transform: ['trim'],
      // eslint-disable-next-line no-useless-escape
      pattern: '^https:\/\/vk\\.com',
      maxLength: 48
    }
  }
}

export const updateCompanyInspectorSchema: JSONSchemaType<UpdateCompanyInspector> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'first_name',
    'last_name',
    'city_id',
    'phone_number',
    'address',
    'birthday',
    'vk_link',
    'note'
  ],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      transform: ['trim', 'toLowerCase'],
      maxLength: 32
    },
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
      maxLength: 60
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
      format: 'uri',
      transform: ['trim'],
      // eslint-disable-next-line no-useless-escape
      pattern: '^https:\/\/vk\\.com',
      maxLength: 48
    },
    note: {
      type: 'string',
      transform: ['trim'],
      maxLength: 90
    }
  }
}

export const updateCompanyInspectorStatusSchema: JSONSchemaType<ChangeCompanyInspectorStatus> = {
  type: 'object',
  additionalProperties: false,
  required: ['status'],
  properties: {
    status: {
      type: 'string',
      transform: ['trim', 'toLowerCase'],
      enum: [
        InspectorStatus.Verification,
        InspectorStatus.Approved,
        InspectorStatus.Deviation
      ]
    }
  }
}

export const inspectorsParamsSchema: JSONSchemaType<InspectorsParams> = {
  type: 'object',
  additionalProperties: true,
  required: ['inspector_id'],
  properties: {
    inspector_id: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$'
    }
  }
}
