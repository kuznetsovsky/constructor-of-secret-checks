import express from 'express'

import * as checksController from './checks.controller'
import { validateBody } from '../../../common/helpers/validate-body.helper'
import { validateQueries } from '../../../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../../../common/helpers/validate-params.helper'

import {
  checkParamsValidator,
  createCompanyObjectCheckValidator,
  updateCompanyObjectCheckValidator
} from './checks.validator'

export const router = express.Router({ mergeParams: true })

router.post(
  '/',
  validateBody(createCompanyObjectCheckValidator),
  checksController.createCompanyObjectCheck
)

router.get(
  '/',
  validateQueries(),
  checksController.getCompanyObjectChecks
)

router.get(
  '/:check_id',
  validateParams(checkParamsValidator),
  checksController.getCompanyObjectCheck
)

router.patch(
  '/:check_id',
  validateParams(checkParamsValidator),
  validateBody(updateCompanyObjectCheckValidator),
  checksController.updateCompanyObjectCheck
)

router.delete(
  '/:check_id',
  validateParams(checkParamsValidator),
  checksController.removeCompanyObjectCheck
)

// TODO: create status PATCH route
