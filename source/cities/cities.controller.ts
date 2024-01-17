import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { type BaseQueryString } from '../common/interfaces/query-string.interface'
import { CityRepository } from '../common/repositories/city.repository'
import { knex } from '../connection'

export async function getCities (
  req: Request<never, never, never, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')

  let page: number | undefined = parseInt(req.query.page)
  let perPage: number | undefined = parseInt(req.query.per_page)

  if (Number.isNaN(page)) {
    page = undefined
  }

  if (Number.isNaN(perPage)) {
    perPage = undefined
  }

  try {
    const cities = await cityRepository.findByPage(page, perPage, req.query.sort)

    res
      .status(StatusCodes.OK)
      .json({ cities })
  } catch (error) {
    next(error)
  }
}

export async function getCityByID (
  req: Request<{ city_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const CITY_ID = parseInt(req.params.city_id)

  if (Number.isNaN(CITY_ID) || CITY_ID < 1) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'City is not found.' })

    return
  }

  const cityRepository = new CityRepository(knex, 'cities')

  try {
    const city = await cityRepository.findOne(CITY_ID)

    if (city == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'City is not found' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(city)
  } catch (error) {
    next(error)
  }
}
