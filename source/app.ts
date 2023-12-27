import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import morgan from 'morgan'
import { IS_DEV } from '../config'

export const app = express()
app.use(express.json())
app.use(morgan(IS_DEV ? 'dev' : 'combined'))

app.get('/', (req: Request, res: Response): void => {
  res.send({ message: 'API is working, change to version /api/v1' })
})

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.status(StatusCodes.NOT_FOUND).end()
})

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err)
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
})
