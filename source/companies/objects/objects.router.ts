import express from 'express'

import * as objectsController from './objects.controller'
import { isCompanyAdminOrManager } from '../../common/helpers/is-company-admin-or-manager.helper'
import { companyObjectValidator } from './objects.validator'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'

export const router = express.Router({ mergeParams: true })

router.post(
  '/objects',
  isCompanyAdminOrManager,
  validateBody(companyObjectValidator),
  objectsController.createObject
)

router.get(
  '/objects',
  isCompanyAdminOrManager,
  validateQueries(),
  objectsController.getObjects
)

router.get(
  '/objects/:object_id',
  isCompanyAdminOrManager,
  objectsController.getObject
)

router.put(
  '/objects/:object_id',
  isCompanyAdminOrManager,
  validateBody(companyObjectValidator),
  objectsController.updateObject
)

router.delete(
  '/objects/:object_id',
  isCompanyAdminOrManager,
  objectsController.deleteObject
)
