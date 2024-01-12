import express from 'express'

import * as objectsController from './objects.controller'
import { isCompanyAdminOrManager } from '../../common/helpers/is-company-admin-or-manager.helper'
import { companyObjectValidator } from './objects.validator'
import { validateBody } from '../../common/helpers/validate-body.helper'

export const router = express.Router({ mergeParams: true })

router.post('/objects', isCompanyAdminOrManager, validateBody(companyObjectValidator), objectsController.createObject)
router.get('/objects', isCompanyAdminOrManager, objectsController.getObjects)
router.get('/objects/:objectId', isCompanyAdminOrManager, objectsController.getObject)
router.put('/objects/:objectId', isCompanyAdminOrManager, validateBody(companyObjectValidator), objectsController.updateObject)
router.delete('/objects/:objectId', isCompanyAdminOrManager, objectsController.deleteObject)
