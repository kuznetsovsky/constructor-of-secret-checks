import express from 'express'
import * as companiesConstroller from './companies.controller'
import { isCompanyAdmin } from '../common/helpers/is-company-admin.helper'
import { updateCompanyValidator } from './companies.validator'
import { validateBody } from '../common/helpers/validate-body.helper'

export const router = express.Router()

router.get('/', companiesConstroller.getCompanies)
router.get('/:id', companiesConstroller.getCompanyByID)

router.put(
  '/:id',
  isCompanyAdmin,
  validateBody(updateCompanyValidator),
  companiesConstroller.updateCompanyByID
)
