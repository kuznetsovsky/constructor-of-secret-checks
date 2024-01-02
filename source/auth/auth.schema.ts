import { type JSONSchemaType } from 'ajv'

import type {
  SignUpInspector,
  SignUpAdministrator,
  SignIn
} from './auth.interface'

export const signUpAdministratorSchema: JSONSchemaType<SignUpAdministrator> = {
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

export const signUpInspectorSchema: JSONSchemaType<SignUpInspector> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'password',
    'first_name',
    'last_name'
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
    }
  }
}

export const signInSchema: JSONSchemaType<SignIn> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'password'
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
    }
  }
}
