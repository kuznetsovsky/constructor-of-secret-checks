import express from 'express'

import * as checkTypesController from './check-types.controller'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { companyCheckTypeValidator } from './check-types.validator'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'

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
  checkTypesController.getCheckTypeByID
)

router.put(
  '/:check_type_id',
  validateBody(companyCheckTypeValidator),
  checkTypesController.updateCheckTypeByID
)

router.delete(
  '/:check_type_id',
  checkTypesController.deleteCheckTypeByID
)
