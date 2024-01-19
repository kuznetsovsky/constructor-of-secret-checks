import express from 'express'

import * as inspectorsController from './inspectors.controller'
import * as permission from '../../common/helpers/permission.helper'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { validateQueries } from '../../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../../common/helpers/validate-params.helper'

import {
  createCompanyInspectorValidator,
  inspectorsParamsValidator,
  updateCompanyInspectorStatusValidator,
  updateCompanyInspectorValidator
} from './inspectors.validator'

export const router = express.Router({ mergeParams: true })

router.post(
  '/inspectors',
  permission.onlyCompanyAdminOrManager,
  validateBody(createCompanyInspectorValidator),
  inspectorsController.createNewCompanyInspector
)

router.post(
  '/inspectors/:email',
  permission.onlyCompanyAdminOrManager,
  inspectorsController.createCompanyInspectorByEmail
)

router.get(
  '/inspectors',
  permission.onlyCompanyAdminOrManager,
  validateQueries(),
  inspectorsController.getCompanyInspectors
)

router.get(
  '/inspectors/:inspector_id(\\d+)',
  permission.onlyCompanyAdminOrManager,
  validateParams(inspectorsParamsValidator),
  inspectorsController.getCompanyInspector
)

router.get(
  '/inspectors/:email',
  permission.onlyCompanyAdminOrManager,
  inspectorsController.getCompanyInspectorByEmail
)

router.put(
  '/inspectors/:inspector_id',
  permission.onlyCompanyAdminOrManager,
  validateParams(inspectorsParamsValidator),
  validateBody(updateCompanyInspectorValidator),
  inspectorsController.updateCompanyInspector
)

router.patch(
  '/inspectors/:inspector_id',
  permission.onlyCompanyAdminOrManager,
  validateParams(inspectorsParamsValidator),
  validateBody(updateCompanyInspectorStatusValidator),
  inspectorsController.updateCompanyInspectorStatus
)

router.delete(
  '/inspectors/:inspector_id',
  permission.onlyCompanyAdminOrManager,
  validateParams(inspectorsParamsValidator),
  inspectorsController.deleteCompanyInspector
)
