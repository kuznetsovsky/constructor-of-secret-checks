import express from 'express'
import * as userConstroller from './user.controller'
import { validateBody } from '../common/helpers/validate-body.helper'
import { changePasswordValidator } from './user.validator'

export const router = express.Router()

router.get('/', userConstroller.getProfile)
router.put('/', userConstroller.updateProfile)

router.put(
  '/change-password',
  validateBody(changePasswordValidator),
  userConstroller.changePassword
)
