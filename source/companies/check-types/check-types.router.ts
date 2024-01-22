import express from 'express'

import * as checkTypesController from './check-types.controller'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { companyCheckTypeValidator } from './check-types.validator'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'
// import * as permission from '../../common/helpers/permission.helper'

export const router = express.Router()

router.post(
  '/',
  // permission.onlyCompanyAdminOrManager,
  validateBody(companyCheckTypeValidator),
  checkTypesController.createCheckType
)

router.get(
  '/',
  // permission.onlyCompanyAdminOrManager,
  validateQueries(),
  checkTypesController.getCheckTypes
)

router.get(
  '/:check_type_id',
  // permission.onlyCompanyAdminOrManager,
  checkTypesController.getCheckTypeByID
)

router.put(
  '/:check_type_id',
  // permission.onlyCompanyAdminOrManager,
  validateBody(companyCheckTypeValidator),
  checkTypesController.updateCheckTypeByID
)

router.delete(
  '/:check_type_id',
  // permission.onlyCompanyAdminOrManager,
  checkTypesController.deleteCheckTypeByID
)
