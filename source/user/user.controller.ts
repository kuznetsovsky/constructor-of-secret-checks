import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Roles } from '../consts'
import { knex } from '../connection'
import { findProfileByID } from '../common/helpers/find-profile-by-id.helper'
import { CityRepository } from '../common/repositories/city.repository'
import { InspectorRepository } from '../common/repositories/inspector.repository'
import { AdminsitratorRepository } from '../common/repositories/administrator.repository'
import type { Profile } from './user.interface'

import {
  adminProfileValidator,
  inspectorProfileValidator
} from './user.validator'

export async function getProfile (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const id = req.session.user?.id

  if (id == null) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({
        error: 'User ID is not found'
      })

    return
  }

  try {
    const profile = await findProfileByID(id)

    res
      .status(StatusCodes.OK)
      .json(profile)
  } catch (error) {
    next(error)
  }
}

export async function updateProfile (
  req: Request<never, never, Profile>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')
  const inspectorRepository = new InspectorRepository(knex, 'inspectors')
  const administratorRepository = new AdminsitratorRepository(knex, 'company_contact_persons')

  const id = req.session.user?.id
  const role = req.session.user?.role

  if (id == null || role == null) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        error: 'role or id account is invalid'
      })

    return
  }

  try {
    if (role === Roles.Administrator) {
      if (!adminProfileValidator(req.body)) {
        res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .json({
            message: 'Validation failed',
            errors: adminProfileValidator.errors
          })

        return
      }

      await administratorRepository.updateProfileByID(id, req.body)
      const profile = await findProfileByID(id, 'administrator')

      res
        .status(StatusCodes.OK)
        .json(profile)
    }

    if (role === Roles.Inspector) {
      if (!inspectorProfileValidator(req.body)) {
        res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .json({
            message: 'Validation failed',
            errors: inspectorProfileValidator.errors
          })

        return
      }

      const city = await cityRepository.findOne(req.body.city_id)

      if (city == null) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: `City with ID ${req.body.city_id} not found` })

        return
      }

      await inspectorRepository.updateProfileByID(id, req.body)
      const profile = await findProfileByID(id, 'inspector')

      res
        .status(StatusCodes.OK)
        .json(profile)
    }
  } catch (error) {
    next(error)
  }
}
