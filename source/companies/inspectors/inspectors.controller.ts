import { type Request, type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { NO_REPLAY_EMAIL } from '../../../config'
import { InspectorStatus, Roles } from '../../consts'
import { encryptPassword } from '../../auth/auth.helper'
import { sendMail } from '../../common/libs/nodemailer.lib'
import { renderEjsTemplate } from '../../common/libs/ejs.lib'
import { PhoneRepository } from '../../common/repositories/phone.repository'
import { generatePassword } from '../../common/libs/generate-password.lib'
import { CityRepository } from '../../common/repositories/city.repository'
import { AccountRepository } from '../../common/repositories/account.repository'
import { CompanyInspectorRepository } from '../../common/repositories/company-inspectors.repository'
import { InspectorRepository } from '../../common/repositories/inspector.repository'

import type {
  QueryString,
  CreateCompanyInspector,
  UpdateCompanyInspector,
  ChangeCompanyInspectorStatus
} from './inspectors.interface'

export async function createNewCompanyInspector (
  req: Request<{ companyId: string }, never, CreateCompanyInspector>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')
  const accountRepository = new AccountRepository(knex, 'accounts')
  const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

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
        .json({ error: 'City is not found' })

      return
    }

    const inspector = await accountRepository.findOne({ email: req.body.email })

    if (inspector != null) {
      res
        .status(StatusCodes.CONFLICT)
        .json({
          error: 'An inspector with the same email already exists',
          error_description: 'For existing inspectors, use the POST: /companies/{companyId}/inspectors/{email} route'
        })

      return
    }

    const password = generatePassword()

    const email = req.body.email
    const title = 'Invitation to become a secret inspector'

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
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Failed to send email.' })

      return
    }

    const encryptedPassword = encryptPassword(password)
    const id = await companyInspectorRepository.createNewInspector({
      ...req.body,
      password: encryptedPassword,
      companyId
    })

    const createdInspector = await companyInspectorRepository.findCompanyInspectorByID(
      companyId,
      id
    )

    res
      .status(StatusCodes.CREATED)
      .header('Location', `/companies/${companyId}/inspectors/${id}`)
      .json(createdInspector)
  } catch (error) {
    next(error)
  }
}

export async function getCompanyInspectors (
  req: Request<{ companyId: string }, never, never, QueryString>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')
  const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

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
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    let cityId: number | null = null

    if (req.query.city !== undefined) {
      const city = await cityRepository.findOne({ name: req.query.city })

      if (city == null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'City is not found' })

        return
      }

      cityId = city.id
    }

    const inspectors = await companyInspectorRepository.findByPage(companyId, page, perPage, req.query.sort, {
      ...req.query,
      city: cityId
    })

    res
      .status(StatusCodes.OK)
      .json({ inspectors })
  } catch (error) {
    next(error)
  }
}

export async function getCompanyInspector (
  req: Request<{ companyId: string, inspectorId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

  const companyId = parseInt(req.params.companyId)
  const inspectorId = parseInt(req.params.inspectorId)

  if (Number.isNaN(companyId) || Number.isNaN(inspectorId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    const inspector = await companyInspectorRepository.findCompanyInspectorByID(
      companyId,
      inspectorId
    )

    if (inspector == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Inspector is not found' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(inspector)
  } catch (error) {
    next(error)
  }
}

export async function updateCompanyInspector (
  req: Request<{ companyId: string, inspectorId: string }, never, UpdateCompanyInspector>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cityRepository = new CityRepository(knex, 'cities')
  const phoneRepository = new PhoneRepository(knex, 'phone_numbers')
  const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

  const companyId = parseInt(req.params.companyId)
  const inspectorId = parseInt(req.params.inspectorId)

  if (Number.isNaN(companyId) || Number.isNaN(inspectorId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    const inspector = await companyInspectorRepository.findOne({
      company_id: companyId,
      id: inspectorId
    })

    if (inspector == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Inspector is not found.' })

      return
    }

    const city = await cityRepository.exist(req.body.city_id)

    if (!city) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'City is not found' })

      return
    }

    await phoneRepository.update(inspector.phone_number_id, {
      phone_number: req.body.phone_number
    })

    delete (req.body as any).phone_number
    await companyInspectorRepository.update(inspectorId, req.body)

    const companyInspector = await companyInspectorRepository.findCompanyInspectorByID(
      companyId,
      inspectorId
    )

    res
      .status(StatusCodes.OK)
      .json(companyInspector)
  } catch (error) {
    next(error)
  }
}

export async function updateCompanyInspectorStatus (
  req: Request<{ companyId: string, inspectorId: string }, never, ChangeCompanyInspectorStatus>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

  const companyId = parseInt(req.params.companyId)
  const inspectorId = parseInt(req.params.inspectorId)

  if (Number.isNaN(companyId) || Number.isNaN(inspectorId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    const inspector = await companyInspectorRepository.findOne({
      company_id: companyId,
      id: inspectorId
    })

    if (inspector == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Inspector is not found.' })

      return
    }

    if (inspector.status === req.body.status) {
      res
        .status(StatusCodes.NOT_MODIFIED)
        .end()

      return
    }

    res
      .status(StatusCodes.OK)
      .json({ message: 'Status updated successfully' })
  } catch (error) {
    next(error)
  }
}

export async function deleteCompanyInspector (
  req: Request<{ companyId: string, inspectorId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')

  const companyId = parseInt(req.params.companyId)
  const inspectorId = parseInt(req.params.inspectorId)

  if (Number.isNaN(companyId) || Number.isNaN(inspectorId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    const inspector = await companyInspectorRepository.findCompanyInspectorByID(
      companyId,
      inspectorId
    )

    if (inspector == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Inspector is not found.' })

      return
    }

    res
      .status(StatusCodes.NO_CONTENT)
      .end()
  } catch (error) {
    next(error)
  }
}

export async function getCompanyInspectorByEmail (
  req: Request<{ companyId: string, email: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accountRepository = new AccountRepository(knex, 'accounts')

  const companyId = parseInt(req.params.companyId)
  const email = req.params.email

  if (Number.isNaN(companyId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    const inspector = await accountRepository.exist({ email })

    if (inspector) {
      res
        .status(StatusCodes.OK)
        .end()
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .end()
    }
  } catch (error) {
    next(error)
  }
}

export async function createCompanyInspectorByEmail (
  req: Request<{ companyId: string, email: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const companyInspectorRepository = new CompanyInspectorRepository(knex, 'company_inspectors')
  const inspectorRepository = new InspectorRepository(knex, 'inspectors')
  const accountRepository = new AccountRepository(knex, 'accounts')

  const companyId = parseInt(req.params.companyId)
  const email = req.params.email

  if (Number.isNaN(companyId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request parameter.' })

    return
  }

  try {
    const account = await accountRepository.findOne({ email })

    if (account != null) {
      if (account.role !== Roles.Inspector) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'This user cannot be designated as an inspector.' })

        return
      }

      const inspector = await inspectorRepository.findOne(account.id)

      if (inspector == null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Inspector is not found.' })

        return
      }

      await companyInspectorRepository.create({
        account_id: account.id,
        company_id: companyId,
        city_id: inspector.city_id ?? undefined,
        inspector_id: inspector.id,
        phone_number_id: inspector.phone_number_id ?? undefined,
        email: account.email,
        status: InspectorStatus.Verification,
        address: inspector.address,
        birthday: inspector.birthday,
        first_name: inspector.first_name ?? undefined,
        last_name: inspector.last_name ?? undefined
      })

      res
        .status(StatusCodes.OK)
        .end()
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Inspector is not found.' })
    }
  } catch (error) {
    next(error)
  }
}
