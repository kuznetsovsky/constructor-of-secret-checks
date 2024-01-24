import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { type UpdateTemplate, type Template } from './templates.interface'
import { CompanyTemplatesRepository } from '../../common/repositories/company-templates.repository'
import { knex } from '../../connection'
import { CheckTypeRepository } from '../../common/repositories/company-check-types.repository'
import { type BaseQueryString } from '../../common/helpers/validate-queries/validate-queries.helper'

export const createCompanyTemplate = async (
  req: Request<any, any, Template>,
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

    const companyTeplatesRepository = new CompanyTemplatesRepository(knex, 'company_templates')
    const checkTypeRepository = new CheckTypeRepository(knex, 'check_types')

    const checkType = await checkTypeRepository.exist({
      company_id: cid,
      id: req.body.check_type_id
    })

    if (!checkType) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check type is not found.' })

      return
    }

    // TODO:
    // - Save Images and validation

    const createdTemplate = await companyTeplatesRepository.create({
      ...req.body,
      company_id: cid
    })

    const template = await companyTeplatesRepository.findOne(createdTemplate.id, [
      'id',
      'check_type_id',
      'task_name',
      'instruction',
      'tasks',
      'created_at',
      'updated_at'
    ])

    res
      .status(StatusCodes.CREATED)
      .header('Location', `/api/v1/companies/templates/${createdTemplate.id}`)
      .json(template)
  } catch (error) {
    next(error)
  }
}

export const getCompanyTemplates = async (
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

    const companyTemplateRepository = new CompanyTemplatesRepository(knex, 'company_templates')
    const templates = await companyTemplateRepository.findByPage(req.query, cid)

    res
      .status(StatusCodes.OK)
      .json({ templates })
  } catch (error) {
    next(error)
  }
}

export const getCompanyTemplate = async (
  req: Request<{ template_id: string }>,
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

    const TEMPLATE_ID = parseInt(req.params.template_id)

    const companyTemplateRepository = new CompanyTemplatesRepository(knex, 'company_templates')
    const template = await companyTemplateRepository.findByID(TEMPLATE_ID, cid)

    if (template == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Template is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(template)
  } catch (error) {
    next(error)
  }
}

export const updateCompanyTemplate = async (
  req: Request<{ template_id: string }, any, UpdateTemplate>,
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

    const TEMPLATE_ID = parseInt(req.params.template_id)
    const companyTeplatesRepository = new CompanyTemplatesRepository(knex, 'company_templates')
    const checkTypeRepository = new CheckTypeRepository(knex, 'check_types')

    const checkType = await checkTypeRepository.exist({
      company_id: cid,
      id: req.body.check_type_id
    })

    if (!checkType) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Check type is not found.' })

      return
    }

    const templateIsExist = await companyTeplatesRepository.exist({
      company_id: cid,
      id: TEMPLATE_ID
    })

    if (!templateIsExist) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Template is not found.' })

      return
    }

    await companyTeplatesRepository.update(TEMPLATE_ID, req.body)
    const template = await companyTeplatesRepository.findOne(TEMPLATE_ID, [
      'id',
      'check_type_id',
      'task_name',
      'instruction',
      'tasks',
      'created_at',
      'updated_at'
    ])

    res
      .status(StatusCodes.OK)
      .json(template)
  } catch (error) {
    next(error)
  }
}

export const deleteCompanyTemplate = async (
  req: Request<{ template_id: string }>,
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

    const TEMPLATE_ID = parseInt(req.params.template_id)
    const companyTemplateRepository = new CompanyTemplatesRepository(knex, 'company_templates')
    const template = await companyTemplateRepository.exist({
      id: TEMPLATE_ID,
      company_id: cid
    })

    if (!template) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Template is not found.' })

      return
    }

    await companyTemplateRepository.delete(TEMPLATE_ID)

    res
      .status(StatusCodes.NO_CONTENT)
      .end()
  } catch (error) {
    next(error)
  }
}

export const getCompanyTemplatePreview = async (
  req: Request<{ template_id: string }>,
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

    const TEMPLATE_ID = parseInt(req.params.template_id)
    const companyTemplateRepository = new CompanyTemplatesRepository(knex, 'company_templates')
    const template = await companyTemplateRepository.findPreviewByID(TEMPLATE_ID, cid)

    if (template == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Template is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(template)
  } catch (error) {
    next(error)
  }
}
