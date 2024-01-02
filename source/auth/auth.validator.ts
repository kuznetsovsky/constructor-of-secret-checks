import { ajv } from '../../libs/ajv.lib'

import {
  signInSchema,
  signUpAdministratorSchema,
  signUpInspectorSchema
} from './auth.schema'

export const signUpAdministratorValidator = ajv.compile(signUpAdministratorSchema)
export const signUpInspectorValidator = ajv.compile(signUpInspectorSchema)
export const signInValidator = ajv.compile(signInSchema)
