import express from 'express'

import * as templatesController from './templates.constructor'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { companyTemplatesValidator, templatesParamsValidator, updateTemplateValidator } from './templates.validator'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../../common/helpers/validate-params.helper'

export const router = express.Router()

router.post(
  '/',
  validateBody(companyTemplatesValidator),
  templatesController.createCompanyTemplate
)

router.get(
  '/',
  validateQueries(),
  templatesController.getCompanyTemplates
)

router.get(
  '/:template_id',
  validateParams(templatesParamsValidator),
  templatesController.getCompanyTemplate
)

router.patch(
  '/:template_id',
  validateParams(templatesParamsValidator),
  validateBody(updateTemplateValidator),
  templatesController.updateCompanyTemplate
)

router.delete(
  '/:template_id',
  validateParams(templatesParamsValidator),
  templatesController.deleteCompanyTemplate
)

router.get(
  '/:template_id/preview',
  validateParams(templatesParamsValidator),
  templatesController.getCompanyTemplatePreview
)
