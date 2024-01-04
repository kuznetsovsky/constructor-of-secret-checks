import express from 'express'
import * as usersConstroller from './users.controller'

export const router = express.Router()

router.get('/', usersConstroller.getAccounts)
router.get('/:id', usersConstroller.getAccountByID)
