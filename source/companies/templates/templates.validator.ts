import { ajv } from '../../common/libs/ajv.lib'
import { companyTemplatesSchema, companyUpdateTemplatesSchema, templatesParamsSchema } from './templates.schema'

export const companyTemplatesValidator = ajv.compile(companyTemplatesSchema)
export const templatesParamsValidator = ajv.compile(templatesParamsSchema)
export const updateTemplateValidator = ajv.compile(companyUpdateTemplatesSchema)
