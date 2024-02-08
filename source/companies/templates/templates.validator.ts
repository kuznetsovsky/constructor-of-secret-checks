import { ajv } from '../../common/libs/ajv.lib'

import {
  createCompanyTemplateSchema,
  companyUpdateTemplatesSchema,
  templatesParamsSchema
} from './templates.schema'

export const companyTemplatesValidator = ajv.compile(createCompanyTemplateSchema)
export const templatesParamsValidator = ajv.compile(templatesParamsSchema)
export const updateTemplateValidator = ajv.compile(companyUpdateTemplatesSchema)
