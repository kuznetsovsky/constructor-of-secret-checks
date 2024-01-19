import { type JSONSchemaType } from 'ajv'
import { type UpdateEmployee, type CreateEmployee, type EmployeeParams } from './employees.interface'

export const createCompanyEmployeeSchema: JSONSchemaType<CreateEmployee> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'first_name',
    'last_name',
    'city_id'
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
    city_id: {
      type: 'number',
      minimum: 1
    }
  }
}

export const updateCompanyEmployeeSchema: JSONSchemaType<UpdateEmployee> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'first_name',
    'last_name',
    'city_id',
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
    city_id: {
      type: 'number',
      minimum: 1
    },
    phone_number: {
      type: 'string',
      maxLength: 16
    }
  }
}

export const employeeParamsSchema: JSONSchemaType<EmployeeParams> = {
  type: 'object',
  additionalProperties: true,
  required: ['employee_id'],
  properties: {
    employee_id: {
      type: 'string',
      transform: ['trim'],
      pattern: '^\\d+$'
    }
  }
}
