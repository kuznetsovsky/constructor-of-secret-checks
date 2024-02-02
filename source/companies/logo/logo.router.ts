import express from 'express'

import * as logoController from './logo.controller'
import { uploadCompanyLogoImage } from './logo.helper'

export const router = express.Router()

router.get(
  '/',
  logoController.getCompanyLogo
)

router.put(
  '/',
  uploadCompanyLogoImage.single('logo'),
  logoController.updateCompanyLogo
)

router.delete(
  '/',
  logoController.deleteCompanyLogo
)
