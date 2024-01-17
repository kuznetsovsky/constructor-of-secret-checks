import express from 'express'
import * as citiesController from './cities.controller'

export const router = express.Router()

router.get('/', citiesController.getCities)
router.get('/:city_id', citiesController.getCityByID)
