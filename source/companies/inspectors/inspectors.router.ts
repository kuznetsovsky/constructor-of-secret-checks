import express from 'express'

import * as inspectorsController from './inspectors.controller'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../../common/helpers/validate-params.helper'

import {
  createCompanyInspectorValidator,
  inspectorsParamsValidator,
  updateCompanyInspectorStatusValidator,
  updateCompanyInspectorValidator
} from './inspectors.validator'

export const router = express.Router()

router.post(
  '/',
  validateBody(createCompanyInspectorValidator),
  inspectorsController.createNewCompanyInspector
)

router.post(
  '/:email',
  inspectorsController.createCompanyInspectorByEmail
)

router.get(
  '/',
  validateQueries(),
  inspectorsController.getCompanyInspectors
)

router.get(
  '/:inspector_id(\\d+)',
  validateParams(inspectorsParamsValidator),
  inspectorsController.getCompanyInspector
)

router.get(
  '/:email',
  inspectorsController.getCompanyInspectorByEmail
)

router.put(
  '/:inspector_id',
  validateParams(inspectorsParamsValidator),
  validateBody(updateCompanyInspectorValidator),
  inspectorsController.updateCompanyInspector
)

router.patch(
  '/:inspector_id',
  validateParams(inspectorsParamsValidator),
  validateBody(updateCompanyInspectorStatusValidator),
  inspectorsController.updateCompanyInspectorStatus
)

router.delete(
  '/:inspector_id',
  validateParams(inspectorsParamsValidator),
  inspectorsController.deleteCompanyInspector
)
