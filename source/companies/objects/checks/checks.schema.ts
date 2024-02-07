import { type JSONSchemaType } from 'ajv'

import { ObjectCheckStatus } from '../../../consts'

import type {
  CreateCompanyObjectCheck,
  ChecksParams,
  UpdateCompanyObjectCheck,
  CheckStatus
} from './checks.interface'

export const createCompanyObjectCheckSchema: JSONSchemaType<CreateCompanyObjectCheck> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'date',
    'inspector_id',
    'template_id',
    'check_type_id'
  ],
  properties: {
    date: {
      type: 'string',
      transform: ['trim'],
      format: 'date',
      formatMinimum: '2024-01-01'
    },
    inspector_id: {
      type: 'number',
      minimum: 0
    },
    template_id: {
      type: 'number',
      minimum: 1
    },
    check_type_id: {
      type: 'number',
      minimum: 1
    }
  }
}

export const updateCompanyObjectCheckSchema: JSONSchemaType<UpdateCompanyObjectCheck> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    inspector_id: {
      type: 'integer',
      minimum: 0,
      nullable: true
    },
    template_id: {
      type: 'integer',
      minimum: 1,
      nullable: true
    },
    check_type_id: {
      type: 'integer',
      minimum: 1,
      nullable: true
    }
  }
}

export const checksStatusSchema: JSONSchemaType<CheckStatus> = {
  oneOf: [
    {
      type: 'object',
      required: ['comment', 'status'],
      properties: {
        status: {
          type: 'string',
          const: ObjectCheckStatus.Revision
        },
        comment: {
          type: 'string',
          transform: ['trim'],
          maxLength: 128
        }
      }
    },
    {
      type: 'object',
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          enum: [
            ObjectCheckStatus.Appointed,
            ObjectCheckStatus.Checking,
            ObjectCheckStatus.Fulfilled,
            ObjectCheckStatus.Refusal
          ]
        }
      }
    }
  ]
}

export const checksParamsSchema: JSONSchemaType<ChecksParams> = {
  type: 'object',
  additionalProperties: true,
  required: ['check_id'],
  properties: {
    check_id: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$'
    }
  }
}
