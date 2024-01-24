import request from 'supertest'
import { app } from '../../source/app'
import { redis } from '../../source/connection'

describe('Reset password endpoints:', () => {
  const RESET_URL = '/api/v1/reset-password'

  describe('POST: /reset-password', () => {
    it('should return validation failed status', async () => {
      const response = await request(app)
        .post(RESET_URL)

      expect(response.statusCode).toBe(422)
    })

    it('should return accepted status (does not exist)', async () => {
      const response = await request(app)
        .post(RESET_URL)
        .send({ email: 'www.ex@mple.com' })

      expect(response.statusCode).toBe(202)
    })

    it('should return accepted status (exists)', async () => {
      const response = await request(app)
        .post(RESET_URL)
        .send({ email: 'www.jhon@mail.com' })

      expect(response.statusCode).toBe(202)
    })
  })

  describe('PUT: /reset-password', () => {
    it('should return validation failed status', async () => {
      const response = await request(app)
        .put(RESET_URL)

      expect(response.statusCode).toBe(422)
    })

    it('should return invalid token status', async () => {
      const response = await request(app)
        .put(RESET_URL)
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

      await request(app).put(RESET_URL).send(payload)
      await request(app).put(RESET_URL).send(payload)
      await request(app).put(RESET_URL).send(payload)
      const response = await request(app).put(RESET_URL).send(payload)

      expect(response.statusCode).toBe(400)
      expect(response.body.message).toMatch(/Reset password attempts exceeded. Repeat after 15 minutes/i)
    })

    it('should return no content status', async () => {
      const userId = 1
      const token = 'USER_TOKEN'
      await redis.set(`recovery:${token}`, userId, 'EX', 60 * 60)

      const response = await request(app)
        .put(RESET_URL)
        .send({
          token,
          password: 'Password1234'
        })

      expect(response.statusCode).toBe(204)
    })
  })
})
