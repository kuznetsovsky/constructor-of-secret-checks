import fs from 'node:fs/promises'

import multer from 'multer'
import { nanoid } from 'nanoid'
import sharp from 'sharp'
import mime from 'mime-types'

import { PATH_TO_LOGOS } from '../../../config'

export const uploadCompanyLogoImage = multer()

export const checkSupportedImageExtensions = (type: string): boolean => {
  if (type === 'png' || type === 'jpg' || type === 'jpeg') {
    return true
  }

  return false
}

const createCompanyLogoPath = (mimetype: string): string => {
  const id = nanoid()
  const ext = mime.extension(mimetype)
  const filename = `${PATH_TO_LOGOS}/${id}.${ext}`

  return filename
}

export const createCompanyLogoImage = async (file: Express.Multer.File): Promise<string | undefined> => {
  try {
    const path = createCompanyLogoPath(file.mimetype)

    await sharp(file.buffer)
      .toFile(`.${path}`)

    return path
  } catch (error) {
    console.error(error)
  }
}

export const removeCompanyLogoImage = async (path: string): Promise<boolean> => {
  try {
    const existsLogo = (await fs.stat(`.${path}`)).isFile()
    if (existsLogo) {
      await fs.rm(`.${path}`)
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
