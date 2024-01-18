import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { type CompanyObject } from './objects.interface'
import { CompanyObjectsRepository } from '../../common/repositories/company-objects.repository'
import { CityRepository } from '../../common/repositories/city.repository'
import { type BaseQueryString } from '../../common/helpers/validate-queries/validate-queries.helper'

export async function createObject (
  req: Request<{ company_id: string }, never, CompanyObject>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const COMPANY_ID = parseInt(req.params.company_id)

  if (Number.isNaN(COMPANY_ID) || COMPANY_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request id parameter.' })

    return
  }

  const cityRepository = new CityRepository(knex, 'cities')
  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  try {
    {
      const object = await companyObjectsRepository.findOne({ name: req.body.name })

      if (object !== undefined) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ error: 'This name already exists' })

        return
      }
    }

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'City is not found.' })

      return
    }

    const createdObject = await companyObjectsRepository.create({ ...req.body, company_id: COMPANY_ID })
    const object = await companyObjectsRepository.findByID(COMPANY_ID, createdObject.id)

    res
      .status(StatusCodes.OK)
      .json(object)
  } catch (error) {
    next(error)
  }
}

export async function getObjects (
  req: Request<{ company_id: string }, never, never, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const COMPANY_ID = parseInt(req.params.company_id)

  if (Number.isNaN(COMPANY_ID) || COMPANY_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request id parameter.' })

    return
  }

  try {
    const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')
    const objects = await companyObjectsRepository.findByPage(COMPANY_ID, req.query)

    res
      .status(StatusCodes.OK)
      .json({ objects })
  } catch (error) {
    next(error)
  }
}

export async function getObject (
  req: Request<{ company_id: string, object_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const COMPANY_ID = parseInt(req.params.company_id)
  const OBJECT_ID = parseInt(req.params.object_id)

  if (Number.isNaN(COMPANY_ID) || Number.isNaN(OBJECT_ID) || COMPANY_ID < 1 || OBJECT_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameters.' })

    return
  }

  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  try {
    const object = await companyObjectsRepository.findByID(COMPANY_ID, OBJECT_ID)

    if (object == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Object is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(object)
  } catch (error) {
    next(error)
  }
}

export async function updateObject (
  req: Request<{ company_id: string, object_id: string }, never, CompanyObject>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const COMPANY_ID = parseInt(req.params.company_id)
  const OBJECT_ID = parseInt(req.params.object_id)

  if (Number.isNaN(COMPANY_ID) || Number.isNaN(OBJECT_ID) || COMPANY_ID < 1 || OBJECT_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameters.' })

    return
  }

  const cityRepository = new CityRepository(knex, 'cities')
  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  try {
    {
      const object = await companyObjectsRepository.findOne({
        company_id: COMPANY_ID,
        id: OBJECT_ID
      })

      if (object == null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Object is not found.' })

        return
      }
    }

    {
      const object = await companyObjectsRepository.findOne({ name: req.body.name })

      if (object !== undefined) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ error: 'This name already exists' })

        return
      }
    }

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'City is not found.' })

      return
    }

    await companyObjectsRepository.update(OBJECT_ID, req.body)
    const object = await companyObjectsRepository.findByID(COMPANY_ID, OBJECT_ID)

    res
      .status(StatusCodes.OK)
      .json(object)
  } catch (error) {
    next(error)
  }
}

export async function deleteObject (
  req: Request<{ company_id: string, object_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const COMPANY_ID = parseInt(req.params.company_id)
  const OBJECT_ID = parseInt(req.params.object_id)

  if (Number.isNaN(COMPANY_ID) || Number.isNaN(OBJECT_ID) || COMPANY_ID < 1 || OBJECT_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameters.' })

    return
  }

  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  try {
    const object = await companyObjectsRepository.findOne({
      company_id: COMPANY_ID,
      id: OBJECT_ID
    })

    if (object == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Object is not found.' })

      return
    }

    await companyObjectsRepository.delete(object.id)

    res
      .status(StatusCodes.NO_CONTENT)
      .end()
  } catch (error) {
    next(error)
  }
}
