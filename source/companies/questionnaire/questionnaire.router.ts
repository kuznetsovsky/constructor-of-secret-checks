import express from 'express'

import * as questionnaireController from './questionnaire.controller'
import { updateQuestionnaireValidator } from './questionnaire.validator'
import { validateBody } from '../../common/helpers/validate-body.helper'

export const router = express.Router()

router.get(
  '/',
  questionnaireController.getQuestionnaire
)

router.put(
  '/',
  validateBody(updateQuestionnaireValidator),
  questionnaireController.updateQuestionnaire
)
