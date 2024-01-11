import express from 'express'
import * as userController from './user.controller'
import { validateBody } from '../common/helpers/validate-body.helper'
import { changePasswordValidator } from './user.validator'

export const router = express.Router()

router.get('/', userController.getProfile)
router.put('/', userController.updateProfile)

router.put(
  '/change-password',
  validateBody(changePasswordValidator),
  userController.changePassword
)
