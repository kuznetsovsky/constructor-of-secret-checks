import { ajv } from '../../common/libs/ajv.lib'

import {
  createCompanyInspectorSchema,
  inspectorsParamsSchema,
  updateCompanyInspectorSchema,
  updateCompanyInspectorStatusSchema
} from './inspectors.schema'

export const createCompanyInspectorValidator = ajv.compile(createCompanyInspectorSchema)
export const updateCompanyInspectorValidator = ajv.compile(updateCompanyInspectorSchema)
export const updateCompanyInspectorStatusValidator = ajv.compile(updateCompanyInspectorStatusSchema)
export const inspectorsParamsValidator = ajv.compile(inspectorsParamsSchema)
