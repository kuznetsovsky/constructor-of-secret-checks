import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { type CompanyObject } from './objects.interface'
import { CompanyObjectsRepository } from '../../common/repositories/company-objects.repository'
import { type BaseQueryString } from '../../common/interfaces/query-string.interface'
import { CityRepository } from '../../common/repositories/city.repository'

export async function createObject (
  req: Request<{ companyId: string }, never, CompanyObject>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')
  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  const companyId = parseInt(req.params.companyId)

  if (Number.isNaN(companyId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

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

    const createdObject = await companyObjectsRepository.create({ ...req.body, company_id: companyId })
    const object = await companyObjectsRepository.findByID(companyId, createdObject.id)

    res
      .status(StatusCodes.OK)
      .json(object)
  } catch (error) {
    next(error)
  }
}

export async function getObjects (
  req: Request<{ companyId: string }, never, never, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  let page: number | undefined = parseInt(req.query.page)
  let perPage: number | undefined = parseInt(req.query.per_page)

  if (Number.isNaN(page)) {
    page = undefined
  }

  if (Number.isNaN(perPage)) {
    perPage = undefined
  }

  let companyId = parseInt(req.params.companyId)

  if (Number.isNaN(companyId)) {
    companyId = 0
  }

  try {
    const objects = await companyObjectsRepository.findByPage(companyId, page, perPage, req.query.sort)

    res
      .status(StatusCodes.OK)
      .json({ objects })
  } catch (error) {
    next(error)
  }
}

export async function getObject (
  req: Request<{ companyId: string, objectId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  const companyId = parseInt(req.params.companyId)
  const objectId = parseInt(req.params.objectId)

  if (Number.isNaN(companyId) || Number.isNaN(objectId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameters.' })

    return
  }

  try {
    const object = await companyObjectsRepository.findByID(companyId, objectId)

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
  req: Request<{ companyId: string, objectId: string }, never, CompanyObject>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')
  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  const companyId = parseInt(req.params.companyId)
  const objectId = parseInt(req.params.objectId)

  if (Number.isNaN(companyId) || Number.isNaN(objectId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameters.' })

    return
  }

  try {
    {
      const object = await companyObjectsRepository.findOne({
        company_id: companyId,
        id: objectId
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

    await companyObjectsRepository.update(objectId, req.body)
    const object = await companyObjectsRepository.findByID(companyId, objectId)

    res
      .status(StatusCodes.OK)
      .json(object)
  } catch (error) {
    next(error)
  }
}

export async function deleteObject (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

  const companyId = parseInt(req.params.companyId)
  const objectId = parseInt(req.params.objectId)

  if (Number.isNaN(companyId) || Number.isNaN(objectId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameters.' })

    return
  }

  try {
    const object = await companyObjectsRepository.findOne({
      company_id: companyId,
      id: objectId
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
