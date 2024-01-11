import express from 'express'

import * as feedbackController from './feedback.controller'
import { sendFeedbackValidator } from './feedback.validator'
import { validateBody } from '../common/helpers/validate-body.helper'

export const router = express.Router()

router.post(
  '/',
  validateBody(sendFeedbackValidator),
  feedbackController.sendFeedback
)
