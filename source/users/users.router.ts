import express from 'express'
import * as usersController from './users.controller'

export const router = express.Router()

router.get('/', usersController.getAccounts)
router.get('/:user_id', usersController.getAccountByID)
