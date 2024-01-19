import express from 'express'
import * as usersController from './users.controller'
import { validateQueries } from '../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../common/helpers/validate-params.helper'
import { usersParamsValidator } from './users.validator'

export const router = express.Router()

router.get(
  '/',
  validateQueries(),
  usersController.getAccounts
)

router.get(
  '/:user_id',
  validateParams(usersParamsValidator),
  usersController.getAccountByID
)
