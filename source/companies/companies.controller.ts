import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../connection'
import { type UpdateCompany } from './companies.interface'
import { CompanyRepository } from '../common/repositories/company.repository'
import { type BaseQueryString } from '../common/helpers/validate-queries/validate-queries.helper'

export async function getCompanies (
  req: Request<never, never, never, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const companyRepository = new CompanyRepository(knex, 'companies')
    const companies = await companyRepository.findByPage(req.query)

    if (companies == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'List is empty or wrong page.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(companies)
  } catch (error) {
    next(error)
  }
}

export async function getCompanyByID (
  req: Request<{ company_id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const COMPANY_ID = parseInt(req.params.company_id)
    const companyRepository = new CompanyRepository(knex, 'companies')
    const company = await companyRepository.findProfileByID(COMPANY_ID)

    if (company == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Company is not found.' })

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

    const COMPANY_ID = parseInt(req.params.company_id)
    if (cid !== COMPANY_ID) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'No access.' })

      return
    }

    const companyRepository = new CompanyRepository(knex, 'companies')

    {
      const company = await companyRepository.findOne(cid)
      if (company == null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Company is not found.' })

        return
      }

      await companyRepository.update(cid, {
        ...req.body,
        updated_at: knex.fn.now() as unknown as string
      })
    }

    const company = await companyRepository.findOne(COMPANY_ID, [
      'id',
      'name',
      'description',
      'website_link',
      'vk_link',
      'number_of_checks'
    ])

    if (company == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Company is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(company)
  } catch (error) {
    next(error)
  }
}
