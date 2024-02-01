import fs from 'node:fs/promises'
import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import sizeOf from 'image-size'
import mime from 'mime-types'
import sharp from 'sharp'
import { nanoid } from 'nanoid'
import { PATH_TO_LOGOS } from '../../config'

const IMAGE_WIDTH_SIZE = 512
const IMAGE_HEIGHT_SIZE = 512
const ONE_MEGABYTE = 1024 * 1024

const checkExtensionsAllowed = (type: string): boolean => {
  if (type === 'png' || type === 'jpg' || type === 'jpeg') {
    return true
  }

  return false
}

export const validateCompanyLogo = () =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.file != null) {
    // CHECK MIME TYPE
      const type = mime.extension(req.file.mimetype)

      if (type === false) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Unknown extension type.' })

        return
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (!checkExtensionsAllowed(type)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Only png, jpg and jpeg formats for the logo are allowed.' })

        return
      }

      // CHECK IMAGE SIZE
      if (req.file.size > ONE_MEGABYTE) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `The image should not exceed ${ONE_MEGABYTE} bytes.` })

        return
      }

      //  CHECK IMAGE DIMENSIONS
      const { buffer } = req.file
      if (buffer != null) {
        const dimensions = sizeOf(buffer)

        if (
          (dimensions.width != null && dimensions.width > IMAGE_WIDTH_SIZE) ||
          (dimensions.height != null && dimensions.height > IMAGE_HEIGHT_SIZE)
        ) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({
              message: `The logo dimensions should not exceed ${IMAGE_WIDTH_SIZE}px in width and ${IMAGE_HEIGHT_SIZE}px in height.`
            })

          return
        }
      }
    }

    next()
  }

export const createCompanyLogoImage = async (file: Express.Multer.File): Promise<string | undefined> => {
  try {
    const id = nanoid()
    const ext = mime.extension(file.mimetype)
    const filename = `${PATH_TO_LOGOS}/${id}.${ext}`

    await sharp(file.buffer)
      .toFile(`./${filename}`)

    return filename
  } catch (error) {
    console.error(error)
  }
}

export const removeCompanyLogoImage = async (name: string): Promise<void> => {
  try {
    await fs.rm(`./${name}`)
  } catch (error) {
    console.error(error)
  }
}
