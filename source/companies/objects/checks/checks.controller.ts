import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../../connection'
import { InspectorStatus, ObjectCheckStatus } from '../../../consts'
import { objectFilter } from '../../../common/helpers/object-filter.helper'
import type { CreateCompanyObjectCheck, UpdateCompanyObjectCheck } from './checks.interface'
import { CheckTypeRepository } from '../../../common/repositories/company-check-types.repository'
import { CompanyTemplatesRepository } from '../../../common/repositories/company-templates.repository'
import { CompanyInspectorRepository } from '../../../common/repositories/company-inspectors.repository'
import { type BaseQueryString } from '../../../common/helpers/validate-queries/validate-queries.helper'
import { CompanyObjectsRepository } from '../../../common/repositories/company-objects.repository'

import {
  type CompanyObjectCheck,
  CompanyObjectCheckRepository
} from '../../../common/repositories/company-object-checks.repository'

export async function createCompanyObjectCheck (
  req: Request<{ object_id: string }, any, CreateCompanyObjectCheck>,
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
    const companyObjectRepository = new CompanyObjectsRepository(knex, 'company_objects')
    const object = await companyObjectRepository.exist({
      id: OBJECT_ID,
      company_id: cid
    })

    if (!object) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Object is not found.' })

      return
    }

    const todayDate = new Date()
    const dateOfInspection = new Date(req.body.date)
    if (dateOfInspection <= todayDate) {
      res.status(StatusCodes.BAD_REQUEST)
        .json({ message: 'The date must be greater than today.' })

      return
    }

    const checkTypeRepository = new CheckTypeRepository(knex, 'check_types')
    const type = await checkTypeRepository.exist({
      id: req.body.check_type_id,
      company_id: cid
    })

    if (!type) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check type is not found.' })

      return
    }

    const companyTemplatesRepository = new CompanyTemplatesRepository(knex, 'company_templates')
    const template = await companyTemplatesRepository.exist({
      id: req.body.template_id,
      check_type_id: req.body.check_type_id,
      company_id: cid
    })

    if (!template) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Template not found or check type not suitable for template check.' })

      return
    }

    const INSPECTOR_ID = req.body.inspector_id
    if (INSPECTOR_ID !== 0) {
      const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')
      const inspector = await companyInspectorRepository.exist({
        id: req.body.inspector_id,
        status: InspectorStatus.Approved,
        company_id: cid
      })

      if (!inspector) {
        res.status(StatusCodes.NOT_FOUND)
          .json({ message: 'Inspector is not found.' })

        return
      }
    }

    const companyObjectCheckRepository = new CompanyObjectCheckRepository(knex, 'object_checks')
    const createdCheck = await companyObjectCheckRepository.create({
      company_id: cid,
      template_id: req.body.template_id,
      date_of_inspection: req.body.date,
      inspector_id: req.body.inspector_id ?? null,
      status: ObjectCheckStatus.Appointed,
      object_id: OBJECT_ID,
      // TODO: Create link
      link_url: '',
      check_type_id: req.body.check_type_id
    })

    const check = await companyObjectCheckRepository.findByID(createdCheck.id, OBJECT_ID, cid)
    if (check == null) {
      res.status(StatusCodes.NO_CONTENT).json({
        message: 'Failed to return data.'
      })

      return
    }

    res
      .status(StatusCodes.CREATED)
      .header('Location', `/api/v1/companies/object/${OBJECT_ID}/check/${createdCheck.id}`)
      .json(check)
  } catch (error) {
    next(error)
  }
}

export async function getCompanyObjectChecks (
  req: Request<{ object_id: string }, any, any, BaseQueryString>,
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
    const companyObjectRepository = new CompanyObjectsRepository(knex, 'company_objects')
    const object = await companyObjectRepository.exist({
      company_id: cid,
      id: OBJECT_ID
    })

    if (!object) {
      res.status(StatusCodes.FORBIDDEN)
        .json({ message: 'The object was not found or you do not have access to this object.' })

      return
    }

    const companyObjectChecksRepository = new CompanyObjectCheckRepository(knex, 'object_checks')
    const checks = await companyObjectChecksRepository.findByPage(cid, OBJECT_ID, req.query)

    if (checks == null) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'List is empty or wrong page.' })

      return
    }

    res.status(StatusCodes.OK).json(checks)
  } catch (error) {
    next(error)
  }
}

export async function getCompanyObjectCheck (
  req: Request<{ check_id: string, object_id: string }>,
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
    const CHECK_ID = parseInt(req.params.check_id)

    const companyObjectCheckRepository = new CompanyObjectCheckRepository(knex, 'object_checks')
    const check = await companyObjectCheckRepository.findByID(CHECK_ID, OBJECT_ID, cid)
    if (check == null) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check is not found.' })

      return
    }

    res.status(StatusCodes.OK).json(check)
  } catch (error) {
    next(error)
  }
}

export async function updateCompanyObjectCheck (
  req: Request<{ object_id: string, check_id: string }, any, UpdateCompanyObjectCheck>,
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

    const allowed = ['check_type_id', 'inspector_id', 'template_id']
    const fields: UpdateCompanyObjectCheck = objectFilter<UpdateCompanyObjectCheck>(req.body, (v, k) => allowed.includes(k))

    if (Object.keys(fields).length === 0) {
      res.status(StatusCodes.NOT_MODIFIED)
        .json({ message: 'Data has not been changed.' })

      return
    }

    const OBJECT_ID = parseInt(req.params.object_id)
    const CHECK_ID = parseInt(req.params.check_id)

    const companyObjectCheckRepository = new CompanyObjectCheckRepository(knex, 'object_checks')
    const check = await companyObjectCheckRepository.findOne({
      id: CHECK_ID,
      company_id: cid,
      object_id: OBJECT_ID
    }, ['check_type_id', 'template_id'])

    if (check == null) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check is not found.' })

      return
    }

    const companyTemplatesRepository = new CompanyTemplatesRepository(knex, 'company_templates')
    const checkTypeRepository = new CheckTypeRepository(knex, 'check_types')

    const updateData: Partial<Pick<CompanyObjectCheck, 'check_type_id' | 'inspector_id' | 'template_id'>> = {}

    if (fields.check_type_id != null) {
      const type = await checkTypeRepository.exist({
        id: fields.check_type_id,
        company_id: cid
      })

      if (!type) {
        res.status(StatusCodes.NOT_FOUND)
          .json({ message: 'Type is not found.' })

        return
      }

      Object.assign(updateData, { check_type_id: fields.check_type_id })
    }

    if (fields.template_id != null) {
      const template = await companyTemplatesRepository.exist({
        id: fields.template_id,
        company_id: cid
      })

      if (!template) {
        res.status(StatusCodes.NOT_FOUND)
          .json({ message: 'Task is not found.' })

        return
      }

      Object.assign(updateData, { template_id: fields.template_id })
    }

    if (fields.inspector_id != null) {
      const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

      if (fields.inspector_id !== 0) {
        const inspector = await companyInspectorRepository.exist({
          status: InspectorStatus.Approved,
          id: fields.inspector_id,
          company_id: cid
        })

        if (!inspector) {
          res.status(StatusCodes.NOT_FOUND)
            .json({ message: 'Inspector is not found.' })

          return
        }
      }

      Object.assign(updateData, { inspector_id: fields.inspector_id === 0 ? null : fields.inspector_id })
    }

    const template = await companyTemplatesRepository.exist({
      company_id: cid,
      check_type_id: fields.check_type_id ?? check.check_type_id,
      id: fields.template_id ?? check.template_id
    })

    if (!template) {
      res.status(StatusCodes.BAD_REQUEST)
        .json({ message: 'The check type is not suitable for the check template.' })

      return
    }

    Object.assign(updateData, { updated_at: knex.fn.now() })
    await companyObjectCheckRepository.update(CHECK_ID, updateData)

    const updatedCheck = await companyObjectCheckRepository.findByID(CHECK_ID, OBJECT_ID, cid)
    if (updatedCheck == null) {
      res.status(StatusCodes.NO_CONTENT).json({
        message: 'Failed to return data.'
      })

      return
    }

    res.status(StatusCodes.OK).json(updatedCheck)
  } catch (error) {
    next(error)
  }
}

export async function removeCompanyObjectCheck (
  req: Request<{ object_id: string, check_id: string }>,
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

    const CHECK_ID = parseInt(req.params.check_id)
    const companyObjectCheckRepository = new CompanyObjectCheckRepository(knex, 'object_checks')
    const check = await companyObjectCheckRepository.exist({
      id: CHECK_ID,
      company_id: cid,
      object_id: parseInt(req.params.object_id)
    })

    if (!check) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check is not found.' })

      return
    }

    const deletedItems = await companyObjectCheckRepository.delete(CHECK_ID)

    if (deletedItems === 0) {
      res.status(StatusCodes.NOT_MODIFIED)
        .json({ message: 'Failed to remove check.' })

      return
    }

    res.status(StatusCodes.NO_CONTENT).end()
  } catch (error) {
    next(error)
  }
}
