import express from 'express'
import * as citiesConstroller from './cities.controller'

export const router = express.Router()

router.get('/', citiesConstroller.getCities)
router.get('/:id', citiesConstroller.getCityByID)
