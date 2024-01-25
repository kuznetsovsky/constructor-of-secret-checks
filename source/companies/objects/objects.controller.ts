import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { type CompanyObject } from './objects.interface'
import { CompanyObjectsRepository } from '../../common/repositories/company-objects.repository'
import { CityRepository } from '../../common/repositories/city.repository'
import { type BaseQueryString } from '../../common/helpers/validate-queries/validate-queries.helper'

export async function createObject (
  req: Request<any, any, CompanyObject>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const cityRepository = new CityRepository(knex, 'cities')
    const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

    {
      const object = await companyObjectsRepository.findOne({ name: req.body.name })

      if (object !== undefined) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ message: 'This name already exists.' })

        return
      }
    }

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'City is not found.' })

      return
    }

    const createdObject = await companyObjectsRepository.create({ ...req.body, company_id: cid })
    const object = await companyObjectsRepository.findByID(cid, createdObject.id)

    res
      .status(StatusCodes.OK)
      .json(object)
  } catch (error) {
    next(error)
  }
}

export async function getObjects (
  req: Request<any, any, any, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')
    const objects = await companyObjectsRepository.findByPage(cid, req.query)

    if (objects == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'List is empty or wrong page.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(objects)
  } catch (error) {
    next(error)
  }
}

export async function getObject (
  req: Request<{ object_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const OBJECT_ID = parseInt(req.params.object_id)
    const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')
    const object = await companyObjectsRepository.findByID(cid, OBJECT_ID)

    if (object == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Object is not found.' })

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
  req: Request<{ object_id: string }, never, CompanyObject>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const OBJECT_ID = parseInt(req.params.object_id)
    const cityRepository = new CityRepository(knex, 'cities')
    const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

    {
      const object = await companyObjectsRepository.findOne({
        company_id: cid,
        id: OBJECT_ID
      })

      if (object == null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Object is not found.' })

        return
      }
    }

    {
      const object = await companyObjectsRepository.findOne({ name: req.body.name })

      if (object !== undefined) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ message: 'This name already exists' })

        return
      }
    }

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'City is not found.' })

      return
    }

    await companyObjectsRepository.update(OBJECT_ID, req.body)
    const object = await companyObjectsRepository.findByID(cid, OBJECT_ID)

    res
      .status(StatusCodes.OK)
      .json(object)
  } catch (error) {
    next(error)
  }
}

export async function deleteObject (
  req: Request<{ object_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.session.user
    if (user == null) {
      const error = new Error('"req.session.user" is missing.')
      next(error)
      return
    }

    const { cid } = user
    if (cid == null) {
      const error = new Error('"req.session.user.cid" is missing.')
      next(error)
      return
    }

    const OBJECT_ID = parseInt(req.params.object_id)
    const companyObjectsRepository = new CompanyObjectsRepository(knex, 'company_objects')

    const object = await companyObjectsRepository.findOne({
      company_id: cid,
      id: OBJECT_ID
    })

    if (object == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Object is not found.' })

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
