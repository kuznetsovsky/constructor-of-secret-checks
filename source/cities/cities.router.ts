import express from 'express'

import * as citiesController from './cities.controller'
import { validateQueries } from '../common/helpers/validate-queries/validate-queries.helper'
import { validateParams } from '../common/helpers/validate-params.helper'
import { citiesParamsValidator } from './cities.validator'

export const router = express.Router()

router.get(
  '/',
  validateQueries(),
  citiesController.getCities
)

router.get(
  '/:city_id',
  validateParams(citiesParamsValidator),
  citiesController.getCityByID
)
