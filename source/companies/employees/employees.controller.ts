import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { type UpdateEmployee, type CreateEmployee } from './employees.interface'
import { CityRepository } from '../../common/repositories/city.repository'
import { generatePassword } from '../../common/libs/generate-password.lib'
import { AccountRepository } from '../../common/repositories/account.repository'
import { CompanyEmployeesRepository } from '../../common/repositories/company-employees.repository'
import { renderEjsTemplate } from '../../common/libs/ejs.lib'
import { encryptPassword } from '../../auth/auth.helper'
import { sendMail } from '../../common/libs/nodemailer.lib'
import { NO_REPLAY_EMAIL } from '../../../config'
import { type BaseQueryString } from '../../common/interfaces/query-string.interface'

export async function createCompanyEmployee (
  req: Request<{ companyId: string }, never, CreateEmployee>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')
  const accountRepository = new AccountRepository(knex, 'accounts')
  const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

  const companyId = parseInt(req.params.companyId)

  if (Number.isNaN(companyId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'City is not found.' })

      return
    }

    const account = await accountRepository.exist({ email: req.body.email })

    if (account) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'This user already exists.' })

      return
    }

    const password = generatePassword()
    const email = req.body.email
    const title = 'Access for company manager'

    const templateString = await renderEjsTemplate('new-user', {
      title,
      password,
      login: email
    })

    if (templateString == null) {
      const error = new Error('Failed to create ejs template.')
      next(error)
      return
    }

    const isSuccessSendingMail = await sendMail(NO_REPLAY_EMAIL, email, title, templateString)

    if (!isSuccessSendingMail) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to send email.' })

      return
    }

    const encryptedPassword = encryptPassword(password)
    const createdEmployeeId = await companyEmployeeRepository.createEmployee({
      ...req.body,
      password: encryptedPassword,
      companyId
    })

    const employee = await companyEmployeeRepository.findProfile(createdEmployeeId)

    res
      .status(StatusCodes.CREATED)
      .json(employee)
  } catch (error) {
    next(error)
  }
}

export async function getCompanyEmployees (
  req: Request<{ companyId: string }, never, never, BaseQueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

  let page: number | undefined = parseInt(req.query.page)
  let perPage: number | undefined = parseInt(req.query.per_page)

  if (Number.isNaN(page)) {
    page = undefined
  }

  if (Number.isNaN(perPage)) {
    perPage = undefined
  }

  const companyId = parseInt(req.params.companyId)

  if (Number.isNaN(companyId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameters.' })

    return
  }

  try {
    const employees = await companyEmployeeRepository.findByPage(companyId, page, perPage, req.query.sort)

    res
      .status(StatusCodes.OK)
      .json({ employees })
  } catch (error) {
    next(error)
  }
}

export async function getCompanyEmployee (
  req: Request<{ companyId: string, employeeId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

  const companyId = parseInt(req.params.companyId)
  const employeeId = parseInt(req.params.employeeId)

  if (Number.isNaN(companyId) || Number.isNaN(employeeId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameters.' })

    return
  }

  try {
    const employee = await companyEmployeeRepository.findProfile(employeeId, companyId)

    if (employee == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Employee is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(employee)
  } catch (error) {
    next(error)
  }
}

export async function updateCompanyEmployee (
  req: Request<{ companyId: string, employeeId: string }, never, UpdateEmployee>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')
  const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

  const companyId = parseInt(req.params.companyId)
  const employeeId = parseInt(req.params.employeeId)

  if (Number.isNaN(companyId) || Number.isNaN(employeeId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    {
      const employee = await companyEmployeeRepository.exist({
        id: employeeId,
        company_id: companyId
      })

      if (!employee) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Employee is not found.' })

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

    await companyEmployeeRepository.updateEmployee(employeeId, companyId, req.body)
    const employee = await companyEmployeeRepository.findProfile(employeeId, companyId)

    res
      .status(StatusCodes.OK)
      .json(employee)
  } catch (error) {
    next(error)
  }
}

export async function deleteCompanyEmployee (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyEmployeeRepository = new CompanyEmployeesRepository(knex, 'company_employees')

  const companyId = parseInt(req.params.companyId)
  const employeeId = parseInt(req.params.employeeId)

  if (Number.isNaN(companyId) || Number.isNaN(employeeId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    const employee = await companyEmployeeRepository.exist({
      id: employeeId,
      company_id: companyId
    })

    if (!employee) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Employee is not found.' })

      return
    }

    const deletedCount = await companyEmployeeRepository.delete(employeeId)

    if (deletedCount !== 0) {
      res
        .status(StatusCodes.NO_CONTENT)
        .end()
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Failed to delete account.' })
    }
  } catch (error) {
    next(error)
  }
}
