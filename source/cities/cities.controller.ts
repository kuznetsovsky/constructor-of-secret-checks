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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')

  let ID = parseInt(req.params.id)

  if (Number.isNaN(ID)) {
    ID = 0
  }

  try {
    const city = await cityRepository.findOne(ID)

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
