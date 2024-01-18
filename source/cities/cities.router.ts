import express from 'express'

import * as citiesController from './cities.controller'
import { validateQueries } from '../common/helpers/validate-queries/validate-queries.helper'

export const router = express.Router()

router.get(
  '/',
  validateQueries(),
  citiesController.getCities
)

router.get(
  '/:city_id',
  citiesController.getCityByID
)
