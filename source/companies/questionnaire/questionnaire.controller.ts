import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { knex } from '../../connection'
import { type UpdateQuestionnaire } from './questionnaire.interface'
import { QuestionnaireRepository } from '../../common/repositories/questionnaires.repository'
import { CompanyRepository } from '../../common/repositories/company.repository'

export async function getQuestionnaire (
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

  const questionnaireRepository = new QuestionnaireRepository(knex, 'company_questionnaires')
  const companyRepository = new CompanyRepository(knex, 'companies')

  try {
    const company = await companyRepository.findOne(COMPANY_ID, ['questionnaire_id'])

    if (company == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Company is not found' })

      return
    }

    const questionnaire = await questionnaireRepository.findOne(company.questionnaire_id)

    if (questionnaire == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Questionnaire is not found' })

      return
    }

    delete (questionnaire as any).link
    res
      .status(StatusCodes.OK)
      .json(questionnaire)
  } catch (error) {
    next(error)
  }
}

export async function updateQuestionnaire (
  req: Request<{ company_id: string }, never, UpdateQuestionnaire>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const questionnaireRepository = new QuestionnaireRepository(knex, 'company_questionnaires')
  const companyRepository = new CompanyRepository(knex, 'companies')

  const COMPANY_ID = parseInt(req.params.company_id)

  if (Number.isNaN(COMPANY_ID) || COMPANY_ID < 1) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid request id parameter.' })

    return
  }

  try {
    const company = await companyRepository.findOne(COMPANY_ID, ['questionnaire_id'])

    if (company == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Company is not found' })

      return
    }

    await questionnaireRepository.update(company.questionnaire_id, req.body)
    const questionnaire = await questionnaireRepository.findOne(company.questionnaire_id)

    if (questionnaire == null) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Questionnaire is not found' })

      return
    }

    delete (questionnaire as any).link
    res
      .status(StatusCodes.OK)
      .json(questionnaire)
  } catch (error) {
    next(error)
  }
}
