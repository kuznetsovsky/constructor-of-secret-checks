import express from 'express'

import * as objectsController from './objects.controller'
import { router as checksRouter } from './checks/checks.router'
import { companyObjectValidator, objectParamsValidator } from './objects.validator'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../../common/helpers/validate-params.helper'

export const router = express.Router()

// Checks
router.use(
  '/:object_id/checks',
  validateParams(objectParamsValidator),
  checksRouter
)

// Objects

router.post(
  '/',
  validateBody(companyObjectValidator),
  objectsController.createObject
)

router.get(
  '/',
  validateQueries(),
  objectsController.getObjects
)

router.get(
  '/:object_id',
  validateParams(objectParamsValidator),
  objectsController.getObject
)

router.put(
  '/:object_id',
  validateParams(objectParamsValidator),
  validateBody(companyObjectValidator),
  objectsController.updateObject
)

router.delete(
  '/:object_id',
  validateParams(objectParamsValidator),
  objectsController.deleteObject
)
