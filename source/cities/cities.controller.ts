import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../connection'
import { CityRepository } from '../common/repositories/city.repository'
import { type BaseQueryString } from '../common/helpers/validate-queries/validate-queries.helper'

export async function getCities (
  req: Request<any, any, any, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cityRepository = new CityRepository(knex, 'cities')
    const cities = await cityRepository.findByPage(req.query)

    if (cities == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'List is empty or wrong page.' })

      return
    }

    res.status(StatusCodes.OK).json(cities)
  } catch (error) {
    next(error)
  }
}

export async function getCityByID (
  req: Request<{ city_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const CITY_ID = parseInt(req.params.city_id)
    const cityRepository = new CityRepository(knex, 'cities')
    const city = await cityRepository.findOne(CITY_ID)

    if (city == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'City is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(city)
  } catch (error) {
    next(error)
  }
}
