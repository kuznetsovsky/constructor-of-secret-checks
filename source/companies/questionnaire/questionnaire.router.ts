import express from 'express'

import * as questionnaireController from './questionnaire.controller'
import { updateQuestionnaireValidator } from './questionnaire.validator'
import { isCompanyAdminOrManager } from '../../common/helpers/is-company-admin-or-manager.helper'
import { validateBody } from '../../common/helpers/validate-body.helper'

export const router = express.Router({ mergeParams: true })

router.get(
  '/questionnaire',
  isCompanyAdminOrManager,
  questionnaireController.getQuestionnaire
)

router.put(
  '/questionnaire',
  isCompanyAdminOrManager,
  validateBody(updateQuestionnaireValidator),
  questionnaireController.updateQuestionnaire
)
