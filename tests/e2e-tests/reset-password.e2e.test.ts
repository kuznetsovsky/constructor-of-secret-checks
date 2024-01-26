import request from 'supertest'

import { app } from '../../source/app'
import { redis } from '../../source/connection'
import { EXPIRES_IN_HOUR } from '../../config'

describe('When a client sends a request to', () => {
  const RESET_URL = '/api/v1/reset-password'

  describe(`POST: ${RESET_URL}`, () => {
    it('should return validation failed status', async () => {
      const response = await request(app).post(RESET_URL)
      expect(response.statusCode).toBe(422)
    })

    it('should return accepted status (email doesn\'t exist)', async () => {
      const response = await request(app).post(RESET_URL)
        .send({ email: 'www.ex@mple.com' })

      expect(response.statusCode).toBe(202)
    })

    it('should return accepted status (email exists)', async () => {
      const response = await request(app).post(RESET_URL)
        .send({ email: 'www.jhon@mail.com' })

      expect(response.statusCode).toBe(202)
    })
  })

  describe(`PUT: ${RESET_URL}`, () => {
    it('should return validation failed status', async () => {
      const response = await request(app).put(RESET_URL)
      expect(response.statusCode).toBe(422)
    })

    it('should return invalid token status', async () => {
      const response = await request(app).put(RESET_URL)
        .send({
          token: 'TOKEN_NAME',
          password: 'Password1234'
        })

      expect(response.statusCode).toBe(400)
    })

    it('should return password recovery attempts exceeded', async () => {
      const payload = {
        token: 'TOKEN_NAME',
        password: 'Password1234'
      }

      for (let i = 0; i < 3; i++) {
        await request(app).put(RESET_URL).send(payload)
      }

      const response = await request(app).put(RESET_URL).send(payload)

      expect(response.statusCode).toBe(400)
      expect(response.body.message).toMatch(/Reset password attempts exceeded. Repeat after 15 minutes/i)
    })

    it('should return no content status (successfully updated)', async () => {
      const userId = 1
      const token = 'USER_TOKEN'
      await redis.set(`recovery:${token}`, userId, 'EX', EXPIRES_IN_HOUR)

      const response = await request(app).put(RESET_URL)
        .send({
          token,
          password: 'Password1234'
        })

      expect(response.statusCode).toBe(204)
    })
  })
})
