import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import mime from 'mime-types'
import sizeOf from 'image-size'

import { knex } from '../../connection'
import { CompanyLogoRepository } from '../../common/repositories/company-logo.repository'
import { MEDIA_TYPE_MULTIPART_FORM_DATA } from '../../../config'
import { checkSupportedImageExtensions, createCompanyLogoImage, removeCompanyLogoImage } from './logo.helper'

export const getCompanyLogo = async (
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

    const companyLogoRepository = new CompanyLogoRepository(knex, 'company_logos')

    const logo = await companyLogoRepository.findOne({ company_id: cid })
    if (logo == null) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Company logo is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(logo)
  } catch (error) {
    next(error)
  }
}

export const updateCompanyLogo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const IMAGE_SIZE = 400
  const ONE_MEGABYTE = 1024 * 1024

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

    if (req.is(MEDIA_TYPE_MULTIPART_FORM_DATA) !== MEDIA_TYPE_MULTIPART_FORM_DATA) {
      res
        .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
        .json({
          mesage: 'Unsupported Media Type. A Content-Type header with value "multipart/form-data" must be provided.'
        })

      return
    }

    if (req.file == null) {
      res.status(StatusCodes.NOT_MODIFIED).end()
      return
    }

    // Сheck for supported extensions
    const type = mime.extension(req.file.mimetype)
    if (type === false) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Unknown extension type.' })
      return
    }

    if (!checkSupportedImageExtensions(type)) {
      res.status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Only png, jpg and jpeg formats for the logo are allowed.' })

      return
    }

    // Сheck image size
    if (req.file.size > ONE_MEGABYTE) {
      res.status(StatusCodes.BAD_REQUEST)
        .json({ message: `The image should not exceed ${ONE_MEGABYTE} bytes.` })

      return
    }

    // Check image dimensions
    const { buffer } = req.file
    if (buffer != null) {
      const dimensions = sizeOf(buffer)

      if (
        (dimensions.width != null && dimensions.width > IMAGE_SIZE) ||
          (dimensions.height != null && dimensions.height > IMAGE_SIZE)
      ) {
        res.status(StatusCodes.BAD_REQUEST)
          .json({
            message: `The logo dimensions should not exceed ${IMAGE_SIZE}px in width and ${IMAGE_SIZE}px in height.`
          })

        return
      }
    }

    const companyLogoRepository = new CompanyLogoRepository(knex, 'company_logos')

    {
      const src = await createCompanyLogoImage(req.file)
      if (src == null) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Failed to save logo.' })

        return
      }

      const logo = await companyLogoRepository.findOne({ company_id: cid })
      if (logo == null) {
        await companyLogoRepository.create({ company_id: cid, src })
      } else {
        await removeCompanyLogoImage(logo.src)

        await companyLogoRepository.update(logo.id, {
          src,
          updated_at: knex.fn.now() as unknown as string
        })
      }
    }

    const logo = await companyLogoRepository.findOne({ company_id: cid })
    if (logo == null) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Company logo is not found.' })

      return
    }

    res
      .status(StatusCodes.OK)
      .json(logo)
  } catch (error) {
    next(error)
  }
}

export const deleteCompanyLogo = async (
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

    const companyLogoRepository = new CompanyLogoRepository(knex, 'company_logos')
    const logo = await companyLogoRepository.findOne({ company_id: cid })
    if (logo == null) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Company logo is not found.' })

      return
    }

    const removedLogoStatus = await removeCompanyLogoImage(logo.src)
    if (!removedLogoStatus) {
      res.status(StatusCodes.NOT_FOUND)
        .json({ message: 'Company logo is not found.' })

      return
    }

    await companyLogoRepository.delete(logo.id)
    res.status(StatusCodes.NO_CONTENT).end()
  } catch (error) {
    next(error)
  }
}
