import express from 'express'

import * as inspectorsController from './inspectors.controller'
import { validateBody } from '../../common/helpers/validate-body.helper'
import { isCompanyAdminOrManager } from '../../common/helpers/is-company-admin-or-manager.helper'

import {
  createCompanyInspectorValidator,
  updateCompanyInspectorStatusValidator,
  updateCompanyInspectorValidator
} from './inspectors.validator'

export const router = express.Router({ mergeParams: true })

router.post(
  '/inspectors',
  isCompanyAdminOrManager,
  validateBody(createCompanyInspectorValidator),
  inspectorsController.createNewCompanyInspector
)

router.post(
  '/inspectors/:email',
  isCompanyAdminOrManager,
  inspectorsController.createCompanyInspectorByEmail
)

router.get(
  '/inspectors',
  isCompanyAdminOrManager,
  inspectorsController.getCompanyInspectors
)

router.get(
  '/inspectors/:inspector_id(\\d+)',
  isCompanyAdminOrManager,
  inspectorsController.getCompanyInspector
)

router.get(
  '/inspectors/:email',
  isCompanyAdminOrManager,
  inspectorsController.getCompanyInspectorByEmail
)

router.put(
  '/inspectors/:inspector_id',
  isCompanyAdminOrManager,
  validateBody(updateCompanyInspectorValidator),
  inspectorsController.updateCompanyInspector
)

router.patch(
  '/inspectors/:inspector_id',
  isCompanyAdminOrManager,
  validateBody(updateCompanyInspectorStatusValidator),
  inspectorsController.updateCompanyInspectorStatus
)

router.delete(
  '/inspectors/:inspector_id',
  isCompanyAdminOrManager,
  inspectorsController.deleteCompanyInspector
)
