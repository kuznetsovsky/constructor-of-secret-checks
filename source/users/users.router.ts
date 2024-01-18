import express from 'express'
import * as usersController from './users.controller'
import { validateQueries } from '../common/helpers/validate-queries/validate-queries.helper'

export const router = express.Router()

router.get('/', validateQueries(), usersController.getAccounts)
router.get('/:user_id', usersController.getAccountByID)
