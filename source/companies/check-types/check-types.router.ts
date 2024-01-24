import express from 'express'

import * as checkTypesController from './check-types.controller'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { checkTypesParamsValidator, companyCheckTypeValidator } from './check-types.validator'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../../common/helpers/validate-params.helper'

export const router = express.Router()

router.post(
  '/',
  validateBody(companyCheckTypeValidator),
  checkTypesController.createCheckType
)

router.get(
  '/',
  validateQueries(),
  checkTypesController.getCheckTypes
)

router.get(
  '/:check_type_id',
  validateParams(checkTypesParamsValidator),
  checkTypesController.getCheckTypeByID
)

router.put(
  '/:check_type_id',
  validateParams(checkTypesParamsValidator),
  validateBody(companyCheckTypeValidator),
  checkTypesController.updateCheckTypeByID
)

router.delete(
  '/:check_type_id',
  validateParams(checkTypesParamsValidator),
  checkTypesController.deleteCheckTypeByID
)
