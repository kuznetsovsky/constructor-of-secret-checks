import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../connection'
import { type UpdateCompany } from './companies.interface'
import { CompanyRepository } from '../common/repositories/company.repository'
import { type BaseQueryString } from '../common/interfaces/query-string.interface'

export async function getCompanies (
  req: Request<never, never, never, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyRepository = new CompanyRepository(knex, 'companies')

  let page: number | undefined = parseInt(req.query.page)
  let perPage: number | undefined = parseInt(req.query.per_page)

  if (Number.isNaN(page)) {
    page = undefined
  }

  if (Number.isNaN(perPage)) {
    perPage = undefined
  }

  try {
    const companies = await companyRepository.findByPage(page, perPage, req.query.sort)

    res
      .status(StatusCodes.OK)
      .json({ companies })
  } catch (error) {
    next(error)
  }
}

export async function getCompanyByID (
  req: Request<{ company_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const COMPANY_ID = parseInt(req.params.company_id)

  if (Number.isNaN(COMPANY_ID) || COMPANY_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        error: 'Invalid request id parameter'
      })

    return
  }

  const companyRepository = new CompanyRepository(knex, 'companies')

  try {
    const company = await companyRepository.findProfileByID(COMPANY_ID)

    if (company == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Company is not found' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(company)
  } catch (error) {
    next(error)
  }
}

export async function updateCompanyByID (
  req: Request<{ company_id: string }, never, UpdateCompany>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const COMPANY_ID = parseInt(req.params.company_id)

  if (Number.isNaN(COMPANY_ID) || COMPANY_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        error: 'Invalid request id parameter'
      })

    return
  }

  const companyRepository = new CompanyRepository(knex, 'companies')

  try {
    {
      const company = await companyRepository.exist(COMPANY_ID)
      if (!company) return
    }

    await companyRepository.update(COMPANY_ID, {
      ...req.body,
      number_of_checks:
        req.body.number_of_checks === 0
          ? null
          : req.body.number_of_checks
    })

    const company = await companyRepository.findOne(COMPANY_ID, [
      'id',
      'name',
      'description',
      'website_link',
      'vk_link',
      'number_of_checks'
    ])

    if (company == null) return

    res
      .status(StatusCodes.OK)
      .json(company)
  } catch (error) {
    next(error)
  }
}
