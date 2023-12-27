import { createServer } from 'node:http'
import { app } from './app'
import * as cfg from '../config'

export const server = createServer(app)
  .listen(cfg.PORT, () => {
    console.info(`API started on http://${cfg.HOST}:${cfg.PORT}${cfg.VERSION}`)
  })
