import express from 'express'

import * as questionnaireController from './questionnaire.controller'
import * as permission from '../../common/helpers/permission.helper'
import { updateQuestionnaireValidator } from './questionnaire.validator'
import { validateBody } from '../../common/helpers/validate-body.helper'

export const router = express.Router({ mergeParams: true })

router.get(
  '/questionnaire',
  permission.onlyCompanyAdminOrManager,
  questionnaireController.getQuestionnaire
)

router.put(
  '/questionnaire',
  permission.onlyCompanyAdminOrManager,
  validateBody(updateQuestionnaireValidator),
  questionnaireController.updateQuestionnaire
)
