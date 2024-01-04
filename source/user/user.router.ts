import express from 'express'
import * as userConstroller from './user.controller'

export const router = express.Router()

router.get('/', userConstroller.getProfile)
router.put('/', userConstroller.updateProfile)
