import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { CheckTypeRepository } from '../../common/repositories/company-check-types.repository'
import { type UpdateCheckType } from './check-types.interface'
import { type BaseQueryString } from '../../common/helpers/validate-queries/validate-queries.helper'

export const createCheckType = async (
  req: Request<any, any, UpdateCheckType>,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const { name } = req.body
    const checkTypeRepository = new CheckTypeRepository(knex, 'check_types')
    const type = await checkTypeRepository.exist({
      company_id: cid,
      name
    })

    if (type) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: 'Check type already exists.' })

      return
    }

    const createdCheckType = await checkTypeRepository.create({
      company_id: cid,
      name
    })

    const checkType = await checkTypeRepository.findOne(createdCheckType.id)

    if (checkType == null) {
      const error = new Error('"checkType" is undefined.')
      next(error)
      return
    }

    res
      .status(StatusCodes.CREATED)
      .header('Location', `/api/v1/companies/check-types/${createdCheckType.id}`)
      .json(checkType)
  } catch (error) {
    next(error)
  }
}

export const getCheckTypes = async (
  req: Request<any, any, any, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const checkTypeRepository = new CheckTypeRepository(knex, 'check_types')
    const types = await checkTypeRepository.findByPage(req.query, cid)

    res
      .status(StatusCodes.OK)
      .json({ types })
  } catch (error) {
    next(error)
  }
}

export const getCheckTypeByID = async (
  req: Request<{ check_type_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const companyCheckTypeId = req.params.check_type_id
    const companyCheckTypesRepository = new CheckTypeRepository(knex, 'check_types')
    const checkType = await companyCheckTypesRepository.findOne({
      company_id: cid,
      id: parseInt(companyCheckTypeId)
    }, [
      'id',
      'name',
      'created_at',
      'updated_at'
    ])

    if (checkType == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check type is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(checkType)
  } catch (error) {
    next(error)
  }
}

export const updateCheckTypeByID = async (
  req: Request<{ check_type_id: string }, any, UpdateCheckType>,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const { name } = req.body
    const checkTypeID = parseInt(req.params.check_type_id)
    const checkTypeRepository = new CheckTypeRepository(knex, 'check_types')
    const type = await checkTypeRepository.exist({
      id: checkTypeID,
      company_id: cid
    })

    if (!type) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check type not found.' })

      return
    }

    const updatedCheckType = await checkTypeRepository.update(checkTypeID, { name })

    if (updatedCheckType == null) {
      const error = new Error('"updatedCheckType" is undefined.')
      next(error)
      return
    }

    res
      .status(StatusCodes.OK)
      .json(updatedCheckType)
  } catch (error) {
    next(error)
  }
}

export const deleteCheckTypeByID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const companyCheckTypeId = req.params.check_type_id
    const companyCheckTypesRepository = new CheckTypeRepository(knex, 'check_types')

    const existCheckType = await companyCheckTypesRepository.exist({
      id: parseInt(companyCheckTypeId),
      company_id: cid
    })

    if (!existCheckType) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check type is not found.' })

      return
    }

    await companyCheckTypesRepository.delete(parseInt(companyCheckTypeId))

    res
      .status(StatusCodes.NO_CONTENT)
      .end()
  } catch (error) {
    next(error)
  }
}
