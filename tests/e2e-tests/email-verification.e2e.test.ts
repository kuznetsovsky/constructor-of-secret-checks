import request from 'supertest'
import { app } from '../../source/app'
import { redis } from '../../source/connection'

describe('When a client sends a request to', () => {
  const VERIFICATION_URL = '/api/v1/email-verification'

  describe(`PUT: ${VERIFICATION_URL}`, () => {
    it('should return validation failed satatus', async () => {
      const response = await request(app).put(VERIFICATION_URL)
      expect(response.statusCode).toBe(422)
    })

    it('should be limited after 3 failed attempts', async () => {
      for (let i = 0; i < 3; i++) {
        const response = await request(app).put(VERIFICATION_URL)
          .send({
            email: 'd3d3LnRpbUBtYWlsLmNvbQ==',
            verification_code: ''
          })

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toMatch(/Invalid activation code or activation time has expired/i)
      }

      const response = await request(app)
        .put(VERIFICATION_URL)
        .send({
          email: 'd3d3LnRpbUBtYWlsLmNvbQ==',
          verification_code: ''
        })

      expect(response.statusCode).toBe(400)
      expect(response.body.message).toMatch(/Account activation attempts exceeded. Please try again in 15 minutes/i)
    })

    it('should successfully activated account', async () => {
      const code = 'VERIFICATION_CODE'
      await redis.set('email_verification:www.tim@mail.com', code)

      const response = await request(app).put(VERIFICATION_URL)
        .send({
          email: 'd3d3LnRpbUBtYWlsLmNvbQ==',
          verification_code: code
        })

      expect(response.statusCode).toBe(200)
      expect(response.body.message).toMatch(/Account activated successfully/i)
    })
  })
})
